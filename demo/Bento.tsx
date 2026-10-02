import { type ReactNode, useState } from 'react';
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CodeBlock,
  Divider,
  Grid,
  GridSpan,
  HStack,
  Heading,
  StatusDot,
  Switch,
  Table,
  Text,
  TextInput,
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

const SNIPPET = `import { astryxDraculaTheme } from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`;

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

const TEAM = [
  { name: 'Ada Lovelace', role: 'Tokens', presence: 'Online' },
  { name: 'Alan Turing', role: 'Core', presence: 'Online' },
  { name: 'Grace Hopper', role: 'Charts', presence: 'Away' },
] as const;

const METERS: { label: string; value: number; color: DataBarSegment['color'] }[] = [
  { label: 'Build minutes quota', value: 62, color: 'var(--color-data-categorical-green)' },
  { label: 'Error budget', value: 91, color: 'var(--color-data-yellow-2)' },
  { label: 'Uptime', value: 99, color: 'var(--color-data-categorical-green)' },
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
const ONLINE = TEAM.filter((person) => person.presence === 'Online').length;

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

// The widget header the scaffolds define: `Heading level={3}` over a
// `supporting` line, with an optional right-hand slot. Ten cells repeat it
// verbatim, so it is stated once here for the same reason Dashboard hoists its
// Kpi — one edit reaches every cell instead of ten.
function Cell({
  title,
  caption,
  end,
  children,
}: {
  title: string;
  caption: string;
  end?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card padding={4}>
      <VStack gap={3}>
        <HStack justify="between" vAlign="center" gap={3}>
          <VStack gap={0.5}>
            <Heading level={3}>{title}</Heading>
            <Text type="supporting" color="secondary">
              {caption}
            </Text>
          </VStack>
          {end}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
}

export function Bento() {
  const [name, setName] = useState('octocat');
  const [repo, setRepo] = useState('yuzu-octopus/astryx-dracula');
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      {/* No background of its own: the SiteShell's transparent Section is the
          page background and the cells below are the only card surface. The
          previous version painted a second `--color-background` band over the
          whole content area, so every card matched the frame around it rather
          than the field it sat in, and a 100vh min-height left a dead band
          under the grid. */}
      <VStack gap={10}>
        <section id="bento">
          <Card padding={4}>
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
                <Text type="body" color="secondary">
                  Charts, tables, controls, status, and the pinned spec palette — one page
                  background, one card surface.
                </Text>
              </VStack>
              <HStack gap={6} vAlign="center">
                {[
                  { value: SPEC.length, label: 'spec tokens', tint: 'var(--color-text-yellow)' },
                  { value: ROUTES.length, label: 'routes' },
                  { value: BARS.length, label: 'months charted' },
                ].map((stat) => (
                  <VStack key={stat.label} gap={0.5}>
                    {/* The pinned-spec count is the one number on the page that
                        names the palette, so it takes yellow — the brand's tag
                        hue, 10.55:1 on the card. The other two stay on the KPI
                        role (`display-3` foreground); tinting all three would
                        be decoration, and the Dashboard precedent tints only
                        the delta, never the value. */}
                    <Text
                      type="display-3"
                      weight="semibold"
                      hasTabularNumbers
                      style={stat.tint ? { color: stat.tint } : undefined}
                    >
                      {stat.value}
                    </Text>
                    <Text type="supporting" color="secondary">
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </HStack>
          </Card>
        </section>

        <Divider />

        <section id="cells">
          <VStack gap={6}>
            <VStack gap={1}>
              <Heading level={2}>Component wall</Heading>
              <Text type="body" color="secondary">
                The showcase inventory in a four-up grid. Size follows importance: the chart, the
                route table, and the palette each take two columns.
              </Text>
            </VStack>

            <Grid columns={{ minWidth: 260, max: 4 }} gap={4}>
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
                  end={<Badge label={`${ROUTES.length} endpoints`} variant="neutral" />}
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
                  <Card padding={3} style={INSET}>
                    <HStack justify="between" vAlign="center" gap={3}>
                      <VStack gap={0.5}>
                        <Text weight="semibold" hasTabularNumbers>
                          {TOTAL_VIEWS.toLocaleString()} views
                        </Text>
                        {/* This line names the one route that missed, so it
                            takes warning yellow rather than reading as neutral
                            metadata. 10.55:1 on the card. */}
                        <Text type="supporting" style={{ color: 'var(--color-warning)' }}>
                          Slowest p99 on {SLOWEST.page} at {SLOWEST.latency}
                        </Text>
                      </VStack>
                      <Badge
                        label={SLOWEST.status === 'healthy' ? 'All healthy' : 'One degraded'}
                        variant={SLOWEST.status === 'healthy' ? 'green' : 'yellow'}
                      />
                    </HStack>
                  </Card>
                </Cell>
              </GridSpan>

              <Cell title="Team" caption="Presence reads as a word, never a hue alone">
                <VStack gap={2}>
                  {TEAM.map((person) => (
                    <HStack key={person.name} justify="between" gap={2} vAlign="center">
                      <HStack gap={2} vAlign="center">
                        <Avatar name={person.name} size="sm" tooltip={false} />
                        <Text weight="semibold">{person.name}</Text>
                        <Text type="supporting" color="secondary">
                          {person.role}
                        </Text>
                      </HStack>
                      <HStack gap={1.5} vAlign="center">
                        <StatusDot
                          variant={person.presence === 'Online' ? 'success' : 'warning'}
                          label={person.presence}
                        />
                        <Text
                          type="supporting"
                          style={{
                            color:
                              person.presence === 'Online'
                                ? 'var(--color-positive)'
                                : 'var(--color-warning)',
                          }}
                        >
                          {person.presence}
                        </Text>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
                <Card padding={3} style={INSET}>
                  <HStack justify="between" vAlign="center" gap={3}>
                    <Text weight="semibold" hasTabularNumbers>
                      {ONLINE} of {TEAM.length} online
                    </Text>
                    <Badge label="Roster" variant="neutral" />
                  </HStack>
                </Card>
              </Cell>

              <Cell title="Inputs" caption="Fields and switches, dim on hover">
                <TextInput label="Username" value={name} onChange={setName} />
                <TextInput label="Repository" value={repo} onChange={setRepo} />
                <HStack gap={4} vAlign="center">
                  <Switch label="Alerts" value={alerts} onChange={setAlerts} />
                  <Switch label="Digest" value={digest} onChange={setDigest} />
                </HStack>
              </Cell>

              <Cell title="Capacity" caption="Meters, not task progress">
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
                <Banner
                  status="success"
                  title="All checks green"
                  description={`Zero drift across ${SPEC.length} spec tokens.`}
                />
              </Cell>

              <GridSpan columns={2}>
                <Cell
                  title="Spec palette"
                  caption="The pinned tokens every component resolves to"
                  end={<Badge label="dark-only" variant="yellow" />}
                >
                  <Grid columns={{ minWidth: 96, max: 6 }} gap={2}>
                    {SPEC.map((s) => (
                      <VStack key={s.name} gap={1}>
                        <Card
                          padding={0}
                          style={{
                            backgroundColor: s.token,
                            height: 'var(--spacing-8)',
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

              <Cell title="Type scale" caption="Roles, not raw sizes">
                <VStack gap={2}>
                  <Text type="label">Form and group labels</Text>
                  <Text type="body">Anything you must read to act</Text>
                  <Text type="code" color="secondary">
                    tokens, hexes, commands
                  </Text>
                  <Text type="supporting" color="secondary">
                    Metadata only
                  </Text>
                </VStack>
              </Cell>

              <Cell title="Ship it" caption="Prebuilt CSS, zero runtime cost">
                <CodeBlock
                  code="bun add astryx-dracula"
                  language="bash"
                  hasCopyButton
                  width="100%"
                />
              </Cell>

              <GridSpan columns="full">
                <Cell
                  title="Actions"
                  caption="Every button variant, then the provider that ships them"
                >
                  <Grid columns={{ minWidth: 300, max: 2 }} gap={4} align="center">
                    <HStack gap={2} wrap="wrap" vAlign="center">
                      <Button label="Primary" variant="primary" />
                      <Button label="Secondary" variant="secondary" />
                      <Button label="Ghost" variant="ghost" />
                      <Button label="Delete" variant="destructive" />
                      <Button label="Small" size="sm" variant="primary" />
                      <Button label="Loading…" isLoading variant="secondary" />
                    </HStack>
                    <Card padding={3} style={INSET}>
                      <CodeBlock code={SNIPPET} language="tsx" isWrapped width="100%" />
                    </Card>
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
