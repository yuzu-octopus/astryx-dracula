---
name: astryx-dracula
description: Use when styling an Astryx React app with the shared Dracula brand, starting a new brand site, scaffolding a page from a template or XLE layout expression, migrating a codebase to the brand theme, or when UI styling looks inconsistent, text roles look wrong, status colors look off, text looks too small, hover states look wrong, or scrollbars clash across brand sites. Always use this skill whenever Dracula branding, Astryx templates, XLE, status vocabulary, or text roles come up, even if not explicitly requested.
---

# Astryx Dracula Brand

## Overview

One dark Dracula identity for every Astryx site. Dark-only, no light mode exists or is planned. Never invent a color, a token name, a font, or a radius. The reference implementation is the live showcase (Overview, Palette, Dashboard, Gallery, Quickstart, Templates) plus the dense bento page (`#/bento`): information-heavy, interlocking cards, zero wasted space. Match that density and hierarchy, not a generic SaaS-card kit.

## Reference files

- `references/xle.md` — layout expressions (XLE/XLO): when to use, workflow, node anatomy, example, brand pass.
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
bun add react react-dom @astryxdesign/core lucide-react astryx-dracula
bun add -d typescript vite @vitejs/plugin-react @astryxdesign/cli @types/react @types/react-dom
cp -r node_modules/astryx-dracula/fonts public/fonts
```

Entry file, in this order (reset, base, plain tokens, prebuilt theme):

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

Stock Vite config plus the layer-order snippet in USAGE.md. Verify every prop with `bunx astryx component <Name>` before use — never guess. Button `label` is REQUIRED, Heading `level` is REQUIRED, Grid `columns` is optional.

## Layout expressions

New page from scratch: write XLE, expand, then brand-pass. `bunx astryx layout check "<expr>"` validates; `bunx astryx layout expand "<expr>" ./path.tsx` emits TSX. Full grammar lives in the tool (`bunx astryx layout grammar`), details in `references/xle.md`. All 45 templates lead with their canonical XLE in a header comment (`// XLE (...)`); read that header first to inspect or adapt the layout at ~1/5th token cost instead of reading hundreds of lines of TSX. Expansion emits stock Astryx, so the brand pass in `references/xle.md` still applies after. Never hand-write full TSX first; never use XLE for small edits.

## Templates

Forty-five themed pages ship in `templates/`,
each leading with its canonical, validated XLE expression
in a header comment (`// XLE (...)`).
Also published as an Astryx integration pack (`astryx.integration.mjs`).
Consumers with the package in `astryx.config` scaffold
with `bunx astryx template <id> --package astryx-dracula`.
Live at `/astryx-dracula/#/templates` on the showcase,
where `demo/Templates.tsx` renders each page bare inside a viewer iframe
and keeps the `Templates / <name>` bar plus its `<Theme>` provider outside it.
That bar, the provider, and the frame are viewer chrome, not page content:
never copy them into a `templates/` file. Pack rules: templates import `@astryxdesign/core`, `lucide-react`, and the kit's own shared modules (`astryx-dracula/shared/*`: auth-copy, chaptered-doc, chart-hues, chart-labels, gallery-image, login-demo, metric-delta, revenue-chart, scene-castle, scene-tile, settings-rows, sparkline, sso-icons), no chart libraries; no default `React` import in 43 templates (JSX transform — 11 omit `react` entirely, the rest use named hook/type imports) — only `settings-dialog` and `table-grouped` carry a default `React` import for the `React.*` namespace (`React.ReactNode`, `React.useEffect`, `React.Fragment`); every template carries its `<id>.template.mjs` spec. IDs: dashboard, table-grouped, table-page, kanban-board, settings-sidebar, settings, payment-form, login-card, file-explorer, ai-chat-landing, library, centered-hero, ai-chat, classic-gallery, contact-form, dashboard-portfolio, detail-page, documentation, documentation-design, documentation-technical, editor, form-two-column, gallery-hero, ide, login, mixed-gallery, product-detail, product-gallery, product-tour, settings-dialog, shell-nav, shell-side-nav, shell-…

## Brand principles

These are decisions, not suggestions. Every one comes from the showcase that defines the brand.

1. **Dark is the brand, not a mode.** Every surface resolves to the Dracula ramp. No light tokens, no light-mode branches, no `prefers-color-scheme` forks. A component that looks wrong dark is a wrong token, never a missing light theme.
2. **Purple means tappable.** Links, titles, and primary actions are purple; visited falls back to text, hover resolves to foreground plus underline. Users learn this in seconds. Nothing decorative is purple.
3. **Status has a fixed vocabulary.** Green positive, red negative, yellow tags and warning states, cyan info, pink flair, orange attention and constants (Orange never carries warning: `--color-warning` ships Yellow `#F1FA8C`, both in the theme and behind `StatusDot variant="warning"`). Status surfaces use 10% categorical washes with semantic borders, never direct fills. Text on fills is always `#21222C`. In-progress/activity is `StatusDot variant="info"` (cyan) with `isPulsing`; the purple `accent` StatusDot is never a status — purple means tappable, no exceptions. Info states are always cyan, never blue: blue tendency goes to comment (categorical charts) and blue Badge/Token variants are not status vocabulary.
4. **Mono everywhere, on purpose.** JetBrains Mono for body, heading, and code alike. One family, clearly distinct from every sans-serif product. Copy `fonts/` to served `public/fonts/`; monospace fallback means the copy step was skipped.
5. **Dense, not cramped.** The bento reference packs 12 cells with zero dead space: hero strip with live stats, wide chart, tall table spanning two rows, palette strip, type specimen, install command. Size equals importance (hero 2x, feature wide, metrics small). Information-heavy beats airy on every brand surface.
6. **Hierarchy is two-tier.** Section headers pair `Heading level={2}` with `Text type="body"`. Widget headers pair `Heading level={3}` with `Text type="supporting"`. Never two same-size tiers stacked, never a subtitle larger than its heading.
7. **Flat and crisp.** 5px radii on elements, 4px inner. No pills, no circles except dots and avatars, no soft grey shadows. Depth comes from borders (`--color-separator`, `--color-widget-content-border`), not elevation.
8. **Motion answers action.** Hover dims, press dims more, focus rings accent. No entrance choreography, no card hover lifts, no decorative animation.

## Typography doctrine

The theme scale is base 14, ratio 1.2: body and code 14, supporting 12, headings 24 / 20 / 17 / 14 / 12 / 10 by level. Roles, not raw sizes (the compat `--font-size-h*` pins read 24 / 20 / 16 / 14 / 13 / 12; `Heading` resolves the scale roles, so level 3 is the 17px `lg` step):

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
Map jobs to components, never to lookalikes: action goes to Button (never a nav-item class), navigation goes to SideNav or Link, count goes to Badge, status goes to StatusDot or Banner, label goes to Text type="label".

## State doctrine

- **Hover dims, never inverts.** Interactive surfaces darken 12% on hover, 20% on press, via the theme overlay tokens. A hover that goes transparent, dark-navy, or accent-colored means something overrode `--color-overlay-hover`.
- **Focus is accent.** 2px accent ring, beat Functional Purple on contrast. Never remove it.
- **Links underline always**, resolve to foreground on hover. Inline links inherit the surrounding text size; a link that renders larger than its sentence is the fixed external icon at small sizes, drop `isExternalLink` and keep `target="_blank"`.
- **Table rows lift on hover.** Scrollbars are Dracula (Current Line thumb, Purple hover) via `tokens.css`. A visible scrollbar on a comfortable table means a redundant `overflowX` wrapper fighting Table's own scroll container; delete yours. A document-level scrollbar on a `height="fill"` page means no definite-height ancestor (`height: 100%` resolves to content height); wrap the page in a `height: 100dvh` ancestor instead of styling the scrollbar.

## Migrating a codebase

1. Inventory: grep for `#[0-9a-fA-F]{3,6}`, `:root`, `@apply`, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to the Exact list below; anything unmappable is a brand question, not a new hex.
3. Replace: delete old theme provider and `:root` overrides, point entry imports at the kit block above, swap raw elements for Card/Text/Link/Stack/Grid, assign each text node its role per the typography doctrine.
4. Verify: `bun run build`, screenshot key pages at 1568, 768, and 390, confirm no raw hex remains (`grep -ri '#[0-9a-f]\{3,6\}' src --include='*.tsx' --include='*.css'` should show only kit references), confirm no page-level horizontal overflow at 390.

## Exact token names (use these verbatim)

200 source keys in `astryx-theme.ts` (281 unique custom properties in the
prebuilt `theme.css` across 319 declaration lines incl. scoped repeats =
278 public + 3 private `--_*-radius` aliases; `tokens.css` is a full
plain-CSS mirror, 289 `:root` vars, unlayered by design so it beats core
layers with zero `!important`). No gate asserts these counts;
`bun run theme:check` asserts freshness, `bun run audit`
asserts palette purity and contrast floors.

Core roles `--color-background`, `--color-primary`, `--color-positive`,
`--color-negative`, `--color-accent`, `--color-success`, `--color-error`,
`--color-warning` (warning ships Dracula Yellow `#F1FA8C`; Orange `#FFB86C`
is attention/constants only), `--color-info`, `--color-neutral`.
Text `--color-text-primary` / `--color-text-secondary` /
`--color-text-disabled` / `--color-text-accent` /
`--color-text-highlight` (same as primary) /
`--color-text-paragraph` / `--color-text-base` /
`--color-text-base-muted` (never `--color-text-subdue`: chrome only, never
text).
Icon `--color-icon-primary` / `--color-icon-secondary` /
`--color-icon-disabled` / `--color-icon-accent`.
Border `--color-border` / `--color-border-emphasized`; flat-crisp shadow hue
`--color-shadow` (`#21222C`, not Stone's cold blue); hover-tint bases
`--color-tint-hover` / `--color-on-dark` (white, dark-mode side) /
`--color-on-light` (black).
Radius `--radius-element` / `--radius-inner` / `--radius-container` /
`--radius-page` / `--radius-chat` (5px everywhere — chat bubbles read as
widgets, not pills) / `--border-radius` (legacy alias, same 5px).
Spacing `--space-gap` / `--space-viewport` / `--widget-content-vertical` /
`--widget-content-horizontal` / `--widget-gap` / `--tile-row`.
Raw primitives: `--dracula-bg`, `--dracula-fg`, `--dracula-comment`,
`--dracula-purple`, `--dracula-green`, `--dracula-red`, `--dracula-yellow`,
`--dracula-cyan`, `--dracula-pink`, `--dracula-orange`,
`--dracula-current-line`, plus `--dracula-selection`, `--dracula-bg-light`,
`--dracula-bg-lighter`, `--dracula-bg-dark`, and
`--dracula-functional-<red|orange|green|cyan|purple>` (9 extra Dracula vars
for UI/palette completeness).
Glance widget/text vars: `--color-widget-background`,
`--color-widget-content-border`, `--color-widget-background-highlight`,
`--color-separator`, `--color-popover-background`, `--color-popover-border`,
`--color-progress-border`, `--color-progress-value`,
`--color-vertical-progress-value`, `--color-graph-gridlines`,
`--color-widget-shadow`, `--color-current-line`, `--color-selection`.
Surface tiers: `--color-background-body` (page), `--color-background-surface`
and `--color-background-card` (chrome/cards), `--color-background-popover`
(floaters), `--color-background-muted` (quiet edges). Never use
`variant="section"` for a band: see `references/visual.md` Surfaces.
Overlays `--color-overlay` / `--color-overlay-hover` /
`--color-overlay-pressed`. On-fill text `--color-on-<accent|success|warning|error|info>`
(always `#21222C`; the spec never uses raw black). Muted scopes
`--color-<accent|success|warning|error|info>-muted` (each an alias of its
10% categorical wash). State tints `--color-background-<blue|cyan|gray|green|orange|pink|purple|red|teal|yellow>`
(10% washes) with matching `--color-border-<...>` (30%), `--color-icon-<...>`
and `--color-text-<...>` accents. Spec fills `--color-functional-<red|orange|green|cyan|purple>`
(token-compat pins for spec parity; shipped components consume the accent
ring instead — never encode status in these). Tag accents
`--color-tag-<orange|pink|cyan|yellow|green|blue>` (blue reads Purple:
purple means tappable, never data). Inverted surfaces
`--color-background-inverted` (`#F8F8F2`) /
`--color-background-error-inverted` (`#FFD5CC`, pale error surface the spec
palette does not supply; consumed by the error Toast). Skeleton/track
`--color-skeleton` / `--color-track`.
Charts: `--color-data-categorical-<blue|orange|purple|green|pink|cyan|red|teal|brown|indigo>`
(blue goes comment; teal ANSI bright cyan `#A4FFFF`, indigo ANSI bright blue
`#D6ACFF`, brown reuses orange), `--color-data-neutral` (`#8C939B`, Stone gray
reads fine on dark — deliberate), and 45 sequential ramps
`--color-data-<purple|pink|red|orange|yellow|teal|blue|shamrock|gray>-<1-5>`
(lightness 28/44/60/74/88, constant hue/saturation per family).
Type `--font-family-mono` (+ `--font-family-<body|heading|code>` aliases),
`--font-size-base` / `--font-size-h1` … `--font-size-h6` (compat pins h1 24 /
h2 20 / h3 16 / h4 14 / h5 13 / h6 12; `Heading` resolves the 14-base 1.2
scale roles instead) plus the full `--font-size-<4xs…5xl>` scale and
`--text-<body|large|label|code|supporting|display-1…3|heading-1…6>-<size|weight|leading>`
roles (label pins semibold — only 400 + 600 faces ship, never restore
medium), motion `--duration-<fast|medium|slow>(-min|-max)?` + `--ease-standard`
(core defaults), shadows `--shadow-<low|med|high>` /
`--shadow-inset-<hover|selected|success|warning|error>` (selected Purple 30%).
Nothing else exists. For Astryx tokens beyond the kit, `bunx astryx docs tokens`.

## Precedence (binding)

When sources conflict: 1) visual common sense — if the spec letter looks
wrong on dark, keep the better-looking choice; 2) this skill plus
`references/visual.md` plus `BRAND.md` (purple=tappable, status vocabulary,
hierarchy, flat-crisp); 3) dracula-ui conventions (on-fill text `#21222C`,
accent-underlined links resolving to foreground on hover, status through
muted-token washes with semantic borders, no direct fills); 4) the spec
letter last. Known deltas kept under this rule: warning ships Yellow (brand
choice, see principle 3), syntax keeps the official-editor mapping over
dracula-ui brights (constants Purple, attributes Green, no regexp split —
see the `draculaSyntax` comment in `astryx-theme.ts`), and
secondary/paragraph/base-muted are same-hue AA lifts of Comment (see
`tokens.css` header). Record any new visual-over-spec deviation in a code
comment at the site of the choice.
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
- A route you would not screenshot for the org

## Troubleshooting

- Unstyled components → entry is missing `reset.css` or `astryx.css`, or import order is wrong.
- Monospace fallback → `fonts/` not copied to served `public/fonts/`.
- Wrong colors after theme edit → rebuild: `bun run theme:build`, or `bun run theme:check` to confirm staleness (it ignores `astryx-dracula.js` by design — that file is a build artifact, not a freshness signal).
- Old `:root` `--color-*` overrides still winning → delete them; brand lives in the kit theme.
- Carousel keeps core's layered `scrollbar-width: none` (intentional hiding, not theming) — the only `scrollbar-width` in the stack; never add another.

## Common Mistakes

- Raw hex/px or invented names (`--color-bg`, `--space-lg`) → Exact list or component prop.
- Raw `<div>`/`<span>`/`<a>` → Card/Text/Link/Stack/Grid.
- Purple StatusDot for a status, or a blue Badge/Token for info → `info` + `isPulsing` for in-progress, cyan for info, yellow for tags.
- Section subtitle in `supporting` → `body`. Widget caption in `body` → `supporting`.
- Mixed Card insets (2 vs 3) → outer 4, nested 3.
- EmptyState icon without `color="secondary"` → `Icon` defaults to `inherit`, so the icon tints with surrounding text; always pass `color="secondary"` explicitly.
## Heading ladder

Exactly one h1 per routed page at runtime, sections at h2, cards at h3. Structural exceptions, decided once:

- **Dialogs are page fragments.** `DialogHeader` renders `Heading level={2}` with `tabIndex={-1}` by core API (verified in `@astryxdesign/core` `DialogHeader.tsx`: title takes focus on open and names the dialog via `aria-labelledby`; there is no title-as-h1 prop, by design — the host page owns the h1). Never hack an h1 into a dialog template; panel labels inside dialogs are `Text type="label"`, never Headings.
- **Skeleton shells are exempt.** The shell-nav/shell-side-nav/shell-top-nav placeholder cards carry no headings by construction; routed pages supply the h1. Their XLE headers record this with a `skeleton-shell exemption` note instead of an Hd node.
- **Conditional branches render one h1.** Multi-state templates (`login-sso` steps, `editor` mobile/desktop titles) carry several `level={1}` call sites but render exactly one at a time — verify at runtime, not by grep.
- **Shared-module h1.** `product-tour` and `tech-report` carry no `level={1}` call site of their own; their h1 renders from the shared `ChapteredDoc` module (`ChapteredDoc` hero `Heading level={1}` per active chapter).
- Tool-chrome pages with no visible title (file-explorer, ide) use a visually-hidden h1 so the outline survives.
