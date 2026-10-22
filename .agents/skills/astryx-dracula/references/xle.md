# Layout expressions (XLE / XLO)

Two syntaxes, one language. XLE/XLO describe the structure of a page. The CLI no longer validates or expands them — `astryx layout` was removed in CLI 0.7.0 — so this file is the only grammar reference.

- **XLE** = compact one-liner for prompts and for the header comment each template carries.
- **XLO** = indented outline, same tree. One node per line, indentation nests, `repeat N:` loops.

## When to use

New page from scratch: scaffold from a template, then brand-pass. Never hand-write the full page before reading the closest `templates/<id>.template.mjs`.

Do NOT use for small edits to existing files, themed adaptation of a scaffold, or pages dominated by custom blocks.

## Workflow

There is no validator any more. `astryx layout check`, `astryx layout expand` and `astryx layout grammar` were all removed in CLI 0.7.0, and nothing replaced them — `astryx docs layout` is a guide, not a checker. The XLE header is therefore a reading aid and a human drift check, not a machine-checked artifact.

```bash
bunx @astryxdesign/cli template <id> ./path.tsx  # scaffold a page, then brand it
bunx @astryxdesign/cli docs layout             # layout guidance
```

## Node anatomy

`Name#id.enum"payload"[attrs]{hint}*N > children`

- `.enum` — enum value: `Bd.success`, `Tx.lg`, `B.primary`
- `"payload"` — primary text: `TI"Email"`, `B"Save"`
- `{hint}` — template/block reference, never raw text: `C{card-callout}`
- `*N` — repeat: `(TR>TC"x"*4)*6`
- `!` — initial selection for scaffolded state
- `[...]` — attrs: fused (`p6 g4 c4`), `key=value` (`t=email c{min:340}`), flags (`req striped hover`), align (`j=` main axis, `a=` cross), slots (`@topNav=TN`), `fill` wraps in StackItem
- `>` nests, `+` siblings. Structure auto-routes: `Layout > LH + LC + LF + LP` into slots; `T >` rows partition into header/body.

## Node vocabulary

These are the ONLY node names. A header that names a component with a
different token is wrong, and `scripts/check.ts` fails the build when a header
names a component the template does not import.

**Shell and layout** — `A` AppShell · `L` Layout · `LC` LayoutContent ·
`LH` LayoutHeader · `LF` LayoutFooter · `LP` LayoutPanel · `Ctr` Center ·
`H` horizontal Stack (HStack) · `V` vertical Stack (VStack) · `G` Grid ·
`GS` GridSpan · `SI` StackItem · `A2`/`A3` AppShell grid span (see note) ·
`LH` LayoutHeader

**Surfaces** — `C` Card · `CC` ClickableCard · `SC` SelectableCard ·
`S` Section · `D` Divider · `B` Button · `Bd` Badge · `Bn` Banner ·
`TL` TabList · `TB` Toolbar · `Tmb` ToolbarMenuItem · `T` Table ·
`TR` TableRow · `TC` TableCell · `THC` TableHeaderCell · `UL` List ·
`LI` ListItem · `TrL` TreeList · `ML` MetadataList · `MLI` MetadataListItem ·
`Tbar` Toolbar · `OFL` OverflowList · `Po` Popover · `PS` PowerSearch ·
`MM` MoreMenu · `SG` SegmentedControl · `SGI` SegmentedControlItem ·
`SE` Selector · `Tg` ToggleButton · `TgG` ToggleButtonGroup ·
`Col` Collapsible · `ColG` CollapsibleGroup · `Dlg` Dialog · `DH` DialogHeader ·
`Drawer` Drawer · `DrawerHeader` DrawerHeader · `Sk` Skeleton ·
`TNI` TopNavItem · `TNI{TopNavMegaMenu}` TopNavMegaMenu ·
`CmdP` CommandPalette · `DD` DropdownMenu · `EmptyState` EmptyState ·
`TS` Timestamp · `RH` ResizeHandle

**Text and marks** — `Hd` Heading · `Tx` Text · `Lk` Link · `Ic` Icon ·
`IB` IconButton · `Tk` Token · `Av` Avatar · `SD` StatusDot · `AR` AspectRatio ·
`Cd` CodeBlock · `TI` TextInput · `TA` TextArea · `NI` NumberInput ·
`CB` CheckboxInput · `RL` RadioList · `RLI` RadioListItem · `TY` Typeahead ·
`Fd` Field · `VH` VisuallyHidden · `MNT` MobileNavToggle · `Bu` Bullet
separator · `RC` RevenueChart · `Spl` Sparkline · `Sw` chart legend swatch · `Scene` SceneTile / SceneCastle ·
`SB` the local SeverityBadge · `Outline` the shared chapter outline

**Chat** — `ChC` ChatComposer · `ChL` ChatLayout · `ChM` ChatMessage ·
`ChBu` ChatMessageBubble · `ChMeta` ChatMessageMetadata · `ChTC` ChatToolCalls · `ChML` ChatMessageList · `ChSM` ChatSystemMessage

Notes on the two that used to collide:

- **`TL` is TabList, not TreeList.** TreeList is `TrL`. The two were both
  `TL` in the tree before 2026-10-22, which meant one header could not be
  read without knowing which component its template used.
- **`SE` is both SegmentedControl and Selector**, because the two are the
  same shape in a header and the surrounding attrs (`[label=…]`) tell them
  apart. Where that is ambiguous, name the component in a hint: `SE{Selector}`.

**Text payloads are the rendered string, not a label.** A header that says
`TI"Email"` must match a field whose rendered label is "Email" — not its
`label` attribute when the two differ, and not a placeholder.

## Example (analytics dashboard, 204 tok in)

```text
A[cp6 @topNav=TN @sideNav=SN] > L > LC > V[g6] > (H[j=between a=center] > Hd"Analytics"[level=2] + (H[g2] > B"Export" + B.primary"New report")) + (G[c4 g4] > (C[p6] > V[g1] > Tx.lg"$42k" + Tx[t=supporting]"Revenue")*4) + (C[p0] > T[striped] > (TR>THC"Order"+THC"Customer"+THC"Status"+THC"Total") + (TR>TC"#101"+TC"Acme Inc"+(TC>Bd.success"Paid")+TC"$120")*5)
```

Reads as a ~990-token description of the same tree the TSX renders (AppShell, Layout, grids, cards, striped table). Baseline without this: ~950 tokens of hand-written TSX with invented imports (`@astryx/ui`, `AppShell.TopBar`, `Card.Header`), raw divs, and Tailwind classes. Same size, all signal.

## Brand pass (required after scaffolding)

Scaffolding emits stock Astryx. Then apply the brand, in order:

1. Entry imports plus Theme wrapper, fonts copied.
2. Every color to Exact-list tokens; section subtitles `body`, metadata `supporting`.
3. Tabular numerals on quantities; status vocabulary; hover dim untouched.
4. Recharts/WebGL/`@astryxdesign/lab` output replaced with hand SVG; heroicons to verified lucide.

## XLO sample (same tree, indented)

```text
A[cp6 @topNav=TN @sideNav=SN]
  L
    LC
      V[g6]
        H[j=between a=center]
          Hd"Analytics"[level=2]
          H[g2]
            B"Export"
            B.primary"New report"
```

XLO suits multi-line prompts and outlines, XLE suits one-liners.

## Template headers

All 45 templates carry their canonical structural XLE in a header comment (`// XLE (...)`). When reading or modifying any template, read the header comment first to grasp the entire component tree at ~1/5th the token cost. It is a reading aid and a drift check, not a validated artifact: for structural changes, update the header and the file together, and never the header alone. Inverse pointer: structural edits start from the header XLE — see the Templates section in `SKILL.md`.
