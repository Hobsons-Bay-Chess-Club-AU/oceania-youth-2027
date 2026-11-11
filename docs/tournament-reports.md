# Hidden pairings/results and standings prototypes

Open `/pairings/` and `/standings/` directly. These pages link to each other but are not in site navigation, footer menus or search. Both have noindex metadata while in development. English URLs and the normal site shell are retained.

## Data source

`public/tournament/sample-results.json` is the shared, explicitly fictional data source. It covers fourteen divisions (U8/U10/U12/U14/U16/U18/U20, Open and Girls) across Classical, Rapid and Blitz. Every competition has completed rounds 1–2, a partially completed round 3, and scheduled round 4, plus standings snapshots after rounds 1–3. U10 Girls demonstrates an odd field and byes; U16 Girls Classical includes a forfeit example. No FIDE IDs are invented.

Regenerate the sample using `python3 scripts/generate-sample-results.py`. It is illustrative round-robin-style fixture generation, not a Swiss pairing engine. Sample game times, names, federations and ratings are not an official report or timetable.

TypeScript contracts are in `lib/tournament-results.ts`. The JSON is imported by `lib/tournament-data.ts`, which validates cross-references during the build. Replace the file with the tournament source data and rebuild/redeploy; there is no runtime API or automatic polling in this prototype. Keep `isSample: true` for demonstration data. Switch it off only for genuine tournament data.

## Model

Top level:

- `schemaVersion`: currently 1.
- `isSample`, `eventName`, `updatedAt`, `timeZone`.
- `formats`: format ID/name, time-control label and total planned rounds.
- `divisions`: age/category, roster and competitions for each format.
- `tieBreakDescription`: an explanatory label for the supplied ranking order.

A roster player has a unique ID within its division, name, optional chess title, seed, federation code/flag/name, and ratings keyed by format ID. IDs are referenced from pairings and standing rows; they are not inferred from player names.

Each division competition has `formatId`, optional `updatedAt`, `rounds`, and `standings` snapshots. Round timestamps include offsets and render in the configured event timezone, including daylight-saving offsets. Round statuses are `scheduled`, `live` or `completed`.

Pairings have an ID, board number, White/Black player IDs, game status and result. A null result means no result has been reported; `status` distinguishes `scheduled` and `playing`. Completed result values are `1-0`, `0-1`, `1/2-1/2`, `1-0F`, `0-1F`, or `bye`. A bye has null board/Black ID, its recipient in `whiteId` solely as the player reference, and `byePoints` (normally 1 or 0.5). It does not assign a playing color. Awarded byes can be known before other games start. Result counters count board games separately from byes.

`whitePointsBefore`/`blackPointsBefore` show pre-round scores. Use null when not yet known, including future rounds whose preceding games are unfinished.

A standings snapshot contains `afterRound`, `provisional`, and ordered rows. Each row supplies `rank`, player reference, points, completed rounds, wins/draws/losses/byes, Buchholz/Sonneborn–Berger values, and round-by-round W/D/L/B form. `played` includes awarded byes; it equals wins + draws + losses + byes. The renderer preserves supplied rank and tie-break values, even when filtered; it does not implement FIDE tie-break adjustments or Swiss pairing rules. The fixture generator's simplified tie-break examples are for design only. Production ranking must come from the official tournament source.

## Controls

Both pages switch championship format and division. Pairings switch all published rounds; standings switch published snapshot rounds. The default is the live round/latest snapshot. Future round pairings link to the latest available standings snapshot. Format/division/round selections are reflected in URL query parameters and preserved between the two report pages. Invalid query values fall back to an available selection. Changing format or division clears player/federation/status filters; changing round preserves them.

Search matches player names, federation name/code, titles, and board numbers on pairings. Federation filters apply within the selected division. Pairings add status and bye filters. Empty matches offer a clear-filters control. Mobile pairings use stacked player rows with a large vertically centered result; standings scroll within their own region to keep all ranking/tie-break columns accessible.

## Verification

`npm test` verifies all sample references, duplicate participants, every age/category/format, formatting of draws/forfeits/byes, default live round selection, and standings points reconstructed from completed results. `npm run typecheck` and an isolated `npm run build` verify page integration. Static-export checks confirm each hidden route renders sample data and remains absent from main navigation and search.
