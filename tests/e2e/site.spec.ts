// Site-wide checks on the built output: axe (WCAG 2.1 AA) with 0 violations, no console errors,
// no failed requests, no horizontal scroll, keyboard/skip-link/focus behaviour and responsive layout.
import { test, expect, type Page } from '@playwright/test';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const DIST = join(process.cwd(), 'dist');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const ROUTES = walk(DIST)
  .filter((f) => f.endsWith('index.html'))
  .map((f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, ''))
  .sort();

async function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => problems.push(`failed: ${req.url()}`));
  page.on('response', (res) => res.status() >= 400 && problems.push(`HTTP ${res.status()}: ${res.url()}`));
  return problems;
}

async function axe(page: Page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    // @ts-expect-error axe is injected above
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
    return result.violations.map((v: { id: string; impact: string; nodes: { target: string[] }[] }) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  });
}

test.describe('every page', () => {
  for (const route of ROUTES) {
    test(`${route} — axe, console, requests, overflow`, async ({ page }) => {
      const problems = await collectProblems(page);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route, { waitUntil: 'load' });
      // Reveal all lazy content so images load and reveals settle before axe runs.
      await page.evaluate(async () => {
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'));
      });
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'horizontal scroll at 375px').toBeLessThanOrEqual(0);
      const broken = await page.evaluate(() =>
        Array.from(document.images).filter((img) => img.complete && img.naturalWidth === 0 && img.getBoundingClientRect().width > 0).map((img) => img.currentSrc || img.src),
      );
      expect(broken, 'broken images').toEqual([]);
      expect(await axe(page), 'axe violations').toEqual([]);
      expect(problems, 'console errors / failed requests').toEqual([]);
    });
  }

  test('/404.html renders the branded not-found page', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('h1')).toContainText('couldn’t be found');
    expect(await axe(page)).toEqual([]);
  });
});

test.describe('keyboard and motion', () => {
  test('first Tab focuses a visible skip link that moves focus to main', async ({ page }) => {
    await page.goto('/about/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('focused links and buttons show a visible focus indicator', async ({ page }) => {
    await page.goto('/contact/');
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const style = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0, shadow: cs.boxShadow !== 'none' };
      });
      expect(style.outline || style.shadow, `focus visible on ${style.tag}`).toBe(true);
    }
  });

  test('reduced motion disables the hero marquee animation', async ({ page }) => {
    await page.goto('/');
    const running = await page.evaluate(() => getComputedStyle(document.querySelector('.hero-run-track')!).animationName);
    expect(running).toBe('none');
  });
});

const WIDTHS = [320, 375, 768, 1024, 1440];
const KEY_PAGES = ['/', '/about/', '/products/', '/products/door-hardware/', '/products/door-hardware/vsmh-264/', '/hospitality-projects/', '/gallery/', '/contact/', '/thank-you/'];

test.describe('responsive layout', () => {
  for (const width of WIDTHS) {
    test(`no horizontal scroll and adequate tap targets at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of KEY_PAGES) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} overflow at ${width}px`).toBeLessThanOrEqual(0);
        // WCAG 2.2 target size (minimum): 24×24 CSS px, excluding inline links inside running text.
        const small = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') return false;
              if (el.closest('[aria-hidden="true"], .honeypot, [inert]')) return false;
              if (el.tagName === 'A' && el.closest('p, li > small, address, .form-error, label') && getComputedStyle(el).display === 'inline') return false; // WCAG 2.5.8 inline exception
              if (el.matches('input[type="checkbox"]')) return false; // wrapped in a full-width label
              return r.width < 24 || r.height < 24;
            })
            .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`),
        );
        expect(small, `${route} small tap targets at ${width}px`).toEqual([]);
      }
    });
  }
});
