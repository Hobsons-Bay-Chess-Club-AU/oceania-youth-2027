# V2 verification

## Content

14 routes checked. 382 original heading/paragraph/list/label blocks checked against the rebuilt HTML; none missing. Original main-page link destinations retained. Single main landmark per page, no duplicate IDs, and all HTML-referenced scripts, styles, icons and images present. See verification-content.json.

The homepage animation's zero-frame counters use the target values copied from the original client source (13/14/25/7). The player loading skeleton is replaced by the existing public JSON data snapshot. These are runtime-data render states, not invented tournament content. The existing banner and tournament PDFs remain unchanged. Existing contradictions in dates and other text were not corrected.

## Responsive visual review

All 14 routes inspected for horizontal overflow in the phone review frame (390px outer frame / 375px content viewport after its scrollbar): no overflow after the regulations email wrap fix. Desktop review uses a 1440px frame. Homepage, schedule and registration compositions were visually inspected; registration was checked in dark mode. This is browser preview testing, not a full physical-device or accessibility audit.

## Interactions

Theme preference and theme change demonstrated. Fee calculator default $260 AUD, then official-player selection $130 AUD verified using the original displayed fee values. Search/filter and directory helpers are local prototype interactions. Forms perform native validation only and do not transmit. No payment, subscription, registration, email or live-board backend has been recreated or tested.

## Contrast

All tested semantic text pairs exceed 4.5:1 in light and dark modes. See verification-contrast.json. The saturated coral in the illustration is artwork rather than a body-text colour. Full WCAG conformance is not asserted.

## Packaging

HTML/JS/CSS reference requires no npm dependencies or build. The Mac launcher supports existing Node.js or Python 3, opens the browser and chooses a free local port. Font licences and asset provenance are included. No production site was changed.
