// Mobile Lighthouse for the home page and one inner page.
// Usage: npm run lighthouse -- [baseUrl] [label]
//   npm run lighthouse -- http://127.0.0.1:4330 after   (local preview: `npm run preview -- --port 4330`)
//   npm run lighthouse -- https://www.vallisglobal.in live
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const base = (process.argv[2] ?? 'http://127.0.0.1:4330').replace(/\/$/, '');
const label = process.argv[3] ?? 'local';
const pages = { home: '/', inner: '/products/door-hardware/' };
mkdirSync('output/lighthouse', { recursive: true });

for (const [name, path] of Object.entries(pages)) {
  const out = `output/lighthouse/${label}-${name}.json`;
  execFileSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['lighthouse', base + path, '--quiet', '--chrome-flags=--headless=new', '--form-factor=mobile', '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${out}`],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );
  const r = JSON.parse(readFileSync(out, 'utf8'));
  const a = r.audits;
  const scores = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  console.log(
    `${label} ${name} ${path}`,
    scores,
    `LCP ${a['largest-contentful-paint'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue} · TBT ${a['total-blocking-time'].displayValue}`,
  );
}
