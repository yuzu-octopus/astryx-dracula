// Contrast audit for the Dracula theme. Run with `bun scripts/check-contrast.ts`.
// Floors follow the Dracula spec (WCAG 2.1 AA 4.5 for body text): body 4.5,
// secondary 4.5, disabled/non-essential 2.5, on-fill 3.0, hairlines 1.3.
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

const pairs: Array<[string, string, string, number]> = [
  ['text-primary/bg', '#F8F8F2', '#282A36', 4.5],
  ['text-secondary/bg', '#9AA1BC', '#282A36', 4.5],
  ['text-secondary/surface', '#9AA1BC', '#343746', 4.5],
  ['text-disabled/bg', '#6272A4', '#282A36', 2.5],
  ['text-accent/bg', '#BD93F9', '#282A36', 3.0],
  ['text-paragraph/bg', '#B0B3C4', '#282A36', 4.5],
  ['text-muted/bg', '#8288A6', '#282A36', 3.0],
  ['on-accent/accent', '#000000', '#BD93F9', 3.0],
  ['on-success/success', '#000000', '#50FA7B', 3.0],
  ['on-warning/warning', '#000000', '#F1FA8C', 3.0],
  ['on-error/error', '#FFFFFF', '#FF5555', 3.0],
  ['on-info/info', '#000000', '#8BE9FD', 3.0],
  ['border/bg', '#44475A', '#282A36', 1.3],
  ['border-em/card', '#6272A4', '#343746', 1.5],
];

let failed = false;
for (const [name, fg, bg, floor] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= floor;
  if (!ok) failed = true;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${r.toFixed(2)} (floor ${floor})`);
}
if (failed) process.exit(1);
console.log('contrast audit PASS');
