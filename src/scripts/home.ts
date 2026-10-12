// Homepage interactions: cinematic hero timeline, "Why choose" showcase, sector hover, process storytelling.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const pad = (n: number) => String(n + 1).padStart(2, '0');

/* ---------- Hero: scroll progress → scene, copy and rail state ---------- */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || reduce) return;
  const scenes = Array.from(hero.querySelectorAll<HTMLElement>('[data-scene]'));
  const panels = Array.from(hero.querySelectorAll<HTMLElement>('[data-panel]'));
  const rail = Array.from(hero.querySelectorAll<HTMLButtonElement>('[data-goto]'));
  const counter = hero.querySelector<HTMLElement>('[data-counter]');
  const foot = hero.querySelector<HTMLElement>('.hero-foot');
  const count = scenes.length;
  const FADE = 0.3; // crossfade width, in chapter units
  const SPAN = count - 0.35; // the final chapter holds before the section releases
  let current = -1;

  const progress = () => {
    const total = hero.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-hero.getBoundingClientRect().top / total) : 0;
  };

  const render = () => {
    const p = progress();
    const seg = p * SPAN;
    hero.style.setProperty('--p', p.toFixed(4));
    hero.style.setProperty('--close', (clamp((p - 0.95) / 0.05) * 0.7).toFixed(3));

    scenes.forEach((scene, i) => {
      const fadeIn = i === 0 ? 1 : ease(clamp((seg - i + FADE / 2) / FADE));
      const push = clamp((seg - i + FADE / 2) / 1.3); // slow camera push through each chapter
      scene.style.opacity = fadeIn.toFixed(3);
      scene.style.transform = `scale(${(1.12 - push * 0.12).toFixed(4)})`;
    });

    panels.forEach((panel, i) => {
      // Each chapter fully exits (by i + 0.84) before the next enters (from i + 0.88): no overlapping copy.
      const start = i === 0 ? -1 : i - 0.12;
      const end = i === count - 1 ? Infinity : i + 0.7;
      const inT = i === 0 ? 1 : ease(clamp((seg - start) / 0.24));
      const outT = ease(clamp((seg - end) / 0.14));
      const opacity = Math.min(inT, 1 - outT);
      const y = (1 - inT) * 48 - outT * 56;
      panel.style.opacity = opacity.toFixed(3);
      panel.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      const visible = opacity > 0.05;
      panel.style.visibility = visible ? 'visible' : 'hidden';
      panel.toggleAttribute('inert', !visible);
    });

    const active = clamp(Math.round(seg - 0.2), 0, count - 1);
    if (active !== current) {
      current = active;
      rail.forEach((b, i) => (i === active ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
      if (counter) counter.textContent = pad(active);
    }
    if (foot) foot.style.opacity = (1 - clamp((p - 0.92) / 0.08)).toFixed(3);
  };

  rail.forEach((button) =>
    button.addEventListener('click', () => {
      const i = Number(button.dataset.goto);
      const total = hero.offsetHeight - window.innerHeight;
      const top = hero.offsetTop + ((i + 0.3) / SPAN) * total;
      window.scrollTo({ top: i === 0 ? hero.offsetTop : top, behavior: 'smooth' });
    }),
  );

  // Subtle pointer parallax on precise pointers only.
  if (matchMedia('(pointer: fine)').matches) {
    const layer = hero.querySelector<HTMLElement>('.hero-scenes');
    hero.addEventListener('pointermove', (e) => {
      layer?.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
      layer?.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
    });
  }

  render();
  window.addEventListener('scroll', render, { passive: true });
  window.addEventListener('resize', render);
}

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

initHero();
initWhy();
initSectors();
initProcess();
