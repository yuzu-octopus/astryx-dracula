# Spacing, sizing & density for dense dark dashboards

**Answer:** Change three tokens to grid-canonical values (gap 23→24, widget-gap 23→24, viewport 15→16, content 17→16) and keep the rest: 15px content padding is GOV.UK-canonical, tile-row 96 sits on Carbon's scale, Card 4/3 (=16/12px) sits on every 4px half-step, radius 5 matches GOV.UK's 5px base, and type base 14 matches Ant Design table type. No surveyed system mandates a denser canonical value that contradicts a kept token.
**Confidence:** high on gap/viewport/row verdicts (2+ independent primaries each); medium on radius/type-14 (single authoritative primary each).

## Why

The 8pt canon is the common root: multiples of 8 for layout, 4pt half-step for small elements and type baselines [1][primary][2][primary], adopted verbatim by Material (8dp grid, 4dp in-component) [3][primary] and Carbon (8px mini-unit, scale 2,4,8,12,16,24,32,40,48,64,80,96,160) [14][primary]. Any token that is not a multiple of 4 fights all three at once. 23 appears in none of them; 24 appears in all of them (Carbon `$spacing-06` [14], Material card gutters and inter-component padding [4][6], M3 trailing padding [11]). So gap 23 and widget-gap 23 change to 24.

Viewport/content chrome converges on 16: Carbon grid padding is 16 at every breakpoint [15][primary], M3 list side padding is 16 [11][primary], Material card text padding is 16 [5][primary], Carbon tile padding is 16 [16][primary]. Viewport 15 has exactly one defender — GOV.UK's 15px half-gutter [23][primary] — against four 16s. Change viewport 15→16. Content 15 keeps its GOV.UK anchor (half-gutter [23], summary-card padding 15 [25], both primary), so 15 stays; but 17 is defended by nothing and breaks the 4px half-step, so 17→16.

Tile-row 96 is directly on Carbon's scale (`$spacing-12` = 96) [14][primary] and equals 2× the Material data-row height (48) [10][primary] — keep, high confidence. Card outer 4 / nested 3 read as 16/12px on a 4px-step scale: both values sit on Carbon's scale (16, 12) [14], inside Material's 4dp-increment rule [4], and match M3's own 16/12 side paddings [11] — keep, high confidence. Radius 5 is not governed by any spacing grid in the surveyed primaries (radii are consistently specified per-component, never as grid multiples), and 5 is GOV.UK's base unit [21][primary] — keep, medium confidence. Type base 14 matches Ant Design table type at all three densities (14px) [29][primary] and Material's own supporting-text size (14sp card supporting text [5][primary]) — keep, medium confidence.

Touch targets are the one density risk with no corresponding token: Material holds 48×48dp minimum with ≥8dp gaps across M1–M3 [9][10][primary], Apple requires 44pt hit areas (60 visionOS) [26][primary], Carbon's icon guidance is 44px+ [18][primary-legacy], GOV.UK checkboxes carry a 44px input [28][primary], and WCAG 2.2 AA floors pointer targets at 24×24 CSS px [31][primary]. Anything interactive packed into sub-24px rows fails AA unless a spacing/equivalent exception applies [31][primary].

## Verdicts (per token)

| Token | Verdict | Canonical replacement | Deciding source |
|---|---|---|---|
| gap 23px | CHANGE → 24 | 24 | Carbon `$spacing-06` [14]; Material 24dp card perimeter/gutters [5][6]; M3 trailing 24 [11] |
| widget-gap 23px | CHANGE → 24 | 24 | same as gap |
| viewport 15px | CHANGE → 16 | 16 | Carbon grid padding 16 all breakpoints [15]; M3 list side 16 [11]; Material card 16 [5]; Carbon tile 16 [16] |
| content 15px | KEEP | — | GOV.UK half-gutter 15 [23]; summary-card padding 15 [25] |
| content 17px | CHANGE → 16 | 16 | no primary defends 17; breaks 4px half-step [1][2][3] |
| tile-row 96px | KEEP | — | Carbon `$spacing-12` = 96 [14]; 2× Material data row 48 [10] |
| radius 5px | KEEP | — | GOV.UK 5px base unit [21]; no surveyed grid governs radii [single source + inference] |
| Card outer 4 / nested 3 (=16/12px) | KEEP both | — | Carbon scale 12, 16 [14]; Material 4dp increments [4]; M3 pads 16/12 [11] |
| type base 14 | KEEP | — | Ant table type 14 all densities [29]; Material card supporting text 14sp [5] |

Missing token (gap, not verdict): no minimum touch/click target. Recommend adopting 24px as the AA floor [31] with 44px where pointer/touch both matter (Apple 44pt [26], GOV.UK 44px checkbox [28]).

## Findings

### Base units and scales
8pt grid with 4pt half-step is the shared canon (Jackson [1], Dahl [2], Material M2 [3]). Carbon implements it as 8px mini-unit with a 13-step scale up to 160px [14][primary]; its tokens are not responsive — you switch steps at breakpoints instead [14]. GOV.UK is the outlier with a 5px base (static 0–60: 5,10,15,20,25,30,40,50,60; responsive shrink below 640px tablet breakpoint) [21][22][primary]. Apple publishes no universal spacing scale at all [27][primary, negative finding] — only situational numbers (12pt around bezelled, 24pt unbezelled elements [26]; widget margins 16, tight 11 [27]).

### Card / tile padding
Material M1: 16 text padding, top 16/24, bottom 16/24, actions 8 [5][primary]; gutters 8/16/24/40, mobile card gap 8 [6][primary]. Carbon tile: 16 all sides, min 64×128 [16][primary]. GOV.UK has no card; closest analogue summary-card pads 15 (20 horiz on tablet) [25][primary]. M3 defines no universal card inset — samples add 16dp in content [secondary synthesis]. Net: 12/15/16/20/24 all have primary anchors; 17 and 23 have none.

### Gaps and gutters
Carbon grid gutter totals 32, padding 16, margins 0/16/24 by breakpoint [15][primary]. GOV.UK gutter is 30 (15 half) [23][primary]. Material responsive margins ~16 mobile / ~24 tablet-desktop [7][primary]; M1 card-to-card 8 mobile [6]. Our 23 sits 1px off the 24 that Material, Carbon, and M3 all use — the cheapest fix in the list.

### Touch targets
48×48dp Material, stable M1→M3 with ≥8dp separation [9][10][primary]. 44pt Apple default, 60 visionOS [26][primary]; platform minima 28 iOS / 20 macOS / 56 tvOS / 28 watchOS [26][primary]. 44px Carbon icon guidance lives only on the v10 domain — primary-legacy, no current-site equivalent found [18]. 44px GOV.UK checkbox input (box 40, small-box 24 with input kept at 44) [28][primary]. WCAG AA floor 24×24 CSS px with five exceptions and a circle-spacing test [31][primary]; AAA 44×44 [32][primary]. Apple-44 aligns with AAA and is stricter than AA; the 24–27px band passes WCAG but fails Apple's minimum [speculative synthesis].

### Table rows
Carbon gives the only full official scale: 24/32/40/48/64 (xs–xl), toolbar 48/32 paired by density [19][primary]. Material M1 rows 48 (last 56, header-card 64, col gap ≥56) [10][primary]; M2 rows 52/header 56 is a version change, marked secondary (page JS-blocked, dual-extract corroborated) [13][secondary]. Ant compact tokens (block 16/12/8 → derived ~54/46/38px rows) [29][primary, totals derived]. GOV.UK rows are content-driven (cells 10v/20r), no fixed height [24][primary]. Atlassian and Salesforce publish no fixed compact row px — never cite practitioner-lore 32px as official [F3 gaps].

### Form fields
GOV.UK input 40 high, pad 5, border 2 [28][primary]; GOV.UK buttons padding-driven, no fixed height [28][primary]. Carbon inputs 32/40/48, label gap 8, helper gap 4, text inset 16 [17][primary]; Carbon buttons 24/32/40/48/64/80 [17][primary]. Material fields 56 default (24+10 fill / 17+17 outline / sides 16), dense 54/48 [30][primary, official source code]. Apple HIG gives no numeric field heights [27][primary, negative finding].

## What would change this
A primary source showing our 23/17 values as deliberate optical-compensation choices (e.g. measured 1px border/gap corrections documented in a design-system spec) would flip the CHANGE verdicts to KEEP-with-rationale. None was found — the numbers were evaluated as raw scale values.

## Considered and rejected
- Keep 23 as "close enough to 24": rejected — grids are exact-match systems; 1px off breaks the multiple-of-4 invariant every surveyed 8pt-derived system shares [1][2][3][14].
- Adopt GOV.UK 5px base instead of 8pt: rejected — GOV.UK's scale serves public-service readability (19px body, 40px inputs), not dense dashboards; only our 15 and radius-5 borrow from it.
- Tokenize table rows at 32: rejected — 32 is Carbon-sm [19] but practitioner "compact = 32" has no primary behind it for Atlassian/Salesforce; adopt Carbon's labeled scale instead if rows get tokenized.
- Touch target 48 (Material) as the single floor: rejected for web dashboards — 48dp is a mobile-touch canon; WCAG AA 24 [31] plus Apple 44 where touch matters [26] is the correct two-tier rule for desktop-dense UI.

## Open questions
- GOV.UK max page width: docs say 1020 [layout page] vs `$govuk-page-width: 960` in source — both primary, unresolved; irrelevant to our tokens, noted for provenance hygiene.
- Carbon current-site touch-target statement: only the v10 page found [18]; current-site equivalent may exist under a different URL.
- M2 data-table 52/56dp [13]: dual-extract corroborated but raw page never rendered (JS-blocked) — stays secondary.
- M3 56/72/88 list heights: widely repeated, unverified in fetched primary bodies — stays secondary.

## Sources

High weight [primary], read 2026-09-09:
1. spec.fm 8-pt-grid (Bryn Jackson) — https://spec.fm/specifics/8-pt-grid
2. designsystems.com space-grids-and-layouts (Dahl) — https://www.designsystems.com/space-grids-and-layouts/
3. M2 spacing-methods (8dp grid, 4dp increments, 48dp touch) — https://m2.material.io/design/layout/spacing-methods.html
4. M1 metrics-keylines (touch 48, avatar 40/icon 24 in 48) — https://m1.material.io/layout/metrics-keylines.html
5. M1 cards (16/24 pads, actions 8, 14sp supporting) — https://m1.material.io/components/cards.html
6. M1 cards gutter section + responsive-ui (margins ~16/24, breakpoints) — https://m1.material.io/layout/responsive-ui.html
7. M3 applying-layout (breakpoints <600/600–839/840–1199/1200–1599/1600+) — https://m3.material.io/foundations/layout/applying-layout
8. M3 lists specs (48dp targets, pads 16/24, icon top 8/12) — https://m3.material.io/components/lists/specs
9. M1 lists (rows 48, dense 40, avatar 56) — https://m1.material.io/components/lists.html
10. M1 data-tables (row 48, col gap ≥56, header-card 64) — https://m1.material.io/components/data-tables.html
11. material-components-android textfield styles.xml (56dp anatomy, dense pads) — https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/textfield/res/values/styles.xml
12. TextField.md (Dense styles exist) — https://github.com/material-components/material-components-android/blob/master/docs/components/TextField.md
14. Carbon spacing overview (8px unit, 13-step scale, Stack gaps) — https://carbondesignsystem.com/elements/spacing/overview/
15. Carbon 2x-grid (pad 16, gutter 32, margins 0/16/24) — https://carbondesignsystem.com/elements/2x-grid/overview/
16. Carbon tile style (pad 16, min 64×128) — https://carbondesignsystem.com/components/tile/style/
17. Carbon button + text-input style (buttons 24–80; inputs 32/40/48) — https://carbondesignsystem.com/components/button/style/ and https://carbondesignsystem.com/components/text-input/style/
19. Carbon data-table style (rows 24/32/40/48/64; toolbar 48/32) — https://carbondesignsystem.com/components/data-table/style/
21. GOV.UK spacing docs (5px base, responsive scale, 640px switch) — https://design-system.service.gov.uk/styles/spacing/
22. govuk-frontend `_spacing.scss` (static + responsive scales) — https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/settings/_spacing.scss
23. govuk-frontend `_measurements.scss` + `_grid.mixin.scss` (gutter 30, half 15) — https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/settings/_measurements.scss
24. govuk-frontend table `_mixin.scss` (cells 10v/20r, content-driven rows) — https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/table/_mixin.scss
25. govuk-frontend summary-list `_mixin.scss` (summary-card pads 15/20) — https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/summary-list/_mixin.scss
26. Apple HIG buttons + accessibility (44pt hit, 60 visionOS, platform minima, 12/24pt spacing) — https://developer.apple.com/design/human-interface-guidelines/buttons and https://developer.apple.com/design/human-interface-guidelines/accessibility
27. Apple HIG layout + widgets + lists-and-tables + text-fields (no universal scale/row/field numbers — negative findings) — https://developer.apple.com/design/human-interface-guidelines/layout
29. Ant Design table tokens (block 16/12/8, inline 16/8/8, type 14) — https://ant.design/components/table/
28. govuk-frontend input + button + checkboxes `_mixin.scss` (input 40; checkbox touch 44; button pad-driven) — https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/input/_mixin.scss
30. GOV.UK layout docs (max width 1020, conflicts source 960) — https://design-system.service.gov.uk/styles/layout/
31. WCAG 2.2 Understanding target-size-minimum (24×24 AA, exceptions, circle test) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum (+ normative https://www.w3.org/TR/WCAG22/#target-size-minimum)
32. WCAG 2.2 Understanding target-size-enhanced (44×44 AAA) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced

Lower weight:
13. [secondary] M2 data-tables (rows 52/header 56) — https://m2.material.io/design/components/data-tables.html — JS-blocked, dual-extract corroborated.
18. [primary-legacy] Carbon v10 icons usage (touch ≥44px, 22px icon in 48 target) — https://v10.carbondesignsystem.com/guidelines/icons/usage/ — official Carbon, superseded domain.
- [secondary] M2/M3 list heights 56/72/88 — origin unverified (M3 specs JS canvas) — cited where used, never decisive.
