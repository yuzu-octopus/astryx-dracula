// Derives 5-step chart ramps from Dracula accents. Run with
// `bun scripts/generate-chart-ramps.ts` and paste the block into astryx-theme.ts.
// Steps spread lightness evenly so every step is distinct on dark backgrounds;
// hue/saturation stay constant per family for harmony. Gray uses the bg hue.
export {};

function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = ((max + min) / 2) * 100;
  if (max === min) return [0, 0, Math.round(l * 100) / 100];
  const d = max - min;
  const s = (d / (1 - Math.abs(max + min - 1))) * 100;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = ((h * 60 + 360) % 360);
  return [Math.round(h * 100) / 100, Math.round(s * 100) / 100, Math.round(l * 100) / 100];
}

function rampHsl(hex: string): string[] {
  const [h, s] = hexToHsl(hex);
  return [28, 44, 60, 74, 88].map((l) => `hsl(${h} ${s}% ${l}%)`);
}

const families: Record<string, string> = {
  purple: '#BD93F9',
  pink: '#FF79C6',
  red: '#FF5555',
  orange: '#FFB86C',
  yellow: '#F1FA8C',
  teal: '#8BE9FD',
  blue: '#6272A4',
  shamrock: '#50FA7B',
  gray: '#282A36',
};

for (const [name, hex] of Object.entries(families)) {
  const [r5, r4, r3, r2, r1] = rampHsl(hex);
  console.log(`  '--color-data-${name}-5': pin('${r5}'),`);
  console.log(`  '--color-data-${name}-4': pin('${r4}'),`);
  console.log(`  '--color-data-${name}-3': pin('${r3}'),`);
  console.log(`  '--color-data-${name}-2': pin('${r2}'),`);
  console.log(`  '--color-data-${name}-1': pin('${r1}'),`);
}
