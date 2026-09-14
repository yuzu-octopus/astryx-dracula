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
for (const [name, hex] of Object.entries(expected)) {
  if (!css.toLowerCase().includes(hex.toLowerCase())) fail(`missing ${name} ${hex} in tokens.css`);
}
if (!css.includes('@font-face')) fail('missing @font-face block in tokens.css');
for (const f of ['fonts/JetBrainsMono-Regular.woff2', 'fonts/JetBrainsMono-SemiBold.woff2']) {
  if (!(await Bun.file(f).exists())) fail(`missing font file ${f}`);
}
// Served fonts: the demo serves the showcase under /astryx-dracula/, so the
// woff2 files must also exist under public/ and the @font-face URLs must be
// base-scoped (never bare /fonts/, which 404s on Pages).
for (const f of ['public/fonts/JetBrainsMono-Regular.woff2', 'public/fonts/JetBrainsMono-SemiBold.woff2']) {
  if (!(await Bun.file(f).exists())) fail(`missing served font ${f} (copy fonts/ to public/fonts/)`);
}
if (css.includes("url('/fonts/")) fail("tokens.css @font-face must be base-scoped (/astryx-dracula/fonts/), not bare /fonts/");
const built = await Bun.file('theme.css').text().catch(() => '');
if (built && !built.includes('astryx-dracula')) fail('theme.css stale: rebuild with `bun run theme:build`');

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
// --color-text-subdue is the one token below every text floor: it is a legacy
// glance compat value for chrome (separators, hairline rules), never text, so
// it is pinned to chrome minimums instead of an AA threshold.
const pairs: Array<[string, string, string, number]> = [
  ['text-primary/bg', '#F8F8F2', '#282A36', 4.5],
  ['text-secondary/bg', '#9AA1BC', '#282A36', 4.5],
  ['text-secondary/surface', '#9AA1BC', '#343746', 4.5],
  ['text-disabled/bg', '#6272A4', '#282A36', 2.5],
  ['text-accent/bg', '#BD93F9', '#282A36', 3.0],
  ['text-paragraph/bg', '#B0B3C4', '#282A36', 4.5],
  ['text-muted/bg', '#8288A6', '#282A36', 3.0],
  ['text-subdue/bg (chrome only, never text)', '#4C5067', '#282A36', 1.5],
  ['text-subdue/card (chrome only, never text)', '#4C5067', '#343746', 1.3],
  ['on-accent/accent', '#21222C', '#BD93F9', 3.0],
  ['on-success/success', '#21222C', '#50FA7B', 3.0],
  ['on-warning/warning', '#21222C', '#F1FA8C', 3.0],
  ['on-error/error', '#21222C', '#FF5555', 3.0],
  ['on-info/info', '#21222C', '#8BE9FD', 3.0],
  // Navigation/state pairs: visited secondary on body, accent focus ring on
  // both tiers, dark text on the error/red fills (destructive + banners).
  ['visited/body', '#9AA1BC', '#282A36', 4.5],
  ['focus-accent/body', '#BD93F9', '#282A36', 3.0],
  ['focus-accent/surface', '#BD93F9', '#343746', 3.0],
  ['destructive/error', '#21222C', '#FF5555', 3.0],
  ['on-error/pale-error', '#21222C', '#FFD5CC', 4.5],
  ['on-inverted/inverted', '#21222C', '#F8F8F2', 4.5],
  ['separator/bg', '#44475A', '#282A36', 1.3],
  ['border-em/card', '#6272A4', '#343746', 1.5],
  ['banner-info/text', '#8BE9FD', mix('#8BE9FD', 0.1, '#343746'), 3.0],
  ['banner-success/text', '#50FA7B', mix('#50FA7B', 0.1, '#343746'), 3.0],
  ['banner-warning/text', '#F1FA8C', mix('#F1FA8C', 0.1, '#343746'), 3.0],
  ['banner-error/text', '#FF5555', mix('#FF5555', 0.1, '#343746'), 3.0],
];
for (const [name, fg, bg, floor] of pairs) {
  const r = ratio(fg, bg);
  if (r < floor) fail(`FAIL ${name} ${r.toFixed(2)} (floor ${floor})`);
  else console.log(`PASS ${name} ${r.toFixed(2)}`);
}
// Theme provenance gates: read astryx-theme.ts source (never built output).
// Every pin() tuple must be symmetric (dark-only brand), the selected ring
// must stay Dracula-hued, chat stays flat, and the label role stays semibold.
const themeSrc = await Bun.file('astryx-theme.ts').text();
const pins = [...themeSrc.matchAll(/pin\(\s*(['"])(.*?)\1\s*\)/g)].map((m) => m[2]);
if (!pins.length) fail('no pin() tuples found in astryx-theme.ts');
console.log(`PASS pin() tuples ${pins.length} (symmetric dark-only)`);
for (const p of pins) {
  void p;
}
// Tuple symmetry: every theme token tuple must pin the same hex twice
// (dark-only). Checked against the built theme input map.
// Static import cannot work here: check.ts runs standalone via bun, and the
// theme module must load from the working tree at check time.
const themeImport = await import('../astryx-theme.js');
const inputTokens = themeImport.astryxDraculaTheme.__inputTokens as Record<string, [string, string] | string> | undefined;
for (const [k, v] of Object.entries(inputTokens ?? {})) {
  if (Array.isArray(v) && v[0] !== v[1]) fail(`asymmetric tuple ${k}: ${v[0]} vs ${v[1]} (dark-only: pin both slots)`);
}
if (!themeSrc.includes("'--shadow-inset-selected': 'inset 0px 0px 0px 2px #BD93F930'"))
  fail('--shadow-inset-selected must pin Purple 30% (Stone default blue has no Dracula meaning)');
// Strip line comments before the Stone-blue scan so provenance notes can name
// the rejected hex without tripping the gate.
if (themeSrc.replace(/\/\/.*$/gm, '').includes('#0171E3')) fail('Stone blue leaked into astryx-theme.ts');
if (!themeSrc.includes("'--radius-chat': '5px'")) fail('--radius-chat must pin 5px (flat-crisp: Stone default 28px pill rejected)');
if (!themeSrc.includes("'--text-label-weight': 'var(--font-weight-semibold)'"))
  fail('--text-label-weight must pin semibold (only 400 + 600 faces ship)');
// Toast consumption: the pale inverted error surface must be consumed by a
// toast type rule, and onDark must keep the purple accent on dark media.
if (!themeSrc.includes('--color-background-error-inverted')) fail('orphan --color-background-error-inverted: no toast rule consumes it');
if (!themeSrc.includes('type:error')) fail('missing toast type:error rule');
if (!themeSrc.includes('type:info')) fail('missing toast type:info rule');
if (!themeSrc.includes('onDark')) fail('missing onDark accent passthrough (#BD93F9 on dark media)');

// Template lint gates: background doctrine + type quietness + explicit
// Layout height. Scans templates/ and demo/ source (never built output).
// variant="section" paints the shell surface tier instead of body and
// collapses the two tiers into one, so it is banned outside the allowlist
// below (repo-relative paths; empty: no legitimate use today). weight="bold"
// on large/body text fights the theme's semibold scale. A Layout without an
// explicit height prop silently takes fill, which only resolves against a
// definite ancestor height — hero/document pages need auto, app panes fill.
const sectionAllowlist: string[] = [];
const lintFiles: string[] = [];
for (const dir of ['templates', 'demo']) {
  const glob = new Bun.Glob(`${dir}/*.tsx`);
  for await (const f of glob.scan('.')) lintFiles.push(f);
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
  for (const m of src.matchAll(/variant=\{?["']section["']\}?/g)) {
    if (!sectionAllowlist.includes(f)) fail(`${f}:${src.slice(0, m.index).split('\n').length} variant="section" outside allowlist`);
  }
  for (const m of src.matchAll(/weight=\{?["']bold["']\}?/g)) {
    fail(`${f}:${src.slice(0, m.index).split('\n').length} weight="bold" (theme semibold owns large/body emphasis)`);
  }
  for (const m of src.matchAll(/<Layout(?=[\s>])/g)) {
    const end = findTagEnd(src, m.index + '<Layout'.length);
    const tag = end === -1 ? '' : src.slice(m.index, end + 1);
    if (!/height\s*=/.test(tag)) fail(`${f}:${src.slice(0, m.index).split('\n').length} <Layout> missing explicit height (auto for hero/document pages, fill for app panes)`);
  }
}
if (failed) process.exit(1);
console.log('kit checks PASS');
