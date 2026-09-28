# AGENTS.md

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->
Astryx v0.3.0 · 155 components
CLI: run every command as `bunx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:
1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:
- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else style/className with tokens — var(--color-*|--spacing-*|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-*|--spacing-*|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
  search "<query>"   find any component / hook / doc / template / block
  component --list   155 components by category
  template --list    page + block recipes
  docs <topic>       browser-support, cli-integrations, color, elevation, getting-started, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, styling-libraries, theme, tokens, typography, working-with-ai
  swizzle <Name>     eject component source for deep customization
  upgrade --apply    run after any @astryxdesign/core bump
<!-- ASTRYX:END -->

## Astryx Dracula brand (this repo)

Dark-only Dracula, no light mode exists or is planned. Never invent a color, token, font, or radius.
Kit import order in the app entry: `@astryxdesign/core/reset.css`, then `@astryxdesign/core/astryx.css`,
then `astryx-dracula/tokens.css`, then `astryx-dracula/theme.css` inside `<Theme theme={astryxDraculaTheme} mode="dark">`.
Read `.agents/skills/astryx-dracula/SKILL.md` before styling anything (agent index: [AGENTS.snippet.md](AGENTS.snippet.md)).
Scaffold pages with `bunx astryx template <id> --package astryx-dracula` — templates carry XLE headers.

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

On "155 components" in the generated block above: that is the number of **exported
component names** the CLI enumerates, not the number of component directories. The
package ships **101** component directories — `find
node_modules/@astryxdesign/core/src -maxdepth 1 -type d | tail -n +2 | wc -l` returns
106, minus 5 infrastructure directories (`__tests__`, `hooks`, `i18n`, `theme`,
`utils`) that are not components. The gap is compound parts the CLI lists
individually (`AvatarGroup`, `AvatarStatusDot`, `ChatMessageBubble`,
`CommandPaletteItem`, `DialogHeader`, `ToggleButtonGroup`, …), so the generated line is
correct in its own terms and is not edited — but do not read it as a component count.
Say which of the two you mean, and name the command.
