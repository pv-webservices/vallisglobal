# Google Search Console — launch guide for www.vallisglobal.in

Canonical domain: **https://www.vallisglobal.in/** (apex `vallisglobal.in` and `http://` both 308-redirect here).
DNS provider: **GoDaddy** (nameservers `ns55.domaincontrol.com` / `ns56.domaincontrol.com`). Hosting: **Vercel**.

> Important: until this release is deployed, the live site sends `noindex, nofollow` and `robots.txt` says `Disallow: /`, so Google cannot index anything. Deploy first, then follow this guide.

## 1. Pre-launch checklist (on the live domain, after deploying)

Run these from PowerShell; each must show the expected result.

| Check | Command | Expected |
| --- | --- | --- |
| HTTPS redirect | `curl.exe -sI http://vallisglobal.in/` | `308` → `https://vallisglobal.in/` → `308` → `https://www.vallisglobal.in/` |
| Apex → www | `curl.exe -sI https://vallisglobal.in/` | `308`, `Location: https://www.vallisglobal.in/` |
| Trailing slash | `curl.exe -sI https://www.vallisglobal.in/about` | `308`, `Location: /about/` |
| /index.html | `curl.exe -sI https://www.vallisglobal.in/index.html` | `308`, `Location: /` |
| robots.txt | `curl.exe -s https://www.vallisglobal.in/robots.txt` | `Allow: /` and `Sitemap: https://www.vallisglobal.in/sitemap-index.xml` |
| Sitemap | `curl.exe -sI https://www.vallisglobal.in/sitemap-index.xml` | `200` |
| Home is indexable | `curl.exe -s https://www.vallisglobal.in/ \| findstr robots` | `index, follow, max-image-preview:large` |
| 404 status | `curl.exe -sI https://www.vallisglobal.in/no-such-page/` | `404` |
| Favicon | `curl.exe -sI https://www.vallisglobal.in/favicon.ico` | `200` |
| Form | Send one real test enquiry from `/contact/` | Arrives in the info@vallisglobal.in **Inbox**, From "Your Name via VALLIS Website", Reply goes to you |

## 2. Add a Domain property (DNS TXT verification at GoDaddy)

1. Open <https://search.google.com/search-console> and sign in with the Google account that will own the property (ideally the client's).
2. **Add property → Domain** → enter `vallisglobal.in` (no `https://`, no `www`). A Domain property covers www, apex, http and https.
3. Google shows a TXT record like `google-site-verification=XXXXXXXX`. Copy it.
4. In GoDaddy: **My Products → Domains → vallisglobal.in → DNS → DNS Records → Add New Record**
   - Type: **TXT** · Name: **@** · Value: the full `google-site-verification=…` string · TTL: 1 hour → **Save**.
   - Do **not** edit or delete the existing SPF TXT record (`v=spf1 include:secureserver.net -all`) or the MX/DMARC records — add a new TXT record alongside.
5. Back in Search Console click **Verify**. If it fails, wait 15–60 minutes and retry (DNS propagation).

## 3. Submit the sitemap

1. Search Console → **Sitemaps** → enter `sitemap-index.xml` → **Submit**.
2. This one file points to `sitemap-0.xml`, which lists **every indexable page** (319 URLs). You do not need to submit pages one by one.
3. Status **"Couldn't fetch"** or **"Pending"** for up to 24 hours is normal for a new property — check again the next day.
4. Opening the sitemap in a browser shows *"This XML file does not appear to have any style information"*. That is normal: sitemaps are for crawlers.

## 4. Priority pages for "Request indexing"

URL Inspection → paste the URL → **Request indexing**. Google allows roughly 10 requests per day, so use these batches:

**Day 1 (10):**
1. https://www.vallisglobal.in/
2. https://www.vallisglobal.in/products/
3. https://www.vallisglobal.in/hospitality-projects/
4. https://www.vallisglobal.in/about/
5. https://www.vallisglobal.in/contact/
6. https://www.vallisglobal.in/products/hotel-digital-locks/
7. https://www.vallisglobal.in/products/door-hardware/
8. https://www.vallisglobal.in/products/glass-fittings/
9. https://www.vallisglobal.in/products/upvc-windows/
10. https://www.vallisglobal.in/products/shower-cubicles/

**Day 2 (10):**
1. https://www.vallisglobal.in/products/locks-cylinders/
2. https://www.vallisglobal.in/products/door-closers/
3. https://www.vallisglobal.in/products/floor-springs/
4. https://www.vallisglobal.in/products/glass-door-handles/
5. https://www.vallisglobal.in/products/spider-fittings/
6. https://www.vallisglobal.in/products/glass-railings/
7. https://www.vallisglobal.in/products/shower-hardware/
8. https://www.vallisglobal.in/products/door-accessories/
9. https://www.vallisglobal.in/products/panic-bars/
10. https://www.vallisglobal.in/products/furniture-hardware/

**Day 3 (up to 10):** https://www.vallisglobal.in/products/fhc-doors/, https://www.vallisglobal.in/gallery/, then the flagship products you most want to rank (for example `/products/hotel-digital-locks/vacs-12/`, `/products/door-hardware/vsmh-264/`, `/products/shower-hardware/vsh-704/`).

The remaining product pages are discovered through the sitemap and internal links — no manual requests needed.

## 5. Pages that must NOT be submitted

| URL | Why |
| --- | --- |
| `/thank-you/` | Form confirmation page — `noindex, follow`, excluded from the sitemap. Only reached after sending a form. |
| `/404.html` and any non-existent URL | Error page — `noindex, follow`, returns HTTP 404. |
| `/api/enquiry` | Form endpoint, not a page (`X-Robots-Tag: noindex`). |
| Vercel preview URLs (`*.vercel.app`) | Automatically `noindex`; only the production domain should be indexed. |
| `/catalogues/*.pdf` | PDFs can be indexed by Google on their own, but do not request them — the product pages are the target. |

In the Pages report these show as "Excluded by 'noindex' tag" or "Not found (404)". That is expected.

## 6. Follow-up, weeks 1–4

**Week 1**
- Sitemaps: status should change to **Success** with 319 discovered URLs.
- URL Inspection on the homepage: "URL is on Google" or "Indexing requested". Check the detected **favicon** (Google can take days to weeks to update the icon in results; requesting indexing of the homepage speeds it up).
- Create/claim the **Google Business Profile**: primary category *Architectural Hardware Supplier* (or *Hardware Store*), add the 750-character description from the brand blueprint, list the keyword pillars under **Services**, website `https://www.vallisglobal.in/`, phone +91 9990069207.

**Week 2**
- **Pages** report: watch "Indexed" grow. Investigate "Crawled – currently not indexed" (usually resolves) and any "Duplicate without user-selected canonical" (should be none; every page has a self-canonical).
- **Enhancements**: *Breadcrumbs* (all inner pages), *Organization/Local business* (sitewide). There is no FAQ markup because the site has no FAQ content.

**Week 3**
- **Core Web Vitals** report (needs traffic data; may show "Not enough data" at first) and <https://pagespeed.web.dev/> for the home page and one product page on mobile.
- **Bing Webmaster Tools**: <https://www.bing.com/webmasters> → **Import from Google Search Console** (fastest), or add the site and verify with a TXT/CNAME at GoDaddy, then submit `https://www.vallisglobal.in/sitemap-index.xml`.

**Week 4**
- **Performance** report: check queries and pages getting impressions; align titles/descriptions of pages with impressions but low clicks.
- Ask happy clients for Google reviews (see `docs/TESTIMONIALS.md`).

## Indexable URLs: 319

### Core pages (7)

- https://www.vallisglobal.in/
- https://www.vallisglobal.in/about/
- https://www.vallisglobal.in/contact/
- https://www.vallisglobal.in/gallery/
- https://www.vallisglobal.in/hospitality-projects/
- https://www.vallisglobal.in/privacy-policies/
- https://www.vallisglobal.in/products/

### Collection pages (16)

- https://www.vallisglobal.in/products/door-accessories/
- https://www.vallisglobal.in/products/door-closers/
- https://www.vallisglobal.in/products/door-hardware/
- https://www.vallisglobal.in/products/fhc-doors/
- https://www.vallisglobal.in/products/floor-springs/
- https://www.vallisglobal.in/products/furniture-hardware/
- https://www.vallisglobal.in/products/glass-door-handles/
- https://www.vallisglobal.in/products/glass-fittings/
- https://www.vallisglobal.in/products/glass-railings/
- https://www.vallisglobal.in/products/hotel-digital-locks/
- https://www.vallisglobal.in/products/locks-cylinders/
- https://www.vallisglobal.in/products/panic-bars/
- https://www.vallisglobal.in/products/shower-cubicles/
- https://www.vallisglobal.in/products/shower-hardware/
- https://www.vallisglobal.in/products/spider-fittings/
- https://www.vallisglobal.in/products/upvc-windows/

### Product pages (296)

<details><summary><b>door-accessories</b> — 20 URLs</summary>

- https://www.vallisglobal.in/products/door-accessories/vdds-011/
- https://www.vallisglobal.in/products/door-accessories/vl-1401/
- https://www.vallisglobal.in/products/door-accessories/vl-1402/
- https://www.vallisglobal.in/products/door-accessories/vl-1403/
- https://www.vallisglobal.in/products/door-accessories/vl-1405/
- https://www.vallisglobal.in/products/door-accessories/vl-1406/
- https://www.vallisglobal.in/products/door-accessories/vl-1407/
- https://www.vallisglobal.in/products/door-accessories/vl-1408/
- https://www.vallisglobal.in/products/door-accessories/vl-1409/
- https://www.vallisglobal.in/products/door-accessories/vl-1410/
- https://www.vallisglobal.in/products/door-accessories/vl-1411/
- https://www.vallisglobal.in/products/door-accessories/vl-1412/
- https://www.vallisglobal.in/products/door-accessories/vl-1413/
- https://www.vallisglobal.in/products/door-accessories/vl-1414/
- https://www.vallisglobal.in/products/door-accessories/vl-1415/
- https://www.vallisglobal.in/products/door-accessories/vl-1416/
- https://www.vallisglobal.in/products/door-accessories/vl-1417/
- https://www.vallisglobal.in/products/door-accessories/vl-1418/
- https://www.vallisglobal.in/products/door-accessories/vl-1419/
- https://www.vallisglobal.in/products/door-accessories/vl-1501/

</details>

<details><summary><b>door-closers</b> — 7 URLs</summary>

- https://www.vallisglobal.in/products/door-closers/vsdc-1101/
- https://www.vallisglobal.in/products/door-closers/vsdc-1102/
- https://www.vallisglobal.in/products/door-closers/vsdc-1103/
- https://www.vallisglobal.in/products/door-closers/vsdc-1104/
- https://www.vallisglobal.in/products/door-closers/vsdc-1105/
- https://www.vallisglobal.in/products/door-closers/vsdc-1106/
- https://www.vallisglobal.in/products/door-closers/vsdc-1107/

</details>

<details><summary><b>door-hardware</b> — 50 URLs</summary>

- https://www.vallisglobal.in/products/door-hardware/vbl-251/
- https://www.vallisglobal.in/products/door-hardware/vbl-255/
- https://www.vallisglobal.in/products/door-hardware/vdh-01/
- https://www.vallisglobal.in/products/door-hardware/vdh-02/
- https://www.vallisglobal.in/products/door-hardware/vdh-03/
- https://www.vallisglobal.in/products/door-hardware/vdh-04/
- https://www.vallisglobal.in/products/door-hardware/vdh-05/
- https://www.vallisglobal.in/products/door-hardware/vdh-06/
- https://www.vallisglobal.in/products/door-hardware/vdh-07/
- https://www.vallisglobal.in/products/door-hardware/vhlh-01/
- https://www.vallisglobal.in/products/door-hardware/vhlh-02/
- https://www.vallisglobal.in/products/door-hardware/vhlh-03/
- https://www.vallisglobal.in/products/door-hardware/vhlh-04/
- https://www.vallisglobal.in/products/door-hardware/vhlh-05/
- https://www.vallisglobal.in/products/door-hardware/vhlh-06/
- https://www.vallisglobal.in/products/door-hardware/vhlh-07/
- https://www.vallisglobal.in/products/door-hardware/vhlh-08/
- https://www.vallisglobal.in/products/door-hardware/vhlh-09/
- https://www.vallisglobal.in/products/door-hardware/vhlh-10/
- https://www.vallisglobal.in/products/door-hardware/vhlh-101/
- https://www.vallisglobal.in/products/door-hardware/vhlh-102/
- https://www.vallisglobal.in/products/door-hardware/vhlh-103/
- https://www.vallisglobal.in/products/door-hardware/vhlh-104/
- https://www.vallisglobal.in/products/door-hardware/vhlh-105/
- https://www.vallisglobal.in/products/door-hardware/vhlh-106/
- https://www.vallisglobal.in/products/door-hardware/vhlh-107/
- https://www.vallisglobal.in/products/door-hardware/vhlh-108/
- https://www.vallisglobal.in/products/door-hardware/vhlh-109/
- https://www.vallisglobal.in/products/door-hardware/vhlh-110/
- https://www.vallisglobal.in/products/door-hardware/vhlh-111/
- https://www.vallisglobal.in/products/door-hardware/vhlh-112/
- https://www.vallisglobal.in/products/door-hardware/vhlh-113/
- https://www.vallisglobal.in/products/door-hardware/vsmh-256/
- https://www.vallisglobal.in/products/door-hardware/vsmh-257/
- https://www.vallisglobal.in/products/door-hardware/vsmh-258/
- https://www.vallisglobal.in/products/door-hardware/vsmh-259/
- https://www.vallisglobal.in/products/door-hardware/vsmh-260/
- https://www.vallisglobal.in/products/door-hardware/vsmh-261/
- https://www.vallisglobal.in/products/door-hardware/vsmh-262/
- https://www.vallisglobal.in/products/door-hardware/vsmh-263/
- https://www.vallisglobal.in/products/door-hardware/vsmh-264/
- https://www.vallisglobal.in/products/door-hardware/vsmh-265/
- https://www.vallisglobal.in/products/door-hardware/vsmh-266/
- https://www.vallisglobal.in/products/door-hardware/vsmh-267/
- https://www.vallisglobal.in/products/door-hardware/vsmh-268/
- https://www.vallisglobal.in/products/door-hardware/vsmh-269/
- https://www.vallisglobal.in/products/door-hardware/vsmh-270/
- https://www.vallisglobal.in/products/door-hardware/vsmh-271/
- https://www.vallisglobal.in/products/door-hardware/vsmh-272/
- https://www.vallisglobal.in/products/door-hardware/vsmh-273/

</details>

<details><summary><b>fhc-doors</b> — 4 URLs</summary>

- https://www.vallisglobal.in/products/fhc-doors/fhc-100/
- https://www.vallisglobal.in/products/fhc-doors/fhc-200/
- https://www.vallisglobal.in/products/fhc-doors/fhc-200d/
- https://www.vallisglobal.in/products/fhc-doors/lv-200/

</details>

<details><summary><b>floor-springs</b> — 5 URLs</summary>

- https://www.vallisglobal.in/products/floor-springs/vfs-72/
- https://www.vallisglobal.in/products/floor-springs/vfs-80/
- https://www.vallisglobal.in/products/floor-springs/vfs-82/
- https://www.vallisglobal.in/products/floor-springs/vfs-92/
- https://www.vallisglobal.in/products/floor-springs/vfs-94/

</details>

<details><summary><b>furniture-hardware</b> — 13 URLs</summary>

- https://www.vallisglobal.in/products/furniture-hardware/vl-1801/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1802/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1803/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1804/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1805/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1806/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1807/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1808/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1809/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1810/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1811/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1812/
- https://www.vallisglobal.in/products/furniture-hardware/vl-1813/

</details>

<details><summary><b>glass-door-handles</b> — 16 URLs</summary>

- https://www.vallisglobal.in/products/glass-door-handles/vdo-408/
- https://www.vallisglobal.in/products/glass-door-handles/vdsh-402/
- https://www.vallisglobal.in/products/glass-door-handles/vgb-416/
- https://www.vallisglobal.in/products/glass-door-handles/vhdo-412/
- https://www.vallisglobal.in/products/glass-door-handles/vhlo-411/
- https://www.vallisglobal.in/products/glass-door-handles/vho-413/
- https://www.vallisglobal.in/products/glass-door-handles/vhp-415/
- https://www.vallisglobal.in/products/glass-door-handles/vhsh-401/
- https://www.vallisglobal.in/products/glass-door-handles/vlo-410/
- https://www.vallisglobal.in/products/glass-door-handles/vosh-405/
- https://www.vallisglobal.in/products/glass-door-handles/vph-404/
- https://www.vallisglobal.in/products/glass-door-handles/vphl-403/
- https://www.vallisglobal.in/products/glass-door-handles/vpsd-414/
- https://www.vallisglobal.in/products/glass-door-handles/vsd-407/
- https://www.vallisglobal.in/products/glass-door-handles/vsd-409/
- https://www.vallisglobal.in/products/glass-door-handles/vssh-406/

</details>

<details><summary><b>glass-fittings</b> — 29 URLs</summary>

- https://www.vallisglobal.in/products/glass-fittings/vgcf-3001/
- https://www.vallisglobal.in/products/glass-fittings/vgcf-3002/
- https://www.vallisglobal.in/products/glass-fittings/vgcf-3003/
- https://www.vallisglobal.in/products/glass-fittings/vgcf-3004/
- https://www.vallisglobal.in/products/glass-fittings/vgsh-500/
- https://www.vallisglobal.in/products/glass-fittings/vgsh-501/
- https://www.vallisglobal.in/products/glass-fittings/vgsh-502/
- https://www.vallisglobal.in/products/glass-fittings/vgsh-503/
- https://www.vallisglobal.in/products/glass-fittings/vgsh-504/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-505/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-506/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-507/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-508/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-509/
- https://www.vallisglobal.in/products/glass-fittings/vgsl-510/
- https://www.vallisglobal.in/products/glass-fittings/vpf-201/
- https://www.vallisglobal.in/products/glass-fittings/vpf-202/
- https://www.vallisglobal.in/products/glass-fittings/vpf-203/
- https://www.vallisglobal.in/products/glass-fittings/vpf-204/
- https://www.vallisglobal.in/products/glass-fittings/vpf-205/
- https://www.vallisglobal.in/products/glass-fittings/vpf-206/
- https://www.vallisglobal.in/products/glass-fittings/vpf-207/
- https://www.vallisglobal.in/products/glass-fittings/vpf-208/
- https://www.vallisglobal.in/products/glass-fittings/vpf-209/
- https://www.vallisglobal.in/products/glass-fittings/vpf-210/
- https://www.vallisglobal.in/products/glass-fittings/vpf-211/
- https://www.vallisglobal.in/products/glass-fittings/vpf-212/
- https://www.vallisglobal.in/products/glass-fittings/vpf-213/
- https://www.vallisglobal.in/products/glass-fittings/vpf-214/

</details>

<details><summary><b>glass-railings</b> — 48 URLs</summary>

- https://www.vallisglobal.in/products/glass-railings/vl-2101/
- https://www.vallisglobal.in/products/glass-railings/vl-2102/
- https://www.vallisglobal.in/products/glass-railings/vl-2103/
- https://www.vallisglobal.in/products/glass-railings/vl-2104/
- https://www.vallisglobal.in/products/glass-railings/vl-2105/
- https://www.vallisglobal.in/products/glass-railings/vl-2106/
- https://www.vallisglobal.in/products/glass-railings/vl-2107/
- https://www.vallisglobal.in/products/glass-railings/vl-2108/
- https://www.vallisglobal.in/products/glass-railings/vl-2109/
- https://www.vallisglobal.in/products/glass-railings/vl-2110/
- https://www.vallisglobal.in/products/glass-railings/vl-2111/
- https://www.vallisglobal.in/products/glass-railings/vl-2112/
- https://www.vallisglobal.in/products/glass-railings/vl-2113/
- https://www.vallisglobal.in/products/glass-railings/vl-2114/
- https://www.vallisglobal.in/products/glass-railings/vl-2115/
- https://www.vallisglobal.in/products/glass-railings/vl-2116/
- https://www.vallisglobal.in/products/glass-railings/vl-2117/
- https://www.vallisglobal.in/products/glass-railings/vl-2118/
- https://www.vallisglobal.in/products/glass-railings/vl-2119/
- https://www.vallisglobal.in/products/glass-railings/vl-2120/
- https://www.vallisglobal.in/products/glass-railings/vl-2121/
- https://www.vallisglobal.in/products/glass-railings/vl-2122/
- https://www.vallisglobal.in/products/glass-railings/vl-2123/
- https://www.vallisglobal.in/products/glass-railings/vl-2124/
- https://www.vallisglobal.in/products/glass-railings/vl-2125/
- https://www.vallisglobal.in/products/glass-railings/vl-2126/
- https://www.vallisglobal.in/products/glass-railings/vl-2127/
- https://www.vallisglobal.in/products/glass-railings/vl-2128/
- https://www.vallisglobal.in/products/glass-railings/vl-2129/
- https://www.vallisglobal.in/products/glass-railings/vl-2130/
- https://www.vallisglobal.in/products/glass-railings/vl-2131/
- https://www.vallisglobal.in/products/glass-railings/vl-2132/
- https://www.vallisglobal.in/products/glass-railings/vl-2133/
- https://www.vallisglobal.in/products/glass-railings/vl-2134/
- https://www.vallisglobal.in/products/glass-railings/vl-2135/
- https://www.vallisglobal.in/products/glass-railings/vl-2136/
- https://www.vallisglobal.in/products/glass-railings/vl-2137/
- https://www.vallisglobal.in/products/glass-railings/vl-2138/
- https://www.vallisglobal.in/products/glass-railings/vl-2139/
- https://www.vallisglobal.in/products/glass-railings/vl-2140/
- https://www.vallisglobal.in/products/glass-railings/vl-2141/
- https://www.vallisglobal.in/products/glass-railings/vl-2142/
- https://www.vallisglobal.in/products/glass-railings/vl-2143/
- https://www.vallisglobal.in/products/glass-railings/vl-2144/
- https://www.vallisglobal.in/products/glass-railings/vl-2145/
- https://www.vallisglobal.in/products/glass-railings/vl-2146/
- https://www.vallisglobal.in/products/glass-railings/vrs-101/
- https://www.vallisglobal.in/products/glass-railings/vrs-102/

</details>

<details><summary><b>hotel-digital-locks</b> — 9 URLs</summary>

- https://www.vallisglobal.in/products/hotel-digital-locks/vac-14/
- https://www.vallisglobal.in/products/hotel-digital-locks/vac-15/
- https://www.vallisglobal.in/products/hotel-digital-locks/vac-16/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-07/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-09/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-10/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-11/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-12/
- https://www.vallisglobal.in/products/hotel-digital-locks/vacs-13/

</details>

<details><summary><b>locks-cylinders</b> — 24 URLs</summary>

- https://www.vallisglobal.in/products/locks-cylinders/vhmdl-1201/
- https://www.vallisglobal.in/products/locks-cylinders/vhmdl-1202/
- https://www.vallisglobal.in/products/locks-cylinders/vhmdl-1203/
- https://www.vallisglobal.in/products/locks-cylinders/vhmdl-1204/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1701/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1702/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1703/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1704/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1705/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1706/
- https://www.vallisglobal.in/products/locks-cylinders/vlc-1707/
- https://www.vallisglobal.in/products/locks-cylinders/vscl-1001/
- https://www.vallisglobal.in/products/locks-cylinders/vscl-1002/
- https://www.vallisglobal.in/products/locks-cylinders/vscl-1003/
- https://www.vallisglobal.in/products/locks-cylinders/vscl-1004/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-111/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-112/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-113/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-114/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-115/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-116/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-117/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-118/
- https://www.vallisglobal.in/products/locks-cylinders/vsl-119/

</details>

<details><summary><b>panic-bars</b> — 6 URLs</summary>

- https://www.vallisglobal.in/products/panic-bars/vpb-190/
- https://www.vallisglobal.in/products/panic-bars/vpb-193/
- https://www.vallisglobal.in/products/panic-bars/vpb-195/
- https://www.vallisglobal.in/products/panic-bars/vpt-200/
- https://www.vallisglobal.in/products/panic-bars/vpt-201/
- https://www.vallisglobal.in/products/panic-bars/vvr-197/

</details>

<details><summary><b>shower-cubicles</b> — 3 URLs</summary>

- https://www.vallisglobal.in/products/shower-cubicles/shower-corner/
- https://www.vallisglobal.in/products/shower-cubicles/shower-hinged/
- https://www.vallisglobal.in/products/shower-cubicles/shower-sliding/

</details>

<details><summary><b>shower-hardware</b> — 45 URLs</summary>

- https://www.vallisglobal.in/products/shower-hardware/qgh-01/
- https://www.vallisglobal.in/products/shower-hardware/qgh-02/
- https://www.vallisglobal.in/products/shower-hardware/vhss-540/
- https://www.vallisglobal.in/products/shower-hardware/vhss-550/
- https://www.vallisglobal.in/products/shower-hardware/vhss-560/
- https://www.vallisglobal.in/products/shower-hardware/vhss-570/
- https://www.vallisglobal.in/products/shower-hardware/vsa-90/
- https://www.vallisglobal.in/products/shower-hardware/vsa-91/
- https://www.vallisglobal.in/products/shower-hardware/vsa-92/
- https://www.vallisglobal.in/products/shower-hardware/vsa-93/
- https://www.vallisglobal.in/products/shower-hardware/vsa-94/
- https://www.vallisglobal.in/products/shower-hardware/vsa-95/
- https://www.vallisglobal.in/products/shower-hardware/vsa-96/
- https://www.vallisglobal.in/products/shower-hardware/vsa-97/
- https://www.vallisglobal.in/products/shower-hardware/vsa-98/
- https://www.vallisglobal.in/products/shower-hardware/vsa-99/
- https://www.vallisglobal.in/products/shower-hardware/vsh-703/
- https://www.vallisglobal.in/products/shower-hardware/vsh-704/
- https://www.vallisglobal.in/products/shower-hardware/vsh-705/
- https://www.vallisglobal.in/products/shower-hardware/vsh-706/
- https://www.vallisglobal.in/products/shower-hardware/vsh-707/
- https://www.vallisglobal.in/products/shower-hardware/vsh-708/
- https://www.vallisglobal.in/products/shower-hardware/vsh-709/
- https://www.vallisglobal.in/products/shower-hardware/vsh-710/
- https://www.vallisglobal.in/products/shower-hardware/vsh-711/
- https://www.vallisglobal.in/products/shower-hardware/vsh-712/
- https://www.vallisglobal.in/products/shower-hardware/vsh-713/
- https://www.vallisglobal.in/products/shower-hardware/vsh-714/
- https://www.vallisglobal.in/products/shower-hardware/vsh-715/
- https://www.vallisglobal.in/products/shower-hardware/vsh-716/
- https://www.vallisglobal.in/products/shower-hardware/vsh-717/
- https://www.vallisglobal.in/products/shower-hardware/vsh-720/
- https://www.vallisglobal.in/products/shower-hardware/vsh-730/
- https://www.vallisglobal.in/products/shower-hardware/vsh-740/
- https://www.vallisglobal.in/products/shower-hardware/vsh-750/
- https://www.vallisglobal.in/products/shower-hardware/vsh-760/
- https://www.vallisglobal.in/products/shower-hardware/vsh-770/
- https://www.vallisglobal.in/products/shower-hardware/vsh-780/
- https://www.vallisglobal.in/products/shower-hardware/vsh-790/
- https://www.vallisglobal.in/products/shower-hardware/vsh-800/
- https://www.vallisglobal.in/products/shower-hardware/vsh-810/
- https://www.vallisglobal.in/products/shower-hardware/vsh-820/
- https://www.vallisglobal.in/products/shower-hardware/vsh-830/
- https://www.vallisglobal.in/products/shower-hardware/vsh-850/
- https://www.vallisglobal.in/products/shower-hardware/vsh-860/

</details>

<details><summary><b>spider-fittings</b> — 13 URLs</summary>

- https://www.vallisglobal.in/products/spider-fittings/vsf-010/
- https://www.vallisglobal.in/products/spider-fittings/vsf-020/
- https://www.vallisglobal.in/products/spider-fittings/vsf-30/
- https://www.vallisglobal.in/products/spider-fittings/vsf-40/
- https://www.vallisglobal.in/products/spider-fittings/vsf-91/
- https://www.vallisglobal.in/products/spider-fittings/vsf-92/
- https://www.vallisglobal.in/products/spider-fittings/vsf-93/
- https://www.vallisglobal.in/products/spider-fittings/vsf-94/
- https://www.vallisglobal.in/products/spider-fittings/vsf-95/
- https://www.vallisglobal.in/products/spider-fittings/vsf-96/
- https://www.vallisglobal.in/products/spider-fittings/vsf-97/
- https://www.vallisglobal.in/products/spider-fittings/vsf-98/
- https://www.vallisglobal.in/products/spider-fittings/vsf-99/

</details>

<details><summary><b>upvc-windows</b> — 4 URLs</summary>

- https://www.vallisglobal.in/products/upvc-windows/upvc-casement/
- https://www.vallisglobal.in/products/upvc-windows/upvc-french/
- https://www.vallisglobal.in/products/upvc-windows/upvc-slide-fold/
- https://www.vallisglobal.in/products/upvc-windows/upvc-sliding/

</details>

