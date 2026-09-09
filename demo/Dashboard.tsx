import { Badge, Card, Grid, Heading, HStack, ProgressBar, StatusDot, Table, Text, VStack, proportional, pixel } from '@astryxdesign/core';

const BARS = [
  { month: 'Jan', value: 42, color: 'var(--dracula-purple)', label: 'Purple' },
  { month: 'Feb', value: 68, color: 'var(--dracula-pink)', label: 'Pink' },
  { month: 'Mar', value: 55, color: 'var(--dracula-cyan)', label: 'Cyan' },
  { month: 'Apr', value: 90, color: 'var(--dracula-green)', label: 'Green' },
  { month: 'May', value: 74, color: 'var(--dracula-yellow)', label: 'Yellow' },
  { month: 'Jun', value: 61, color: 'var(--dracula-orange)', label: 'Orange' },
  { month: 'Jul', value: 83, color: 'var(--dracula-red)', label: 'Red' },
];

interface TrafficRow extends Record<string, unknown> {
  page: string;
  views: string;
  latency: string;
  status: 'healthy' | 'degraded';
  change: number;
}

const TRAFFIC: TrafficRow[] = [
  { page: '/', views: '48,210', latency: '12ms', status: 'healthy', change: 12.4 },
  { page: '/docs', views: '21,740', latency: '18ms', status: 'healthy', change: 8.1 },
  { page: '/components', views: '9,430', latency: '24ms', status: 'degraded', change: -3.2 },
  { page: '/dashboard', views: '6,120', latency: '16ms', status: 'healthy', change: 21.0 },
];

function Kpi({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta: number;
  hint: string;
}) {
  const up = delta >= 0;
  return (
    <Card padding={4}>
      <VStack gap={2}>
        <HStack justify="between" vAlign="center">
          <Text type="supporting" color="secondary">
            {label}
          </Text>
          <StatusDot
            variant={up ? 'success' : 'error'}
            label={up ? 'Positive trend' : 'Negative trend'}
          />
        </HStack>
        <Heading level={3} type="display-2">
          {value}
        </Heading>
        <HStack gap={1.5} vAlign="center">
          <Text
            weight="semibold"
            style={{
              color: up ? 'var(--color-positive)' : 'var(--color-negative)',
            }}
          >
            {up ? '+' : ''}
            {delta}%
          </Text>
          <Text type="supporting" color="secondary">
            {hint}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

export function Dashboard() {
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>Observability Dashboard</Heading>
        <Text type="body" color="secondary">
          Dense telemetry, key indicators, and categorical data visualisations styled with Dracula tokens.
        </Text>
      </VStack>

      <Grid columns={{ minWidth: 220, max: 4 }} gap={3}>
        <Kpi label="Active Users" value="84.9k" delta={12.4} hint="vs last week" />
        <Kpi label="Total Page Views" value="312k" delta={8.1} hint="vs last week" />
        <Kpi label="Bounce Rate" value="31%" delta={-3.2} hint="vs last week" />
        <Kpi label="Design Adoption" value="72%" delta={21.0} hint="vs last week" />
      </Grid>

      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        <Card padding={4}>
          <VStack gap={4}>
            <HStack justify="between" vAlign="center">
              <VStack gap={0.5}>
                <Heading level={3}>Traffic by Month</Heading>
                <Text type="supporting" color="secondary">
                  Categorical spectral distribution
                </Text>
              </VStack>
              <Badge label="Categorical" variant="purple" />
            </HStack>

            <Card
              padding={3}
              style={{
                backgroundColor: 'var(--color-background)',
                border: 'var(--border-width) solid var(--color-separator)',
              }}
            >
              <svg
                viewBox="0 0 540 180"
                width="100%"
                role="img"
                aria-label="Monthly traffic bar chart displaying categorical data across Dracula theme colors"
              >
                {/* Horizontal guide lines */}
                <line x1="20" y1="30" x2="520" y2="30" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
                <line x1="20" y1="80" x2="520" y2="80" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
                <line x1="20" y1="130" x2="520" y2="130" stroke="var(--color-separator)" />

                {BARS.map((b, i) => {
                  const h = (b.value / 100) * 110;
                  const x = 32 + i * 70;
                  return (
                    <g key={b.month}>
                      <rect
                        x={x}
                        y={130 - h}
                        width={46}
                        height={h}
                        rx={4}
                        fill={b.color}
                      />
                      <text
                        x={x + 23}
                        y={120 - h}
                        textAnchor="middle"
                        fontSize={13}
                        fill="var(--color-text-highlight)"
                        fontFamily="var(--font-family-mono)"
                      >
                        {b.value}k
                      </text>
                      <text
                        x={x + 23}
                        y={150}
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
            </Card>

            <HStack gap={1.5} wrap="wrap" justify="center">
              <Badge label="purple" variant="purple" />
              <Badge label="pink" variant="pink" />
              <Badge label="cyan" variant="cyan" />
              <Badge label="green" variant="green" />
              <Badge label="yellow" variant="yellow" />
              <Badge label="orange" variant="orange" />
              <Badge label="red" variant="red" />
            </HStack>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={4}>
            <HStack justify="between" vAlign="center">
              <VStack gap={0.5}>
                <Heading level={3}>Cluster Capacity</Heading>
                <Text type="supporting" color="secondary">
                  Real-time resource allowances
                </Text>
              </VStack>
              <HStack gap={1.5} vAlign="center">
                <StatusDot variant="success" label="Healthy" isPulsing />
                <Text type="supporting" color="secondary">
                  Operational
                </Text>
              </HStack>
            </HStack>

            <VStack gap={4}>
              <ProgressBar label="Build minutes quota" value={62} variant="accent" hasValueLabel />
              <ProgressBar label="Network egress bandwidth" value={38} variant="success" hasValueLabel />
              <ProgressBar label="Monthly error budget" value={91} variant="warning" hasValueLabel />
              <ProgressBar label="Memory pool allocation" value={45} variant="neutral" hasValueLabel />
            </VStack>

            <Card
              padding={3}
              style={{
                backgroundColor: 'var(--color-background)',
                border: 'var(--border-width) solid var(--color-separator)',
              }}
            >
              <HStack justify="between" vAlign="center">
                <VStack gap={0.5}>
                  <Text weight="semibold">SLA Guarantee: 99.98%</Text>
                  <Text type="supporting" color="secondary">
                    32 edge regions · zero dropped connections
                  </Text>
                </VStack>
                <Badge label="Compliant" variant="green" />
              </HStack>
            </Card>
          </VStack>
        </Card>
      </Grid>

      <Card padding={4}>
        <VStack gap={3}>
          <HStack justify="between" vAlign="center">
            <VStack gap={0.5}>
              <Heading level={3}>Top Routes</Heading>
              <Text type="supporting" color="secondary">
                Edge routing throughput and p99 response times
              </Text>
            </VStack>
            <Badge label="4 endpoints" variant="neutral" />
          </HStack>

          <Table
            data={TRAFFIC}
            idKey="page"
            hasHover
            density="balanced"
            columns={[
              {
                key: 'page',
                header: 'Route',
                width: proportional(2),
                renderCell: (row) => (
                  <HStack gap={2} vAlign="center">
                    <StatusDot
                      variant={row.status === 'healthy' ? 'success' : 'warning'}
                      label={row.status === 'healthy' ? 'Optimal' : 'Investigating'}
                    />
                    <Text weight="semibold">{String(row.page)}</Text>
                  </HStack>
                ),
              },
              {
                key: 'views',
                header: 'Views',
                width: proportional(1),
                align: 'end',
                renderCell: (row) => (
                  <Text hasTabularNumbers>{String(row.views)}</Text>
                ),
              },
              {
                key: 'latency',
                header: 'p99 Latency',
                width: proportional(1),
                align: 'end',
                renderCell: (row) => (
                  <Text type="code" color="secondary">
                    {String(row.latency)}
                  </Text>
                ),
              },
              {
                key: 'change',
                header: 'Trend',
                width: proportional(1),
                align: 'end',
                renderCell: (row) => {
                  const num = row.change as number;
                  const up = num >= 0;
                  return (
                    <Text
                      hasTabularNumbers
                      weight="semibold"
                      style={{
                        color: up ? 'var(--color-positive)' : 'var(--color-negative)',
                      }}
                    >
                      {up ? '+' : ''}
                      {num.toFixed(1)}%
                    </Text>
                  );
                },
              },
            ]}
          />
        </VStack>
      </Card>
    </VStack>
  );
}
