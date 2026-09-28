import { defineTheme, defineSyntaxTheme, type DefinedTheme, type TokenValue } from '@astryxdesign/core/theme';
import { draculaIconRegistry } from './icons';

// Astryx Styles — pure Dracula theme for `<Theme theme mode>`.
// Dark-only: Dracula Classic is a dark spec, so both tuple slots pin the same
// value and light-dark() resolves identically in either mode.
//
// Base is Stone (spacing, shadows, motion, radii, inputs, icons); this file
// carries only Dracula color authority plus JetBrains Mono, per
// https://raw.githubusercontent.com/dracula/draculatheme.com/refs/heads/main/content/spec.mdx
// Key spec readings: Current Line #6272A4 doubles as the subtle-border color,
// Selection #44475A is the quiet surface, UI surfaces come from the spec UI
// palette, state indicators use Functional colors, text meets WCAG AA
// (verified by scripts/check.ts).

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

// Syntax mapping per the Dracula spec Token Classification
// (https://raw.githubusercontent.com/dracula/draculatheme.com/refs/heads/main/content/spec.mdx):
// keywords Pink, strings Yellow, numbers Orange, functions Green, types Cyan,
// variables + object properties Foreground, punctuation Foreground.
// Deliberate deviations, verified on dark: constants Purple (Instance Reserved
// Words rule + official Dracula editors, not the Numbers bucket's Orange);
// attributes Green and tags Pink (official editors + core `dracula` preset,
// not the Support bucket's Cyan — green attributes stay distinct from cyan
// types); regex literals get no split because core's tokenizer emits no regex
// scope and the 14-slot architecture has no room for one — they fall through
// to string/operator scopes, so string stays spec Yellow.
const draculaSyntax = defineSyntaxTheme({
  name: 'astryx-dracula',
  tokens: {
    keyword: DRA.pink,
    string: DRA.yellow,
    comment: DRA.comment,
    number: DRA.orange,
    function: DRA.green,
    type: DRA.cyan,
    variable: DRA.fg,
    operator: DRA.pink,
    constant: DRA.purple,
    tag: DRA.pink,
    attribute: DRA.green,
    property: DRA.fg,
    punctuation: DRA.fg,
    background: DRA.bg,
  },
});

// Deliberate spec deviations, mirrored in tokens.css. Spec Comment #6272A4
// measures 1.80:1 on the page background, so it cannot carry body text:
// #9AA1BC (secondary), #B0B3C4 (paragraph) and #8288A6 (base-muted) are
// same-hue lifts that clear their WCAG floors, #4C5067 (subdue) is chrome
// only and never text, and #FFD5CC is the pale surface for the inverted
// error Toast, which the spec palette does not supply. Floor checks live in
// scripts/check.ts. Do not "correct" these back to spec hexes.
const tokens: Record<string, TokenValue> = {
  // Compat dims (glance widget CSS; no Astryx collision)
  '--radius-inner': '4px',
  '--radius-element': '5px',
  '--radius-container': '5px',
  '--radius-page': '5px',
  // Chat bubbles: Stone defaults to 28px pill chat. Flat-crisp brand wins —
  // chat resolves to the same 5px element radius so bubbles read as widgets,
  // not pills. Precedence: brand doctrine > Stone default. Never restore 28px.
  '--radius-chat': '5px',
  '--font-family-mono': "'JetBrains Mono', monospace",
  '--font-size-h1': '24px',
  '--font-size-h2': '20px',
  '--font-size-h3': '16px',
  '--font-size-h4': '14px',
  '--font-size-base': '14px',
  '--font-size-h5': '13px',
  '--font-size-h6': '12px',
  // Label role pins semibold: only 400 + 600 faces ship (see tokens.css),
  // so Stone's medium 500 would synthesize. Never restore medium.
  '--text-label-weight': 'var(--font-weight-semibold)',
  '--shadow-low': '0 2px 4px #191A210D, 0 4px 8px #191A211A',
  '--shadow-med': '0 2px 4px #191A210D, 0 4px 12px #191A211A',
  '--shadow-high': '0 4px 6px #191A211A, 0 12px 24px #191A2126',
  '--shadow-inset-hover': 'inset 0px 0px 0px 2px #6272A430',
  // Current Line ring, the hover affordance. Deliberately subtle at 0x30
  // (18.82%). Composited over the surface tier #343746 it measures 1.19:1 and
  // FAILS WCAG 1.4.11 (needs 3:1). KNOWN, DOCUMENTED GAP — accepted by the
  // human, not an oversight, and NOT discharged by any gate in this repo.
  //
  // DO NOT RAISE THE ALPHA TO FIX IT. Comment #6272A4 has a CEILING of 2.51:1
  // against #343746: compositing can never exceed the pure-colour ratio, so no
  // alpha reaches 3:1 on surface, popover or muted. The colour is the limit,
  // not the value. Repinning the alpha cannot resolve this, and no gate exists
  // here precisely because a floor on an unreachable ceiling would be a
  // permanently-passing build certifying an impossible value. The selected ring
  // below IS gated, because Purple's ceiling (4.89:1) is reachable.
  // Selected ring: Purple at 0x30 alpha (48/255 = 18.82%, NOT 30% — 0x33 would
  // be 20%). This number was carried as "Purple 30%" through three rulings
  // before anyone computed the byte, so it is stated as the byte. Stone's
  // default blue has no Dracula meaning; hover already owns Current Line, so
  // selected takes the accent (verified: no other consumer reads this token in
  // core 0.3.0 — Field rings use hover/success/warning/error).
  //
  // Known gap, documented not hidden: composited over the surface tier #343746
  // this ring measures 1.38:1, under WCAG 1.4.11's 3:1 non-text floor. Purple's
  // ceiling over that surface is 4.89:1, so 3:1 IS reachable (at 65.7% alpha) —
  // this is an under-shoot, not a dead colour. scripts/check.ts holds a
  // regression floor at the measured ratio and does NOT discharge the gap.
  '--shadow-inset-selected': 'inset 0px 0px 0px 2px #BD93F930',
  '--shadow-inset-success': 'inset 0px 0px 0px 2px #50FA7B30',
  '--shadow-inset-warning': 'inset 0px 0px 0px 2px #F1FA8C30',
  '--shadow-inset-error': 'inset 0px 0px 0px 2px #FF555530',
  '--color-neutral': pin('#F8F8F21A'),
  '--color-background-inverted': pin('#F8F8F2'),
  '--color-background-error-inverted': pin('#FFD5CC'),
  // Hover tint: Stone mixes accent with this at 5-20% for checkbox/radio/
  // switch/link hovers. Pin white (dark-mode side) so hover dims lighten —
  // never black, which would fight the dim doctrine on dark.
  '--color-tint-hover': pin('#FFFFFF'),
  // Thumb/track tint base, consumed by Thumbnail/Lightbox/Spinner overlays on
  // dark imagery. Pinned to the spec Foreground, not pure white: Dracula has no
  // #FFFFFF, and the dark media scope repins --color-text-primary and
  // --color-icon-primary onto this token, so a pure white here leaked pure
  // white into every Toast's text. MUST stay a 6-digit hex literal: core's
  // Spinner (dist/Spinner/Spinner.js:140,146) string-concatenates an alpha onto
  // it, so a light-dark()/oklch()/var() form would silently break the Spinner
  // track at runtime, in a component no template renders and no gate would see.
  '--color-on-dark': pin('#F8F8F2'),
  '--color-on-light': pin('#000000'),
  // Flat-crisp brand: shadows resolve through this Dracula-hued token, not
  // Stone's cold blue. Table sticky-column edges use it directly.
  '--color-shadow': pin('#21222C'),
  '--color-accent-muted': 'var(--color-background-purple)',
  '--color-success-muted': 'var(--color-background-green)',
  '--color-warning-muted': 'var(--color-background-yellow)',
  '--color-error-muted': 'var(--color-background-red)',
  '--color-info-muted': 'var(--color-background-cyan)',
  '--space-gap': '24px',
  '--space-viewport': '16px',
  '--widget-content-vertical': '15px',
  '--widget-content-horizontal': '16px',
  '--widget-gap': '24px',
  '--tile-row': '96px',
  '--border-radius': '5px',
  // Astryx surfaces from the spec UI palette
  '--color-background-body': pin(DRA.bg),
  '--color-background-surface': pin('#343746'),
  '--color-background-card': pin('#343746'),
  '--color-background-popover': pin('#424450'),
  '--color-background-muted': pin('#44475A'),
  '--color-overlay': pin('#191A21CC'),
  '--color-overlay-hover': pin('#0000001F'),
  '--color-overlay-pressed': pin('#00000033'),
  '--color-border': pin(DRA.comment),
  // Repinned from DRA.comment (#6272A4). Core tone-bumps this token to >=3:1
  // for form-control boundaries (expandColorScale.ts:22-24), but pin() returns a
  // literal, so that guarantee is inert by construction on this theme.
  // #9AA1BC is the shipped AA lift: it clears 3:1 on all four surface tiers
  // (5.56/4.60/3.77/3.57) where the old value cleared none (3.03/2.51/2.05/1.94),
  // and it is what a DropdownMenuRadioItem boundary needs on a popover.
  // Known shortfall: the inverted surface (#F8F8F2) at 2.40, which has no live
  // consumer — only Toast.tsx paints it and its one control is a Button, which
  // reads --color-border, not -emphasized. Recorded at the site, not certified.
  '--color-border-emphasized': pin('#9AA1BC'),
  // Astryx semantics from Dracula accents (text roles AA-verified)
  '--color-accent': pin(DRA.purple),
  '--color-success': pin(DRA.green),
  '--color-error': pin(DRA.red),
  '--color-warning': pin(DRA.yellow),
  '--color-info': pin(DRA.cyan),
  '--color-text-primary': pin(DRA.fg),
  '--color-text-secondary': pin('#9AA1BC'),
  '--color-text-disabled': pin(DRA.comment),
  '--color-text-accent': pin(DRA.purple),
  '--color-icon-primary': pin(DRA.fg),
  '--color-icon-secondary': pin('#9AA1BC'),
  '--color-icon-disabled': pin(DRA.comment),
  '--color-icon-accent': pin(DRA.purple),
  '--color-on-accent': pin('#21222C'),
  '--color-on-success': pin('#21222C'),
  '--color-on-warning': pin('#21222C'),
  '--color-on-error': pin('#21222C'),
  '--color-on-info': pin('#21222C'),
  // Chart neutral: Stone's gray reads fine on dark (BRAND.md deliberate).
  '--color-data-neutral': pin('#8C939B'),
  '--color-track': pin(DRA.comment),
  '--color-skeleton': pin(DRA.comment),
  // Spec functional colors for fills, interactive borders, focus
  '--color-functional-red': pin('#DE5735'),
  '--color-functional-orange': pin('#A39514'),
  '--color-functional-green': pin('#089108'),
  '--color-functional-cyan': pin('#0081D6'),
  '--color-functional-purple': pin('#815CD6'),
  // Charts: categorical series in nearest Dracula hues. ANSI brights keep
  // teal (#A4FFFF) and indigo (#D6ACFF) distinct from their spec bases.
  //
  // Two entries are deliberately ABSENT:
  //   brown  — was byte-identical to orange. A categorical series set is a
  //            palette where distinctness IS the contract, so two names on one
  //            hex is a broken legend, not a near-duplicate. Reusing orange is
  //            fine as a documented alias, never as a second series name.
  //   purple — purple means tappable, never data, so it is barred from
  //            categorical identity. This is a MODULE rule: shared/chart-hues.ts
  //            is purple-free by construction. The SEQUENTIAL --color-data-purple-1..5
  //            ramp SURVIVES and is sanctioned — a magnitude ramp claims an order,
  //            not an identity. Revoking the ramp is a separate decision that
  //            needs the same treatment as this token.
  '--color-data-categorical-blue': pin(DRA.comment),
  '--color-data-categorical-orange': pin(DRA.orange),
  '--color-data-categorical-green': pin(DRA.green),
  '--color-data-categorical-pink': pin(DRA.pink),
  '--color-data-categorical-cyan': pin(DRA.cyan),
  '--color-data-categorical-red': pin(DRA.red),
  '--color-data-categorical-teal': pin('#A4FFFF'),
  '--color-data-categorical-indigo': pin('#D6ACFF'),
  // Categorical tints: 10% accent wash backgrounds, 30% borders, full accents
  // for text and icons. This 10/30 family is a DIFFERENT family from the
  // --shadow-inset-* family above, which sits at 0x30 = 18.82%, not 30%. A
  // repo-wide sweep for "30%" would break this true statement — leave both.
  // Stone badge, banner, and field-status scopes resolve these, so all status
  // surfaces follow Dracula with zero per-scope hacks.
  '--color-background-blue': pin('#6272A41A'),
  '--color-border-blue': pin('#6272A44D'),
  '--color-icon-blue': pin(DRA.comment),
  '--color-text-blue': pin(DRA.comment),
  '--color-background-cyan': pin('#8BE9FD1A'),
  '--color-border-cyan': pin('#8BE9FD4D'),
  '--color-icon-cyan': pin(DRA.cyan),
  '--color-text-cyan': pin(DRA.cyan),
  '--color-background-gray': pin('#9AA1BC1A'),
  '--color-border-gray': pin('#9AA1BC4D'),
  '--color-icon-gray': pin('#9AA1BC'),
  '--color-text-gray': pin('#9AA1BC'),
  '--color-background-green': pin('#50FA7B1A'),
  '--color-border-green': pin('#50FA7B4D'),
  '--color-icon-green': pin(DRA.green),
  '--color-text-green': pin(DRA.green),
  '--color-background-orange': pin('#FFB86C1A'),
  '--color-border-orange': pin('#FFB86C4D'),
  '--color-icon-orange': pin(DRA.orange),
  '--color-text-orange': pin(DRA.orange),
  '--color-background-pink': pin('#FF79C61A'),
  '--color-border-pink': pin('#FF79C64D'),
  '--color-icon-pink': pin(DRA.pink),
  '--color-text-pink': pin(DRA.pink),
  '--color-background-purple': pin('#BD93F91A'),
  '--color-border-purple': pin('#BD93F94D'),
  '--color-icon-purple': pin(DRA.purple),
  '--color-text-purple': pin(DRA.purple),
  '--color-background-red': pin('#FF55551A'),
  '--color-border-red': pin('#FF55554D'),
  '--color-icon-red': pin(DRA.red),
  '--color-text-red': pin(DRA.red),
  '--color-background-teal': pin('#A4FFFF1A'),
  '--color-border-teal': pin('#A4FFFF4D'),
  '--color-icon-teal': pin('#A4FFFF'),
  '--color-text-teal': pin('#A4FFFF'),
  '--color-background-yellow': pin('#F1FA8C1A'),
  '--color-border-yellow': pin('#F1FA8C4D'),
  '--color-icon-yellow': pin(DRA.yellow),
  '--color-text-yellow': pin(DRA.yellow),
  // Sequential ramps: constant hue/sat per Dracula family, lightness
  // 28/44/60/74/88 for dark-bg distinctness
  '--color-data-purple-5': pin('hsl(264.71 89.47% 28%)'),
  '--color-data-purple-4': pin('hsl(264.71 89.47% 44%)'),
  '--color-data-purple-3': pin('hsl(264.71 89.47% 60%)'),
  '--color-data-purple-2': pin('hsl(264.71 89.47% 74%)'),
  '--color-data-purple-1': pin('hsl(264.71 89.47% 88%)'),
  '--color-data-pink-5': pin('hsl(325.52 100% 28%)'),
  '--color-data-pink-4': pin('hsl(325.52 100% 44%)'),
  '--color-data-pink-3': pin('hsl(325.52 100% 60%)'),
  '--color-data-pink-2': pin('hsl(325.52 100% 74%)'),
  '--color-data-pink-1': pin('hsl(325.52 100% 88%)'),
  '--color-data-red-5': pin('hsl(0 100% 28%)'),
  '--color-data-red-4': pin('hsl(0 100% 44%)'),
  '--color-data-red-3': pin('hsl(0 100% 60%)'),
  '--color-data-red-2': pin('hsl(0 100% 74%)'),
  '--color-data-red-1': pin('hsl(0 100% 88%)'),
  '--color-data-orange-5': pin('hsl(31.02 100% 28%)'),
  '--color-data-orange-4': pin('hsl(31.02 100% 44%)'),
  '--color-data-orange-3': pin('hsl(31.02 100% 60%)'),
  '--color-data-orange-2': pin('hsl(31.02 100% 74%)'),
  '--color-data-orange-1': pin('hsl(31.02 100% 88%)'),
  '--color-data-yellow-5': pin('hsl(64.91 91.67% 28%)'),
  '--color-data-yellow-4': pin('hsl(64.91 91.67% 44%)'),
  '--color-data-yellow-3': pin('hsl(64.91 91.67% 60%)'),
  '--color-data-yellow-2': pin('hsl(64.91 91.67% 74%)'),
  '--color-data-yellow-1': pin('hsl(64.91 91.67% 88%)'),
  // Teal ramp derives off --color-data-categorical-teal (#A4FFFF, ANSI bright
  // cyan), the family's own named base. It previously derived off
  // hsl(190.53 96.61%) = #8BE9FD (spec Cyan), so one token name carried two
  // bases that differ by 10.5° of hue, not merely lightness. This is a
  // PROVENANCE fix only: HeatScale's family is shamrock (the human ruled), so
  // no live consumer depends on this ramp today and nothing renders the change.
  // Note the saturation: #A4FFFF is S=100% L=82%, so these steps read more
  // saturated than the S=96.61% ramps. At a glance L=74% is the step that reads
  // as "the colour changed" rather than "the ramp lightened", because it sits
  // nearest the old spec teal. Revisit if a consumer ever lands.
  '--color-data-teal-5': pin('hsl(180 100% 28%)'),
  '--color-data-teal-4': pin('hsl(180 100% 44%)'),
  '--color-data-teal-3': pin('hsl(180 100% 60%)'),
  '--color-data-teal-2': pin('hsl(180 100% 74%)'),
  '--color-data-teal-1': pin('hsl(180 100% 88%)'),
  '--color-data-blue-5': pin('hsl(225.45 26.61% 28%)'),
  '--color-data-blue-4': pin('hsl(225.45 26.61% 44%)'),
  '--color-data-blue-3': pin('hsl(225.45 26.61% 60%)'),
  '--color-data-blue-2': pin('hsl(225.45 26.61% 74%)'),
  '--color-data-blue-1': pin('hsl(225.45 26.61% 88%)'),
  '--color-data-shamrock-5': pin('hsl(135.18 94.44% 28%)'),
  '--color-data-shamrock-4': pin('hsl(135.18 94.44% 44%)'),
  '--color-data-shamrock-3': pin('hsl(135.18 94.44% 60%)'),
  '--color-data-shamrock-2': pin('hsl(135.18 94.44% 74%)'),
  '--color-data-shamrock-1': pin('hsl(135.18 94.44% 88%)'),
  '--color-data-gray-5': pin('hsl(231.43 14.89% 28%)'),
  '--color-data-gray-4': pin('hsl(231.43 14.89% 44%)'),
  '--color-data-gray-3': pin('hsl(231.43 14.89% 60%)'),
  '--color-data-gray-2': pin('hsl(231.43 14.89% 74%)'),
  '--color-data-gray-1': pin('hsl(231.43 14.89% 88%)'),
  // Glance compat vars (widget CSS reads these directly)
  '--color-background': pin(DRA.bg),
  '--color-widget-background': pin('#343746'),
  '--color-widget-content-border': pin(DRA.comment),
  '--color-widget-background-highlight': pin('#44475A'),
  '--color-separator': pin('#44475A'),
  '--color-popover-background': pin('#424450'),
  '--color-popover-border': pin(DRA.comment),
  '--color-progress-border': pin('#44475A'),
  '--color-progress-value': pin(DRA.comment),
  '--color-vertical-progress-value': pin(DRA.comment),
  '--color-graph-gridlines': pin('#44475A'),
  '--color-widget-shadow': pin('#21222C'),
  '--color-text-highlight': pin(DRA.fg),
  '--color-text-paragraph': pin('#B0B3C4'),
  '--color-text-base': pin('#9AA1BC'),
  '--color-text-base-muted': pin('#8288A6'),
  '--color-text-subdue': pin('#4C5067'),
  '--color-current-line': pin(DRA.comment),
  '--color-selection': pin('#44475A'),
  '--color-primary': pin(DRA.purple),
  '--color-positive': pin(DRA.green),
  '--color-negative': pin(DRA.red),
  '--color-tag-orange': pin(DRA.orange),
  '--color-tag-pink': pin(DRA.pink),
  '--color-tag-cyan': pin(DRA.cyan),
  '--color-tag-yellow': pin(DRA.yellow),
  '--color-tag-green': pin(DRA.green),
  '--color-tag-blue': pin(DRA.purple),
};

// Input validation tint shared by all 9 input components (stone shapes it per
// component; one const keeps the nine in lockstep).
const INPUT_STATUS = {
  'status:success': { '--color-success': DRA.green },
  'status:warning': { '--color-warning': DRA.yellow },
  'status:error': { '--color-error': DRA.red },
};

export const astryxDraculaTheme: DefinedTheme = defineTheme({
  name: 'astryx-dracula',
  icons: draculaIconRegistry,
  syntax: draculaSyntax,
  tokens,
  typography: {
    scale: { base: 14, ratio: 1.2 },
    body: { family: 'JetBrains Mono', fallbacks: 'monospace' },
    heading: { family: 'JetBrains Mono', fallbacks: 'monospace', weight: 'normal' },
    code: { family: 'JetBrains Mono', fallbacks: 'monospace' },
  },
  motion: { fast: 175, medium: 410, slow: 975, ratio: 0.75 },
  components: {
    'app-shell': {
      // Shell paint pinned at theme level so template variant props stay
      // frozen: wash/elevated chrome resolves to body #282A36, surface/section
      // chrome to surface #343746. Matches core's elevated-default mapping
      // today, so zero visual change — drift protection only.
      'variant:wash': { backgroundColor: 'var(--color-background-body)' },
      'variant:elevated': { backgroundColor: 'var(--color-background-body)' },
      'variant:surface': { backgroundColor: 'var(--color-background-surface)' },
      'variant:section': { backgroundColor: 'var(--color-background-surface)' },
    },
    link: {
      base: {
        color: 'var(--color-text-accent)',
        textDecoration: 'underline',
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
    banner: {
      base: {
        borderRadius: 'var(--border-radius)',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: 'var(--color-text-primary)',
      },
      'status:info': {
        '--color-accent-muted': 'var(--color-background-cyan)',
        borderColor: 'var(--color-info)',
      },
      'status:success': {
        '--color-success-muted': 'var(--color-background-green)',
        borderColor: 'var(--color-success)',
      },
      'status:warning': {
        '--color-warning-muted': 'var(--color-background-yellow)',
        borderColor: 'var(--color-warning)',
      },
      'status:error': {
        '--color-error-muted': 'var(--color-background-red)',
        borderColor: 'var(--color-error)',
      },
    },
    statusdot: {
      // Cyan info dot: the status vocabulary's info hue. New variant values
      // are picked up by `astryx theme build`, which generates both the CSS
      // and the StatusDotVariantMap augmentation (see
      // astryx-dracula.variants.d.ts). Core renders unknown variants without
      // a fill, so this rule is the fill — do not delete it while
      // variant:info call sites exist.
      'variant:info': {
        backgroundColor: DRA.cyan,
      },
    },
    'progressbar-fill': {
      'variant:accent': {
        backgroundColor: DRA.purple,
      },
      'variant:success': {
        backgroundColor: DRA.green,
      },
      'variant:warning': {
        backgroundColor: DRA.yellow,
      },
      'variant:error': {
        backgroundColor: DRA.red,
      },
      // Neutral/disabled fill borrowed a TEXT token (core `.x16fr6go` =
      // var(--color-text-disabled)). Both resolve to #6272A4 so this is a
      // zero-delta token-hygiene fix: the bar stops depending on a text role.
      'variant:neutral': {
        backgroundColor: 'var(--color-progress-value)',
      },
      'variant:disabled': {
        backgroundColor: 'var(--color-progress-value)',
      },
    },
    'text-input': INPUT_STATUS,
    textarea: INPUT_STATUS,
    'number-input': INPUT_STATUS,
    'date-input': INPUT_STATUS,
    'time-input': INPUT_STATUS,
    selector: INPUT_STATUS,
    'multi-selector': INPUT_STATUS,
    typeahead: INPUT_STATUS,
    tokenizer: INPUT_STATUS,
    switch: {
      base: {
        '--color-background-gray': 'var(--color-skeleton)',
      },
    },
  // Toast type rules: info rides the inverted surface, error rides the pale
  // #FFD5CC surface, so the existing --color-background-error-inverted token
  // is consumed here (it was otherwise orphaned). Dark text on the pale
  // surface keeps error toasts assertive without a dark-on-dark wash.
  toast: {
    'type:info': {
      backgroundColor: 'var(--color-background-inverted)',
      color: 'var(--color-on-light)',
    },
    'type:error': {
      backgroundColor: 'var(--color-background-error-inverted)',
      color: 'var(--color-on-light)',
    },
  },
  'field-status': {
    'type:success': {
      backgroundColor: 'var(--color-background-green)',
    },
    'type:warning': {
      backgroundColor: 'var(--color-background-yellow)',
    },
    'type:error': {
      backgroundColor: 'var(--color-background-red)',
    },
  },
    // Tooltip: core hardcodes an inverted pair with no mode branch
    // (dist/astryx.css:587 `.x19aspcf` = background-color var(--color-text-primary),
    // :656 `.xrkvqaz` = color var(--color-background-surface)), while useTooltip's
    // own JSDoc promises "dark background, light text" — an inversion that only
    // holds on a LIGHT theme. On our dark-only brand it rendered a #F8F8F2 box
    // on a #282A36 page. Repainted as the floater tier Popover already uses
    // (#424450) with Popover's own depth cue (--shadow-low); the tooltip
    // container has no shadow class in core, so without it a #424450 rect
    // reads as a pale patch at 1.48:1 rather than a floater. 9.06:1 on text.
    tooltip: {
      base: {
        backgroundColor: 'var(--color-background-popover)',
        color: 'var(--color-text-primary)',
        boxShadow: 'var(--shadow-low)',
      },
    },
    // HoverCard is a floater but core paints it on the CHROME tier
    // (`.x10xzikg` = var(--color-background-surface), #343746), not the popover
    // tier Popover/ContextMenu/DropdownMenu use. Opened from inside a #343746
    // SideNav it had 1:1 surface separation and only --shadow-med to read as
    // floating. Promoted to the floater tier. Known: --color-text-secondary
    // drops 4.60:1 -> 3.77:1 inside a HoverCard. Latent, not live — no template
    // renders <HoverCard>; the three "HoverCard" hits are catalog metadata.
    hovercard: {
      base: {
        backgroundColor: 'var(--color-background-popover)',
      },
    },
    // Text on a status fill is always #21222C via --color-on-*, per dracula-ui
    // and the brand's on-fill rule. StatusDot already does this (core
    // `.xri61p4` / `.x1m024r3`); AvatarStatusDot inherited
    // `--color-background-surface` (#343746) instead — a chrome tier used as
    // on-fill text. Same variant slot StatusDot uses, so both dots agree.
    'avatar-status-dot': {
      'variant:success': { color: 'var(--color-on-success)' },
      'variant:error': { color: 'var(--color-on-error)' },
    },
  },
  // Inverted-surface passthrough: core's MediaTheme defaults collapse accent
  // to white on dark surfaces, which would un-purple every button/link inside
  // an inverted Toast. Purple stays the accent on dark media so tappable
  // still reads tappable there.
  onDark: {
    tokens: { '--color-accent': pin(DRA.purple) },
  },
});
