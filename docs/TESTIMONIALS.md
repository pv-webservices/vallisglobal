# Client testimonials — how to collect and publish

The homepage has a finished **Client voices** section (`src/components/Testimonials.astro`). It is hidden on the live site until real, approved reviews are added, so the site never shows invented quotes.

Preview the design with `npm run dev` — it shows 12 clearly-marked placeholder cards.

## Why real reviews only

Invented or "representative" reviews mislead visitors, can be reported, and are covered by India's CCPA *Guidelines for Prevention of Misleading Advertisements* (2022) and the BIS standard IS 19000:2022 on online consumer reviews. They also undermine trust if a named client sees a quote they never gave.

## Collect 10–12 reviews (suggested)

1. Start with the clients already shown on the site (DEE VEE Projects, Cosmo First, Gawar Construction, Vertex Construction, Pruthu Homes, Crystal Magic World, UPRNN, etc.) and recent architects/designers you supplied.
2. Send each a short request (template below). Ask for 2–4 sentences about a real project.
3. Ask happy clients to also post on your **Google Business Profile** — public Google reviews can be linked from the card (`sourceUrl`).
4. Keep the written permission (email/WhatsApp screenshot) on file.

### Request template

> Hello {Name}, thank you for choosing VALLIS for {project}. Would you share 2–3 sentences about your experience — product quality, finish, delivery or support? With your permission we would like to show it on vallisglobal.in with your name, role and company (or initials only, if you prefer). Thank you!

## Add a review

Edit `src/data/testimonials.ts`:

```ts
export const testimonials: Testimonial[] = [
  {
    quote: 'Exact words the client approved.',
    name: 'Rohit Sharma',            // or "Rohit S."
    role: 'Principal Architect',
    organisation: 'Studio Name',     // optional
    city: 'Gurugram',
    project: 'Boutique hotel — lever handles & smart locks',
    source: 'Email',                 // 'Google review' | 'Client letter' | 'Email' | 'WhatsApp'
    sourceUrl: undefined,            // link for Google reviews
    rating: undefined,               // only if the client gave a star rating
    date: '2026-11',
    verified: true,                  // only when permission is on file
  },
];
```

Commit and push — the section appears automatically once at least one verified entry exists.
