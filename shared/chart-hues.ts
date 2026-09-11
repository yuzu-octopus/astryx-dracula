// Shared categorical chart hues: the visual.md categorical ramp as importable
// constants. Every value is a Dracula token var — never a raw hex — and purple
// is deliberately absent: purple means tappable, so it must never encode data.
// Use CHART_SERIES order when a chart needs N distinct hues.

export const CHART_HUES = {
  cyan: 'var(--dracula-cyan)',
  orange: 'var(--dracula-orange)',
  green: 'var(--dracula-green)',
  pink: 'var(--dracula-pink)',
  muted: 'var(--dracula-comment)',
} as const;

export type ChartHue = (typeof CHART_HUES)[keyof typeof CHART_HUES];

// Purple-free categorical order for multi-series charts and distribution
// strips. Index with `i % CHART_SERIES.length`.
export const CHART_SERIES: ChartHue[] = [
  CHART_HUES.cyan,
  CHART_HUES.orange,
  CHART_HUES.green,
  CHART_HUES.pink,
];
