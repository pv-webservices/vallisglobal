// Build-time AI image generator (server-side only — never shipped to the browser).
// Usage:  node --env-file=.env scripts/image-generation/generate.mjs [asset-id ...] [--force] [--dry-run]
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ART_DIRECTION, GENERATION, IMAGE_SIZES, selectModel, selectQuality } from './config.mjs';
import { ASSETS } from './assets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const only = args.filter((a) => !a.startsWith('--'));

const exists = (file) => access(file).then(() => true, () => false);

async function requestImage(asset) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set. Add it to .env (never commit it).');
  const body = {
    model: selectModel(asset),
    prompt: `${asset.prompt}\n\n${ART_DIRECTION}`,
    size: IMAGE_SIZES[asset.orientation],
    quality: selectQuality(asset),
    n: 1,
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATION.requestTimeoutMs);
  try {
    const response = await fetch(GENERATION.endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`${response.status} ${json?.error?.message || response.statusText}`);
    const b64 = json?.data?.[0]?.b64_json;
    if (b64) return { buffer: Buffer.from(b64, 'base64'), model: body.model, quality: body.quality, size: body.size };
    const url = json?.data?.[0]?.url;
    if (!url) throw new Error('No image data in API response.');
    const download = await fetch(url, { signal: controller.signal });
    return { buffer: Buffer.from(await download.arrayBuffer()), model: body.model, quality: body.quality, size: body.size };
  } finally {
    clearTimeout(timer);
  }
}

async function writeVariants(asset, buffer) {
  const outDir = path.join(root, GENERATION.outputDir);
  await mkdir(outDir, { recursive: true });
  const base = sharp(buffer);
  const { width, height } = await base.metadata();
  const entries = [];
  for (const w of GENERATION.variantWidths.filter((w) => w < width)) {
    const file = `${asset.id}-w${w}.webp`;
    await sharp(buffer).resize({ width: w }).webp({ quality: GENERATION.webpQuality }).toFile(path.join(outDir, file));
    entries.push([`/images/generated/${file}`, w]);
  }
  const file = `${asset.id}.webp`;
  await sharp(buffer).webp({ quality: GENERATION.webpQuality }).toFile(path.join(outDir, file));
  entries.push([`/images/generated/${file}`, width]);
  return { src: `/images/generated/${file}`, width, height, srcset: entries.map(([u, w]) => `${u} ${w}w`).join(', ') };
}

async function updateManifest(results) {
  const file = path.join(root, 'src/data/image-manifest.json');
  const manifest = JSON.parse(await readFile(file, 'utf8'));
  for (const r of results) manifest[r.src] = { width: r.width, height: r.height, srcset: r.srcset };
  await writeFile(file, JSON.stringify(manifest, null, 2));
}

async function updateLog(results) {
  const file = path.join(root, 'scripts/image-generation/generation-log.json');
  const log = (await exists(file)) ? JSON.parse(await readFile(file, 'utf8')) : {};
  for (const r of results) log[r.id] = { placement: r.placement, alt: r.alt, model: r.model, quality: r.quality, size: r.size, generated: new Date().toISOString() };
  await writeFile(file, JSON.stringify(log, null, 2));
}

async function main() {
  const queue = ASSETS.filter((a) => only.length === 0 || only.includes(a.id));
  const rawDir = path.join(root, GENERATION.rawDir);
  await mkdir(rawDir, { recursive: true });
  const results = [];
  const failures = [];
  await Promise.all(
    queue.map(async (asset) => {
      const raw = path.join(rawDir, `${asset.id}.png`);
      const plan = `${asset.id} → ${selectModel(asset)} · ${selectQuality(asset)} · ${IMAGE_SIZES[asset.orientation]}`;
      if (dryRun) return console.log('[plan]', plan);
      try {
        let meta = { model: 'cached', quality: '-', size: '-' };
        let buffer;
        if (!force && (await exists(raw))) {
          buffer = await readFile(raw);
          console.log('[cached]', asset.id);
        } else {
          console.log('[request]', plan);
          const result = await requestImage(asset);
          buffer = result.buffer;
          meta = result;
          await writeFile(raw, buffer);
        }
        const variants = await writeVariants(asset, buffer);
        results.push({ ...asset, ...meta, ...variants });
        console.log('[done]', asset.id, `${variants.width}x${variants.height}`);
      } catch (error) {
        failures.push(asset.id);
        console.error('[failed]', asset.id, error.message);
      }
    }),
  );
  if (results.length) {
    await updateManifest(results);
    await updateLog(results.filter((r) => r.model !== 'cached'));
  }
  if (failures.length) {
    console.error(`Failed: ${failures.join(', ')}`);
    process.exitCode = 1;
  }
}

main();
