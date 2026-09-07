# Astryx Styles — Brand

Pure Dracula, frozen. Source: https://draculatheme.com/contribute, https://spec.draculatheme.com/.
Single source: `tokens.json`. Do not add hexes; `bun scripts/audit-dracula.ts` enforces 11.

## Palette

| Role | Hex | Use |
|---|---|---|
| Background | #282A36 | page bg |
| Current line | #44475A | selection / emphasis surface |
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
green green, pink pink, cyan cyan, red red. Teal, brown, and indigo have no spectral match
and reuse cyan, orange, and purple. Sequential ramps stay at Astryx defaults.

## Code highlighting

Official Astryx `dracula` syntax preset (`syntax: dracula` in `astryx-theme.ts`):
pink keywords, yellow strings, comment gray comments, purple numbers, green functions, cyan types.

## Deliberately unset

- Motion, radius scale, color scale: neutral defaults. Dracula has no motion spec, radii are explicit tokens, and HCT color generation would fight the pinned hexes.
- Icons: neutral set inherited. No brand iconography exists.
- onDark: generated defaults inherited. The theme is dark-only; dark-surface tokens resolve from the same ramp.
- Sequential chart ramps: Astryx defaults. Brand covers categorical series only.

## Dims

Gap 23px, viewport 15px, content 15px vertical / 17px horizontal, widget-gap 23px, tile-row 96px, radius 5px everywhere, JetBrains Mono, type scale h1 17 / h2 16 / h3 15 / h4 14 / base 13 / h5 12 / h6 11.
