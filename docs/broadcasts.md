# Broadcast configuration

The `/dgt-boards/` viewer reads Lichess tournament PGN feeds in the browser. It remains hidden from navigation during development.

Set these values in the local `.env` file:

```dotenv
NEXT_PUBLIC_LICHESS_TOURNAMENTS=wsHmdvmw,2sSeYjPm
NEXT_PUBLIC_LICHESS_TOKEN=
```

Use comma-separated eight-character tournament IDs, not full URLs. Whitespace and duplicate IDs are ignored. Each ID becomes `https://lichess.org/api/broadcast/{id}.pgn?clocks=true&comments=true`. Invalid IDs appear as a configuration message; an empty list shows no tournaments. The optional token is public browser configuration, as requested, and public feeds can be fetched without one.

Restart the development server after changing `.env`. Production values are embedded at build time, so rebuild and redeploy after changing them.

For the GitHub Pages workflow, set the repository Actions **secret** `NEXT_PUBLIC_LICHESS_TOURNAMENTS` to the list of IDs and, if needed, the **secret** `NEXT_PUBLIC_LICHESS_TOKEN`. The tournament list falls back to the same-named Actions variable if the secret is unset. The workflow injects these values into the environment of the Next.js build step; the token is still included in the browser bundle.

Each configured tournament is a division in the viewer. The division picker uses the broadcast's name once loaded. Round buttons appear on desktop and a round dropdown appears on narrow mobile screens. Each division remembers its selected round, board, and replay position while switching between divisions. Only the visible division refreshes its feed.

Rounds open to an overview of every board, showing the latest position, players, results, and recorded clocks. Select any board to open its detailed viewer with move replay. The All boards button returns to the overview and restores keyboard focus to the board preview. Changing rounds returns to the overview for that round.

The viewer follows the latest position until a historical move is selected. Clock readings are recorded PGN values, not continuously running clocks. Automatic refresh uses each game's PGN `Variant` tag: `Standard` refreshes every 60 seconds, `Rapid` every 15 seconds, and `Blitz` every 5 seconds (case-insensitive). Missing tags default to 60 seconds. A feed containing several speeds uses the fastest interval. The configured tag is used directly; a game tagged `Standard` refreshes every 60 seconds even if its time control is shorter. Browser caching is disabled for these fetches, but upstream delays can still apply. Transient failures retain the last successful games, and rate-limit responses delay subsequent requests. The Broadcast timing disclosure explains the update interval.

Chessnut SVG pieces are distributed under the Apache 2.0 license. Attribution and license are in `public/chess/NOTICE.md` and `public/chess/LICENSE`.

Run `npm test` with Node.js 22.6 or newer, `npm run typecheck`, and `npm run build` to validate changes.
