# Broadcast Sounds Implementation Plan

**Goal:** Play move/capture/check/checkmate sounds in live overview and detailed viewers and during keyboard/button/notation replay, with a persistent mute toggle in normal and fullscreen toolbars.

**Architecture:** Pure helpers classify SAN and detect appended moves (checkmate > check > capture > move). One client provider owns original Web Audio tone presets, gesture activation, local-storage preference and mute cleanup. Live sound hooks suppress initial/snapshot/unchanged/correction/hidden updates. Explicit replay handlers share the same sound player.

**Constraints:** Preserve staged user work; no staging or commits. No downloaded/licensed sound assets or new dependencies. Default enabled, with actual audio unlocked only by user gesture; storage key `oy27-broadcast-sound`. Muting silences active tones. Snapshot refreshes and opening/switching boards do not trigger sounds. In detail replay mode, live updates remain silent. Highest-priority simultaneous event wins and sounds do not accumulate.

- [x] Write failing tests for SAN classification, live append detection, snapshot/unchanged/correction suppression, replay targets and preference parsing.
- [x] Implement pure helpers and shared sound player/provider; pass targeted tests.
- [x] Add toolbar toggle and live hooks, and route keyboard/button/notation replay through shared handlers.
- [x] Document behavior and run tests, TypeScript, CSS checks and an isolated static production build.
- [x] Obtain focused independent review and fix important issues.

Verification: all 78 tests and TypeScript pass, including seven sound tests for classification, appended-move detection, replay, preferences, gesture gating, cancellation and event priority. Broadcast CSS parses successfully. Independent review found no important issues. Final isolated production build passed, exporting 261 static pages including the narrow-screen header wrap adjustment. Browser audio has not been listened to or interactively tested.
