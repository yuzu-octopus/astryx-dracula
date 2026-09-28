// Shared value→colour scale for heat cells and any magnitude-as-fill encoding.
//
// WHY THE DEFAULT IS shamrock (human ruling, not a preference):
//   shamrock  darkest step 3.20:1 vs --color-background-body — CLEARS WCAG 1.4.11
//   teal      2.64:1 as shipped, 2.74:1 after the #A4FFFF repin — FAILS
//   purple    best adjacent separation (1.58:1) but worst darkest step (1.07:1),
//             its low end vanishing into #282A36
// Shamrock is the only non-forbidden family whose darkest step clears 3:1, and it
// needs no repin. Do not "fix" the default: if a heat cell ever reads as "low"
// while sitting ~2.7:1 from the surface behind it, that is the ceiling of the
// family you chose, not a bug in this file.
//
// PURPLE IS SANCTIONED HERE (human ruling, module rule): a heat scale claims an
// ORDER, not an identity. --color-data-purple-1..5 survives and is a legal
// opt-in for magnitude. Purple remains barred from CATEGORICAL identity — that
// is shared/chart-hues.ts's job, and --color-data-categorical-purple is revoked.
// So: legal below, illegal there. Those are different questions.
//
// SEQUENCING (was a live-ramp dependency, no longer is): --color-data-teal-* is
// built at hsl(190.53 96.61%) = spec Cyan #8BE9FD, while --color-background-teal
// / -border-teal / -icon-teal / -text-teal all use #A4FFFF (ANSI bright cyan) —
// a different HUE (180 vs 190.53), not merely lightness. One token name, two
// bases. Because the human chose shamrock, the teal repin is a zero-consumer
// provenance fix; picking 'teal' here would re-couple the two.

/** The nine sequential ramp families shipping in the theme. */
export type HeatFamily =
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'blue'
  | 'shamrock'
  | 'gray';

/**
 * Map a value onto a step of a sequential ramp and return the token var.
 *
 * Step 5 is the darkest and 1 the lightest, so a LOW value maps to step 5 and
 * recedes into the page, while a HIGH value maps to step 1 and advances against
 * it. The ramp is ordered by distance-from-surface, which is what makes it a
 * magnitude and not a category — and on a dark surface that ordering runs
 * light-for-more, not dark-for-more. (Verified against tokens.css:315-319:
 * shamrock-5 is L=28%, shamrock-1 is L=88%, body is #282A36.)
 *
 * @param value the measurement
 * @param max   domain maximum; values at or above it return step 5
 * @param family ramp family. Default 'shamrock' per the ruling above.
 */
export function heatStep(
  value: number,
  max: number,
  family: HeatFamily = 'shamrock',
): string {
  const ratio = max <= 0 ? 0 : value / max;
  const bounded = Math.max(0, Math.min(1, ratio));
  // Five buckets, not a continuous lerp: the theme ships exactly five steps per
  // family, so anything finer would invent colours the palette does not have.
  const bucket = Math.min(4, Math.floor(bounded * 5));
  const step = 5 - bucket;
  return `var(--color-data-${family}-${step})`;
}
