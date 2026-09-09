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
];

const SNIPPET = `import { astryxDraculaTheme } from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`;

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

        <Grid columns={{ minWidth: 300, max: 4 }} gap={4}>
          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={3}>Actions</Heading>
              <HStack gap={2} wrap="wrap">
                <Button label="Primary" variant="primary" />
                <Button label="Secondary" variant="secondary" />
                <Button label="Ghost" variant="ghost" />
                <Button label="Delete" variant="destructive" />
              </HStack>
              <Text type="supporting" color="secondary">
                Dim on hover, 5px radii, JetBrains Mono throughout.
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

          <Card padding={4}>
            <VStack gap={3}>
              <HStack justify="between" vAlign="center">
                <Heading level={3}>Traffic</Heading>
                <Badge label="6 mo" variant="neutral" />
              </HStack>
              <svg viewBox="0 0 360 140" width="100%" role="img" aria-label="Traffic bar chart">
                {BARS.map((b, i) => {
                  const h = (b.value / 100) * 100;
                  const x = 14 + i * 58;
                  return (
                    <rect key={b.month} x={x} y={115 - h} width={38} height={h} rx={4} fill={b.color} />
                  );
                })}
              </svg>
            </VStack>
          </Card>

          <Card padding={4}>
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
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={3}>Code</Heading>
              <CodeBlock code={SNIPPET} language="tsx" isWrapped width="100%" />
            </VStack>
          </Card>

          <Card padding={4}>
            <VStack gap={3}>
              <Heading level={3}>Team</Heading>
              <HStack gap={2} vAlign="center">
                <Avatar name="Ada Lovelace" tooltip={false} />
                <Avatar name="Alan Turing" tooltip={false} />
                <Avatar name="Grace Hopper" tooltip={false} />
                <VStack gap={0.5}>
                  <Text weight="semibold">3 online</Text>
                  <Text type="supporting" color="secondary">
                    Presence in Dracula green
                  </Text>
                </VStack>
              </HStack>
              <Banner
                status="success"
                title="All checks green"
                description="Zero drift across 12 spec tokens."
              />
            </VStack>
          </Card>
        </Grid>
      </VStack>
    </Theme>
  );
}
