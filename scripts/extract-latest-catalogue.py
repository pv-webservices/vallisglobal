"""Build the product range from the latest VALLIS catalogue (the edition with the VALLIS logo printed on
each product photograph).

For every product page the script pairs each model number with its product photograph, renders that
region of the page (so the printed logo is kept), removes the flat studio background and writes
`public/images/products/<slug>.webp`. Model, name and the "Key : value" specification lines are written
to `src/data/pdf-products.json`, which `src/data/catalogue.ts` turns into product pages.

    python scripts/extract-latest-catalogue.py            # extract
    python scripts/extract-latest-catalogue.py --sheet    # also write a review contact sheet to tmp/

Requires PyMuPDF, Pillow and numpy. Pairing fixes for unusual layouts live in OVERRIDES.
"""
from pathlib import Path
import io
import json
import re
import sys

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
PDF = root / 'source-assets/supplied-2026-10-31/vallis-logo latest.pdf'
OUT = root / 'public/images/products'
DATA = root / 'src/data/pdf-products.json'
ZOOM = 3

# Catalogue page ranges for each website collection (1-based, inclusive).
CATEGORY_PAGES = [
    ('hotel-digital-locks', 6, 20),
    ('locks-cylinders', 22, 24),
    ('door-hardware', 26, 37),
    ('locks-cylinders', 39, 46),
    ('door-accessories', 47, 50),
    ('glass-door-handles', 52, 59),
    ('spider-fittings', 61, 66),
    ('panic-bars', 68, 68),
    ('door-closers', 70, 71),
    ('floor-springs', 73, 75),
    ('glass-fittings', 77, 81),
    ('shower-hardware', 83, 100),
    ('glass-railings', 103, 108),
    ('glass-railings', 115, 115),
    ('glass-fittings', 117, 122),
    ('furniture-hardware', 131, 134),
]
SKIP_PAGES = {74}  # glass door package table repeats VPF 201

MODEL = re.compile(r'\b(VACS|VAC|VSL|VHLH|VBL|VSMH|VSCL|VHMDL|VLC|VL|VDDS|VHSH|VDSH|VPHL|VPH|VOSH|VSSH|VSD|VDO|VLO|'
                   r'VHLO|VHDO|VHO|VPSD|VHP|VGB|VSF|VPB|VPT|VVR|VSDC|VFS|VPF|VHSS|VSH|VSA|VRS|VGSH|VGSL|VGCF|QGH)'
                   r'\s*-?\s*(\d{2,4})\b')

# Default names when the catalogue gives only a model number.
DEFAULT_NAMES = {
    'VHLH': 'SS Lever Handle on Rose', 'VBL': 'Lever Handle on Rose', 'VSMH': 'Designer Lever Handle',
    'VL21': 'Glass Railing Spigot', 'VSF': 'Spider Fitting', 'VHSS': 'Shower Glass Seal',
}
CATEGORY_NAMES = {
    'hotel-digital-locks': 'Digital Lock', 'glass-door-handles': 'Glass Door Pull Handle',
    'door-accessories': 'Door Accessory', 'furniture-hardware': 'Furniture Lock', 'glass-railings': 'Railing Fitting',
}

# Names for models whose catalogue heading is detached from the model number or missing.
NAMES = {
    'VACS 07': 'RFID Hotel Lock', 'VACS 09': 'Hotel Access Lock', 'VACS 10': 'Smart Hotel Lock',
    'VACS 11': 'Smart Hotel Lock', 'VACS 12': 'Fingerprint Smart Entry Door Lock', 'VACS 13': '3D Face Camera Smart Door Lock',
    'VAC 14': 'Hotel Lock Card Encoder', 'VAC 15': 'Handheld Service Unit', 'VAC 16': 'Handheld Service Unit',
    'VSL 111': 'Sash Lock Body, Backset 50 mm', 'VSL 112': 'Sash Lock Body, Backset 50 mm',
    'VSL 113': 'Dead Lock Body, Backset 50 mm', 'VSL 114': 'Narrow Lock Body, Backset 30 mm',
    'VSL 115': 'Mortise Latch Lock Body, Backset 50 mm', 'VSL 116': 'Shaft Lock Body, Backset 60 mm',
    'VSL 117': 'Sliding Lock with Laser Key', 'VSL 118': '24 mm Mortise Lock – Bullet', 'VSL 119': 'Mortise Baby Latch',
    'VSCL 1001': 'Cylindrical Lock – Keyless', 'VSCL 1002': 'Cylindrical Lock – Keyless (Eco)',
    'VSCL 1003': 'Cylindrical Lock – Computer Key', 'VSCL 1004': 'Cylindrical Lock – Regular Key (Eco)',
    'VHMDL 1201': 'Dead Lock – One-Side Key, Knob Inside', 'VHMDL 1202': 'Dead Lock – Key Both Sides',
    'VHMDL 1203': 'Mini Dead Lock – One-Side Key, Knob Inside', 'VHMDL 1204': '3-Bolt Dead Lock with Dimple Key',
    'VLC 1701': 'Key & Knob Cylinder – Regular Key', 'VLC 1702': 'Double Cylinder – Regular Key',
    'VLC 1703': 'Key & Knob Cylinder – Computer Key', 'VLC 1704': 'Double Cylinder – Computer Key',
    'VLC 1705': 'Half Cylinder with Knob', 'VLC 1706': 'Half Cylinder – Regular Key', 'VLC 1707': 'Keyless Cylinder',
    'VL 1501': 'Ball Bearing Hinge', 'VL 1401': 'Bathroom Indicator Bolt', 'VL 1402': 'Floor Door Stopper',
    'VL 1403': 'Dome Floor Door Stopper', 'VL 1405': 'Floor Door Stopper', 'VL 1406': 'Door Latch',
    'VL 1407': 'Wall Door Stopper', 'VL 1408': 'Door Viewer', 'VL 1409': 'Tower Bolt', 'VL 1410': 'Tower Bolt',
    'VL 1411': 'Door Guard', 'VL 1412': 'PVC Door Buffer', 'VL 1413': 'Door Guard Latch', 'VL 1414': 'Door Holder',
    'VL 1415': 'Wide-Angle Door Viewer', 'VL 1416': 'Magnetic Door Stopper', 'VL 1417': 'Door Hook',
    'VL 1418': 'Aldrop', 'VL 1419': 'Sliding Door Bolt', 'VDDS 011': 'Automatic Door Drop Seal',
    'VPB 193': 'Panic Exit Bar – Rim Type', 'VPB 195': 'Outside Lever Trim', 'VPT 201': 'Outside Knob Trim',
    'VPB 190': 'Push Bar Panic Exit Device', 'VVR 197': 'Vertical Rod Panic Exit Device',
    'VPT 200': 'Outside Lever Trim with Cylinder',
    'VFS 72': 'Double Cylinder Floor Spring', 'VFS 82': 'Double Cylinder Floor Spring',
    'VFS 92': 'Heavy-Duty Double Cylinder Floor Spring', 'VFS 80': 'Floor Spring – up to 80 kg',
    'VFS 94': 'Floor Spring – up to 120 kg',
    'VGCF 3001': 'Wall-to-Glass Canopy Connector', 'VGCF 3002': 'Rod-to-Glass Canopy Connector',
    'VGCF 3003': 'Wall-to-Rod Canopy Connector', 'VGCF 3004': 'Canopy Connector Rod',
    'VL 1801': 'Cupboard Lock', 'VL 1802': 'Drawer Lock', 'VL 1803': 'Centre Sliding Lock', 'VL 1804': 'Side Sliding Lock',
    'VL 1805': 'Universal Cupboard Lock', 'VL 1806': 'Vertex Lock', 'VL 1807': 'Multi Lock – Laser Key',
    'VL 1808': 'Multi Lock – Regular Key (Economy)', 'VL 1809': 'Multi Lock', 'VL 1810': 'Push Lock',
    'VL 1811': 'Sliding Door Lock (Side Mounted)', 'VL 1812': 'Sliding Door Lock', 'VL 1813': 'Pedestal Lock',
}
RAILING_RANGES = [(2101, 2104, 'Glass Railing Clamp'), (2105, 2108, 'Glass Standoff Connector'),
                  (2109, 2120, 'Glass Railing Spigot'), (2121, 2128, 'Stainless-Steel Baluster'),
                  (2129, 2144, 'Handrail Bracket'), (2145, 2146, 'Glass Clamp')]
SMALL_WORDS = {'to', 'with', 'for', 'and', 'of', 'in', 'on'}


def tidy(name: str) -> str:
    """Title-case a catalogue heading; reject running headers and finish lists."""
    if not name or re.search(r'(\w ){4}|VALLIS|PVC GOLD|\|', name):
        return ''
    words = re.sub(r'\s+', ' ', name.strip(' -:')).lower().split(' ')
    out = [w if (i and w in SMALL_WORDS) else (w.upper() if w in {'ss', 'pvc', 'qbpl', 'pss', 'sss'} else w.capitalize())
           for i, w in enumerate(words)]
    fixes = {'Concealded': 'Concealed', 'Quadraple': 'Quadruple', '‘l’': '“L”', ' - ': ' – ', 'Kgs': 'kg', 'Spi­dr': ''}
    text = ' '.join(out)
    for a, b in fixes.items():
        text = text.replace(a, b)
    return text


# Manual pairing fixes: model -> list of image indexes (in page.get_image_info() order) or a clip rect.
OVERRIDES: dict[str, dict] = {
    'VFS 72': {'rect': (43, 69, 463, 345)}, 'VFS 82': {'rect': (43, 69, 463, 345)}, 'VFS 92': {'rect': (43, 69, 463, 345)},
    'VSH 705': {'rect': (65, 338, 168, 466)}, 'VSH 715': {'rect': (48, 583, 191, 722)},
    'VL 2105': {'rect': (110, 442, 161, 496)}, 'VL 2106': {'rect': (350, 437, 412, 491)},
    'VL 2107': {'rect': (102, 612, 164, 666)}, 'VL 2108': {'rect': (351, 611, 412, 665)},
}
# Pages whose product images also hold a dimension drawing: keep only the photograph.
SPLIT_PAGES = set(range(103, 109))


def category_for(page_no: int) -> str | None:
    for slug, start, end in CATEGORY_PAGES:
        if start <= page_no <= end:
            return slug
    return None


def norm_model(prefix: str, number: str) -> str:
    return f'{prefix} {number}'


def slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def render(page: pymupdf.Page, rect: pymupdf.Rect) -> Image.Image:
    pix = page.get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')


def photo_score(im: Image.Image) -> float:
    """Share of mid-tone pixels: photographs are high, line drawings are almost all white."""
    g = np.asarray(im.convert('L').resize((80, 80)))
    return float(((g > 40) & (g < 225)).mean())


def keep_photo(im: Image.Image) -> Image.Image:
    """Split an image at wide empty columns and keep the left-most part: the photograph sits left of its drawing."""
    g = np.asarray(im.convert('L'))
    ink = (g < 225).sum(axis=0) > 2
    segments, start, gap = [], None, 0
    for x, filled in enumerate(list(ink) + [False] * 40):
        if filled:
            start = x if start is None else start
            gap = 0
        elif start is not None:
            gap += 1
            if gap > im.width * 0.04:
                segments.append((start, x - gap + 1))
                start, gap = None, 0
    if len(segments) < 2:
        return im
    a, b = segments[0]
    return im.crop((max(a - 10, 0), 0, min(b + 10, im.width), im.height))


def cut_out(rgb: Image.Image) -> Image.Image:
    """Remove the light studio background connected to the image border (keeps the printed logo)."""
    sentinel = (255, 0, 255)
    work = rgb.copy()
    w, h = work.size
    seeds = [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)] + \
            [(0, y) for y in range(0, h, 8)] + [(w - 1, y) for y in range(0, h, 8)]
    for seed in seeds:
        px = work.getpixel(seed)
        if px != sentinel and min(px) > 215:
            ImageDraw.floodfill(work, seed, sentinel, thresh=24)
    bg = np.all(np.asarray(work) == sentinel, axis=2)
    if bg.mean() < 0.08:  # no flat background: keep the photograph as it is
        return rgb.convert('RGBA')
    mask = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = rgb.convert('RGBA')
    out.putalpha(mask)
    box = mask.point(lambda v: 255 if v > 20 else 0).getbbox()
    if box:
        pad = 12
        out = out.crop((max(box[0] - pad, 0), max(box[1] - pad, 0), min(box[2] + pad, w), min(box[3] + pad, h)))
    return out


def text_lines(page: pymupdf.Page) -> list[tuple[pymupdf.Rect, str]]:
    lines = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            text = ' '.join(s['text'] for s in line['spans']).strip()
            if text:
                lines.append((pymupdf.Rect(line['bbox']), re.sub(r'\s+', ' ', text)))
    return lines


def details(lines, anchor: pymupdf.Rect, others: list[pymupdf.Rect]):
    """Heading and 'Key : value' lines in the text column around one model number."""
    col = [(r, t) for r, t in lines
           if abs(r.x0 - anchor.x0) < 60 and anchor.y0 - 40 <= r.y0 <= anchor.y0 + 130]
    # stop at the next model number in the same column
    nxt = [o.y0 for o in others if abs(o.x0 - anchor.x0) < 60 and o.y0 > anchor.y0 + 2]
    limit = min(nxt) - 2 if nxt else 1e9
    above = [o.y0 for o in others if abs(o.x0 - anchor.x0) < 60 and o.y0 < anchor.y0 - 2]
    floor = max(above) + 12 if above else -1e9
    col = [(r, t) for r, t in col if floor <= r.y0 < limit]
    name, specs = '', {}
    for r, t in sorted(col, key=lambda x: x[0].y0):
        if MODEL.search(t) and 'MODEL' not in t.upper() and len(t) < 14:
            continue
        if re.match(r'^(Vallis HS|www\.)', t, re.I):
            continue
        m = re.match(r'^([A-Za-z][A-Za-z .()/&-]{1,32}?)\s*[:：]\s*(.+)$', t)
        if m and 'MODEL' not in m.group(1).upper():
            key = m.group(1).strip().title().replace('Ss', 'SS')
            specs[key] = m.group(2).strip().strip('|').strip()
        elif not m and 'MODEL' not in t.upper() and r.y0 < anchor.y0 + 40 and not name and t.isupper() and len(t) > 4:
            name = t
    return name, specs


def pair(page: pymupdf.Page, models: list[tuple[str, pymupdf.Rect]]):
    W, H = page.rect.width, page.rect.height
    cands = []
    for i, info in enumerate(page.get_image_info()):
        r = pymupdf.Rect(info['bbox']) & page.rect
        if r.width < 40 or r.height < 30 or r.y1 < 75 or r.y0 > H - 70 or r.get_area() > 0.45 * W * H:
            continue
        im = render(page, r)
        cands.append((i, r, photo_score(im)))
    photos = [c for c in cands if c[2] > 0.06] or cands
    pairs = []
    for model, anchor in models:
        ax, ay = anchor.x0, (anchor.y0 + anchor.y1) / 2
        for i, r, score in photos:
            cx, cy = (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2
            cost = abs(cx - ax) + abs(cy - ay) * 1.3
            if r.x0 > anchor.x1:  # photo to the right of its text: unusual
                cost += 250
            if cy > anchor.y1 + 20 and not (r.y0 < anchor.y1):  # photo below the text: unusual
                cost += 120
            pairs.append((cost, model, i, r))
    pairs.sort(key=lambda p: p[0])
    used_m, used_i, out = set(), set(), {}
    for cost, model, i, r in pairs:
        if model in used_m or i in used_i:
            continue
        used_m.add(model)
        used_i.add(i)
        out[model] = r
    for model, r in out.items():
        grow = pymupdf.Rect(r.x0 - 14, r.y0 - 14, r.x1 + 14, r.y1 + 14)
        for i, o, _ in photos:
            if i not in used_i and grow.intersects(o):
                used_i.add(i)
                out[model] = out[model] | o
    return out


# Collection banners: the lifestyle photograph on each catalogue section opener.
SCENES = {'locks-cylinders': 38, 'door-accessories': 25, 'glass-door-handles': 51, 'panic-bars': 67,
          'floor-springs': 72, 'shower-hardware': 84}


def scenes(doc: pymupdf.Document) -> None:
    for slug, page_no in SCENES.items():
        page = doc[page_no - 1]
        largest = max(page.get_image_info(), key=lambda i: pymupdf.Rect(i['bbox']).get_area())
        rect = pymupdf.Rect(largest['bbox']) & page.rect
        # skip the printed section title and stop above the navy text panel of the section opener
        rect.y0 = max(rect.y0, 82)
        rect.y1 = min(rect.y1, page.rect.height * 0.5)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(2.6, 2.6), clip=rect, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        if img.width > 1600:
            img = img.resize((1600, round(img.height * 1600 / img.width)), Image.Resampling.LANCZOS)
        img.save(OUT / f'scene-{slug}.webp', 'WEBP', quality=82)


def main():
    doc = pymupdf.open(PDF)
    OUT.mkdir(parents=True, exist_ok=True)
    if '--scenes' in sys.argv:
        return scenes(doc)
    products, seen, review = [], set(), []
    for pno in range(doc.page_count):
        page_no = pno + 1
        category = category_for(page_no)
        if not category or page_no in SKIP_PAGES:
            continue
        page = doc[pno]
        lines = text_lines(page)
        models, anchors = [], []
        for r, t in lines:
            for m in MODEL.finditer(t):
                model = norm_model(m.group(1), m.group(2))
                if model in seen or any(model == x for x, _ in models):
                    continue
                models.append((model, r))
                anchors.append(r)
        if not models:
            continue
        pairs = pair(page, models)
        for model, anchor in models:
            rect = pairs.get(model)
            if model in OVERRIDES:
                rect = pymupdf.Rect(OVERRIDES[model]['rect'])
            if rect is None:
                print(f'p{page_no}: no photograph for {model}', file=sys.stderr)
                continue
            seen.add(model)
            slug = slugify(model)
            raw = render(page, rect)
            img = cut_out(keep_photo(raw) if page_no in SPLIT_PAGES else raw)
            if img.width > 900:
                img = img.resize((900, round(img.height * 900 / img.width)), Image.Resampling.LANCZOS)
            img.save(OUT / f'{slug}.webp', 'WEBP', quality=86)
            name, specs = details(lines, anchor, [a for a in anchors if a is not anchor])
            prefix = model.split()[0]
            specs.pop('Application', None)
            name = NAMES.get(model) or tidy(name)
            if prefix == 'VL' and 2101 <= int(model.split()[1]) <= 2146:
                name = next(n for a, b, n in RAILING_RANGES if a <= int(model.split()[1]) <= b)
            if not name:
                name = DEFAULT_NAMES.get(prefix + model.split()[1][:2] if prefix == 'VL' else prefix) \
                    or CATEGORY_NAMES.get(category) or ''
            products.append({'model': model, 'slug': slug, 'category': category, 'page': page_no,
                             'name': name, 'specs': specs, 'image': f'/images/products/{slug}.webp'})
            review.append((model, img))
    scenes(doc)
    DATA.write_text(json.dumps(products, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'{len(products)} products written to {DATA.relative_to(root)}')
    if '--sheet' in sys.argv:
        cell = 170
        cols = 12
        sheet = Image.new('RGB', (cols * cell, ((len(review) + cols - 1) // cols) * (cell + 16)), 'white')
        draw = ImageDraw.Draw(sheet)
        for k, (model, im) in enumerate(review):
            t = im.copy()
            t.thumbnail((cell - 8, cell - 8))
            x, y = (k % cols) * cell, (k // cols) * (cell + 16)
            sheet.paste(t, (x + 4, y + 16), t)
            draw.text((x + 4, y + 2), model, fill='red')
        (root / 'tmp').mkdir(exist_ok=True)
        sheet.save(root / 'tmp/catalogue-review.png')


if __name__ == '__main__':
    main()
