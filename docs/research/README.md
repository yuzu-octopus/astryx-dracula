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
