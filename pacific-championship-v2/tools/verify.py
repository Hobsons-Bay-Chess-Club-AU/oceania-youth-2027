"""Validate the content-preserving rebuilt reference (development: lxml required)."""
from pathlib import Path
from lxml import html
from urllib.parse import unquote,urlparse
from collections import Counter
import json,re,sys
R=Path(__file__).resolve().parents[1];P=R/'preview';manifest=json.loads((R/'source-snapshots/manifest.json').read_text());report=[];fail=[]
def norm(e):return re.sub(r'\s+','',''.join(e.itertext()))
for item in manifest:
 route=item['route'];src=html.fromstring((R/'source-snapshots'/item['file']).read_bytes());dest=P/route.lstrip('/')/'index.html' if route!='/' else P/'index.html';out=html.fromstring(dest.read_bytes());original=src.xpath('//main')[0];main=out.xpath('//main')[0];flat=norm(main);missing=[];n=0
 for e in original.xpath('.//h1|.//h2|.//h3|.//p|.//label|.//li'):
  text=norm(e)
  # Zero-frame animation placeholders are replaced by original source-code target values.
  if text=='0':continue
  if text and text not in flat:missing.append(''.join(e.itertext())[:100])
  n+=1
 a=Counter(original.xpath('.//a/@href'));b=Counter(main.xpath('.//a/@href'));missing_links=dict(a-b)
 for u in out.xpath('//script/@src|//link[@rel="stylesheet"]/@href|//link[@rel="icon"]/@href|//img/@src'):
  if u.startswith('/') and not (P/unquote(urlparse(u).path).lstrip('/')).is_file():fail.append(route+' missing resource '+u)
 ids=out.xpath('//@id');duplicates=[x for x,c in Counter(ids).items() if c>1]
 if missing or missing_links or duplicates:fail.append(route+' content, links or identifiers')
 report.append({'route':route,'checked_copy_blocks':n,'missing_copy':missing,'missing_original_links':missing_links,'duplicate_ids':duplicates,'one_main_landmark':len(out.xpath('//main'))==1})
 assert not out.xpath('//script[contains(@src,"_next")]')
 assert len(out.xpath('//main'))==1
(R/'guidelines/verification-content.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'routes':len(report),'copy_blocks':sum(x['checked_copy_blocks'] for x in report),'failures':fail},indent=2));sys.exit(bool(fail))
