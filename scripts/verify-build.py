from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json,xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
dist=root/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[];self.ids=[];self.h1=0;self.title='';self.in_title=False;self.desc=False;self.canonical='';self.robots='';self.schema=[];self.in_schema=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag=='img':self.images.append(a)
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='meta' and a.get('name')=='description':self.desc=bool(a.get('content'))
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='script' and a.get('type')=='application/ld+json':self.in_schema=True
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script':self.in_schema=False
 def handle_data(self,data):
  if self.in_title:self.title+=data
  if self.in_schema:self.schema.append(json.loads(data))

pages={};errors=[];titles=set();total_links=0;total_images=0
for f in dist.rglob('*.html'):
 if '_astro' in str(f):continue
 rel=f.relative_to(dist).as_posix();route='/' if rel=='index.html' else '/'+rel.replace('index.html','')
 p=Page();p.feed(f.read_text(encoding='utf-8'));pages[route]=p
 if p.h1!=1:errors.append(f'{route}: H1 count {p.h1}')
 if not p.desc or not p.canonical or not p.title:errors.append(f'{route}: missing metadata')
 if p.title in titles:errors.append(f'{route}: duplicate title')
 titles.add(p.title)
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{route}: duplicate IDs')
 if p.robots!='noindex, nofollow':errors.append(f'{route}: preview indexing enabled')
 for im in p.images:
  total_images+=1
  if 'alt' not in im:errors.append(f'{route}: missing image alt')
  src=unquote(urlparse(im.get('src','')).path)
  if src.startswith('/') and not (dist/src.lstrip('/')).exists():errors.append(f'{route}: missing image {src}')
  for entry in im.get('srcset','').split(','):
   if not entry.strip():continue
   candidate=unquote(entry.strip().split()[0])
   if candidate.startswith('/') and not (dist/candidate.lstrip('/')).exists():errors.append(f'{route}: missing responsive variant {candidate}')
for route,p in pages.items():
 for link in p.links:
  total_links+=1
  u=urlparse(link)
  if u.scheme or u.netloc:continue
  target=unquote(u.path)
  if not target:target=route
  local=dist/target.lstrip('/')
  if target.endswith('/'):local=local/'index.html'
  if not local.exists():errors.append(f'{route}: broken link {link}');continue
  if u.fragment and local.suffix=='.html':
   key=target if target.endswith('/') or target.endswith('.html') else target+'/'
   if key in pages and unquote(u.fragment) not in pages[key].ids:errors.append(f'{route}: missing anchor {link}')
tree=ET.parse(dist/'sitemap.xml');urls=tree.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url');
if len(urls)!=len(pages)-1:errors.append('Sitemap page count mismatch')
result={'pages':len(pages),'sitemap_urls':len(urls),'local_links_checked':total_links,'images_checked':total_images,'errors':errors,'status':'PASS' if not errors else 'FAIL'}
(root/'output').mkdir(exist_ok=True)
(root/'output/build-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
