from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
manifest={}
paths=list((root/'public/images/catalogue').glob('*.webp'))+list((root/'public/images/brand').glob('*.jpeg'))
for path in paths:
    if '-w' in path.stem:continue
    im=Image.open(path)
    sizes=[]
    for width in [320,640,960]:
        if width<im.width:
            filename=path.with_name(f'{path.stem}-w{width}.webp')
            im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS).save(filename,'WEBP',quality=84)
            sizes.append((f'/{filename.relative_to(root/"public").as_posix()}',width))
    src=f'/{path.relative_to(root/"public").as_posix()}'
    sizes.append((src,im.width))
    manifest[src]={'width':im.width,'height':im.height,'srcset':', '.join(f'{url} {width}w' for url,width in sizes)}
(root/'src/data/image-manifest.json').write_text(json.dumps(manifest,indent=2))
print('Responsive variants prepared for',len(manifest),'source images')
