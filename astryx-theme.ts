import { defineTheme, type DefinedTheme, type TokenValue } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

// Astryx Styles — pure Dracula theme for `<Theme theme mode>`.
// Dark-only: Dracula is a dark spec, so both tuple slots pin the same hex
// and light-dark() resolves identically in either mode.
// Mapping mirrors glimpse glanceColorVars: Dracula accents onto valid Astryx
// tokens, plus glance --color-* vars for widget CSS compat.
// Component overrides ported verbatim from glimpse buildGlimpseTheme.

const DRA = {
  bg: '#282A36',
  fg: '#F8F8F2',
  comment: '#6272A4',
  cyan: '#8BE9FD',
  green: '#50FA7B',
  orange: '#FFB86C',
  pink: '#FF79C6',
  purple: '#BD93F9',
  red: '#FF5555',
  yellow: '#F1FA8C',
} as const;

const pin = (hex: string): [string, string] => [hex, hex];

const tokens: Record<string, TokenValue> = {
  // Dims (glimpse DIMS, frozen)
  '--space-gap': '23px',
  '--space-viewport': '15px',
  '--widget-content-vertical': '15px',
  '--widget-content-horizontal': '17px',
  '--widget-gap': '23px',
  '--tile-row': '96px',
  '--border-radius': '5px',
  '--font-size-h1': '17px',
  '--font-size-h2': '16px',
  '--font-size-h3': '15px',
  '--font-size-h4': '14px',
  '--font-size-base': '13px',
  '--font-size-h5': '12px',
  '--font-size-h6': '11px',
  // Astryx surfaces
  '--color-background-body': pin(DRA.bg),
  '--color-background-surface': pin('#2A2C39'),
  '--color-background-card': pin('#2A2C39'),
  '--color-background-popover': pin('#2D3040'),
  '--color-background-muted': pin('#313342'),
  '--color-overlay-hover': pin('#313342'),
  '--color-overlay-pressed': pin('#313342'),
  '--color-border': pin('#313342'),
  '--color-border-emphasized': pin('#424559'),
  // Astryx semantics from Dracula accents
  '--color-accent': pin(DRA.purple),
  '--color-accent-muted': pin(DRA.cyan),
  '--color-success': pin(DRA.green),
  '--color-error': pin(DRA.red),
  '--color-warning': pin(DRA.yellow),
  '--color-info': pin(DRA.cyan),
  '--color-text-primary': pin('#D3D5DE'),
  '--color-text-secondary': pin('#8489A4'),
  '--color-text-disabled': pin(DRA.comment),
  '--color-text-accent': pin(DRA.purple),
  '--color-icon-accent': pin(DRA.purple),
  '--color-on-accent': pin('#FFFFFF'),
  '--color-on-success': pin('#000000'),
  '--color-on-warning': pin('#000000'),
  '--color-on-error': pin('#FFFFFF'),
  '--color-track': pin('#313342'),
  '--color-skeleton': pin('#313342'),
  // Glance compat vars (widget CSS reads these directly)
  '--color-background': pin(DRA.bg),
  '--color-widget-background': pin('#2A2C39'),
  '--color-widget-content-border': pin('#313342'),
  '--color-text-highlight': pin('#D3D5DE'),
  '--color-primary': pin(DRA.purple),
  '--color-positive': pin(DRA.green),
  '--color-negative': pin(DRA.red),
  '--color-tag-orange': pin(DRA.orange),
  '--color-tag-pink': pin(DRA.pink),
  '--color-tag-cyan': pin(DRA.cyan),
  '--color-tag-yellow': pin(DRA.yellow),
  '--color-tag-green': pin(DRA.green),
  '--color-tag-blue': pin(DRA.purple),
  '--color-text-subdue': pin('#4C5067'),
  // Radius: Dracula kit is uniformly 5px
  '--radius-inner': '4px',
  '--radius-element': '5px',
  '--radius-container': '5px',
  '--radius-page': '5px',
};

export const astryxStylesTheme: DefinedTheme = defineTheme({
  name: 'astryx-dracula',
  extends: neutralTheme,
  tokens,
  typography: {
    scale: { base: 13, ratio: 1.2 },
    body: { family: 'JetBrains Mono', fallbacks: 'monospace' },
    heading: { family: 'JetBrains Mono', fallbacks: 'monospace', weight: 'normal' },
    code: { family: 'JetBrains Mono', fallbacks: 'monospace' },
  },
  components: {
    link: {
      base: {
        color: 'inherit',
        textDecoration: 'none',
        ':hover': { color: 'var(--color-text-highlight)' },
      },
    },
    card: {
      base: {
        backgroundColor: 'var(--color-widget-background)',
        border: '1px solid var(--color-widget-content-border)',
        borderRadius: 'var(--border-radius)',
      },
    },
    button: {
      base: {
        borderRadius: 'var(--border-radius)',
        fontWeight: 'var(--font-weight-normal)',
      },
    },
  },
});
