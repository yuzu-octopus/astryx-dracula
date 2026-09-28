# Brief — Dracula ecosystem & colour-derivation practice beyond what astryx-dracula ships

**Date:** 2026-09-28
**Depth:** deep (6 workers round 1, 1 follow-up round, 25+ sources target)
**Mode:** read-only research. No source edits in the repo.

## Question

Beyond the official spec + dracula-ui + dracula-css (already covered by
`docs/research/dracula-derivation/findings/F1.md`), what does the real Dracula
ecosystem do that astryx-dracula does not ship — and which of the colour-math
techniques those implementations use are safe for a **dark-only** brand that
pins identical light/dark tuples?

## Decision this informs

A human is deciding which candidate hexes (if any) to add to the kit. The
deliverable is a documented candidate set + a technique inventory, NOT a
recommendation. Every new hex/token/font/radius must be flagged for human
approval (Main adjudication D).

## Answer form

1. Technique inventory: formula + parameters + failure modes, each rated
   SAFE / BREAKS for a dark-only brand with pinned identical light/dark tuples.
2. Dracula PRO ceiling notes: what it adds, spec-sanctioned vs invented.
3. Comment-contrast handling across the ecosystem.
4. Candidate hex set we do NOT currently contain — clearly separated,
   explicitly not a recommendation.

## Scope

**In:** consumers of the Dracula palette (Dracula PRO, Material Dracula,
JetBrains, Vim/Neovim, Alacritty, Zsh, Dracula for Slack/Notion/Figma/Sublime),
dark-UI colour maths (W3C CSS Color 4/5, WCAG 2.2, APCA, Material 3 tonal
palette), contrast remediation of Comment `#6272A4`.

**Out (already done by sibling, do NOT redo):** the official spec's pinning
mandate, the `!alpha` ladder in dracula/cursor, dracula-ui's derivation engine,
dracula-css wash hardcoding, the Alucard light palette, WCAG 4.5:1 statement.

**Out (other slices):** our own token audit, layout/type audits, Astryx CLI.

## Our approved palette (DIFF BASELINE — 29 hexes, `tokens.css` + `astryx-theme.ts`, identical)

```
#000000 #0081D6 #089108 #21222C #282A36 #343746 #424450 #44475A #4C5067
#50FA7B #6272A4 #815CD6 #8288A6 #8BE9FD #8C939B #9AA1BC #A39514 #A4FFFF
#B0B3C4 #BD93F9 #D6ACFF #DE5735 #F1FA8C #F8F8F2 #FF5555 #FF79C6 #FFB86C
#FFD5CC #FFFFFF
```
Plus 45 HSL sequential ramps already derived at L=28/44/60/74/88
(`hsl(H S% 28|44|60|74|88%)`), e.g. `hsl(264.71 89.47% 44%)`.

Any hex in the ecosystem NOT in that list is a **candidate** — quote it
exactly, with the source file and line, and say what a UI would use it for.

## Assumptions

- Dracula PRO's palette is paywalled; workers must find legitimate public
  primary sources (official site copy, official repo, official changelog,
  first-party blog by the maintainer Zeno Rocha, official Figma listing).
  If the actual hexes are not publicly verifiable, say so — do NOT guess.
- "Dark-only brand that pins identical light/dark tuples" = our `theme.css`
  uses `light-dark(a, a)` for the data ramps, so any technique whose result
  differs between light and dark resolution is a break.
- Ecosystem consumers legitimately need hexes we lack (terminal cursor colours,
  diff colours, git colours, gutter, non-text, etc.) — that is the point of
  the candidate set.

## Angles

| # | Angle | Question |
|---|---|---|
| 1 | Dracula PRO ceiling | What does the paid Pro theme add (palette, surfaces, syntax)? Which choices are spec-sanctioned vs invented? |
| 2 | Terminal + editor consumers | JetBrains, Vim/Neovim, Alacritty, Zsh, Emacs: which hexes beyond the 29, how do they tier surfaces, handle selection/cursor/disabled/focus? |
| 3 | App/UI consumers | Material Dracula, Slack, Notion, Figma, Sublime, Chrome, Obsidian: surface tiers, elevation, hover, disabled, focus — what do they need that the spec lacks? |
| 4 | Colour-math technique inventory | Every dark-UI derivation technique with formula, parameters, failure modes: alpha compositing, OKLCH lightness steps, `color-mix(in oklab)`, WCAG contrast solving, APCA, Material 3 tonal palettes. |
| 5 | Comment-contrast remediation | How real implementations handle `#6272A4` failing AA. Evidence, not opinion. |
| 6 | Candidate hex sweep | Systematic hex harvest across all the above repos, diffed against our 29. |

## Quality gate

- Every candidate hex carries a file+line from a primary source.
- Every technique carries a primary spec/doc URL, not a blog.
- PRO claims either cited to public primary source or explicitly marked
  `unverified — paywalled`.
