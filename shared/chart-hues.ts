// Shared categorical chart hues: the visual.md categorical ramp as importable
// constants. Every value is a role token var -- never a raw --dracula-* primitive
// and never a raw hex -- so the vocabulary is the sanctioned one by construction
// rather than by convention, and a gate can read the object and enforce it.
// Purple is deliberately absent: purple means tappable, so it must never encode
// data. `muted` is a COMMENT-blue grey because it backs the `{label: 'Other'}`
// legend row (dashboard.tsx:229, :253) -- a labelled data category, not chrome.
//
// Every var() carries an explicit fallback equal to the theme's own pin for
// that token. Core moved the canonical `--color-data-*` defaults out of the
// generated theme CSS and into its own dataVars group, so a bare
// `var(--color-data-*)` is no longer guaranteed to resolve: the theme's pin is
// the only thing painting it. The fallback is the same value, so a theme that
// drops the token still paints the right colour instead of nothing. The
// fallback-vs-pin sync is enforced by scripts/check.ts, so the two cannot drift.

export const CHART_HUES = {
	cyan: "var(--color-data-categorical-cyan, #8BE9FD)",
	orange: "var(--color-data-categorical-orange, #FFB86C)",
	green: "var(--color-data-categorical-green, #50FA7B)",
	pink: "var(--color-data-categorical-pink, #FF79C6)",
	muted: "var(--color-data-categorical-blue, #6272A4)",
	// Added because --color-data-categorical-red exists in the palette
	// (tokens.css:276) and heat maps need a severity colour, but no module
	// exposed it. Without this, a chart could not reach red through the
	// sanctioned source at all.
	red: "var(--color-data-categorical-red, #FF5555)",
} as const;

export type ChartHue = (typeof CHART_HUES)[keyof typeof CHART_HUES];

/**
 * Any `--color-data-*` colour: a categorical hue, or a step of a sequential
 * ramp. The fallback inside the var() is part of the string, which is why the
 * template-literal type below still admits it.
 */
export type DataColor = `var(--color-data-${string})`;
