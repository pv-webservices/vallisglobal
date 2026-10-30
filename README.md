# BUILDMART INDIA

Static Astro business website for architectural hardware, built in the supplied `vallisglobal` workspace. The supplied BUILDMART INDIA eagle logo and navy/gold homepage reference guide the site. Contact details follow the user's message rather than conflicting catalogue footers.

## Run locally

Requires Node.js 22.12 or later (validated using Node.js 24.19).

```powershell
npm install
npm run dev
npm run check
npm run build
npm run preview -- --port 4322
python scripts/verify-build.py
```

The development URL is `http://127.0.0.1:4321/`. `dist/` is the deployable static output. Configure the host to serve `404.html` for unknown routes. No database or application server is required.

## Content and images

- `src/data/catalogue.ts` holds business details, eight categories, 33 product entries, specifications, source references and gallery labels.
- `src/components/` contains shared category/product cards, icons, catalogue links, enquiry strip and page heroes.
- `src/layouts/Layout.astro` provides the shared header, mobile navigation, footer and metadata.
- `ASSET-SOURCES.json` records the source catalogue page and embedded-image reference for each selected product/application image. `src/data/image-manifest.json` holds responsive image dimensions and variants.
- The hero uses an AI-generated luxury entrance scene (see *AI image generation*). The original supplied logo file is retained unchanged; transparent variants are derived from it.
- Gallery images are VALLIS/MRW catalogue application imagery. They do not claim completed BUILDMART INDIA projects.
- The three original PDFs remain available as downloadable/openable catalogue documents. Original user-supplied assets have been preserved.

To regenerate extraction/audit assets, use `python scripts/audit-pdfs.py` and `python scripts/extract-assets.py` with PyMuPDF and Pillow installed. Extraction respects embedded PDF alpha masks. After a build, `python scripts/curate-assets.py` removes unused generated WebP extractions only. Run `python scripts/responsive-images.py` to generate smaller WebP variants and refresh the responsive manifest, then build again to package the curated set. It never deletes the original supplied documents/photos.

## Redesign (October 2026) — design system

The site was art-directed into a premium navy, ivory and champagne-gold system built around the supplied eagle logo.

- **Styles** (`src/styles/`): `base.css` (tokens, typography, reveal motion), `layout.css` (loader, header and mega menu, mobile menu, CTA band, footer, floating contact), `cards.css` (collection bento tiles, product cards, rails, catalogue cards), `components.css` (buttons, page hero, marquee, chips, forms, lightbox and responsive overrides), `home.css` and `pages.css`.
- **Brand**: `scripts/brand-logo-variants.py` derives transparent logo variants (`logo-reversed.webp` for navy backgrounds, `logo-transparent.webp`, `eagle-mark.webp` for the loader) from the untouched original JPEG.
- **Catalogue imagery**: `scripts/cutout-white-backgrounds.py` removes flat white studio backgrounds from product shots so they sit on the ivory product stages. `scripts/crop-catalogue-photos.py` crops MRW application photos to the photograph (removing PDF page margins and page marks). Originals are kept in `tmp/`.
- **Hero** (`src/styles/hero.css`, `src/scripts/home.ts`): a pinned, scroll-driven sequence of four chapters (The art → Access → Clarity → Touch). Scroll progress drives the image cross-fades, a slow camera push and the chapter copy. Hidden chapters are `inert`. The chapter rail is clickable, and precise pointers get subtle parallax. On phones the scroll distance is shorter. With reduced motion or no JavaScript, it becomes a single static full-screen scene.
- **Interactive sections**: "Why choose" is a selectable showcase that auto-advances and pauses on hover, focus or a click. "Function. Finish. Fit." has sticky storytelling where the step at the middle of the screen drives the image. The Spaces sectors swap the image on hover on desktop and become a swipe rail on phones.
- **Motion**: CSS transitions on transform/opacity and IntersectionObserver reveals, with a scroll-position backup so content is never left hidden. Clip reveals clip the child, not the observed element. There's also a brief first-visit loader and a collections marquee. Everything respects `prefers-reduced-motion`.
- **Conversion**: Enquire/Call/WhatsApp actions appear in the header, hero and every CTA band. On phones, a sticky Call · WhatsApp · Enquire bar appears once the visitor scrolls past the hero. The site has no floating WhatsApp button and no header search icon (product search lives on /products/).

## October 2026 client updates

- **Hero**: five banners — full product range (`hero-collection`, widened by `scripts/extend-hero-canvas.py`), digital lock, handles, patch-fitting glass doors and shower cubicles. Chapter numbers follow the rail (02 / 05 …).
- **Supplied photos** (WhatsApp originals in `source-assets/supplied-2026-10-31/`, kept out of `public/`): `python scripts/optimize-supplied-photos.py` upscales, sharpens and writes responsive WebP to `public/images/supplied/`, merging entries into the image manifest.
- **Reference-based AI images**: assets in `scripts/image-generation/assets.mjs` may list `references`; these go to the OpenAI edits endpoint (VALLIS logo on the `craft-detail` handle, the VACS 13 lock scene, the product-range banner and the FHC doors with clear vision glass). Reference crops from the latest catalogue live in `scripts/image-generation/references/`.
- **New collection**: Shower Cubicles (hinged, corner, sliding). uPVC now includes Casement Window & Door, Sliding Window & Door, French Door and Slide & Fold Door.
- **Catalogue lead form** (`src/components/CatalogueGate.astro`): every PDF link opens a name / email / phone / consent form first. Set `PUBLIC_LEAD_ENDPOINT` to a form-handling URL to receive each lead as JSON; without it the form still gates the download but stores nothing. Without JavaScript, the PDF links open directly.
- **Corporate image** (`src/components/ClientLogos.astro`): CPWD and NBCC logos on the homepage.

## AI image generation

Fifteen art-directed images in `public/images/generated/`: four hero chapters, a craftsmanship detail, a precision macro, finishes, a fit-check still life, the Door Hardware, Glass Fittings, Furniture Hardware and Shaft Doors scenes, two sector images and a consultation scene. Each one has a single, recorded placement. Product pages always use the genuine catalogue image. The privacy page states that atmospheric images are illustrative.

- `scripts/image-generation/config.mjs` sets the model names, quality tiers, sizes, WebP quality and responsive widths. Environment overrides are listed in `.env.example`.
- `scripts/image-generation/assets.mjs` holds each image's prompt, placement, alt text, tier and orientation. Routing: Flare is the default, and Sunburst is used only for the hero and complex premium scenes. Images marked `hero`/`key` use high quality and the rest use medium.
- `npm run images:plan` shows the routing without calling the API. `npm run images:generate [id ...] [--force]` generates images server-side, using `OPENAI_API_KEY` from `.env`. It writes WebP variants and updates `src/data/image-manifest.json`. Raw PNGs are cached in `tmp/generated/`. `scripts/image-generation/generation-log.json` records the model and quality used for each image.
- The API key is read only by this Node script. It never ships to the browser and is not referenced anywhere in `src/` or `dist/`.

## Enquiries

The enquiry form validates input and prepares a reviewable email or WhatsApp draft. Product CTAs preselect the product and category. Editing details invalidates the previous draft. No message is sent by the website, and values are not stored in local storage. The visitor sends the draft in their chosen app.

This is not a verified server-delivered form. A direct email submission service would require authorised service configuration, recipient activation, a privacy-policy update and a real production delivery test. No external messages were sent during QA.

## Production launch

The configured canonical origin is `https://www.vallisglobal.in`, matching the supplied domain. Previews default to `noindex, nofollow`; `robots.txt` disallows crawling. Set `PUBLIC_INDEXABLE=true` only for the approved production launch and rebuild. Review whether www or apex should be the final origin and configure a consistent host redirect before deployment. Update `business.origin` and `astro.config.mjs` together if the approved origin changes.

Before launch, the business owner should approve product availability/variants, catalogue permissions, final policy text, domain strategy and any desired email submission service. Model-specific fire-rating/test certificates have not been supplied, so ratings, ISO claims and universal compliance statements are not published.

No deployment, commit or push was performed.

## Browser verification

The scripts in `scripts/browser-*.js` run as Playwright CLI `run-code` functions, not application code:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=buildmart open http://127.0.0.1:4322/
npx --yes --package @playwright/cli playwright-cli -s=buildmart snapshot
npx --yes --package @playwright/cli playwright-cli -s=buildmart run-code --filename=scripts/browser-matrix.js
npx --yes --package @playwright/cli playwright-cli -s=buildmart run-code --filename=scripts/browser-interactions.js
npx --yes --package @playwright/cli playwright-cli -s=buildmart run-code --filename=scripts/browser-accessibility.js
```

Use local synthetic input only. Preserve results in `output/`. `QA.md` describes the completed checks and limitations. Automated accessibility results are a local check, not formal certification.

Implementation follows Astro's [static routing documentation](https://docs.astro.build/en/guides/routing/).
