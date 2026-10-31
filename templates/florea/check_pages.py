from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import re,json
root=Path(__file__).resolve().parent
class Page(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.ids=set();self.refs=[];self.h1=0;self.sections=0;self.body={};self.form=0;self.inline_booking=False;self.booking_dialog=False;self.stack=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='section':self.sections+=1
  if tag=='body':self.body=a
  if tag=='form':self.form+=1
  if tag=='img':assert 'alt' in a,(self.path,'alt absent')
  if 'id' in a:
   assert a['id'] not in self.ids,(self.path,'duplicate id',a['id']);self.ids.add(a['id'])
  if a.get('id')=='booking-dialog':self.inline_booking=tag=='div';self.booking_dialog=tag=='dialog'
  for key in ['href','src']:
   if a.get(key):self.refs.append(a[key])
pages={}
for f in sorted(root.glob('*.html')):
 p=Page(f);p.feed(f.read_text());assert p.h1==1,(f,'h1',p.h1);pages[f.name]=p
assert len(pages)==9,len(pages)
for name,p in pages.items():
 for ref in p.refs:
  u=urlparse(ref)
  if u.scheme:continue
  target=(root/u.path) if u.path else p.path
  assert target.is_file(),(p.path,'missing',target)
  if u.fragment:assert u.fragment in pages[target.name].ids,(name,'broken anchor',ref)
 if name=='rendez-vous.html':assert p.inline_booking and not p.booking_dialog
 else:assert p.booking_dialog
 assert {'booking-form','lightbox','vip-dialog','motion-toggle','menu-dialog'}<=p.ids
 assert (root/'assets/js/app.js').is_file() and (root/'assets/css/site.css').is_file()
assert 'location.href=\'rendez-vous.html\'' in (root/'assets/js/app.js').read_text()
assert 'contact-form' in pages['contact.html'].ids
assert 'services' in pages['spa.html'].ids and pages['spa.html'].body['data-category']=='spa'
assert pages['coiffure.html'].body['data-category']=='coiffure'
assert pages['onglerie.html'].body['data-category']=='onglerie'
print(json.dumps({'result':'PASS','pages':len(pages),'sections':{k:p.sections for k,p in pages.items()},'booking':'Dedicated inline page','navigation':'All links and anchors valid'},ensure_ascii=False))
