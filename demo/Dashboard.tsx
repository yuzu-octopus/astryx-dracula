import { Card, Grid, Heading, ProgressBar, Table, Text, VStack } from '@astryxdesign/core';

const BARS = [
  { month: 'Jan', value: 42, fill: 'var(--color-data-categorical-purple)' },
  { month: 'Feb', value: 68, fill: 'var(--color-data-categorical-pink)' },
  { month: 'Mar', value: 55, fill: 'var(--color-data-categorical-cyan)' },
  { month: 'Apr', value: 90, fill: 'var(--color-data-categorical-green)' },
  { month: 'May', value: 74, fill: 'var(--color-data-categorical-yellow)' },
  { month: 'Jun', value: 61, fill: 'var(--color-data-categorical-orange)' },
  { month: 'Jul', value: 83, fill: 'var(--color-data-categorical-red)' },
];

interface TrafficRow extends Record<string, unknown> {
  page: string;
  views: string;
  change: number;
}

const TRAFFIC: TrafficRow[] = [
  { page: '/', views: '48.2k', change: 12 },
  { page: '/docs', views: '21.7k', change: 8 },
  { page: '/components', views: '9.4k', change: -3 },
  { page: '/dashboard', views: '6.1k', change: 21 },
];

function Kpi({ label, value, delta }: { label: string; value: string; delta: number }) {
  const up = delta >= 0;
  return (
    <Card>
      <Text>{label}</Text>
      <Heading level={3}>{value}</Heading>
      <Text style={{ color: up ? 'var(--color-positive)' : 'var(--color-negative)' }}>
        {up ? '+' : ''}{delta}%
      </Text>
    </Card>
  );
}

export function Dashboard() {
  return (
    <VStack>
      <Grid columns={{ minWidth: 220 }} gap={2}>
        <Kpi label="Visitors" value="84.9k" delta={12} />
        <Kpi label="Page views" value="312k" delta={8} />
        <Kpi label="Bounce" value="31%" delta={-3} />
        <Kpi label="Adoption" value="72%" delta={21} />
      </Grid>
      <Heading level={2}>Traffic by month</Heading>
      <Card>
        <svg viewBox="0 0 700 220" width="100%" role="img" aria-label="Monthly traffic bar chart">
          {BARS.map((b, i) => {
            const h = (b.value / 100) * 160;
            const x = 20 + i * 96;
            return (
              <g key={b.month}>
                <rect x={x} y={180 - h} width={56} height={h} rx={5} fill={b.fill} />
                <text x={x + 28} y={200} textAnchor="middle" fontSize={12} fill="var(--color-text-subdue)">
                  {b.month}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>
      <Heading level={2}>Top pages</Heading>
      <Table
        data={TRAFFIC}
        idKey="page"
        hasHover
        columns={[
          { key: 'page', header: 'Page' },
          { key: 'views', header: 'Views', align: 'end' },
          {
            key: 'change',
            header: 'Change',
            align: 'end',
            renderCell: (row) => (
              <Text style={{ color: (row.change as number) >= 0 ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                {(row.change as number) >= 0 ? '+' : ''}{String(row.change)}%
              </Text>
            ),
          },
        ]}
      />
      <Heading level={2}>Capacity</Heading>
      <Card>
        <ProgressBar label="Build minutes" value={62} hasValueLabel />
        <ProgressBar label="Bandwidth" value={38} variant="success" hasValueLabel />
        <ProgressBar label="Error budget" value={91} variant="warning" hasValueLabel />
      </Card>
    </VStack>
  );
}
