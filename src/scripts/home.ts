// Homepage interactions: "Why choose" showcase, sector hover, process storytelling.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n + 1).padStart(2, '0');

/* ---------- Why choose: selectable, auto-advancing showcase ---------- */
function initWhy() {
  const root = document.querySelector<HTMLElement>('[data-why]');
  if (!root) return;
  const items = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-why-item]'));
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('[data-why-image]'));
  const caption = root.querySelector<HTMLElement>('[data-why-caption]');
  const countEl = root.querySelector<HTMLElement>('[data-why-count]');
  const INTERVAL = 5600;
  let index = 0;
  let timer = 0;
  let inView = false;
  let paused = false;
  let userChose = false;

  const show = (i: number) => {
    index = i;
    items.forEach((item, n) => {
      item.classList.toggle('is-active', n === i);
      item.setAttribute('aria-pressed', String(n === i));
    });
    images.forEach((img, n) => img.classList.toggle('is-active', n === i));
    if (caption) caption.textContent = images[i]?.dataset.caption || '';
    if (countEl) countEl.textContent = `${pad(i)} / ${pad(items.length - 1)}`;
    root.style.setProperty('--why-duration', `${INTERVAL}ms`);
    // restart the progress bar animation
    items[i]?.classList.remove('is-timing');
    void items[i]?.offsetWidth;
    if (!reduce && !userChose && inView && !paused) items[i]?.classList.add('is-timing');
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (reduce || userChose || !inView || paused) {
      items.forEach((item) => item.classList.remove('is-timing'));
      return;
    }
    items[index]?.classList.add('is-timing');
    timer = window.setTimeout(() => {
      show((index + 1) % items.length);
      schedule();
    }, INTERVAL);
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      userChose = true;
      show(i);
      schedule();
    });
    item.addEventListener('pointerenter', (e) => {
      if ((e as PointerEvent).pointerType === 'mouse') show(i);
    });
  });
  root.addEventListener('pointerenter', () => { paused = true; schedule(); });
  root.addEventListener('pointerleave', () => { paused = false; schedule(); });
  root.addEventListener('focusin', () => { paused = true; schedule(); });
  root.addEventListener('focusout', () => { paused = false; schedule(); });

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) images.forEach((img) => (img.loading = 'eager'));
      schedule();
    },
    { threshold: 0.35 },
  ).observe(root);
  show(0);
}

/* ---------- Spaces: hover/focus swaps the sticky image ---------- */
function initSectors() {
  const root = document.querySelector<HTMLElement>('[data-sectors]');
  if (!root) return;
  const items = Array.from(root.querySelectorAll<HTMLElement>('.sector'));
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('.sector-visual img'));
  const label = root.querySelector<HTMLElement>('[data-sector-label]');
  const activate = (index: number) => {
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    images.forEach((img, i) => img.classList.toggle('is-active', i === index));
    if (label) label.textContent = items[index]?.querySelector('h3')?.textContent || '';
  };
  items.forEach((item, i) => {
    item.addEventListener('pointerenter', () => activate(i));
    item.addEventListener('focusin', () => activate(i));
  });
  const warm = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        images.forEach((img) => (img.loading = 'eager'));
        warm.disconnect();
      }
    },
    { rootMargin: '400px' },
  );
  warm.observe(root);
}

/* ---------- Process: the step crossing the viewport centre drives the sticky image ---------- */
function initProcess() {
  const root = document.querySelector<HTMLElement>('[data-process]');
  if (!root) return;
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('[data-step-image]'));
  const badge = root.querySelector<HTMLElement>('[data-step-count]');
  const activate = (i: number) => {
    steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    images.forEach((img, n) => img.classList.toggle('is-active', n === i));
    if (badge) badge.textContent = pad(i);
  };
  const pick = () => {
    const mid = window.innerHeight * 0.55;
    let best = 0;
    let bestDist = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    activate(best);
  };
  let active = false;
  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) {
      images.forEach((img) => (img.loading = 'eager'));
      pick();
    }
  }).observe(root);
  window.addEventListener('scroll', () => active && pick(), { passive: true });
}

initWhy();
initSectors();
initProcess();
