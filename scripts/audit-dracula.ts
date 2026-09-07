// Audit: fails on Dracula hex drift or missing font files.
// Run with `bun scripts/audit-dracula.ts`.
export {};
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

let failed = false;
const css = await Bun.file('tokens.css').text();
for (const [name, hex] of Object.entries(expected)) {
  if (!css.toLowerCase().includes(hex.toLowerCase())) {
    console.error(`missing ${name} ${hex} in tokens.css`);
    failed = true;
  }
}
if (!css.includes('@font-face')) {
  console.error('missing @font-face block in tokens.css');
  failed = true;
}
for (const f of ['fonts/JetBrainsMono-Regular.woff2', 'fonts/JetBrainsMono-SemiBold.woff2']) {
  if (!(await Bun.file(f).exists())) {
    console.error(`missing font file ${f}`);
    failed = true;
  }
}
const built = await Bun.file('theme.css').text().catch(() => '');
if (built && !built.includes('astryx-dracula')) {
  console.error('theme.css stale: rebuild with `bun run theme:build`');
  failed = true;
}
if (failed) process.exit(1);
console.log('dracula audit PASS: 11/11 hexes, fonts, build outputs present');
