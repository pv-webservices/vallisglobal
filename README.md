# VALLIS — vallisglobal.in

Static [Astro](https://astro.build) website for **VALLIS Architectural Hardware** (a brand of Buildmart India), with one Vercel Function that emails enquiries through the client's own GoDaddy mailbox.

- Live: <https://www.vallisglobal.in/> (apex `vallisglobal.in` → `www` 308 redirect, set in Vercel Domains)
- Hosting: **Vercel**, auto-deployed from GitHub `main` (`pv-webservices/vallisglobal`)
- DNS & email: **GoDaddy** (nameservers `ns55/ns56.domaincontrol.com`, MX `smtp.secureserver.net`, SPF `include:secureserver.net`, DMARC `p=quarantine`)
- Requires Node.js 22.12+ (validated with Node 24.19)

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://127.0.0.1:4321 (testimonial placeholders visible here only) |
| `npm run build` | Builds the static site to `dist/` (+ `sitemap-index.xml`) |
| `npm run preview` | Serves `dist/` locally |
| `npm run check` | Astro/TypeScript type check |
| `npm run test:unit` | Unit tests for the enquiry function (mocked SMTP — never sends) |
| `npm run test:e2e` | Playwright: form flows (endpoint intercepted), axe on every page, responsive checks |
| `npm run audit:seo` | SEO audit of every built page (titles, descriptions, H1s, canonicals, robots, OG, JSON-LD, links, images, sitemap) |
| `npm run lighthouse -- <baseUrl> <label>` | Mobile Lighthouse for home + one inner page → `output/lighthouse/` |
| `npm run verify` | check → build → unit tests → SEO audit → E2E |
| `npm run icons:generate` | Regenerates favicons, app icons and the 1200×630 OG image from the logo (Python + Pillow) |
| `python scripts/sync-image-manifest.py` | Adds srcset entries for any image that has `-w<width>` variants |

E2E tests use the locally installed Google Chrome (`channel: 'chrome'`). Set `PW_CHANNEL=chromium` after `npx playwright install chromium` to use Playwright's build.

## Folder structure

```
api/
  enquiry.js              Vercel Function: POST /api/enquiry (nodemailer → GoDaddy SMTP)
  _lib/enquiry-core.js    validation, spam checks, rate limit, email composition (pure, unit-tested)
  _lib/enquiry-handler.js request/response handling (JSON for fetch, 303/HTML for no-JS posts)
src/
  pages/                  routes (index, about, products/…, hospitality-projects, gallery, contact,
                          privacy-policies, thank-you [noindex], 404 [noindex], robots.txt)
  layouts/Layout.astro    <head> (SEO, OG/Twitter, JSON-LD, favicons), header, footer
  components/             shared UI (Testimonials, ClientLogos, CatalogueGate, PageHero, …)
  data/                   catalogue.ts (business details, collections, products),
                          testimonials.ts, image-manifest.json (responsive srcsets)
  lib/seo.ts              indexability rule, titles, JSON-LD graph, breadcrumbs
  scripts/                client scripts (enquiry form, validation, home interactions)
  styles/                 design system CSS
public/
  images/brand|catalogue|clients|generated|hero|products|supplied/
  catalogues/             published PDF catalogues (lowercase, hyphenated)
  favicon.*, apple-touch-icon.png, web-app-manifest-*.png, site.webmanifest
source-files/             full-resolution masters — NOT deployed (logos, supplied photos, extra PDFs, references)
docs/                     GOOGLE-SEARCH-CONSOLE.md, TESTIMONIALS.md, QA.md, ASSET-SOURCES.json
scripts/                  build/asset tooling, audit-seo.mjs, lighthouse.mjs, generate-brand-icons.py
tests/unit/               node:test unit tests     tests/e2e/   Playwright specs
vercel.json               redirects, trailing slash, security & cache headers, function config
```

## Deploy

1. Push to `main` → Vercel builds (`npm run build`, output `dist/`) and deploys automatically.
2. Preview deployments are **noindex** automatically (`VERCEL_ENV !== 'production'`); only Production is indexable.
3. After the first deploy with the form, add the environment variables below and **redeploy**.

### Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value | Environment | Sensitive |
| --- | --- | --- | --- |
| `SMTP_HOST` | `smtpout.secureserver.net` | Production | no |
| `SMTP_PORT` | `465` | Production | no |
| `SMTP_USER` | `info@vallisglobal.in` | Production | no |
| `SMTP_PASS` | the mailbox password | **Production only** | **yes** |
| `MAIL_TO` | `info@vallisglobal.in` | Production | no |
| `MAIL_FROM` | `info@vallisglobal.in` (must equal `SMTP_USER`) | Production | no |

Vercel environment variables are available to Functions automatically. See `.env.example`. Never commit real values.

## Enquiry form

- Works without JavaScript (plain POST → `303` to `/thank-you/`; validation errors return a page that tells the visitor to press Back — the browser keeps their entries).
- With JavaScript: inline validation, JSON `fetch` with a 20 s timeout, field/summary/offline/timeout/rate-limit/delivery-failure messages that never clear entered data.
- Server: origin allow-list, 5 per IP per 10 min (per instance), honeypot + 3 s timer (silently discarded), full validation incl. consent, header-injection stripping, HTML escaping, suspicious keywords flagged in the subject.
- Email: `"Visitor Name via VALLIS Website" <info@vallisglobal.in>`, `Reply-To: visitor`, HTML table + plain text, source page and IST timestamp. Subject `New enquiry from {Name}: {Product/Category}`.

## Content notes

- Brand positioning copy (hero, about, meta, keywords) follows *VALLIS Brand Positioning & Website Keywords* (Nov 2026).
- Gallery and some atmospheric images are catalogue/illustrative imagery, not completed VALLIS projects (stated on the site and privacy page).
- Testimonials render only entries marked `verified: true` in `src/data/testimonials.ts` — see `docs/TESTIMONIALS.md`.
- Older history (October/November 2026 redesign, AI image generation and catalogue extraction scripts) is in git history and `docs/QA.md`.
