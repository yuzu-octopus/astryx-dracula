---
name: astryx-styles
description: Use when styling an Astryx React app with the shared Dracula brand, picking colors or fonts, or when UI styling looks inconsistent across brand sites
---

# Astryx Styles

## Overview

Shared Dracula brand for every Astryx site. One source of truth, three consumption paths. Never invent a color or a token name.

## When to Use

- New Astryx site needing brand styling
- Colors, fonts, spacing, or radii decisions
- Styling drift between brand sites
- Adding a component that must match the brand

When NOT to use: non-Astryx stacks beyond the plain-CSS path, or a one-off page that intentionally breaks brand.

## Quick Reference

| Need | Do |
|---|---|
| Astryx app, best perf | `import { astryxDraculaTheme } from '<kit>/astryx-dracula'` + `import '<kit>/theme.css'`, wrap in `<Theme theme mode="dark">` |
| Prototype | `defineTheme` object `astryxStylesTheme` from `<kit>/astryx-theme.ts` with runtime `<Theme>` |
| Any stack | `@import '<kit>/tokens.css'`, use `var(--color-*)` |
| Fonts | Copy `<kit>/fonts/` to served `public/fonts/` |
| Change brand | Edit `astryx-theme.ts`, run `bun run theme:build`, commit outputs |
| Check drift | `bun run audit` (hexes, fonts, stale build) and `bun run theme:check` |

## Exact token names (use these verbatim)

Background `--color-background`, primary `--color-primary`, positive `--color-positive`,
negative `--color-negative`, warning `--color-warning`, info `--color-info`,
muted text `--color-text-subdue`, spacing `--space-gap` / `--space-viewport`,
radius `--border-radius`. Raw primitives: `--dracula-bg`, `--dracula-fg`,
`--dracula-comment`, `--dracula-purple`, `--dracula-green`, `--dracula-red`,
`--dracula-yellow`, `--dracula-cyan`, `--dracula-pink`, `--dracula-orange`,
`--dracula-current-line`. No other color, space, or radius names exist in this kit.
For Astryx component tokens beyond the kit, run `bunx astryx docs tokens`.

## Implementation

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { Card, Link, Text } from '@astryxdesign/core';
import { astryxDraculaTheme } from '../astryx-styles/astryx-dracula';
import '../astryx-styles/theme.css';

<Theme theme={astryxDraculaTheme} mode="dark">
  <Card>
    <Text>Body copy inherits theme text.</Text>
    <Link href="/docs">Purple means tappable.</Link>
  </Card>
</Theme>;
```

Semantics: purple links and titles unvisited, green positive, red negative, yellow tags, cyan info, pink flair, orange warning. No `<div>` for layout: Card for groups, Text for copy, Link for navigation, Stack/HStack/Grid for arrangement. Unknown prop? Run `bunx astryx component <Name>` — do not guess (`label` required on Button, `level` on Heading, `columns` on Grid).

## Common Mistakes

- Raw hex or px in components → kit variable or component prop.
- Invented variable names (`--color-bg`, `--space-lg`) → only the Exact list above exists.
- Raw `<div>`/`<span>`/`<a>` layout → Card/Text/Link/Stack/Grid.
- Overriding `--color-*` in app `:root` → change `astryx-theme.ts` and rebuild.
- Forgetting `fonts/` copy → monospace fallback; kit audit catches it.
- Stale `theme.css` → `bun run theme:check` fails; rebuild.
- Adding the StyleX source-compile plugin from the example-vite README → unneeded; this kit ships prebuilt CSS plus runtime injection.
