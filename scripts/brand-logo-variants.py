"""Create transparent logo variants from the supplied VALLIS logo (public/vallis-website-logo.webp, untouched).

The source is a gold logo on a white field. Each pixel is un-blended from white so the gold keeps
its gradient and anti-aliased edges on any background.

- vallis-logo.webp            : stacked lockup (V mark, wordmark, descriptor) for the footer and menus
- vallis-logo-horizontal.webp : V mark beside the wordmark + descriptor, for the compact site header
- vallis-mark.webp            : the V mark alone, for the loader and compact placements
"""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
brand = root / 'public/images/brand'
src = np.asarray(Image.open(root / 'public/vallis-website-logo.webp').convert('RGB')).astype(np.float32)

# Alpha = how far a pixel is from white, scaled so the darkest gold becomes fully opaque.
distance = 255 - src.min(axis=2)
alpha = np.clip(distance / np.percentile(distance[distance > 40], 60), 0, 1)
alpha = np.clip((alpha - 0.05) / 0.95, 0, 1)  # remove compression noise in the white field
safe = np.maximum(alpha, 1e-3)[..., None]
colour = np.clip((src - (1 - alpha[..., None]) * 255) / safe, 0, 255)
logo = Image.fromarray(np.dstack([colour, alpha * 255]).astype(np.uint8), 'RGBA')


def rows_with_ink(im):
    """Return (start, end) row bands that contain visible pixels."""
    ink = np.asarray(im)[..., 3].max(axis=1) > 20
    bands, start = [], None
    for y, on in enumerate(ink):
        if on and start is None:
            start = y
        if not on and start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, len(ink)))
    return bands


def tight(im):
    return im.crop(im.getbbox())


def save(im, name):
    im.save(brand / name, 'WEBP', quality=92, method=6)
    print(name, im.size)


stacked = tight(logo)
save(stacked, 'vallis-logo.webp')

# Bands top to bottom: V mark, VALLIS wordmark, ARCHITECTURAL HARDWARE descriptor.
bands = rows_with_ink(stacked)
mark_band, word_band, desc_band = bands[0], bands[1], bands[-1]
mark = tight(stacked.crop((0, mark_band[0], stacked.width, mark_band[1])))
word = tight(stacked.crop((0, word_band[0], stacked.width, word_band[1])))
desc = tight(stacked.crop((0, desc_band[0], stacked.width, desc_band[1])))
save(mark, 'vallis-mark.webp')

# Horizontal lockup: mark at the height of wordmark + descriptor, separated by a measured gap.
text_gap = round(word.height * 0.22)
text_h = word.height + text_gap + desc.height
scale = text_h / mark.height
mark_small = mark.resize((round(mark.width * scale), text_h), Image.Resampling.LANCZOS)
gap = round(word.height * 0.55)
text_w = max(word.width, desc.width)
horizontal = Image.new('RGBA', (mark_small.width + gap + text_w, text_h), (0, 0, 0, 0))
horizontal.alpha_composite(mark_small, (0, 0))
x = mark_small.width + gap
horizontal.alpha_composite(word, (x + (text_w - word.width) // 2, 0))
horizontal.alpha_composite(desc, (x + (text_w - desc.width) // 2, word.height + text_gap))
save(horizontal, 'vallis-logo-horizontal.webp')
