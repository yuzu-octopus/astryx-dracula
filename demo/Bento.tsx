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

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <VStack
        gap={4}
        style={{
          backgroundColor: 'var(--color-background)',
          minHeight: '100vh',
          padding: '32px',
        }}
      >
        <HStack justify="between" vAlign="center">
          <HStack gap={2} vAlign="center">
            <StatusDot variant="accent" label="Dracula" isPulsing />
            <Heading level={2}>Astryx Dracula</Heading>
            <Badge label="dark-only" variant="purple" />
          </HStack>
          <HStack gap={2} vAlign="center">
            <Link href="https://github.com/yuzu-octopus/astryx-dracula">GitHub</Link>
            <Button label="Use this theme" variant="primary" />
          </HStack>
        </HStack>

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

        <Grid columns={4} gap={4}>
          <Card padding={4} style={{ gridColumn: 'span 2' }}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={3}>Traffic</Heading>
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
                <Heading level={3}>Routes</Heading>
                <Badge label="live" variant="green" />
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
              <Heading level={3}>Team</Heading>
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
              <Heading level={3}>Inputs</Heading>
              <TextInput label="Username" value={name} onChange={setName} />
              <HStack gap={3} vAlign="center">
                <Switch label="Alerts" value={alerts} onChange={setAlerts} />
                <Switch label="Digest" value={false} onChange={() => {}} />
              </HStack>
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={3}>Status</Heading>
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
              <Heading level={3}>Progress</Heading>
              <ProgressBar label="Build quota" value={62} variant="accent" hasValueLabel />
              <ProgressBar label="Error budget" value={91} variant="warning" hasValueLabel />
              <ProgressBar label="Uptime" value={99} variant="success" hasValueLabel />
            </VStack>
          </Card>

          <Card padding={4} style={{ gridColumn: 'span 2' }}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={3}>Actions</Heading>
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
                <Button label="Loading..." isLoading variant="secondary" />
              </HStack>
              <CodeBlock code={SNIPPET} language="tsx" isWrapped width="100%" />
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={3}>Checks</Heading>
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
        </Grid>
      </VStack>
    </Theme>
  );
}
