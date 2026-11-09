# Multilingual Site Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for the core implementation. Independent language dictionaries can be prepared in parallel. Steps use checkbox syntax for tracking.

**Goal:** Export language-specific site pages for the fifteen target catalogues, with explicit draft/review status and reliable English fallback.

**Architecture:** Share existing React pages through locale providers. Translate rendered text/known human-readable props through a React rendering boundary, preserving data identifiers and state logic; do not mutate the DOM. Keep existing English routes and add static locale-prefixed routes with correct document language, links and metadata. Store draft dictionaries separately and provide a review export.

**Tech Stack:** Existing Next.js 15 static export, React 19, TypeScript, JSON dictionaries, Node tests.

**Spec:** docs/superpowers/specs/2026-11-07-multilingual-site-design.md

## Global Constraints

- Current English URLs remain valid; no runtime server or translation API.
- All non-English translations are visibly labelled drafts; unavailable text remains English with language annotation.
- Preserve player names, tournament names, chess moves, ratings, URLs, FIDE IDs and official document sources.
- Fifteen target languages; catalogue and coverage status must never imply untranslated content is complete.
- Language preference does not change piece preference or infer language from federation identity.

## Review Focus

- A locale prefix must not break links, selected navigation or return-to-English behavior.
- Translated children must not alter underlying filter/search identifiers.
- Fallback annotations must not introduce invalid children in option, SVG text or table elements.
- Draft/partial translations need visible notices and exportable review material.
- Static export must contain real translated text and correct html language without waiting for JavaScript.

### Task 1: Locale model, dictionaries and review tools

Files: lib/i18n.ts, locales/*.json, tests/i18n.test.mjs, scripts/export-translations.mjs.
- [x] Test locale validation, saved/browser matching, path generation, dictionary lookup and fallback.
- [x] Implement language metadata, source-string dictionaries, safe formatting and review exports.
- [x] Prepare independent draft dictionaries; leave low-confidence text in English rather than invent translations.
- [x] Run targeted tests.

### Task 2: Shared rendering and language controls

Files: components/i18n-provider.tsx, components/language-switcher.tsx/.module.css, shared components and page components.
- [x] Implement React translation boundary for text and human-readable attributes only; protect identifiers and explicitly excluded content.
- [x] Preserve English source values for state/filter logic, translate only rendered values.
- [x] Add a keyboard-accessible language switcher and visible draft/fallback notices.
- [x] Integrate page components, shell and localized links.

### Task 3: Static routes and metadata

Files: app route-group layouts, localized catch-all page and shared document/page registry.
- [x] Preserve existing English pages under an English root layout.
- [x] Generate translated page/locale/news combinations and localized metadata.
- [x] Supply build-time broadcast names and compact federation lookup as before.
- [x] Ensure original English PDF downloads are labelled as English.

### Task 4: Verification and documentation

- [x] Run tests, typecheck and isolated static export.
- [x] Inspect representative exported French and Pacific-language pages and all locale root documents.
- [x] Request independent review; fix important findings.
- [x] Record translation coverage honestly and link review files.

Do not stage or commit without the user's request.

## Verification record

- 46 tests pass, including two regression tests for accessible English fallback attributes and translated descendants.
- TypeScript passes in the isolated production checkout (avoiding stale dev-generated route types).
- Static production export passes: 258 pages, including 238 localized paths.
- Inspected all fourteen localized schedule documents for language, canonical URL, localized links, draft status and review downloads; inspected French draft counts and Nauruan English accessibility labels.
- Independent reviewer identified shared localized metadata inheritance and fallback-accessibility gaps; both were fixed and verified. No deferred code findings.
- Browser preview connection failed, so interactive browser verification could not be completed. No claim of native-language certification is made.
- Content limitation: Nauruan remains an English review template; five other lower-resource languages plus Hiri Motu have sparse glossaries. This is explicitly displayed rather than represented as complete translation coverage.
- No files staged or committed.
