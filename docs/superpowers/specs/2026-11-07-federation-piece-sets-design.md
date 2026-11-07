# Federation-inspired pieces and adaptive mode

## Intent

Extend the broadcast viewer with a selectable set for each Oceania country or territory, using flags and recognizable symbols. Adaptive mode assigns White's pieces from White's federation and Black's pieces from Black's federation. The official Oceania Youth 2027 set remains the default and stays featured above other choices.

## Confirmed coverage

The user selected only the thirteen federations currently represented on the site: Australia, New Zealand, Fiji, Papua New Guinea, Solomon Islands, Palau, Guam, Nauru, New Caledonia, Tonga, Vanuatu, Kiribati and Marshall Islands. Generate twelve pieces each: 156 new SVG assets. The geographic expansion to other Oceania territories is outside this change.

## Approaches

1. Recommended: original editable SVG artwork with recognizable chess silhouettes, place-specific details, and flag inlays. Each set contains twelve pieces. This extends the existing artwork system and remains crisp in the board wall.
2. Raster illustrations offer more elaborate scenes but require substantially more assets and make small-board piece recognition harder. Do not use this approach for the proposed implementation.

## Artwork

Keep the king, queen, bishop, knight, rook and pawn identifiable at small sizes. Give each place more than a palette swap: use distinct flag-derived stars, birds, trees, suns, canoes, crosses or geometric elements in crowns, shields, collars and bases. Examples are Australia's Commonwealth star, New Zealand's Southern Cross, Papua New Guinea's bird-of-paradise, Palau's moon, Norfolk Island's pine, Kiribati's bird/sun/waves, and Tokelau's canoe. Research the remaining motifs against flag sources before drawing them.

Every set has an ivory-dominant White side and a dark-dominant Black side, with the same identifying accents. Preserve contrast even when both players use the same federation. Flags remain recognizable and are attributed. The illustrations are event artwork inspired by countries and territories, not official federation logos.

## Settings

Keep the official set as a prominent first card. Add a separate Adaptive option explaining that each side follows its player's federation. Keep the four existing alternative styles together, then add a searchable country/territory gallery with flags, names and previews. A manual country selection uses that set for both sides. Selecting any preference applies immediately across all boards, player icons, detailed viewers and fullscreen views, and persists in local storage. Preserve existing saved choices.

## Adaptive resolution

Resolve each side independently. Prefer an explicit PGN federation/country tag when present and recognized, then match its WhiteFideId/BlackFideId to the site's public player directory, which already contains federation and FIDE ID. Normalize ISO and supported FIDE federation codes through an explicit alias catalogue. Do not infer nationality from names or flags elsewhere on the board. If information is absent, unsupported or conflicting, use the official Oceania set for that side.

The sampled Lichess PGN has WhiteFideId and BlackFideId but no country tags. Adaptive matching therefore depends on the player-directory snapshot for those broadcasts. This works with GitHub Pages: generate a compact FIDE-ID-to-federation mapping at build time; no private runtime API is required. Keep unnecessary player fields out of the broadcast bundle.

## Validation

Test all twelve assets per set, preference persistence, aliases, independent side selection, FIDE ID mapping, missing metadata, conflicting IDs, and preservation of existing settings. Review contact sheets for all pieces and representative small/fullscreen boards. Confirm keyboard operation of settings and adaptive fallback. Run tests, TypeScript and an isolated static production export.

## Artwork references

Existing flags and sources: public/pacific/README.md. The New Caledonia set follows the site's existing flag and uses an original cagou-inspired detail. These assets are decorative event artwork.

- Nauru star: https://www.nauru.gov.nr/government-information-office/fact-sheet.aspx
- Vanuatu tusk/fern: https://www.vanuatutourism.com/practical/flag-and-emblem/
- New Caledonia bird reference: https://www.province-sud.nc/wp-content/publications/Environnement/Biodiversite/FauneCaledonienne/

Regenerate with `python3 scripts/generate-federation-pieces.py`. All artwork remains editable SVG. Contact sheet: docs/assets/federation-piece-sets-preview.png.
