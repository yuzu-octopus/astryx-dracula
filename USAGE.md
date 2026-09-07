# Using Astryx Styles

Three paths, same hexes. Pick one per site.

## Get the kit

```bash
git clone https://github.com/yuzu-octopus/astryx-theme.git
```

Copy what you need: `astryx-dracula.js` + `theme.css` (prebuilt), `astryx-theme.ts` (source),
`tokens.css` (plain CSS), `fonts/` into served `public/fonts/`. Re-pull to update; never fork the hexes per-site.

## Prebuilt (recommended for Astryx apps)

Zero runtime cost. Built with `bun run theme:build` from `astryx-theme.ts`.

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from './astryx-dracula';
import './theme.css';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;
```

After editing `astryx-theme.ts`, rebuild and verify freshness:

```bash
bun run theme:build
bun run theme:check   # fails if committed outputs are stale
```

## Runtime injection (prototyping)

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxStylesTheme } from '../astryx-theme';

<Theme theme={astryxStylesTheme} mode="dark">
  <App />
</Theme>;
```

Entry setup (once, in `demo/main.tsx` style):

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../tokens.css';
```

## Plain CSS (any stack)

```css
@import '../tokens.css';
```

Then use `var(--color-primary)`, `var(--dracula-purple)`, `var(--space-gap)`.
`tokens.css` sets real `:root` values with `color-scheme: dark`, so first paint is correct with no runtime.

## Migrating an existing site

1. Inventory: grep for hex colors, `:root` blocks, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to `tokens.json`. Unmappable colors are brand questions, not new hexes.
3. Replace: delete the old theme provider and `:root` overrides, point imports at the kit prebuilt path, swap raw elements for Astryx components.
4. Verify: build, screenshot key pages, confirm no stray hexes remain in `src/`.

## Fonts

Copy `fonts/` to your app's served static dir (Vite: `public/fonts/`).
`tokens.css` declares the `@font-face` blocks; the theme sets JetBrains Mono
for body, heading, and code roles. Without the files, text falls back to
`monospace` — `bun run audit` fails when they are missing here.

## Consumer Vite config

No special config needed. This kit follows the glimpse path: prebuilt
`@astryxdesign/core` CSS plus `<Theme>` injection. A stock Vite React
config works. The only recommended extra is the CSS layer-order snippet so
theme overrides beat component base styles (see `vite.config.ts` in this repo).

Advanced: custom `astryx theme build` pipelines need the full StyleX
source-compile setup. See the `/facebook/astryx` `apps/example-vite`
README. Not required for this kit.

## Troubleshooting

- Unstyled components: entry is missing `reset.css`/`astryx.css` or the import order is wrong.
- Monospace fallback: `fonts/` not copied to served `public/fonts/`.
- Wrong colors after a theme edit: rebuild with `bun run theme:build`; `bun run theme:check` confirms staleness.
- Old `:root` `--color-*` overrides winning: delete them.

## Rules

- Never invent hexes. New color need goes through `tokens.json` + audit, not a one-off.
- Never override `--color-*` in app `:root`. Brand changes live in `astryx-theme.ts` via `defineTheme`, then `bun run theme:build`.
- Tokens for every value: `var(--color-*|--space-*|--radius-*)`. No raw hex or px in components.
- Component styling: props first, then theme `components` overrides in `astryx-theme.ts`. No per-app CSS wars.
