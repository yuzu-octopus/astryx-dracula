# Layout expressions (XLE / XLO)

Two syntaxes, one language. Validated live against `@astryxdesign/core`; expands to TSX via the CLI. Full grammar is authoritative in the tool, not here: `bunx astryx layout grammar`.

- **XLE** = compact one-liner for prompts. ~200 tokens expands to ~1000 tokens of TSX.
- **XLO** = indented outline, same tree. One node per line, indentation nests, `repeat N:` loops.

## When to use

New page from scratch: write XLE, expand, then brand-pass. Never hand-write the full TSX first.

Do NOT use for small edits to existing files, themed adaptation of a scaffold, or pages dominated by custom blocks (expansion collapses unknown blocks to TODO placeholders).

## Workflow

```bash
bunx astryx layout check "<expr>"              # validate; echoes canonical XLE + XLO
bunx astryx layout expand "<expr>" ./path.tsx  # emit validated TSX
```

Errors carry line/col plus suggestions. Fix and resubmit; nothing is guessed.

## Node anatomy

`Name#id.enum"payload"[attrs]{hint}*N > children`

- `.enum` — enum value: `Bd.success`, `Tx.lg`, `B.primary`
- `"payload"` — primary text: `TI"Email"`, `B"Save"`
- `{hint}` — template/block reference, never raw text: `C{card-callout}`
- `*N` — repeat: `(TR>TC"x"*4)*6`
- `!` — initial selection for scaffolded state
- `[...]` — attrs: fused (`p6 g4 c4`), `key=value` (`t=email c{min:340}`), flags (`req striped hover`), align (`j=` main axis, `a=` cross), slots (`@topNav=TN`), `fill` wraps in StackItem
- `>` nests, `+` siblings. Structure auto-routes: `Layout > LH + LC + LF + LP` into slots; `T >` rows partition into header/body.

## Example (analytics dashboard, 204 tok in)

```text
A[cp6 @topNav=TN @sideNav=SN] > L > LC > V[g6] > (H[j=between a=center] > Hd"Analytics"[level=2] + (H[g2] > B"Export" + B.primary"New report")) + (G[c4 g4] > (C[p6] > V[g1] > Tx.lg"$42k" + Tx[t=supporting]"Revenue")*4) + (C[p0] > T[striped] > (TR>THC"Order"+THC"Customer"+THC"Status"+THC"Total") + (TR>TC"#101"+TC"Acme Inc"+(TC>Bd.success"Paid")+TC"$120")*5)
```

Expands to ~990 tokens of validated TSX (AppShell, Layout, grids, cards, striped table). Baseline without this: ~950 tokens of hand-written TSX with invented imports (`@astryx/ui`, `AppShell.TopBar`, `Card.Header`), raw divs, and Tailwind classes. Same size, all signal.

## Brand pass (required after expand)

Expansion emits stock Astryx. Then apply the brand, in order:

1. Entry imports plus Theme wrapper, fonts copied.
2. Every color to Exact-list tokens; section subtitles `body`, metadata `supporting`.
3. Tabular numerals on quantities; status vocabulary; hover dim untouched.
4. Recharts/WebGL/lab output replaced with hand SVG; heroicons to verified lucide.

## Template headers

All 44 templates carry their canonical structural XLE in a header comment (`// XLE (...)`), validated with `bunx astryx layout check`. When reading or modifying any template, read the header comment first to grasp the entire component tree at ~1/5th the token cost. XLE is canonical: for structural changes, update the XLE first, validate with `check`, expand, then apply the brand pass.
