# Oceania Youth 2027 — Pacific Championship / V2

This version rebuilds the page layouts and visual identity. It does not use the previous CSS overlay, Tailwind utilities, React/Next bundles or original page shells. Original tournament copy, names, dates, fees, article text, PDFs and existing destinations remain the content source.

## Mac: double-click to preview

1. Unzip this package.
2. Double-click `Start-preview.command`.
3. The preview starts and your default browser opens automatically.

Keep Terminal open. Press Control+C to stop. Uses an installed Node.js or Python 3; no npm install/build required. If port 8000 is busy, another local port is selected automatically.

## Explore

- `/` — redesigned tournament home and all original linked pages.
- `/review.html` — desktop and phone previews side by side; choose a page and toggle light/dark.
- `/design-system.html` — fonts, colour tokens, signature artwork, 13 country/territory assets and component examples.

For example, if the launcher prints http://127.0.0.1:8000/, open http://127.0.0.1:8000/review.html for the responsive review. Use the port printed by your launcher.

## Handoff

- `guidelines/VISUAL-DIRECTION.md`
- `guidelines/PAGE-BY-PAGE.md`
- `guidelines/DEVELOPER-HANDOFF.md`
- `guidelines/ASSETS-AND-LICENCES.md`
- `design-system/tokens.json` and `tokens.css`
- `preview/assets/` — editable artwork, self-hosted fonts and countries/flags.
- `source-snapshots/` — retained original public source pages for the content audit.

## Scope

A standalone visual prototype with local interactions, not a production replacement for your application. Search, theme switching, day/search filters, directory filtering, fee controls and age-category exploration run locally. Forms validate but do not send; real forms, subscriptions, payment, registration, live feeds and all backend integrations remain in your existing application. External registration links still point to the original portal. No live website was changed.
