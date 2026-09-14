# Astryx Styles — Brand

Pure Dracula, frozen. Dark-only: no light mode exists or is planned; every tuple pins the same hex in both slots. Source: https://draculatheme.com/contribute, https://spec.draculatheme.com/.
Source of truth is `astryx-theme.ts`. Do not add hexes; `bun run audit` enforces palette and contrast.

## Palette

| Role | Hex | Use |
|---|---|---|
| Background | #282A36 | page bg |
| Current line | #6272A4 | line highlight, subtle borders (doubles as comment)[^current-line] |
| Selection | #44475A | selected rows, quiet surfaces |
| Background Light | #343746 | cards, surfaces |
| Background Lighter | #424450 | popovers, floating elements |
| Background Dark | #21222C | shadows, on-fill text |
| Darker | #191A21 | shadow washes only (never a surface: `--shadow-*` alpha blends) |
| Foreground | #F8F8F2 | primary text on dark |
| Comment | #6272A4 | disabled text, subtle borders |
| Cyan | #8BE9FD | info, secondary links |
| Green | #50FA7B | positive, success |
| Orange | #FFB86C | attention, constants (never warning) |
| Pink | #FF79C6 | flair, accent |
| Purple | #BD93F9 | primary, links and titles unvisited |
| Red | #FF5555 | negative, error |
| Yellow | #F1FA8C | tags, chips, warning states |
| Inverted error | #FFD5CC | pale surface for the inverted error Toast (not a spec hex) |

[^current-line]: Upstream pins both Current Line and Comment to #6272A4. This kit follows suit for line affordances, including scrollbar thumbs in `tokens.css`. Do not "correct" one of them to #44475A.

## Semantic map (glimpse)

- Purple links/titles unvisited. Visited falls back to text-base, hover goes primary + underline. Users learn purple means tappable title.
- Green positive and success. Red negative and error. Yellow tags, chips, and warning states (`--color-warning` ships Yellow; Orange never carries warning). Cyan info and secondary links. Pink flair. Orange attention and constants.
- Subdue #4C5067 for separators and hairline chrome, never text (1.8:1 on the page background, 1.5:1 on cards). Not a Dracula hex; derived from the glimpse ramp for chrome hierarchy.

## Charts

Categorical series use nearest Dracula hues: blue goes comment, orange orange, purple purple (compat token only — purple means tappable, never encode data),
green green, pink pink, cyan cyan, red red. Teal uses ANSI bright cyan #A4FFFF and indigo
ANSI bright blue #D6ACFF; brown has no spectral match and reuses orange. Sequential ramps cover 9 families (purple, pink, red,
orange, yellow, teal, blue, shamrock, gray) with 5 lightness steps each (28/44/60/74/88),
constant hue and saturation per family.

## Code highlighting

Syntax theme (`draculaSyntax` in `astryx-theme.ts`, 14 slots per the spec Token Classification):
pink keywords/operators/tags, yellow strings, comment-gray comments, orange numbers, green functions and attributes, cyan types, purple constants, foreground variables/properties/punctuation, Background canvas. Regexps get no split (core's tokenizer emits no regexp scope); attributes/tags follow the official Dracula editors and the core `dracula` preset, not the Support bucket's Cyan.

## Status surfaces

Banners, badges, and alerts resolve status through muted tokens, never direct fills.
Each status scope redefines its muted token to the categorical tint
(`--color-background-<hue>`, 10% accent wash) with a semantic accent border.
Text on fills is always `#21222C`; spec never uses raw black. Links render accent
with underline and resolve to foreground on hover. Focus and interactive edges
use accent, not Functional Purple: `--color-functional-*` is pinned for spec parity
(token compat — never encode status in these) and no shipped component consumes it.

## Interactions

Buttons darken on hover; destructive pairs red fill with dark text. Links render accent
underlined and resolve to foreground on hover. Focus rings use accent, not Functional
Purple: 5.9 contrast beats 3.0 on dark backgrounds, verified by keyboard screenshot.
Inputs take accent and error rings from core; table rows lift on hover. Cards, banners,
badges, and progress bars are static.

## Deliberately unset (neutral defaults)

Radii flat and crisp (5px elements, 4px inner). Everything below is a core default unless noted:

- Motion durations: neutral defaults (fast 175ms, medium 410ms).
- Spacing/size/ease scales: core defaults. Shadows, radii, and surfaces are Dracula-hued tokens above.
- One runtime dependency: `lucide-react` (icons render from it at runtime, both the theme `draculaIconRegistry` in `icons.tsx` and every template's direct imports — `bun run audit` fails when a registered glyph stops resolving to a real export). Everything else is defined here.
- Derived AA lifts (not spec hexes, same hues): secondary text #9AA1BC, muted text #8288A6, paragraph #B0B3C4. Subdue #4C5067 is chrome, below every text floor.
- Icon glyphs from Lucide in `icons.tsx` (MIT). The theme also sets icon colors (primary, secondary, disabled, accent).
- onDark: generated defaults inherited. Dark-surface content resolves from the same ramp.
- `--color-data-neutral`: default gray reads fine on dark.
- No color-scale config: HCT generation would fight the pinned hexes. No light mode, ever.

## Dims

Gap 24px, viewport 16px, content 15px vertical / 16px horizontal, widget-gap 24px, tile-row 96px, radius 5px everywhere, JetBrains Mono, type scale base 14 ratio 1.2, generated steps 12 / 14 / 17 / 20 / 24. The pinned heading tokens are compat dims, not a strict 1.2 ladder: h1 24 / h2 20 / h3 16 / h4 14 / h5 13 / h6 12, body 14, supporting 12. Astryx `Heading` sizes come from the scale roles instead, so level 3 renders the 17px `lg` step. Outer Card padding 4, nested inset 3. Touch targets 24px floor, 44 where touch matters.
