// Kit checks: Dracula palette purity plus WCAG contrast floors.
// Run with `bun scripts/check.ts`.
import { isValidElement } from 'react';
import * as lucideReact from 'lucide-react';
import { draculaIconRegistry } from '../icons';
export {};

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
}

function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Alpha-composite an accent wash over the card surface, as the browser does
// for 10% categorical tint backgrounds.
function mix(fg: string, alpha: number, bg: string): string {
  const c = (h: string) => parseInt(h.slice(1), 16);
  const [f, b] = [c(fg), c(bg)];
  const ch = (i: number) => {
    const fv = (((i === 0 ? f >> 16 : i === 1 ? (f >> 8) & 255 : f & 255) / 255) * alpha);
    const bv = (((i === 0 ? b >> 16 : i === 1 ? (b >> 8) & 255 : b & 255) / 255) * (1 - alpha));
    return Math.round((fv + bv) * 255).toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

let failed = false;
const fail = (msg: string) => {
  console.error(msg);
  failed = true;
};

// Palette purity: every official hex present in tokens.css, plus fonts and
// fresh build outputs.
const expected: Record<string, string> = {
  bg: '#282A36',
  currentLine: '#6272A4',
  selection: '#44475A',
  fg: '#F8F8F2',
  comment: '#6272A4',
  cyan: '#8BE9FD',
  green: '#50FA7B',
  orange: '#FFB86C',
  pink: '#FF79C6',
  purple: '#BD93F9',
  red: '#FF5555',
  yellow: '#F1FA8C',
};

const css = await Bun.file('tokens.css').text();
const themeSrc = await Bun.file('astryx-theme.ts').text();
for (const [name, hex] of Object.entries(expected)) {
  if (!css.toLowerCase().includes(hex.toLowerCase())) fail(`missing ${name} ${hex} in tokens.css`);
}
if (!css.includes('@font-face')) fail('missing @font-face block in tokens.css');
// The demo serves the showcase under /astryx-dracula/, so the woff2 files must
// exist under BOTH fonts/ and public/fonts/, and the @font-face URLs must be
// base-scoped (never bare /fonts/, which 404s on Pages).
for (const dir of ['fonts', 'public/fonts']) {
  for (const face of ['JetBrainsMono-Regular.woff2', 'JetBrainsMono-SemiBold.woff2']) {
    if (!(await Bun.file(`${dir}/${face}`).exists()))
      fail(`missing ${dir}/${face}${dir === 'public/fonts' ? ' (copy fonts/ to public/fonts/)' : ''}`);
  }
}
if (css.includes("url('/fonts/")) fail("tokens.css @font-face must be base-scoped (/astryx-dracula/fonts/), not bare /fonts/");
// A MISSING theme.css is a hard failure, not a skipped check. This used to
// read `const built = ...catch(() => '')` and then guard the entire dark-only
// invariant on `if (built)`, so `rm theme.css && bun scripts/check.ts` printed
// "kit checks PASS" and exited 0: the one file every other build-output gate
// below reasons about, deleted, and the gate certified its absence. A guard
// that turns "I could not read the evidence" into "nothing to check" is the
// worst shape an enforcement gate can take, because it reads as coverage.
const built = await Bun.file('theme.css').text().catch(() => null);
if (built === null) {
  fail('theme.css is missing or unreadable — run `bun run theme:build`; the dark-only invariant and every other build-output check below are unverifiable without it');
}

// Dark-only invariant: every light-dark() tuple OUR layer emits must have
// identical branches. Nothing else enforces it, so a future pin() that drifts to
// a real light value would ship a half-light brand silently.
//
// The splitter is BALANCED-PAREN, and that is not a style choice: the obvious
// regex terminates the second argument on the first ")" it meets, and 45 of our
// tokens are hsl(...) ramp values, so a regex reports all 45 asymmetric and the
// gate ships red on day one. A red-by-design gate gets disabled within a week
// and then protects nothing. Also fails a tuple whose argument count is not 2,
// since a 1- or 3-tuple silently drops a branch.
const lightDarkTuples = (src: string): { at: number; parts: string[] }[] => {
  const out: { at: number; parts: string[] }[] = [];
  for (const m of src.matchAll(/light-dark\(/g)) {
    let i = m.index! + m[0].length;
    let depth = 1;
    const parts: string[] = [];
    let cur = '';
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '(') { depth++; cur += c; continue; }
      if (c === ')') { depth--; if (depth === 0) { parts.push(cur); break; } cur += c; continue; }
      if (c === ',' && depth === 1) { parts.push(cur); cur = ''; continue; }
      cur += c;
    }
    out.push({ at: m.index!, parts: parts.map((p) => p.trim()) });
  }
  return out;
};

// Inner span of every `@layer <name> { … }` block. The depth counter, not the
// first `}`, decides where a layer ends, so a nested @scope or :root brace
// cannot truncate it; comments and quoted strings are skipped so a brace inside
// either cannot desync the count. An unterminated block runs to EOF: scanning
// too much fails the gate on core's tuples, scanning too little would pass it
// while checking nothing.
const layerSpans = (src: string, name: string): Array<[number, number]> => {
  const spans: Array<[number, number]> = [];
  for (const m of src.matchAll(new RegExp(`@layer\\s+${name}\\s*\\{`, 'g'))) {
    const start = m.index + m[0].length;
    let depth = 1;
    let i = start;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? src.length : e + 1; continue; }
      if (c === '"' || c === "'") { const e = src.indexOf(c, i + 1); i = e < 0 ? src.length : e; continue; }
      if (c === '{') depth++;
      else if (c === '}' && --depth === 0) { i++; break; }
    }
    spans.push([start, i]);
  }
  return spans;
};
// The tuple self-check below is reachable only because the read above now
// fails loudly. Under `if (built)` it sat inside the very guard that would
// have triggered it: a present-but-empty or truncated theme.css reached the
// gate, produced zero tuples, and the `!tuples.length` line meant to catch
// exactly that was dead code. Do not reintroduce a truthiness guard here.
// The gate is scoped to `@layer astryx-theme`, not the whole file. Since CLI
// 0.6.3 `theme build` emits core's entire default palette as a baseline in
// `@layer astryx-base` ahead of ours, and layer order makes our values win, the
// brand invariant is a statement about what WE emit — core's baseline is not
// ours to assert on. If a future CLI stops emitting that baseline, this scoping
// degrades to checking everything we emit, which is the same rule as before.
if (built !== null) {
  if (!built.includes('astryx-dracula')) fail('theme.css stale: rebuild with `bun run theme:build`');
  const theme = layerSpans(built, 'astryx-theme');
  const tuples = lightDarkTuples(built).filter((t) => theme.some(([s, e]) => t.at >= s && t.at < e));
  if (!tuples.length) fail('no light-dark() tuples found in @layer astryx-theme of theme.css — dark-only invariant unverified');
  for (const { parts: t } of tuples) {
    if (t.length !== 2) fail(`malformed light-dark(${t.join(', ')}): expected 2 branches, got ${t.length} — a wrong arity silently drops one`);
    else if (t[0].toLowerCase() !== t[1].toLowerCase())
      fail(`asymmetric light-dark(${t[0]}, ${t[1]}) in @layer astryx-theme of theme.css — dark-only brand: both branches must be identical`);
  }
  console.log(`PASS light-dark symmetry ${tuples.length} tuples (@layer astryx-theme, dark-only)`);
}

// tokens.css must stay UNLAYERED. Its scrollbar rules, the reduced-motion block
// and the scroll-margin rules all rely on being outside every cascade layer:
// unlayered author rules beat layered ones regardless of specificity, verified
// in Chromium. One @layer here and all of them break silently. This assertion
// exists so the next agent cannot "tidy" them in without reading why.
//
// Comments are stripped first, for the same reason the !important gate strips
// them: the rationale for this rule lives in a comment that necessarily NAMES
// @layer, and a gate that fails on the documentation of the rule it enforces
// gets disabled on day one and then protects nothing.
if (css.replace(/\/\*[\s\S]*?\*\//g, '').includes('@layer'))
  fail('tokens.css must stay unlayered — its scrollbar, reduced-motion and scroll-margin rules depend on outranking every core layer');

// Every registered glyph must resolve to a real lucide-react export, so a
// lucide rename (AlertTriangle, CheckCircle) fails here instead of rendering
// a blank icon.
const lucideExports: Array<unknown> = Object.values(lucideReact);
for (const [name, element] of Object.entries(draculaIconRegistry)) {
  if (!isValidElement(element) || !lucideExports.includes(element.type)) {
    fail(`icon ${name} is not a lucide-react export`);
  }
}

// Contrast floors per the Dracula spec (WCAG 2.1 AA 4.5 for body text).
//
// EVERY COLOUR BELOW IS A LOOKUP, never a literal. This table used to hardcode
// both hexes of all 28 pairs, which meant the gate could not fail on ANY
// theme change: repin --color-text-secondary to a 2.25:1 value, run the
// documented `bun run theme:build`, and the gate still printed
// `PASS text-secondary/bg 5.56` — a number for a colour the page does not
// ship — then `kit checks PASS`, exit 0, while `theme:check` said upToDate. It
// was certifying a table, not the theme. A gate that cannot fail is worse than
// no gate, because it is trusted. So each row names two tokens and the ratio
// is computed from the theme's own values.
//
// A name that does not resolve is a FAILURE, never a skip. That is what
// catches a wrong token name: the old `text-muted/bg` row measured
// `--color-text-muted`, which does not exist — the real token is
// --color-text-base-muted — and a literal could not tell. It is also what
// stops the next rename from quietly deleting a row's coverage.
//
// Dynamic import, not a static one: check.ts runs standalone via bun and the
// theme module must load from the working tree at check time. Read here
// because the contrast rows are the first consumer; the pin-symmetry check
// further down reuses the same map.
const themeImport = await import('../astryx-theme.js');
const inputTokens = (themeImport.astryxDraculaTheme.__inputTokens ?? {}) as Record<string, [string, string] | string>;

// Resolves a token to #RRGGBB or #RRGGBBAA, following a var() indirection.
// Returns null for an unknown name, an hsl() ramp or a reference cycle, so the
// caller fails loudly rather than measuring a substitute colour.
const tokenHex = (name: string, seen = new Set<string>()): string | null => {
  const v = inputTokens[name];
  if (v === undefined) return null;
  const raw = (Array.isArray(v) ? v[0] : v).trim();
  const ref = raw.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/);
  if (ref) {
    if (seen.has(ref[1])) return null;
    seen.add(ref[1]);
    return tokenHex(ref[1], seen);
  }
  return /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(raw) ? raw.toUpperCase() : null;
};
const solid = (h: string) => h.slice(0, 7);
const alphaOf = (h: string) => (h.length === 9 ? parseInt(h.slice(7, 9), 16) / 255 : 1);

// wash: the background token carries an alpha and is composited over the card
// tier, exactly as the browser does it. The alpha comes from the token's own
// byte (0x1A = 26/255 = 10.2%), so repinning the wash is now a gate event
// instead of a silent visual change.
type ContrastRow = { name: string; fg: string; bg: string; floor: number; wash?: boolean };
const pairs: ContrastRow[] = [
  { name: 'text-primary/bg', fg: '--color-text-primary', bg: '--color-background-body', floor: 4.5 },
  { name: 'text-secondary/bg', fg: '--color-text-secondary', bg: '--color-background-body', floor: 4.5 },
  { name: 'text-secondary/surface', fg: '--color-text-secondary', bg: '--color-background-surface', floor: 4.5 },
  // Disabled text is chrome by definition and exempt from 1.4.3, so it carries
  // a 2.5 floor rather than an AA one.
  { name: 'text-disabled/bg', fg: '--color-text-disabled', bg: '--color-background-body', floor: 2.5 },
  { name: 'text-accent/bg', fg: '--color-text-accent', bg: '--color-background-body', floor: 3.0 },
  { name: 'text-paragraph/bg', fg: '--color-text-paragraph', bg: '--color-background-body', floor: 4.5 },
  { name: 'text-base-muted/bg', fg: '--color-text-base-muted', bg: '--color-background-body', floor: 3.0 },
  // --color-text-subdue is the one token below every text floor: it is a legacy
  // glance compat value for chrome (separators, hairline rules), never text,
  // so it is pinned to chrome minimums instead of an AA threshold.
  { name: 'text-subdue/bg (chrome only, never text)', fg: '--color-text-subdue', bg: '--color-background-body', floor: 1.5 },
  { name: 'text-subdue/card (chrome only, never text)', fg: '--color-text-subdue', bg: '--color-background-card', floor: 1.3 },
  { name: 'on-accent/accent', fg: '--color-on-accent', bg: '--color-accent', floor: 3.0 },
  { name: 'on-success/success', fg: '--color-on-success', bg: '--color-success', floor: 3.0 },
  { name: 'on-warning/warning', fg: '--color-on-warning', bg: '--color-warning', floor: 3.0 },
  { name: 'on-error/error', fg: '--color-on-error', bg: '--color-error', floor: 3.0 },
  { name: 'on-info/info', fg: '--color-on-info', bg: '--color-info', floor: 3.0 },
  // Accent focus ring on both tiers. core paints it as
  // `outline: 2px solid var(--color-accent)` (astryx.css, :focus-visible), so
  // the non-text 1.4.11 floor of 3.0 is the right one.
  //
  // The old `visited/body` row is GONE, and the lookup is what proved it had
  // to go: it measured #9AA1BC on #282A36, and there is no visited token to
  // resolve that to — core 0.6.3 emits no `:visited` rule anywhere (zero hits
  // across dist/) and this theme pins no visited value, so a visited link
  // renders in --color-text-accent like every other link. The row was a
  // hardcoded certificate for a state the page never paints, which is the
  // defect this table just had. A visited state that ships one day needs a
  // real token and a row here.
  { name: 'focus-accent/body', fg: '--color-accent', bg: '--color-background-body', floor: 3.0 },
  { name: 'focus-accent/surface', fg: '--color-accent', bg: '--color-background-surface', floor: 3.0 },
  // Destructive Button: .x1pjz0fi fills var(--color-error) and .x1m024r3 paints
  // var(--color-on-error), so this resolves to the same pair as on-error/error
  // above. Kept as its own row because it names a distinct component, and it
  // is the row that would move first if the Button's on-fill token were split
  // from the status-dot one.
  { name: 'destructive/error', fg: '--color-on-error', bg: '--color-error', floor: 3.0 },
  // The two INVERTED rows used to measure #21222C, which this theme does not
  // paint on either surface: the toast rules resolve to --color-on-light
  // (astryx-theme.ts, toast type:info / type:error). Reading the token instead
  // of the literal is what exposed that, and the corrected pair is the one the
  // page actually renders.
  { name: 'on-light/pale-error', fg: '--color-on-light', bg: '--color-background-error-inverted', floor: 4.5 },
  { name: 'on-light/inverted', fg: '--color-on-light', bg: '--color-background-inverted', floor: 4.5 },
  { name: 'separator/bg', fg: '--color-separator', bg: '--color-background-body', floor: 1.3 },
  // border-em: 3.0, not 1.5. The floor is the WCAG 1.4.11 tier core's own
  // expandColorScale.ts:22-24 promises for form-control boundaries, which
  // pin() makes inert. Popover is a REAL adjacent tier, not a hypothetical one:
  // DropdownMenuRadioItem.tsx:84 reads this token and DropdownMenu paints
  // --color-background-popover. Muted is included for the same reason.
  { name: 'border-em/card',    fg: '--color-border-emphasized', bg: '--color-background-card',    floor: 3.0 },
  { name: 'border-em/popover', fg: '--color-border-emphasized', bg: '--color-background-popover', floor: 3.0 },
  { name: 'border-em/muted',   fg: '--color-border-emphasized', bg: '--color-background-muted',   floor: 3.0 },
  // Status text on a status wash: core paints --color-text-cyan
  // (astryx.css .x1txnczv) over the --color-background-<hue> wash this theme
  // feeds the Banner status scopes. Renamed from `banner-*/text`, which named
  // a component the banner does not paint that way — the Banner's own base
  // rule sets --color-text-primary — so the old name described a pair nothing
  // rendered, which is the same defect as a hardcoded hex.
  { name: 'status-info/wash',    fg: '--color-text-cyan',   bg: '--color-background-cyan',   floor: 3.0, wash: true },
  { name: 'status-success/wash', fg: '--color-text-green',  bg: '--color-background-green',  floor: 3.0, wash: true },
  { name: 'status-warning/wash', fg: '--color-text-yellow', bg: '--color-background-yellow', floor: 3.0, wash: true },
  { name: 'status-error/wash',   fg: '--color-text-red',    bg: '--color-background-red',    floor: 3.0, wash: true },
];
{
  const card = tokenHex('--color-background-card');
  for (const row of pairs) {
    const fgHex = tokenHex(row.fg);
    const bgHex = tokenHex(row.bg);
    if (!fgHex) { fail(`FAIL ${row.name}: ${row.fg} is not a theme token carrying a hex value`); continue; }
    if (!bgHex) { fail(`FAIL ${row.name}: ${row.bg} is not a theme token carrying a hex value`); continue; }
    if (alphaOf(fgHex) < 1) {
      fail(`FAIL ${row.name}: ${row.fg} is translucent (#${fgHex.slice(1)}); a foreground over an unknown backdrop is not measurable`);
      continue;
    }
    const alpha = alphaOf(bgHex);
    if (alpha < 1 && !card) { fail(`FAIL ${row.name}: ${row.bg} is a wash and --color-background-card will not resolve`); continue; }
    const bg = alpha < 1 ? mix(solid(bgHex), alpha, solid(card!)) : solid(bgHex);
    const r = ratio(solid(fgHex), bg);
    if (r < row.floor) fail(`FAIL ${row.name} ${r.toFixed(2)} (floor ${row.floor}, ${row.fg} on ${row.bg})`);
    else console.log(`PASS ${row.name} ${r.toFixed(2)} (${row.fg} on ${row.bg})`);
  }
}

// Selected-ring regression floor. Composited from the token's OWN hex over the
// surface tier rather than pinned as a literal, so it catches a hue change as
// well as an alpha change — pinning "BD93F930" as a string would only ever
// catch the second.
//
// THIS GATE DOES NOT DISCHARGE THE ACCESSIBILITY GAP. WCAG 1.4.11 non-text is
// 3:1 and this ring measures 1.38:1, so the ring currently FAILS. The floor is
// the measured value, not 3:1, for one reason: a gate that is red by design gets
// disabled within a week and then protects nothing while still reading as
// coverage. Purple's ceiling over #343746 is 4.89:1, so 3:1 IS reachable (at
// 65.7% alpha) — this is an under-shoot, not a dead colour, and a later pass
// can raise it. Until then the gap is a human decision, tracked in
// astryx-theme.ts next to the token.
//
// --shadow-inset-hover is deliberately NOT gated: Comment #6272A4's ceiling over
// the same surface is 2.51:1 and unreachable at ANY alpha, so a floor there
// would be a permanently-passing build certifying a value that cannot meet
// 1.4.11 at all. Refusing to certify it is the correct outcome, not an omission.
// Floor is the measured 1.3761:1 rounded DOWN to 1.37, so float error cannot
// fail a passing build. The next alpha step (0x4D) measures 1.68:1, so a real
// regression is a 0.3 jump — far outside this tolerance.
const RING_FLOOR = 1.37;
// The surface tier is a token lookup, not a literal: pinning '#343746' here
// meant a repin of --color-background-card left this gate measuring against a
// surface the page no longer paints, which is the same defect the contrast
// table just had.
const SURFACE_TIER = tokenHex('--color-background-card');
if (!SURFACE_TIER) fail('FAIL cannot resolve --color-background-card to compute the ring regression floor');
const ringHex = themeSrc.match(/'--shadow-inset-selected':\s*'inset 0px 0px 0px 2px #([0-9A-Fa-f]{8})'/);
// Both halves are guarded, so neither measurement can be skipped: the surface
// lookup above and the ring's own alpha byte. A guard on only one of them is
// how this file used to certify a ring it never measured.
if (ringHex && SURFACE_TIER) {
  const rgb = `#${ringHex[1].slice(0, 6)}`;
  const alphaByte = parseInt(ringHex[1].slice(6, 8), 16);
  const alphaPct = (alphaByte / 255) * 100;
  const composited = mix(rgb, alphaByte / 255, SURFACE_TIER);
  const r = ratio(composited, SURFACE_TIER);
  if (r < RING_FLOOR) fail(`FAIL inset-selected/ring ${r.toFixed(2)}:1 over ${SURFACE_TIER} (regression floor ${RING_FLOOR}; alpha byte 0x${ringHex[1].slice(6, 8)} = ${alphaPct.toFixed(2)}%) — does NOT meet 1.4.11, which needs 3:1`);
  else console.log(`PASS inset-selected/ring ${r.toFixed(2)}:1 over ${SURFACE_TIER} (alpha 0x${ringHex[1].slice(6, 8)} = ${alphaPct.toFixed(2)}%, below the 3:1 1.4.11 floor — documented gap, not discharged here)`);
} else fail('FAIL cannot read --shadow-inset-selected alpha and --color-background-card to compute the ring regression floor');
// Theme provenance gates: read astryx-theme.ts source (never built output).
// Pins are counted here; the symmetry check itself runs further down against
// the theme's input map, loaded above for the contrast table.
const pins = [...themeSrc.matchAll(/pin\(\s*(['"])(.*?)\1\s*\)/g)].map((m) => m[2]);
if (!pins.length) fail('no pin() tuples found in astryx-theme.ts');
console.log(`PASS pin() tuples ${pins.length} (symmetric dark-only)`);
// Tuple symmetry: every theme token tuple must pin the same hex twice
// (dark-only). Checked against the same input map the contrast table reads.
if (!Object.keys(inputTokens).length) fail('theme input map is empty — pin() symmetry unverified');
for (const [k, v] of Object.entries(inputTokens ?? {})) {
  if (Array.isArray(v) && v[0] !== v[1]) fail(`asymmetric tuple ${k}: ${v[0]} vs ${v[1]} (dark-only: pin both slots)`);
}

// Single-letter gates folded into one table. Each asserts INTENT — the right
// token, with an alpha where the token is a wash — not an exact literal, so a
// legitimate hex or alpha change passes and a wrong-token change fails. The
// three that used to pin full literal strings could not catch a value that
// drifted from the string's own meaning, which is how "selected ring Purple
// 30%" survived three rulings against a value that is 0x30 = 18.82%.
// Strip comments first so a provenance note may name a rejected value.
const themeCode = themeSrc.replace(/\/\/.*$/gm, '');
const themeGates: Array<[RegExp, string]> = [
  // Selected ring: Purple + a 2-digit alpha byte. 0x30 is 18.82%, NOT 30%.
  [
    /'--shadow-inset-selected':\s*'inset 0px 0px 0px 2px #BD93F9([0-9A-Fa-f]{2})'/,
    '--shadow-inset-selected must pin Purple #BD93F9 with a 2-digit alpha (0x30 = 18.82%, not 30%)',
  ],
  [
    /'--radius-chat':\s*'([0-9]+px)'/,
    '--radius-chat must stay a px radius (flat-crisp: Stone default 28px pill rejected)',
  ],
  [
    /'--text-label-weight':\s*'var\(--font-weight-(\w+)\)'/,
    '--text-label-weight must reference a shipped face (only 400 + 600 exist)',
  ],
];
for (const [re, msg] of themeGates) {
  const m = themeCode.match(re);
  if (!m) fail(msg);
  else console.log(`PASS theme gate ${msg.split(' must ')[0]}`);
}
// The label-weight gate above proves the face EXISTS, not that it is the
// semibold the role requires: 400 is a shipped face too.
if (!/label-weight':\s*'var\(--font-weight-semibold\)'/.test(themeCode))
  fail('--text-label-weight must pin semibold (only 400 + 600 faces ship)');
// Toast consumption: the pale inverted error surface must be consumed by a
// toast type rule, and onDark must keep the purple accent on dark media.
if (!themeSrc.includes('--color-background-error-inverted')) fail('orphan --color-background-error-inverted: no toast rule consumes it');
if (!themeSrc.includes('type:error')) fail('missing toast type:error rule');
if (!themeSrc.includes('type:info')) fail('missing toast type:info rule');
if (!themeSrc.includes('onDark')) fail('missing onDark accent passthrough (#BD93F9 on dark media)');
// --color-on-dark / --color-on-light must stay 6-digit hex literals. Core's
// Spinner (dist/Spinner/Spinner.js:140,146) builds its onMedia track by STRING
// CONCATENATION: `${themeTokens['--color-on-dark']}4D`. A light-dark(),
// oklch() or var() form parses fine everywhere else and breaks the Spinner
// track at runtime, in a component no template renders and no other gate sees.
for (const t of ['--color-on-dark', '--color-on-light']) {
  const m = themeCode.match(new RegExp(`'${t}':\\s*pin\\('(#[0-9A-Fa-f]{6})'\\)`));
  if (!m) fail(`${t} must be a 6-digit hex literal — Spinner concatenates an alpha onto it (Spinner.js:140,146)`);
}


// Source lint gates. These are a DIFFERENT gate family from the build-output
// assertions above and deliberately kept separate: a build-output gate proves
// the generated theme still carries a rule, a source lint proves OUR files do
// not misuse a token. Neither covers the other, and a future reader should not
// assume one stands in for the other.
//
// Scans templates/ demo/ shared/ source, never built output. variant="section"
// paints the shell surface tier instead of body and collapses the two tiers
// into one, so it is banned outright — the allowlist that used to hold it was
// empty, which made its `if` always true. A Layout without an explicit height
// prop silently takes fill, which only resolves against a definite ancestor
// height — hero/document pages need auto, app panes fill.
const lintFiles: string[] = [];
for (const dir of ['templates', 'demo', 'shared']) {
  for (const ext of ['tsx', 'ts', 'css']) {
    const glob = new Bun.Glob(`${dir}/*.{ts,tsx,css}`);
    for await (const f of glob.scan('.')) if (f.endsWith(ext)) lintFiles.push(f);
  }
}
// Finds the `>` closing a JSX opening tag. Inside `{...}` expressions `>`
// is a comparison or arrow token, never the tag end, so only a depth-0 `>`
// counts. Quoted strings only matter at depth 0 (`a="a>b"`); inside braces
// quote tracking would mistake apostrophes in text for string starts.
const findTagEnd = (src: string, start: number): number => {
  let depth = 0;
  let quote: string | null = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (depth > 0) {
      if (c === '{') depth++;
      else if (c === '}') depth--;
      continue;
    }
    if (quote) {
      if (c === quote && src[i - 1] !== '\\') quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '{') depth++;
    else if (c === '>') return i;
  }
  return -1;
};
for (const f of lintFiles.sort()) {
  const src = await Bun.file(f).text();
  const line = (i: number) => src.slice(0, i).split('\n').length;
  for (const m of src.matchAll(/variant=\{?["']section["']\}?/g)) {
    fail(`${f}:${line(m.index!)} variant="section" paints the shell surface tier instead of body — use the default AppShell variant`);
  }
  // weight="bold" AND weight="medium": only 400 and 600 faces ship, so both
  // would synthesize. medium was ungated and is a real breach, not a
  // hypothetical — the token existing is precisely why the call must not.
  for (const m of src.matchAll(/weight=\{?["'](bold|medium)["']\}?/g)) {
    fail(`${f}:${line(m.index!)} weight="${m[1]}" — only 400 + 600 faces ship; the label role already owns semibold`);
  }
  // A prop regex cannot see a style object, which is how ide.tsx:81
  // `fontWeight: 700` shipped through a gate whose whole purpose was catching
  // unshipped weight requests. Watch the literal form too.
  for (const m of src.matchAll(/fontWeight:\s*['"]?(500|700)['"]?/g)) {
    fail(`${f}:${line(m.index!)} fontWeight: ${m[1]} — only 400 + 600 faces ship; use the Text role instead`);
  }
  // --color-text-subdue is chrome only: 1.80:1 on the page and 1.49:1 on the
  // widget surface, the latter BELOW the 1.3/1.5 floors this same file already
  // asserts for the token. Nothing enforced the "never text" intent, so a
  // template could ship an unreadable foreground with every other check green.
  // Chrome positions (border-color, background-color, outline, fill on a
  // non-text shape) are allowed; a bare `color:` is not.
  for (const m of src.matchAll(/(?:^|[;{\s])color:\s*['"]?var\(--color-text-subdue\)/g)) {
    fail(`${f}:${line(m.index!)} --color-text-subdue used as a foreground (chrome only: borders, separators, backgrounds)`);
  }
  for (const m of src.matchAll(/(?:color|stroke|fill)=['"]?\{?['"]?var\(--color-text-subdue\)/g)) {
    fail(`${f}:${line(m.index!)} --color-text-subdue used as a foreground via a style prop (chrome only)`);
  }
  // The inverse alias: a well-intentioned "simplify the muted step" edit that
  // points --color-text-base-muted back down at subdue would silently restore
  // the 1.80:1 failure while every other check stays green. Without this the
  // gate can be defeated by renaming rather than by using the token.
  for (const m of src.matchAll(/--color-text-base-muted['"]?\s*:\s*[^;]*var\(--color-text-subdue\)/g)) {
    fail(`${f}:${line(m.index!)} --color-text-base-muted must not alias to --color-text-subdue — subdue is chrome only and unreadable as text`);
  }
  for (const m of src.matchAll(/<Layout(?=[\s>])/g)) {
    const end = findTagEnd(src, m.index + '<Layout'.length);
    const tag = end === -1 ? '' : src.slice(m.index, end + 1);
    if (!/height\s*=/.test(tag)) fail(`${f}:${line(m.index!)} <Layout> missing explicit height (auto for hero/document pages, fill for app panes)`);
  }
}

// Zero !important, anywhere we author. Unlayered already outranks every core
// layer on cascade order, so !important is never the answer here — it is only
// ever a way to stop noticing which layer you are actually in.
//
// Two exemptions, both for the same reason, and a gate that fails on the
// documentation or the implementation of the rule it enforces gets disabled on
// day one and then protects nothing:
//   - comments are stripped, because tokens.css states this rule in its header;
//   - scripts/check.ts is exempt entirely, because this gate is where the
//     pattern and its failure message live. It ships nothing.
// Everything else is strict, matching the tradeoff the other gates already
// make: a false positive is cheap, a forgotten !important is not.
for (const f of ['tokens.css', 'astryx-theme.ts', ...lintFiles]) {
  const src = (await Bun.file(f).text()).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of src.matchAll(/!important/g)) {
    fail(`${f}:${src.slice(0, m.index).split('\n').length} !important — unlayered outranks every core layer; fix the layer, not the priority`);
  }
}

// ── Link, underline and divider discipline ─────────────────────────────────
//
// Three rules a review does not hold, because each is a plausible-looking LOCAL
// fix for a problem that is actually a token problem: hand-rolling
// textDecoration, painting a Button as a Link, reaching for a Divider where a
// Stack gap belongs. They are one block because they share a walk.

// Comments are blanked rather than deleted, so every newline survives and a
// match still reports the line it is really on. This is the !important gate's
// exemption applied to a second rule: each of these rules has to be statable
// in prose somewhere, and a gate that fails on the documentation of the rule it
// enforces gets disabled on day one and then protects nothing.
const stripComments = (src: string): string => {
  let out = '';
  let prev = ''; // last non-whitespace character emitted
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    // `//` after a `:` is a URL scheme, not a comment — the one place a JSX
    // attribute or a string legitimately carries two slashes.
    if (c === '/' && src[i + 1] === '/' && prev !== ':') {
      while (i < src.length && src[i] !== '\n') { out += ' '; i++; }
      i--;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      for (i += 2; i < src.length && !(src[i] === '*' && src[i + 1] === '/'); i++) out += src[i] === '\n' ? '\n' : ' ';
      out += '  ';
      i++;
      continue;
    }
    if (c !== ' ' && c !== '\t') prev = c;
    out += c;
  }
  return out;
};

// 1. NO HAND-ROLLED UNDERLINE. astryx-theme.ts overrode `link.base` with
// `textDecoration: 'underline'`, which shipped as `.astryx-link { text-decoration:
// underline }`: every link in all 45 templates became permanently underlined and
// core's documented `hasUnderline` prop went inert — silently, with every other
// gate green. The property is the symptom and the theme override was the cause,
// so this sweeps the SAME file set as the !important gate above, astryx-theme.ts
// and tokens.css included, not only template source. Banned outright, value and
// all: the prop is `hasUnderline` in running prose, and nothing in navigation.
for (const f of ['tokens.css', 'astryx-theme.ts', ...lintFiles]) {
  const code = stripComments(await Bun.file(f).text());
  for (const m of code.matchAll(/text-?decoration/gi)) {
    fail(`${f}:${code.slice(0, m.index).split('\n').length} hand-rolled text-decoration — core's Link already carries it; pass hasUnderline in prose and nothing in navigation`);
  }
}

// 2a. NO RAW <a>. A raw anchor is a BYPASS, not a style choice. It paints the
// browser's default link colour and its own underline on a #282A36 page, so
// the palette claim in BRAND.md stops holding the moment one ships; and it
// evades every verb check in 2b below, because that walk only reads <Link.
// `core`'s <Link> IS an anchor — it just carries the theme's colour, the
// hasUnderline contract and the gate. No exception is carved: the tree
// carries zero raw anchors today, so the gate is green on day one and the
// first one to appear is a real finding. Comments are blanked first for the
// reason the underline gate above states — the rule has to be statable in
// prose somewhere, and a gate that fails on its own documentation gets
// disabled on day one.
//
// 2b. NO <Link> RENDERING AN ACTION. A link is a destination; a button is an
// action. A Button painted as a Link announces "link" to a screen reader for
// something that acts, and hands it the navigation affordance.
//
// The verb list is DERIVED FROM THE SPACE OF ACTIONS, not from the settings
// copy this repo happens to ship. Each word has to survive one test: could
// this same word, as the first word of a link label, name a PLACE? If yes it
// is a destination far more often than it is an operation, and a gate that
// hard-fails on it cries wolf on correct sites — which is how a gate gets
// disabled and then protects nothing while still reading as coverage.
//
//   dropped as destinations: Create ("Create a free account" — the commonest
//     marketing CTA there is, and a Link by this repo's own semantics.md §1),
//     Edit ("Edit profile"), Add ("Add to calendar"), Request ("Request a
//     quote"), Confirm ("Confirm your email"). Five of the old thirteen.
//   kept as actions: Delete, Remove, Save, Submit, Cancel, Disconnect,
//     Deactivate, Log out.
//   added, because a real action uses them and the old list could not see it:
//     Update, Change, Upgrade, Download, Copy, Share, Send, Publish, Archive,
//     Restore, Reset, Import, Export, Approve, Reject, Enable, Disable.
//
// The boundary is (?=\s|$) and NOT \b. A word boundary matches between "Add"
// and the hyphen in "Add-ons", so the old pattern flagged a compound noun;
// requiring whitespace or end-of-label admits "Delete account" and "Log out"
// while refusing "Add-ons" and "Address".
const ACTION_VERBS = [
  'Approve', 'Archive', 'Cancel', 'Change', 'Copy', 'Deactivate', 'Delete',
  'Disable', 'Disconnect', 'Download', 'Enable', 'Export', 'Import', 'Log out',
  'Publish', 'Reject', 'Remove', 'Reset', 'Restore', 'Save', 'Send', 'Share',
  'Submit', 'Update', 'Upgrade',
];
const actionVerbs = ACTION_VERBS.map((v) => [v, new RegExp(`^${v}(?=\\s|$)`, 'i')] as const);

// The escape hatch, and the ONLY one: one human ruling per site, keyed
// `file:line` — the same string the message prints, so a site is found and
// added with one grep. It exempts BOTH tiers, which matters because a
// navigation label like "Edit history" is a true positive on the verb and a
// false positive on the rule, and "remove the verb" is not an answer to that.
// A line that moves falls out of the table, which is the intent and not a bug:
// the sentence around it changed, so somebody should read it again. That is
// also why the dead-key check below exists — a key that matches nothing is a
// ruling that has silently stopped ruling.
const ACTION_LINK_ALLOW: Record<string, true> = {
  // Currently EMPTY, and that is a result rather than an oversight.
  // templates/login-sso.tsx:190 ("Request access", prose) was the one entry
  // and needed no longer be exempt: "Request" left ACTION_VERBS above because
  // "Request a quote" is a destination, so that site no longer trips the
  // verb gate at all. A stale key would have been the rottable-exemption case
  // the check below now reports, so it is gone rather than left to rot.
};

// The two tiers, and why the second one cannot fail.
//
// Tier 1 hard-fails: a <Link> whose first word is an action verb and which does
// not ask for hasUnderline is a control painted as a destination. Tier 2 is a
// REVIEW: same verb, but hasUnderline, which means the site sits inside running
// prose where the verb describes the sentence rather than being the affordance.
//
// THIS TIER CANNOT FAIL, and that is the correct trade rather than an
// oversight. Hard-failing prose would leave the author two bad options —
// drop the underline, losing the 1.4.1/F73 cue that colour alone is not enough
// inline, or bend the copy to dodge a verb list. Both costs land on whoever
// ships the fix, so the honest outcome is a signal a human reads, not a red
// build. The signal is the point: every tier-2 site is collected and printed,
// then counted in one summary line, so it cannot scroll past and
// "kit checks PASS" cannot quietly hide a prose link nobody has ruled on.
// Grep for ^REVIEW to list them; an allowlist entry is the ruling.
const reviewTier: string[] = [];
const allowHits = new Set<string>();

for (const f of lintFiles.sort()) {
  const src = await Bun.file(f).text();
  const code = stripComments(src);
  for (const m of code.matchAll(/<a(?=[\s>])/g)) {
    fail(`${f}:${code.slice(0, m.index).split('\n').length} raw <a> — use core's <Link>, which carries the Dracula link colour, the hasUnderline contract and the action-verb gate below; a raw anchor paints the browser default on the page and bypasses all three`);
  }
  for (const m of src.matchAll(/<Link(?=[\s>])/g)) {
    const end = findTagEnd(src, m.index! + '<Link'.length);
    if (end === -1) continue;
    const at = `${f}:${src.slice(0, m.index).split('\n').length}`;
    // Literal text only. A label behind {…} is unknown to a source walk, and
    // guessing at it is how a gate starts failing on sites it cannot read.
    const label = (src.slice(end + 1).match(/^\s*([^<{][^<]{0,60})/)?.[1] ?? '').replace(/\s+/g, ' ').trim();
    const verb = actionVerbs.find(([, re]) => re.test(label))?.[0];
    if (!verb) continue;
    if (at in ACTION_LINK_ALLOW) {
      allowHits.add(at);
      continue;
    }
    // hasUnderline means the site sits in running prose, where the verb
    // describes the sentence rather than being the affordance. That downgrades
    // a hard fail to a human review; it does not silence it.
    if (!/hasUnderline/.test(src.slice(m.index, end + 1))) {
      fail(`${at} <Link> labelled "${label}" renders an action as a destination — use Button, or if this is genuinely navigation add '${at}' to ACTION_LINK_ALLOW in scripts/check.ts`);
    } else {
      reviewTier.push(`REVIEW ${at} <Link> labelled "${verb}…" with hasUnderline — prose or control? if prose, add '${at}' to ACTION_LINK_ALLOW in scripts/check.ts`);
    }
  }
}

// A dead allowlist key is a ruling that stopped ruling: the line moved, the
// label changed, or the verb left the list, and the table still claims a
// human said yes. Keyed by file:line, any edit above a key invalidates it, so
// nothing else in this file would ever notice.
for (const key of Object.keys(ACTION_LINK_ALLOW)) {
  if (!allowHits.has(key)) {
    fail(`ACTION_LINK_ALLOW key "${key}" matched no site — the line moved, the label changed, or the verb left ACTION_VERBS; delete the key or re-check the site at that line`);
  }
}

if (reviewTier.length) {
  for (const line of reviewTier) console.log(line);
  console.log(`REVIEW ${reviewTier.length} prose <Link>(s) awaiting a human ruling — ships green by design, see the comment above; grep ^REVIEW to list them`);
} else {
  console.log('REVIEW 0 prose <Link>(s)');
}

// 3. DIVIDER DENSITY. A divider is a section boundary, not a row background —
// one at most inside a panel, never one per row. Counted per authored file.
//
// Threshold read off the tree rather than off taste: of 45 templates, 36 hold
// 0–1 <Divider>, none holds 5 or more, and the maximum is 4
// (templates/payment-form.tsx, then demo/App.tsx) — 43 across the whole tree.
// Six is above every site we ship, so the gate is green on day one and a
// template must reach 1.5x the worst current one before it speaks. Raise it
// only against a number, never against a hunch.
const DIVIDER_DENSITY_MAX = 6;
for (const f of lintFiles.sort()) {
  const n = [...(await Bun.file(f).text()).matchAll(/<Divider(?=[\s>/])/g)].length;
  if (n > DIVIDER_DENSITY_MAX) {
    fail(`${f} has ${n} <Divider> (max ${DIVIDER_DENSITY_MAX}) — a divider is a section boundary, not a row background; a settings panel is a handful of groups, not a rule per row`);
  }
}

// package.json `exports` must agree with what is actually in shared/, in BOTH
// directions. The map is hand-maintained, so the two drift silently:
//   - a deleted module leaves an entry pointing at a file that no longer
//     exists, and it ships in the published tarball because `files` globs
//     shared/ independently of `exports`. That is exactly how
//     shared/heat-scale.ts survived a deletion and stayed published.
//   - a new module without an entry fails only in a CONSUMER's tsc, never in
//     ours, so the breakage lands on someone else.
// One gate, both directions, because the second failure is the expensive one:
// it costs a downstream user a build error and costs us a bug report.
{
  const pkg = JSON.parse(await Bun.file('package.json').text());
  const declared = new Map<string, string>();
  for (const [k, v] of Object.entries(pkg.exports ?? {}) as [string, string][]) {
    if (k.startsWith('./shared/')) declared.set(k, v);
  }
  // Keys are extensionless on BOTH sides: `exports` keys are specifiers
  // ('./shared/scene-hues'), so comparing them to filenames would report
  // every module as unexported.
  const onDisk = new Set<string>();
  for (const entry of [...new Bun.Glob('shared/*.{ts,tsx}').scanSync('.')]) {
    onDisk.add(`./shared/${entry.slice('shared/'.length).replace(/\.tsx?$/, '')}`);
  }
  for (const [key, target] of declared) {
    if (!(await Bun.file(target).exists())) {
      fail(`package.json exports "${key}" -> ${target}, which does not exist`);
    }
  }
  for (const key of onDisk) {
    if (!declared.has(key)) {
      fail(`${key} has no package.json exports entry — consumers cannot import it`);
    }
  }
}

// The version string is baked into two templates as RENDERED text and again in
// each one's XLE header — four copies of one number across two files, which is
// the same hand-maintained-numeral trap as the exports map above and the same
// one documentation.tsx fell into with "twenty-eight". Nothing connected them
// to package.json, so a release could ship a showcase advertising a version
// that no longer exists.
//
// Derived, not asserted by hand: this reads package.json and checks the
// templates against it, so there is nothing to refresh at release time.
{
  const pkg = JSON.parse(await Bun.file('package.json').text());
  const v = String(pkg.version);
  for (const f of ['templates/product-tour.tsx', 'templates/centered-hero.tsx']) {
    const src = await Bun.file(f).text();
    const found = [...src.matchAll(/v(\d+\.\d+\.\d+)/g)].map(m => m[1]);
    if (found.length === 0) {
      fail(`${f} carries no version badge — expected "v${v}"`);
    }
    for (const seen of new Set(found)) {
      if (seen !== v) {
        fail(`${f} advertises v${seen} but package.json is ${v} — a release must not ship a showcase naming a version that does not exist`);
      }
    }
  }
}
// Chart vocabulary: the chart modules must speak in --color-data-* ROLE tokens
// and never reach for a --dracula-* primitive.
//
// SCOPED DELIBERATELY, and the scoping is the whole point. A blanket "no
// --dracula-* anywhere in shared/" was proposed by a consumer and is WRONG: it
// would flag ~40 legitimate sites in scene-castle.tsx and scene-tile.tsx, which
// have a separate and stated remit (SCENE_HUES is art treatment, where purple
// is banned as a series identity but legitimate as pigment). A gate that cries
// wolf on 40 correct sites gets disabled on day one and then protects nothing.
// So this covers the chart vocabulary, and the exemption is named rather than
// silent so a future reader can see it was decided.
//
// WHY THIS EXISTS AT ALL: the previous gate read the CHART_HUES OBJECT, which
// proves nothing about the rest of the tree. sparkline.tsx shipped a literal
// `var(--dracula-green)` through 0.3.0 in the same release that banned them, so
// a consumer vendoring two files had a test comparing their sparkline fill to
// their CHART_HUES.green fail on a version bump — their code was fine, our two
// files had stopped agreeing. Reading an object is not a tree walk.
{
  const CHART_MODULES = [
    'shared/sparkline.tsx',
    'shared/revenue-chart.tsx',
    'shared/data-bar.tsx',
    'shared/chart-legend.tsx',
    'shared/chart-labels.tsx',
    'shared/metric-delta.tsx',
  ];
  // scene-hues / scene-tile / scene-castle / scene-frame are scene ART, not
  // chart marks: see the comment above before adding one of them here.
  for (const f of CHART_MODULES) {
    const src = (await Bun.file(f).text()).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of src.matchAll(/var\(--dracula-[a-z-]+\)/g)) {
      const line = src.slice(0, m.index).split('\n').length;
      fail(`${f}:${line} ${m[0]} on a chart mark — use a --color-data-* role token via shared/chart-hues (values are byte-identical; this is vocabulary, not appearance)`);
    }
  }
}

// A declared token is not an applied token.
//
// Until core+CLI 0.6.3, --text-display-2-size was defined in the theme and
// applied by NOTHING: core 0.3.0's Heading emitted no data-type, and the 0.3.0
// CLI emitted no .astryx-heading[data-type] rule. 24 templates asked for
// type="display-2" and every one of them rendered at core's 24px level-1
// default instead of the 35px they declared. It looked correct, it was
// correct in light mode, three consumers did not notice, and only a pixel
// diff between two builds found it.
//
// Every other gate here checks that a value is CORRECT. This one checks that
// the value can REACH the element at all, which is the failure mode that
// passes every other check, every build, and every code review.
{
  const built = await Bun.file('theme.css').text();
  const used = new Set<string>();
  for (const entry of [...new Bun.Glob('{templates,shared}/*.tsx').scanSync('.')]) {
    const src = await Bun.file(entry).text();
    for (const m of src.matchAll(/<(Heading|Text)\b[^>]*?type="(display-[0-9])"/g)) {
      used.add(`${m[1]}|${m[2]}`);
    }
  }
  for (const use of [...used].sort()) {
    const [el, type] = use.split('|');
    if (!built.includes(`.astryx-${el.toLowerCase()}[data-type="${type}"]`)) {
      fail(`${type} is consumed on <${el}> in this repo but theme.css has no .astryx-${el.toLowerCase()}[data-type="${type}"] rule — the size is DECLARED but UNREACHABLE, so the component silently falls back to its default. Add the rule, or stop consuming the type.`);
    }
  }
}

if (failed) process.exit(1);
console.log('kit checks PASS');
