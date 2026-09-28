# Brief — reference design systems for 8 specific audit gaps

Date: 2026-09-28 · Depth: deep · Repo: /Users/yuzu/Documents/Projects/astryx-dracula

## Question

For 8 concrete defects our audit found in the astryx-dracula kit, what does the
authoritative literature/design system say the correct treatment is, and what is
the single value the kit should adopt?

## Decision

Not "what looks nice". For each gap: freeze one value + one rule in the kit so
the implement phase is mechanical, and every future page inherits it. Taste is
already settled by the brand skill; research supplies the *authority* to override
taste where our practice contradicts published guidance.

## Answer form

Per gap: `rule` (one sentence, normative) + `citation` (primary source URL) +
`one value to adopt` (concrete, naming an existing kit token where one exists).

## Scope

**In:** WCAG 2.1/2.2 normative text (W3C), W3C WCAG Understanding docs,
Material Design 3, Apple HIG (44pt), Carbon (IBM), GOV.UK Design System,
Radix / Fluent / Polaris / Shopify Polaris design systems, GOV.UK accessible
typography, Nielsen Norman / Baymard for line length, ANSI/NIST-adjacent
chart-colour research (IBM Color Blind Safe palette, Wong 2011, Crameri
perceptually uniform palettes), Bartoshuk/Monotype line-length research,
`prefers-reduced-motion` MDN + WCAG 2.3.3, and well-known type-scale
references (Material 3 type scale, Practical Typography / Butterick,
Material's density guidance).

**Out:** Dracula-specific colour derivation (sibling agents own that), token
architecture mechanics (design-system skill owns that), implementation edits.

## Assumptions (written, not blocking)

- Main's adjudication: `--font-weight-medium` (500) and `--font-weight-bold`
  (700) STAY in the mirror (core consumes them). The rule is a DISCIPLINE rule:
  templates must not opt into `weight="medium"` / `weight="bold"` because no
  such face ships. No worker may recommend deleting those tokens.
  either name an EXISTING kit token or explicitly flag "needs human approval for
  a NEW value".
- Precedence (binding, from Main): visual common sense on dark > our skill
  doctrines > dracula-ui > spec letter.
- Main's adjudication A–D applies: `--font-weight-medium` (500) and
  `--font-weight-bold` (700) are being deleted; no `weight="medium"`/
  `weight="bold"` recommendations may appear.
- File-ownership split from Main is irrelevant to this slice (research only).

## Verified local facts (scoped by DesignSystemPatterns, 2026-09-28)

- Hero h1 renders at three sizes. `--font-size-2xl: 1.5rem` = 24px →
  `--text-heading-1-size`. `--font-size-4xl: 2.1875rem` = 35px. `--font-size-5xl:
  2.625rem` = 42px. `Heading level={1}` with no `type` = 24px
  (templates/dashboard.tsx, side-gallery.tsx, dashboard-portfolio.tsx);
  `type="display-2"` = 35px (centered-hero, gallery-hero, product-detail,
  product-gallery, payment-form, settings, contact-form, theme-showcase,
  ai-chat-landing, chaptered-doc, tech-report, product-tour, demo/App,
  demo/Bento); `type="display-1"` = 42px (documentation.tsx:238,
  form-two-column.tsx:105).
- Prose measures: `shared/chaptered-doc.tsx` drives documentation,
  documentation-design, documentation-technical, product-tour, tech-report.
  No `ch`-based measure anywhere; widths are px.
- Base font 14px, JetBrains Mono, single family.
- Spacing primitives: `--space-gap` 24px, `--space-viewport` 16px,
  `--widget-gap` 24px, `--widget-content-vertical` 15px,
  `--widget-content-horizontal` 16px, `--tile-row` 96px.
- Chart colours: `shared/chart-hues` CHART_HUES of 5, CHART_SERIES of 4.
- Dark surfaces: body `#282A36`, surface/chrome `#343746`, popover `#424450`,
  muted/selection `#44475A`, shadow `#21222C`.

## Angles

1. **Hero type scale** — display h1 treatment for marketing pages; what a
   modular scale implies; how many display tiers a kit should ship.
2. **Prose column / line length** — the actual readability evidence for
   characters-per-line, whether monospace changes it, the cpl↔font-size
   relation, and `ch`-unit vs px measure.
3. **Spacing scale discipline** — 16/24/32/40 for one job; what a spacing
   scale primitive is; role-based vs numeric spacing.
4. **Status not by colour alone** — WCAG 1.4.1 normative text + Understanding
   guidance; accepted redundant patterns; greyscale survival.
5. **Chart legend + categorical series colour** — max distinct hues,
   lightness separation, greyscale-safe ordering; 1.4.1 applied to charts;
   IBM color-blind-safe / Wong / Crameri.
6. **Reduced motion** — `prefers-reduced-motion` normative pattern; WCAG
   2.3.3 Animation from Interactions; token-driven theme implications.
7. **Touch target vs WCAG 2.5.8** — exact 2.5.5 / 2.5.8 text, AA vs AAA
   levels, spacing/offset exceptions; resolve 24 vs 44.
8. **Dark surface elevation** — depth without shadows: border vs lightness
   step vs elevation; Material 3 elevation on dark; contrast numbers for
   surface tiers.
