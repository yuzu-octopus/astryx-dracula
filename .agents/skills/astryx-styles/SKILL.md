---
name: astryx-styles
description: Use when styling an Astryx React app with the shared Dracula brand, starting a new brand site, migrating a codebase to the brand theme, or when UI styling looks inconsistent across brand sites
---

# Astryx Styles

## Overview

Shared Dracula brand for every Astryx site. Dark-only, no light mode. Never invent a color or a token name.

## Get the kit

```bash
git clone https://github.com/yuzu-octopus/astryx-theme.git
```

Local mirror at `~/Documents/Projects/astryx-styles`. Copy `astryx-dracula.js`, `theme.css`, `tokens.css`, `fonts/`; re-pull to update.

## New site

```bash
bun add react react-dom @stylexjs/stylex @astryxdesign/core lucide-react
bun add -d typescript vite @vitejs/plugin-react @astryxdesign/cli @types/react @types/react-dom
cp -r <kit>/fonts public/fonts
```

Entry file, in this order:

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '<kit>/tokens.css';
import '<kit>/theme.css';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '<kit>/astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;
```

Stock Vite React config plus the layer-order snippet in `<kit>/vite.config.ts`. Discover components with `bunx astryx component <Name>` before use.

## Migrating a codebase

1. Inventory: grep for `#[0-9a-fA-F]{3,6}`, `:root`, `@apply`, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to the Exact list below; anything unmappable is a brand question, not a new hex.
3. Replace: delete old theme provider and `:root` overrides, point entry imports at the kit files above, swap raw elements for Card/Text/Link/Stack/Grid.
4. Verify: `bun run build`, screenshot key pages, confirm no raw hex remains (`grep -ri '#[0-9a-f]\{3,6\}' src --include='*.tsx' --include='*.css'` should show only kit references).

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

## Semantics

Purple links and titles unvisited, green positive, red negative, yellow tags, cyan info, pink flair, orange warning. Code blocks use the official `dracula` syntax preset bundled in the theme. No `<div>` for layout. Unknown prop? `bunx astryx component <Name>` — do not guess (`label` on Button, `level` on Heading, `columns` on Grid).

## Troubleshooting

- Unstyled components → entry is missing `reset.css` or `astryx.css`, or import order is wrong.
- Monospace fallback → `fonts/` not copied to served `public/fonts/`.
- Wrong colors after theme edit → rebuild: `bun run theme:build`, or `bun run theme:check` to confirm staleness.
- Old `:root` `--color-*` overrides still winning → delete them; brand lives in the kit theme.

## Common Mistakes

- Raw hex/px or invented names (`--color-bg`, `--space-lg`) → Exact list or component prop.
- Raw `<div>`/`<span>`/`<a>` → Card/Text/Link/Stack/Grid.
- Source-compile StyleX plugin from the example-vite README → unneeded; kit ships prebuilt CSS.
