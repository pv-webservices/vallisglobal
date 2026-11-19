// Enquiry handler core: validation, spam checks, rate limiting and email composition.
// Kept free of Vercel/nodemailer specifics so it can be unit-tested with a mocked transport.

export const LIMITS = {
  name: [2, 100],
  email: [5, 150],
  phoneDigits: [10, 15],
  message: [10, 2500],
  company: [0, 150],
  category: [0, 80],
  product: [0, 250],
  catalogue: [0, 200],
  page: [0, 500],
};
export const MIN_FILL_MS = 3000;
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
export const THANK_YOU_PATH = '/thank-you/';
export const SITE_NAME = 'VALLIS Website';
export const TIME_ZONE = 'Asia/Kolkata';

const FORM_TYPES = { enquiry: 'Product enquiry', catalogue: 'Catalogue download' };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const SPAM_WORDS = /\b(viagra|casino|crypto|bitcoin|forex|loan offer|seo services?|backlinks?|porn|escort|betting|web ?design services?)\b|https?:\/\/\S+\.(ru|cn|xyz|top)\b/i;
const DEFAULT_ORIGINS = ['https://www.vallisglobal.in', 'https://vallisglobal.in'];
const ORIGIN_PATTERNS = [/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/, /^https:\/\/vallisglobal[a-z0-9-]*\.vercel\.app$/];

/** Removes CR/LF and other control characters so a value is safe in an email header. */
export const headerSafe = (value) => String(value ?? '').replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').trim();

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const text = (value) => (typeof value === 'string' ? value.trim() : Array.isArray(value) ? text(value[0]) : '');
const isTrue = (value) => ['on', 'true', 'yes', '1'].includes(String(Array.isArray(value) ? value[0] : value ?? '').toLowerCase()) || value === true;

/** Parses the request body (already-parsed object, JSON string or urlencoded string). */
export function parseBody(body, contentType = '') {
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body;
  const raw = Buffer.isBuffer(body) ? body.toString('utf8') : String(body ?? '');
  if (!raw) return {};
  if (contentType.includes('application/json')) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

/** Normalises and validates the submitted fields. Returns { data, errors }. */
export function validate(input) {
  const formType = text(input.formType) === 'catalogue' ? 'catalogue' : 'enquiry';
  const data = {
    formType,
    name: headerSafe(text(input.name)),
    email: headerSafe(text(input.email)).toLowerCase(),
    phone: text(input.phone),
    company: text(input.company),
    category: text(input.category),
    product: text(input.product),
    catalogue: text(input.catalogue),
    message: text(input.message),
    page: text(input.page),
    consent: isTrue(input.consent),
  };
  const errors = {};
  const tooLong = (field) => data[field].length > LIMITS[field][1];

  if (data.name.length < LIMITS.name[0]) errors.name = 'Enter your full name (at least 2 characters).';
  else if (tooLong('name')) errors.name = 'Your name must be 100 characters or fewer.';

  if (!data.email) errors.email = 'Enter your email address.';
  else if (tooLong('email') || !EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address, like name@example.com.';

  const digits = data.phone.replace(/\D/g, '');
  if (!data.phone) errors.phone = 'Enter your phone number.';
  else if (!/^[+()\d\s.-]+$/.test(data.phone) || digits.length < LIMITS.phoneDigits[0] || digits.length > LIMITS.phoneDigits[1])
    errors.phone = 'Enter a valid phone number with 10 to 15 digits.';

  if (formType === 'enquiry') {
    if (data.message.length < LIMITS.message[0]) errors.message = 'Describe your requirements in at least 10 characters.';
    else if (tooLong('message')) errors.message = 'Please keep your message under 2,500 characters.';
  } else if (tooLong('message')) errors.message = 'Please keep your message under 2,500 characters.';

  for (const field of ['company', 'category', 'product', 'catalogue']) {
    if (tooLong(field)) errors[field] = `This field must be ${LIMITS[field][1]} characters or fewer.`;
  }
  if (tooLong('page')) data.page = data.page.slice(0, LIMITS.page[1]);
  if (!data.consent) errors.consent = 'Please confirm that you have read the privacy information.';
  return { data, errors };
}

/** Whether a request Origin (or Referer origin) may submit the form. */
export function isAllowedOrigin(origin, extra = []) {
  if (!origin) return false;
  let normalised;
  try {
    normalised = new URL(origin).origin;
  } catch {
    return false;
  }
  return [...DEFAULT_ORIGINS, ...extra].includes(normalised) || ORIGIN_PATTERNS.some((re) => re.test(normalised));
}

/** In-memory sliding-window limiter. Per serverless instance, so it is a best-effort first line of defence. */
export function createRateLimiter({ max = RATE_LIMIT.max, windowMs = RATE_LIMIT.windowMs, now = () => Date.now() } = {}) {
  const hits = new Map();
  return {
    hit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      hits.set(key, [...recent, t]);
      if (hits.size > 5000) hits.delete(hits.keys().next().value);
      return true;
    },
  };
}

export const isSuspicious = (data) => SPAM_WORDS.test([data.name, data.company, data.product, data.message].join(' '));

export function formatLocalTime(date) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: TIME_ZONE }).format(date) + ' IST';
}

/** Builds the nodemailer message (sender, Reply-To, subject, HTML and plain text). */
export function composeEmail(data, { mailFrom, mailTo, submittedAt, origin, flags = [] }) {
  const typeLabel = FORM_TYPES[data.formType];
  const topic = headerSafe(data.product || data.catalogue || data.category || typeLabel).slice(0, 120);
  const subject = `${flags.length ? `[${flags.join(', ')}] ` : ''}New enquiry from ${data.name}: ${topic}`;
  const pageUrl = data.page ? (data.page.startsWith('/') ? `${origin}${data.page}` : data.page) : '—';
  const rows = [
    ['Form', typeLabel],
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Company', data.company || '—'],
    ...(data.formType === 'catalogue' ? [['Catalogue', data.catalogue || '—']] : [['Category', data.category || '—'], ['Product / model', data.product || '—']]),
    ['Message', data.message || '—'],
    ['Consent', 'Agreed to the privacy policy'],
    ['Source page', pageUrl],
    ['Submitted', formatLocalTime(submittedAt)],
  ];
  const textBody = `${typeLabel} from the VALLIS website\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nReply to this email to answer ${data.name} directly.\n`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#0b1a2e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-collapse:collapse">
<tr><td style="background:#030d1a;color:#d9c08c;padding:20px 24px;font-size:20px;letter-spacing:4px;font-weight:bold">VALLIS</td></tr>
<tr><td style="padding:20px 24px 8px;font-size:18px;font-weight:bold">${escapeHtml(typeLabel)} from the website</td></tr>
<tr><td style="padding:8px 24px 24px"><table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px">
${rows.map(([k, v]) => `<tr><th align="left" valign="top" style="width:150px;border-bottom:1px solid #e6e0d4;color:#5b6472;font-weight:600">${escapeHtml(k)}</th><td style="border-bottom:1px solid #e6e0d4;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join('\n')}
</table></td></tr>
<tr><td style="padding:0 24px 24px;font-size:13px;color:#5b6472">Reply to this email to answer ${escapeHtml(data.name)} directly.</td></tr>
</table></body></html>`;
  return {
    from: { name: `${data.name} via ${SITE_NAME}`, address: mailFrom },
    to: mailTo,
    replyTo: { name: data.name, address: data.email },
    subject,
    text: textBody,
    html,
  };
}

export function readSmtpConfig(env) {
  const config = {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    mailTo: env.MAIL_TO,
    mailFrom: env.MAIL_FROM || env.SMTP_USER,
  };
  const missing = ['host', 'user', 'pass', 'mailTo', 'mailFrom'].filter((k) => !config[k]);
  return { config, missing };
}
