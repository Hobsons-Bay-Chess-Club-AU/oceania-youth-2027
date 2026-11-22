# Broadcast Streaming Implementation Plan

**Goal:** Implement the approved snapshot-plus-stream approach, replacing regular interval polling for the active division.

**Architecture:** Fetch the full tournament PGN once on activation or manual refresh, then consume the tournament PGN stream through browser fetch. Decode complete game messages across arbitrary network chunks and merge updates by game ID, retaining historical games and clock anchors. Close inactive streams and reconnect with exponential backoff and Retry-After handling.

**Files:** `lib/lichess-broadcast.ts` owns stream framing, transport, merge helpers and retry policy; `components/pages/dgt-boards-page.tsx` owns lifecycle and connection status; `tests/broadcast-stream.test.mjs` verifies streaming and lifecycle; `docs/broadcasts.md` documents behavior.

**Constraints:** Keep GitHub Pages compatibility, public token configuration, existing clock/replay/fullscreen features and staged user changes. Do not commit or stage. No routine polling while connected; manual refresh and reconnect remain available. Stream disconnects keep the last received boards. Reconnect streams without repeatedly fetching the full snapshot after a successful load.

- [x] Write failing tests for framing, partial UTF-8/chunks, complete updates before EOF, historical-game merge, clock anchors, HTTP errors, abort and reconnect policy.
- [x] Implement transport and merge helpers, then pass targeted tests.
- [x] Replace the polling lifecycle with initial snapshot followed by one active stream, reconnect backoff, cancellation and connection status.
- [x] Update documentation; run full tests, typecheck, isolated production build and public-stream smoke check.
- [x] Request a focused independent review and resolve important findings.

Verification: 71 tests and TypeScript pass. The implemented client received 24 real PGN games with no parse errors in a ten-second public-stream check and cancelled cleanly. Independent review findings about new-game board numbering and stable-session backoff were fixed and regression-tested. Final isolated production build passed, exporting 261 static pages after the merge correction. No browser interaction test was performed.
