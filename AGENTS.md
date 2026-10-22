# AGENTS.md

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->
Astryx v0.7.2 · 173 components
CLI: run every command as `bunx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then tokens (var(--color-*|--spacing-*|--radius-*)). No raw hex/px. No StyleX/Tailwind compiler here — don't use xstyle/utility classes directly. Some templates use StyleX and need a compiler plugin; see `astryx docs styling-overview`.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any raw <div>/<span>, imported .css/@apply, or hardcoded #hex/px with the component or a token.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands, API reference, integration authoring
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->

## Astryx Dracula brand (this repo)

Dark-only Dracula, no light mode exists or is planned. Never invent a color, token, font, or radius.
Kit import order in the app entry: `@astryxdesign/core/reset.css`, then `@astryxdesign/core/astryx.css`,
then `astryx-dracula/tokens.css`, then `astryx-dracula/theme.css` inside `<Theme theme={astryxDraculaTheme} mode="dark">`.
Read `.agents/skills/astryx-dracula/SKILL.md` before styling anything (agent index: [AGENTS.snippet.md](AGENTS.snippet.md)).
Scaffold pages with `bunx @astryxdesign/cli template <id> --package astryx-dracula ./path/to/page.tsx` — the path argument is required, without it the CLI prints the source and writes nothing. Templates carry XLE headers.

Three rules that are cheap to get wrong and expensive to debug, all settled with evidence in SKILL.md:

- **A `Layout height="fill"` needs a definite ancestor or the document scrolls instead.** Use
  `style={{height: '100dvh'}}` on the Layout. Never `minHeight: '100%'` — a percentage min-height
  against an indefinite containing block computes to 0 (CSS 2.1 §10.5), so it is a no-op that
  looks like a fix. Do not add it inside an `AppShell`, which is already `100dvh`.
- **A count a page prints must be derived from the data, never written as a numeral.** `documentation.tsx`
  shipped "twenty-eight components" against 31 entries and its XLE said 15 for a category of 18.
- **A `.tsx` exports components only; data lives in a sibling `.ts`.** A file exporting both breaks
  React Fast Refresh. `bun run audit` gates `package.json` `exports` against `shared/` in both
  directions, so a new shared module needs an entry and a deleted one loses it.
- **A declared token is not an applied token.** 20 templates asked for `type="display-2"` (35px,
  `rg -l 'type="display-2"' templates | wc -l`) and
  every one rendered 24px for the package's entire life: no `.astryx-heading[data-type]` rule existed
  to apply the size, so core's level-1 default leaked through. It looked right, no build failed, and
  only a pixel diff between two builds found it. `bun run audit` now fails if a `display-N` this repo
  consumes has no matching rule in `theme.css`. Check a size is **applied**, not just declared.

## Links, buttons, dividers (USAGE.md → Rules carries the rules; this is the evidence)

The templates shipped with mistakes that read as deliberate design, so the evidence that settles
each one is recorded here.

- **A link is a destination; a button is an action.** `shared/settings-rows.tsx` rendered "Create",
  "Disconnect" and "Edit" as `Link`s — "Edit" even carried an `e.preventDefault()` because it never
  navigated. A `preventDefault` on a `Link` is the tell that the element is really an action.
- **`hasUnderline` is per-link and opt-in.** Prose links pass it; navigation links pass nothing.
  `astryx-theme.ts` no longer sets `textDecoration` on `link.base` and must not start again: it
  shipped as `.astryx-link { text-decoration: underline }`, which made core's documented
  `@default false` (hover-only) unreachable and every link in every template permanently
  underlined. The brand look was never what it was doing — it overrode the one prop that can
  express an underline per link.
- **A divider is a section boundary, not a row background.** The shared rows drew one after every
  row while both templates already draw their own group boundary with `Heading` + `Divider`, so the
  panels read as a form grid. One divider inside a panel at most; the rest is `Stack gap`.
- **A settings row is edited in `shared/`, not in a template.** `settings-sidebar.tsx` and
  `settings-dialog.tsx` both render `InfoRowItem` / `ExpandableRow` from
  `shared/settings-rows.tsx` over content from `shared/settings-data.ts`. The row bodies were
  byte-identical when they were forked, so a divider or a `Link`→`Button` fix made inside one
  template is invisible to the other — which is why an earlier pass could not clear the clutter
  from either template. The rows' own `href` prop survives as accepted-but-unread — a callsite
  compatibility shim, and a different thing from `InfoRow.href` on the data side — while
  `hasDivider` defaults to `true`.
- **A row's action kind is declared on the data, not recovered at the callsite.** `InfoRow` carries
  `actionKind: 'action' | 'destination'` — one mechanism, stating the fact where the row is written,
  so every renderer reading that data can see it. Do not reinstate the `actionHref` prop and do not
  string-match a row's `action` string to recover the kind. If a data field fails to arrive through
  a `{...row}` spread, the cause is TypeScript excess-property checks on the row literal, not the
  spread: `InfoRow` declared only `label`/`value`/`action`, so the extra key was rejected at the
  literal. Fix the interface and a data-side signal reaches every renderer with zero template edits.

Templates are the reference implementation. Read the closest `templates/<id>.tsx` — and its XLE
header comment, which is the structural map of the tree it renders — before writing a new pattern.
Core's `.d.ts` describes the API; it does not describe how this brand uses it.

The XLE header is **gated**, and the notation is **written down**. CLI 0.7.0 removed
`astryx layout check`, so the headers became prose nobody could check and an audit found drift in
all 45 of them. Two things came out of it: `.agents/skills/astryx-dracula/references/xle.md` now
carries the node vocabulary (the one that had been implicit for 45 templates), and
`scripts/check.ts` fails when a header names a component the template does not import. Read the
vocabulary before writing a header, and update the header with the file — never the header alone.

`templates/<id>.template.mjs` is **metadata, not structure**: it carries the page's `type`, `name`,
`description`, `category` and the `keywords` the CLI matches `astryx search` and `astryx build`
against. It does not list the page's blocks and it holds no XLE — the XLE lives in the `.tsx`
header, and only there.

On the "173 components" line in the generated block above: that is the number of
**exported component names** the CLI enumerates, not the number of component
directories. The package ships **107** component directories — `find
node_modules/@astryxdesign/core/src -maxdepth 1 -type d | tail -n +2 | wc -l` returns
112, minus 5 infrastructure directories (`__tests__`, `hooks`, `i18n`, `theme`,
`utils`) that are not components. The gap is compound parts the CLI lists
individually (`AvatarGroup`, `AvatarStatusDot`, `ChatMessageBubble`,
`CommandPaletteItem`, `DialogHeader`, `ToggleButtonGroup`, …), so the generated line is
correct in its own terms and is not edited — but do not read it as a component count.
Say which of the two you mean, and name the command.

The demo's own copy of this number is **derived, not written**: `vite.config.ts` counts
the component directories of the installed core package and hands the result to
`demo/App.tsx` through `import.meta.env.ASTRYX_COMPONENT_COUNT`. It said "All 155
Astryx components" through the 0.6.3 era and was true for core 0.6.3; a number about a
dependency drifts the moment the dependency moves, and this one is now counted at build
time instead.
