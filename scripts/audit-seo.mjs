// SEO audit for the built site (dist/). Run `npm run build` first, then `npm run audit:seo`.
// Exits with code 1 when any issue is found.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const ORIGIN = 'https://www.vallisglobal.in';
const TITLE_MAX = 70; // "about 65": the client-supplied homepage title is 67 characters
const DESC = [70, 170];
const NOINDEX_EXPECTED = new Set(['/404.html', '/thank-you/']);
const REDIRECTS = new Set(JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')).redirects.map((r) => r.source));

const issues = [];
const warnings = [];
const issue = (page, msg) => issues.push(`${page}: ${msg}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const routeOf = (file) => {
  const rel = '/' + relative(DIST, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

const exists = (pathname) => {
  const clean = decodeURIComponent(pathname);
  if (REDIRECTS.has(pathname) || REDIRECTS.has(clean)) return true;
  if (clean.startsWith('/api/')) return true;
  const target = join(DIST, clean);
  if (clean.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) && statSync(target).isFile();
};

const titles = new Map();
const descriptions = new Map();
const indexable = new Set();
let linksChecked = 0;
let imagesChecked = 0;

for (const file of htmlFiles) {
  const route = routeOf(file);
  const root = parse(readFileSync(file, 'utf8'), { comment: false });
  const head = root.querySelector('head');
  const meta = (sel) => head?.querySelector(sel)?.getAttribute('content') ?? null;

  // Title & description
  const title = head?.querySelector('title')?.text.trim() ?? '';
  if (!title) issue(route, 'missing <title>');
  else if (title.length > TITLE_MAX) issue(route, `title is ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
  else if (title.length > 65) warnings.push(`${route}: title is ${title.length} chars`);
  const desc = meta('meta[name="description"]') ?? '';
  if (desc.length < DESC[0] || desc.length > DESC[1]) issue(route, `description is ${desc.length} chars (want ${DESC[0]}–${DESC[1]})`);

  // Robots & canonical
  const robots = meta('meta[name="robots"]') ?? '';
  const canonical = head?.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const isNoindex = robots.includes('noindex');
  if (NOINDEX_EXPECTED.has(route)) {
    if (robots !== 'noindex, follow') issue(route, `utility page robots should be "noindex, follow", got "${robots}"`);
  } else if (robots !== 'index, follow, max-image-preview:large') issue(route, `robots should be "index, follow, max-image-preview:large", got "${robots}"`);
  if (isNoindex) {
    if (canonical) issue(route, 'noindex page must not have a canonical');
  } else {
    indexable.add(route);
    titles.set(title, [...(titles.get(title) ?? []), route]);
    descriptions.set(desc, [...(descriptions.get(desc) ?? []), route]);
    if (canonical !== ORIGIN + route) issue(route, `canonical "${canonical}" is not self-referencing (${ORIGIN + route})`);
  }

  // Brand copy rule (Supplementary Positioning Guide): never use low-end wording.
  const banned = (root.querySelector('body')?.text ?? '').match(/\b(cheap|cheapest|discount(?:ed|s)?|budget|wholesale)\b/i);
  if (banned) issue(route, `low-end wording "${banned[0]}" on page`);

  // Headings: exactly one H1, no skipped levels
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1]));
  const h1s = headings.filter((l) => l === 1).length;
  if (h1s !== 1) issue(route, `${h1s} <h1> elements (want exactly 1)`);
  headings.reduce((prev, level) => {
    if (level > prev + 1) issue(route, `heading level skipped: h${prev} → h${level}`);
    return level;
  }, 1);

  // Open Graph / Twitter
  for (const prop of ['og:site_name', 'og:locale', 'og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'])
    if (!meta(`meta[property="${prop}"]`)) issue(route, `missing ${prop}`);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'])
    if (!meta(`meta[name="${name}"]`)) issue(route, `missing ${name}`);
  if (meta('meta[property="og:image:width"]') !== '1200' || meta('meta[property="og:image:height"]') !== '630') issue(route, 'og:image must be 1200×630');

  // Favicons & manifest
  for (const sel of ['link[rel="icon"][href="/favicon.ico"]', 'link[rel="icon"][href="/favicon.svg"]', 'link[rel="apple-touch-icon"]', 'link[rel="manifest"]'])
    if (!head?.querySelector(sel)) issue(route, `missing ${sel}`);

  // JSON-LD
  const ldBlocks = head?.querySelectorAll('script[type="application/ld+json"]') ?? [];
  const types = [];
  for (const block of ldBlocks) {
    const raw = block.innerHTML;
    if (raw.includes('<')) issue(route, 'JSON-LD contains an unescaped "<"');
    try {
      const data = JSON.parse(raw);
      for (const node of data['@graph'] ?? [data]) types.push(...[].concat(node['@type']));
    } catch (e) {
      issue(route, `invalid JSON-LD: ${e.message}`);
    }
  }
  if (!types.includes('Organization')) issue(route, 'JSON-LD missing Organization');
  if (!types.includes('WebSite')) issue(route, 'JSON-LD missing WebSite');
  if (!isNoindex && route !== '/' && !types.includes('BreadcrumbList')) issue(route, 'inner page missing BreadcrumbList JSON-LD');

  // Images
  for (const img of root.querySelectorAll('img')) {
    imagesChecked++;
    const src = img.getAttribute('src') ?? '';
    if (img.getAttribute('alt') === undefined) issue(route, `img without alt: ${src}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) issue(route, `img without width/height: ${src}`);
    if (src.startsWith('/') && !exists(src.split(/[?#]/)[0])) issue(route, `missing image ${src}`);
    for (const candidate of (img.getAttribute('srcset') ?? '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean))
      if (candidate.startsWith('/') && !exists(candidate)) issue(route, `missing srcset image ${candidate}`);
  }

  // Internal links
  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href || /^(https?:|mailto:|tel:|#|javascript:)/.test(href)) {
      if (href?.startsWith(ORIGIN)) issue(route, `absolute internal link ${href}`);
      continue;
    }
    linksChecked++;
    const url = new URL(href, ORIGIN + route);
    const path = url.pathname;
    if (!exists(path)) issue(route, `broken internal link ${href}`);
    const isFile = /\.[a-z0-9]+$/i.test(path);
    if (!isFile && !path.endsWith('/')) issue(route, `link without trailing slash ${href}`);
    if (/[A-Z_ ]|%20/.test(path)) issue(route, `URL not lowercase-hyphenated ${href}`);
  }
}

// Duplicates
for (const [title, routes] of titles) if (routes.length > 1) issues.push(`duplicate title "${title}" on ${routes.join(', ')}`);
for (const [, routes] of descriptions) if (routes.length > 1) issues.push(`duplicate description on ${routes.join(', ')}`);

// Sitemap must list exactly the indexable pages
const sitemapIndex = join(DIST, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) issues.push('dist/sitemap-index.xml missing');
else {
  const sitemapFiles = [...readFileSync(sitemapIndex, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const urls = new Set();
  for (const f of sitemapFiles) {
    const xml = readFileSync(join(DIST, f), 'utf8');
    for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
      urls.add(new URL(m[1]).pathname);
      if (!m[2]) issues.push(`sitemap entry without lastmod: ${m[1]}`);
    }
  }
  for (const r of indexable) if (!urls.has(r)) issues.push(`indexable page missing from sitemap: ${r}`);
  for (const u of urls) if (!indexable.has(u)) issues.push(`sitemap lists a non-indexable or missing page: ${u}`);
}

// robots.txt
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!/^Allow: \/$/m.test(robots) || /^Disallow: \/\S*/m.test(robots)) issues.push('robots.txt must allow everything and block nothing');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) issues.push('robots.txt missing Sitemap line');

// Favicon files
for (const f of ['favicon.ico', 'favicon.svg', 'favicon-48x48.png', 'favicon-96x96.png', 'apple-touch-icon.png', 'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png', 'site.webmanifest'])
  if (!existsSync(join(DIST, f))) issues.push(`missing /${f}`);

console.log(`SEO audit: ${htmlFiles.length} pages (${indexable.size} indexable), ${linksChecked} internal links, ${imagesChecked} images checked.`);
for (const w of warnings) console.log(`  note  ${w}`);
if (issues.length) {
  for (const i of issues) console.log(`  FAIL  ${i}`);
  console.log(`\n${issues.length} issue(s) found.`);
  process.exit(1);
}
console.log('No issues found.');
