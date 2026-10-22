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

Prebuilt CSS plus runtime theme injection (the CSS carries the paint, the `<Theme>` object carries the tokens). Built with `bun run theme:build` from `astryx-theme.ts`.

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
`tokens.css` sets real `:root` values with `color-scheme: dark`, so first paint is correct with no runtime. It mirrors the theme's colour, spacing, radius, type and motion tokens as plain `:root` custom properties (`grep -c "^\s*--" tokens.css` vars, unlayered by design so it beats core layers with zero `!important`); edit the theme, not this file, then re-mirror.

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
bunx @astryxdesign/cli template dashboard --package astryx-dracula ./src/pages/dashboard.tsx
```

View them all live at `/astryx-dracula/#/templates` on the showcase (agent index: [AGENTS.snippet.md](AGENTS.snippet.md)). Pack rules: templates
import `@astryxdesign/core`, `lucide-react`, and the kit's own shared modules (`astryx-dracula/shared/*`: auth-copy, auth-chrome-config, chaptered-doc, chaptered-doc-config, chart-hues, chart-labels, chart-panel-style, gallery-image, login-demo, metric-delta, revenue-chart, scene-castle, scene-hues, scene-tile, settings-data, settings-rows, sparkline, sso-icons), no chart libraries.

## Fonts

Copy `fonts/` to your app's served static dir (Vite: `public/fonts/`).
`tokens.css` declares the `@font-face` blocks; the theme sets JetBrains Mono
for body, heading, and code roles. The shipped URLs are base-scoped
(`/astryx-dracula/fonts/*.woff2`, matching this repo's demo `base`) — apps
served from `/` remap or self-host the files at that path, otherwise text
falls back to `monospace`. `bun run audit` fails when the files are missing here. Only the package root `fonts/` ships them: a subpath import resolves nothing, so a fallback after copying means the copy step missed the expected path.

## Consumer Vite config

No special config needed. This kit follows the glimpse path: prebuilt
`@astryxdesign/core` CSS plus `<Theme>` injection. A stock Vite React
config works.

**The CSS layer order is now declared by the packages themselves.** As of
core 0.7.x, `reset.css`, `astryx.css` and this kit's `theme.css` each open
with `@layer reset, astryx-base, astryx-theme;`, so theme overrides beat
component base styles no matter which order you import them in. The
layer-order snippet this kit used to recommend is therefore redundant: a
repeated `@layer` statement is a no-op once the order is established, and
whichever file lands first establishes the same order. Keep it only if you
load a DIFFERENT layer name set, and never rename the three layers — the
names are the contract.

This kit's own `tokens.css` is deliberately **unlayered**, so it beats every
core layer with no `!important`. That is why the demo still injects the
layer-order statement: it costs nothing and documents the contract in the
one file a reader opens first.

Advanced: custom `astryx theme build` pipelines need the full StyleX
source-compile setup. See the `/facebook/astryx` `apps/example-vite`
README. Not required for this kit.

## Troubleshooting

- Unstyled components: entry is missing `reset.css`/`astryx.css` or the import order is wrong.
- Monospace fallback: `fonts/` not copied to served `public/fonts/`.
- Wrong colors after a theme edit: rebuild with `bun run theme:build`; `bun run theme:check` confirms staleness (it ignores `astryx-dracula.js` by design — that file is a build artifact, not a freshness signal).
- Old `:root` `--color-*` overrides winning: delete them.

## Upstream defects in `@astryxdesign/core` — resolved

This kit used to carry local patches for three core defects, under `patches/` and wired through
`patchedDependencies`. **All three were fixed upstream in `@astryxdesign/core@0.7.2`**, so the
patch directory and the `patchedDependencies` entry are gone. Nothing to carry downstream any more.

| Defect (core 0.6.3) | Status in 0.7.2 |
|---|---|
| `ChatToolCalls` discarded its `label` prop — the prop was destructured to `_customLabel` and never read, so the expanded group header always rendered `"{count} tool calls"`. | Fixed. The prop is destructured to `customLabel` and the header renders `customLabel ?? t('@astryx.chatToolCalls.groupLabel', …)`. |
| `ToggleButton` dropped `className` — destructured to `_className` and discarded, so it never reached the DOM. | Fixed. `className` is now merged into the inner `Button` via `mergeProps(themeProps(…), className)`. |
| `ChatToolCalls` `defaultIsExpanded` JSDoc claimed "true for ≤3 calls, false for >3" while the implementation was an unconditional `?? false`. | Fixed. The doc comment now reads `@default false`, which matches the code. |

Because these were the only defects we ever patched, this repository now installs a stock
`@astryxdesign/core` with no `patchedDependencies` at all.

## Rules

- Never invent hexes. New color need goes through `astryx-theme.ts` + audit, not a one-off.
- Never override `--color-*` in app `:root`. Brand changes live in `astryx-theme.ts` via `defineTheme`, then `bun run theme:build`.
- Tokens for every value: `var(--color-*|--space-*|--radius-*)`. No raw hex or px in components.
- Component styling: props first, then theme `components` overrides in `astryx-theme.ts`. No per-app CSS wars.
- A chart mark takes a `--color-data-*` role token, never a `--dracula-*` primitive. The `chart-hues` / `chart-legend` / `data-bar` types reject anything else at compile time, and `bun run audit` tree-walks the chart modules. Values are byte-identical to the primitives, so this is vocabulary, not appearance. Scene ART is exempt and deliberately so: `SCENE_HUES` is a separate remit where purple is banned as a series identity but legitimate as pigment.
- `--dracula-comment` is legal on a **graphical** mark (3.36:1 clears WCAG 1.4.11) and illegal on **text** (fails 4.5:1). Any `fillOpacity` under 0.9 makes it worse. Text in a scene uses `--color-text-paragraph`.
- A `Layout height="fill"` needs `style={{height: '100dvh'}}` or it silently degrades to document scroll. `minHeight: '100%'` computes to 0 against an indefinite parent, so it is a no-op.
- Derive any count a page prints from its data. Hardcoded numerals are how `documentation.tsx` came to say "twenty-eight components" over 31 entries.
- A `.tsx` exports components only; shared data lives in a sibling `.ts`, so React Fast Refresh works.
- **Do not add your own Tooltip override.** Core's `useTooltip` paints `background-color: var(--color-text-primary)` with `color: var(--color-background-surface)` — an inversion that only reads correctly on a light theme, and on dark it is a near-white box with light-grey text. This theme already overrides it (`components.tooltip.base` in `astryx-theme.ts`, shipping as `.astryx-tooltip` in `theme.css`) onto the popover tier with `--shadow-low`, at 9.06:1. Core renders the Tooltip internally, so this reaches `Selector`, `TimeInput`, `Typeahead`, `CheckboxInput`, `CheckboxList`, `Tokenizer`, `DateRangeInput` and `Tooltip` whether or not you use one. If you are carrying your own `.astryx-tooltip` rule, it is computing the same two values and can be deleted.
- **A link is a destination; a button is an action.** If the thing navigates somewhere (`href`, a route, an anchor, a file) it is a `Link`. If it changes state in place — submit, save, delete, deactivate, disconnect, log out, request, toggle, expand — it is a `Button`. Rendering an action as `<Link href="#">` is the single most common way these templates went wrong: it draws a purple underlined affordance for something that is not navigation, and a screen reader announces "link" for a control that does not act like one. `SELF_HASH` placeholders are for genuine destinations only.
- **Underline rules, from W3C.** Links **inside running prose** (a sentence in a description, help text, legal copy) stay underlined, because that is the only persistent cue a reader has and colour alone fails WCAG 1.4.1 (F73). Links in **navigation** — a header, sidebar, tab list, breadcrumb, pagination, a rail of settings sections — are not underlined; the grouping and the current-item indicator carry that job. Anything ambiguous is prose, so underline it.
- **A divider is a section boundary, not a row background.** Use `Divider` to separate genuinely different groups, not between every field, every row of a list, or every setting inside one panel. A stack of rules reads as a form grid and flattens the hierarchy it was meant to express. Prefer `Stack gap` and, inside a panel, one divider at most; if two adjacent groups are only separated by a rule, they are one group.
- Spacing comes from the spacing scale via `Stack gap` or the kit's own layout props. Do not hand-tune `margin`/`padding` to make a panel look right — a panel that needs 20 rules to assemble is a panel that should be a `Stack`.

## Release checklist

Before tagging a release:

1. Pin versions: `@astryxdesign/core` / `@astryxdesign/cli` in `package.json` match the showcase and CI.
2. Nothing to refresh by hand: the version badges in `templates/product-tour.tsx` + `templates/centered-hero.tsx` (rendered text *and* XLE header) are gated against `package.json` by `bun run audit`, so bump the version and the audit tells you if you missed one.
3. Rebuild and gate: `bun run theme:build`, then `bun run theme:check`, then `bun run audit`, then `bunx react-doctor@latest` (must stay 100/100).
4. Counts in the docs are cited with the command that produces them, so there is nothing to refresh by hand. If you find a bare numeral, replace it with its command.
5. `npm publish` runs the same four gates itself via `prepublishOnly`, so a tree that fails cannot reach the registry. There is no publish workflow in CI — publishing is deliberately a human step.

### The toolchain

One tool per job, so nothing formats the same bytes twice:

- **`bun`** installs, runs scripts, typechecks (`bun check`) and formats (`bun fmt`). The format style
  lives in `bunfig.toml` — tabs, 100 columns, semicolons, double quotes.
- **Biome** still runs, but as the **linter** only (`bun run lint`); its formatter is off in
  `biome.json`. The lint rules are the part worth keeping: unused imports, non-null assertions,
  `!important`, import organisation.
- **Markdown is not formatted by either tool.** `bun fmt` restructures markdown — emphasis marks,
  list spacing, blockquote reflow — which is churn prose never had, so the `fmt` scripts name the
  code extensions explicitly.
- **The generated outputs are never formatted.** `theme.css`, `astryx-dracula.js`, the `.d.ts`
  files and `icons.mjs` are build products, compared byte-for-byte against a fresh build by
  `theme:check` and `icons:check`. A formatter that touches them breaks the freshness gate, so
  they are listed in `.gitignore` (they stay tracked, and npm's `files` array still ships them).
- **`bun build` needs `NODE_ENV=production`.** Bun 1.4.4 defaults the bundler to the
  *development* JSX runtime, so an unbundled build emitted `jsxDEV` and would have shipped
  React's dev build inside the package. `icons:build` sets it.
