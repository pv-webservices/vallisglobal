"""Add responsive srcset entries to src/data/image-manifest.json for every image in public/images
that has -w<width> variants on disk but no manifest entry (so pages stop serving full-size files).

Usage: python scripts/sync-image-manifest.py
"""
import json
import re
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
public = root / 'public'
manifest_path = root / 'src' / 'data' / 'image-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
VARIANT = re.compile(r'^(?P<base>.+)-w(?P<w>\d+)\.webp$')

added = 0
for base in sorted(public.joinpath('images').rglob('*.webp')):
    if VARIANT.match(base.name):
        continue
    url = '/' + base.relative_to(public).as_posix()
    if url in manifest:
        continue
    variants = []
    for v in base.parent.glob(f'{base.stem}-w*.webp'):
        m = VARIANT.match(v.name)
        if m and m['base'] == base.stem:
            variants.append((int(m['w']), '/' + v.relative_to(public).as_posix()))
    if not variants:
        continue
    with Image.open(base) as im:
        width, height = im.size
    entries = sorted(variants) + [(width, url)]
    manifest[url] = {
        'width': width,
        'height': height,
        'srcset': ', '.join(f'{src} {w}w' for w, src in entries if w <= width),
    }
    added += 1

manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'added {added} manifest entries')
