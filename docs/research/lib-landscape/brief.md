# Brief — JS/React UI library landscape, design-intelligence harvest

Date: 2026-09-28. Depth: **deep** (6 workers + 1 reconciliation round).

## Question
How do the 20 named JS/React UI libraries solve state styling, density, focus/keyboard, overlays, motion, colour scaling, dark mode, truncation/tooltip/empty-state — and which of those mechanisms would measurably improve `@astryxdesign/core` 0.3.0 as themed by `astryx-dracula`?

## Decision
Informs a human-approved (NOT yet approved) change set to the Astryx Dracula brand kit. Output must be actionable: every recommendation names a concrete artifact — an Astryx component slot, a `shared/*` module, or a specific CSS custom property.

Explicitly NOT a dependency recommendation. The kit ships zero runtime UI deps (`package.json` deps = `lucide-react` only) and must keep it that way. This is a harvest of *mechanisms*, not packages.

## Answer form
1. Per-library extraction table — 20 rows × 9 mechanism columns.
2. **5 adopt** patterns, each mapped to a named Astryx slot / shared module / token.
3. **3 reject** patterns — popular but wrong for this brand.
4. Dark-mode strategy comparison against our `pin()`-every-tuple dark-only model.

## Scope

### In
- Radix UI, shadcn/ui, Base UI, Mantine, Chakra UI, HeroUI (NextUI), Park UI, Ark UI, React Aria Components, Reakit, Headless UI, Tremor, Nivo, Recharts, TanStack Table, Floating UI, Sonner, cmdk, Vaul, react-resizable-panels, grid-layout-plus, dnd-kit.
- The 9 mechanism dimensions listed under "Extraction axes" below.
- Source-level specifics: the actual file that owns the mechanism, the actual attribute/class/token name.

### Out
- Anything requiring a new hex, font, radius, or token name — flag as **needs-human-approval**, never assert.
- Light mode as a feature to copy.
- Installing any dependency. Repo is READ-ONLY except `docs/research/`.

## Established — do NOT re-litigate
Dark-only, no light mode, no `prefers-color-scheme` fork. Warning ships Yellow. Purple = tappable only, never data. Status vocabulary green/red/yellow/cyan/pink/orange. Syntax = constant Purple + attribute Green + property Foreground. `tokens.css` is a full unlayered mirror of `theme.css` (a published contract — reference-counting "unused tokens" is invalid). Radius: 5px element, 4px inner, flat. Content surface darker than chrome. 45 templates. Card padding 4 outer / 3 nested. JetBrains Mono everywhere. Weights: **only 400 and 600 ship** — `--font-weight-medium` (500) and `--font-weight-bold` (700) are dead tokens and no recommendation may reintroduce a 500/700 face.

## Astryx 0.3.0 baseline (probed 2026-09-28 via `bunx astryx`)
- 155 components/exports, all from `@astryxdesign/core`.
- **Colour**: core tokens use `light-dark(light, dark)` for automatic mode switching. Brand kit overrides every tuple with a single pinned dark hex.
- **Radius**: core scale = inner 4 / element 8 / container 12 / page 28 / chat 28, scaling off a theme radius multiplier, with `--radius-none` / `--radius-full` anchors. Brand pins element to 5px.
- **Concentric radius**: core Card computes `--card-concentric-radius: max(0px, calc(var(--_card-radius) - var(--card-padding)))` automatically.
- **Spacing**: 4px base, `--spacing-0` … `--spacing-12` (0,2,4,6,8,12,16,20,24,28,32,36,40,44,48px), component `gap` props take step numbers 0–12.
- **Motion**: 9 duration tokens (fast 130/175/230ms, medium 310/410/550ms, slow 730/975/1300ms) + a single easing `cubic-bezier(0.24, 1, 0.4, 1)`. No exit-animation helper, no transform-suggestion helper, no spring.
- **Styling**: StyleX (`stylex.create`, `xstyle` prop), theme builds to static CSS for production/SSR.
- **Scrollbars**: core 0.3.0 themes zero scrollbar paint; kit owns it entirely in `tokens.css`.

## Extraction axes (every worker answers all 9 for their libraries)
1. State styling mechanism — `data-*` attribute vs variant prop vs class vs pseudo. Name the exact attribute (`data-state="open"`) if it exists.
2. Density / spacing model.
3. Focus management — what receives focus on open, focus trap, restore-on-close, visible ring.
4. Keyboard / roving tabindex patterns.
5. Overlay: portal target, z-index model, dismissal rules (outside click, Escape, scroll lock, nesting/stacking).
6. Motion tokens — duration/easing, enter+exit, reduced-motion handling.
7. Colour scaling approach — primitive/semantic/component layers, how many steps.
8. Dark-mode strategy — is it a second theme, a `light-dark()` pair, a class toggle, tokens-on-body? Would it survive dark-only?
9. Truncation / tooltip / empty-state handling.

## Angles

1. **Unstyled primitives & state styling** — Radix UI, Base UI, Ark UI, Reakit, Headless UI.
2. **Token architecture & dark mode** — shadcn/ui, Chakra UI, Mantine, Radix Colors.
3. **Overlay micro-libraries** — Sonner, cmdk, Vaul, Floating UI, react-resizable-panels.
4. **Data & layout** — TanStack Table, grid-layout-plus, dnd-kit, Nivo, Recharts, Tremor.
5. **A11y & interaction correctness** — React Aria Components + Floating UI, plus cross-cutting truncation/tooltip/empty-state across all libs in scope.
6. **Composite kits & slot APIs** — Park UI, HeroUI (NextUI), Mantine, Chakra — full surface; who owns component source, how slots are exposed, how variant recipes stay in sync with tokens.

**Counter-angle (required)**: documented failure modes and migration pain — "shadcn dark mode problems", "Radix accessibility issues", "Mantine dark mode", "reakit unmaintained", "HeroUI Tailwind v4", "nivo react 19". Critical sources are underrepresented because vendors publish more than victims. Any library whose maintenance status or a11y record is contested must be marked, not assumed good.

## Assumptions (written, non-blocking)
- The human has approved nothing. Every recommendation is a proposal.
- Where a library's mechanism depends on Tailwind, the transferable part is the *mechanism* (attribute name, token name, layering), not Tailwind itself.
- Where sources conflict, prefer newer + primary (source code over docs over blogs).

## Quality gate
☐ Every library in scope has a row  ☐ Every axis has ≥1 primary source  ☐ Dark-mode comparison covers all 20  ☐ Counter-angle worked  ☐ 5 adopt + 3 reject each name a concrete artifact  ☐ No new hex/token/font/radius asserted without the needs-human-approval flag
