/**
 * Client testimonials for the homepage.
 *
 * Only add reviews that a real client actually gave, with their written permission to publish
 * (or a public Google review you can link to). Set `verified: true` once permission is on file.
 * Unverified entries are never rendered in a production build.
 *
 * Fabricated or "representative" reviews are misleading to visitors and are prohibited under
 * India's Guidelines for Prevention of Misleading Advertisements (CCPA, 2022) and the
 * BIS IS 19000:2022 standard on online consumer reviews.
 */
export interface Testimonial {
  /** The client's own words, lightly edited for length only, with their approval. */
  quote: string;
  /** Person's name as they agreed to be credited (e.g. "Rohit S." is fine). */
  name: string;
  /** Role or profession, e.g. "Principal Architect". */
  role: string;
  /** Firm, hotel or project (optional if the client prefers not to be named). */
  organisation?: string;
  city?: string;
  /** Collection or project type the review relates to. */
  project?: string;
  /** Where the review came from. */
  source: 'Google review' | 'Client letter' | 'Email' | 'WhatsApp';
  /** Public link to the review, when it is a Google review. */
  sourceUrl?: string;
  /** Star rating only if the client gave one (e.g. on Google). */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** ISO month the review was given, e.g. "2026-09". */
  date: string;
  /** true only when written permission to publish is on file. */
  verified: boolean;
}

export const testimonials: Testimonial[] = [
  // Add real, approved reviews here. See docs/TESTIMONIALS.md for the collection process and template.
];

/** Layout placeholders shown only in `npm run dev` so the section can be designed before real reviews arrive. */
export const layoutPlaceholders: Testimonial[] = Array.from({ length: 12 }, (_, i) => ({
  quote:
    i % 3 === 0
      ? 'Placeholder text — replace with the client’s approved review. A longer quote is shown here to check how three or four lines of text wrap inside the card on every screen size.'
      : 'Placeholder text — replace with the client’s approved review.',
  name: `[Client name ${i + 1}]`,
  role: '[Role]',
  organisation: '[Firm or project]',
  city: '[City]',
  project: '[Collection]',
  source: 'Client letter',
  date: '2026-11',
  verified: false,
}));
