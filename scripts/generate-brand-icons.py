"""Generate favicons, app icons and the 1200x630 social image from the VALLIS "V" mark.

Usage: python scripts/generate-brand-icons.py
Sources: public/images/brand/vallis-mark.webp and vallis-logo.webp (transparent, gold).
Outputs go to public/ (favicons, manifest icons) and public/images/brand/ (og-image, square logo).
"""
import base64
import io
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
public = root / 'public'
brand = public / 'images' / 'brand'
NAVY = (3, 13, 26, 255)
GOLD = (196, 160, 92, 255)
IVORY = (247, 243, 236, 255)

mark = Image.open(brand / 'vallis-mark.webp').convert('RGBA')
mark = mark.crop(mark.getbbox())
logo = Image.open(brand / 'vallis-logo.webp').convert('RGBA')
logo = logo.crop(logo.getbbox())


def icon(size: int, padding: float = 0.16, radius: float = 0.0) -> Image.Image:
    """The gold V mark centred on a solid navy square (readable at 16-48px)."""
    scale = 4  # supersample for crisp edges
    big = size * scale
    canvas = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * radius), fill=NAVY)
    inner = int(big * (1 - 2 * padding))
    m = mark.copy()
    m.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(m, ((big - m.width) // 2, (big - m.height) // 2 + int(big * 0.02)))
    return canvas.resize((size, size), Image.LANCZOS)


def save_png(img: Image.Image, path: Path) -> None:
    img.save(path, 'PNG', optimize=True)
    print(f'wrote {path.relative_to(root)} ({path.stat().st_size // 1024} KB)')


save_png(icon(48, 0.12), public / 'favicon-48x48.png')
save_png(icon(96, 0.12), public / 'favicon-96x96.png')
save_png(icon(180, 0.16), public / 'apple-touch-icon.png')
save_png(icon(192, 0.16), public / 'web-app-manifest-192x192.png')
save_png(icon(512, 0.16), public / 'web-app-manifest-512x512.png')
save_png(icon(512, 0.16), brand / 'vallis-logo-square-512.png')

ico_sizes = [(16, 16), (32, 32), (48, 48)]
icon(48, 0.1).save(public / 'favicon.ico', format='ICO', sizes=ico_sizes)
print('wrote public/favicon.ico (16/32/48)')

# favicon.svg: rounded navy tile with the raster mark embedded (keeps the exact brand artwork).
buf = io.BytesIO()
icon(128, 0.14, radius=0.18).save(buf, 'PNG', optimize=True)
data = base64.b64encode(buf.getvalue()).decode()
(public / 'favicon.svg').write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><image width="128" height="128" href="data:image/png;base64,{data}"/></svg>\n',
    encoding='utf-8',
)
print('wrote public/favicon.svg')

# 1200x630 Open Graph / Twitter image.
W, H = 1200, 630
og = Image.new('RGBA', (W, H), NAVY)
draw = ImageDraw.Draw(og)
draw.rectangle((40, 40, W - 41, H - 41), outline=(196, 160, 92, 110), width=2)
lg = logo.copy()
lg.thumbnail((520, 330), Image.LANCZOS)
og.alpha_composite(lg, ((W - lg.width) // 2, 92))
fonts = Path('C:/Windows/Fonts')
try:
    serif = ImageFont.truetype(str(fonts / 'georgiai.ttf'), 33)
except OSError:
    serif = ImageFont.load_default()
line = 'Precision-engineered architectural hardware for luxury spaces'
tw = draw.textlength(line, font=serif)
draw.text(((W - tw) / 2, 92 + lg.height + 52), line, font=serif, fill=IVORY)
og.convert('RGB').save(brand / 'og-image.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
print(f'wrote public/images/brand/og-image.jpg ({(brand / "og-image.jpg").stat().st_size // 1024} KB)')
