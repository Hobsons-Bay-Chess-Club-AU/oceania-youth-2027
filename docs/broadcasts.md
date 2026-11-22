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

The viewer follows the latest position until a historical move is selected. For unfinished games (`Result "*"`), the side to move counts down once per second in overview, detailed, and fullscreen views. These are estimates anchored when a position is first received: PGN has no latest-move timestamp, and broadcast delays still apply. Unchanged refreshes retain the anchor; new moves or corrected clock values resynchronize it. Terminal positions, missing clocks, and replay positions do not tick. Finished games show per-player scores in the clock area instead: green 1 for a win, red 0 for a loss, and neutral ½ for a draw (including while replaying that finished game). Select Latest to resume live clocks. Clocks use minutes:seconds below one hour and hours:minutes:seconds otherwise. Values below 20 displayed seconds turn red in live and replay views. Values stop at zero without declaring a result; only the feed determines the result. After the initial full tournament PGN load, the active division opens one persistent browser `fetch` connection to `https://lichess.org/api/stream/broadcast/tour/{id}.pgn?clocks=true&comments=true`. The stream initially includes ongoing/recent rounds, then sends a full game PGN when it changes; messages merge by GameURL, keeping older rounds from the initial snapshot. Updates render as soon as a complete game arrives, without waiting for stream closure or fetching it again. Only the selected division has an active network connection; switching divisions and leaving the page abort pending requests and reconnect timers. Replay, selection, fullscreen and unchanged clock anchors survive updates.

There is no regular polling or Variant-based refresh timer in the viewer. Interrupted streams reconnect after 5, 10, 20, 40, then at most 60 seconds; HTTP errors honor `Retry-After` (at least one minute by default). Reconnection reopens the stream without downloading another full snapshot after a successful initial load. Initial snapshot failures are retried with backoff. Connection establishment times out after 25 seconds; idle streams reconnect after 90 seconds without even a keepalive newline. The last received games remain visible during failures, with connection status and error details. **Refresh** reloads the full snapshot and reopens the stream; it is disabled while connecting/reconnecting to respect backoff. Clock estimates still tick locally while disconnected. Browser caching is disabled, but source/broadcast delays can still apply.

Public streams work without a token. If a token is configured and Lichess rejects it, verify that it has `study:read` permission. Stream requests are HTTP streaming PGN, not WebSockets or EventSource. The static GitHub Pages deployment needs no server. Reference: [Lichess tournament stream specification](https://github.com/lichess-org/api/blob/master/doc/specs/tags/broadcasts/api-stream-broadcast-tour-broadcastTourId-pgn.yaml).

Use **Piece style** to open Board settings from the overview, individual viewer, or fullscreen header. The selection applies immediately to all boards and player icons. It is saved under `oy27-broadcast-piece-set` in local storage and synchronizes between tabs. Oceania Youth 2027 is the default for viewers without a saved preference; existing choices are preserved; unavailable storage still allows changes for the current visit.

The official Oceania set is featured above a two-column grid of four alternatives. Five existing styles are retained:

- **Chessnut**: the original SVG set, Apache 2.0. Attribution and license are in `public/chess/NOTICE.md` and `public/chess/LICENSE`.
- **Staunton 3D**: traditional ivory and ebony pieces by James Clarke, MIT, sourced from [Staunton Pieces](https://github.com/clarkerubber/Staunton-Pieces) through Lichess.
- **Celtic**: decorative traditional SVG pieces by Maurizio Monge, MIT, sourced from [chess-art](https://github.com/maurimo/chess-art) through Lichess.
- **Spatial**: sculpted SVG pieces by Maurizio Monge, MIT, sourced from [chess-art](https://github.com/maurimo/chess-art) through Lichess.
- **Oceania Youth 2027**: original SVG artwork with recognizable chess silhouettes, ocean waves, ivory, teal and gold, plus the thirteen federation flags on a shared base. Regenerate with `python3 scripts/generate-oceania-pieces.py`. Federation flag sources follow `public/pacific/README.md`.

Downloaded sets include their licenses and source notices in their respective `public/chess/` folders. [Preview the custom set](assets/oceania-piece-set-preview.png).

Run `npm test` with Node.js 22.6 or newer, `npm run typecheck`, and `npm run build` to validate changes.

## Federation collection and Adaptive mode

The thirteen federations currently represented on the site each have an original set of twelve SVG pieces, with flag inlays and distinct regional motifs. Search Board settings by country name, ISO code, or FIDE code to choose a federation set for both sides. Selecting **Adaptive · Follow each player** assigns a federation set separately to White and Black; a move, capture, promotion or board flip retains the correct color's set. The official Oceania Youth 2027 set remains the default.

Adaptive mode prefers explicit PGN `WhiteFederation`/`BlackFederation`, `WhiteFed`/`BlackFed` or `WhiteCountry`/`BlackCountry` tags. Missing PGN federation data is first filled from the cached Lichess tournament roster (see Tournament player information below). Otherwise it matches validated `WhiteFideId`/`BlackFideId` aliases to a compact lookup built from `public/players.json`. Only ID and federation pairs reach the broadcast page. Contradictory country tags or duplicate FIDE IDs with conflicting federations use the official fallback; unsupported or missing federations also use the fallback. Country data is taken from the roster or directory, never inferred from a player’s name. Refresh the player directory and rebuild to update the lookup. Players absent from both the roster and directory need explicit PGN federation tags for adaptive sets.

Manual and adaptive choices use the existing local-storage preference and synchronize between tabs. Existing saved choices are preserved. Artwork is generated with `python3 scripts/generate-federation-pieces.py`; country flags follow the existing `public/pacific/README.md` attribution. [View all 156 pieces](assets/federation-piece-sets-preview.png).


### Move sounds

**Sound on/off** is available beside Piece style in the overview and individual toolbar, including fullscreen. The preference defaults to on and is saved as `oy27-broadcast-sound` in local storage, with cross-tab synchronization; unavailable storage still allows toggling for this visit. Browsers require a click or key press to activate audio. Audio is synthesized locally without sound downloads or external services.

Ordinary moves use a short click-like tone, captures a lower double tone, check a rising two-tone cue, and checkmate a three-note cue. Checkmate takes priority over check, which takes priority over capture. Near-simultaneous updates are coalesced so sounds do not accumulate. All boards plays notifications for appended moves in the visible round; the individual viewer plays only its own game's live moves while following Latest. Initial loads, full snapshot refreshes, new-board discovery, unchanged positions, corrections/takebacks, inactive divisions and hidden browser tabs stay silent. Live updates remain silent while replaying earlier positions. Replay through Left/Right keys, previous/next/starting/latest buttons, or clicking notation uses the same cues for the destination move; unchanged boundaries and board flips are silent. Muting immediately stops active and queued sounds.


### Tournament player information

The Lichess roster endpoint `https://lichess.org/broadcast/{id}/players` provides `fed`, names, FIDE IDs, titles and ratings, but currently omits browser CORS headers. During Next.js build, a force-static GET route loads it once per configured tournament (the upstream Next fetch is cached for up to 24 hours between builds) and exports `/broadcast-players/{id}.json` alongside the site. No proxy or extra workflow step is needed. **Roster changes appear on rebuild/redeploy after the upstream cache expires; a clean build fetches fresh data.** Development requests use the same Next route.

For the active division, when PGN games lack federation tags, the browser lazily loads the same-origin roster file. Successful data is cached in memory and local storage (`oy27-broadcast-players-v1-{id}`) for 24 hours. Concurrent requests share one fetch. Empty/unavailable rosters are cached for 10 minutes (longer if Retry-After requires it); stale data remains available after a failed load. There is no player-data interval. Move updates, replay, clocks, settings and board selection do not repeatedly load the roster. Division activation and **Refresh** check the cache and only reload expired entries. A short roster request already underway may finish into the shared cache after switching divisions; inactive UI is not updated. An unavailable build export is marked separately from an empty roster so a cached roster can survive temporary upstream failures.

Players match by a unique valid FIDE ID across PGN aliases, or by an unambiguous normalized name when PGN has no valid ID. Conflicting IDs or duplicate names never guess a match. Explicit PGN federation/title/rating data takes priority; roster information fills missing fields, with the existing player-directory federation lookup remaining a fallback. The enriched headers are shared by every board, player name, pairing list and adaptive piece resolver. Federation flags appear before player names as circular badges with a white or black border and a small matching side marker inside the flag. Separate side dots are removed. Missing/failed flags retain a neutral pawn badge to identify the side. The 13 Oceania flags are local assets; visiting federations use Lichess federation flag assets and keep the official piece set when no custom federation set exists. Unknown/unavailable flag images fall back to the neutral pawn badge.

Reference: [Lichess broadcast player API](https://github.com/lichess-org/api/blob/master/doc/specs/tags/broadcasts/broadcast-broadcastTournamentId-players.yaml).
