"""Create transparent logo variants from the supplied BUILDMART INDIA logo (the original file is untouched).

- logo-reversed.webp : gold eagle + ivory wordmark, for navy backgrounds
- logo-transparent.webp : original colours on a transparent background
- eagle-mark.webp : the gold eagle alone, for the loader and compact placements
"""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
brand = root / 'public/images/brand'
src = np.asarray(Image.open(brand / 'logo-original.jpeg').convert('RGB')).astype(np.float32)

GOLD = np.array([196, 160, 92], np.float32)
NAVY = np.array([22, 36, 72], np.float32)
IVORY = np.array([246, 241, 231], np.float32)

r, g, b = src[..., 0], src[..., 1], src[..., 2]
is_gold = (r - b) > 12
alpha_gold = np.clip(((255 - src) / (255 - GOLD)).mean(axis=2), 0, 1)
alpha_navy = np.clip(((255 - src) / (255 - NAVY)).mean(axis=2), 0, 1)
alpha = np.where(is_gold, alpha_gold, alpha_navy)
alpha = np.clip((alpha - 0.04) / 0.96, 0, 1)  # remove JPEG noise in the white field


def save(colour_gold, colour_text, name, crop=None):
    rgb = np.where(is_gold[..., None], colour_gold, colour_text)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA')
    if crop:
        im = im.crop(crop)
    im = im.crop(im.getbbox())
    im.save(brand / name, 'WEBP', quality=92, method=6)
    print(name, im.size)


save(GOLD, IVORY, 'logo-reversed.webp')
save(GOLD, NAVY, 'logo-transparent.webp')
save(GOLD, GOLD, 'eagle-mark.webp', crop=(0, 0, src.shape[1], 225))
