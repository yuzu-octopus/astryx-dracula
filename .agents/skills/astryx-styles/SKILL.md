---
name: astryx-styles
description: Use when styling an Astryx React app with the shared Dracula brand, starting a new brand site, migrating a codebase to the brand theme, or when UI styling looks inconsistent across brand sites
---

# Astryx Styles

## Overview

Shared Dracula brand for every Astryx site. Kit lives at `~/Documents/Projects/astryx-styles`. Never invent a color or a token name.

## New site

```bash
bun add react react-dom @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral
bun add -d typescript vite @vitejs/plugin-react @astryxdesign/cli @types/react @types/react-dom
cp -r <kit>/fonts public/fonts
```

Entry (once): import `@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css`, `<kit>/tokens.css`. Wrap app in `<Theme theme={astryxDraculaTheme} mode="dark">` with `<kit>/astryx-dracula.js` + `<kit>/theme.css`. Stock Vite React config plus the layer-order snippet in `<kit>/vite.config.ts`. Discover components with `bunx astryx component <Name>`.

## Migrating a codebase

1. Inventory: grep for `#[0-9a-fA-F]{3,6}`, `:root`, `@apply`, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to the Exact list below; anything unmappable is a brand question, not a new hex.
3. Replace: delete old theme provider and `:root` overrides, point imports at the kit (prebuilt path), swap raw elements for Card/Text/Link/Stack/Grid.
4. Verify: `bun run build`, screenshot key pages, confirm no raw hex remains (`grep -ri '#[0-9a-f]\{3,6\}' src --include='*.tsx' --include='*.css'` should show only kit references).

## Exact token names (use these verbatim)

Background `--color-background`, primary `--color-primary`, positive `--color-positive`,
negative `--color-negative`, muted text `--color-text-subdue`, primary text `--color-text-primary`,
border `--color-border`,
accent `--color-accent`, success `--color-success`, error `--color-error`, warning `--color-warning`,
info `--color-info`, radius `--radius-element`, spacing `--space-gap` / `--space-viewport`,
radius `--border-radius`. Raw primitives: `--dracula-bg`, `--dracula-fg`,
`--dracula-comment`, `--dracula-purple`, `--dracula-green`, `--dracula-red`,
`--dracula-yellow`, `--dracula-cyan`, `--dracula-pink`, `--dracula-orange`,
`--dracula-current-line`. Glance widget/text vars: `--color-widget-background`,
`--color-widget-content-border`, `--color-widget-background-highlight`, `--color-separator`,
`--color-popover-background`, `--color-popover-border`, `--color-progress-border`,
`--color-progress-value`, `--color-graph-gridlines`, `--color-text-highlight`,
`--color-text-paragraph`, `--color-text-base`, `--color-text-base-muted`. Nothing else exists.
For Astryx tokens beyond the kit, `bunx astryx docs tokens`.

## Semantics

Purple links and titles unvisited, green positive, red negative, yellow tags, cyan info, pink flair, orange warning. No `<div>` for layout. Unknown prop? `bunx astryx component <Name>` — do not guess (`label` on Button, `level` on Heading, `columns` on Grid).

## Changing the brand

Edit `astryx-theme.ts`, run `bun run theme:build`, commit outputs. `bun run theme:check` fails on stale builds; `bun run audit` checks hexes, fonts, and freshness.

## Common Mistakes

- Raw hex/px or invented names (`--color-bg`, `--space-lg`) → Exact list or component prop.
- Raw `<div>`/`<span>`/`<a>` → Card/Text/Link/Stack/Grid.
- Old `:root` `--color-*` overrides left in place → delete; brand lives in the kit theme.
- Forgetting `fonts/` copy → monospace fallback.
- Source-compile StyleX plugin from the example-vite README → unneeded; kit ships prebuilt CSS.
