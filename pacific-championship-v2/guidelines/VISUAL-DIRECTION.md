# Pacific Championship / V2 — visual direction

## Concept

A Pacific chess championship expressed as a sporting editorial identity: oversized condensed typography, warm paper, precise rules, a cobalt chess-and-coast illustration and restrained vermilion accents. Chess is the main visual object; the countries and islands are part of the artwork rather than a repeated decorative flag strip.

The previous approach retained the old page shells and put a new skin on their card layout. V2 uses newly composed markup and a separate component system. There are no gradient cards, glass effects, floating pill navigation, oversized countdown tiles, repeated flag ribbons or generic icon-in-a-box grids.

## Typography

Barlow Condensed Bold is the display face. Manrope is the reading/interface face. Both are self-hosted, and their SIL Open Font Licences are included. Use display type for event/year/date/section hierarchy; never for regulation paragraphs or long controls. Reading paragraphs use 14–16px on desktop, 13–14px on a compact phone. Large year lettering is part of the original H1, not additional copy. Long articles retain a comfortable reading measure.

## Colour

Use semantic colour names from tokens.css. Paper is warm ivory in light mode and deep sea in dark mode. Ink reverses between the modes. Blue controls primary actions, selected navigation and display figures. Orange is sparing editorial emphasis. The large illustration's saturated cobalt and coral remain fixed artwork colours. Text uses the higher-contrast semantic palette, not the artwork coral.

## Geometry and rhythm

Square edges, one-pixel rules and deliberate asymmetry. The default corner radius is zero. There are no drop shadows. Use large section spacing and sparse borders to organise information. A page should read as a composition, not a stack of rounded boxes. Header and footer belong to the same typographic identity.

## Regional artwork

The new knight is an original simple silhouette with a wave cut through its base. Its head appears in the masthead, page notation and the main poster-style illustration. The hero combines 13 supplied geographic silhouettes, ocean contour lines, a perspective checkerboard and an ivory knight. Geography is decorative and not a scale map. All countries/territories already named in the site's regional copy are represented: Australia, New Zealand, Fiji, Papua New Guinea, Solomon Islands, Palau, Guam, Nauru, New Caledonia, Tonga, Vanuatu, Kiribati and Marshall Islands.

Do not turn these assets into an eligibility statement. Preserve the original eligibility wording and membership list. No indigenous or sacred patterns have been invented. Keep separate individual flag and silhouette assets available for future editorial uses.

## Responsive behavior

Desktop hero is a 1.15:1 split composition. Phone hero becomes a typographic lead followed by full-width art. Timetable day navigation moves from a left rail to a compact row. Rules contents moves above the document. Player filters move above the directory; partner lists, venue spreads and contact columns stack. Do not hide substantive information on smaller screens. Test phone width with review.html and the actual source application.

## Interaction and accessibility

Keep visible keyboard focus, proper labels, native controls, an accessible menu toggle and keyboard search. The theme switch is in the masthead; initial preference follows the system and an explicit choice persists locally. No automatic banner rotation or metric animation. The original banner is present further down the home page, with its original content intact. Respect reduced motion. Decorative country imagery is aria-hidden; individually meaningful imagery in the asset gallery is labelled.

Source copy is unchanged; layout, hierarchy and section order are intentionally different. New skip-navigation and theme/search accessibility labels are interface additions, not tournament claims.
