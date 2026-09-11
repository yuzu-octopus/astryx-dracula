# Visual design

## Color semantics

Fixed vocabulary, no exceptions. Purple links, titles, and primary actions unvisited; visited falls back to text; hover resolves to foreground plus underline. Green positive and success. Red negative and error. Yellow tags and chips. Cyan info and secondary links. Pink flair and syntax keywords. Orange warnings and attention. Comment serves disabled and muted text and doubles as the subtle-border color. Current Line is the line highlight. Selection is selected rows and quiet surfaces.

Status surfaces resolve through muted tokens, never direct fills: each status scope redefines its muted token to the categorical tint (`--color-background-<hue>`, 10% accent wash) with a semantic accent border. Text on fills is always `#21222C`; the spec never uses raw black.

## Charts

Categorical series use nearest Dracula hues (blue goes comment), imported from `astryx-dracula/shared/chart-hues` (`CHART_HUES` / `CHART_SERIES` — purple-free by construction), never hand-rolled per template. Teal uses ANSI bright cyan `#A4FFFF`, indigo ANSI bright blue `#D6ACFF`; brown has no spectral match and reuses orange. Sequential ramps cover 9 families (purple, pink, red, orange, yellow, teal, blue, shamrock, gray) with 5 lightness steps each (28/44/60/74/88), constant hue and saturation per family. Bars use `rx=4`, mono labels at 13px, values in highlight, axes in paragraph. Every hand-drawn SVG label goes through the shared `ChartLabel` (`astryx-dracula/shared/chart-labels`: paragraph-token fill, 13px mono floor), and KPI deltas go through the shared `MetricDelta` (`astryx-dracula/shared/metric-delta`: semibold body tinted positive/negative with a matching arrow). Legends pair spectral badges with dots; never rely on color alone, labels travel with hues.

## Code highlighting

Custom spec-exact syntax theme (`draculaSyntax` in `astryx-theme.ts`): pink keywords, yellow strings, comment-gray comments, orange numbers, green functions, cyan types. Tokenizer and supported languages live in Astryx core; unknown languages render plain, which is correct. `CodeBlock` always `width="100%"`; hero snippets get `hasLineNumbers` plus `isWrapped` plus title; install steps get `hasCopyButton`; inline refs use `Code`.

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

Scrollbars are Dracula via `tokens.css`: Current Line thumb on a transparent track (thumb-only bars read on every tier), Purple on hover, thin. The spec defines no scrollbar token, so this follows its UI Design Guidelines: the track pins `--color-background` so every scroller reads as one surface instead of borrowing whatever sits behind it (a transparent track showed the unpainted canvas as a black gutter, then picked up header/surface tints per page), subtle affordances use Current Line, which the spec reserves for borders and separators, and hovering is an interaction, so it takes the accent. Document pages (product-tour, tech-report) use the default AppShell variant like every other fill template (section ban: see Surfaces above). Do not lower the resting thumb to Selection `#44475A`: that lands at 1.5:1 against the background and the scrollbar disappears. Surfaces come from the spec UI palette: Background Light `#343746` cards, Selection `#44475A` quiet edges, Background Lighter `#424450` popovers, Background Dark `#21222C` shadows. Depth comes from separator borders, not elevation.

`variant="section"` is banned on page roots: `templates/contact-form.tsx` was the single band and is now transparent like its siblings; new pages must not reintroduce it.

## Scrollbar coverage and verification

Ownership rule: Astryx core owns scroll *containers*, this theme owns scrollbar *paint*. Core 0.3.0 themes zero scrollbar paint — no `scrollbar-color`, no `::-webkit-scrollbar` anywhere in its dist; its only scrollbar declarations are intentional layered `scrollbar-width: none` on the carousel and the transient chat autoscroll state. So one rule set in `tokens.css` paints every scroller: Firefox-only `scrollbar-color` (Current Line on page background, which Firefox inherits into nested scrollers) guarded by `@supports`, plus WebKit-only `*::-webkit-scrollbar*` sizing and hover, also guarded. Never set `scrollbar-width`: Safari ignores `scrollbar-color` when it is present and WebKit ignores the `::-webkit-scrollbar-*` rules — the two systems are mutually exclusive there, so `thin` buys big unthemed bars in Safari while breaking hover. Safari falls back to overlay scrollbars (no space taken); Chrome/Firefox size via the guarded rules. The rules are deliberately unlayered, so they beat every core layer (`reset`, `astryx-base`, `astryx-theme` per the layer-order declaration) with no `!important`. `scrollbar-width`… stays on `:root` only — a universal `*` would beat the layered `none` and un-hide the carousel. Never add a per-template scrollbar override; a template-level `overflowX` wrapper around Table fights its built-in scroll container and paints a second scrollbar — delete yours.

One scroller per surface: the document (only on `height="auto"` pages, which scroll the page by design), `LayoutContent`/`LayoutPanel` (only on `height="fill"`, which scroll internally), the SideNav middle column, Table's own `table-scroll-wrapper` (horizontal), CodeBlock's scroll container, and template-internal regions (chat thread/artifact, board, inspector, message lists — siblings, never nested on one axis). Template `overflow: clip`/`hidden` declarations are masks, not scrollers; leave them. The two SideNav workarounds in `tokens.css` (resize-handle `overflow: hidden` against the 1px permanent bar, hit-area `top: 50%`) are kept and re-verified against core 0.3.0 source — see their comments.

Viewport ownership: `Layout height="fill"` is `height: 100%`, which only resolves against a definite ancestor height. If the host chain (`<html>`/`<body>`) sets none, the layout grows to content height and the *document* scrolls instead of the template's own scroll containers — a redundant outer scrollbar. Pages that own the viewport must render inside a definite-height ancestor (`height: 100dvh` flex column; the template viewer provides it, the editor template's `pageStyle` is the consumer pattern). `height="auto"` pages (docs, long forms) legitimately scroll the document; leave them.

Verify in real Chrome (the shared headless browser paints overlay scrollbars, so colors can't be checked there): open `/templates` and `/bento`, confirm the page thumb rests Current Line and hovers Purple (transparent track, thumb-only); open any table template in the viewer and confirm exactly one vertical scroller (the template's own container — `document.documentElement.scrollHeight === clientHeight` in both the outer and the iframe documents) plus Table's own horizontal scroller at narrow widths, with no 1px permanent bar under a resizable SideNav.
