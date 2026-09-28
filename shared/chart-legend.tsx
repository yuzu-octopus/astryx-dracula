// Shared chart legend: swatch + label, always paired.
//
// WHY THIS EXISTS: the legend was hand-rolled three incompatible ways before
// this module — dashboard.tsx used an Icon swatch, table-page-heatmap-status
// used a 12px rx=4 rect, tech-report used an 8px rx=1 rect — so three files
// disagreed on what a legend swatch even looks like. Meanwhile demo/Bento.tsx
// and demo/Dashboard.tsx render seven bars in seven hues with no legend at all,
// so those hues encoded nothing. This module makes that state unrepresentable.
//
// COLOUR CONTRACT (UIAuditColorMotion, from references/visual.md): "Legends pair
// spectral badges with dots; never rely on color alone, labels travel with
// hues." So `label` is REQUIRED and not optional — a dot without a label is
// colour-alone encoding, and WCAG 1.4.1 plus 1.4.11 both fail on that. Making
// the label required closes both in one shape instead of leaving every call site
// to remember.
//
// Swatch colour MUST be a --color-data-categorical-* or --color-data-<family>-N
// var. Never a raw hex, never a --dracula-* primitive: that discipline is what
// makes the 56 --color-data-* tokens load-bearing rather than decorative, and
// shared/chart-hues.ts is the sanctioned categorical source.
//
// Not interactive. A legend is a key, not a control: no hover, no focus ring.

import type {ReactNode} from 'react';
import {HStack, StackItem, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {CHART_HUES, type ChartHue} from 'astryx-dracula/shared/chart-hues';

export interface ChartLegendEntry {
  /** REQUIRED. The hue never travels alone — this is the 1.4.1 contract. */
  label: string;
  /** A --color-data-* var, or a --color-background-* surface. Never a raw
   *  hex, never a --dracula-* primitive.
   *
   *  The surface arm is not optional: a legend whose first row is a recessive
   *  surface is normal (the heatmap's zero cell), so a data-only type would
   *  reject the value the heatmap is supposed to paint. */
  color: ChartHue | `var(--color-data-${string})` | `var(--color-background-${string})`;
}

// Kept as a string-keyed fall-through on purpose, and DO NOT narrow it: call
// sites pass an already-RESOLVED value (CHART_HUES.x is a property access, so
// it yields the value, never the key), so the lookup misses at every site and
// the `?? entry.color` is the only path that paints. Narrowing the key type
// would render `background: undefined` at every call site, compile clean, and
// break at runtime. The old comment here claimed call sites may pass a KEY;
// none does. The behaviour is correct; only the comment was wrong.
const HUE_LOOKUP: Record<string, string> = CHART_HUES;

export interface ChartLegendProps {
  entries: readonly ChartLegendEntry[];
  /** Spacing step between entries. @default 2 */
  gap?: 1 | 2 | 3 | 4 | 6;
  /** Accessible name for the legend as a group. */
  label?: string;
  /** Swatch size in px. @default 10 */
  swatchSize?: number;
  /** Caption under the legend, e.g. "Hourly intervals · trailing 24 hours". */
  caption?: ReactNode;
  /** Orientation. @default 'row' */
  direction?: 'row' | 'column';
}


export function ChartLegend({
  entries,
  gap = 2,
  swatchSize = 10,
  label,
  caption,
  direction = 'row',
}: ChartLegendProps) {
  const Stack = direction === 'row' ? HStack : VStack;
  return (
    <VStack gap={1}>
      <Stack gap={gap} vAlign="center" role="list" aria-label={label}>
        {entries.map(entry => (
          <HStack key={entry.label} gap={1} vAlign="center" role="listitem">
            <StackItem
              style={{
                width: `${swatchSize}px`,
                height: `${swatchSize}px`,
                flexShrink: 0,
                background: HUE_LOOKUP[entry.color] ?? entry.color,
                borderRadius: 'var(--radius-inner)',
              }}
            />
            {/* supporting, not body: a legend label is metadata by the
                typography doctrine, and it never carries a sentence the page
                needs the reader to have. */}
            <Text type="supporting" color="secondary" hasTabularNumbers>
              {entry.label}
            </Text>
          </HStack>
        ))}
      </Stack>
      {caption}
    </VStack>
  );
}
