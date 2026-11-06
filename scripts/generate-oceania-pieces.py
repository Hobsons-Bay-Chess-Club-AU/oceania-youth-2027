"""Generate original, editable Oceania Youth 2027 SVG chess pieces."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/chess/oceania-2027"
FLAGS = ["au", "nz", "fj", "pg", "sb", "pw", "gu", "nr", "nc", "to", "vu", "ki", "mh"]
NAMES = {"K": "King", "Q": "Queen", "R": "Rook", "B": "Bishop", "N": "Knight", "P": "Pawn"}


def flag_band():
    result = []
    for index, country in enumerate(FLAGS):
        root = ET.parse(ROOT / f"public/pacific/flags/{country}.svg").getroot()
        if "viewBox" not in root.attrib:
            width = re.sub(r"[^\d.]", "", root.attrib.get("width", "640"))
            height = re.sub(r"[^\d.]", "", root.attrib.get("height", "480"))
            root.set("viewBox", f"0 0 {width} {height}")
        root.set("x", str(18 + index * 64 / 13))
        root.set("y", "101")
        root.set("width", str(64 / 13))
        root.set("height", "5")
        root.set("preserveAspectRatio", "xMidYMid meet")
        svg = ET.tostring(root, encoding="unicode")
        for identifier in re.findall(r'\bid="([^"]+)"', svg):
            svg = svg.replace(f'id="{identifier}"', f'id="{country}-{identifier}"')
            svg = svg.replace(f'url(#{identifier})', f'url(#{country}-{identifier})')
            svg = svg.replace(f'href="#{identifier}"', f'href="#{country}-{identifier}"')
        result.append(svg)
    return "".join(result)


def crown_star():
    return '<path d="M50 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="url(#gold)"/>'


def artwork(role):
    stem = '<path d="M39 52h22c-5 13-2 25 11 37H28c13-12 16-24 11-37z" fill="url(#body)"/>'
    collar = '<ellipse cx="50" cy="54" rx="17" ry="4" fill="url(#gold)"/>'
    if role == "K":
        return stem + '<path d="M30 33l7 10 5-16 8 12 8-12 5 16 7-10-5 20H35z" fill="url(#body)"/>' + collar + crown_star()
    if role == "Q":
        return stem + '<path d="M25 30l10 12 3-20 12 17 12-17 3 20 10-12-9 23H34z" fill="url(#body)"/><g fill="url(#gold)"><circle cx="25" cy="29" r="3"/><circle cx="38" cy="21" r="3"/><circle cx="50" cy="16" r="5"/><circle cx="62" cy="21" r="3"/><circle cx="75" cy="29" r="3"/></g>' + collar
    if role == "B":
        return stem + '<path d="M50 14C42 25 32 33 32 42c0 10 8 15 18 15s18-5 18-15c0-9-10-17-18-28z" fill="url(#body)"/><path d="M55 24l-10 20" stroke="url(#gold)" stroke-width="4"/><circle cx="50" cy="13" r="3" fill="url(#gold)"/>' + collar
    if role == "N":
        return '<path d="M30 89c3-18 11-27 18-35l-13 8-12-7-2-10 18-17 6-13 12 6 8-7 4 17c14 11 17 23 14 39l-3 19z" fill="url(#body)"/><path d="M58 29c12 11 14 26 8 39" fill="none" stroke="url(#gold)" stroke-width="3"/><path d="M27 45l13-4-6 12" fill="none" stroke="url(#gold)" stroke-width="2"/><circle cx="45" cy="33" r="2.6" fill="url(#gold)"/>'
    if role == "R":
        return '<path d="M27 24h12v10h7V24h9v10h7V24h12v22H27z" fill="url(#body)"/><path d="M34 46h32l-3 34 9 9H28l9-9z" fill="url(#body)"/><path d="M31 46h39M35 53h30" stroke="url(#gold)" stroke-width="3"/><path d="M45 61q5-11 10 0v11H45z" fill="url(#gold)"/>'
    return '<path d="M41 50h18c-4 15-1 26 12 39H29c13-13 16-24 12-39z" fill="url(#body)"/><circle cx="50" cy="36" r="14" fill="url(#body)"/><path d="M43 29q7-6 12 0" fill="none" stroke="url(#gold)" stroke-width="2"/>' + collar


def generate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    flags = flag_band()
    for color in "wb":
        light, dark = ("#fff8e7", "#d9d2b5") if color == "w" else ("#32666a", "#07333d")
        outline = "#17484b" if color == "w" else "#e0bc64"
        for role, name in NAMES.items():
            svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
<title>Oceania Youth 2027 — {"White" if color == "w" else "Black"} {name}</title>
<desc>Ivory, ocean teal and gold chess piece. A shared wave and the flags of Australia, New Zealand, Fiji, Papua New Guinea, Solomon Islands, Palau, Guam, Nauru, New Caledonia, Tonga, Vanuatu, Kiribati and Marshall Islands unite the base.</desc>
<defs><linearGradient id="body" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="{dark}"/><stop offset=".42" stop-color="{light}"/><stop offset="1" stop-color="{dark}"/></linearGradient><linearGradient id="gold"><stop stop-color="#b88732"/><stop offset=".45" stop-color="#f1d58d"/><stop offset="1" stop-color="#c99941"/></linearGradient></defs>
<ellipse cx="50" cy="113" rx="35" ry="3" fill="#072c33" opacity=".18"/>
<g stroke="{outline}" stroke-width="1.4" stroke-linejoin="round">{artwork(role)}
<path d="M30 77q10-7 20 0t20 0" fill="none" stroke="#35a3a6" stroke-width="3"/>
<path d="M28 88q22-8 44 0l10 18q2 5-4 5H22q-6 0-4-5z" fill="url(#body)"/>
<ellipse cx="50" cy="89" rx="23" ry="4" fill="url(#gold)"/>
<path d="M21 98h58M20 108h60" stroke="url(#gold)" stroke-width="2"/></g>
{flags}
</svg>'''
            (OUTPUT / f"{color}{role}.svg").write_text(svg)
    (OUTPUT / "NOTICE.md").write_text("Original Oceania Youth 2027 chess-piece artwork, generated from scripts/generate-oceania-pieces.py.\n\nThe event logo inspired the ivory/ocean/gold palette, knight silhouette and wave detail. Each piece shares a base band with all 13 federation flags. Flag assets are embedded unchanged from public/pacific/flags; see public/pacific/README.md for their source.\n")
    print("Generated 12 Oceania Youth 2027 SVG pieces.")


if __name__ == "__main__":
    generate()
