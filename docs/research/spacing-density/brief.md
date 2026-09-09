# Brief: spacing/sizing/density for dense dark dashboards

**Date:** 2026-09-09. **Depth:** standard (3 workers, 1 follow-up max, 15+ sources).
**Question:** What do established design systems prescribe for spacing, sizing, density in information-dense dashboards?
**Decision:** Grounds spacing guide + keep-vs-change verdicts on our tokens. Parent aggregates into skill files.
**Answer form:** Per-system numbers table + keep/change verdict list per token.
**Scope in:** Base spacing unit, card padding scales, gap scales, min touch targets, table row heights, form field heights. Non-goals: color theory, brand voice, code syntax.
**Assumptions:** Primary sources only (official docs/specs/source). Secondary marked. Numbers carry URLs. No repo edits.
**Our tokens (compare target):** gap 23px, viewport 15px, content 15/17px, widget-gap 23px, tile-row 96px, radius 5px, Card outer 4 / nested 3, type base 14.

## Angles
1. F1 — 8pt grid canon + Material Design 3 (spacing scale, card padding, gaps, touch, data-table rows, text-field heights).
2. F2 — Carbon Design System + GOV.UK Design System (spacing scale, card/tile padding, gaps, touch, table rows, input heights).
3. F3 — Apple HIG + WCAG target-size + dense-table/form practitioner norms (min touch targets, row heights, field heights, density guidance).
