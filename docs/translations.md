# Translation drafts and federation review

## Feature flag

The language selector and browser-language suggestion are hidden by default. Set `NEXT_PUBLIC_ENABLE_I18N=true` in your local environment or the GitHub Actions repository variable to show them, then rebuild (restart the development server locally). Only the exact value `true` enables the controls. Existing English URLs remain the default. Localized draft URLs remain available directly for federation review, with their review notices intact.

The site preserves English URLs and exports localized versions under language prefixes, for example `/fr/schedule/`, `/to/registration/` and `/tpi/dgt-boards/`. Select a language in the header. An explicit choice is remembered in `oy27-language`; browser preferences are offered as a suggestion without forcing a redirect or inferring language from federation.

Every non-English page shows its draft/review status and entry count. Untranslated text stays in English and is tagged with `lang="en"`. Original player names, chess notation, identifiers, ratings and form values are preserved. PDFs, embedded artwork text, external registration services and browser-native validation remain in their original language. Draft localized pages are not indexed by search engines while awaiting review.

## Current coverage

There are fifteen language choices including English. French has broad draft coverage across pages and news. Māori, Fijian, Fiji Hindi, Tok Pisin, Solomon Islands Pijin, Tongan and Bislama have partial UI drafts. CHamoru, Palauan, Hiri Motu, Kiribati and Marshallese currently have small glossaries. Nauruan is an explicitly labelled review template with English fallback throughout; reliable draft text was unavailable. These statuses must not be described as fully translated or federation-approved.

Exact draft counts and source-entry totals are generated at `public/translations/coverage.json`. Catalogue files are flat JSON maps from exact rendered English text to draft translations in `locales/{language}.json`. Notes and source limitations are alongside them in `locales/*-notes.md`.

## Reviewing text

Run `npm run translations:export` after editing content or dictionaries. This exports:

- `public/translations/source.json`: the source inventory, including dictionary keys.
- `public/translations/review/{language}.csv`: English source, draft translation and review status.
- `public/translations/coverage.json`: per-language draft entry counts and status.

The CSV downloads are linked from each localized page's notice. Missing translations have empty draft cells and are marked as English fallback. Federation reviewers can use these sheets to correct drafts and supply missing content; no data is submitted automatically.

Copy reviewed text into the corresponding JSON dictionary without changing English keys, placeholders, names, numbers or URLs. Placeholder names such as `{count}` must match exactly; the export command rejects mismatches. Review sheets are draft exports and do not track approval automatically. Keep the draft notices until there is an explicit content-approval workflow and the affected language has been checked by a competent reviewer.

French notes identify conflicting source statements about accommodation and refund conditions. Resolve source discrepancies in the English content before approving the corresponding translations. Original downloadable regulations remain authoritative source documents; translated webpage copy is marked draft.

The build runs the export automatically through `prebuild`; GitHub Actions also has an explicit export step because its Next.js build command bypasses npm lifecycle scripts.

## Verification

Run `npm test`, `npm run typecheck` and `npm run build`. After route moves, Next.js must regenerate `.next/types`; stale dev-generated route types can report removed old paths. Use a clean isolated build rather than clearing a running development server's output.

Inspect representative exported pages for translated text, localized links, correct `<html lang>`, English fallback annotations, draft status, canonical URLs and language alternates. Software tests cannot certify translation accuracy; federation review is still required.
