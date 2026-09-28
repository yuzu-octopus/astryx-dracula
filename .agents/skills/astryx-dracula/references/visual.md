# Visual design

## Color semantics

Fixed vocabulary, no exceptions. Purple links, titles, and primary actions unvisited; visited falls back to text; hover resolves to foreground plus underline. Green positive and success. Red negative and error. Yellow tags, chips, and warning states. Cyan info and secondary links. Pink flair and syntax keywords. Orange attention and constants (Orange never carries warning: `--color-warning` ships Yellow `#F1FA8C`). Comment serves disabled text and doubles as the subtle-border color; muted body text uses the same-hue AA lifts (`--color-text-secondary` `#9AA1BC`, `--color-text-paragraph` `#B0B3C4`, `--color-text-base-muted` `#8288A6` — Comment `#6272A4` fails the text floor). Current Line is the line highlight. Selection is selected rows and quiet surfaces.

Status surfaces resolve through muted tokens, never direct fills: each status scope redefines its muted token to the categorical tint (`--color-background-<hue>`, 10% accent wash) with a semantic accent border. Text on fills is always `#21222C`; the spec never uses raw black.

## Charts

**A chart mark takes a `--color-data-*` role token, never a `--dracula-*`
primitive, and the type enforces it.** `ChartLegendEntry.color`,
`DataBarSegment.color` and the `CHART_HUES` values are all `--color-data-*`
template-literal types now, so a status token or a raw hex on a data mark is a
compile error rather than a review comment. That typing caught ten real
violations when it landed: eight demo `DataBar`s painting `--color-success` /
`--color-warning` on a quota bar, which now take the matching categorical hue
(identical paint, correct role). `chart-labels.tsx` deliberately has its own
narrower union — it paints *text*, so its arms are a text role and the
`--color-on-*` role, and reusing the legend type would reject the one use it
exists for.

**Comment is legal on a graphical mark and illegal on text, and the two floors
are different rules.** `--dracula-comment` `#6272A4` is 3.36:1 on the scene
backdrop `#21222C`: it clears WCAG 1.4.11's **graphical** floor and fails the
**text** floor, and any `fillOpacity` below 0.9 makes it worse (0.85 → 2.81,
0.60 → 2.06). So an empty cell or a subtle grid line in Comment is *correct*,
and a `<text fill>` in Comment is *disabled text*. The tech-report scenes were
18 wrong here and are now all on `--color-text-paragraph` (7.59:1); their 21
graphical uses stay in Comment deliberately. Do not "improve" an empty cell to
`--color-separator`: measured on `#21222C` its ceiling is 1.73:1 at full opacity
and 1.32:1 at 0.55, and a grid whose empty cells have vanished is not a grid.
Subtle is not the same as invisible.

Categorical series use nearest Dracula hues (blue goes comment), imported from `astryx-dracula/shared/chart-hues` (`CHART_HUES` of 6: cyan/orange/green/pink/muted plus red plus the `CHART_SERIES` order of 4, purple-free by construction — purple means tappable, never data), never hand-rolled per template. Teal uses ANSI bright cyan `#A4FFFF`, indigo ANSI bright blue `#D6ACFF`; brown has no spectral match and reuses orange. Sequential ramps cover 9 families (purple, pink, red, orange, yellow, teal, blue, shamrock, gray) with 5 lightness steps each (28/44/60/74/88), constant hue and saturation per family. Bars use `rx=4`, mono labels at 13px, values in highlight, axes in paragraph. Only the heatmap-status template and the shared `RevenueChart` route SVG labels through the shared `ChartLabel` (`astryx-dracula/shared/chart-labels`: paragraph-token fill, 13px mono floor); the other ~60 raw `<text>` nodes predate the shared module — new charts must adopt it, do not retrofit old ones speculatively. KPI deltas go through the shared `MetricDelta` (`astryx-dracula/shared/metric-delta`: semibold body tinted positive/negative with a matching arrow). Legends pair spectral badges with dots; never rely on color alone, labels travel with hues.

**The purple rule is a module rule, not a token rule, and the distinction is load-bearing.** There is no `--color-data-categorical-purple`; the ban is enforced by `chart-hues.ts` exporting a purple-free `CHART_HUES` and the `ChartHue` union, not by token absence. The sequential purple ramp **ships and is sanctioned** — a magnitude ramp claims an order, not an identity, which is why purple cannot name a data series yet remains a legitimate ramp family. Two named sets, two stated remits: `CHART_HUES` owns "purple banned as a series identity", and `SCENE_HUES` in `shared/scene-hues.ts` owns "purple banned as art treatment". **Do not reuse one for the other** — `CHART_HUES` is purple-free for the categorical reason, and art tints legitimately want purple. Both are unions, so both surface as compiler errors rather than review comments.

**Ring and wash reachability is per-property, and both are subject to 1.4.11.** Core sets `el.style.backgroundColor` on selected table rows and never sets `style.boxShadow` (`grep -rn "style.boxShadow" node_modules/@astryxdesign/core/src` → 0), so a ring paints over core's background and a wash does not; the only unreachable case is a kit **wash** on a selected row. Separately, 1.4.11's first prong reads "user interface components **and states**", so a state wash is not exempt for not being a graphical object. And `--shadow-inset-hover` is Comment, ceiling **2.51:1** over the surface tier — it cannot reach 3:1 at any alpha, which is an explicit non-claim, not a passing gate.

## Code highlighting

Syntax theme (`draculaSyntax` in `astryx-theme.ts`, 14 slots per the spec Token Classification): pink keywords/operators/tags, yellow strings, comment-gray comments, orange numbers, green functions AND attributes, cyan types, purple constants, foreground variables/properties/punctuation, Background canvas. Deliberate deviations, verified on dark: constants Purple (Instance Reserved Words rule + official Dracula editors, not the Numbers bucket's Orange), attributes Green with tags Pink (official editors + core `dracula` preset, not the Support bucket's Cyan), no regexp split (core's tokenizer emits no regexp scope — regexps fall through to string/operator scopes, so strings stay spec Yellow). Tokenizer and supported languages live in Astryx core; unknown languages render plain, which is correct. `CodeBlock` always `width="100%"`; hero snippets get `hasLineNumbers` plus `isWrapped` plus title; install steps get `hasCopyButton`; inline refs use `Code`.

## Motion and states

Hover dims 12%, press dims 20%, via the theme overlay tokens. Focus is a 2px accent ring. Table rows lift on hover. Cards, banners, badges, and progress bars are static. No entrance choreography, no card hover lifts. Motion answers action: opening, expanding, confirming.

## Surfaces and background doctrine

Two backgrounds, never swapped. The page (`--color-background-body` `#282A36`,
dark) is where reading happens; the shell (`--color-background-surface`
`#343746`, lighter) is where navigation lives. Content darker than chrome is
the rule, not an accident: Dracula is a dark editor theme — the editing
surface recedes, chrome floats above it. Swapping them (light sidebar, dark
main) inverts the hierarchy and breaks the editor metaphor; no Dracula
surface does this. `variant="section"` is banned for the same reason: it
paints the shell surface instead of body and collapses the two tiers into
one. Document pages (product-tour, tech-report) use the default AppShell
variant like every fill template. Depth comes from separator borders, not
elevation.

## Scrollbars and surfaces

Scrollbars are Dracula via `tokens.css`: Current Line thumb on a transparent track (thumb-only bars read on every tier), Purple on hover. The spec defines no scrollbar token, so this follows its UI Design Guidelines: subtle affordances use Current Line, which the spec reserves for borders and separators, and hovering is an interaction, so it takes the accent. The 10px WebKit thumb (2px transparent border, content-box clip) is the shipped size, not a "thin" setting — no `scrollbar-width` anywhere, so Firefox keeps its default width and Safari falls back to overlay scrollbars (no space taken); Chrome/Firefox size via the guarded rules. Document pages (product-tour, tech-report) use the default AppShell variant like every other fill template (section ban: see Surfaces above). Do not lower the resting thumb to Selection `#44475A`: that lands at 1.5:1 against the background and the scrollbar disappears. Surfaces come from the spec UI palette: Background Light `#343746` cards, Selection `#44475A` quiet edges, Background Lighter `#424450` popovers, Background Dark `#21222C` shadows. Depth comes from separator borders, not elevation.

`variant="section"` is banned on page roots: `templates/contact-form.tsx` was the single band and is now transparent like its siblings; new pages must not reintroduce it.

## Scrollbar coverage and verification

Ownership rule: Astryx core owns scroll *containers*, this theme owns scrollbar *paint*. Core 0.3.0 themes zero scrollbar paint — no `scrollbar-color`, no `::-webkit-scrollbar` anywhere in its dist; its only scrollbar declarations are intentional layered `scrollbar-width: none` on the carousel and the transient chat autoscroll state. So one rule set in `tokens.css` paints every scroller: Firefox-only `scrollbar-color` (Current Line on page background, which Firefox inherits into nested scrollers) guarded by `@supports`, plus WebKit-only `*::-webkit-scrollbar*` sizing and hover, also guarded. Never set `scrollbar-width`: Safari ignores `scrollbar-color` when it is present and WebKit ignores the `::-webkit-scrollbar-*` rules — the two systems are mutually exclusive there, so `thin` buys big unthemed bars in Safari while breaking hover. Safari falls back to overlay scrollbars (no space taken); Chrome/Firefox size via the guarded rules. The rules are deliberately unlayered, so they beat every core layer (`reset`, `astryx-base`, `astryx-theme` per the layer-order declaration) with no `!important`. `scrollbar-width`… stays on `:root` only — a universal `*` would beat the layered `none` and un-hide the carousel. Never add a per-template scrollbar override; a template-level `overflowX` wrapper around Table fights its built-in scroll container and paints a second scrollbar — delete yours.

One scroller per surface: the document (only on `height="auto"` pages, which scroll the page by design), `LayoutContent`/`LayoutPanel` (only on `height="fill"`, which scroll internally), the SideNav middle column, Table's own `table-scroll-wrapper` (horizontal), CodeBlock's scroll container, and template-internal regions (chat thread/artifact, board, inspector, message lists — siblings, never nested on one axis). Template `overflow: clip`/`hidden` declarations are masks, not scrollers; leave them. The two SideNav workarounds in `tokens.css` (resize-handle `overflow: hidden` against the 1px permanent bar, hit-area `top: 50%`) are kept and re-verified against core 0.3.0 source — see their comments.

Viewport ownership: `Layout height="fill"` is `height: 100%`, which only resolves against a definite ancestor height. If the host chain (`<html>`/`<body>`) sets none, the layout grows to content height and the *document* scrolls instead of the template's own scroll containers — a redundant outer scrollbar. Pages that own the viewport must render inside a definite-height ancestor (`height: 100dvh` flex column; the template viewer provides it, the editor template's `pageStyle` is the consumer pattern). `height="auto"` pages (docs, long forms) legitimately scroll the document; leave them.

Verify in real Chrome (the shared headless browser paints overlay scrollbars, so colors can't be checked there): open `/templates` and `/bento`, confirm the page thumb rests Current Line and hovers Purple (transparent track, thumb-only); open any table template in the viewer and confirm exactly one vertical scroller (the template's own container — `document.documentElement.scrollHeight === clientHeight` in both the outer and the iframe documents) plus Table's own horizontal scroller at narrow widths, with no 1px permanent bar under a resizable SideNav.
