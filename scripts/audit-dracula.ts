// Audit: fails on Dracula hex drift. Run with `bun scripts/audit-dracula.ts`.
export {};
const expected: Record<string, string> = {
  bg: '#282A36',
  currentLine: '#44475A',
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
let failed = false;
for (const [name, hex] of Object.entries(expected)) {
  if (!css.toLowerCase().includes(hex.toLowerCase())) {
    console.error(`missing ${name} ${hex} in tokens.css`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('dracula audit PASS: 11/11 hexes present');
