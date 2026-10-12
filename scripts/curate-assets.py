from pathlib import Path
import re,json

root=Path(__file__).resolve().parents[1]
asset_root=(root/'public/images/catalogue').resolve()
assert asset_root.is_relative_to(root.resolve())
used=set()
for f in (root/'dist').rglob('*.html'):
    used.update(re.findall(r'/images/catalogue/([^"\s<>]+\.webp)',f.read_text(encoding='utf-8')))
records=json.loads((root/'tmp/pdf-audit/asset-manifest.json').read_text())
curated=[r for r in records if r['file'] in used]
for name,source,rect in [('fhc-200','pvc-doors-5.jpeg',[100,560,310,905]),('fhc-200d','pvc-doors-5.jpeg',[430,560,640,905]),('fhc-100','pvc-doors-5.jpeg',[775,560,960,905]),('lv-200','pvc-doors-4.jpeg',[155,310,485,815])]:
    curated.append({'file':name+'.webp','source':source,'crop':rect})
removed=0
for f in asset_root.glob('*.webp'):
    if f.name not in used:
        assert f.resolve().parent==asset_root
        f.unlink();removed+=1
(root/'ASSET-SOURCES.json').write_text(json.dumps({'catalogue_assets':curated,'logo':{'file':'/images/brand/logo-original.jpeg','source':'vallisglobal-website-logo.jpeg','processing':'Unchanged supplied logo'},'decorative_backdrop':{'file':'/images/hero/navy-marble.webp','source':'AI-generated navy marble studio backdrop; no products or project claims'},'gallery_usage':'VALLIS and MRW supplied application imagery, labelled as inspiration. Not represented as completed BUILDMART projects.'},indent=2))
print(json.dumps({'used_catalogue_images':len(used),'removed_unused_generated_assets':removed,'total_catalogue_image_bytes':sum(f.stat().st_size for f in asset_root.glob('*.webp'))}))
