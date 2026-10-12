"""Crop MRW catalogue application photos to the photograph itself, removing transparent page
margins, page numbers and corner marks left over from PDF extraction. Originals are kept in
tmp/crop-originals; responsive variants are regenerated."""
from pathlib import Path
import shutil, sys
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
cat = root / 'public/images/catalogue'
backup = root / 'tmp/crop-originals'
backup.mkdir(parents=True, exist_ok=True)
INSET = 0.012  # trim a further 1.2% to drop any residual hairline or mark

for src in sorted(cat.glob('mrw-*.webp')):
    if '-w' in src.stem:
        continue
    keep = backup / src.name
    if not keep.exists():
        shutil.copy2(src, keep)
    im = Image.open(keep).convert('RGBA')
    white = Image.new('RGBA', im.size, (255, 255, 255, 255))
    white.alpha_composite(im)
    arr = np.asarray(white.convert('RGB')).astype(int)
    ink = (255 - arr).max(axis=2) > 14
    cols = np.where(ink.mean(axis=0) > 0.55)[0]
    rows = np.where(ink.mean(axis=1) > 0.55)[0]
    x0, x1, y0, y1 = cols.min(), cols.max(), rows.min(), rows.max()
    dx, dy = int((x1 - x0) * INSET), int((y1 - y0) * INSET)
    box = (x0 + dx, y0 + dy, x1 - dx, y1 - dy)
    crop = im.crop(box)
    # Transparent areas (e.g. a cut-out sky) are filled with a soft daylight gradient, not black.
    sky = np.linspace([214, 226, 236], [244, 246, 247], crop.height).astype(np.uint8)
    base = Image.fromarray(np.repeat(sky[:, None, :], crop.width, axis=1), 'RGB').convert('RGBA')
    base.alpha_composite(crop)
    out = base.convert('RGB')
    out.save(src, 'WEBP', quality=84)
    for variant in cat.glob(f'{src.stem}-w*.webp'):
        width = int(variant.stem.rsplit('-w', 1)[1])
        out.resize((width, round(out.height * width / out.width)), Image.Resampling.LANCZOS).save(variant, 'WEBP', quality=82)
    print(src.name, im.size, '->', out.size, box)
