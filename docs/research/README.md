# Research index

Measured, sourced work product from the design-system research wave. Each slice is
independent, cites its primaries, and records what it did **not** settle. Read the
index before the detail: a findings file's narrative is argued from sources and
decays slowly, but its **tally is counted from a tree that keeps moving**, so never
cite a quantity from one without re-running the command.

**Cite by full path.** Bare filenames collide: `F1.md` appears in four slices below,
`F5.md` in two, and upstream `dracula/vim` has both `colors/dracula_base.vim` and an
unrelated `autoload/dracula.vim` whose `:28-30` is something else entirely.

| Slice | Findings | Scope | Recorded gaps / open |
|---|---|---|---|
| [`design-patterns/`](design-patterns/) — DesignSystemPatterns | [`findings/F1.md`](design-patterns/findings/F1.md) | Type scale, the hero `h1` binding, per-surface-class value | `h1` **counts are not authoritative here** — three successive numbers (38, 30, 29) came from this file. Cite the rule, never a count. `--text-display-1-size` consolidation is open |
| [`dracula-derivation/`](dracula-derivation/) — GlimpseThemeResearch | [`findings/F1.md`](dracula-derivation/findings/F1.md) (~828 lines) | Alpha-derivation doctrine: what "derive by alpha" covers and what it does not | Teal base repin is entangled with the ramp rebuild; shamrock `#8C939B` provenance unverified |
| [`dracula-ecosystem/`](dracula-ecosystem/) — DraculaEcosystem | `findings/F0.md`–`F5.md` | Terminal/editor ports, Comment contrast, the upstream `#sec-Diffs` broken anchor | `F5.md` here is Comment contrast; the `data-*` inventory is in **lib-landscape**'s `F5.md` |
| [`lib-landscape/`](lib-landscape/) — LibLandscape | `findings/F0.md`–`F6.md` | Component inventory, upstream version gap, a11y state attributes, Park's alias layer | `findings/F5.md:174` is the `data-*` inventory. Three premises in F3 were wrong on inspection |
| [`spacing-density/`](spacing-density/) | `findings/F1.md`–`F3.md`, `REPORT.md` | Spacing, density, touch targets | — |

## What the wave established, and the rule it produced

**A rule or capability stated from the evidence in front of you, rather than tested
against every surface it will reach, is the recurring failure — and it is always a
correct-sounding sentence that stops being true one scope out.** A doc that names a
capability the API does not have is worse than a doc that says nothing, because it
reads as verification.

The instances, all one defect in different clothes: a false x-height premise in the
typography doctrine; the `h1` rule surviving two drafts before contact with the code
proved each was true of the subset measured and false of the kit; an inference drawn
from a rendered string rather than the code that renders it; three doc/API
divergences in a single findings file where the CLI's surface and the API's surface
disagree; and one check that **passed** — a presence grep read as a scope check, in a
file we owned, on the change we had just made.

Three limbs, each checkable: **name the command and its expected output**; **name what
classifies a site into the rule**, as a property of the site and never of the string it
contains; and **for a state a substrate owns, name who owns it**, since no wording of
any rule reaches a pixel the substrate sets inline. The Dracula spec gates Functional
Colors with "Do not use in editor or terminal applications" and `dracula/vim` branches
on `termguicolors`, so the precedent is upstream and in the language of the problem.

## Two habits that produced most of the wave's value

**Check the API, not the string.** `bunx astryx component <Name>` returning keyword
suggestions rather than a component reliably means that component does not exist. And
a `data-*` attribute can be invisible to a source grep because its name is built at
runtime — core emits `data-state` via `themeProps()`, and both a source grep and a
`dist` grep reported its absence, both wrongly, before the API was read.

**Move a rule into a type before writing it down again.** `chart-hues.ts` and
`scene-tile.tsx` both enforce their colour rules with exported unions, so a
hand-rolled array is a compiler error instead of the ninth review comment. A rule
stated in prose is a request; a rule stated in the type is a build failure.
---

## Fold — completed research wave (probed 2026-09-09→28, folded 2026-10-03)

Execution sediment deleted: `docs/superpowers/plans/2026-09-07-astryx-styles.md`,
`docs/superpowers/plans/2026-09-09-skill-compounds.md`,
`docs/superpowers/specs/2026-09-07-astryx-styles-design.md`, all four slice
briefs, `dracula-ecosystem/REPORT.md` (folded below),
`dracula-ecosystem/findings/F0.md`, `spacing-density/findings/F1.md–F3.md`,
`lib-landscape/findings/F0.md`. Kept: every other findings file and
`spacing-density/REPORT.md`. What each slice shipped, and where truth lives:

**design-patterns** — probed 8 audit gaps (hero scale, prose measure, spacing
discipline, status-not-by-colour, chart series, reduced motion, touch targets,
dark elevation) against WCAG 2.1/2.2, M3, Apple HIG, Carbon, GOV.UK, Radix,
Polaris. Shipped: h1 one-value-per-surface-class (`--text-display-2-size` 35px
for page/document titles, `--text-heading-1-size` 24px for routed dense-panel
titles; 29 sites migrated), the classifier-is-a-site-property doctrine, and the
withdrawal of the "small x-height" premise (measured JBM x/upem 0.5500, highest
of three — the go-larger conclusion stands on Apple's thin-weight rule).
Truth: `SKILL.md` "The h1 is bound per surface class" + three limbs +
Typography doctrine; sizes in `tokens.css:150-158`.
Resolution of the brief's 500/700 contradiction (`brief.md:40-50` said both
KEEP and DELETE): the tokens **stay** — core consumes `--font-weight-medium`
in ~20 shipped components, so deletion would regress Button/Kbd/TabList, and
only 400+600 faces ship, so templates are banned from opting into
medium/bold. Discipline rule, not a deletion. Per `SKILL.md:433-440`,
`tokens.css:95-98`.

**dracula-ecosystem** — probed the official spec, 514 org repos, the PRO
ceiling, colour-math techniques, Comment contrast, and a 254-candidate hex
sweep. Shipped: six grill items + the palette restatement below; **no new hex
approved**. Truth: `tokens.css:1-24` header, `BRAND.md` (Palette, Borders,
Interactions), `SKILL.md` (18.82% alphas, contrast ceilings, accent focus).
New grill items (`REPORT.md` §6): (1) `--color-data-base-muted` `#8288A6` is
4.0832:1 on the body — whatever gate passes it is not applying SC 1.4.3;
(2) `#9AA1BC` fails at 3.7704:1 on `#424450`, so any surface at/below that
lightness breaks the secondary token; (3) ramp step names 28/44/60/74/88 are
decorative — five HSL steps span 33.0–97.4 OKLCH L, blue keeps 20.6% of
chroma; (4) the kit ships two hover ladders/mechanisms undocumented — ours at
12.16%/20.00% 8-digit hex vs core's 5/15/20% `color-mix`; (5) Functional
Purple `#815CD6` has zero adoption as a focus colour anywhere — we ship
`#BD93F9`, recorded here as deliberate deviation, not a future "fix";
(6) `--color-shadow` is `#21222C` but every built shadow/scrim is `#191A21`.
Approved palette, unchanged (`REPORT.md` §7): `#000000` `#0081D6` `#089108`
`#21222C` `#282A36` `#343746` `#424450` `#44475A` `#4C5067` `#50FA7B`
`#6272A4` `#815CD6` `#8288A6` `#8BE9FD` `#8C939B` `#9AA1BC` `#A39514`
`#A4FFFF` `#B0B3C4` `#BD93F9` `#D6ACFF` `#DE5735` `#F1FA8C` `#F8F8F2`
`#FF5555` `#FF79C6` `#FFB86C` `#FFD5CC` `#FFFFFF`, plus 45 HSL ramps at
L 28/44/60/74/88. Seven are non-spec kit-local lifts (`#000000` `#4C5067`
`#8288A6` `#8C939B` `#9AA1BC` `#B0B3C4` `#FFD5CC`); the `--color-on-dark`
repin to `#F8F8F2` drops the count to 28. F0/C1 residual (F6 §B carries the
per-hex rows; mapping authoritative in `tokens.css:178-186`, `BRAND.md:10-16`):
the spec UI table is 5 rows / 4 distinct hexes, the kit uses 2 as surfaces
(`#343746`, `#424450`), while `#21222C` and `#191A21` are shadow-only and
`--color-background-muted` `#44475A` is sourced from Selection — the lightest
tier, not a UI-table member.

**lib-landscape** — probed 20 JS/React libraries × 9 mechanism axes against
core 0.3.0. Shipped: 5 adopt / 3 reject patterns, the `data-*` inventory
(`F5.md:174`), Park's alias layer, the GridSpan-void correction, core-version
notes, and the unlayered-escape-hatch + balanced-parser-trap method notes.
Truth: `SKILL.md` (GridSpan, the `display-2`-declared-but-unapplied note),
`tokens.css` unlayered header, inline deltas in F1–F6. F0 dropped without a
re-probe note: it was pinned to core 0.3.0 (101 dirs / 155 exports) and the
repo now runs core 0.6.3 (`package.json`) — the version-pinned numbers are
stale, and every live conclusion (G1-corrected `data-state` via runtime-built
names, G9-void span, G10 unlayered) already survives in F3/F5 and the skill.

**spacing-density** — probed the 8pt canon plus Material, Carbon, GOV.UK,
Apple HIG, WCAG 2.2, Ant across 32 primaries. Shipped per-token verdicts:
CHANGE gap 23→24, widget-gap 23→24, viewport 15→16, content 17→16; KEEP
content 15, tile-row 96, Card 4/3, radius 5, type-base 14; touch two-tier (24px
AA floor, 44 where touch matters). Truth:
`.agents/skills/astryx-dracula/references/spacing.md`, `BRAND.md:89` (Dims),
`tokens.css:79-89`. Angle files F1–F3 deleted; `REPORT.md` kept as the record.
