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
const built = await Bun.file('theme.css').text().catch(() => '');
if (built && !built.includes('astryx-dracula')) fail('theme.css stale: rebuild with `bun run theme:build`');

// Dark-only invariant: every light-dark() tuple the build emits must have
// identical branches. Nothing else enforces it, so a future pin() that drifts to
// a real light value would ship a half-light brand silently.
//
// The splitter is BALANCED-PAREN, and that is not a style choice: the obvious
// regex terminates the second argument on the first ")" it meets, and 45 of our
// tokens are hsl(...) ramp values, so a regex reports all 45 asymmetric and the
// gate ships red on day one. A red-by-design gate gets disabled within a week
// and then protects nothing. Also fails a tuple whose argument count is not 2,
// since a 1- or 3-tuple silently drops a branch.
const lightDarkTuples = (src: string): string[][] => {
  const out: string[][] = [];
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
    out.push(parts.map((p) => p.trim()));
  }
  return out;
};
if (built) {
  const tuples = lightDarkTuples(built);
  if (!tuples.length) fail('no light-dark() tuples found in theme.css — dark-only invariant unverified');
  for (const t of tuples) {
    if (t.length !== 2) fail(`malformed light-dark(${t.join(', ')}): expected 2 branches, got ${t.length} — a wrong arity silently drops one`);
    else if (t[0].toLowerCase() !== t[1].toLowerCase())
      fail(`asymmetric light-dark(${t[0]}, ${t[1]}) in theme.css — dark-only brand: both branches must be identical`);
  }
  console.log(`PASS light-dark symmetry ${tuples.length} tuples (dark-only)`);
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
  // border-em: 3.0, not 1.5. The floor is the WCAG 1.4.11 tier core's own
  // expandColorScale.ts:22-24 promises for form-control boundaries, which
  // pin() makes inert. 3.0 passes at 4.60 and would have been RED at 2.51
  // before the repin, so the gate now carries evidence instead of rubber-
  // stamping. Popover is a REAL adjacent tier, not a hypothetical one:
  // DropdownMenuRadioItem.tsx:84 reads this token and DropdownMenu paints
  // --color-background-popover. Muted is included for the same reason.
  ['border-em/card',    '#9AA1BC', '#343746', 3.0],
  ['border-em/popover', '#9AA1BC', '#424450', 3.0],
  ['border-em/muted',   '#9AA1BC', '#44475A', 3.0],
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
const SURFACE_TIER = '#343746';
const ringHex = themeSrc.match(/'--shadow-inset-selected':\s*'inset 0px 0px 0px 2px #([0-9A-Fa-f]{8})'/);
if (ringHex) {
  const rgb = `#${ringHex[1].slice(0, 6)}`;
  const alphaByte = parseInt(ringHex[1].slice(6, 8), 16);
  const alphaPct = (alphaByte / 255) * 100;
  const composited = mix(rgb, alphaByte / 255, SURFACE_TIER);
  const r = ratio(composited, SURFACE_TIER);
  if (r < RING_FLOOR) fail(`FAIL inset-selected/ring ${r.toFixed(2)}:1 over ${SURFACE_TIER} (regression floor ${RING_FLOOR}; alpha byte 0x${ringHex[1].slice(6, 8)} = ${alphaPct.toFixed(2)}%) — does NOT meet 1.4.11, which needs 3:1`);
  else console.log(`PASS inset-selected/ring ${r.toFixed(2)}:1 (alpha 0x${ringHex[1].slice(6, 8)} = ${alphaPct.toFixed(2)}%, below the 3:1 1.4.11 floor — documented gap, not discharged here)`);
} else fail('FAIL cannot read --shadow-inset-selected alpha to compute the ring regression floor');
// Theme provenance gates: read astryx-theme.ts source (never built output).
// Pins are counted here; the symmetry check itself runs further down against
// the built theme's input map, where the tuples actually live.
const pins = [...themeSrc.matchAll(/pin\(\s*(['"])(.*?)\1\s*\)/g)].map((m) => m[2]);
if (!pins.length) fail('no pin() tuples found in astryx-theme.ts');
console.log(`PASS pin() tuples ${pins.length} (symmetric dark-only)`);
// Tuple symmetry: every theme token tuple must pin the same hex twice
// (dark-only). Checked against the built theme input map.
// Static import cannot work here: check.ts runs standalone via bun, and the
// theme module must load from the working tree at check time.
const themeImport = await import('../astryx-theme.js');
const inputTokens = themeImport.astryxDraculaTheme.__inputTokens as Record<string, [string, string] | string> | undefined;
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

// 2. NO <Link> RENDERING AN ACTION. A link is a destination; a button is an
// action. A Button painted as a Link announces "link" to a screen reader for
// something that acts, and hands it the navigation affordance.
//
// An EXPLICIT VERB LIST matched on the label's FIRST WORD, not a pattern over
// all the text. "Billing address" and "History of edits" are navigation labels
// no verb reaches, and a gate that cries wolf on correct sites is worse than no
// gate — the same tradeoff the !important and chart gates state about their own
// scope. What it costs is stated at ACTION_LINK_ALLOW: a nav label that really
// does open with an imperative verb needs one entry there. Extend the list by
// adding a verb; do not generalise it.
const ACTION_VERBS = ['Create', 'Delete', 'Disconnect', 'Log out', 'Deactivate', 'Request', 'Remove', 'Save', 'Submit', 'Edit', 'Add', 'Cancel', 'Confirm'];
const actionVerbs = ACTION_VERBS.map((v) => [v, new RegExp(`^${v}\\b`, 'i')] as const);

// The escape hatch, and the ONLY one: one human ruling per site, keyed
// `file:line` — the same string the message prints, so a site is found and
// added with one grep. It exempts BOTH tiers, which matters because a
// navigation label like "Edit history" is a true positive on the verb and a
// false positive on the rule, and "remove the verb" is not an answer to that.
// A line that moves falls out of the table, which is the intent and not a bug:
// the sentence around it changed, so somebody should read it again.
const ACTION_LINK_ALLOW: Record<string, true> = {
  // Prose, not a control: it closes AUTH_SIGNUP_PROMPT inside a sentence, and
  // asks for hasUnderline because colour alone is not a cue inline (1.4.1/F73).
  'templates/login-sso.tsx:190': true,
};

for (const f of lintFiles.sort()) {
  const src = await Bun.file(f).text();
  for (const m of src.matchAll(/<Link(?=[\s>])/g)) {
    const end = findTagEnd(src, m.index! + '<Link'.length);
    if (end === -1) continue;
    const at = `${f}:${src.slice(0, m.index).split('\n').length}`;
    // Literal text only. A label behind {…} is unknown to a source walk, and
    // guessing at it is how a gate starts failing on sites it cannot read.
    const label = (src.slice(end + 1).match(/^\s*([^<{][^<]{0,60})/)?.[1] ?? '').replace(/\s+/g, ' ').trim();
    const verb = actionVerbs.find(([, re]) => re.test(label))?.[0];
    if (!verb) continue;
    if (at in ACTION_LINK_ALLOW) continue;
    // hasUnderline means the site sits in running prose, where the verb
    // describes the sentence rather than being the affordance. That downgrades
    // a hard fail to a human review; it does not silence it.
    if (!/hasUnderline/.test(src.slice(m.index, end + 1))) {
      fail(`${at} <Link> labelled "${label}" renders an action as a destination — use Button, or if this is genuinely navigation add '${at}' to ACTION_LINK_ALLOW in scripts/check.ts`);
    } else {
      console.log(`REVIEW ${at} <Link> labelled "${verb}…" with hasUnderline — prose or control? if prose, add '${at}' to ACTION_LINK_ALLOW in scripts/check.ts`);
    }
  }
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

if (failed) process.exit(1);
console.log('kit checks PASS');
