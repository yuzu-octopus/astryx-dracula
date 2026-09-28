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
  const slot = 540 / bars.length;
  const barWidth = slot - 24;
  return (
    <svg
      viewBox="0 0 540 180"
      width="100%"
      role="img"
      aria-label="Monthly traffic by category">
      <line x1="20" y1="30" x2="520" y2="30" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
      <line x1="20" y1="80" x2="520" y2="80" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
      <line x1="20" y1="130" x2="520" y2="130" stroke="var(--color-separator)" />
      {bars.map((b, i) => {
        const h = (b.value / 100) * 110;
        const x = 20 + i * slot + 12;
        return (
          <g key={b.month}>
            <rect
              x={x}
              y={130 - h}
              width={barWidth}
              height={h}
              rx={4}
              fill="var(--color-data-categorical-cyan)"
            />
            {showValues && (
              <text
                x={x + barWidth / 2}
                y={120 - h}
                textAnchor="middle"
                fontSize={13}
                fill="var(--color-text-highlight)"
                fontFamily="var(--font-family-mono)">
                {b.value}k
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={150}
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
export function RouteCell({row}: {row: RouteRow}) {
  return (
    <HStack gap={2} vAlign="center">
      <StatusDot
        variant={row.status === 'healthy' ? 'success' : 'warning'}
        label={row.status}
      />
      <Text weight="semibold">{row.page}</Text>
      <Text type="supporting" color="secondary">
        {row.status === 'healthy' ? 'Healthy' : 'Degraded'}
      </Text>
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
