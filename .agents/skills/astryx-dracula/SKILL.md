---
name: astryx-dracula
description: Use when styling an Astryx React app with the shared Dracula brand, starting a new brand site, migrating a codebase to the brand theme, or when UI styling looks inconsistent, text looks too small, hover states look wrong, or scrollbars clash across brand sites
---

# Astryx Dracula Brand

## Overview

One dark Dracula identity for every Astryx site. Dark-only, no light mode exists or is planned. Never invent a color, a token name, a font, or a radius. The reference implementation is the live showcase (Overview, Palette, Dashboard, Gallery, Quickstart) plus the dense bento screenshot page (`?shot=bento`): information-heavy, interlocking cards, zero wasted space. Match that density and hierarchy, not a generic SaaS-card kit.

## Reference files

- `references/scaffolds.md` — copy-paste skeletons: showcase shell, hero, bento, dashboard, steps, spec grid, responsive rules.
- `references/spacing.md` — canonical spacing values with provenance, card insets, type floors, touch targets, table density.
- `references/visual.md` — color semantics, charts, code highlighting, motion, scrollbars, surfaces.

## Get the kit

```bash
bun add astryx-dracula
```

Fallback: clone `https://github.com/yuzu-octopus/astryx-dracula.git`, copy the same files, re-pull to update.

## New site

```bash
bun add react react-dom @stylexjs/stylex @astryxdesign/core lucide-react astryx-dracula
bun add -d typescript vite @vitejs/plugin-react @astryxdesign/cli @types/react @types/react-dom
cp -r node_modules/astryx-dracula/fonts public/fonts
```

Entry file, in this order:

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import 'astryx-dracula/tokens.css';
import 'astryx-dracula/theme.css';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;
```

Stock Vite config plus the layer-order snippet in USAGE.md. Discover components with `bunx astryx component <Name>` before use. Never guess a prop (`label` on Button, `level` on Heading, `columns` on Grid).

## Brand principles

These are decisions, not suggestions. Every one comes from the showcase that defines the brand.

1. **Dark is the brand, not a mode.** Every surface resolves to the Dracula ramp. No light tokens, no light-mode branches, no `prefers-color-scheme` forks. A component that looks wrong dark is a wrong token, never a missing light theme.
2. **Purple means tappable.** Links, titles, and primary actions are purple; visited falls back to text, hover resolves to foreground plus underline. Users learn this in seconds. Nothing decorative is purple.
3. **Status has a fixed vocabulary.** Green positive, red negative, yellow tags, cyan info, pink flair, orange warning. Status surfaces use 10% categorical washes with semantic borders, never direct fills. Text on fills is always `#21222C`.
4. **Mono everywhere, on purpose.** JetBrains Mono for body, heading, and code alike. One family, clearly distinct from every sans-serif product. Copy `fonts/` to served `public/fonts/`; monospace fallback means the copy step was skipped.
5. **Dense, not cramped.** The bento reference packs 12 cells with zero dead space: hero strip with live stats, wide chart, tall table spanning two rows, palette strip, type specimen, install command. Size equals importance (hero 2x, feature wide, metrics small). Information-heavy beats airy on every brand surface.
6. **Hierarchy is two-tier.** Section headers pair `Heading level={2}` with `Text type="body"`. Widget headers pair `Heading level={3}` with `Text type="supporting"`. Never two same-size tiers stacked, never a subtitle larger than its heading.
7. **Flat and crisp.** 5px radii on elements, 4px inner. No pills, no circles except dots and avatars, no soft grey shadows. Depth comes from borders (`--color-separator`, `--color-widget-content-border`), not elevation.
8. **Motion answers action.** Hover dims, press dims more, focus rings accent. No entrance choreography, no card hover lifts, no decorative animation.

## Typography doctrine

The theme scale is base 14, ratio 1.2: body and code 14, supporting 12, headings 24/20/17. Roles, not raw sizes:

- `body` — default UI text, table cells, card descriptions, section subtitles, anything the user must read to act.
- `supporting` — metadata ONLY: timestamps, hints, captions, legend labels, KPI deltas. If the sentence carries meaning the page needs, it is `body`.
- `code` — hex values, token names, commands, anything monospaced.
- `large` — long-form reading copy. `label` — form and group labels.
- Nothing meaningful below 12px, ever. A 9–11px floor is a core scale artifact, not a license.

Type carries hierarchy, so weight stays quiet: headings normal, `semibold` for emphasis and KPI values, never bold display type. Tabular numerals on every quantity (`hasTabularNumbers`). JetBrains Mono has a small x-height; when in doubt go one role larger, never smaller.

## Layout doctrine

1. **Frame first.** Pick the shell (AppShell, TopNav) and budget regions before content. Full page goes in AppShell; sidebar nav means SideNav.
2. **Bento for showcases, rows for data.** Marketing and overview surfaces interlock: hero strip, wide feature (span 2), tall table (row span 2), metric cells. Astryx Grid has no span prop, so spans go through `style={{ gridColumn: 'span 2' }}`. Dense data stays rows: Table edge-to-edge, never Card-wrapped list items.
3. **Cards are widgets.** Dashboard widgets, galleries, settings groups, showcase cells. Outer padding 4, nested inset 3, everywhere, no exceptions. A padding-2 inset next to a padding-3 inset is a defect.
4. **No raw layout elements.** No `<div>`, `<span>`, or `<a>` for layout or text. Card, Text, Link, Stack, Grid do all of it.
5. **Touch targets are floored.** WCAG AA 24px minimum; 44px where touch matters. The `sm` Button stays in dense contexts with a caption; CTAs stay default size.

## State doctrine

- **Hover dims, never inverts.** Interactive surfaces darken 12% on hover, 20% on press, via the theme overlay tokens. A hover that goes transparent, dark-navy, or accent-colored means something overrode `--color-overlay-hover`.
- **Focus is accent.** 2px accent ring, beat Functional Purple on contrast. Never remove it.
- **Links underline always**, resolve to foreground on hover. Inline links inherit the surrounding text size; a link that renders larger than its sentence is the fixed external icon at small sizes, drop `isExternalLink` and keep `target="_blank"`.
- **Table rows lift on hover.** Scrollbars are Dracula (Selection thumb, Current Line hover) via `tokens.css`. A visible scrollbar on a comfortable table means a redundant `overflowX` wrapper fighting Table's own scroll container; delete yours.

## Migrating a codebase

1. Inventory: grep for `#[0-9a-fA-F]{3,6}`, `:root`, `@apply`, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to the Exact list below; anything unmappable is a brand question, not a new hex.
3. Replace: delete old theme provider and `:root` overrides, point entry imports at the kit block above, swap raw elements for Card/Text/Link/Stack/Grid, assign each text node its role per the typography doctrine.
4. Verify: `bun run build`, screenshot key pages at 1568 and 390, confirm no raw hex remains (`grep -ri '#[0-9a-f]\{3,6\}' src --include='*.tsx' --include='*.css'` should show only kit references), confirm no page-level horizontal overflow at 390.

## Exact token names (use these verbatim)

Background `--color-background`, primary `--color-primary`, positive `--color-positive`,
negative `--color-negative`, muted text `--color-text-subdue`, primary text `--color-text-primary`,
border `--color-border`, accent `--color-accent`, success `--color-success`, error `--color-error`,
warning `--color-warning`, info `--color-info`, icon `--color-icon-primary` / `--color-icon-secondary` / `--color-icon-disabled` / `--color-icon-accent`, radius `--radius-element` / `--border-radius`,
spacing `--space-gap` / `--space-viewport`. Raw primitives: `--dracula-bg`, `--dracula-fg`,
`--dracula-comment`, `--dracula-purple`, `--dracula-green`, `--dracula-red`,
`--dracula-yellow`, `--dracula-cyan`, `--dracula-pink`, `--dracula-orange`,
`--dracula-current-line`. Glance widget/text vars: `--color-widget-background`,
`--color-widget-content-border`, `--color-widget-background-highlight`, `--color-separator`,
`--color-popover-background`, `--color-popover-border`, `--color-progress-border`,
`--color-progress-value`, `--color-graph-gridlines`, `--color-text-highlight`,
`--color-text-paragraph`, `--color-text-base`, `--color-text-base-muted`. Status tints:
`--color-background-<blue|cyan|gray|green|orange|pink|purple|red|teal|yellow>` (10% washes),
`--color-functional-<red|orange|green|cyan|purple>`. Charts:
`--color-data-categorical-*` and ramp tokens per `BRAND.md`. Nothing else exists.
For Astryx tokens beyond the kit, `bunx astryx docs tokens`.

## Rationalizations (do not accept these)

| Excuse | Reality |
|--------|---------|
| "Supporting is fine for this paragraph" | If the page needs the sentence, it is `body`. Supporting is metadata only. |
| "One-off hex, matches the palette" | Same hue is not the same token. Map it or ask. |
| "Custom CSS for this one layout" | Props first, tokens second, `style` only for what props cannot express (grid spans). |
| "Light mode for accessibility" | Dark-only is the brand. Accessibility comes from contrast gates, not a second theme. |
| "Smaller text fits more data" | Reduce columns, truncate with tooltips, or paginate. Never shrink below the role floor. |
| "The skill is verbose, summary suffices" | The entry block, token list, and doctrines are load-bearing. Skimmed adoption is how drift starts. |

## Red flags (stop and re-read the skill)

- A color value you cannot name from the Exact list
- Text that needs reading set in `supporting`
- A hover state you designed instead of the dim
- A second font family, a new radius, a custom shadow
- A `?shot=` page you would not screenshot for the org

## Troubleshooting

- Unstyled components → entry is missing `reset.css` or `astryx.css`, or import order is wrong.
- Monospace fallback → `fonts/` not copied to served `public/fonts/`.
- Wrong colors after theme edit → rebuild: `bun run theme:build`, or `bun run theme:check` to confirm staleness.
- Old `:root` `--color-*` overrides still winning → delete them; brand lives in the kit theme.

## Common Mistakes

- Raw hex/px or invented names (`--color-bg`, `--space-lg`) → Exact list or component prop.
- Raw `<div>`/`<span>`/`<a>` → Card/Text/Link/Stack/Grid.
- Source-compile StyleX plugin from the example-vite README → unneeded; kit ships prebuilt CSS.
- Section subtitle in `supporting` → `body`. Widget caption in `body` → `supporting`.
- Mixed Card insets (2 vs 3) → outer 4, nested 3.
