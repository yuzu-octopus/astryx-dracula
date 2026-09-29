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
- `references/semantics.md` — binding rules for link vs button, the underline, divider density, and spacing, each cited to the template that obeys it.

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
never copy them into a `templates/` file. Pack rules: templates import `@astryxdesign/core`, `lucide-react`, and the kit's own shared modules (`astryx-dracula/shared/*`: auth-copy, auth-chrome-config, chaptered-doc, chaptered-doc-config, chart-hues, chart-labels, chart-panel-style, gallery-image, login-demo, metric-delta, revenue-chart, scene-castle, scene-hues, scene-tile, settings-data, settings-rows, sparkline, sso-icons), no chart libraries; no default `React` import in 43 templates (JSX transform — 11 omit `react` entirely, the rest use named hook/type imports) — only `settings-dialog` and `table-grouped` carry a default `React` import for the `React.*` namespace (`React.ReactNode`, `React.useEffect`, `React.Fragment`); every template carries its `<id>.template.mjs` spec. IDs: dashboard, table-grouped, table-page, kanban-board, settings-sidebar, settings, payment-form, login-card, file-explorer, ai-chat-landing, library, centered-hero, ai-chat, classic-gallery, contact-form, dashboard-portfolio, detail-page, documentation, documentation-design, documentation-technical, editor, form-two-column, gallery-hero, ide, login, mixed-gallery, product-detail, product-gallery, product-tour, settings-dialog, shell-nav, shell-side-nav, shell-…

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

Type carries hierarchy, so weight stays quiet: headings normal, `semibold` for emphasis and KPI values, never bold display type. Tabular numerals on every quantity (`hasTabularNumbers`). When in doubt go one role larger, never smaller — the reason is **thin weights, not x-height**: Apple's rule is "if you use a custom font with a thin weight, aim for larger than the recommended sizes", and we ship JetBrains Mono at `weightClass 400` (Regular). An earlier version of this line claimed JBM "has a small x-height"; measured from our shipped woff2 with fontTools, `sxHeight/upem` = **0.5500** against Inter 0.5459 and Roboto 0.5283 — the **highest** of the three, cap-height 0.7300 also highest. The instruction stands; the premise was false and is removed.

## Control semantics (binding when authoring or reviewing a template)

Four rules decide what a control **is**, where a rule belongs, and where a
number comes from: a destination is a `Link` and an action is a `Button`
(`SELF_HASH` stands in for a real destination only, never for "Create",
"Delete", "Disconnect", "Log out", "Deactivate" or "Request"); the underline
follows context, `hasUnderline` in running prose and nothing in navigation
(header, sidebar, tab list, breadcrumb, pagination, settings rail, card header,
table row label), with anything ambiguous treated as prose because colour alone
fails WCAG 1.4.1 / F73; a divider marks a group boundary rather than a row
background, one at most inside a panel; and spacing comes from `Stack gap` or
a kit layout prop, never a tuned pixel. `references/semantics.md` carries the
detail and the citations.

**The 45 templates in `templates/` are the reference implementations.** Each
rule there is cited to a real file and line in this repo, so a rule with an
exemplar can be checked and a rule without one cannot. Before writing a new
template, read the closest existing one and copy its answer; do not invent a
pattern the tree already settles. `shared/settings-rows.tsx` is the pattern
worth copying most often: it states the link-vs-button decision as a typed
`actionKind` field in the data and branches on it once, so the same label
cannot drift between templates.

## Evidence doctrine

**A rule or capability stated from the evidence in front of you, rather than tested against every surface it will reach, is the recurring failure — and it is always a correct-sounding sentence that stops being true one scope out.** A doc that names a capability the API does not have is worse than a doc that says nothing, because it reads as verification. Three limbs, each with a checkable form:

1. **Name the command and its expected output.** `bunx astryx component GridSpan --detail full` settles a capability question in one call. A capability sentence with a reproducible check behind it cannot drift the way prose can. Related tell: `bunx astryx component <Name>` returning **keyword suggestions instead of a component reliably means that component does not exist**.
2. **Name what CLASSIFIES a site into the rule — and a site that fits but belongs to another class stays put.** The classifier is a property of the **site**, never of the string it contains. Every WCAG criterion governing a visual rule ships its own classifier inline: 2.5.8 enumerates five named exceptions including Inline, 1.4.11 states 3:1, and 1.4.8 Note 1 says the requirement is a *mechanism*, not the stated value. So this is principle, not house style.
3. **For a state a substrate owns, name who owns it.** This one is not fixable by prose — no wording reaches a pixel the substrate sets inline. Upstream sets both precedents: the Dracula spec gates Functional Colors with "Do not use in editor or terminal applications" (a rule naming its consuming layer, `spec.mdx:131`), and `dracula/vim/colors/dracula_base.vim:28-30` bails unless termguicolors/GUI/256-colour, with `:233` branching the same token between a background fill and none (a rule whose delivery is substrate-conditional, authored in code).

**The check that passes when it should fail, because it is the hardest instance to argue with.** Renaming a declaration while leaving its call sites is invisible to a presence check. In this repo `rg -c "loginFailed" file` returning `2` was read as "correctly retained" when the declaration had just been renamed — a false PASS, in a file we owned, on the change we had just made. **"Does this string exist?" and "is this identifier in scope?" are different questions, and only the second is a build-safety check.** A grep returning non-zero is not a result; it is a prompt to read it against what it is counting.

**A declared token is not an applied token.** Until core+CLI 0.6.3,
`--text-display-2-size` was defined in this theme and applied by nothing:
core 0.3.0's `Heading` emitted no `data-type`, and the 0.3.0 CLI emitted no
`.astryx-heading[data-type]` rule. **24 templates asked for `type="display-2"`
and every one rendered at core's 24px level-1 default instead of the 35px they
declared.** It looked right, it was right in light mode, no build failed, no
review caught it, and three consumers did not notice — only a pixel diff
between two builds found it. Every other gate checks that a value is *correct*;
this one checks it can *reach* the element at all, which is the failure mode
that passes every other check. `bun run audit` now fails if any `display-N`
this repo consumes lacks a matching `[data-type]` rule in `theme.css`. So
before you trust a size, check it is applied, not just declared.

**A rule stated in prose is a request; a rule stated in the type is a compiler error.** This repo's colour rules are the worked example: `shared/chart-hues.ts` exports a `ChartHue` union, and `shared/scene-hues.ts` enforces "purple never touches these scenes" with a `SCENE_HUES` union typed at every hop, so a hand-rolled array fails the build instead of a review. When a rule keeps failing review, move it into a type before writing it down again.

**Then widen the type until it catches what is already wrong, not only what you imagined.** The `ChartHue` union was already there and still let ten violations through, because eight demo `DataBar`s passed `color: string` to a prop typed `string`, and the legend accepted `(string & {})`. Widening those to `` ChartHue | `var(--color-data-${string})` `` turned all ten into compile errors on the spot. A type that only admits the right values by convention is decoration; a type that rejects the wrong values you actually shipped is enforcement. **Then measure the damage before shipping it** — a type change is a breaking change for consumers, and the honest cost of a stricter union is stated, not assumed.

**A name that contradicts its own value is invisible to every threshold, so it needs a ruling rather than a gate.** `--color-tag-blue` held spec Purple and no contrast check could see it, because the number was never wrong — only the label was. The same shape retired `--color-border-emphasized`: the value passed the gate it had (1.5) while failing the floor the token is actually held to (3:1), so the fix was to move the **gate** to the real criterion and then move the value, not to argue about the value alone. When auditing a token, ask both questions: *is this number right?* and *is this the question we should be asking?*

**Cite a count with the command that produces it, never from a research artifact.** A findings file's narrative is argued from sources and decays slowly; its tally is counted from a tree that keeps moving. Three successive h1 counts (38, 30, 29) came out of one findings file. Say the number, name the command. And cite **full paths** — `F1.md` collides across five research slices and `F5.md` across two.

## Layout doctrine

1. **Frame first.** Pick the shell (AppShell, TopNav) and budget regions before content. Full page goes in AppShell; sidebar nav means SideNav.
2. **Bento for showcases, rows for data.** Marketing and overview surfaces interlock: hero strip, wide feature (span 2), tall table (row span 2), metric cells. Spans go through `<GridSpan>`, a core component: `<GridSpan columns={2}>`, `columns="full"` for a whole row, `rows={2}` for a row span. **An earlier version of this line said "Astryx Grid has no span prop" and routed spans through `style={{ gridColumn: 'span 2' }}` — that was false.** Verified in `core/src/Grid/GridSpan.tsx`, exported from `@astryxdesign/core/Grid`; confirm with `bunx astryx component GridSpan --detail full`. Dense data stays rows: Table edge-to-edge, never Card-wrapped list items.
3. **Cards are widgets.** Dashboard widgets, galleries, settings groups, showcase cells. Outer padding 4, nested inset 3, everywhere, no exceptions. A padding-2 inset next to a padding-3 inset is a defect.
4. **No raw layout elements.** No `<div>`, `<span>`, or `<a>` for layout or text. Card, Text, Link, Stack, Grid do all of it.
The `sm` Button stays in dense contexts with a caption; CTAs stay default size.
Map jobs to components, never to lookalikes: action goes to Button (never a nav-item class), navigation goes to SideNav or Link, count goes to Badge, status goes to StatusDot or Banner, label goes to Text type="label".
5. **Touch targets are floored, and the two tiers are different criteria.** WCAG AA (2.5.8 Target Size (Minimum)) requires **24x24 CSS px**; WCAG AAA (2.5.5 Target Size (Enhanced)) requires 44x44. The familiar 44–48 figures are **Apple/Material/UWP platform guidelines, not the standard** — do not conflate them. Our rule: 24px minimum, 44px where touch matters, and W3C backs the two-tier shape — 2.5.8's own Understanding says "For important links/controls, consider aiming for the stricter 2.5.5", while AAA "is not recommended... as a general policy for entire sites". Two consequences worth stating because they settle most of the surface: our 36–44px table rows **pass 2.5.8 on size outright** and never need the Spacing exception, and an inline link inside a paragraph may be smaller than 24px because 2.5.8 enumerates Inline as a named exception. The `sm` Button's rendered height has **never been measured** — treat it as unmeasured, not as passing.

6. **A `fill` Layout needs a definite ancestor, and `100dvh` is the only one
   that works.** `Layout height="fill"` is `height: 100%` (`Layout.tsx:58-63`),
   which resolves against its parent's *definite* height; against a
   content-sized host it resolves to `auto`, the Layout grows, and the document
   scrolls — a `fill` page silently degrading to document scroll in a
   consumer's app. Anchor it with `style={{height: '100dvh'}}` **on the Layout**,
   never `minHeight: '100%'`: a percentage min-height resolves against the
   containing block's definite height and computes to **0** when that is
   indefinite (CSS 2.1 §10.5), so it is a no-op that looks like a fix. Every
   working instance in the kit uses viewport units, which are absolute and need
   no ancestor: `editor.tsx:302`, `file-explorer.tsx:265`,
   `messaging-shell.tsx:67`, `ai-chat.tsx:64`, `kanban-board.tsx:704`. Anchor a
   **shared** module once, not once per caller — `shared/order-desk.tsx` is used
   by three templates and three `100dvh` boxes would stack. Do **not** apply it
   to a page already inside an `AppShell` (`shell-nav`, `shell-side-nav`):
   `AppShell` is already `100dvh`, and a second one overflows by the header
   height, converting a soft failure into a hard one. The definite height is
   also not a cost to argue about: `LayoutContent` is `overflow: auto`
   (`LayoutContent.tsx:36-39`), so a definite ancestor makes the content pane
   **scroll** rather than clip. There is no shape that gives a `fill` Layout a
   definite ancestor without a scroller — that is what `fill` means.
7. **A count a template prints must be derived, never written.** Hardcoded
   numerals drift the moment data changes, and the failure is a page lying about
   its own size. `templates/documentation.tsx` shipped a hero reading
   "twenty-eight components" against **31** entries while its XLE header said
   `15 spells` for a category of **18**. Both now read `COMPONENT_CATEGORIES`:
   the prose takes `COMPONENT_TOTAL`, each shelf takes `category.items.length`.
   The same reasoning drives the XLE `*N` assertions — in 45 templates the
   **array** drifted twice and the **header** never once, so the header is the
   tiebreak when the two disagree.
8. **Components and constants live in different files.** A `.tsx` that exports
   both breaks React Fast Refresh: editing a constant remounts the whole module
   instead of hot-updating. `react-doctor/only-export-components` gates it and
   the kit is at **100/100**. The shape is uniform: components stay in the
   `.tsx`, data moves to a sibling `.ts` that the component imports —
   `scene-hues.ts`, `chart-hues.ts`, `settings-data.ts`,
   `chaptered-doc-config.ts`, `auth-chrome-config.ts`, `chart-panel-style.ts`.
   This is not architecture for its own sake: a *type* is the stronger version of
   the same idea (limb 3 below), and a *split file* is what you reach for when
   the data is genuinely shared and the rule cannot be expressed as a type.

## Contrast non-claim: the inset ring ships failing 1.4.11

`--shadow-inset-hover` is Comment `#6272A4`. Its **ceiling** over the surface tier `#343746` is **2.51:1**, and WCAG 1.4.11 requires 3:1 — so it cannot reach the threshold at **any** alpha, including 100%. This is not "fails at the alphas we ship"; it is unreachable. `--shadow-inset-selected` is Purple, ceiling 4.89:1, and reaches 3:1 only at **65.7% alpha**, which is a heavy outline rather than a subtle affordance. Both values are `0x30` = **18.82%**, not the 30% an earlier version of this file claimed; the wash spine is a different family at `0x1A` = 10.2% and `0x4D` = 30.2%, and those two figures are correct. `scripts/check.ts` prints this gap in its own output — **passing that gate does not mean the ring is accessible.**

**Both the wash and the ring are subject to 1.4.11.** Its first prong reads "user interface components **and states**", so a state wash is not exempt for not being a graphical object. Do not find a wash and conclude it is exempt.

**Reachability is per-property, not per-element.** Core assigns `el.style.backgroundColor` on selected table rows (2 sites, `useTableSelection.tsx`) and `style.boxShadow` **nowhere** (`grep -rn "style.boxShadow" node_modules/@astryxdesign/core/src` → 0). A ring therefore paints over core's background; a wash does not. The boundary is exactly this: **a kit wash on a selected table row is unreachable**, exits being `!important` (banned by our own gate) or a core change (deferred by the version ruling). Nothing else is blocked, and stating it per-property stops a future agent avoiding `box-shadow` out of an over-generalised fear. The selected state itself needs no new rule — the human ruled to keep the existing brand-correct Purple wash.

## The h1 is bound per surface class

The page `h1` takes **one value per surface class**, and the classifier is a property of the **site**, never of the string it contains.

- **The heading IS the page's own title or document's own title** → `--text-display-2-size` (35px). Covers a marketing hero and a utility page's `LayoutHeader` alike: `side-gallery.tsx:80`, `classic-gallery.tsx:91`, `mixed-gallery.tsx:64`, `settings.tsx:101`.
- **A routed record or section inside a page that also carries other controls** → stays at `--text-heading-1-size` (24px). Covers `detail-page.tsx:220` and the ten section titles in `settings-sidebar.tsx`.

**A string that fits is not the question.** `detail-page.tsx:220` is `#1001` — five characters, about 105px wide at 35px — and it is still correct at 24px, because the surface classifies it, not the length. Phrasing this rule as "a heading short enough to fit at the smaller size" reintroduces exactly the bug it fixes. Before this was bound the same job rendered at 24px, 35px and 42px across the template set; of 52 h1 sites, **29 change, 12 were already correct, 11 stay at 24px** — reproduce with `rg -c 'Heading level=\{1\}' templates/*.tsx demo/*.tsx` and read each site's container, never just the count. **Do not write "majority" or "most templates"**: 24px is the plurality at 38/52, and 35px is the majority only among sites that explicitly typed their h1.

**Keep the two dense-panel exceptions apart, because only one is a defect.** `detail-page.tsx`'s ladder is complete (1 h1 / 3 h2 / 3 h3) and correctly sized. `settings-sidebar.tsx`'s has a **gap** (10 h1 / 0 h2 / 13 h3) and is mis-built — that is the one to fix. Folding them together as "the two dense-panel exceptions" would invite a future agent to "fix" the correct one.

`--text-display-1-size` (42px) reaches **zero consumers** and `theme.css` ships no `.size-5xl` escape hatch, so 42px has no raw-size route. Whether to drop it or keep it GOV.UK-style for exceptional circumstances is **an open question, deliberately not answered here** — it is one decision ("is 42px reachable at all"), not two. `--text-display-3-size` (29px) is the KPI-numeral role and is never a heading.

## What `check.ts` actually gates — and what it does not

`bun run audit` runs 38 gate checks (`grep -c "fail(" scripts/check.ts`). That
count is every `fail(` call site, not a tally of distinct gates, so treat it as
an upper bound. Be precise about their reach either way, because a reader who
over-trusts a gate file ships a defect it never claimed to catch.

**It does gate:** palette purity, 28 contrast pairs (`sed -n '/^const pairs/,/^];/p' scripts/check.ts | grep -c "^  \['"`), a lint over template source
for three literal string rules — `variant="section"`, `weight="bold"`, and
`<Layout>` without an explicit height — plus the zero-`!important` sweep over
CSS sources and TSX (skipping the one line in `tokens.css` that states the rule
in prose), plus a **two-directional gate that `package.json` `exports` agrees
with `shared/`**.

That last one is worth knowing why it exists. The map is hand-maintained, so it
drifts silently in both directions, and each direction has a different blast
radius. A **deleted** module leaves an entry pointing at a file that no longer
exists *and still ships*, because `files` globs `shared/` independently of
`exports` — that is exactly how `shared/heat-scale.ts` survived its own
deletion and stayed published. A **new** module with no entry fails only in a
*consumer's* `tsc`, never in ours, so the breakage lands on someone else and
costs a bug report. The second direction is the expensive one.

Compare keys **extensionless on both sides**: `exports` keys are specifiers
(`./shared/scene-hues`), so comparing them to filenames reports every module as
unexported. And do not put a dot in a config module's name —
`chaptered-doc.config` does not resolve, because TypeScript's bundler
resolution reads the trailing `.config` as a file extension. It is
`chaptered-doc-config`.

It also gates the semantics rules in `references/semantics.md`, each scoped
narrowly on purpose: a sweep for hand-rolled `text-decoration` across
`astryx-theme.ts`, `tokens.css` and every authored source file, with comments
blanked so a comment stating the rule is exempt; a `<Link>` whose literal
label starts with one of the verbs in `ACTION_VERBS`, where `hasUnderline`
downgrades a hard fail to a REVIEW rather than silencing it and
`ACTION_LINK_ALLOW` (keyed `file:line`) is the one human-ruling escape hatch;
and a per-file `Divider` count failing above `DIVIDER_DENSITY_MAX = 6`, a
number read off the tree rather than off taste: 43 across it, max 4 in any one
file. Find them with `rg -n 'ACTION_VERBS|ACTION_LINK_ALLOW|DIVIDER_DENSITY_MAX' scripts/check.ts`.

**It does NOT gate, and you must check these yourself:**

| Not gated | Why it matters | Check it with |
|---|---|---|
| **Raw hex in template source** | One off-palette hex ships with every gate green | `grep -ri '#[0-9a-f]\{3,6\}' templates shared demo --include='*.tsx' --include='*.css'` |
| **`--color-text-subdue` as a foreground** | `#4C5067` is **1.80:1** on body and **1.49:1** on the widget surface — below the 1.5 floor `check.ts` itself pins for that token, so the value would fail if it were ever used as text. It is chrome-only, and nothing enforces that | `grep -rn 'color: var(--color-text-subdue)' templates shared demo` |
| **`weight="medium"`** | The operative rule is that neither `medium` nor `bold` may be used, since only 400 and 600 faces ship. The gate covers `bold` only. The token existing is precisely why the template must not reach for it | `rg -n 'weight="(medium|bold)"' templates demo shared` |
| **The rendered underline** | The sweep matches the `text-decoration` property in authored source, not the rendered result, so a link that is underlined because some other token changed passes it | render it, or `rg -n 'text-?decoration' templates shared demo astryx-theme.ts tokens.css` |
| **An action drawn as `<a>` instead of `<Link>`** | The verb gate walks `<Link` openings only, so the same action in a raw anchor is invisible to it. A raw anchor already breaks the no-raw-elements rule, which is why the two are separate limits | `rg -n '<a ' templates shared demo` |
| **A label behind `{…}`** | Verb matching is literal text, because guessing at a computed label is how a gate starts failing on sites it cannot read | read the site |

**Divider density is a smell threshold, not a judgement about boundaries.** Six
per file is chosen to sit above every site we ship so the gate is green on day
one; four dividers in one settings panel, each between two groups that are
genuinely different, passes while still reading as a form grid. The rule in
`references/semantics.md` §3, not the gate, is what decides whether a boundary
is real.

The `!important` sweep has one exemption by design: `tokens.css` contains that literal inside the comment that states the rule, and a gate that fails on the documentation of the rule it enforces gets disabled on day one and then protects nothing.

## Core state hooks: the mechanism exists, adoption is the gap

**Core does emit `data-*` state hooks — a source grep cannot see it, and that is the trap.** `themeProps()` reflects *every* visual prop onto the element as a kebab-cased `data-*` attribute with **no allowlist** (`core/src/utils/themeProps.ts`, `themeDataAttributes` → `toDataAttributeName`), so `state: 'expanded'` becomes `data-state="expanded"`. Two greps both mislead here and both were reported as fact before being checked: `grep -rn "data-state" node_modules/@astryxdesign/core/src` returns only a *comment* in `DateInput.tsx:677` saying the attribute is not there, and `grep -o "data-state" core/dist/astryx.umd.js` returns nothing because the name is **built at runtime** and minified away. Verify with `bunx astryx component DateInput --detail`.

The real gap is **adoption, not capability**: of 270 `themeProps(` call sites, 7 pass a `state` key. So the honest sentence is *core ships the mechanism and uses `state` at 7 of 270 sites* — not *core emits zero state attributes*, which was wrong and is retired. Two related facts, both measured: `aria-selected` **is** emitted on selected table rows (`useTableSelection.tsx:130`), so "no state attributes anywhere" was false on its face; and `data-custom` (x10) appears only in `.test.tsx` fixtures, never as a shipped prop. **Check the API, not the string** — this is limb 1 of the evidence doctrine, and it is why `data-custom` being test-only is a distinction worth carrying.

When you need a kit rule to survive review, type it: `shared/chart-hues.ts` exports a `ChartHue` union and `shared/scene-hues.ts` enforces its own "purple never touches these scenes" remit with a `SCENE_HUES` union **typed at every hop**, so a hand-rolled array fails the build instead of a reviewer. That is why purple, a value CoreInvertedPairAudit and the joint bucket both flagged, now surfaces as a compiler error rather than a finding.

## Prose measure: 75 characters, voluntary

Long-form reading copy is capped at `max-width: 75ch`, which is **630px at 14px JetBrains Mono**. Measured, not recalled: fontTools on the shipped woff2 gives upem 1000 and an advance of exactly `0.600em` for `0 i l . space M`, so a character is 8.4px at 14px. Our previous `maxWidth={680}` was **81.0 characters** and 720 was **85.7** — both past W3C's 80-character ceiling. `shared/chaptered-doc.tsx` uses it.

**This is voluntary best practice, not conformance, and the skill must not imply otherwise.** SC 1.4.8 is **Level AAA** and its Note 1 says "Content is not required to use these values. The requirement is that a mechanism is available for users to change these presentation aspects." A doc that keeps the number and drops the mechanism has stated a value where the standard stated a scope.
## State doctrine

- **Hover dims, never inverts.** Interactive surfaces darken 12% on hover, 20% on press, via the theme overlay tokens. A hover that goes transparent, dark-navy, or accent-colored means something overrode `--color-overlay-hover`.
- **Focus is accent.** 2px accent ring, beat Functional Purple on contrast. Never remove it.
- **The underline follows the context.** Prose links pass `hasUnderline`; navigation links pass nothing and take core's hover-only underline. An earlier version of this bullet said "Links underline always", which was the shipped symptom of a `link.base` override that also made `hasUnderline` inert for every consumer. Full rule and citations in `references/semantics.md` §2. Inline links inherit the surrounding text size; a link that renders larger than its sentence is the fixed external icon at small sizes, drop `isExternalLink` and keep `target="_blank"`.
- **Table rows lift on hover.** Scrollbars are Dracula (Current Line thumb, Purple hover) via `tokens.css`. A visible scrollbar on a comfortable table means a redundant `overflowX` wrapper fighting Table's own scroll container; delete yours. A document-level scrollbar on a `height="fill"` page means no definite-height ancestor (`height: 100%` resolves to content height); wrap the page in a `height: 100dvh` ancestor instead of styling the scrollbar.

## Migrating a codebase

1. Inventory: grep for `#[0-9a-fA-F]{3,6}`, `:root`, `@apply`, Tailwind/StyleX utilities, and existing theme providers.
2. Map every found color to the Exact list below; anything unmappable is a brand question, not a new hex.
3. Replace: delete old theme provider and `:root` overrides, point entry imports at the kit block above, swap raw elements for Card/Text/Link/Stack/Grid, assign each text node its role per the typography doctrine.
4. Verify: `bun run build`, screenshot key pages at 1568, 768, and 390, confirm no raw hex remains (`grep -ri '#[0-9a-f]\{3,6\}' src --include='*.tsx' --include='*.css'` should show only kit references), confirm no page-level horizontal overflow at 390.

## Exact token names (use these verbatim)

`astryx-theme.ts` is the source of record and the counts are cited rather than
written, because they drift: `grep -c "pin(" astryx-theme.ts` for the pins,
`grep -o "^  --[a-z-]*:" theme.css | sort -u | wc -l` for the public props in the
prebuilt output, `grep -c "^  --" tokens.css` for the plain-CSS mirror.
`tokens.css` is unlayered by design so it beats core layers with zero
`!important`. No gate asserts the counts;
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
Border `--color-border` (Comment `#6272A4`) / `--color-border-emphasized`
(**`#9AA1BC`, repinned from Comment**). Core tone-bumps `-emphasized` to ≥3:1
for form-control boundaries (`expandColorScale.ts:22-24`), but `pin()` returns a
literal, so that guarantee is inert by construction on this theme — the old
Comment value cleared **no** surface tier at 3:1 (3.03/2.51/2.05/1.94) and the
new one clears all four (5.56/4.60/3.77/3.57). `DropdownMenuRadioItem.tsx:84`
reads this token and `DropdownMenu` paints `--color-background-popover`, so the
popover tier is a real consumer, not a hypothetical. Known shortfall: the
inverted surface (`#F8F8F2`) at 2.40, which has **no live consumer** — only
`Toast.tsx` paints it and its one control is a `Button`, which reads
`--color-border`, not `-emphasized`. Recorded at the site, not certified.
`scripts/check.ts` gates all three tiers at the real 3:1 floor, not the old 1.5
rubber-stamp. Flat-crisp shadow hue
`--color-shadow` (`#21222C`, not Stone's cold blue); hover-tint bases
`--color-tint-hover` (**`#FFFFFF`, ruled correct — do not repaint**). The
question was whether pure white violates "the spec has no pure white". It does
not, because core only ever reads this token as a `color-mix` **partner** at
5–20% (`CheckboxInput.tsx:115-138`, `Slider.tsx:252`), never as a paint. It is
core's own dark value (`tokens.stylex.ts:81`, `light-dark(black, white)`), so
repainting it to a Dracula grey would silently retint every mix core builds and
break the only thing it is for) /
`--color-on-dark` (spec Foreground `#F8F8F2`, **not white** — the pair is
**deliberately asymmetric** with `--color-on-light` (spec black) and must not be
"fixed" into two greys) /
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
`--color-tag-<orange|pink|cyan|yellow|green|purple>`. The purple tag was
**renamed from `blue`** — the token always held `#BD93F9`, byte-identical to
`--color-accent` (spec Purple), and never held a blue. Dracula has no blue, so
the *value* was right and the *name* was the lie; the rename landed in both
`tokens.css` and `astryx-theme.ts` (`theme.css` is generated from the latter).
The historical trap, for anyone who greps: `blue` is also the name of six
*other* tokens that genuinely are Comment `#6272A4` (`--color-background-blue`,
`-border-`, `-icon-`, `-text-`, `--color-data-categorical-blue`, and the
`--color-data-blue-1..5` ramp), so a repo-wide find/replace on "blue" would
silently repoint all six at Purple. Only the tag moved. A name that contradicts
its own value is invisible to every contrast gate, which is why it needed a
human ruling rather than a threshold.
Inverted surfaces
`--color-background-inverted` (`#F8F8F2`) /
`--color-background-error-inverted` (`#FFD5CC`, pale error surface the spec
palette does not supply; consumed by the error Toast). Skeleton/track
`--color-skeleton` / `--color-track`.
Charts: `--color-data-categorical-<blue|orange|green|pink|cyan|red|teal|indigo>`
(blue goes comment; teal ANSI bright cyan `#A4FFFF`, indigo ANSI bright blue
`#D6ACFF`, brown reuses orange), `--color-data-neutral` (`#8C939B` — **inherited
from core, not chosen here**: core declares it as `light-dark(#8494A3, #8C939B)`
in `core/src/theme/domainTokens/dataTokens.ts`, and it is off-palette, sitting
neither on a Dracula hex nor on our own gray ramp, whose L60 computes to
`#8A8EA8`. An earlier version of this line called it "Stone gray reads fine on
dark — deliberate"; whether "Stone" is a real Astryx brand name is an **open
question** — `grep -ril stone node_modules/@astryxdesign/` hits only a separate
`@astryxdesign/theme-stone` package, not this value — but the value's origin and
its off-palette status are not in doubt, and it stays because it reads fine on
dark), and 45 sequential ramps
`--color-data-<purple|pink|red|orange|yellow|teal|blue|shamrock|gray>-<1-5>`
(lightness 28/44/60/74/88, constant hue/saturation per family).
**Purple is sanctioned here and barred only from categorical use.** The token
`--color-data-categorical-purple` EXISTS and is pinned to spec Purple `#BD93F9`;
the prohibition is a **module rule**, enforced
by `shared/chart-hues.ts` exporting a purple-free `CHART_HUES` and the
`ChartHue` union — not by token absence. Do not read this list as self-policing:
the set offers the ramp, and one module keeps it out of categorical charts. A
magnitude ramp claims an order, not an identity, which is why purple survives in
the sequential family while it cannot name a data series. `references/visual.md`
draws the same line in one sentence.
Type `--font-family-mono` (+ `--font-family-<body|heading|code>` aliases),
`--font-size-base` / `--font-size-h1` … `--font-size-h6` (compat pins h1 24 /
h2 20 / h3 16 / h4 14 / h5 13 / h6 12; `Heading` resolves the 14-base 1.2
scale roles instead) plus the full `--font-size-<4xs…5xl>` scale and
`--text-<body|large|label|code|supporting|display-1…3|heading-1…6>-<size|weight|leading>`
roles (label pins semibold — **only 400 + 600 font faces ship, so templates must not
opt into `weight="medium"` or `weight="bold"`**. This is a rule about the *label role*,
NOT about deleting the weight tokens: core declares and consumes
`--font-weight-medium` in roughly 20 shipped components via `fontWeightVars`, so
removing it from the mirror would leave Button, Kbd, TabList, FieldLabel,
MetadataList and CodeBlock with an unresolvable
`font-weight: var(--font-weight-medium)` — a visible typography regression. The token
stays; the usage ban is the rule), motion `--duration-<fast|medium|slow>(-min|-max)?` +
(core defaults), shadows `--shadow-<low|med|high>` /
`--shadow-inset-<hover|selected|success|warning|error>` (all five at **18.82%** alpha —
`0x30` = 48/255, **not the 30% an earlier version of this line claimed**; see the
contrast non-claim above, which is not optional).
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

## Conformance statements worth stating once

- **Truncation must reveal.** When copy is truncated, the full value has to be reachable — SC 1.4.10 (Reflow) and **1.4.12 (Text Spacing)** both require it, and this is a conformance obligation, not a nicety. Core implements it: `Text` truncation plus `useTruncation` plus `Tooltip` plus `EmptyState`. A `maxLines` with no reveal path is a defect.
- **Motion: the criterion that bites is 2.2.2 Pause, Stop, Hide (Level A), not SC 2.3.3.** 2.3.3 Animation from Interactions is **Level AAA**; several docs state it as AA. An auto-animating indicator — a pulsing in-progress `StatusDot` — is governed by 2.2.2, which is the one that requires it to be pausable.
- **WCAG 1.4.1 Use of Color has no exceptions in WCAG 2.2.** The familiar three-part exception wording (incidental, decorative, logo) appears nowhere on the criterion or its Understanding page. An earlier version of this file implied exceptions and it was wrong. Consequence for this brand: colour is never the only channel — a `StatusDot` is paired with a visible word, because a label that reaches a screen reader but paints nothing leaves a sighted user with the hue alone.
- **EmptyState heading default.** Core renders the empty-state title as `h3`; Mantine and shadcn default to a `div`. If a page needs the empty state at a different tier, wrap it — do not assume the default is configurable.

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
