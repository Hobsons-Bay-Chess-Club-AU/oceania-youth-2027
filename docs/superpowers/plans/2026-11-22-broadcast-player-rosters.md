# Broadcast Player Rosters Implementation Plan

**Goal:** Resolve player federation flags and adaptive piece sets using each tournament's public Lichess player roster, without polling player data.

**Architecture:** A static GET route exports `/broadcast-players/{id}.json` from Lichess player data during build, with upstream cache TTL24h. A browser roster cache loads this local JSON only for an active division whose PGN lacks federation information. Deduplicate concurrent requests; reuse successful rosters in memory and local storage for 24 hours. Cache empty/failing responses for 10 minutes, honoring longer rate-limit delays and retaining stale data on failure. Enrich displayed PGN headers by unique FIDE ID, or unique normalized name when no valid FIDE ID exists. Explicit PGN federation tags retain priority, then roster data, then existing directory fallback. Both flag rendering and adaptive pieces consume the enriched headers.

**Constraints:** No new dependencies, no server required, no roster interval timer or per-move refetch. Keep all existing staged work. Visiting federations may use Lichess flag assets; custom pieces remain limited to the 13 represented federations. Missing or ambiguous identities never guess a federation. Do not commit/stage.

- [x] Add failing tests for roster parsing/enrichment, ambiguous identities, cache deduplication/expiry/storage/failures and federation flags.
- [x] Implement cache, header enrichment and lazy active-division loading.
- [x] Render federation flags before names, including visiting federations, and confirm shared adaptive resolution.
- [x] Document caching/fallback behavior; run tests, TypeScript, actual roster smoke check and isolated production build.
- [x] Obtain independent review and resolve important findings.


Ruling: The roster endpoint was verified to return JSON without `Access-Control-Allow-Origin`; its API-prefixed counterpart returns404. Generate same-origin `/broadcast-players/{id}.json` using a force-static GET route and `generateStaticParams` for configured tournament IDs. This fetches upstream once per tournament during Next build (and serves through Next in development), without custom workflow steps. Browser cache/lazy loading stays as planned; roster changes require rebuilding. Failed export emits an unavailable marker so browser cache can retain stale data. Add manual Refresh as a cache-check trigger; it does not bypass cache TTL. Validate all FIDE-ID aliases before choosing a unique valid identity.

Ruling: Next static export rejects no-store fetches inside this GET route (observed NEXT_STATIC_GEN_BAILOUT). Use force-cache with next.revalidate=86400 for the upstream request; do not use no-store. Static hosting requires a rebuild after that upstream cache expires, or a clean build for immediate refresh. Browser cache and unchanged live stream remain independent.

Verification: 90 tests and TypeScript pass. Independent review findings about ID aliases and manual refresh were fixed and regression-tested, including the directory fallback. Final isolated build with configured 7RDzDzcy exported 262 static pages/files; out/broadcast-players/7RDzDzcy.json contains all 49 normalized public roster players and five federation codes. The exact visiting flag URL was verified HTTP200. Live endpoint CORS absence and API-prefixed404 were verified, and static fetch policy was corrected after reproducing the no-store bailout. No browser visual interaction test performed.
