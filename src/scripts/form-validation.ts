// Client-side validation shared by the enquiry and catalogue forms. Mirrors api/_lib/enquiry-core.js.
// Minimum lengths are checked manually: validity.tooShort does not fire for autofilled or scripted values.

export type FieldErrors = Record<string, string>;
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

export const control = (form: HTMLFormElement, name: string): Control | null =>
  form.elements.namedItem(name) as Control | null;

const value = (form: HTMLFormElement, name: string): string => control(form, name)?.value.trim() ?? '';

export function validateForm(form: HTMLFormElement, requireMessage: boolean): FieldErrors {
  const errors: FieldErrors = {};
  const name = value(form, 'name');
  const email = value(form, 'email');
  const phone = value(form, 'phone');
  const digits = phone.replace(/\D/g, '');
  const message = value(form, 'message');

  if (name.length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  else if (name.length > 100) errors.name = 'Your name must be 100 characters or fewer.';

  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 150 || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address, like name@example.com.';

  if (!phone) errors.phone = 'Enter your phone number.';
  else if (!/^[+()\d\s.-]+$/.test(phone) || digits.length < 10 || digits.length > 15) errors.phone = 'Enter a valid phone number with 10 to 15 digits.';

  if (control(form, 'category') && !value(form, 'category')) errors.category = 'Choose a product category.';

  if (requireMessage) {
    if (message.length < 10) errors.message = 'Describe your requirements in at least 10 characters.';
    else if (message.length > 2500) errors.message = 'Please keep your message under 2,500 characters.';
  }
  const consent = control(form, 'consent') as HTMLInputElement | null;
  if (consent && !consent.checked) errors.consent = 'Please confirm that you have read the privacy information.';
  return errors;
}

/**
 * Writes each error into the element referenced by the field's aria-describedby, sets aria-invalid,
 * and focuses the first invalid field. Returns true when there are errors.
 */
export function showErrors(form: HTMLFormElement, fields: string[], errors: FieldErrors, prefix = ''): boolean {
  let first: Control | undefined;
  for (const name of fields) {
    const field = control(form, name);
    if (!field) continue;
    const message = errors[name] ?? '';
    const holder = form.querySelector<HTMLElement>(`#${prefix}${name}-error`);
    if (holder) holder.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message && !first) first = field;
  }
  first?.focus();
  return Boolean(first);
}
