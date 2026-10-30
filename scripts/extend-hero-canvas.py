"""Widen a hero image by extending its calm left edge, so the subject sits clear of the headline.

Usage: python scripts/extend-hero-canvas.py hero-collection 1.6 1.25   (width ratio, height ratio[, left|right])
Writes public/images/generated/<id>-wide.webp (+ responsive variants) and updates the image manifest.
"""
import json
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

root = Path(__file__).resolve().parents[1]
out_dir = root / 'public/images/generated'
WIDTHS = [640, 960, 1280, 1920]
NAVY = (3, 13, 26)


def extend(im: Image.Image, ratio: float, vratio: float, side: str = 'left') -> Image.Image:
    """Edge-pad one side (left or right) and the bottom, blur the padding, then feather the original back in."""
    extra_x = round(im.width * (ratio - 1))
    extra_y = round(im.height * (vratio - 1))
    arr = np.asarray(im)
    pad_x = (extra_x, 0) if side == 'left' else (0, extra_x)
    padded = Image.fromarray(np.pad(arr, ((0, extra_y), pad_x, (0, 0)), mode='edge'))
    canvas = padded.filter(ImageFilter.GaussianBlur(28))
    blend = 280
    mask = Image.new('L', im.size, 255)
    draw = ImageDraw.Draw(mask)
    for i in range(blend):
        value = round(255 * i / blend)
        draw.line([(i, 0), (i, im.height)], fill=value)
    # Bottom feather (multiplied so the bottom-left corner fades on both axes).
    bottom = Image.new('L', im.size, 255)
    bdraw = ImageDraw.Draw(bottom)
    for i in range(blend):
        bdraw.line([(0, im.height - 1 - i), (im.width, im.height - 1 - i)], fill=round(255 * i / blend))
    mask = ImageChops.multiply(mask, bottom) if extra_y else mask
    if side == 'right':
        mask = ImageOps.mirror(mask)
    canvas.paste(im, (extra_x if side == 'left' else 0, 0), mask)
    if extra_y:
        # Settle the stretched floor into the site's deep navy so the padding reads as shadow.
        fade = Image.new('L', canvas.size, 0)
        fdraw = ImageDraw.Draw(fade)
        top = im.height - blend // 2
        for y in range(top, canvas.height):
            fdraw.line([(0, y), (canvas.width, y)], fill=round(225 * min(1, (y - top) / (canvas.height - top))))
        canvas = Image.composite(Image.new('RGB', canvas.size, NAVY), canvas, fade)
    return canvas


def main(asset_id: str, ratio: float, vratio: float, side: str) -> None:
    im = extend(Image.open(out_dir / f'{asset_id}.webp').convert('RGB'), ratio, vratio, side)
    name = f'{asset_id}-wide'
    sizes = []
    for width in WIDTHS:
        if width < im.width:
            file = out_dir / f'{name}-w{width}.webp'
            im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS).save(file, 'WEBP', quality=82)
            sizes.append((f'/images/generated/{file.name}', width))
    im.save(out_dir / f'{name}.webp', 'WEBP', quality=82)
    src = f'/images/generated/{name}.webp'
    sizes.append((src, im.width))
    manifest_file = root / 'src/data/image-manifest.json'
    manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
    manifest[src] = {'width': im.width, 'height': im.height, 'srcset': ', '.join(f'{u} {w}w' for u, w in sizes)}
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(src, im.size)


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 1.45, float(sys.argv[3]) if len(sys.argv) > 3 else 1.0, sys.argv[4] if len(sys.argv) > 4 else 'left')
