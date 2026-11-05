# Lichess Broadcast Implementation Plan

**Goal:** Replace the broadcast mock with tournament feeds configured through `NEXT_PUBLIC_LICHESS_TOURNAMENTS`.

**Architecture:** Browser-side PGN fetches retain the current static export. A small data module validates IDs and parses PGN with chess.js; the page selects tournaments, rounds, games, and replay positions.

**Tech Stack:** Next.js 15, React 19, TypeScript, chess.js, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-05-lichess-broadcast-design.md`

## Global constraints

- Preserve GitHub Pages static hosting and hidden navigation.
- Use optional `NEXT_PUBLIC_LICHESS_TOKEN` exactly as the user requested; never commit its value.
- Keep each configured tournament separate, including games from different rounds.

## Review focus

Malformed PGN must not prevent valid games from appearing; unsupported variants must not render incorrect boards; initial FEN positions and special moves must work; switching feeds must cancel obsolete requests; refresh failures must retain prior data.

## Tasks

- [x] Add failing Node tests for ID configuration, PGN parsing, clocks, initial FEN/special moves, invalid games, and HTTP failures.
- [x] Implement `lib/lichess-broadcast.ts`, replace `app/dgt-boards/data.ts`, add environment examples and CI build variables; run tests.
- [x] Replace `components/pages/dgt-boards-page.tsx` with the real feed viewer and scoped responsive CSS. Review selectors, replay, clipboard, and request cleanup.
- [x] Run tests, typecheck, static build, and attempt browser inspection. Review the final diff and retain changes in the current checkout for the user.

## Execution notes

Implementing directly in the user's current checkout. No branch, publication, or token changes are needed. The latest user instruction selects environment-based configuration in place of the original array.

Eight automated tests pass. Both configured feeds were fetched with the configured token: 19 and 29 games, zero skipped games. Independent review found and verified fixes for adjacent Lichess comments and square colors.

The approved UI refinement adds a unified division/round toolbar, responsive round controls, locally served SVG pieces, and retained selection for each division. Independent review verified fixes for the legacy two-column grid cascade and keyboard focus on division changes. Native Chrome checks confirmed keyboard division switching and round persistence, plus desktop and 320/375px visual layouts. The DOM automation API failed, and the user resumed using Chrome before 414/768px visual checks; temporary viewport overrides were reset. A development hydration warning was traced to Grammarly-added body attributes, outside the broadcast component.

The subsequent all-boards request changes the default round view to a responsive grid of current board positions. Clicking a preview opens the selected game; All boards returns to the grid and restores focus to that preview. Native Chrome verified three overview boards in the second tournament's Round 9, opening Board 2, and returning to the focused Board 2 preview. Review found no important issues. Typecheck and all eight tests passed. A production build sharing `.next` with the active dev server encountered an export-cache conflict; an isolated source copy in `/tmp/oceania-broadcast-verify-3hixfqzx` built and exported successfully. The development preview remained available and was used for the interaction checks.
