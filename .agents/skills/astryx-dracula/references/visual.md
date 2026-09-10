# Visual design

## Color semantics

Fixed vocabulary, no exceptions. Purple links, titles, and primary actions unvisited; visited falls back to text; hover resolves to foreground plus underline. Green positive and success. Red negative and error. Yellow tags and chips. Cyan info and secondary links. Pink flair and syntax keywords. Orange warnings and attention. Comment serves disabled and muted text and doubles as the subtle-border color. Current Line is the line highlight. Selection is selected rows and quiet surfaces.

Status surfaces resolve through muted tokens, never direct fills: each status scope redefines its muted token to the categorical tint (`--color-background-<hue>`, 10% accent wash) with a semantic accent border. Text on fills is always `#21222C`; the spec never uses raw black.

## Charts

Categorical series use nearest Dracula hues (blue goes comment). Teal uses ANSI bright cyan `#A4FFFF`, indigo ANSI bright blue `#D6ACFF`; brown has no spectral match and reuses orange. Sequential ramps cover 9 families (purple, pink, red, orange, yellow, teal, blue, shamrock, gray) with 5 lightness steps each (28/44/60/74/88), constant hue and saturation per family. Bars use `rx=4`, mono labels at 13px, values in highlight, axes in paragraph. Legends pair spectral badges with dots; never rely on color alone, labels travel with hues.

## Code highlighting

Custom spec-exact syntax theme (`draculaSyntax` in `astryx-theme.ts`): pink keywords, yellow strings, comment-gray comments, orange numbers, green functions, cyan types. Tokenizer and supported languages live in Astryx core; unknown languages render plain, which is correct. `CodeBlock` always `width="100%"`; hero snippets get `hasLineNumbers` plus `isWrapped` plus title; install steps get `hasCopyButton`; inline refs use `Code`.

## Motion and states

Hover dims 12%, press dims 20%, via the theme overlay tokens. Focus is a 2px accent ring. Table rows lift on hover. Cards, banners, badges, and progress bars are static. No entrance choreography, no card hover lifts. Motion answers action: opening, expanding, confirming.

## Scrollbars and surfaces

Scrollbars are Dracula via `tokens.css`: Current Line thumb on a transparent track, Purple on hover, thin. The spec defines no scrollbar token, so this follows its UI Design Guidelines: low-priority chrome harmonises with whatever surface it sits on (hence the transparent track), subtle affordances use Current Line, which the spec reserves for borders and separators, and hovering is an interaction, so it takes the accent. Do not lower the resting thumb to Selection `#44475A`: that lands at 1.5:1 against the background and the scrollbar disappears. Surfaces come from the spec UI palette: Background Light `#343746` cards, Selection `#44475A` quiet edges, Background Lighter `#424450` popovers, Background Dark `#21222C` shadows. Depth comes from separator borders, not elevation.
