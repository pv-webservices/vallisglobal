"""Remove flat white/light-grey studio backgrounds from extracted catalogue product shots so they sit
naturally on the website's ivory product stages. Originals are copied to tmp/cutout-originals first.
Only the background region connected to the image border is removed, so white product details survive."""
from pathlib import Path
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
cat = root / 'public/images/catalogue'
backup = root / 'tmp/cutout-originals'
backup.mkdir(parents=True, exist_ok=True)
NAMES = ['fhc-100', 'fhc-200', 'fhc-200d', 'lv-200', 'nimkro-p17-x1395', 'nimkro-p28-x2467',
         'vallis-p123-x4791', 'vallis-p123-x4792', 'vallis-p14-x403', 'vallis-p16-x469',
         'vallis-p61-x2131', 'vallis-p61-x2132', 'vallis-p62-x2160', 'vallis-p62-x2161',
         'vallis-p70-x2415', 'vallis-p78-x2667', 'vallis-p78-x2668', 'vallis-p78-x2669', 'vallis-p85-x2907']
SENTINEL = (255, 0, 255)

for name in NAMES:
    src = cat / f'{name}.webp'
    keep = backup / src.name
    if not keep.exists():
        shutil.copy2(src, keep)
    rgb = Image.open(keep).convert('RGB')
    w, h = rgb.size
    work = rgb.copy()
    seeds = [(x, 0) for x in range(0, w, 6)] + [(x, h - 1) for x in range(0, w, 6)] + \
            [(0, y) for y in range(0, h, 6)] + [(w - 1, y) for y in range(0, h, 6)]
    for seed in seeds:
        px = work.getpixel(seed)
        if px != SENTINEL and min(px) > 225:
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=22)
    bg = np.all(np.asarray(work) == SENTINEL, axis=2)
    mask = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = rgb.convert('RGBA')
    out.putalpha(mask)
    out.save(src, 'WEBP', quality=90)
    for variant in cat.glob(f'{name}-w*.webp'):
        width = int(variant.stem.rsplit('-w', 1)[1])
        out.resize((width, round(h * width / w)), Image.Resampling.LANCZOS).save(variant, 'WEBP', quality=88)
    print(name, f'{bg.mean():.0%} background removed')
