import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { createEnquiryHandler } from '../../api/_lib/enquiry-handler.js';
import { composeEmail, createRateLimiter, headerSafe, validate } from '../../api/_lib/enquiry-core.js';

const NOW = Date.UTC(2026, 10, 19, 10, 30); // 19 Nov 2026, 16:00 IST
const ENV = {
  SMTP_HOST: 'smtpout.secureserver.net',
  SMTP_PORT: '465',
  SMTP_USER: 'info@vallisglobal.in',
  SMTP_PASS: 'test-only-not-a-real-password',
  MAIL_TO: 'info@vallisglobal.in',
  MAIL_FROM: 'info@vallisglobal.in',
};
const VALID = {
  formType: 'enquiry',
  name: 'Asha Verma',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  company: 'Studio Verma',
  category: 'Lever Handles',
  product: 'VSMH 264',
  message: 'Need 40 lever handles in satin brass for a boutique hotel.',
  consent: 'on',
  website: '',
  startedAt: String(NOW - 20_000),
  page: '/contact/',
};

function mockTransport({ fail = false } = {}) {
  const sent = [];
  const options = [];
  return {
    sent,
    options,
    createTransport(opts) {
      options.push(opts);
      return {
        async sendMail(message) {
          if (fail) throw new Error('535 Authentication failed');
          sent.push(message);
          return { messageId: 'mock' };
        },
      };
    },
  };
}

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(body = '') {
      this.body = body;
    },
    get json() {
      return JSON.parse(this.body);
    },
  };
}

const jsonReq = (body, headers = {}) => ({
  method: 'POST',
  headers: { origin: 'https://www.vallisglobal.in', 'content-type': 'application/json', accept: 'application/json', 'x-forwarded-for': '203.0.113.7', ...headers },
  body,
});

function setup({ env = ENV, fail = false, rateLimiter } = {}) {
  const transport = mockTransport({ fail });
  const logger = { error() {}, warn() {} };
  const handler = createEnquiryHandler({ env, createTransport: transport.createTransport, now: () => NOW, rateLimiter, logger });
  return { handler, transport };
}

async function call(handler, req) {
  const res = mockRes();
  await handler(req, res);
  return res;
}

describe('enquiry handler — success path', () => {
  test('sends from the client domain with the visitor name and Reply-To the visitor', async () => {
    const { handler, transport } = setup();
    const res = await call(handler, jsonReq({ ...VALID }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json, { ok: true, redirect: '/thank-you/' });
    const [mail] = transport.sent;
    assert.deepEqual(mail.from, { name: 'Asha Verma via VALLIS Website', address: 'info@vallisglobal.in' });
    assert.deepEqual(mail.replyTo, { name: 'Asha Verma', address: 'asha@example.com' });
    assert.equal(mail.to, 'info@vallisglobal.in');
    assert.equal(mail.subject, 'New enquiry from Asha Verma: VSMH 264');
    assert.match(mail.text, /Source page: https:\/\/www\.vallisglobal\.in\/contact\//);
    assert.match(mail.text, /Submitted: 19 November 2026 at 4:00\s?pm IST/i);
    assert.doesNotMatch(mail.html + mail.text, /formsubmit/i);
  });

  test('uses implicit TLS on port 465 with credentials from the environment', async () => {
    const { handler, transport } = setup();
    await call(handler, jsonReq({ ...VALID }));
    assert.equal(transport.options[0].host, 'smtpout.secureserver.net');
    assert.equal(transport.options[0].port, 465);
    assert.equal(transport.options[0].secure, true);
    assert.equal(transport.options[0].auth.user, 'info@vallisglobal.in');
  });

  test('no-JavaScript form POST is answered with a 303 redirect to /thank-you/', async () => {
    const { handler, transport } = setup();
    const body = new URLSearchParams({ ...VALID }).toString();
    const res = await call(handler, { method: 'POST', headers: { origin: 'https://www.vallisglobal.in', 'content-type': 'application/x-www-form-urlencoded' }, body });
    assert.equal(res.statusCode, 303);
    assert.equal(res.headers.location, '/thank-you/');
    assert.equal(transport.sent.length, 1);
  });

  test('catalogue form does not require a message', async () => {
    const { handler, transport } = setup();
    const { message, product, category, ...rest } = VALID;
    const res = await call(handler, jsonReq({ ...rest, formType: 'catalogue', catalogue: 'VALLIS Architectural Hardware' }));
    assert.equal(res.statusCode, 200);
    assert.equal(transport.sent[0].subject, 'New enquiry from Asha Verma: VALLIS Architectural Hardware');
  });
});

describe('enquiry handler — validation', () => {
  test('returns field-level errors with 422', async () => {
    const { handler, transport } = setup();
    const res = await call(handler, jsonReq({ ...VALID, name: 'A', email: 'not-an-email', phone: '12345', message: 'short' }));
    assert.equal(res.statusCode, 422);
    assert.deepEqual(Object.keys(res.json.errors).sort(), ['email', 'message', 'name', 'phone']);
    assert.equal(transport.sent.length, 0);
  });

  test('enforces maximum lengths and phone digit range', () => {
    assert.ok(validate({ ...VALID, name: 'x'.repeat(101) }).errors.name);
    assert.ok(validate({ ...VALID, message: 'x'.repeat(2501) }).errors.message);
    assert.ok(validate({ ...VALID, phone: '1'.repeat(16) }).errors.phone);
    assert.ok(validate({ ...VALID, company: 'x'.repeat(151) }).errors.company);
    assert.equal(validate({ ...VALID, phone: '9990069207' }).errors.phone, undefined);
  });

  test('requires consent', async () => {
    const { handler } = setup();
    const res = await call(handler, jsonReq({ ...VALID, consent: '' }));
    assert.equal(res.statusCode, 422);
    assert.ok(res.json.errors.consent);
  });

  test('no-JavaScript validation failure returns an HTML page with phone and email alternatives', async () => {
    const { handler } = setup();
    const body = new URLSearchParams({ ...VALID, email: 'bad' }).toString();
    const res = await call(handler, { method: 'POST', headers: { origin: 'https://www.vallisglobal.in', 'content-type': 'application/x-www-form-urlencoded' }, body });
    assert.equal(res.statusCode, 422);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.body, /Back/);
    assert.match(res.body, /tel:\+919990069207/);
  });
});

describe('enquiry handler — spam protection', () => {
  test('honeypot submissions are silently accepted and discarded', async () => {
    const { handler, transport } = setup();
    const res = await call(handler, jsonReq({ ...VALID, website: 'http://spam.example' }));
    assert.equal(res.statusCode, 200);
    assert.equal(res.json.ok, true);
    assert.equal(transport.sent.length, 0);
  });

  test('submissions faster than 3 seconds are silently accepted and discarded', async () => {
    const { handler, transport } = setup();
    const res = await call(handler, jsonReq({ ...VALID, startedAt: String(NOW - 1500) }));
    assert.equal(res.statusCode, 200);
    assert.equal(transport.sent.length, 0);
  });

  test('a missing timer is delivered but flagged in the subject', async () => {
    const { handler, transport } = setup();
    const { startedAt, ...rest } = VALID;
    await call(handler, jsonReq(rest));
    assert.match(transport.sent[0].subject, /^\[No timer\] /);
  });

  test('suspicious keywords are flagged in the subject instead of dropped', async () => {
    const { handler, transport } = setup();
    await call(handler, jsonReq({ ...VALID, message: 'We offer cheap SEO services and backlinks for your site.' }));
    assert.equal(transport.sent.length, 1);
    assert.match(transport.sent[0].subject, /^\[Possible spam\] /);
  });

  test('rejects other origins with 403', async () => {
    const { handler, transport } = setup();
    const res = await call(handler, jsonReq({ ...VALID }, { origin: 'https://evil.example' }));
    assert.equal(res.statusCode, 403);
    assert.equal(transport.sent.length, 0);
  });

  test('allows www, apex, Vercel preview and localhost origins', async () => {
    for (const origin of ['https://vallisglobal.in', 'https://vallisglobal-git-main-team.vercel.app', 'http://127.0.0.1:4322', 'http://localhost:4321']) {
      const { handler } = setup();
      const res = await call(handler, jsonReq({ ...VALID }, { origin }));
      assert.equal(res.statusCode, 200, origin);
    }
  });

  test('strips line breaks from header values to prevent header injection', async () => {
    const { handler, transport } = setup();
    await call(handler, jsonReq({ ...VALID, name: 'Eve\r\nBcc: victim@example.com', product: 'X\nBcc: a@b.c' }));
    const [mail] = transport.sent;
    assert.doesNotMatch(mail.subject, /[\r\n]/);
    assert.doesNotMatch(mail.from.name, /[\r\n]/);
    assert.equal(headerSafe('a\r\nb'), 'a b');
  });

  test('escapes HTML in the email body', () => {
    const mail = composeEmail(validate({ ...VALID, message: '<script>alert(1)</script> & more' }).data, {
      mailFrom: 'info@vallisglobal.in',
      mailTo: 'info@vallisglobal.in',
      submittedAt: new Date(NOW),
      origin: 'https://www.vallisglobal.in',
    });
    assert.doesNotMatch(mail.html, /<script>/);
    assert.match(mail.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; more/);
  });

  test('rate limits to 5 submissions per IP per 10 minutes', async () => {
    const { handler } = setup({ rateLimiter: createRateLimiter({ now: () => NOW }) });
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await call(handler, jsonReq({ ...VALID }))).statusCode);
    assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
    const other = await call(handler, jsonReq({ ...VALID }, { 'x-forwarded-for': '198.51.100.2' }));
    assert.equal(other.statusCode, 200);
  });
});

describe('enquiry handler — configuration and delivery failures', () => {
  test('missing SMTP configuration returns 500', async () => {
    const { handler, transport } = setup({ env: { ...ENV, SMTP_PASS: '' } });
    const res = await call(handler, jsonReq({ ...VALID }));
    assert.equal(res.statusCode, 500);
    assert.equal(res.json.error, 'not_configured');
    assert.equal(transport.sent.length, 0);
  });

  test('SMTP failure returns 502', async () => {
    const { handler } = setup({ fail: true });
    const res = await call(handler, jsonReq({ ...VALID }));
    assert.equal(res.statusCode, 502);
    assert.equal(res.json.error, 'delivery_failed');
  });

  test('rejects non-POST methods', async () => {
    const { handler } = setup();
    const res = await call(handler, { method: 'GET', headers: {} });
    assert.equal(res.statusCode, 405);
  });
});

describe('email rendering with nodemailer (no network send)', () => {
  test('renders the expected From, Reply-To and Subject headers', async () => {
    const message = composeEmail(validate(VALID).data, {
      mailFrom: 'info@vallisglobal.in',
      mailTo: 'info@vallisglobal.in',
      submittedAt: new Date(NOW),
      origin: 'https://www.vallisglobal.in',
    });
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
    const info = await transport.sendMail(message);
    const raw = info.message.toString('utf8').replace(/\r\n/g, '\n');
    const headers = raw.split('\n\n')[0];
    assert.match(headers, /^From: "?Asha Verma via VALLIS Website"? <info@vallisglobal\.in>$/m);
    assert.match(headers, /^Reply-To: Asha Verma <asha@example\.com>$/m);
    assert.match(headers, /^To: info@vallisglobal\.in$/m);
    assert.match(headers, /^Subject: New enquiry from Asha Verma: VSMH 264$/m);
    assert.doesNotMatch(headers, /^Sender:/m);
    assert.match(raw, /Content-Type: multipart\/alternative/);
    assert.match(raw, /Content-Type: text\/plain/);
    assert.match(raw, /Content-Type: text\/html/);
  });
});
