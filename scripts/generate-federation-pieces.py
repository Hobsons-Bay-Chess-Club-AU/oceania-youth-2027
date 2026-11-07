"""Original federation-inspired SVG chess pieces; run from any directory."""
from pathlib import Path
import math
import re
import runpy
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = runpy.run_path(str(ROOT / 'scripts/generate-oceania-pieces.py'))
SETS = [
    ('au', 'Australia', '#124f3e', '#e6bb49', 'Commonwealth stars and eucalyptus leaves'),
    ('nz', 'New Zealand', '#182d46', '#c9dde6', 'Silver fern and Southern Cross'),
    ('fj', 'Fiji', '#175a86', '#74d2f2', 'Coconut palms and shield'),
    ('pg', 'Papua New Guinea', '#5a1723', '#e5b846', 'Bird-of-paradise wings'),
    ('sb', 'Solomon Islands', '#164e4c', '#e5c143', 'Five stars and a golden diagonal'),
    ('pw', 'Palau', '#116275', '#f4d254', 'Golden moon and lagoon waves'),
    ('gu', 'Guam', '#213f70', '#e66d69', 'Coconut palm, canoe and pointed shield'),
    ('nr', 'Nauru', '#172f63', '#f0ca50', 'Twelve-pointed star and equator line'),
    ('nc', 'New Caledonia', '#184e46', '#efbd4e', 'Cagou-inspired crest and tricolor accents'),
    ('to', 'Tonga', '#731c31', '#ed6a70', 'Red cross and royal bands'),
    ('vu', 'Vanuatu', '#214d34', '#e9c44c', 'Curved tusk and fern fronds'),
    ('ki', 'Kiribati', '#602b3b', '#f0c453', 'Frigatebird, rising sun and waves'),
    ('mh', 'Marshall Islands', '#243f70', '#ee9c57', 'Radiant star and diagonal beams'),
]


def star(cx, cy, outer, inner, points=5):
    coords = []
    for i in range(points * 2):
        a = -math.pi / 2 + i * math.pi / points
        r = outer if i % 2 == 0 else inner
        coords.append(f'{cx + math.cos(a)*r:.2f},{cy + math.sin(a)*r:.2f}')
    return '<polygon points="' + ' '.join(coords) + '"/>'


def fern():
    return '<path d="M-5 9Q3 0 5-10M-2 4l-6-2M0 1l-6-3M2-3l-5-3M4-7l-4-3M-1 3l7 1M1 0l7-1M3-4l6-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'


def palm():
    return '<path d="M0 10Q3 0 0-7M0-6q-7-8-12 0 6-3 12 0M0-6q7-8 12 0-6-3-12 0M0-6q-1-9-7-9M0-6q3-9 8-9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'


def bird():
    return '<path d="M-14-5Q-6-5-2 0L0-4 3 0Q7-7 15-7L6 2 1 3 8 9 0 6-3 1z"/>'


def motif(code):
    if code == 'au':
        return star(0, -1, 8, 3.8, 7) + '<path d="M-13 10q0-9 6-9-1 6-6 9M13 10q0-9-6-9 1 6 6 9"/>'
    if code == 'nz': return fern() + star(-10, -7, 2.3, 1) + star(11, 5, 2, .8)
    if code == 'fj': return '<path d="M-12-10H12v12Q6 11 0 13-6 11-12 2z" fill="none" stroke="currentColor" stroke-width="1.3"/>' + '<g transform="scale(.68)">' + palm() + '</g>'
    if code == 'pg': return bird() + '<path d="M-4 3q-13 3-10 11M-1 4q-9 5-7 11" fill="none" stroke="currentColor" stroke-width="1.7"/>'
    if code == 'sb': return '<path d="M-13 12L13-12" fill="none" stroke="currentColor" stroke-width="2.5"/>' + ''.join(star(x,y,2.7,1.2) for x,y in [(-9,-7),(-2,-7),(-9,0),(5,5),(11,10)])
    if code == 'pw': return '<circle cy="-3" r="8"/>' + '<path d="M-14 9q7-4 14 0t14 0M-12 13q6-3 12 0t12 0" fill="none" stroke="currentColor" stroke-width="1.5"/>'
    if code == 'gu': return '<path d="M0-16q-17 12 0 31 17-19 0-31z" fill="none" stroke="currentColor" stroke-width="1.5"/><g transform="translate(0 -1) scale(.57)">' + palm() + '</g><path d="M-7 8h14l-4 3H-3z"/>'
    if code == 'nr': return star(0,2,9,5.8,12) + '<path d="M-14-12H14" stroke="currentColor" stroke-width="2"/>'
    if code == 'nc': return '<path d="M-7 11Q-7 0 0-2l2-7 5 2 4 3-7 1Q10 2 6 10zM0-7l-4-8M2-9l1-8M4-9l5-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
    if code == 'to': return '<path d="M-3-12h6v9h9v6H3v9h-6V3h-9v-6h9z"/>'
    if code == 'vu': return '<path d="M8-11C-9-19-18 1-8 10 2 20 17 6 8-2 3-7-4-3-3 2" fill="none" stroke="currentColor" stroke-width="3"/><g transform="translate(2 0) scale(.65)">' + fern() + '</g>'
    if code == 'ki': return '<g transform="translate(0 -8) scale(.65)">' + bird() + '</g><path d="M-8 4a8 8 0 0116 0z"/>' + '<path d="M-13 8q6-4 13 0t13 0M-13 13q6-4 13 0t13 0" fill="none" stroke="currentColor" stroke-width="1.6"/>'
    return star(0,0,12,4,24) + '<path d="M-13 12L-7 8M7-8l6-4" stroke="currentColor" stroke-width="2.5"/>'


def flag(code):
    root = ET.parse(ROOT / f'public/pacific/flags/{code}.svg').getroot()
    if 'viewBox' not in root.attrib:
        dims = [re.sub(r'[^\d.]', '', root.attrib.get(k, d)) for k,d in [('width','640'),('height','480')]]
        root.set('viewBox', '0 0 ' + ' '.join(dims))
    for key,value in {'x':'35','y':'97','width':'30','height':'10','preserveAspectRatio':'xMidYMid meet'}.items():root.set(key,value)
    svg = ET.tostring(root,encoding='unicode')
    for identifier in re.findall(r'\bid="([^"]+)"',svg):
        svg=svg.replace(f'id="{identifier}"',f'id="flag-{identifier}"').replace(f'url(#{identifier})',f'url(#flag-{identifier})').replace(f'href="#{identifier}"',f'href="#flag-{identifier}"')
    return svg


def generate():
    for code,name,dark,accent,details in SETS:
        out=ROOT / f'public/chess/federations/{code}';out.mkdir(parents=True,exist_ok=True)
        emblem=motif(code)
        for color in 'wb':
            body_light,body_dark=('#fff9e9','#ded7bf') if color=='w' else (dark,'#101e2e')
            outline='#213c43' if color=='w' else '#eeddb3'
            for role,role_name in BASE['NAMES'].items():
                shape=BASE['artwork'](role)
                # The king's finial takes its federation's emblem instead of the event star.
                if role=='K':shape=shape.replace(BASE['crown_star'](),f'<g transform="translate(50 14) scale(.45)" fill="{accent}" color="{accent}" stroke="none">{emblem}</g>')
                svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
<title>{name} — {'White' if color=='w' else 'Black'} {role_name}</title>
<desc>Original federation-inspired chess piece: {details}. Recognizable chess silhouette with an inset flag.</desc>
<defs><linearGradient id="body"><stop stop-color="{body_dark}"/><stop offset=".4" stop-color="{body_light}"/><stop offset="1" stop-color="{body_dark}"/></linearGradient><linearGradient id="gold"><stop stop-color="{accent}"/><stop offset=".5" stop-color="#fff0bb"/><stop offset="1" stop-color="{accent}"/></linearGradient></defs>
<ellipse cx="50" cy="113" rx="35" ry="3" fill="#072c33" opacity=".18"/>
<g stroke="{outline}" stroke-width="1.3" stroke-linejoin="round">{shape}
<path d="M28 88q22-8 44 0l10 18q2 5-4 5H22q-6 0-4-5z" fill="url(#body)"/>
<ellipse cx="50" cy="89" rx="23" ry="3.5" fill="url(#gold)"/>
<path d="M22 96h56M20 108h60" stroke="{accent}" stroke-width="2.2"/></g>
<g transform="translate(50 73) scale(.7)" fill="{accent}" color="{accent}">{emblem}</g>
{flag(code)}
</svg>'''
                (out / f'{color}{role}.svg').write_text(svg)
        (out/'NOTICE.md').write_text(f'Original {name}-inspired SVG chess artwork generated by scripts/generate-federation-pieces.py.\n\nMotifs: {details}. These are original event illustrations, not official federation logos.\n\nThe embedded flag is retained from public/pacific/flags/{code}.svg; see public/pacific/README.md for its source.\n')
    print('Generated 156 pieces for the thirteen site federations.')

if __name__=='__main__':generate()
