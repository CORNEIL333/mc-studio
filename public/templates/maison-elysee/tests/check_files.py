from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import json,re
root=Path(__file__).resolve().parents[1]
errors=[];counts={}
class Check(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.sections=0;self.ids=set();self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='section':self.sections+=1
  if 'id' in a:
   if a['id'] in self.ids:errors.append(f'{self.path}: duplicate id {a["id"]}')
   self.ids.add(a['id'])
  if tag=='img' and not a.get('alt'):errors.append(f'{self.path}: missing alt')
  for key in ['href','src']:
   if key not in a:continue
   u=urlparse(a[key])
   if u.scheme or u.netloc:continue
   target=(self.path.parent/u.path).resolve() if u.path else self.path.resolve()
   if not target.exists():errors.append(f'{self.path}: missing {target}')
   if u.fragment:self.links.append((target,u.fragment))
checks={}
for f in [root/'index.html',*sorted((root/'pages').glob('*.html'))]:
 p=Check(f);p.feed(f.read_text());counts[f.name]=p.sections;checks[f.resolve()]=p
 if p.sections<8:errors.append(f'{f}: only {p.sections} sections')
 if '{ROOT}' in f.read_text() or '{RES}' in f.read_text():errors.append(f'{f}: unresolved placeholder')
for p in checks.values():
 for path,fragment in p.links:
  if path in checks and fragment not in checks[path].ids:errors.append(f'{p.path}: missing fragment {fragment}')
for f in (root/'assets/js').glob('*.js'):
 for relative in re.findall(r"from ['\"]([^'\"]+)['\"]",f.read_text()):
  if not (f.parent/relative).exists():errors.append(f'{f}: missing import {relative}')
for f in (root/'data').glob('*.json'):json.loads(f.read_text())
assert not errors,'\n'.join(errors)
print(json.dumps({'result':'PASS','pages':len(checks),'sections':counts,'images':len(list((root/'assets/images').glob('*.webp')))},ensure_ascii=False))
