from pathlib import Path
from lxml import html,etree
from copy import deepcopy
import re,json,html as H,collections
R=Path(__file__).resolve().parents[1];P=R/'preview';sources=R/'source-snapshots';manifest=json.loads((sources/'manifest.json').read_text());_field_count=0
def txt(e):return ''.join(e.itertext())
def el(tag,cls='',text=None,**attrs):
 e=etree.Element(tag,**{k.replace('_','-'):str(v) for k,v in attrs.items()})
 if cls:e.set('class',cls)
 if text is not None:e.text=text
 return e
def add(e,*children):
 for c in children:
  if c is not None:e.append(c)
 return e
def cls(e,c):e.set('class',c);return e
def clean(e):
 global _field_count
 e=deepcopy(e)
 for x in list(e.iter()):
  if not isinstance(x.tag,str):
   parent=x.getparent()
   if parent is not None:
    # Preserve text around React comments.
    tail=x.tail
    if tail:
     prev=x.getprevious()
     if prev is not None:prev.tail=(prev.tail or '')+tail
     else:parent.text=(parent.text or '')+tail
    parent.remove(x)
   continue
  old=x.get('class','');x.attrib.pop('class',None);x.attrib.pop('style',None)
  if x.tag=='main':x.tag='div'
  if x.tag=='svg':x.set('aria-hidden','true');x.set('class','ui-icon')
  if x.tag=='img':x.set('loading','lazy')
  if x.tag=='div' and 'pointer-events-none' in old and not txt(x).strip():
   if x.getparent() is not None:x.getparent().remove(x)
   continue
  if x.tag in ['span','p'] and ('uppercase' in old or 'tracking-widest' in old):x.set('class','eyebrow')
  if x.tag=='a' and ('inline-flex' in old or 'bg-gradient' in old):x.set('class','action')
  if x.tag=='p' and 'font-display' in old:x.set('class','metric')
  if x.tag=='div' and 'grid' in old:x.set('class','subgrid')
  if x.tag=='div' and 'flex' in old:x.set('class','flexline')
  if x.tag=='div' and 'grid-cols-8' in old:x.set('class','chessboard')
  if x.tag=='div' and ('bg-slate-200' in old or 'bg-slate-300' in old):x.set('data-square','light')
  if x.tag=='div' and ('bg-slate-700' in old or 'bg-slate-600' in old):x.set('data-square','dark')
  if x.tag=='input' and x.get('type')=='checkbox':x.set('class','check')
 # Associate labels and controls; content unchanged.
 for i,label in enumerate(e.xpath('.//label')):
  parent=label.getparent();fields=parent.xpath('.//input|.//select|.//textarea')
  if fields:
   _field_count+=1;ident=fields[0].get('id')or'field-'+str(_field_count);fields[0].set('id',ident);label.set('for',ident)
 return e
def children(e):return [x for x in e if isinstance(x.tag,str)]
def contents(e):
 return clean(e)
def section_header(e):
 # Rebuild page title from its content-bearing original wrapper.
 x=next((d for d in e if isinstance(d.tag,str) and d.xpath('.//h1')),e);x=clean(x);x.tag='section';cls(x,'page-title')
 if len(x):cls(x[0],'eyebrow')
 return x
base=html.fromstring((sources/'home.html').read_bytes())
header=clean(base.xpath('//header')[0]);cls(header,'site-header')
nav=header.xpath('.//nav')[0];cls(nav,'site-nav');nav.set('id','site-navigation')
# Remove nested old wrappers only from header and build a new explicit brand/navigation/actions row.
logo=header.xpath('.//a[@href="/"]')[0];cls(logo,'brand');logo[0].set('class','brand-mark');logo[0].set('aria-hidden','true')
logo.insert(0,el('img','brand-symbol',src='/assets/mark.svg',alt=''))
info=next(b for b in nav.xpath('.//button') if 'Information' in txt(b));info.set('aria-expanded','false');info.set('data-menu','information');cls(info.getparent(),'nav-dropdown');info.getparent()[1].set('class','dropdown-panel')
right=header.xpath('.//button[@title]')[0].getparent();search=right[0];cls(search,'search-trigger');search.set('data-search','true');right.remove(search)
reg=next(a for a in right.xpath('.//a') if a.get('href')=='/registration');cls(reg,'register-link')
# New shell keeps exact original link labels, but changes navigation presentation.
header=el('header','site-header');add(header,logo,nav,el('div','header-tools'))
add(header[-1],search,reg)
theme=el('button','theme-toggle',type='button',aria_label='Switch colour theme',data_theme_toggle='true');theme.text='◐';header[-1].append(theme)
menu=el('button','mobile-menu',type='button',aria_label='Open navigation',aria_controls='site-navigation',aria_expanded='false');menu.text='☰';header[-1].append(menu)
footer=clean(base.xpath('//footer')[0]);cls(footer,'site-footer')
# Footer original content becomes two purposeful typographic groups instead of card columns.
for x in footer.xpath('.//h3'):cls(x,'footer-title')
for x in footer.xpath('.//h4'):cls(x,'eyebrow')
for x in footer.xpath('.//button'):x.set('type',x.get('type','button'))
# Route-specific rebuilt DOM.
def home(m):
 sections=children(m);hero=sections[0];left=hero.xpath('.//h1')[0].getparent().getparent();clock=hero.xpath('.//article')[0]
 lead=el('section','home-lead');copy=clean(left);cls(copy,'home-copy');h=copy.xpath('.//h1')[0]
 # Original H1 words redistributed into the visual composition.
 h.clear();h.text='Oceania Youth ';add(h,el('span','title-second','Chess Zonal '),el('span','title-year','2027'))
 leftc=children(copy);badges=next(d for d in leftc if d.get('class')=='flexline');cls(badges,'home-eyebrow');cls(leftc[-2] if leftc[-1].get('class')=='subgrid' else leftc[-1],'hero-actions')
 stats=next(d for d in leftc if d.get('class')=='subgrid');copy.remove(stats);cls(stats,'home-stats')
 add(lead,copy,el('div','home-art',aria_hidden='true'))
 clock=clean(clock);cls(clock,'clock-strip');clock.set('data-countdown','true')
 for p in clock.xpath('.//p[contains(@class,"metric")]'):p.set('data-count','true')
 # The original banner and toggle controls remain, now in a separate feature composition.
 banner=clean(hero[3]);cls(banner,'original-banner');banner.set('id','championship-banner')
 toggles=clean(hero[4]);cls(toggles,'banner-controls');banner.append(toggles)
 bulletin=clean(sections[1][0]);cls(bulletin,'bulletin');snapshot=clean(sections[1][1]);cls(snapshot,'snapshot')
 for x,n in zip(snapshot.xpath('.//p[@class="metric"]'),[13,14,25,7]):x.text=str(n)
 division=clean(sections[2]);cls(division,'age-explorer');division.set('data-age-explorer','true')
 for b in division.xpath('.//button'):
  label=b.text or '';b.text='';b.insert(0,el('span','category-word',label));b.set('aria-label',''.join(b.itertext()))
 quick=clean(sections[3]);cls(quick,'quick-reference')
 honours=clean(sections[4][0]);cls(honours,'honours');experience=clean(sections[4][1]);cls(experience,'experience')
 register=clean(sections[5]);cls(register,'entry-banner')
 support=clean(sections[6]);cls(support,'support-split')
 out=el('div','page-home');add(out,lead,stats,register,clock,bulletin,division,quick,el('div','editorial-pair'),snapshot,banner,support)
 add(out[7],honours,experience)
 # Regional identity: turn the existing eligible-federations paragraph into a visual atlas without duplicating its wording.
 fed=next((p for p in quick.xpath('.//p') if txt(p).startswith('Australia, New Zealand,')),None)
 if fed is not None:
  fed.set('class','region-names')
  art=el('div','region-portrait',aria_hidden='true')
  for i,code in enumerate(['au','nz','fj','pg','sb','pw','gu','nr','nc','to','vu','ki','mh']):art.append(el('img',src=f'/assets/countries/{code}.svg',alt=''))
  fed.getparent().append(art)
 return out

def schedule(m):
 s=children(m);out=el('div','page-schedule');add(out,section_header(s[0]));body=clean(s[1]);cls(body,'schedule-workspace')
 filters=body[0];cls(filters,'schedule-toolbar');days=body[1];cls(days,'day-selector');events=body[2];cls(events,'schedule-events')
 for i,b in enumerate(filters.xpath('.//button')):b.set('data-event-filter',['all','round','ceremony'][i]);b.set('aria-pressed',str(i==0).lower())
 filters.xpath('.//input')[0].set('data-schedule-search','true')
 for i,b in enumerate(days.xpath('.//button')):b.set('data-day','all' if i==0 else str(i-1));b.set('aria-pressed',str(i==0).lower())
 for row in children(events):
  cls(row,'event-row');c=children(row);date=c[0][0];cls(date,'event-date');date_text=txt(date).strip();row.set('data-date',date_text);row.set('data-text',txt(row).lower());row.set('data-day-index',{'27 Sept':'0','28 Sept':'1','29 Sept':'2','30 Sept':'3','1 Oct':'4','2 Oct':'5','3 Oct':'6','4 Oct':'7'}.get(date_text,'all'))
  date.getparent().remove(date);row.insert(0,date);cls(c[0],'event-description');cls(c[1],'calendar-action')
 add(out,body);return out

def regulations(m):
 s=children(m);out=el('div','page-regulations');add(out,section_header(s[0]));snapshot=clean(s[1]);cls(snapshot,'rules-snapshot');navigator=clean(s[2]);cls(navigator,'rules-workspace');cls(navigator[0],'rules-index');cls(navigator[1],'rules-copy');add(out,snapshot,navigator);return out

def registration(m):
 s=children(m);out=el('div','page-registration');add(out,section_header(s[0]));body=clean(s[2]);cls(body,'entry-workspace');calc=body[0];cls(calc,'fee-calculator');calc.set('data-calculator','true');form=body[1];cls(form,'interest-form');extras=clean(s[1]);cls(extras,'entry-assistance')
 for i,x in enumerate(calc.xpath('.//input[@type="checkbox"]')):x.set('data-fee',('official','early')[i]);x.set('aria-label',('Official Nominated Federation Player','Early Bird Rate')[i])
 vals=calc[1][3];cls(vals,'fee-breakdown');total=calc[1][4];cls(total,'fee-total');vals[0][-1].set('data-registration-fee','true');vals[1][-1].set('data-entry-fee','true');total[-1].set('data-total-fee','true')
 add(out,body,extras);return out

def players(m):
 s=children(m);out=el('div','page-players');add(out,section_header(s[0]));body=clean(s[1]);cls(body,'players-workspace');cls(body[0],'directory-filters');cls(body[1],'directory-divisions');cls(body[2],'directory-summary');body[0].xpath('.//input')[0].set('data-player-search','true')
 for i,sel in enumerate(body[0].xpath('.//select')):sel.set('data-player-filter',['category','division','federation'][i])
 for i,b in enumerate(body[1].xpath('.//button')):b.set('data-division','U'+str((i+4)*2))
 # Loading placeholders are transient state, replaced by the actual source JSON's server-data state.
 body.remove(body[-1]);results=el('div','directory-results',id='player-results');body.append(results)
 add(out,body);return out

def location(m):
 s=children(m);out=el('div','page-location');add(out,section_header(s[0]));venue=clean(s[1]);cls(venue,'venue-composition');cls(venue[0],'venue-description');cls(venue[1],'venue-map');transport=clean(s[2]);cls(transport,'travel-notes');nearby=clean(s[3]);cls(nearby,'nearby-guide');add(out,venue,transport,nearby);return out

def news(m):
 s=children(m);out=el('div','page-news');add(out,section_header(s[0]));feature=clean(s[1]);cls(feature,'feature-story');archive=clean(s[2]);cls(archive,'news-archive');inputs=archive.xpath('.//input');
 if inputs:inputs[0].set('data-news-search','true')
 for a in archive.xpath('.//a[contains(@href,"/news/")]'):cls(a,'news-row')
 add(out,feature,archive);return out

def organizer(m):
 s=children(m);out=el('div','page-organizer');add(out,section_header(s[0]));body=clean(s[1]);cls(body,'organizer-sheet');add(out,body);return out

def sponsors(m):
 s=children(m);out=el('div','page-sponsors');add(out,section_header(s[0]));body=clean(s[1]);cls(body,'partners-sheet');add(out,body);call=clean(s[2]);cls(call,'partnership-call');add(out,call);return out

def contact(m):
 s=children(m);out=el('div','page-contact');add(out,section_header(s[0]));body=clean(s[1]);cls(body,'contact-workspace');cls(body[0],'contact-form');cls(body[1],'contact-notes');add(out,body);return out

def broadcast(m):
 s=children(m);out=el('div','page-broadcast');add(out,section_header(s[0]));board=clean(s[1]);cls(board,'broadcast-stage');feed=clean(s[2]);cls(feed,'broadcast-directory');
 for i,b in enumerate(board.xpath('.//button')):
  if txt(b)=='Copy PGN':b.set('data-copy-pgn','true')
  else:b.set('data-board',str(i))
 add(out,board,feed);return out

def article(m):
 s=children(m);out=el('div','page-article')
 for i,e in enumerate(s):x=clean(e);cls(x,'article-masthead' if i==0 else 'article-body');out.append(x)
 return out
functions={'/':home,'/schedule':schedule,'/regulations':regulations,'/registration':registration,'/players':players,'/location':location,'/news':news,'/organizer':organizer,'/sponsors':sponsors,'/contact-us':contact,'/dgt-boards':broadcast}
report=[]
for item in manifest:
 s=html.fromstring((sources/item['file']).read_bytes());m=s.xpath('//main/div')[0];content=functions.get(item['route'],article)(m)
 page=el('html',lang='en');head=el('head');add(page,head);add(head,el('meta',charset='utf-8'),el('meta',name='viewport',content='width=device-width,initial-scale=1'),el('title',text=s.xpath('string(//title)')),el('link',rel='icon',type='image/svg+xml',href='/assets/mark.svg'),el('link',rel='stylesheet',href='/assets/site.css'))
 init=el('script');init.text="try{let t=localStorage.getItem('oy27-v2-theme')||'system';document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t}catch(e){}";head.append(init)
 head.append(el('script',src='/assets/site.js',defer='defer'))
 body=el('body',data_route=item['route']);page.append(body);skip=el('a','skip-link','Skip to content',href='#main');add(body,skip,deepcopy(header),el('main',id='main'),deepcopy(footer));body[2].append(content)
 dialog=el('dialog','site-search',id='site-search');add(dialog,el('button','dialog-close','×',type='button',aria_label='Close search'),el('input',type='search',placeholder='Search website',aria_label='Search website'),el('div','search-results'));body.append(dialog)
 dest=P/item['route'].lstrip('/')/'index.html' if item['route']!='/' else P/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b'<!doctype html>'+html.tostring(page,encoding='utf-8',method='html'))
 def words(e):return collections.Counter(re.findall(r'[\w]+(?:[’\u0027-][\w]+)*',' '.join(e.itertext())))
 a,b=words(m),words(content);missing=a-b
 # Registration and homepage sections moved physically; all substantive copy retained. Players has transient loader removed.
 report.append({'route':item['route'],'source_tokens':sum(a.values()),'output_tokens':sum(b.values()),'missing_tokens':dict(missing)})
(P/'assets/routes.json').write_text(json.dumps([{'route':x['route'],'title':x['title']} for x in manifest],indent=2))
(R/'guidelines/content-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
