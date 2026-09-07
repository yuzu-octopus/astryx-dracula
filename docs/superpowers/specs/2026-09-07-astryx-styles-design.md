# Astryx Styles Design

Status: approved. Extract-then-freeze pure Dracula brand kit.

## 1. Goal

One brand source of truth in `astryx-styles/` so every Astryx site renders identical styling. Other agents copy `tokens.css` or `astryx-theme.ts`, never invent hexes. Inspired by `glimpse`, frozen to official Dracula spec.

## 2. Sources of truth

- Glimpse runtime: `glimpse/src/index.css` `:root` fallbacks, `src/shared/theme/glanceRamp.ts` ramp math, `src/shared/theme/glimpseTheme.ts` DIMS + semantic map, `src/shared/theme/presets.ts` (not ported; reference only).
- Astryx docs (`/facebook/astryx` via Context7): `bunx @astryxdesign/cli init` after `bun add -d @astryxdesign/cli`; `defineTheme({ name, tokens })` with `[light, dark]` tuples compiled to `light-dark()`; `<Theme theme mode>` provider; Vite example-vite StyleX config (reference only). This repo follows the glimpse prebuilt path instead: stock Vite React plus the css-layer order snippet, no StyleX plugin, no src alias.
- Dracula spec (web): https://draculatheme.com/contribute and https://spec.draculatheme.com/. Canonical hexes: bg #282A36, current-line #6272A4 (shared with comment), selection #44475A, fg #F8F8F2, comment #6272A4, cyan #8BE9FD, green #50FA7B, orange #FFB86C, pink #FF79C6, purple #BD93F9, red #FF5555, yellow #F1FA8C, plus the spec UI palette (light #343746, lighter #424450, dark #21222C) and functional colors (red #DE5735, orange #A39514, green #089108, cyan #0081D6, purple #815CD6). Source file spec.mdx supersedes earlier web summaries.

## 3. Decisions

- Full brand kit with docs demo (not tokens-only, not starter template alone).
- Pure Dracula dark-only. No light-mode inversion. Glimpse `invertLuminance` derivation explicitly out of scope.
- Files now, package later. No npm publish.
- Dual consumption: Astryx Vite React Bun via `defineTheme`, plus plain CSS `tokens.css` fallback for non-Astryx pages.
- Approach: extract-then-freeze. Copy glimpse DIMS + semantic map + ramp fallbacks, audit 11 hexes against Dracula spec, freeze. Rejected spec-down rebuild (same hexes, more work).

## 4. Token architecture (three layers)

Primitive: 11 Dracula hexes as `--dracula-*`.
Semantic: `--color-background/primary/positive/negative/warning/info/tag-orange/tag-pink/text-subdue` mapped per glimpse: purple links/titles unvisited (visited falls back to text-base, hover primary + underline), green positive/success, red negative/error, yellow tags/chips, cyan info/secondary links, pink flair, orange warning/attention, subdue #4C5067 metadata/separators.
Component: Astryx components consume semantic tokens automatically; no per-component overrides in v1 except `--border-radius: 5px`.
Dims: gap 23px, viewport 15px, content 15px/17px, widget-gap 23px, tile-row 96px, radius 5px, JetBrains Mono, type scale h1 17 h2 16 h3 15 h4 14 base 13 h5 12 h6 11.

## 5. File map

- `tokens.json`: single source (primitives + dims + semantic).
- `tokens.css`: plain-CSS `:root` real values, `color-scheme: dark`.
- `astryx-theme.ts`: `defineTheme({ name: 'astryx-dracula', tokens })`, dark hexes pinned in both tuple slots.
- `vite.config.ts`: glimpse-style minimal config (css-layer order + react only). `USAGE.md` shows the consumer copy: stock Vite React plus the layer-order snippet.
- `scripts/audit-dracula.ts`: asserts all 11 hexes present in `tokens.css`, exit 1 on drift.
- `BRAND.md`: palette table + semantic map + dims.
- `USAGE.md`: plain CSS `@import` path + Astryx `<Theme theme mode="dark">` path.
- `AGENTS.snippet.md`: 8-line copy block for other agents' AGENTS.md.
- `demo/App.tsx`: 11 swatches + Card/Banner/Text inside `<Theme>`; visual proof only, no test file.
- `docs/superpowers/specs/2026-09-07-astryx-styles-design.md`: this file.
- `docs/superpowers/plans/2026-09-07-astryx-styles.md`: implementation plan.

## 6. Init flow (Bun)

`bun init`, `bun add react react-dom @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral`, `bun add -d typescript vite @vitejs/plugin-react @stylexjs/unplugin @astryxdesign/cli @types/react @types/react-dom`, `bun install`, `bunx @astryxdesign/cli init`. Never npm/npx/node/pip.

## 7. Verification

- `bun scripts/audit-dracula.ts` PASS (11/11 hexes).
- `bunx tsc --noEmit` clean.
- `bun run build` PASS.
- Demo renders 11 swatches with exact hexes; browser smoke test only.
- No permanent tests. Throwaway audit script is the check; YAGNI applies to test suites here.

## 8. Amendment 2026-09-07: proper-theme hardening (post-implementation review)

Reread of `bunx astryx docs theme/tokens/typography` plus node_modules type truth found gaps in the v1 kit:

- Component overrides missing. Ported link/card/button base from glimpse `buildGlimpseTheme`, then customized link to accent-plus-underline for brand visibility (glimpse uses inherit/none)
  (camelCase keys). Added the three glance vars they reference (`--color-widget-background`,
  `--color-widget-content-border`, `--color-text-highlight`) to theme + CSS. Build now reports
  270+ token overrides, 16 component overrides (`bun run theme:build` reports exact counts; do not hardcode them here).
- Fonts unshipped. Theme referenced JetBrains Mono with no files. Vendored both woff2 from glimpse
  into `fonts/`; `@font-face` lives in `tokens.css`; consumers copy `fonts/` to `public/fonts/`.
  Types confirm font loading is always consumer-side (no `url` in `TypographyRole`).
- No built artifacts. `bun run theme:build` emits `theme.css` + `astryx-dracula.js`; `bun run theme:check`
  fails on stale outputs. `USAGE.md` documents the prebuilt path first.
- Config corrected. The plan's example-vite source-compile setup (StyleX plugin, src alias,
  `optimizeDeps.exclude`) breaks resolution: glimpse uses prebuilt CSS + runtime injection with a
  stock Vite config, and `@vitejs/plugin-react` 6 requires Vite 8 (plan said 6). Repo follows glimpse.
- Demo had no `columns` on Grid (single-column stack) and no Button/Link coverage. Fixed and screenshotted.
- Agent skill added at `.agents/skills/astryx-dracula/SKILL.md` (reference, <500 words), tested with two
  subagent application scenarios: first run invented token names and raw divs, skill hardened with an
  exact-token table and no-div rule, second run fully compliant.
- Full surface audit of `DefineThemeInput` (name, extends, typography, motion, radius, color, tokens,
  components, icons, syntax, onDark): added official `syntax: dracula` preset and 10
  `--color-data-categorical-*` chart tokens in nearest Dracula hues, plus 9 five-step sequential
  ramps from `scripts/generate-chart-ramps.ts` (constant hue/sat, lightness 28/44/60/74/88).
- dracula-ui audit round: on-fill text is `#21222C` (spec never uses raw black), links render
  accent underlined resolving to foreground on hover, banner surfaces route through muted tokens
  (no direct fills), categorical bg/border/text tints added for all 10 hues,
  input status scopes and progress fills pinned to Dracula, borders and tracks raised to visible.
  Warning stays yellow over orange by brand choice; classic syntax hexes kept over dracula-ui brights.
  Deliberately unset with reasons in `BRAND.md`: motion, radius/color scales, icon glyphs
  (lucide-react, like glimpse), onDark, `--color-data-neutral`. Flat radii and glimpse type scale; dark-only stated.

## 9. Explicit non-goals

No preset library port, no light mode, no npm publish, no framework support beyond React Vite + plain CSS. Component overrides cover link/card/button/banner/inputs/progress/switch/field-status; no other components are touched.
