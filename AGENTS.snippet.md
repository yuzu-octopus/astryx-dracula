## Astryx Styles (brand source of truth)

Skill: `astryx-dracula/.agents/skills/astryx-dracula/SKILL.md` — read it before styling anything.
Import `astryx-dracula/tokens.css` for plain CSS vars (full mirror (`grep -c "^  --" tokens.css`) `:root` vars), or
`astryx-dracula` (`astryxDraculaTheme`) + `astryx-dracula/theme.css`
with `<Theme theme mode="dark">` from `@astryxdesign/core/theme` for the full theme surface (191 public props, `grep -o "^  --[a-z-]*:" theme.css | sort -u | wc -l`).
45 templates available: `bunx astryx template <id> --package astryx-dracula` (carry XLE headers).
`Layout height="fill"` needs `style={{height:'100dvh'}}` or it degrades to document scroll — never
`minHeight:'100%'`, which computes to 0 against an indefinite parent and changes nothing. Derive any
count a page prints from its data; never write the numeral. A `.tsx` exports components only (data
lives in a sibling `.ts`) so React Fast Refresh works.
A link navigates, a button acts: save/delete/toggle is a `Button`, and `hasUnderline` marks a prose link only.
Chart marks take `--color-data-*` role tokens (via `shared/chart-hues` / `chart-legend` / `data-bar`
types, which reject anything else at compile time), never `--dracula-*` primitives. Comment #6272A4
is legal on a graphical mark and illegal on text — 3.36:1 clears 1.4.11 graphical, fails 4.5:1 text.
Never invent hexes: Dracula bg #282A36 fg #F8F8F2 comment #6272A4
purple #BD93F9 green #50FA7B red #FF5555 yellow #F1FA8C cyan #8BE9FD
pink #FF79C6 orange #FFB86C current-line #6272A4 selection #44475A.
