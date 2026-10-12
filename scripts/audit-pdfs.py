from pathlib import Path
import fitz,json
from PIL import Image,ImageOps,ImageDraw

root=Path(__file__).resolve().parents[1]
out=root/'tmp/pdf-audit'
out.mkdir(parents=True,exist_ok=True)
for name,tag in [('vallisglobal products pdf.pdf','vallis'),('door handle pdf.pdf','nimkro'),('railings pdf.pdf','mrw')]:
    doc=fitz.open(root/'public'/name)
    records=[]
    thumbs=[]
    for i,page in enumerate(doc):
        records.append({'page':i+1,'text':page.get_text(),'images':[{'xref':v[0],'width':v[2],'height':v[3]} for v in page.get_images()]})
        pix=page.get_pixmap(matrix=fitz.Matrix(.28,.28))
        im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        im.thumbnail((190,235))
        tile=Image.new('RGB',(210,265),'#eee')
        tile.paste(im,((210-im.width)//2,20))
        ImageDraw.Draw(tile).text((8,245),f'{tag} p{i+1}',fill='black')
        thumbs.append(tile)
    (out/f'{tag}.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
    (out/f'{tag}.txt').write_text('\n'.join(f'PAGE {r["page"]}\n{r["text"]}' for r in records),encoding='utf-8')
    for batch in range(0,len(thumbs),30):
        group=thumbs[batch:batch+30]
        sheet=Image.new('RGB',(210*6,265*((len(group)+5)//6)),'white')
        for j,im in enumerate(group):sheet.paste(im,((j%6)*210,(j//6)*265))
        sheet.save(out/f'{tag}-sheet-{batch//30+1}.jpg')
    print(tag,len(doc),'pages')
