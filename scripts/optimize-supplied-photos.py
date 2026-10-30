"""Upscale, sharpen and convert the client-supplied photographs (WhatsApp JPEGs) to responsive WebP.

Sources live in source-assets/supplied-2026-10-31/ (not published) and are left untouched. Output goes to public/images/supplied/
and the responsive entries are merged into src/data/image-manifest.json.
"""
from pathlib import Path
import json
from PIL import Image, ImageFilter, ImageOps

root = Path(__file__).resolve().parents[1]
src_dir = root / 'source-assets/supplied-2026-10-31'
out_dir = root / 'public/images/supplied'
manifest_file = root / 'src/data/image-manifest.json'

# source file -> (output name, minimum long edge after upscaling)
PHOTOS = {
    'patch fittings doors-1.jpeg': ('patch-door-1', 1400),
    'patch fittings doors-2.jpeg': ('patch-door-2', 1400),
    'patch fittings doors-3.jpeg': ('patch-door-3', 1400),
    'patch fittings doors-4.jpeg': ('patch-door-4', 1400),
    'patch fittings doors-5.jpeg': ('patch-door-5', 1400),
    'patch fittings doors-6.jpeg': ('hero-patch-fittings', 2048),
    'shower-cubicles-1.jpeg': ('shower-cubicle-1', 2048),
    'shower-cubicles-2.jpeg': ('shower-cubicle-2', 1400),
    'shower-cubicles-3.jpeg': ('shower-cubicle-3', 1400),
    'shower-cubicles-4.jpeg': ('shower-cubicle-4', 1400),
    'shower-sliding.jpeg': ('shower-sliding', 1400),
    'Casement window and door in one Photo.jpeg': ('upvc-casement-door', 1400),
    'Upvc door with gorgenwar.jpeg': ('upvc-french-door', 1600),
    'upvc door-1.jpeg': ('upvc-sliding-door-1', 1400),
    'upvc door-2.jpeg': ('upvc-sliding-door-2', 1400),
    'upvc slid & fold.jpeg': ('upvc-slide-fold', 1400),
}
LOGOS = {'CPWD log.jpeg': 'client-cpwd', 'NBCC logo.jpeg': 'client-nbcc'}
WIDTHS = [320, 640, 960, 1280]
QUALITY = 84


def upscale(im: Image.Image, min_edge: int) -> Image.Image:
    scale = min_edge / max(im.size)
    if scale > 1:
        # Soften JPEG block noise first so the sharpening pass does not amplify it.
        im = im.filter(ImageFilter.GaussianBlur(0.4))
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    return ImageOps.autocontrast(im, cutoff=0.2, preserve_tone=True)


def trim_white(im: Image.Image, pad: int = 12) -> Image.Image:
    box = ImageOps.invert(im.convert('L')).point(lambda v: 255 if v > 18 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))


def save(im: Image.Image, name: str, manifest: dict) -> None:
    sizes = []
    for width in WIDTHS:
        if width < im.width:
            file = out_dir / f'{name}-w{width}.webp'
            im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS).save(file, 'WEBP', quality=QUALITY)
            sizes.append((f'/images/supplied/{file.name}', width))
    im.save(out_dir / f'{name}.webp', 'WEBP', quality=QUALITY)
    src = f'/images/supplied/{name}.webp'
    sizes.append((src, im.width))
    manifest[src] = {'width': im.width, 'height': im.height, 'srcset': ', '.join(f'{u} {w}w' for u, w in sizes)}


def main() -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
    for source, (name, min_edge) in PHOTOS.items():
        save(upscale(Image.open(src_dir / source).convert('RGB'), min_edge), name, manifest)
    for source, name in LOGOS.items():
        save(trim_white(Image.open(src_dir / source).convert('RGB')), name, manifest)
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print('Optimised', len(PHOTOS) + len(LOGOS), 'supplied images')


if __name__ == '__main__':
    main()
