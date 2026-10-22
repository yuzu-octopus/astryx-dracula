# XLE drift — the inventory that the 0.7.2 upgrade produced

**Probed 2026-10-22 (core+cli 0.6.3 → 0.7.2), after the `astryx layout` command
group was removed.** Two independent read-only audits swept all 45 templates'
XLE headers against their own source, and a third pass audited the result.
This file records what the drift was and how it was closed.

## Why the drift existed

CLI 0.7.0 removed `astryx layout check` (breaking change #7137). Until then a
`bunx astryx layout check "<expr>"` could prove a header matched the tree it
described. Nothing replaced it — `astryx docs layout` is a guide, not a checker.
Every header now says so in its own text, and `references/xle.md` no longer
teaches the command.

The drift had a cause as well as a symptom. **The notation was never written
down**, so it had grown 69 node names with a mixed convention (some
abbreviated, some spelled out) and one outright collision — `TL` meant TabList
in five templates and TreeList in a sixth. Fixing drift without fixing the
notation just invents new drift.

## What landed

- **`references/xle.md` now carries the vocabulary** — every node name, what it
  stands for, the two that used to collide, and the payload rule (a payload is
  the RENDERED string, not a label or a placeholder).
- **All 45 headers were rewritten** against that vocabulary. The corrections
  the audits found were structural, not cosmetic: a component named that the
  file does not render, a component rendered that the header omitted, a wrong
  count, a wrong gap, a missing second root, a header that said `Section`
  where the file renders a `Card`.
- **A gate now protects them.** `scripts/check.ts` fails when a header names a
  component the template does not import. It is one-directional on purpose: a
  template may import a component it does not put in the header, but not the
  other way round. It follows the shared modules a template imports, and it
  counts locally declared components as well as imported ones.

## What the gate could not catch, and what closed it

A component that IS imported and used elsewhere in the file, but attributed to
the wrong place in the header. `<VisuallyHidden as="h1">` written as
`Hd"…"[level=1]` passes the import check whenever the file also renders a
real `Heading` somewhere else.

No import check can catch that. It was closed by reading: a third pass audited
every header against the source with no knowledge of the work that produced
it, and found the class the gate is blind to. The findings were applied by
hand.

## The traps worth keeping

1. **A `VisuallyHidden` heading is not a `Heading`.** Three templates render
   their h1 with `as="h1"` on a `VisuallyHidden`; the header said `Hd`. The
   token is `VH`, and the gate cannot see the difference when the file also
   renders a real `Heading` elsewhere.
2. **A payload is the rendered string.** `Fd"Goals"` was a field's label
   shorthand; the label is "What are you going for?". `SE"Budget"` was a
   placeholder; the label is "Budget range?". The reference is explicit and
   the gate cannot see a payload that is a placeholder rather than what
   renders.
3. **A second root needs `;;`.** A template that renders a `Dialog`, a
   `Drawer` or a `CommandPalette` beside its main tree has two roots; without
   the separator a reader is told the page has no overlay at all.
4. **A data-mode `Table`'s rows are not the template's.** `TR`/`TC`/`THC`
   describe DOM the `Table` component generates, so the template imports
   `Table` and not the row components. The gate accepts either.
5. **A shared module's tree belongs to the template that renders it.** A
   template delegating to `shared/chaptered-doc.tsx` describes the tree THAT
   module renders, so the gate follows the shared import.

## Still open, deliberately

- Core's three new page templates (`table-collapsible`, `table-comparison`,
  `table-tree`) are feature work, not a fix. Each needs a paired header
  authored by hand — and now a gate to check it.
- The `messaging-shell` thread panel and the `table-grouped` inspector are
  still `LayoutPanel`s below 1024px, where a `Drawer` would be the
  purpose-built home. That is a design decision, not drift.
