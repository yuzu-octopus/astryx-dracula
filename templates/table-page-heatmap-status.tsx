// Copyright (c) Meta Platforms, Inc. and affiliates.

import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';
import {Card} from '@astryxdesign/core/Card';
import {Link} from '@astryxdesign/core/Link';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Filter, Download, RotateCw} from 'lucide-react';

// ============= ICONS (verified lucide-react exports) =============
// Filter ← FunnelIcon, Download ← ArrowDownTrayIcon, RotateCw ← ArrowPathIcon.

// ============= DATA =============

type Severity = 'critical' | 'major' | 'minor' | 'resolved';
type ProductName =
  | 'Ads Manager'
  | 'Business Suite'
  | 'Commerce Manager'
  | 'Pages'
  | 'Messenger API'
  | 'Graph API'
  | 'WhatsApp Business'
  | 'Instagram API';

interface IncidentRow extends Record<string, unknown> {
  id: string;
  product: ProductName;
  title: string;
  severity: Severity;
  status: 'ongoing' | 'identified' | 'monitoring' | 'resolved';
  oncall: string;
  startTime: string;
  duration: string;
  date: string;
  dayOfWeek: number;
  hour: number;
}

const incidents: IncidentRow[] = [
  // Active — ongoing
  {
    id: 'INC-4008',
    product: 'Business Suite',
    title:
      'Notification delivery delays affecting mobile push and email channels — queue saturation under investigation',
    severity: 'major',
    oncall: 'Carlos Mendez',
    status: 'ongoing',
    startTime: '09:15',
    duration: 'ongoing',
    date: '2025-01-15',
    dayOfWeek: 3,
    hour: 9,
  },
  // Tue (2) 3pm — the only major outage cluster (3 incidents)
  {
    id: 'INC-4001',
    product: 'Ads Manager',
    title:
      'Campaign creation timing out for ~12% of advertisers in EMEA region — root caused to elevated DB write latency',
    severity: 'critical',
    oncall: 'Sarah Chen',
    status: 'resolved',
    startTime: '15:10',
    duration: '2h 15m',
    date: '2025-01-14',
    dayOfWeek: 2,
    hour: 15,
  },
  {
    id: 'INC-4002',
    product: 'Graph API',
    title:
      'Elevated 5xx error rates on /me and /me/accounts endpoints affecting third-party integrations globally',
    severity: 'critical',
    oncall: 'David Kim',
    status: 'resolved',
    startTime: '15:30',
    duration: '3h 20m',
    date: '2025-01-14',
    dayOfWeek: 2,
    hour: 15,
  },
  {
    id: 'INC-4003',
    product: 'Instagram API',
    title:
      'Media upload failures for image and video content via /media endpoint affecting ~8% of publishers',
    severity: 'major',
    oncall: 'Priya Sharma',
    status: 'resolved',
    startTime: '15:05',
    duration: '1h 50m',
    date: '2025-01-14',
    dayOfWeek: 2,
    hour: 15,
  },
  // Tue (2) 4pm — spillover (2 incidents)
  {
    id: 'INC-4004',
    product: 'Ads Manager',
    title:
      'Audience insights tab returning empty results due to cache invalidation cascade from earlier outage',
    severity: 'minor',
    oncall: 'Marcus Rivera',
    status: 'resolved',
    startTime: '16:00',
    duration: '45m',
    date: '2025-01-14',
    dayOfWeek: 2,
    hour: 16,
  },
  {
    id: 'INC-4005',
    product: 'WhatsApp Business',
    title:
      'Outbound message delivery delays of 2-5 minutes for high-volume senders due to queue backpressure',
    severity: 'major',
    oncall: 'Elena Volkov',
    status: 'resolved',
    startTime: '16:20',
    duration: '1h 15m',
    date: '2025-01-14',
    dayOfWeek: 2,
    hour: 16,
  },
  // Thu (4) 10am — single incident
  {
    id: 'INC-4006',
    product: 'Commerce Manager',
    title:
      'Product catalog sync failures from Shopify and BigCommerce integrations after schema migration deployed',
    severity: 'major',
    oncall: 'Noah Williams',
    status: 'resolved',
    startTime: '10:15',
    duration: '2h 40m',
    date: '2025-01-16',
    dayOfWeek: 4,
    hour: 10,
  },
  // Fri (5) 4pm — single incident
  {
    id: 'INC-4007',
    product: 'Messenger API',
    title:
      'Webhook delivery failures for subscribed page events — retries succeeded but signaled false alerts',
    severity: 'minor',
    oncall: 'Mei Lin',
    status: 'resolved',
    startTime: '16:30',
    duration: '45m',
    date: '2025-01-17',
    dayOfWeek: 5,
    hour: 16,
  },
  // Active incident
  // Scattered minor blips — light pink cells
  {
    id: 'INC-4009',
    product: 'Pages',
    title:
      'Image upload timeouts for posts larger than 4MB — auto-recovered after CDN region failover',
    severity: 'minor',
    oncall: 'Fatima Al-Rashid',
    status: 'resolved',
    startTime: '11:00',
    duration: '20m',
    date: '2025-01-12',
    dayOfWeek: 0,
    hour: 11,
  },
  {
    id: 'INC-4010',
    product: 'Graph API',
    title:
      'Intermittent 503 errors on a single load balancer in us-east-1 — auto-healed by health check rotation',
    severity: 'minor',
    oncall: 'Lucas Andersson',
    status: 'resolved',
    startTime: '14:30',
    duration: '15m',
    date: '2025-01-13',
    dayOfWeek: 1,
    hour: 14,
  },
  {
    id: 'INC-4011',
    product: 'WhatsApp Business',
    title:
      'Template message rejections due to stale category cache for newly approved templates',
    severity: 'minor',
    oncall: 'Sofia Garcia',
    status: 'resolved',
    startTime: '13:00',
    duration: '30m',
    date: '2025-01-16',
    dayOfWeek: 4,
    hour: 13,
  },
  {
    id: 'INC-4012',
    product: 'Commerce Manager',
    title:
      'Inventory count mismatch between checkout and catalog services for ~200 SKUs in test region',
    severity: 'minor',
    oncall: 'Raj Kapoor',
    status: 'resolved',
    startTime: '12:00',
    duration: '1h 00m',
    date: '2025-01-17',
    dayOfWeek: 5,
    hour: 12,
  },
  {
    id: 'INC-4013',
    product: 'Instagram API',
    title:
      'Story insights data delayed by 30-60 minutes for accounts with >100K followers',
    severity: 'minor',
    oncall: 'Emma Thompson',
    status: 'resolved',
    startTime: '10:00',
    duration: '45m',
    date: '2025-01-18',
    dayOfWeek: 6,
    hour: 10,
  },
  {
    id: 'INC-4014',
    product: 'Business Suite',
    title:
      'Slow inbox loading times (>3s p95) for accounts with large message histories — index rebuild in progress',
    severity: 'minor',
    oncall: 'Andre Santos',
    status: 'resolved',
    startTime: '15:00',
    duration: '25m',
    date: '2025-01-15',
    dayOfWeek: 3,
    hour: 15,
  },
];

const DAYS = [
  'Jan 12',
  'Jan 13',
  'Jan 14',
  'Jan 15',
  'Jan 16',
  'Jan 17',
  'Jan 18',
];
const HOURS = [
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
];

function buildHeatmapData(data: IncidentRow[]) {
  return HOURS.flatMap((hour, hi) =>
    DAYS.map((day, di) => {
      const hourValue = 9 + hi;
      const count = data.filter(
        o => o.dayOfWeek === di && o.hour === hourValue,
      ).length;
      return {day, hour, incidents: count};
    }),
  );
}

const statusVariant: Record<string, 'error' | 'warning' | 'info' | 'success'> =
  {
    ongoing: 'error',
    identified: 'warning',
    monitoring: 'info',
    resolved: 'success',
  };

const columns: TableColumn<IncidentRow>[] = [
  {
    key: 'id',
    header: 'Incident',
    width: pixel(110),
    renderCell: (item: IncidentRow) => (
      <Link href="#" isStandalone>
        {item.id}
      </Link>
    ),
  },
  {
    key: 'product',
    header: 'Product',
    width: proportional(2),
    renderCell: (item: IncidentRow) => <Text type="body">{item.product}</Text>,
  },
  {
    key: 'title',
    header: 'Description',
    width: proportional(5),
    renderCell: (item: IncidentRow) => <Text type="body">{item.title}</Text>,
  },
  {
    key: 'startTime',
    header: 'Started',
    width: pixel(80),
    renderCell: (item: IncidentRow) => (
      <Text type="body" hasTabularNumbers>
        {item.startTime}
      </Text>
    ),
  },
  {
    key: 'duration',
    header: 'Duration',
    width: pixel(100),
    renderCell: (item: IncidentRow) => (
      <Text type="body" hasTabularNumbers>
        {item.duration}
      </Text>
    ),
  },
  {
    key: 'oncall',
    header: 'On-call',
    width: proportional(2),
    renderCell: (item: IncidentRow) => (
      <HStack gap={2} vAlign="center">
        <Avatar name={item.oncall} size="sm" />
        <Text type="body">{item.oncall}</Text>
      </HStack>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(120),
    renderCell: (item: IncidentRow) => (
      <Badge
        label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        variant={statusVariant[item.status]}
      />
    ),
  },
  {
    key: 'date',
    header: 'Date',
    width: pixel(110),
    renderCell: (item: IncidentRow) => <Text type="body">{item.date}</Text>,
  },
];

// ============= HEATMAP (hand SVG, Dracula ramp) =============

// Incident-count ramp: quiet days rest on the Dracula surface, busier cells
// climb green → orange → red.
function heatFill(count: number): string {
  if (count >= 3) {
    return 'var(--dracula-red)';
  }
  if (count === 2) {
    return 'var(--dracula-orange)';
  }
  if (count === 1) {
    return 'var(--dracula-green)';
  }
  return 'var(--dracula-bg-light)';
}

const HEAT_LEGEND = [
  {label: '0', fill: 'var(--dracula-bg-light)'},
  {label: '1', fill: 'var(--dracula-green)'},
  {label: '2', fill: 'var(--dracula-orange)'},
  {label: '3+', fill: 'var(--dracula-red)'},
];

function OutageHeatmap() {
  const heatmapData = buildHeatmapData(incidents);
  const cellW = 56;
  const cellH = 24;
  const gap = 4;
  const labelW = 44;
  const labelH = 22;
  const W = labelW + DAYS.length * (cellW + gap);
  const H = labelH + HOURS.length * (cellH + gap);
  const countFor = (day: string, hour: string) =>
    heatmapData.find(d => d.day === day && d.hour === hour)?.incidents ?? 0;
  return (
    <VStack gap={3}>
      <Card
        padding={3}
        style={{
          backgroundColor: 'var(--color-background)',
          border: 'var(--border-width) solid var(--color-separator)',
        }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Incidents by day and hour, January 12 to 18">
          {DAYS.map((day, di) => (
            <text
              key={day}
              x={labelW + di * (cellW + gap) + cellW / 2}
              y={14}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-text-paragraph)"
              fontFamily="var(--font-family-mono)">
              {day}
            </text>
          ))}
          {HOURS.map((hour, hi) => (
            <g key={hour}>
              <text
                x={labelW - 6}
                y={labelH + hi * (cellH + gap) + cellH / 2 + 3}
                textAnchor="end"
                fontSize={9}
                fill="var(--color-text-paragraph)"
                fontFamily="var(--font-family-mono)">
                {hour}
              </text>
              {DAYS.map((day, di) => {
                const count = countFor(day, hour);
                return (
                  <g key={day}>
                    <rect
                      x={labelW + di * (cellW + gap)}
                      y={labelH + hi * (cellH + gap)}
                      width={cellW}
                      height={cellH}
                      rx={4}
                      fill={heatFill(count)}
                    />
                    {count > 0 && (
                      <text
                        x={labelW + di * (cellW + gap) + cellW / 2}
                        y={labelH + hi * (cellH + gap) + cellH / 2 + 3}
                        textAnchor="middle"
                        fontSize={9}
                        fill="#21222C"
                        fontFamily="var(--font-family-mono)">
                        {count}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </Card>
      <Text type="supporting" color="secondary">
        Incidents by day and hour · Jan 12–18
      </Text>
      <HStack gap={4} vAlign="center">
        {HEAT_LEGEND.map(entry => (
          <HStack key={entry.label} gap={2} vAlign="center">
            <svg
              width={12}
              height={12}
              role="img"
              aria-label={`${entry.label} incidents`}>
              <rect width={12} height={12} rx={4} fill={entry.fill} />
            </svg>
            <Text type="supporting" color="secondary" hasTabularNumbers>
              {entry.label}
            </Text>
          </HStack>
        ))}
      </HStack>
    </VStack>
  );
}

// ============= PAGE =============

export default function HeatmapTable() {
  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              <Heading level={1}>Status</Heading>
            </StackItem>
            <IconButton
              label="Filter"
              icon={<Icon icon={Filter} size="sm" />}
              variant="ghost"
            />
            <IconButton
              label="Export"
              icon={<Icon icon={Download} size="sm" />}
              variant="ghost"
            />
            <Button label="Refresh" icon={<Icon icon={RotateCw} size="sm" />} />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={4}>
            <OutageHeatmap />

            <Table<IncidentRow>
              data={incidents}
              columns={columns}
              idKey="id"
              density="balanced"
              dividers="rows"
              hasHover
            />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
