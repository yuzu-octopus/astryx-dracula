import type { ReactNode } from 'react';
import {
  Badge,
  Card,
  CodeBlock,
  Grid,
  GridSpan,
  HStack,
  Heading,
  StatusDot,
  Table,
  Text,
  VStack,
  proportional,
} from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';
import { DataBar, type DataBarSegment } from '../shared/data-bar';
import { BARS, ROUTES, type RouteRow } from './fixture-data';
import { RouteCell, TrafficChart } from './fixtures';

// The one nested-inset recipe (references/scaffolds.md): a nested inset is the
// page background plus a separator border, so a widget reads as a card sitting
// ON the page rather than as a second surface tier competing with it. Outer
// cells keep core's card surface and are separated by their border alone.
const INSET = {
  backgroundColor: 'var(--color-background)',
  border: 'var(--border-width) solid var(--color-separator)',
};


const SPEC = [
  { name: 'bg', token: 'var(--dracula-bg)' },
  { name: 'fg', token: 'var(--dracula-fg)' },
  { name: 'comment', token: 'var(--dracula-comment)' },
  { name: 'line', token: 'var(--dracula-current-line)' },
  { name: 'select', token: 'var(--dracula-selection)' },
  { name: 'cyan', token: 'var(--dracula-cyan)' },
  { name: 'green', token: 'var(--dracula-green)' },
  { name: 'orange', token: 'var(--dracula-orange)' },
  { name: 'pink', token: 'var(--dracula-pink)' },
  { name: 'purple', token: 'var(--dracula-purple)' },
  { name: 'red', token: 'var(--dracula-red)' },
  { name: 'yellow', token: 'var(--dracula-yellow)' },
];


const METERS: { label: string; value: number; color: DataBarSegment['color'] }[] = [
  { label: 'Build minutes quota', value: 62, color: 'var(--color-data-categorical-green)' },
  { label: 'Error budget', value: 91, color: 'var(--color-data-yellow-2)' },
];

// Every number this page prints is read off the data it renders, and latency is
// compared numerically rather than as a string: "9ms" sorts above "24ms"
// lexically, and a summary strip naming the wrong route is a page lying about
// its own table.
const TOTAL_VIEWS = ROUTES.reduce((sum, row) => sum + Number(row.views.replace(/,/g, '')), 0);
const SLOWEST = ROUTES.reduce((worst, row) =>
  Number(row.latency.replace(/[^\d.]/g, '')) > Number(worst.latency.replace(/[^\d.]/g, ''))
    ? row
    : worst,
);

// A status word in its own hue, beside the dot that already carried it. `Text`
// has no status colour prop — its `color` enum stops at accent — so the role
// token goes in `style`, the same shape shared/metric-delta.tsx already uses.
//
// `error` deliberately has no saturated entry: --color-negative and
// --color-text-red are both #FF5555, which measures 3.75:1 on the card surface
// (#343746) against a 4.5:1 AA text floor. The dot keeps the red and the word
// stays at a legible foreground, so the hue is never the only channel and the
// word never fails contrast.
const STATUS_WORD: Record<'success' | 'warning' | 'error', string> = {
  success: 'var(--color-positive)',
  warning: 'var(--color-warning)',
  error: 'var(--color-text-paragraph)',
};

function StatusWord({
  variant,
  label,
}: {
  variant: 'success' | 'warning' | 'error';
  label: string;
}) {
  return (
    <HStack gap={1} vAlign="center">
      <StatusDot variant={variant} label={label} />
      <Text type="supporting" style={{ color: STATUS_WORD[variant] }}>
        {label}
      </Text>
    </HStack>
  );
}

// The widget header the scaffolds define: a heading over a `supporting` line,
// with an optional right-hand slot. Every cell repeats it verbatim, so it is
// stated once here for the same reason Dashboard hoists its Kpi — one edit
// reaches every cell instead of six.
//
// Cell titles are `level={2}`. This page used to carry an "Component wall"
// h2 above the grid, which forced the cells down to h3 and skipped a level
// under the page h1. With that heading gone each cell is a section of its
// own, so h1 -> h2 is the whole outline and the level reads correctly.
function Cell({
  title,
  caption,
  end,
  children,
}: {
  title: string;
  /** Optional: a cell whose title says enough on its own does not pay for a
      second line. The page is captured into a preview with a hard height, so
      every caption is a line the grid could have spent on content. */
  caption?: string;
  end?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card padding={3}>
      <VStack gap={2}>
        <HStack justify="between" vAlign="center" gap={3}>
          <VStack gap={0.5}>
            <Heading level={2}>{title}</Heading>
            {caption && (
              <Text type="supporting" color="secondary">
                {caption}
              </Text>
            )}
          </VStack>
          {end}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
}

export function Bento() {

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      {/* No background of its own: the SiteShell's transparent Section is the
          page background and the cells below are the only card surface. The
          previous version painted a second `--color-background` band over the
          whole content area, so every card matched the frame around it rather
          than the field it sat in, and a 100vh min-height left a dead band
          under the grid. */}
      <VStack gap={4}>
        <section id="bento">
          <Card padding={2}>
            <HStack justify="between" vAlign="center" wrap="wrap" gap={6}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <HStack gap={3} vAlign="center">
                    <StatusWord variant="success" label="Active spec" />
                    <StatusWord variant="warning" label="Dark only" />
                  </HStack>
                  {/* The standards eyebrow is informational, and cyan is this
                      brand's informational voice — 8.52:1 on the card. */}
                  <Text type="supporting" style={{ color: 'var(--color-info)' }}>
                    Dracula Classic · WCAG AA · JetBrains Mono
                  </Text>
                </HStack>
                <Heading level={1} type="display-2">
                  Every component, one grid
                </Heading>
              </VStack>
              {/* The install command is the one thing a visitor to a theme page
                  actually came for, so it sits beside the title instead of
                  costing a whole grid cell. */}
              <VStack gap={2} style={{ flex: '0 1 auto', minWidth: '18rem' }}>
                <CodeBlock
                  code="bun add astryx-dracula"
                  language="bash"
                  hasCopyButton
                  width="100%"
                />
              </VStack>
            </HStack>
          </Card>
        </section>

        <section id="cells">
          <VStack gap={4}>
            <Grid columns={{ minWidth: 260, max: 4 }} gap={2}>
              <GridSpan columns={2}>
                <Cell
                  title="Traffic"
                  caption="One hue for one series"
                  end={<Badge label={`${BARS.length} months`} variant="neutral" />}
                >
                  <Card padding={3} style={INSET}>
                    <TrafficChart showValues />
                  </Card>
                </Cell>
              </GridSpan>

              <GridSpan columns={2}>
                <Cell
                  title="Routes"
                  caption="Edge throughput and p99 latency"
                  end={
                    <HStack gap={1.5} vAlign="center">
                      {/* The derived totals ride in the header's right slot, where
                          badges already live, so the cell keeps both numbers
                          without spending a body row on them. */}
                      <Badge label={`${TOTAL_VIEWS.toLocaleString()} views`} variant="neutral" />
                      <Badge
                        label={SLOWEST.status === 'healthy' ? 'All healthy' : 'One degraded'}
                        variant={SLOWEST.status === 'healthy' ? 'green' : 'yellow'}
                      />
                    </HStack>
                  }
                >
                  <Table
                    data={ROUTES}
                    idKey="page"
                    hasHover
                    density="compact"
                    columns={[
                      {
                        key: 'page',
                        header: 'Route',
                        width: proportional(2),
                        renderCell: (row) => <RouteCell row={row as RouteRow} />,
                      },
                      {
                        key: 'views',
                        header: 'Views',
                        width: proportional(1),
                        align: 'end',
                        renderCell: (row) => <Text hasTabularNumbers>{String(row.views)}</Text>,
                      },
                      {
                        key: 'latency',
                        header: 'p99',
                        width: proportional(1),
                        align: 'end',
                        renderCell: (row) => (
                          <Text type="code" color="secondary">
                            {String(row.latency)}
                          </Text>
                        ),
                      },
                    ]}
                  />
                </Cell>
              </GridSpan>



              {/* No caption: "meters, not task progress" explains why we picked DataBar
                  over ProgressBar, which is a note for contributors rather than
                  a visitor, and the page is captured into a preview that cannot
                  afford the extra line. All three meters stay. */}
              <Cell title="Capacity">
                {/* DataBar's `label` is the accessible name only, so each meter
                    also carries a visible one. */}
                {METERS.map((meter) => (
                  <VStack key={meter.label} gap={1}>
                    <Text type="label">{meter.label}</Text>
                    <DataBar
                      label={meter.label}
                      segments={[{ id: 'used', value: meter.value, color: meter.color }]}
                      hasValueLabel
                      formatValue={(used) => `${used}% used`}
                    />
                  </VStack>
                ))}
              </Cell>

              <Cell title="Status" caption="A fixed vocabulary, seven tags">
                <HStack gap={3} vAlign="center">
                  <StatusWord variant="success" label="Healthy" />
                  <StatusWord variant="warning" label="Degraded" />
                  <StatusWord variant="error" label="Down" />
                </HStack>
                <HStack gap={1.5} wrap="wrap">
                  <Badge label="purple" variant="purple" />
                  <Badge label="pink" variant="pink" />
                  <Badge label="cyan" variant="cyan" />
                  <Badge label="green" variant="green" />
                  <Badge label="yellow" variant="yellow" />
                  <Badge label="orange" variant="orange" />
                  <Badge label="red" variant="red" />
                </HStack>
              </Cell>

              <GridSpan columns={2}>
                <Cell
                  title="Spec palette"
                  caption="The pinned tokens every component resolves to"
                  end={<Badge label="dark-only" variant="yellow" />}
                >
                  <Grid columns={{ minWidth: 80, max: 6 }} gap={2}>
                    {SPEC.map((s) => (
                      <VStack key={s.name} gap={1}>
                        <Card
                          padding={0}
                          style={{
                            backgroundColor: s.token,
                            height: 'var(--spacing-6)',
                            width: '100%',
                            borderRadius: 'var(--border-radius)',
                            border: 'var(--border-width) solid var(--color-separator)',
                          }}
                        >
                          <></>
                        </Card>
                        <Text type="supporting" color="secondary">
                          {s.name}
                        </Text>
                      </VStack>
                    ))}
                  </Grid>
                </Cell>
              </GridSpan>


            </Grid>
          </VStack>
        </section>
      </VStack>
    </Theme>
  );
}
