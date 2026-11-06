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

Each configured tournament is a division in the viewer. During the static build, metadata for all configured tournaments is fetched to embed their names in the initial page, including divisions that have not been selected. Requests time out after ten seconds; unavailable or unnamed tournaments retain the numbered fallback and can update when opened. Rebuild to refresh these initial labels. The division picker uses the broadcast's name once loaded. Round buttons appear on desktop and a round dropdown appears on narrow mobile screens. Each division remembers its selected round, board, and replay position while switching between divisions. Only the visible division refreshes its feed.

Rounds open to an overview of every board, showing the latest position, players, results, and recorded clocks. Select any board to open its detailed viewer with move replay. The All boards button returns to the overview and restores keyboard focus to the board preview. Changing rounds returns to the overview for that round.

The last move highlights only its starting square and draws an arrow to the destination. The indicator scales with each board and follows its orientation during replay or when flipped.

In the individual-board viewer, **Left arrow** replays the previous move and **Right arrow** advances to the next move, in both normal and fullscreen views. Shortcuts do not affect text fields, dropdowns, open dialogs, or hidden divisions. Use **Latest** to resume following incoming moves.

Select **Fullscreen** in All boards for a board wall showing only the tournament name, round selector, exit control, and compact board previews. The grid adapts to the screen dimensions and board count, fitting all games where readable and scrolling when needed. Opening a board keeps its detailed viewer in fullscreen; **All boards** returns to the fullscreen grid. Changing rounds updates the same fullscreen view. **Exit** or **Escape** restores the current overview or individual board to the normal page. Individual boards also have a Fullscreen button. Browsers without native fullscreen use a page-filling view instead.

The viewer follows the latest position until a historical move is selected. Clock readings are recorded PGN values, not continuously running clocks. Automatic refresh uses each game's PGN `Variant` tag: `Standard` refreshes every 60 seconds, `Rapid` every 15 seconds, and `Blitz` every 5 seconds (case-insensitive). Missing tags default to 60 seconds. A feed containing several speeds uses the fastest interval. The configured tag is used directly; a game tagged `Standard` refreshes every 60 seconds even if its time control is shorter. Browser caching is disabled for these fetches, but upstream delays can still apply. Transient failures retain the last successful games, and rate-limit responses delay subsequent requests. The Broadcast timing disclosure explains the update interval.

Use **Piece style** to open Board settings from the overview, individual viewer, or fullscreen header. The selection applies immediately to all boards and player icons. It is saved under `oy27-broadcast-piece-set` in local storage and synchronizes between tabs. Oceania Youth 2027 is the default for viewers without a saved preference; existing choices are preserved; unavailable storage still allows changes for the current visit.

The official Oceania set is featured above a two-column grid of four alternatives. Five sets are included:

- **Chessnut**: the original SVG set, Apache 2.0. Attribution and license are in `public/chess/NOTICE.md` and `public/chess/LICENSE`.
- **Staunton 3D**: traditional ivory and ebony pieces by James Clarke, MIT, sourced from [Staunton Pieces](https://github.com/clarkerubber/Staunton-Pieces) through Lichess.
- **Celtic**: decorative traditional SVG pieces by Maurizio Monge, MIT, sourced from [chess-art](https://github.com/maurimo/chess-art) through Lichess.
- **Spatial**: sculpted SVG pieces by Maurizio Monge, MIT, sourced from [chess-art](https://github.com/maurimo/chess-art) through Lichess.
- **Oceania Youth 2027**: original SVG artwork with recognizable chess silhouettes, ocean waves, ivory, teal and gold, plus the thirteen federation flags on a shared base. Regenerate with `python3 scripts/generate-oceania-pieces.py`. Federation flag sources follow `public/pacific/README.md`.

Downloaded sets include their licenses and source notices in their respective `public/chess/` folders. [Preview the custom set](assets/oceania-piece-set-preview.png).

Run `npm test` with Node.js 22.6 or newer, `npm run typecheck`, and `npm run build` to validate changes.
