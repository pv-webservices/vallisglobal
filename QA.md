# Local completion report — 12 October 2026

The BUILDMART INDIA website is implemented locally with the supplied reference's navy, ivory and gold design language. It uses the original supplied eagle logo, genuine extracted product photography and catalogue application imagery. The decorative marble studio backdrop is generated scenery; the hero products are genuine catalogue images layered separately in HTML.

## Delivered

- 48 static HTML pages: six main pages, eight category pages, 33 product-detail pages and a custom 404.
- All eight requested product categories. Product branding remains VALLIS or NIMKRO where documented; MRW application images are attributed as catalogue inspiration.
- Selected WebP assets with smaller responsive variants. Original source PDFs and photos are preserved. Provenance is recorded in `ASSET-SOURCES.json`.
- Product search/filtering, product image thumbnails and enlargement, product-specific enquiry preselection, gallery filtering and image dialogs, horizontal carousels, mobile navigation, call/email/directions links and back-to-top.
- Local Cormorant Garamond and Manrope fonts, consistent design tokens, keyboard focus, semantic headings, reduced-motion handling and lightweight native reveal effects. Content remains readable when JavaScript is disabled.
- Unique metadata, supplied-domain canonicals, Open Graph metadata, LocalBusiness/Product schema, sitemap and preview-safe robots controls.

## Verification

| Check | Result |
|---|---|
| `npm run check` | 0 errors, warnings or hints |
| `npm run build` | 48 static pages generated |
| Static output audit | 2,879 local links, 416 image references and responsive image candidates checked; no failures |
| Browser matrix | 48 routes × 4 widths = 192 checks; no page overflow, missing images, clipped static headings or runtime errors |
| Widths | 1440, 768, 390 and 320 pixels |
| Interaction checks | 25 assertions passed; synthetic local data only; no messages sent |
| Axe checks | Zero violations on nine representative pages and the mobile menu, including WCAG 2 A/AA, 2.1 A/AA and 2.2 AA rule tags |
| Progressive enhancement | Four representative routes remained usable without JavaScript; contact fallback, reduced motion and initial keyboard focus passed |
| Dependency audit | No reported production dependency vulnerabilities |

Machine-readable evidence is in `output/build-verification.json`, `output/browser-matrix.json`, `output/browser-interactions.json`, `output/browser-accessibility.json` and `output/browser-progressive.json`. Screenshots are in `output/playwright/`.

The full-page screenshot process loads offscreen lazy images before capture. The browser matrix excludes intentionally offscreen headings inside horizontal scroll tracks from viewport-clipping assertions, while checking ordinary static headings and page overflow.

## Lighthouse limits

The final saved local mobile report recorded Performance 70, Accessibility 100, Best Practices 100 and SEO 69, with CLS 0. A prior run recorded Performance 86. The Windows Chrome launcher raised temporary-profile cleanup `EPERM` after saving each report. These variable performance results are retained as local diagnostic evidence; 90+ mobile performance and production Core Web Vitals are not verified.

The SEO audit's only failed binary item is indexing, intentionally blocked in the preview. Preview pages use `noindex, nofollow`, and robots disallows crawling. This does not establish production SEO or indexing success. Final report files: `output/lighthouse-home-final.report.html` and `.json`.

## Enquiry boundary

The form validates fields and prepares a reviewable email or WhatsApp draft, then the visitor sends it in the chosen application. Correct recipient and model preselection, input errors and draft invalidation were tested. No enquiry is automatically submitted to a hosted endpoint. Email-app handling, WhatsApp account reachability and live delivery were not verified.

For a directly submitted email form, an authorised service needs configuration, recipient activation, a privacy update and a real production delivery test. The current policy describes the draft flow accurately.

## Client verification before launch

1. Approve final content, product availability/variants and rights to publish catalogue/application assets.
2. Approve the privacy policy and final www/apex domain strategy.
3. Confirm whether the draft enquiry flow is preferred or activate a direct email submission service.
4. Supply model-specific fire-rating or certification evidence before adding those claims. Supplied shaft-door sheets contain inconsistent branding/contact details and broad compliance statements, which were not propagated into website claims.
5. Approve deployment, set `PUBLIC_INDEXABLE=true`, rebuild and verify HTTPS, redirects, hosted routes, sitemap and robots on the final host.
6. Verify hosted performance, real enquiry delivery and actual-device/browser behavior. iOS Safari, Android Chrome and assistive-technology certification are not claimed by the local Chromium checks.

The `frontend-design`, PDF and image-generation skills guided the work. `scroll-world`, `scroll-craft` and `design-dna` named in the pasted reference document were not installed; their described visual/motion requirements were implemented with shared CSS tokens, native animation and responsive components. No suitable video asset or verified social destinations were supplied, so functional catalogue/gallery links are used instead.

No production deployment, commit or push was performed.
