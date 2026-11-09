# Multilingual Oceania Youth 2027 site — proposed design

## Confirmed intent

The user wants site-wide multilingual support covering the common languages of all thirteen federations currently represented on the site, including local languages. This is not limited to broadcast controls. Existing English content and URLs must keep working on the static GitHub Pages deployment.

## Proposed language coverage

These are target translation catalogues, not claims that translations already exist or that every resident speaks the listed languages. They focus on shared and principal local languages rather than every indigenous language.

| Federation | Target languages |
| --- | --- |
| Australia | English (`en`) |
| New Zealand | English, Māori (`mi`) |
| Fiji | English, Fijian / iTaukei (`fj`), Fiji Hindi (`hif`) |
| Papua New Guinea | English, Tok Pisin (`tpi`), Hiri Motu (`ho`) |
| Solomon Islands | English, Solomon Islands Pijin (`pis`) |
| Palau | English, Palauan (`pau`) |
| Guam | English, CHamoru (`ch`) |
| Nauru | English, Nauruan (`na`) |
| New Caledonia | French (`fr`) |
| Tonga | English, Tongan (`to`) |
| Vanuatu | English, French, Bislama (`bi`) |
| Kiribati | English, Gilbertese / Kiribati (`gil`) |
| Marshall Islands | English, Marshallese (`mh`) |

Fiji Hindi is not interchangeable with Standard Hindi. Do not substitute one silently. New Caledonia has multiple Kanak languages; French provides shared coverage in this scope. The catalogue can accept further language packs later.

References inspected 7 November 2026:

- Pacific Community language table: https://stats.pacificdata.org/vis?df%5Bag%5D=SPC&df%5Bds%5D=ds%3ASPC2&df%5Bid%5D=DF_KEYFACTS&df%5Bvs%5D=1.0&dq=A..LAN
- Vanuatu government: https://www.gov.vu/index.php/about/about-vanuatu
- Tonga tourism authority: https://www.tongatourism.travel/discover/people-and-culture
- Tourism Fiji: https://www.fiji.travel/things-to-know/destination-guide/culture-language-region-of-fiji
- Fiji government language use: https://www.finance.gov.fj/fijis-citizen-budget-2/
- Guam official language law: https://guamcourts.gov/CompilerofLaws/GCA/01gca/1gc007.PDF
- Māori language status: https://nzhistory.govt.nz/maori-becomes-an-official-language

## Confirmed translation policy

There are no existing translation files or federation-approved local-language texts in the repository. The user selected clearly marked draft translations for federation review. English fallback remains mandatory for text that cannot be responsibly drafted. A language registry alone must not be presented as a fully translated site.

Do not invent low-confidence translations or describe AI drafts as federation-approved. Record translation status by language and content section. Untranslated content falls back to English and identifies its language for assistive technology. Publish language options honestly: complete translations, clearly marked drafts if authorized, or languages that have some approved coverage with a clear fallback notice. Do not list an empty catalogue as a working translation.

## Implementation approach

Recommended: versioned translation dictionaries and statically exported localized routes. This keeps content available before browser JavaScript runs, gives each language shareable URLs and correct language metadata, and works without a translation API at runtime.

An embedded third-party auto-translation widget would be quicker to add but cannot guarantee all the requested languages, translation quality, consistent controls, or translated static HTML. It is not the recommended implementation.

Keep current English URLs. Use `/fr/...`, `/to/...` and corresponding locale prefixes for published translations. Separate English and localized root layouts using Next.js route groups so each exported document has the correct `<html lang>`. Share page components and the shell rather than duplicating complete pages. Generate every supported page/locale combination at build time, including news slugs. Localized links preserve language, while links to external registration services and original documents retain their real destinations.

A language control in the header and mobile navigation displays language names, not country flags. Offer browser-language matching on first visit and persist an explicit choice in local storage. Do not force language from a federation, player identity, IP address, or geolocation. Keep all switcher options keyboard accessible. Language switching preserves the current page when a translation exists and makes any English fallback clear.

## Content inventory

The current site has no i18n infrastructure. English strings occur in components, page data, static news, generated PDF content, accessibility labels, status messages and search metadata.

Translate:

- Header, navigation, search, footer and theme controls.
- Home page, countdown, statistics, registration roadmap and registration instructions.
- Schedule, location, venue, map, organiser, sponsors and federation support pages.
- Player directory controls, divisions, categories, errors and loading states.
- Broadcast overview/detail/fullscreen, move controls, piece settings and notices.
- Contact form labels, validation and success/error messages.
- Regulation webpage and news titles, summaries and bodies where translations are supplied.
- Page titles, descriptions, image alternatives and accessible control names.

Keep player names, FIDE IDs, ratings, PGN moves, source tournament names, email addresses, URLs and organization names as supplied. Format dates, counts and currency by locale while retaining event times in Melbourne time and prices in AUD. Official downloadable regulations remain the original document unless a separately approved translated document is supplied; identify their language beside the download.

## Verification

Validate dictionary keys, missing/extra keys, interpolation placeholders, plural/count behavior, URL generation, locale matching and fallback. Check translated search and mobile navigation. Ensure switching language preserves the page and saved preferences, including the broadcast's unrelated piece-set preference. Test longer text and diacritics at mobile and desktop sizes. Verify representative exported pages contain translated text and correct language/canonical/hreflang metadata without JavaScript. Run the full tests, TypeScript and isolated static production build. Native-language review remains a separate content-quality check from software tests.

## Implementation status

English routes are retained under a route-group layout; fourteen locale-prefixed route sets are statically exported. English plus fourteen draft/review catalogues cover the target registry. French has broad page coverage; seven Pacific-language dictionaries have roughly 150 entries each. Six lower-resource catalogues are sparse, and Nauruan is explicitly an English review template with zero translated entries. This is not complete translation support for those languages.

Localized draft pages use `noindex, follow` until content review. Shared metadata and icons are inherited; each page owns its canonical and language alternates. The translation boundary operates on React elements before output, leaving state identifiers/form values intact and excluding protected player names. No DOM text mutation or external translation API is used.
