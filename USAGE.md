# Using Astryx Styles

Two paths, same hexes. Pick one per site.

## Plain CSS (any stack)

```css
@import '../tokens.css';
```

Then use `var(--color-primary)`, `var(--dracula-purple)`, `var(--space-gap)`.
`tokens.css` sets real `:root` values with `color-scheme: dark`, so first paint is correct with no runtime.

## Astryx (Vite + React + Bun)

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

## Consumer Vite config

No special config needed. This kit follows the glimpse path: prebuilt
`@astryxdesign/core` CSS plus runtime `<Theme>` injection. A stock Vite React
config works. The only recommended extra is the CSS layer-order snippet so
theme overrides beat component base styles (see `vite.config.ts` in this repo).

Advanced: zero-runtime precompiled themes via `bunx astryx theme build`
need the full StyleX source-compile setup (`@stylexjs/unplugin`,
lightningcss targets, `optimizeDeps.exclude`, src alias). See the
`/facebook/astryx` `apps/example-vite` README. Not required for this kit.

## Rules

- Never invent hexes. New color need goes through `tokens.json` + audit, not a one-off.
- Never override `--color-*` in app `:root`. Brand changes live in `astryx-theme.ts` via `defineTheme`.
- Tokens for every value: `var(--color-*|--space-*|--radius-*)`. No raw hex or px in components.
