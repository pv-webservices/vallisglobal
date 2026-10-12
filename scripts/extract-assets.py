from pathlib import Path
import fitz,json
from PIL import Image,ImageDraw
from io import BytesIO

root=Path(__file__).resolve().parents[1]
out=root/'public/images/catalogue'
out.mkdir(parents=True,exist_ok=True)
audit=root/'tmp/pdf-audit'
allrecords=[]
for filename,tag,pages in [('vallisglobal products pdf.pdf','vallis',[5,6,7,8,13,14,15,16,25,32,33,52,54,60,61,62,69,70,71,73,77,78,85,95,97,110,122,123]),('door handle pdf.pdf','nimkro',[5,17,28,37,42]),('railings pdf.pdf','mrw',[2,9,10,11,12,16,20,22,24,26,33,34,35,43,45,47,50])]:
    doc=fitz.open(root/'public'/filename)
    tiles=[]
    for page_num in pages:
        page=doc[page_num-1]
        infos=page.get_image_info(xrefs=True)
        seen=set()
        for info in infos:
            xref=info['xref']
            if not xref or xref in seen or info['width']<80 or info['height']<80:continue
            seen.add(xref)
            # Preserve embedded transparency from the catalogue itself.
            base=fitz.Pixmap(doc,xref)
            smask=next((v[1] for v in page.get_images() if v[0]==xref),0)
            if smask:base=fitz.Pixmap(base,fitz.Pixmap(doc,smask))
            if base.colorspace and base.colorspace.n>3:base=fitz.Pixmap(fitz.csRGB,base)
            im=Image.open(BytesIO(base.tobytes('png')))
            name=f'{tag}-p{page_num}-x{xref}.webp'
            im.thumbnail((1600,1600))
            im.save(out/name,'WEBP',quality=88)
            rec={'file':name,'source':filename,'page':page_num,'xref':xref,'bbox':info['bbox'],'width':info['width'],'height':info['height'],'alpha':bool(smask)}
            allrecords.append(rec)
            preview=im.convert('RGBA');preview.thumbnail((160,155))
            tile=Image.new('RGB',(180,190),'#ddd')
            tile.paste(preview,((180-preview.width)//2,5),preview)
            ImageDraw.Draw(tile).text((5,166),f'p{page_num} x{xref}',fill='black')
            tiles.append(tile)
    for start in range(0,len(tiles),48):
        group=tiles[start:start+48]
        sheet=Image.new('RGB',(1080,190*((len(group)+5)//6)),'white')
        for j,im in enumerate(group):sheet.paste(im,((j%6)*180,(j//6)*190))
        sheet.save(audit/f'{tag}-assets-{start//48+1}.jpg')
    print(tag,len(tiles),'extracted images')
(audit/'asset-manifest.json').write_text(json.dumps(allrecords,indent=2),encoding='utf-8')
# Source door sheets are cropped to the actual product, omitting layout and conflicting contact data.
for n,rect in enumerate([(235,275,485,550),(735,275,945,550),(250,680,465,960),(720,680,965,960)],1):
    im=Image.open(root/'public/pvc-doors-1.jpeg').crop(rect)
    im.save(out/f'shaft-{n}.webp','WEBP',quality=90)
for name,source,rect in [('fhc-200','pvc-doors-5.jpeg',(100,560,310,905)),('fhc-200d','pvc-doors-5.jpeg',(430,560,640,905)),('fhc-100','pvc-doors-5.jpeg',(775,560,960,905)),('lv-200','pvc-doors-4.jpeg',(155,310,485,815))]:
    Image.open(root/'public'/source).crop(rect).save(out/f'{name}.webp','WEBP',quality=90)
