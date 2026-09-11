import { useState } from 'react';
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CodeBlock,
  Grid,
  HStack,
  Heading,
  Link,
  ProgressBar,
  StatusDot,
  Switch,
  Table,
  Text,
  TextInput,
  VStack,
} from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';

const BARS = [
  { month: 'Jan', value: 42, color: 'var(--dracula-purple)' },
  { month: 'Feb', value: 68, color: 'var(--dracula-pink)' },
  { month: 'Mar', value: 55, color: 'var(--dracula-cyan)' },
  { month: 'Apr', value: 90, color: 'var(--dracula-green)' },
  { month: 'May', value: 74, color: 'var(--dracula-yellow)' },
  { month: 'Jun', value: 61, color: 'var(--dracula-orange)' },
];

interface RouteRow extends Record<string, unknown> {
  page: string;
  views: string;
  status: 'healthy' | 'degraded';
}

const ROUTES: RouteRow[] = [
  { page: '/', views: '48,210', status: 'healthy' },
  { page: '/docs', views: '21,740', status: 'healthy' },
  { page: '/components', views: '9,430', status: 'degraded' },
  { page: '/dashboard', views: '6,120', status: 'healthy' },
  { page: '/themes', views: '3,908', status: 'healthy' },
];

const SNIPPET = `import { astryxDraculaTheme } from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`;

const SPEC = [
  { name: 'bg', token: 'var(--dracula-bg)' },
  { name: 'fg', token: 'var(--dracula-fg)' },
  { name: 'comment', token: 'var(--dracula-comment)' },
  { name: 'cyan', token: 'var(--dracula-cyan)' },
  { name: 'green', token: 'var(--dracula-green)' },
  { name: 'orange', token: 'var(--dracula-orange)' },
  { name: 'pink', token: 'var(--dracula-pink)' },
  { name: 'purple', token: 'var(--dracula-purple)' },
  { name: 'red', token: 'var(--dracula-red)' },
  { name: 'yellow', token: 'var(--dracula-yellow)' },
  { name: 'line', token: 'var(--dracula-current-line)' },
  { name: 'select', token: 'var(--dracula-selection)' },
];

function Stat({ value, label, tint }: { value: string; label: string; tint: string }) {
  return (
    <VStack gap={0.5}>
      <Text weight="semibold" style={{ color: tint, fontSize: '20px' }}>
        {value}
      </Text>
      <Text type="supporting" color="secondary">
        {label}
      </Text>
    </VStack>
  );
}

export function Bento() {
  const [name, setName] = useState('octocat');
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      {/* Compact chrome: the showcase top bar already carries the wordmark,
          links, and CTA, so this page skips its own header row and opens on
          the content. Padding 16/0 keeps the grid off the viewport edges
          with no dead band above the first card. */}
      <VStack
        gap={3}
        style={{
          backgroundColor: 'var(--color-background)',
          minHeight: '100vh',
          padding: '0 16px 16px',
        }}
      >
        <Card padding={4}>
          <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
            <VStack gap={1}>
              <Heading level={1} type="display-2">
                Dracula, live in every component
              </Heading>
              <Text type="body" color="secondary">
                Pure Dracula brand kit for Astryx sites. Prebuilt CSS, zero runtime cost.
              </Text>
            </VStack>
            <HStack gap={6} vAlign="center">
              <Stat value="155" label="components" tint="var(--dracula-purple)" />
              <Stat value="270+" label="tokens" tint="var(--dracula-cyan)" />
              <Stat value="12" label="spec hexes" tint="var(--dracula-green)" />
            </HStack>
          </HStack>
        </Card>

        <Grid columns={{ minWidth: 260, max: 4 }} gap={4}>
          <Card padding={4}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={2}>Traffic</Heading>
                <Badge label="6 mo" variant="neutral" />
              </HStack>
              <svg viewBox="0 0 460 150" width="100%" role="img" aria-label="Traffic bar chart">
                {BARS.map((b, i) => {
                  const h = (b.value / 100) * 105;
                  const x = 16 + i * 74;
                  return (
                    <g key={b.month}>
                      <rect x={x} y={120 - h} width={48} height={h} rx={4} fill={b.color} />
                      <text
                        x={x + 24}
                        y={138}
                        textAnchor="middle"
                        fontSize={13}
                        fill="var(--color-text-paragraph)"
                        fontFamily="var(--font-family-mono)"
                      >
                        {b.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </VStack>
          </Card>

          <Card padding={4} style={{ gridRow: 'span 2' }}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={2}>Routes</Heading>
                <HStack gap={1.5} vAlign="center">
                  <StatusDot variant="success" label="Live" isPulsing />
                  <Text type="supporting" color="secondary">
                    Live
                  </Text>
                </HStack>
              </HStack>
              <Table
                data={ROUTES}
                idKey="page"
                hasHover
                density="compact"
                columns={[
                  {
                    key: 'page',
                    header: 'Route',
                    renderCell: (row) => (
                      <HStack gap={2} vAlign="center">
                        <StatusDot
                          variant={row.status === 'healthy' ? 'success' : 'warning'}
                          label={String(row.status)}
                        />
                        <Text weight="semibold">{String(row.page)}</Text>
                      </HStack>
                    ),
                  },
                  {
                    key: 'views',
                    header: 'Views',
                    align: 'end',
                    renderCell: (row) => <Text hasTabularNumbers>{String(row.views)}</Text>,
                  },
                ]}
              />
              <Text type="supporting" color="secondary">
                Edge routing throughput and p99 response times.
              </Text>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Team</Heading>
              <HStack gap={2} vAlign="center">
                <Avatar name="Ada Lovelace" tooltip={false} />
                <Avatar name="Alan Turing" tooltip={false} />
                <Avatar name="Grace Hopper" tooltip={false} />
              </HStack>
              <Text type="supporting" color="secondary">
                3 online, presence in Dracula green.
              </Text>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Inputs</Heading>
              <TextInput label="Username" value={name} onChange={setName} />
              <HStack gap={3} vAlign="center">
                <Switch label="Alerts" value={alerts} onChange={setAlerts} />
                <Switch label="Digest" value={digest} onChange={setDigest} />
              </HStack>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Status</Heading>
              <HStack gap={1.5} wrap="wrap">
                <Badge label="purple" variant="purple" />
                <Badge label="pink" variant="pink" />
                <Badge label="cyan" variant="cyan" />
                <Badge label="green" variant="green" />
                <Badge label="yellow" variant="yellow" />
                <Badge label="orange" variant="orange" />
                <Badge label="red" variant="red" />
              </HStack>
              <HStack gap={2} vAlign="center">
                <StatusDot variant="success" label="Healthy" isPulsing />
                <StatusDot variant="warning" label="Degraded" />
                <StatusDot variant="error" label="Down" />
              </HStack>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Progress</Heading>
              <ProgressBar label="Build quota" value={62} variant="accent" hasValueLabel />
              <ProgressBar label="Error budget" value={91} variant="warning" hasValueLabel />
              <ProgressBar label="Uptime" value={99} variant="success" hasValueLabel />
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={2}>Actions</Heading>
                <Text type="supporting" color="secondary">
                  Dim on hover, 5px radii
                </Text>
              </HStack>
              <HStack gap={2} wrap="wrap">
                <Button label="Primary" variant="primary" />
                <Button label="Secondary" variant="secondary" />
                <Button label="Ghost" variant="ghost" />
                <Button label="Delete" variant="destructive" />
                <Button label="Small" size="sm" variant="primary" />
                <Button label="Loading…" isLoading variant="secondary" />
              </HStack>
              <CodeBlock code={SNIPPET} language="tsx" isWrapped width="100%" />
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Checks</Heading>
              <Banner
                status="success"
                title="All checks green"
                description="Zero drift across 12 spec tokens."
              />
              <Banner
                status="warning"
                title="WCAG AA held"
                description="Contrast gates pass on every pair."
              />
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={2}>Spec palette</Heading>
                <Badge label="12 pinned" variant="purple" />
              </HStack>
              <Grid columns={{ minWidth: 96, max: 6 }} gap={2}>
                {SPEC.map((s) => (
                  <VStack key={s.name} gap={1}>
                    <Card
                      padding={0}
                      style={{
                        backgroundColor: s.token,
                        height: '28px',
                        width: '100%',
                        borderRadius: 'var(--border-radius)',
                        border: 'var(--border-width) solid var(--color-separator)',
                      }}
                    >
                      <></>
                    </Card>
                    <Text type="code" color="secondary">
                      {s.name}
                    </Text>
                  </VStack>
                ))}
              </Grid>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={2}>
              <Heading level={2}>Type scale</Heading>
              <Text weight="semibold" style={{ fontSize: '20px' }}>
                Heading 20
              </Text>
              <Text type="body">Body copy at fourteen pixels.</Text>
              <Text type="code" color="secondary">
                mono code fourteen
              </Text>
              <Text type="supporting" color="secondary">
                Supporting twelve, metadata only.
              </Text>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={2}>Ship it</Heading>
              <CodeBlock code="bun add astryx-dracula" language="bash" width="100%" />
              <Text type="supporting" color="secondary">
                Zero runtime cost. Copy the skill, paste the prompt, ship dark.
              </Text>
            </VStack>
          </Card>
        </Grid>
      </VStack>
    </Theme>
  );
}
