// Contact form: progressive enhancement over a plain POST to /api/enquiry (303 → /thank-you/ without JavaScript).
// With JavaScript it validates inline, sends JSON in the background and keeps every entered value on failure.
import { validateForm, showErrors, control, type FieldErrors } from './form-validation';

const FIELDS = ['name', 'email', 'phone', 'category', 'message', 'consent'];
const TIMEOUT_MS = 20_000;
const CONTACT =
  'call <a href="tel:+919990069207">+91 9990069207</a> or email <a href="mailto:info@vallisglobal.in">info@vallisglobal.in</a>';

export const MESSAGES = {
  offline: `You appear to be offline. Your details are still here — reconnect and press Send again, or ${CONTACT}.`,
  timeout: `The request took too long to respond. Your details are still here — please try again, or ${CONTACT}.`,
  network: `We couldn’t reach our server. Check your connection and try again, or ${CONTACT}.`,
  rateLimited: `You have sent several enquiries in a short time. Please wait a few minutes, or ${CONTACT}.`,
  delivery: `Sorry — we couldn’t deliver your enquiry just now. Your details are still here, so you can try again in a moment, or ${CONTACT}.`,
};

const summaryFor = (errors: FieldErrors): string => {
  const count = Object.keys(errors).length;
  return `Please correct the ${count === 1 ? 'highlighted field' : `${count} highlighted fields`} before sending.`;
};

export function initEnquiryForm(form: HTMLFormElement): void {
  const summary = form.querySelector<HTMLElement>('#form-error')!;
  const button = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const idleLabel = button.innerHTML;
  form.noValidate = true;
  (control(form, 'startedAt') as HTMLInputElement).value = String(Date.now());
  (control(form, 'page') as HTMLInputElement).value = location.pathname + location.search;

  // Pre-fill from product "Enquire" links (?category=<slug>&product=<model>).
  const params = new URLSearchParams(location.search);
  const select = control(form, 'category') as HTMLSelectElement;
  const wanted = params.get('category') ?? '';
  const match = Array.from(select.options).find((o) => wanted && (o.value === wanted || o.dataset.slug === wanted));
  if (match) select.value = match.value;
  (control(form, 'product') as HTMLInputElement).value = (params.get('product') ?? '').slice(0, 250);

  const setBusy = (busy: boolean) => {
    button.disabled = busy;
    button.setAttribute('aria-busy', String(busy));
    button.innerHTML = busy ? 'Sending…' : idleLabel;
  };
  const fail = (html: string) => {
    summary.innerHTML = html;
    setBusy(false);
    summary.focus();
  };
  // Back/forward cache restores the disabled button; re-enable it.
  addEventListener('pageshow', () => setBusy(false));

  // Clear a field's error as soon as it becomes valid.
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.getAttribute('aria-invalid') !== 'true') return;
    if (!validateForm(form, true)[target.name]) {
      target.setAttribute('aria-invalid', 'false');
      const holder = form.querySelector(`#${target.name}-error`);
      if (holder) holder.textContent = '';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    summary.textContent = '';
    const errors = validateForm(form, true);
    if (showErrors(form, FIELDS, errors)) {
      summary.textContent = summaryFor(errors);
      return;
    }
    if (!navigator.onLine) return fail(MESSAGES.offline);

    setBusy(true);
    const controller = new AbortController();
    // data-timeout lets the browser tests exercise the timeout path without waiting 20 seconds.
    const timer = setTimeout(() => controller.abort(), Number(form.dataset.timeout) || TIMEOUT_MS);
    try {
      const body = JSON.stringify(Object.fromEntries(new FormData(form).entries()));
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        location.assign(data.redirect || '/thank-you/');
        return;
      }
      if (res.status === 422 && data.errors) {
        setBusy(false);
        showErrors(form, FIELDS, data.errors);
        summary.textContent = summaryFor(data.errors);
        return;
      }
      fail(res.status === 429 ? MESSAGES.rateLimited : MESSAGES.delivery);
    } catch (error) {
      fail((error as Error).name === 'AbortError' ? MESSAGES.timeout : MESSAGES.network);
    } finally {
      clearTimeout(timer);
    }
  });
}
