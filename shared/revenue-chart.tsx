// Shared daily-revenue line chart plus the rounded product swatch. Absorbs the
// table-page-chart / shoe-store clones (only CHART_MAX and ticks differ) and
// the theme-showcase ThumbSwatch as a sized variant. Chart panel Card keeps
// the one shared chart-panel style until the theme pins a Card variant
// (wave 2): import CHART_PANEL_STYLE rather than restating it.

import type {CSSProperties} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Square} from 'lucide-react';
import {ChartLabel} from 'astryx-dracula/shared/chart-labels';

// ============= SHARED CHART-PANEL CARD STYLE =============

// One chart-panel look for every hand-drawn SVG chart panel in this wave's
// templates (dashboard, portfolio, chart, heatmap-status, shoe-store). Restate
// nowhere: theme Card variant work lands in wave 2.
export const CHART_PANEL_STYLE: CSSProperties = {
  backgroundColor: 'var(--color-background)',
  border: 'var(--border-width) solid var(--color-separator)',
};

// ============= PRODUCT SWATCH =============

const swatchStyle: CSSProperties = {flexShrink: 0};

// Rounded product swatch: Dracula surface with a per-product accent glyph.
export function ProductSwatch({
  accent,
  label,
  size = 36,
}: {
  accent: string;
  label: string;
  /** @default 36 */
  size?: 36 | 40;
}) {
  const ring = size - 2;
  const center = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={swatchStyle}
      role="img"
      aria-label={`${label} swatch`}>
      <rect width={size} height={size} rx={5} fill="var(--dracula-bg-light)" />
      <rect
        x={1}
        y={1}
        width={ring}
        height={ring}
        rx={4}
        fill="none"
        stroke="var(--color-widget-content-border)"
      />
      <circle
        cx={center}
        cy={center}
        r={size === 40 ? 8 : 7}
        fill="none"
        stroke={accent}
        strokeWidth={3}
      />
    </svg>
  );
}

// ============= REVENUE CHART =============

const REVENUE_LINE = 'var(--dracula-cyan)';
const CHART_W = 540;
const CHART_H = 200;
const CHART_PAD_LEFT = 44;
const CHART_PAD_RIGHT = 12;
const CHART_PAD_TOP = 12;
const CHART_BASELINE = 164;
const CHART_PLOT_W = CHART_W - CHART_PAD_LEFT - CHART_PAD_RIGHT;

export interface RevenuePoint {
  date: string;
  revenue: number;
}

// Axis ticks switch to thousands once the scale leaves the hundreds.
function formatRevenueTick(tick: number): string {
  return tick >= 1000 ? `$${tick / 1000}k` : `$${tick}`;
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
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${CHART_BASELINE} L${points[0].x.toFixed(1)},${CHART_BASELINE} Z`;
  return (
    <VStack gap={3}>
      <Card padding={3} style={CHART_PANEL_STYLE}>
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
              (i % 3 === 0 || i === points.length - 1) && (
                <ChartLabel
                  key={p.date}
                  x={
                    i === points.length - 1
                      ? CHART_W - CHART_PAD_RIGHT - 2
                      : p.x
                  }
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
