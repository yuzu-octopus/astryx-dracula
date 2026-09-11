# Using Astryx Styles

Three paths, same hexes. Pick one per site.

## Get the kit

```bash
bun add astryx-dracula
```

Or clone `https://github.com/yuzu-octopus/astryx-dracula.git` and copy
`astryx-dracula.js` + `theme.css` (prebuilt), `tokens.css` (plain CSS), `fonts/` into served
`public/fonts/`. Update with a version bump; never fork the hexes per-site.

## Prebuilt (recommended for Astryx apps)

Zero runtime cost. Built with `bun run theme:build` from `astryx-theme.ts`.

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

After editing `astryx-theme.ts`, rebuild and verify freshness:

```bash
bun run theme:build
bun run theme:check   # fails if committed outputs are stale
```

## Runtime injection (prototyping)

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';

<Theme theme={astryxDraculaTheme} mode="dark">
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
@import 'astryx-dracula/tokens.css';
```

Then use `var(--color-primary)`, `var(--dracula-purple)`, `var(--space-gap)`.
`tokens.css` sets real `:root` values with `color-scheme: dark`, so first paint is correct with no runtime.

## Migrating an existing site

1. Inventory: grep for hex colors, `:root` blocks, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to `BRAND.md`. Unmappable colors are brand questions, not new hexes.
3. Replace: delete the old theme provider and `:root` overrides, point imports at the kit prebuilt path, swap raw elements for Astryx components.
4. Verify: build, screenshot key pages, confirm no stray hexes remain in `src/`.

## Templates

Around 45 themed pages ship in `templates/`, each with a `<id>.template.mjs` spec, published
as an Astryx integration pack (`astryx.integration.mjs`). List this package in your
`astryx.config`, then scaffold any of them:

```bash
bunx astryx template dashboard --package astryx-dracula
```

View them all live at `/astryx-dracula/#/templates` on the showcase (agent index: [AGENTS.snippet.md](AGENTS.snippet.md)). Pack rules: templates
import React plus `@astryxdesign/core` and `lucide-react`, no chart libraries.

## Fonts

Copy `fonts/` to your app's served static dir (Vite: `public/fonts/`).
`tokens.css` declares the `@font-face` blocks; the theme sets JetBrains Mono
for body, heading, and code roles. Without the files, text falls back to
`monospace` — `bun run audit` fails when they are missing here.

## Consumer Vite config

No special config needed. This kit follows the glimpse path: prebuilt
`@astryxdesign/core` CSS plus `<Theme>` injection. A stock Vite React
config works. The only recommended extra is the CSS layer-order snippet so
theme overrides beat component base styles (our repo `vite.config.ts` also
sets a demo-only `base` path; do not copy that):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'astryx-css-layer-order',
      transformIndexHtml() {
        return [
          {
            tag: 'style',
            children:
              '@layer reset, astryx-base, astryx-theme;',
            injectTo: 'head-prepend',
          },
        ];
      },
    },
    react(),
  ],
});
```

Advanced: custom `astryx theme build` pipelines need the full StyleX
source-compile setup. See the `/facebook/astryx` `apps/example-vite`
README. Not required for this kit.

## Troubleshooting

- Unstyled components: entry is missing `reset.css`/`astryx.css` or the import order is wrong.
- Monospace fallback: `fonts/` not copied to served `public/fonts/`.
- Wrong colors after a theme edit: rebuild with `bun run theme:build`; `bun run theme:check` confirms staleness.
- Old `:root` `--color-*` overrides winning: delete them.

## Rules

- Never invent hexes. New color need goes through `astryx-theme.ts` + audit, not a one-off.
- Never override `--color-*` in app `:root`. Brand changes live in `astryx-theme.ts` via `defineTheme`, then `bun run theme:build`.
- Tokens for every value: `var(--color-*|--space-*|--radius-*)`. No raw hex or px in components.
- Component styling: props first, then theme `components` overrides in `astryx-theme.ts`. No per-app CSS wars.

## Release checklist

Before tagging a release:

1. Pin versions: `@astryxdesign/core` / `@astryxdesign/cli` in `package.json` match the showcase and CI.
2. Refresh the approximate template counts in `README.md` / `USAGE.md` (no gate asserts them) and the version badges baked into `templates/product-tour.tsx` + `templates/centered-hero.tsx` (rendered text + XLE header) to match `package.json`.
3. Rebuild and gate: `bun run theme:build`, then `bun run theme:check`, then `bun run audit`.
