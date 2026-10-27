# Developer handoff — V2

## Files

`preview/` is a complete buildless reference implementation using fresh HTML, site.css and site.js. The existing Next application is not embedded in it. This makes the visual system easy to inspect and port without the previous hydration/override workaround. The local server is only for previewing static files.

## Integrate

1. Keep your current content/data sources, routes, business logic, APIs, payments and submission handlers.
2. Copy new vector assets and licensed fonts into your public assets folder.
3. Import semantic tokens and the two font faces; translate named components from site.css into your own component styling system.
4. Use the new page structure as the layout reference. `home-lead`, `home-stats`, `bulletin`, `age-explorer`, `schedule-workspace`, `rules-workspace`, `entry-workspace`, `players-workspace` and the other named page components have their own composition.
5. Keep the original H1 text and use spans only for display layout. Do not insert new marketing copy or rewrite rules.
6. Port the theme behavior into your preferred framework. Persist an explicit light/dark preference; resolve the initial system preference before first paint.
7. Keep your real Next Link navigation, forms, live board integration, fee rules and player feed. site.js contains local preview interactions, not replacement backend or chess-engine code.
8. Test all existing workflows in your actual application after integration. The preview is a design handoff, not a release build of your existing app.

## Content

Original main-page content is extracted from the retained HTML snapshots, physically reorganised into new compositions and stripped of old styling classes. All original main-page links are retained. The homepage counters show original source-code target values (13 federations / 14 championships / 25 rounds / 7 age divisions) rather than the server HTML's zero-frame animation placeholders. The directory's transient loading skeleton is replaced by the existing public players.json snapshot. That JSON is included unchanged. No new player records or tournament data have been invented.

## Local behavior limits

Forms validate but do not transmit. The external entry links remain available. Broadcast content is the original teaser; selecting its pairing is a visual demonstration and does not establish a live DGT connection. Calendar export uses the existing date and event title as a date-only local calendar event; wire in the production calendar action when integrating. The countdown uses the original opening date. Player filtering uses the included data snapshot; production should keep its existing live source. These prototype helpers do not authorise changing production behavior.

## Review

Open `/review.html` to inspect desktop and phone versions of every main page, and use the Light / Dark button to compare themes. `/design-system.html` contains the token and asset gallery. Re-run the source comparison before release; the user's visual-only/content-preservation requirement remains in force.
