import {
  MIN_FILL_MS,
  THANK_YOU_PATH,
  composeEmail,
  createRateLimiter,
  escapeHtml,
  isAllowedOrigin,
  isSuspicious,
  parseBody,
  readSmtpConfig,
  validate,
} from './enquiry-core.js';

const PHONE = '+91 99900 69207';
const PHONE_HREF = 'tel:+919990069207';
const EMAIL = 'info@vallisglobal.in';

const header = (req, name) => {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value ?? '';
};
const clientIp = (req) => String(header(req, 'x-forwarded-for') || header(req, 'x-real-ip') || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
const requestOrigin = (req) => {
  const origin = header(req, 'origin');
  if (origin && origin !== 'null') return origin;
  const referer = header(req, 'referer');
  try {
    return referer ? new URL(referer).origin : '';
  } catch {
    return '';
  }
};

function send(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries({ 'Cache-Control': 'no-store', ...headers })) res.setHeader(k, v);
  res.end(body);
}

const json = (res, status, payload) => send(res, status, JSON.stringify(payload), { 'Content-Type': 'application/json; charset=utf-8' });

/** Minimal branded HTML response for visitors without JavaScript. Their form data stays in the browser's Back history. */
function htmlPage(title, intro, items = []) {
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>${escapeHtml(title)} | VALLIS</title>
<style>body{margin:0;font-family:system-ui,Arial,sans-serif;background:#030d1a;color:#f4f1ea;display:grid;place-items:center;min-height:100vh;padding:24px}main{max-width:560px}h1{color:#d9c08c;font-weight:500}a{color:#d9c08c}li{margin:6px 0}</style></head>
<body><main><p>VALLIS</p><h1>${escapeHtml(title)}</h1><p>${intro}</p>${items.length ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''}
<p>Use your browser's <strong>Back</strong> button to return to the form — your details are still there.</p>
<p>You can also call <a href="${PHONE_HREF}">${PHONE}</a> or email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p></main></body></html>`;
}

/**
 * Creates the enquiry request handler.
 * @param {{ env?: Record<string,string|undefined>, createTransport: (options: object) => { sendMail: (message: object) => Promise<unknown> }, now?: () => number, rateLimiter?: { hit: (key: string) => boolean }, logger?: Pick<Console,'error'|'warn'> }} deps
 */
export function createEnquiryHandler({ env = process.env, createTransport, now = () => Date.now(), rateLimiter = createRateLimiter(), logger = console }) {
  const extraOrigins = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = env.SITE_ORIGIN || 'https://www.vallisglobal.in';

  return async function handler(req, res) {
    if (req.method === 'OPTIONS') return send(res, 204, '', { Allow: 'POST, OPTIONS' });
    if (req.method !== 'POST') return send(res, 405, 'Method Not Allowed', { Allow: 'POST, OPTIONS', 'Content-Type': 'text/plain' });

    const contentType = String(header(req, 'content-type'));
    const wantsJson = contentType.includes('application/json') || String(header(req, 'accept')).includes('application/json');
    const fail = (status, error, message, fields) =>
      wantsJson
        ? json(res, status, { ok: false, error, message, ...(fields ? { errors: fields } : {}) })
        : send(res, status, htmlPage(status === 422 ? 'Please check your details' : 'Your enquiry was not sent', escapeHtml(message), fields ? Object.values(fields) : []), {
            'Content-Type': 'text/html; charset=utf-8',
          });
    const success = () => (wantsJson ? json(res, 200, { ok: true, redirect: THANK_YOU_PATH }) : send(res, 303, '', { Location: THANK_YOU_PATH }));

    if (!isAllowedOrigin(requestOrigin(req), extraOrigins)) return fail(403, 'forbidden_origin', 'This form can only be submitted from the VALLIS website.');
    if (!rateLimiter.hit(clientIp(req))) return fail(429, 'rate_limited', 'Too many enquiries were sent from your connection. Please wait a few minutes, or call or email us.');

    const input = parseBody(req.body, contentType);

    // Bots: honeypot filled, or the form was submitted faster than a person could fill it.
    // Both are accepted silently and discarded so automated senders learn nothing.
    const startedAt = Number(input.startedAt);
    const flags = [];
    if (String(input.website ?? '').trim()) return success();
    if (Number.isFinite(startedAt) && startedAt > 0) {
      if (now() - startedAt < MIN_FILL_MS) return success();
    } else flags.push('No timer');

    const { data, errors } = validate(input);
    if (Object.keys(errors).length) return fail(422, 'validation', 'Please correct the highlighted fields.', errors);

    const { config, missing } = readSmtpConfig(env);
    if (missing.length) {
      logger.error(`[enquiry] SMTP not configured; missing: ${missing.join(', ')}`);
      return fail(500, 'not_configured', 'Our enquiry service is temporarily unavailable.');
    }

    if (isSuspicious(data)) flags.unshift('Possible spam');
    const message = composeEmail(data, { mailFrom: config.mailFrom, mailTo: config.mailTo, submittedAt: new Date(now()), origin, flags });

    try {
      const transport = createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: { user: config.user, pass: config.pass },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
      await transport.sendMail(message);
    } catch (error) {
      logger.error('[enquiry] SMTP delivery failed:', error instanceof Error ? error.message : error);
      return fail(502, 'delivery_failed', 'We could not deliver your enquiry right now.');
    }
    return success();
  };
}
