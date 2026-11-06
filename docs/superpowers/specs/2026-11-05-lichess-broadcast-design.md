# Lichess broadcast page

## Intent

Replace the mock games at `/dgt-boards` with games fetched from a configurable array of Lichess PGN URLs. Keep the page hidden from menus, footer navigation, and site search while it is under development.

## Approach

Use browser-side fetching, compatible with the existing Next.js static export and GitHub Pages deployment. The user explicitly chose a public token over a private API proxy. Read the optional token from `NEXT_PUBLIC_LICHESS_TOKEN`, adding the bearer header only when configured. Never hardcode a token in tracked source. Public feeds also work without authentication.

A private server proxy was considered, but would require additional hosting. Build-time PGN snapshots were considered, but would not update during play. Neither matches the selected approach.

## Configuration and fetching

- Read comma-separated tournament IDs from `NEXT_PUBLIC_LICHESS_TOURNAMENTS` in `app/dgt-boards/data.ts`, for example `wsHmdvmw,2sSeYjPm`. Trim whitespace, ignore empty entries, deduplicate IDs, and report invalid IDs without requesting them. Construct each URL as `https://lichess.org/api/broadcast/{id}.pgn` and use PGN broadcast names as they become available. An empty setting shows a no-tournaments state.
- Request PGN text with `clocks=true&comments=true`. Each configured URL is treated as a separate tournament feed.
- Fetch the selected tournament on entry and selection; refresh periodically, without overlapping requests. Cancel obsolete requests on selection changes and unmount.
- Refresh using the PGN Variant tag: Standard every 60 seconds, Rapid every 15 seconds, and Blitz every 5 seconds. Default missing tags to 60 seconds and use the fastest interval for a mixed feed. Disable browser caching while retaining rate-limit backoff. Show when data was fetched; upstream delays can still apply.
- Show loading, no-games, and retryable error states. Preserve the last successful games on transient refresh failures, with a visible stale-data message.

## Viewer

- Retain the site's existing board-centered layout and responsive visual style.
- Replace all fictional players, evaluations, and moves with PGN data.
- Open each round to an overview grid showing every game's latest position, players, result, and recorded clocks. Selecting a board opens its detailed viewer. Provide an All boards control to return to the grid and restore focus to the selected preview. Changing rounds returns to the overview.
- Provide a fullscreen All boards mode with only the tournament name, round selector, exit control, and board grid. Adapt card sizes and column count to the available width, height, and number of games. Keep a readable minimum size and scroll if the complete feed cannot fit. Support native fullscreen with a fixed-layout fallback, Escape/exit, focus restoration, and continued feed refresh. Opening a board keeps its detail in the same fullscreen container; All boards returns to the fullscreen grid. Exiting fullscreen retains the current board or overview in the normal page.
- Select a tournament, then a round and game when available. The supplied URL contains several rounds; games from different rounds must remain distinguishable.
- Present each configured tournament as a division. Put division and round controls together above the board. Use round buttons on desktop and a select on narrow screens; preserve each division's round, board, and replay selection when switching divisions. Keep keyboard focus on the division control after switching.
- Show White and Black names, available ratings, event/round, result, opening, and recorded clock values.
- Render actual chess positions using a maintained chess rules/PGN library. Support move selection, start/previous/next/latest controls, and board orientation.
- Support Left/Right arrow keys for move replay in the visible individual viewer, including fullscreen. Ignore modified keys, typing/editable controls, open dialogs, and hidden divisions. Clamp navigation to available moves and retain latest-follow mode when Right is pressed at the end.
- Highlight only the last move's source square and draw a translucent arrow to its destination, consistently in previews, fullscreen, and detail. Rotate the arrow with board orientation and omit it for initial positions.
- Follow new moves when viewing the latest position; preserve the selected historical move during refreshes.
- Allow copying the selected game's PGN and opening its Lichess game link. Handle clipboard failures visibly.
- Treat PGN comments as text. Support initial FEN positions; report unsupported variants or malformed games instead of displaying an invented position.

## Validation

Test multi-game parsing, round separation, clock comments, FEN starts, special moves, malformed/empty data, and feed failures. Run TypeScript checks and a production static-export build. Inspect the viewer with the supplied real PGN where browser tooling is available. Confirm navigation remains hidden and no literal token is committed.
