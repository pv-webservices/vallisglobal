// Contact form end-to-end tests. /api/enquiry is always intercepted: no real email is ever sent.
import { test, expect, type Page } from '@playwright/test';

const VALID = {
  '#full-name': 'Asha Verma',
  '#email': 'asha@example.com',
  '#phone': '+91 98765 43210',
  '#message': 'Need 40 lever handles in satin brass for a boutique hotel.',
};

async function fillValid(page: Page) {
  for (const [sel, value] of Object.entries(VALID)) await page.fill(sel, value);
  await page.selectOption('#category', { index: 2 });
  await page.check('#enquiry-form input[name="consent"]');
  // The server ignores submissions made within 3 s of page load; the intercepted endpoint does not care.
}

async function expectValuesKept(page: Page) {
  for (const [sel, value] of Object.entries(VALID)) await expect(page.locator(sel)).toHaveValue(value);
  await expect(page.locator('#enquiry-form input[name="consent"]')).toBeChecked();
}

test.describe('contact form (JavaScript)', () => {
  test('success posts JSON and lands on /thank-you/', async ({ page }) => {
    let body: Record<string, string> = {};
    await page.route('**/api/enquiry', async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true, redirect: '/thank-you/' } });
    });
    await page.goto('/contact/?category=door-hardware&product=VALLIS%20VSMH%20264');
    await expect(page.locator('#category')).toHaveValue('Lever Handles');
    await expect(page.locator('#product')).toHaveValue('VALLIS VSMH 264');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page).toHaveURL(/\/thank-you\/$/);
    await expect(page.locator('h1')).toContainText('Thank you');
    expect(body.formType).toBe('enquiry');
    expect(body.consent).toBe('on');
    expect(Number(body.startedAt)).toBeGreaterThan(0);
    expect(body.website).toBe('');
  });

  test('empty submit shows field errors, a summary, and focuses the first invalid field', async ({ page }) => {
    let called = false;
    await page.route('**/api/enquiry', (route) => {
      called = true;
      return route.abort();
    });
    await page.goto('/contact/');
    await page.click('[data-submit]');
    await expect(page.locator('#form-error')).toContainText('Please correct the 6 highlighted fields');
    await expect(page.locator('#full-name')).toBeFocused();
    await expect(page.locator('#full-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#name-error')).toContainText('full name');
    await expect(page.locator('#email-error')).toContainText('email');
    await expect(page.locator('#phone-error')).toContainText('phone');
    await expect(page.locator('#consent-error')).toContainText('privacy');
    expect(called).toBe(false);
  });

  test('checks minimum lengths and phone digits for programmatically filled values', async ({ page }) => {
    await page.goto('/contact/');
    await fillValid(page);
    await page.evaluate(() => {
      (document.querySelector('#full-name') as HTMLInputElement).value = 'A';
      (document.querySelector('#phone') as HTMLInputElement).value = '12345';
    });
    await page.click('[data-submit]');
    await expect(page.locator('#name-error')).toContainText('at least 2');
    await expect(page.locator('#phone-error')).toContainText('10 to 15 digits');
  });

  test('server validation errors are shown on the matching fields', async ({ page }) => {
    await page.route('**/api/enquiry', (route) =>
      route.fulfill({ status: 422, json: { ok: false, error: 'validation', errors: { email: 'Enter a valid email address, like name@example.com.' } } }),
    );
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page.locator('#email-error')).toContainText('name@example.com');
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
    await expectValuesKept(page);
  });

  test('delivery failure (502) offers phone and email and keeps the data', async ({ page }) => {
    await page.route('**/api/enquiry', (route) => route.fulfill({ status: 502, json: { ok: false, error: 'delivery_failed' } }));
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    const summary = page.locator('#form-error');
    await expect(summary).toContainText('couldn’t deliver your enquiry');
    await expect(summary.locator('a[href="tel:+919990069207"]')).toBeVisible();
    await expect(summary.locator('a[href="mailto:info@vallisglobal.in"]')).toBeVisible();
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await expectValuesKept(page);
  });

  test('missing configuration (500) shows the delivery-failure message', async ({ page }) => {
    await page.route('**/api/enquiry', (route) => route.fulfill({ status: 500, json: { ok: false, error: 'not_configured' } }));
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page.locator('#form-error')).toContainText('couldn’t deliver');
  });

  test('rate limit (429) shows a wait message', async ({ page }) => {
    await page.route('**/api/enquiry', (route) => route.fulfill({ status: 429, json: { ok: false, error: 'rate_limited' } }));
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page.locator('#form-error')).toContainText('wait a few minutes');
  });

  test('timeout shows a timeout message and keeps the data', async ({ page }) => {
    await page.route('**/api/enquiry', async () => {
      /* never respond */
    });
    await page.goto('/contact/');
    await page.locator('#enquiry-form').evaluate((f) => ((f as HTMLFormElement).dataset.timeout = '500'));
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page.locator('[data-submit]')).toBeDisabled();
    await expect(page.locator('#form-error')).toContainText('took too long');
    await expect(page.locator('[data-submit]')).toBeEnabled();
    await expectValuesKept(page);
  });

  test('network error shows a connection message', async ({ page }) => {
    await page.route('**/api/enquiry', (route) => route.abort('connectionrefused'));
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page.locator('#form-error')).toContainText('couldn’t reach our server');
  });

  test('offline shows an offline message without sending', async ({ page, context }) => {
    let called = false;
    await page.route('**/api/enquiry', (route) => {
      called = true;
      return route.abort();
    });
    await page.goto('/contact/');
    await fillValid(page);
    await context.setOffline(true);
    await page.click('[data-submit]');
    await expect(page.locator('#form-error')).toContainText('offline');
    await context.setOffline(false);
    expect(called).toBe(false);
    await expectValuesKept(page);
  });

  test('the submit button is enabled again after returning with Back', async ({ page }) => {
    await page.route('**/api/enquiry', (route) => route.fulfill({ json: { ok: true, redirect: '/thank-you/' } }));
    await page.goto('/contact/');
    await fillValid(page);
    await page.click('[data-submit]');
    await expect(page).toHaveURL(/\/thank-you\/$/);
    await page.goBack();
    await expect(page.locator('[data-submit]')).toBeEnabled();
  });
});

test.describe('contact form (no JavaScript)', () => {
  test.use({ javaScriptEnabled: false });

  test('plain POST follows the 303 redirect to /thank-you/', async ({ page }) => {
    let contentType = '';
    await page.route('**/api/enquiry', (route) => {
      contentType = route.request().headers()['content-type'] ?? '';
      return route.fulfill({ status: 303, headers: { Location: '/thank-you/' } });
    });
    await page.goto('/contact/');
    for (const [sel, value] of Object.entries(VALID)) await page.fill(sel, value);
    await page.selectOption('#category', { index: 2 });
    await page.check('#enquiry-form input[name="consent"]');
    await page.click('[data-submit]');
    await expect(page).toHaveURL(/\/thank-you\/$/);
    expect(contentType).toContain('application/x-www-form-urlencoded');
  });
});

test.describe('catalogue form', () => {
  test('sends a catalogue lead and opens the PDF', async ({ page, context }) => {
    let body: Record<string, string> = {};
    await page.route('**/api/enquiry', async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto('/products/');
    await page.locator('a[href$=".pdf"]').first().click();
    await expect(page.locator('#catalogue-gate')).toBeVisible();
    await page.fill('#lead-name', 'Asha Verma');
    await page.fill('#lead-email', 'asha@example.com');
    await page.fill('#lead-phone', '9876543210');
    await page.check('#lead-form input[name="consent"]');
    const popup = context.waitForEvent('page');
    await page.click('#lead-form button[type="submit"]');
    expect((await popup).url()).toContain('/catalogues/');
    await expect.poll(() => body.formType).toBe('catalogue');
  });
});
