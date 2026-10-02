// Shared demo fixture COMPONENTS: the traffic chart and route table rendered by
// both Dashboard and Bento. The data they render lives in ./fixture-data.ts —
// split so this file exports only components and React Fast Refresh stays
// intact. See shared/scene-hues.ts for the same split, same reason.
//
// One hue, not a rainbow: the x-axis names every bar and height carries the
// magnitude, so seven per-bar colors encoded nothing — and purple is reserved
// for tappable, never data (shared/chart-hues.ts). Categorical cyan is the
// correct single mark here.
import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {BARS, type Bar, type RouteRow} from './fixture-data';

export function TrafficChart({
  bars = BARS,
  showValues = false,
}: {
  bars?: Bar[];
  showValues?: boolean;
}) {
  // Slots are cut from the PLOT AREA (20..520, where the gridlines run), not
  // from the full 540-wide viewBox. Dividing the viewBox instead put the last
  // bar's right edge at x=548 -- 8 units past the edge, where the SVG clipped
  // it -- so the series started 32 units in and ended flush against the
  // border. Sizing against the plot area puts a 12-unit gutter at both ends
  // for any bar count.
  const PLOT_LEFT = 20;
  const PLOT_WIDTH = 500;
  const slot = PLOT_WIDTH / bars.length;
  const barWidth = slot - 24;
  // Geometry is expressed as one baseline plus a bar scale rather than as
  // absolute y values, so the whole plot compresses by changing two numbers.
  // It is tuned to 140 units: at the ~580px this renders inside the bento's
  // half-width cell, a 180-unit box was 193px tall on its own and pushed the
  // page past the height the draculatheme.com preview can show.
  const PLOT_BOTTOM = 112;
  const BAR_SCALE = 88;
  const LABEL_Y = 128;
  const VALUE_LIFT = 8;
  return (
    <svg
      viewBox="0 0 540 140"
      width="100%"
      role="img"
      aria-label="Monthly traffic by category">
      <line x1="20" y1="46" x2="520" y2="46" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
      <line x1="20" y1="79" x2="520" y2="79" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
      <line x1="20" y1={PLOT_BOTTOM} x2="520" y2={PLOT_BOTTOM} stroke="var(--color-separator)" />
      {bars.map((b, i) => {
        const h = (b.value / 100) * BAR_SCALE;
        const x = PLOT_LEFT + i * slot + 12;
        return (
          <g key={b.month}>
            <rect
              x={x}
              y={PLOT_BOTTOM - h}
              width={barWidth}
              height={h}
              rx={4}
              fill="var(--color-data-categorical-cyan)"
            />
            {showValues && (
              <text
                x={x + barWidth / 2}
                y={PLOT_BOTTOM - VALUE_LIFT - h}
                textAnchor="middle"
                fontSize={13}
                fill="var(--color-text-highlight)"
                fontFamily="var(--font-family-mono)">
                {b.value}k
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={LABEL_Y}
              textAnchor="middle"
              fontSize={13}
              fill="var(--color-text-paragraph)"
              fontFamily="var(--font-family-mono)">
              {b.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Status reads as a word, not a hue alone: core's StatusDot paints nothing for
// its label (it sets aria-label only), so a dot-only cell leaves a sighted user
// unable to name the state. WCAG 1.4.1.
// Dot + route name only. The status WORD was redundant with the dot's own
// variant, and in the bento's narrow Routes cell it forced the longest row
// to wrap mid-word: "/component Degrade / s ... d". The dot carries the
// status as a colour AND as an aria-label, so removing the text loses no
// information and cannot break at any width.
export function RouteCell({row}: {row: RouteRow}) {
  return (
    <HStack gap={2} vAlign="center">
      <StatusDot
        variant={row.status === 'healthy' ? 'success' : 'warning'}
        label={row.status}
      />
      <Text weight="semibold">{row.page}</Text>
    </HStack>
  );
}

// The three-dot status vocabulary strip, now with visible keys.
export function StatusKey({
  items,
}: {
  items: {variant: 'success' | 'warning' | 'error'; label: string}[];
}) {
  return (
    <HStack gap={3} vAlign="center">
      {items.map((s) => (
        <HStack key={s.label} gap={1} vAlign="center">
          <StatusDot variant={s.variant} label={s.label} />
          <Text type="supporting">{s.label}</Text>
        </HStack>
      ))}
    </HStack>
  );
}
