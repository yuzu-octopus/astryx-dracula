# Astryx Styles — Brand

Pure Dracula, frozen. Dark-only: no light mode exists or is planned; every tuple pins the same hex in both slots. Source: https://draculatheme.com/contribute, https://spec.draculatheme.com/.
Source of truth is `astryx-theme.ts`. Do not add hexes; `bun run audit` enforces palette and contrast.

## Palette

| Role | Hex | Use |
|---|---|---|
| Background | #282A36 | page bg |
| Current line | #6272A4 | line highlight, subtle borders (doubles as comment) |
| Selection | #44475A | selected rows, quiet surfaces |
| Background Light | #343746 | cards, surfaces |
| Background Lighter | #424450 | popovers, floating elements |
| Background Dark | #21222C | shadows |
| Foreground | #F8F8F2 | primary text on dark |
| Comment | #6272A4 | disabled / muted text |
| Cyan | #8BE9FD | info, secondary links |
| Green | #50FA7B | positive, success |
| Orange | #FFB86C | warning, attention |
| Pink | #FF79C6 | flair, accent |
| Purple | #BD93F9 | primary, links and titles unvisited |
| Red | #FF5555 | negative, error |
| Yellow | #F1FA8C | tags, chips |

## Semantic map (glimpse)

- Purple links/titles unvisited. Visited falls back to text-base, hover goes primary + underline. Users learn purple means tappable title.
- Green positive and success. Red negative and error. Yellow tags and chips. Cyan info and secondary links. Pink flair. Orange warning.
- Subdue #4C5067 for metadata and separators. Not a Dracula hex; derived from glimpse ramp for text-on-dark hierarchy.

## Charts

Categorical series use nearest Dracula hues: blue goes comment, orange orange, purple purple,
green green, pink pink, cyan cyan, red red. Teal uses ANSI bright cyan #A4FFFF and indigo
ANSI bright blue #D6ACFF; brown has no spectral match and reuses orange. Sequential ramps cover 9 families (purple, pink, red,
orange, yellow, teal, blue, shamrock, gray) with 5 lightness steps each (28/44/60/74/88),
constant hue and saturation per family.

## Code highlighting

Custom spec-exact syntax theme (`draculaSyntax` in `astryx-theme.ts`, stricter than the bundled preset):
pink keywords, yellow strings, comment gray comments, orange numbers, green functions, cyan types.

## Status surfaces

Banners, badges, and alerts resolve status through muted tokens, never direct fills.
Each status scope redefines its muted token to the categorical tint
(`--color-background-<hue>`, 10% accent wash) with a semantic accent border.
Text on fills is always `#21222C`; spec never uses raw black. Links render accent
with underline and resolve to foreground on hover. Focus and interactive edges
use Functional Purple `#815CD6`.

## Deliberately unset (neutral defaults)

Radii flat and crisp (5px elements, 4px inner). Everything below is a core default unless noted:

- Motion durations: neutral defaults (fast 175ms, medium 410ms).
- Spacing/size/ease scales: core defaults. Shadows, radii, and surfaces are Dracula-hued tokens above.
- Zero theme dependencies: icons vendored (Lucide), everything else defined here.
- Derived AA lifts (not spec hexes, same hues): secondary text #9AA1BC, muted text #8288A6, paragraph #B0B3C4, subdue #4C5067.
- Icon glyphs vendored from Lucide in `icons.tsx` (MIT). The theme also sets icon colors (primary, secondary, disabled, accent).
- onDark: generated defaults inherited. Dark-surface content resolves from the same ramp.
- `--color-data-neutral`: default gray reads fine on dark.
- No color-scale config: HCT generation would fight the pinned hexes. No light mode, ever.

## Dims

Gap 23px, viewport 15px, content 15px vertical / 17px horizontal, widget-gap 23px, tile-row 96px, radius 5px everywhere, JetBrains Mono, type scale h1 17 / h2 16 / h3 15 / h4 14 / base 13 / h5 12 / h6 11.
