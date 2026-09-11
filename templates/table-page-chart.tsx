// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > H[a=center g=2] > (SI[size=fill] > Hd"Matcha Bar"[level=1]) + IB"Filter"[variant=ghost] + IB"Export"[variant=ghost] + B.primary"New order") + (LC[p=3] > V[g=4] > C[p=3] + (T[hover] > (TR > THC"Order" + THC"Product" + THC"Amount" + THC"Customer" + THC"Email" + THC"Status" + THC"Date") + (TR > TC"ORD-1001" + TC"Ceremonial Matcha Latte" + TC"$6" + TC"Sarah Chen" + TC"sarah.chen@acme.co" + (TC > Tk.green"Completed") + TC"2025-01-15")*6))

/**
 * Matcha Bar — order desk: a daily revenue line over the full order log.
 *
 * Frame: page header (title + icon actions) | content column (chart, table).
 *
 * Container policy: the chart is a single Card widget; the orders are dense
 * rows in one edge-to-edge table (never card-wrapped). Status is a Token, and
 * the numeric columns carry tabular figures. Shared swatch/chart helpers are
 * kept byte-aligned with table-page-shoe-store-heatmap.
 *
 * Responsive contract:
 *   no media queries — the chart is an SVG that scales to its column, so it
 *   reflows at any width. The table declares a ~820px floor across its seven
 *   columns and truncates each text cell (maxLines=1), so narrower viewports
 *   scroll the table horizontally instead of widening the page.
 */

import type {CSSProperties} from 'react';
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
import {Token} from '@astryxdesign/core/Token';
import {Card} from '@astryxdesign/core/Card';
import {Link} from '@astryxdesign/core/Link';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Filter, Download, Plus, Square} from 'lucide-react';

// ============= ICONS (verified lucide-react exports) =============
// Filter ← FunnelIcon, Download ← ArrowDownTrayIcon, Plus ← PlusIcon.
// Square marks the chart legend swatch.

const swatchStyle: CSSProperties = {flexShrink: 0};

// Rounded product swatch: Dracula surface with a per-product accent glyph.
function ProductSwatch({accent, label}: {accent: string; label: string}) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={36}
      height={36}
      style={swatchStyle}
      role="img"
      aria-label={`${label} swatch`}>
      <rect width={36} height={36} rx={5} fill="var(--dracula-bg-light)" />
      <rect
        x={1}
        y={1}
        width={34}
        height={34}
        rx={4}
        fill="none"
        stroke="var(--color-widget-content-border)"
      />
      <circle cx={18} cy={18} r={7} fill="none" stroke={accent} strokeWidth={3} />
    </svg>
  );
}

// ============= DATA =============

type ProductCategory = 'Matcha' | 'Coffee' | 'Tea' | 'Smoothie' | 'Specialty';

interface OrderRow extends Record<string, unknown> {
  id: string;
  customer: string;
  email: string;
  product: string;
  category: ProductCategory;
  imageIndex: number;
  amount: number;
  status: 'completed' | 'processing' | 'shipped' | 'refunded';
  date: string;
}

const PRODUCTS = [
  {
    name: 'Ceremonial Matcha Latte',
    category: 'Matcha' as ProductCategory,
    accent: 'var(--dracula-green)',
    price: 6,
  },
  {
    name: 'Oat Milk Cappuccino',
    category: 'Coffee' as ProductCategory,
    accent: 'var(--dracula-orange)',
    price: 5,
  },
  {
    name: 'Jasmine Green Tea',
    category: 'Tea' as ProductCategory,
    accent: 'var(--dracula-cyan)',
    price: 4,
  },
  {
    name: 'Mango Matcha Smoothie',
    category: 'Smoothie' as ProductCategory,
    accent: 'var(--dracula-pink)',
    price: 8,
  },
  {
    name: 'Hojicha Latte',
    category: 'Specialty' as ProductCategory,
    accent: 'var(--dracula-purple)',
    price: 7,
  },
  {
    name: 'Iced Yuzu Matcha',
    category: 'Matcha' as ProductCategory,
    accent: 'var(--dracula-yellow)',
    price: 7,
  },
];

const orders: OrderRow[] = [
  {
    id: 'ORD-1001',
    customer: 'Sarah Chen',
    email: 'sarah.chen@acme.co',
    product: PRODUCTS[0].name,
    category: PRODUCTS[0].category,
    imageIndex: 0,
    amount: 6,
    status: 'completed',
    date: '2025-01-15',
  },
  {
    id: 'ORD-1002',
    customer: 'Marcus Rivera',
    email: 'mrivera@globex.com',
    product: PRODUCTS[1].name,
    category: PRODUCTS[1].category,
    imageIndex: 1,
    amount: 5,
    status: 'completed',
    date: '2025-01-15',
  },
  {
    id: 'ORD-1003',
    customer: 'Aisha Patel',
    email: 'aisha.p@initech.io',
    product: PRODUCTS[2].name,
    category: PRODUCTS[2].category,
    imageIndex: 2,
    amount: 4,
    status: 'shipped',
    date: '2025-01-14',
  },
  {
    id: 'ORD-1004',
    customer: "James O'Brien",
    email: 'jobrien@umbrella.net',
    product: PRODUCTS[3].name,
    category: PRODUCTS[3].category,
    imageIndex: 3,
    amount: 8,
    status: 'processing',
    date: '2025-01-14',
  },
  {
    id: 'ORD-1005',
    customer: 'Yuki Tanaka',
    email: 'yuki@soylent.jp',
    product: PRODUCTS[4].name,
    category: PRODUCTS[4].category,
    imageIndex: 4,
    amount: 7,
    status: 'completed',
    date: '2025-01-13',
  },
  {
    id: 'ORD-1006',
    customer: 'Elena Volkov',
    email: 'elena.v@wayne.com',
    product: PRODUCTS[5].name,
    category: PRODUCTS[5].category,
    imageIndex: 5,
    amount: 7,
    status: 'refunded',
    date: '2025-01-13',
  },
  {
    id: 'ORD-1007',
    customer: 'David Kim',
    email: 'dkim@stark.io',
    product: PRODUCTS[0].name,
    category: PRODUCTS[0].category,
    imageIndex: 0,
    amount: 6,
    status: 'completed',
    date: '2025-01-12',
  },
  {
    id: 'ORD-1008',
    customer: 'Fatima Al-Rashid',
    email: 'fatima@oscorp.ae',
    product: PRODUCTS[1].name,
    category: PRODUCTS[1].category,
    imageIndex: 1,
    amount: 5,
    status: 'shipped',
    date: '2025-01-12',
  },
  {
    id: 'ORD-1009',
    customer: 'Lucas Andersson',
    email: 'lucas.a@cyberdyne.se',
    product: PRODUCTS[2].name,
    category: PRODUCTS[2].category,
    imageIndex: 2,
    amount: 4,
    status: 'completed',
    date: '2025-01-11',
  },
  {
    id: 'ORD-1010',
    customer: 'Priya Sharma',
    email: 'priya@aperture.in',
    product: PRODUCTS[3].name,
    category: PRODUCTS[3].category,
    imageIndex: 3,
    amount: 8,
    status: 'processing',
    date: '2025-01-11',
  },
  {
    id: 'ORD-1011',
    customer: 'Noah Williams',
    email: 'noah.w@massive.com',
    product: PRODUCTS[4].name,
    category: PRODUCTS[4].category,
    imageIndex: 4,
    amount: 7,
    status: 'completed',
    date: '2025-01-10',
  },
  {
    id: 'ORD-1012',
    customer: 'Sofia Garcia',
    email: 'sgarcia@tyrell.mx',
    product: PRODUCTS[5].name,
    category: PRODUCTS[5].category,
    imageIndex: 5,
    amount: 7,
    status: 'completed',
    date: '2025-01-10',
  },
  {
    id: 'ORD-1013',
    customer: 'Oliver Brown',
    email: 'oliver.b@weyland.uk',
    product: PRODUCTS[0].name,
    category: PRODUCTS[0].category,
    imageIndex: 0,
    amount: 6,
    status: 'shipped',
    date: '2025-01-09',
  },
  {
    id: 'ORD-1014',
    customer: 'Mei Lin',
    email: 'mei.lin@choam.cn',
    product: PRODUCTS[1].name,
    category: PRODUCTS[1].category,
    imageIndex: 1,
    amount: 5,
    status: 'completed',
    date: '2025-01-09',
  },
  {
    id: 'ORD-1015',
    customer: 'Hassan Ahmed',
    email: 'hahmed@abstergo.eg',
    product: PRODUCTS[2].name,
    category: PRODUCTS[2].category,
    imageIndex: 2,
    amount: 4,
    status: 'refunded',
    date: '2025-01-08',
  },
  {
    id: 'ORD-1016',
    customer: 'Isabella Rossi',
    email: 'irossi@genom.it',
    product: PRODUCTS[3].name,
    category: PRODUCTS[3].category,
    imageIndex: 3,
    amount: 8,
    status: 'completed',
    date: '2025-01-08',
  },
  {
    id: 'ORD-1017',
    customer: 'Liam Murphy',
    email: 'liam.m@mishima.ie',
    product: PRODUCTS[4].name,
    category: PRODUCTS[4].category,
    imageIndex: 4,
    amount: 7,
    status: 'processing',
    date: '2025-01-07',
  },
  {
    id: 'ORD-1018',
    customer: 'Chloe Dubois',
    email: 'cdubois@armacham.fr',
    product: PRODUCTS[5].name,
    category: PRODUCTS[5].category,
    imageIndex: 5,
    amount: 7,
    status: 'completed',
    date: '2025-01-07',
  },
  {
    id: 'ORD-1019',
    customer: 'Andre Santos',
    email: 'asantos@shinra.br',
    product: PRODUCTS[0].name,
    category: PRODUCTS[0].category,
    imageIndex: 0,
    amount: 6,
    status: 'shipped',
    date: '2025-01-06',
  },
  {
    id: 'ORD-1020',
    customer: 'Nina Johansson',
    email: 'nina.j@lexcorp.se',
    product: PRODUCTS[1].name,
    category: PRODUCTS[1].category,
    imageIndex: 1,
    amount: 5,
    status: 'completed',
    date: '2025-01-06',
  },
  {
    id: 'ORD-1021',
    customer: 'Raj Kapoor',
    email: 'raj.k@vaultec.in',
    product: PRODUCTS[2].name,
    category: PRODUCTS[2].category,
    imageIndex: 2,
    amount: 4,
    status: 'completed',
    date: '2025-01-05',
  },
  {
    id: 'ORD-1022',
    customer: 'Emma Thompson',
    email: 'ethompson@monarch.uk',
    product: PRODUCTS[3].name,
    category: PRODUCTS[3].category,
    imageIndex: 3,
    amount: 8,
    status: 'completed',
    date: '2025-01-05',
  },
  {
    id: 'ORD-1023',
    customer: 'Carlos Mendez',
    email: 'cmendez@sirius.ar',
    product: PRODUCTS[4].name,
    category: PRODUCTS[4].category,
    imageIndex: 4,
    amount: 7,
    status: 'shipped',
    date: '2025-01-04',
  },
  {
    id: 'ORD-1024',
    customer: 'Zoe Mitchell',
    email: 'zoe.m@hyperion.au',
    product: PRODUCTS[5].name,
    category: PRODUCTS[5].category,
    imageIndex: 5,
    amount: 7,
    status: 'processing',
    date: '2025-01-04',
  },
  {
    id: 'ORD-1025',
    customer: 'Henrik Larsson',
    email: 'hlarsson@volvo.se',
    product: PRODUCTS[0].name,
    category: PRODUCTS[0].category,
    imageIndex: 0,
    amount: 6,
    status: 'completed',
    date: '2025-01-03',
  },
  {
    id: 'ORD-1026',
    customer: 'Amara Okafor',
    email: 'aokafor@wakanda.ng',
    product: PRODUCTS[1].name,
    category: PRODUCTS[1].category,
    imageIndex: 1,
    amount: 5,
    status: 'completed',
    date: '2025-01-03',
  },
  {
    id: 'ORD-1027',
    customer: 'Leo Fischer',
    email: 'lfischer@kruger.de',
    product: PRODUCTS[2].name,
    category: PRODUCTS[2].category,
    imageIndex: 2,
    amount: 4,
    status: 'completed',
    date: '2025-01-02',
  },
  {
    id: 'ORD-1028',
    customer: 'Maya Petrov',
    email: 'mpetrov@kaiba.ru',
    product: PRODUCTS[3].name,
    category: PRODUCTS[3].category,
    imageIndex: 3,
    amount: 8,
    status: 'shipped',
    date: '2025-01-02',
  },
  {
    id: 'ORD-1029',
    customer: 'Tomás Herrera',
    email: 'therrera@nexus.co',
    product: PRODUCTS[4].name,
    category: PRODUCTS[4].category,
    imageIndex: 4,
    amount: 7,
    status: 'completed',
    date: '2025-01-01',
  },
  {
    id: 'ORD-1030',
    customer: 'Grace Nakamura',
    email: 'gnakamura@capsule.jp',
    product: PRODUCTS[5].name,
    category: PRODUCTS[5].category,
    imageIndex: 5,
    amount: 7,
    status: 'completed',
    date: '2025-01-01',
  },
];

const revenueData = [
  {date: 'Jan 1', revenue: 84},
  {date: 'Jan 2', revenue: 72},
  {date: 'Jan 3', revenue: 91},
  {date: 'Jan 4', revenue: 68},
  {date: 'Jan 5', revenue: 105},
  {date: 'Jan 6', revenue: 118},
  {date: 'Jan 7', revenue: 96},
  {date: 'Jan 8', revenue: 132},
  {date: 'Jan 9', revenue: 110},
  {date: 'Jan 10', revenue: 98},
  {date: 'Jan 11', revenue: 125},
  {date: 'Jan 12', revenue: 142},
  {date: 'Jan 13', revenue: 108},
  {date: 'Jan 14', revenue: 156},
  {date: 'Jan 15', revenue: 138},
];

const STATUS_TOKEN_COLOR: Record<
  OrderRow['status'],
  'green' | 'cyan' | 'orange' | 'red'
> = {
  completed: 'green',
  shipped: 'cyan',
  processing: 'orange',
  refunded: 'red',
};

const STATUS_LABEL: Record<OrderRow['status'], string> = {
  completed: 'Completed',
  shipped: 'Shipped',
  processing: 'Processing',
  refunded: 'Refunded',
};

const columns: TableColumn<OrderRow>[] = [
  {
    key: 'id',
    header: 'Order',
    width: pixel(96),
    renderCell: (item: OrderRow) => (
      <Link href="#/templates/table-page-chart" isStandalone>
        {item.id}
      </Link>
    ),
  },
  {
    key: 'product',
    header: 'Product',
    width: proportional(3, {minWidth: 160}),
    renderCell: (item: OrderRow) => (
      <HStack gap={3} vAlign="center">
        <ProductSwatch
          accent={PRODUCTS[item.imageIndex].accent}
          label={item.product}
        />
        <StackItem size="fill">
          <VStack gap={0}>
            <Text type="body" maxLines={1}>
              {item.product}
            </Text>
            <Text type="supporting" color="secondary" maxLines={1}>
              {item.category}
            </Text>
          </VStack>
        </StackItem>
      </HStack>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    width: pixel(88),
    renderCell: (item: OrderRow) => (
      <Text type="body" hasTabularNumbers maxLines={1}>
        ${item.amount}
      </Text>
    ),
  },
  {
    key: 'customer',
    header: 'Customer',
    width: proportional(2, {minWidth: 120}),
    renderCell: (item: OrderRow) => (
      <Text type="body" maxLines={1}>
        {item.customer}
      </Text>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    width: proportional(2, {minWidth: 120}),
    renderCell: (item: OrderRow) => (
      <Text type="body" maxLines={1}>
        {item.email}
      </Text>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(120),
    renderCell: (item: OrderRow) => (
      <Token
        size="sm"
        color={STATUS_TOKEN_COLOR[item.status]}
        label={STATUS_LABEL[item.status]}
      />
    ),
  },
  {
    key: 'date',
    header: 'Date',
    width: pixel(112),
    renderCell: (item: OrderRow) => (
      <Text type="body" hasTabularNumbers maxLines={1}>
        {item.date}
      </Text>
    ),
  },
];

// ============= REVENUE CHART (hand SVG, Dracula ramp) =============

const REVENUE_LINE = 'var(--dracula-cyan)';
const CHART_W = 540;
const CHART_H = 200;
const CHART_PAD_LEFT = 44;
const CHART_PAD_RIGHT = 12;
const CHART_PAD_TOP = 12;
const CHART_BASELINE = 164;
const CHART_MAX = 160;
const CHART_PLOT_W = CHART_W - CHART_PAD_LEFT - CHART_PAD_RIGHT;
const CHART_PLOT_H = CHART_BASELINE - CHART_PAD_TOP;
const revenuePoints = revenueData.map((d, i) => ({
  ...d,
  x: CHART_PAD_LEFT + (i / (revenueData.length - 1)) * CHART_PLOT_W,
  y: CHART_BASELINE - (d.revenue / CHART_MAX) * CHART_PLOT_H,
}));
const revenueLinePath = revenuePoints
  .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  .join(' ');
const revenueAreaPath = `${revenueLinePath} L${revenuePoints[revenuePoints.length - 1].x.toFixed(1)},${CHART_BASELINE} L${revenuePoints[0].x.toFixed(1)},${CHART_BASELINE} Z`;
const REVENUE_GRID_TICKS = [0, 50, 100, 150];

// Axis ticks switch to thousands once the scale leaves the hundreds.
function formatRevenueTick(tick: number): string {
  return tick >= 1000 ? `$${tick / 1000}k` : `$${tick}`;
}

function RevenueChart() {
  const W = CHART_W;
  const H = CHART_H;
  const padLeft = CHART_PAD_LEFT;
  const padRight = CHART_PAD_RIGHT;
  const baseline = CHART_BASELINE;
  const max = CHART_MAX;
  const plotH = CHART_PLOT_H;
  const points = revenuePoints;
  const linePath = revenueLinePath;
  const areaPath = revenueAreaPath;
  const gridTicks = REVENUE_GRID_TICKS;
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
          aria-label="Daily revenue, January 1 to 15">
          {gridTicks.map(tick => {
            const y = baseline - (tick / max) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={W - padRight}
                  y2={y}
                  stroke="var(--color-separator)"
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                  opacity={tick === 0 ? 1 : 0.5}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={13}
                  fill="var(--color-text-paragraph)"
                  fontFamily="var(--font-family-mono)">
                  {formatRevenueTick(tick)}
                </text>
              </g>
            );
          })}
          <path d={areaPath} fill={REVENUE_LINE} opacity={0.25} />
          <path
            d={linePath}
            fill="none"
            stroke={REVENUE_LINE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map(
            (p, i) =>
              (i % 3 === 0 || i === points.length - 1) && (
                <text
                  key={p.date}
                  x={i === points.length - 1 ? W - padRight - 2 : p.x}
                  y={H - 8}
                  textAnchor={i === points.length - 1 ? 'end' : 'middle'}
                  fontSize={13}
                  fill="var(--color-text-paragraph)"
                  fontFamily="var(--font-family-mono)">
                  {p.date}
                </text>
              ),
          )}
        </svg>
      </Card>
      <Text type="supporting" color="secondary">
        Daily revenue · Jan 1–15
      </Text>
      <HStack gap={2} vAlign="center">
        <Icon icon={Square} size="xsm" style={{color: REVENUE_LINE}} />
        <Text type="supporting" color="secondary">
          Revenue
        </Text>
      </HStack>
    </VStack>
  );
}

// ============= PAGE =============

export default function ChartTable() {
  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              <Heading level={1}>Matcha Bar</Heading>
            </StackItem>
            <IconButton
              label="Filter"
              icon={<Icon icon={Filter} size="sm" />}
              variant="ghost"
              tooltip="Filter"
            />
            <IconButton
              label="Export"
              icon={<Icon icon={Download} size="sm" />}
              variant="ghost"
              tooltip="Export"
            />
            <Button
              label="New order"
              variant="primary"
              icon={<Icon icon={Plus} size="sm" />}
            />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={4}>
            <RevenueChart />

            <Table<OrderRow>
              data={orders}
              columns={columns}
              idKey="id"
              density="balanced"
              dividers="rows"
              textOverflow="truncate"
              hasHover
            />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
