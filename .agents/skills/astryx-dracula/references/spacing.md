# Spacing and density

Canonical values with provenance. Researched 2026-09-09 against Material (M1/M2/M3), Carbon, GOV.UK, Apple HIG, Ant Design, and WCAG 2.2 — 32 primary sources, full report in `docs/research/spacing-density/REPORT.md`.

## Tokens

| Token | Value | Standing |
|---|---|---|
| `--space-gap` | 24px | Carbon `$spacing-06`, Material 24dp gutters |
| `--space-viewport` | 16px | Carbon grid padding, M3 lists, Material cards |
| `--widget-content-vertical` | 15px | GOV.UK half-gutter, summary-card padding |
| `--widget-content-horizontal` | 16px | 4px half-step; 17 had no defender |
| `--widget-gap` | 24px | same as gap |
| `--tile-row` | 96px | Carbon `$spacing-12`, 2x Material data row |
| `--border-radius` / `--radius-element` | 5px | GOV.UK base unit; radii are per-component, never grid multiples |

Rule of thumb: layout multiples of 8, small elements on the 4px half-step. A value off by 1px from a canonical step (23 vs 24) breaks the invariant for zero visual gain.

## Card insets

Outer content cards `padding={4}`, nested inset cards `padding={3}`. Mixed insets side by side are a defect. Nested insets use the `insetCard` style (background surface plus separator border); see scaffolds.md.

## Type floors

Body and code 14, supporting 12, nothing meaningful below 12. Supporting is metadata only (timestamps, hints, captions). Section subtitles and anything the page needs are `body`. Full doctrine in SKILL.md.

## Touch targets

Two-tier rule. WCAG 2.2 AA floors pointer targets at 24x24 CSS px. Where touch matters, build to 44 (Apple HIG, GOV.UK checkbox input). Anything interactive packed into sub-24px rows fails AA. Keep the `sm` Button variant to dense contexts with a caption; CTAs stay default size.

## Table density

Comfortable rows sit 36–44px. `density="balanced"` for feature tables, `"compact"` for dense ones, tabular numerals on every quantity. Never shrink text to fit columns: prioritize columns, truncate with tooltips, or let the table scroll inside its own container.
