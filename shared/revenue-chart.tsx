// Shared daily-revenue line chart plus the rounded product swatch. Absorbs the
// table-page-chart / shoe-store clones (only CHART_MAX and ticks differ) and
// the theme-showcase ThumbSwatch as a sized variant. Chart panel Card keeps
// the one shared chart-panel style until the theme pins a Card variant
// (wave 2): import CHART_PANEL_STYLE rather than restating it.

import type {CSSProperties} from 'react';
import {CHART_PANEL_STYLE} from 'astryx-dracula/shared/chart-panel-style';
import {CHART_HUES} from 'astryx-dracula/shared/chart-hues';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Square} from 'lucide-react';
import {ChartLabel, CHART_LABEL_SIZE} from 'astryx-dracula/shared/chart-labels';
import type {SceneHue} from 'astryx-dracula/shared/scene-hues';

// ============= SHARED CHART-PANEL CARD STYLE =============


// ============= PRODUCT SWATCH =============

const swatchStyle: CSSProperties = {flexShrink: 0};

// Rounded product swatch: Dracula surface with a per-product accent glyph (one 36px size).
// `accent` is an art treatment, so it takes the same `SceneHue` union as
// `SceneTile.hue` — one art-treatment vocabulary, two consumers. A free-form
// `string` here is what let `--dracula-purple` reach a product swatch.
export function ProductSwatch({
  accent,
  label,
}: {
  accent: SceneHue;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={36}
      height={36}
      style={swatchStyle}
      role="img"
      aria-label={`${label} swatch`}>
      {/* A surface, not a data mark: the plate behind a product swatch wears the
          card tier. --color-background-card is byte-identical to the old
          --dracula-bg-light (#343746). */}
      <rect width={36} height={36} rx={5} fill="var(--color-background-card)" />
      <rect
        x={1}
        y={1}
        width={34}
        height={34}
        rx={4}
        fill="none"
        stroke="var(--color-widget-content-border)"
      />
      <circle
        cx={18}
        cy={18}
        r={7}
        fill="none"
        stroke={accent}
        strokeWidth={3}
      />
    </svg>
  );
}

// ============= REVENUE CHART =============

// Role token, not a --dracula-* primitive. Byte-identical (--color-data-
// categorical-cyan IS #8BE9FD) and routed through chart-hues.ts so the line
// colour is the sanctioned vocabulary rather than a literal decided here.
const REVENUE_LINE = CHART_HUES.cyan;
const CHART_W = 540;
const CHART_H = 200;
const CHART_PAD_LEFT = 44;
const CHART_PAD_RIGHT = 12;
const CHART_PAD_TOP = 12;
const CHART_BASELINE = 164;
const CHART_PLOT_W = CHART_W - CHART_PAD_LEFT - CHART_PAD_RIGHT;

// X-axis label budget, counted in ticks rather than baked into a stride: five
// intervals is the most the 484-unit plot carries with a tick-width of air
// still between neighbours — a sixth drops the tightest pair to ~20px on a
// 390px viewport, and the final pair needs room on top of that. Six ticks is
// the ceiling, and the stride comes from the point count.
const CHART_MAX_X_TICKS = 6;
// A tick is as wide as its own text — the mono face advances 0.6em a glyph, so
// `Jan 1` and `Jan 13` are different widths, and the last pair is decided by
// that difference. Measured, not assumed.
const CHART_TICK_ADVANCE = 0.6 * CHART_LABEL_SIZE;
// The final tick is end-anchored here instead of centred on its own point,
// which is what buys it room inside the right pad. The price is the
// `CHART_TICK_PIN` it hangs back plus half a tick box of approach from the
// left, and that is the air the grid below has to leave it.
const CHART_LAST_TICK_X = CHART_W - CHART_PAD_RIGHT - 2;
const CHART_TICK_PIN = CHART_PAD_LEFT + CHART_PLOT_W - CHART_LAST_TICK_X;

interface RevenuePoint {
  date: string;
  revenue: number;
}

// Axis ticks switch to thousands once the scale leaves the hundreds.
function formatRevenueTick(tick: number): string {
  return tick >= 1000 ? `$${tick / 1000}k` : `$${tick}`;
}

// Which points get a date tick. A fixed stride cannot answer this: `i % 3`
// plus a forced final tick puts that final tick 0–1 slots from its neighbour
// for two point counts in three, and one slot is `Jan 13` and `Jan 15` set
// solid. So the stride comes from the point count, and the final point only
// joins the axis once the pin has left it its air; when it has not, the
// crowded grid tick gives way instead, so the axis ends on a gap wider than
// every other one rather than on the narrowest one.
function xTickIndices(dates: string[]): number[] {
  const last = dates.length - 1;
  if (last < 1) return [last];
  const step = CHART_PLOT_W / last;
  const width = (i: number) => dates[i].length * CHART_TICK_ADVANCE;
  // Clear space between two ticks: `slots` apart, less the half-box each side
  // shows. The final tick is the exception — it shows its whole box to the left
  // of its anchor, so its pair is the one that has to clear the most.
  const gap = (a: number, b: number) =>
    (b - a) * step -
    (width(a) + width(b)) / 2 -
    (b === last ? CHART_TICK_PIN + width(b) / 2 : 0);
  const stride = Math.max(1, Math.ceil(last / (CHART_MAX_X_TICKS - 1)));
  // The grid, minus whatever the pinned final tick has crowded out. Every
  // step of `end` down leaves the grid spacing even and gives the last pair
  // one stride more room, so the first grid that clears is the one to keep.
  let ticks = [0, last];
  for (let end = Math.floor(last / stride) * stride; end >= 0; end -= stride) {
    const grid: number[] = [];
    for (let i = 0; i <= end; i += stride) grid.push(i);
    if (grid[grid.length - 1] !== last) grid.push(last);
    // Every pair, in order, so the last one can be held to the tightest of
    // the rest instead of to the average.
    const gaps = grid
      .slice(0, -1)
      .map((t, k) => gap(t, grid[k + 1]));
    const interior = gaps.slice(0, -1);
    if (interior.length === 0 || gaps[gaps.length - 1] >= Math.min(...interior)) {
      ticks = grid;
      break;
    }
  }
  return ticks;
}

export function RevenueChart({
  data,
  chartMax,
  gridTicks,
  ariaLabel = 'Daily revenue, January 1 to 15',
  caption = 'Daily revenue · Jan 1–15',
}: {
  data: RevenuePoint[];
  chartMax: number;
  gridTicks: number[];
  ariaLabel?: string;
  caption?: string;
}) {
  const plotH = CHART_BASELINE - CHART_PAD_TOP;
  const points = data.map((d, i) => ({
    ...d,
    x: CHART_PAD_LEFT + (i / (data.length - 1)) * CHART_PLOT_W,
    y: CHART_BASELINE - (d.revenue / chartMax) * plotH,
  }));
  const dateTicks = new Set(xTickIndices(data.map(d => d.date)));
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${CHART_BASELINE} L${points[0].x.toFixed(1)},${CHART_BASELINE} Z`;
  return (
    <VStack gap={3}>
      <Card padding={4} style={CHART_PANEL_STYLE}>
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          role="img"
          aria-label={ariaLabel}>
          {gridTicks.map(tick => {
            const y = CHART_BASELINE - (tick / chartMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={CHART_PAD_LEFT}
                  y1={y}
                  x2={CHART_W - CHART_PAD_RIGHT}
                  y2={y}
                  stroke="var(--color-separator)"
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                  opacity={tick === 0 ? 1 : 0.5}
                />
                <ChartLabel x={CHART_PAD_LEFT - 6} y={y + 3} textAnchor="end">
                  {formatRevenueTick(tick)}
                </ChartLabel>
              </g>
            );
          })}
          <path d={areaPath} fill={REVENUE_LINE} opacity={0.25} />
          <path
            d={linePath}
            fill="none"
            stroke={REVENUE_LINE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map(
            (p, i) =>
              dateTicks.has(i) && (
                <ChartLabel
                  key={p.date}
                  x={i === points.length - 1 ? CHART_LAST_TICK_X : p.x}
                  y={CHART_H - 8}
                  textAnchor={i === points.length - 1 ? 'end' : 'middle'}>
                  {p.date}
                </ChartLabel>
              ),
          )}
        </svg>
      </Card>
      <Text type="supporting" color="secondary">
        {caption}
      </Text>
      <HStack gap={2} vAlign="center">
        <Icon icon={Square} size="xsm" style={{color: REVENUE_LINE}} />
        <Text type="supporting" color="secondary">
          Revenue
        </Text>
      </HStack>
    </VStack>
  );
}
