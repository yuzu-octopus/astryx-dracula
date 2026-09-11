// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L[h=fill] > LC[p=6] > V[g=6] > (H[j=between a=center] > Hd"The night vault"[level=1] + DM"1 year") + (G[c={min:280} g=4] > (C > V[g=2] > Tx"Total value"[t=supporting] + (H[g=2] > Tx"$294,200"[t=display-3] + Tx"+14.8%"[t=body]))*4) + (G[c={min:280} g=4] > (C > V[g=4] > (H[j=between] > Hd"Vault value"[level=2] + Lk"View details") + (C > V[g=3] > Tx"Weekly closes"[t=supporting])) + (V[g=4] > (H[j=between] > Hd"Top holdings"[level=2] + Lk"View all") + UL)) + D + (H[j=between a=start] > (V[g=1] > Hd"Market at midnight"[level=2] + Tx"Past 24 hours under moonlight"[t=body]) + B"View more") + (G[c={min:280} g=4] > (C > V[g=3] > Hd"Index"[level=3] + Tx"$5,200"[t=body])*8) + (C > V[g=4] > Hd"Trending stocks"[level=3] + T)

/**
 * Portfolio Dashboard — the night vault: KPI tiles, a weekly value chart, the
 * holdings list, and the market board.
 *
 * Frame: single content column (page header, tile rows, market section).
 *
 * Container policy: tiles are Cards (KPI, market index); the holdings list is
 * dense rows (List/ListItem) and the trending table is edge-to-edge, neither
 * card-wrapped. Sparklines are one shared component at two sizes, and signed
 * figures pair an arrow with the sign so tone never carries the direction.
 *
 * Responsive contract:
 *   no media queries — every row is an auto-fit Grid or a full-width Table.
 *   Tiles collapse from 4 columns to 1 as the content column narrows (280px
 *   track floor), and below the table's ~570px floor the trending table
 *   scrolls horizontally inside its own wrapper while cells truncate.
 */

import {useState} from 'react';

import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Link} from '@astryxdesign/core/Link';
import {Avatar} from '@astryxdesign/core/Avatar';
import {List, ListItem} from '@astryxdesign/core/List';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Button} from '@astryxdesign/core/Button';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Divider} from '@astryxdesign/core/Divider';
import {MetricDelta} from 'astryx-dracula/shared/metric-delta';
import {Sparkline, type SparkPoint} from 'astryx-dracula/shared/sparkline';
import {CHART_PANEL_STYLE} from 'astryx-dracula/shared/revenue-chart';

// ============= DATA =============

// Portfolio value over ~12 months (Oct 2024 → Oct 2025), one data point per day.
// Realistic fluctuations: dips in Feb–Mar, recovery in summer, climb into fall.
const portfolioData = (() => {
  const anchors: Array<[number, number]> = [
    [0, 230000],
    [14, 238000],
    [28, 245000],
    [42, 250000],
    [56, 245000],
    [70, 258000],
    [84, 252000],
    [98, 260000],
    [112, 255000],
    [126, 245000],
    [140, 222000],
    [154, 218000],
    [168, 225000],
    [182, 232000],
    [196, 225000],
    [210, 235000],
    [224, 240000],
    [238, 245000],
    [252, 235000],
    [266, 248000],
    [280, 255000],
    [294, 260000],
    [308, 268000],
    [322, 275000],
    [336, 278000],
    [350, 285000],
    [364, 288000],
    [378, 290000],
    [392, 292000],
    [406, 294200],
  ];
  const totalDays = anchors[anchors.length - 1][0];
  const monthPerDay = 12 / totalDays;
  const out: Array<{month: number; label: string; value: number}> = [];
  let ai = 0;
  for (let day = 0; day <= totalDays; day++) {
    while (ai < anchors.length - 2 && day >= anchors[ai + 1][0]) {
      ai++;
    }
    const [d0, v0] = anchors[ai];
    const [d1, v1] = anchors[ai + 1];
    const t = (day - d0) / (d1 - d0);
    const base = v0 + (v1 - v0) * t;
    const seed = Math.sin(day * 12.9898 + 78.233) * 43758.5453;
    const noise = (seed - Math.floor(seed) - 0.5) * 3600;
    out.push({
      month: day * monthPerDay,
      label: `Day ${day + 1}`,
      value: Math.round(base + noise),
    });
  }
  return out;
})();

const xAxisTicks = [0, 3, 6, 9, 12];
const xAxisLabels: Record<number, string> = {
  0: 'Oct',
  3: 'Jan',
  6: 'Apr',
  9: 'Jul',
  12: 'Oct',
};

// KPI summary metrics
const metrics = [
  {
    value: '$294,200',
    change: '+14.8%',
    label: 'Total value',
    caption: 'Weekly closes · trailing 12 months',
  },
  {
    value: '14.8%',
    change: '+2.1%',
    label: 'Annual return',
    caption: 'Trailing 12 months under moonlight',
  },
  {
    value: '2.8%',
    change: '$2,060/qtr',
    label: 'Dividend yield',
    caption: 'Paid quarterly under moonlight',
  },
  {
    value: '23',
    change: '+4 YTD',
    label: 'Total asset holdings',
    caption: 'Across the night vault',
  },
];

// Top holdings
const topAssets = [
  {ticker: 'AAPL', name: 'Apple Inc.', value: '$87,200', change: '+18.4%'},
  {ticker: 'MSFT', name: 'Microsoft Corp.', value: '$72,500', change: '+14.7%'},
  {ticker: 'NVDA', name: 'NVIDIA Corp.', value: '$63,800', change: '+31.2%'},
  {
    ticker: 'VTI',
    name: 'Vanguard Total Stock',
    value: '$58,400',
    change: '+11.3%',
  },
  {
    ticker: 'BND',
    name: 'Vanguard Total Bond',
    value: '$45,600',
    change: '+4.2%',
  },
];

// 96 points per series = one tick every 15 minutes across a 24h window.
// Deterministic LCG so the sparklines are stable across renders. Each point
// carries the slot it was generated for, so the bars key off data rather than
// off the array position.
function genSpark(
  seed: number,
  start: number,
  end: number,
  volatility: number,
  N: number = 96,
): SparkPoint[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const points: SparkPoint[] = [];
  let drift = 0;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const trend = start + (end - start) * t;
    // Multiple overlaid waves at different frequencies for session-like rhythm
    // plus high-frequency chop.
    const wave =
      Math.sin(t * Math.PI * 2.3 + seed * 0.13) * volatility * 1.4 +
      Math.sin(t * Math.PI * 5.7 + seed * 0.41) * volatility * 0.9 +
      Math.sin(t * Math.PI * 13.1 + seed * 0.07) * volatility * 0.5;
    // Loosely-correlated random walk so adjacent ticks jitter rather than glide.
    drift = drift * 0.55 + (rand() - 0.5) * volatility * 2.2;
    // Occasional sharper spike to mimic news-driven moves.
    const spike = rand() < 0.04 ? (rand() - 0.5) * volatility * 4 : 0;
    points.push({id: `${seed}-${i}`, value: trend + wave + drift + spike});
  }
  return points;
}

// Market index cards — 24h sparkline data (every 15min, 96 points)
const marketIndices = [
  {
    name: 'Dow Jones',
    ticker: 'DJI',
    price: '43,821.67',
    change: '+0.42%',
    positive: true,
    spark: genSpark(1337, 78, 84, 3.2),
  },
  {
    name: 'NASDAQ',
    ticker: 'IXIC',
    price: '18,942.18',
    change: '-0.50%',
    positive: false,
    spark: genSpark(2042, 86, 78, 3.8),
  },
  {
    name: 'S&P 500',
    ticker: 'SPX',
    price: '5,918.33',
    change: '+0.21%',
    positive: true,
    spark: genSpark(3155, 71, 75, 2.8),
  },
  {
    name: 'NYSE Composite',
    ticker: 'NYA',
    price: '19,752.41',
    change: '-0.20%',
    positive: false,
    spark: genSpark(4287, 70, 65, 3.0),
  },
  {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    price: '$177.39',
    change: '+0.93%',
    positive: true,
    spark: genSpark(5519, 60, 67, 3.6),
  },
  {
    name: 'Intel Corp.',
    ticker: 'INTC',
    price: '$50.38',
    change: '+4.89%',
    positive: true,
    spark: genSpark(6701, 40, 51, 2.6),
  },
  {
    name: 'Nokia Corp.',
    ticker: 'NOK',
    price: '$8.82',
    change: '+6.65%',
    positive: true,
    spark: genSpark(7823, 30, 41, 2.4),
  },
  {
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    price: '$360.59',
    change: '-5.42%',
    positive: false,
    spark: genSpark(8945, 90, 76, 4.2),
  },
];

// Trending stocks table data
interface StockRow extends Record<string, unknown> {
  id: string;
  ticker: string;
  price: string;
  dailyPts: number;
  dailyPct: number;
  weekChg: number;
  spark: SparkPoint[];
}

const trendingStocks: StockRow[] = [
  {
    id: '1',
    ticker: 'AAPL',
    price: '$188.72',
    dailyPts: 1.35,
    dailyPct: 0.72,
    weekChg: 22.4,
    spark: genSpark(11023, 60, 70, 2.6, 48),
  },
  {
    id: '2',
    ticker: 'MSFT',
    price: '$415.6',
    dailyPts: 3.2,
    dailyPct: 0.78,
    weekChg: 18.6,
    spark: genSpark(12591, 55, 65, 2.4, 48),
  },
  {
    id: '3',
    ticker: 'NVDA',
    price: '$177.39',
    dailyPts: 1.65,
    dailyPct: 0.93,
    weekChg: 45.2,
    spark: genSpark(13744, 40, 68, 3.8, 48),
  },
  {
    id: '4',
    ticker: 'AMZN',
    price: '$186.5',
    dailyPts: -0.8,
    dailyPct: -0.43,
    weekChg: 15.3,
    spark: genSpark(14882, 70, 63, 2.5, 48),
  },
  {
    id: '5',
    ticker: 'GOOGL',
    price: '$155.72',
    dailyPts: 2.1,
    dailyPct: 1.37,
    weekChg: 12.8,
    spark: genSpark(15967, 50, 60, 2.7, 48),
  },
  {
    id: '6',
    ticker: 'META',
    price: '$505.3',
    dailyPts: 4.5,
    dailyPct: 0.9,
    weekChg: 35.1,
    spark: genSpark(17105, 45, 61, 3.0, 48),
  },
  {
    id: '7',
    ticker: 'TSLA',
    price: '$360.59',
    dailyPts: -20.67,
    dailyPct: -5.42,
    weekChg: -8.3,
    spark: genSpark(18249, 90, 64, 4.4, 48),
  },
  {
    id: '8',
    ticker: 'INTC',
    price: '$50.38',
    dailyPts: 2.35,
    dailyPct: 4.89,
    weekChg: -12.5,
    spark: genSpark(19388, 65, 57, 2.8, 48),
  },
  {
    id: '9',
    ticker: 'AMD',
    price: '$162.45',
    dailyPts: -1.2,
    dailyPct: -0.73,
    weekChg: 28.7,
    spark: genSpark(20471, 50, 63, 2.9, 48),
  },
  {
    id: '10',
    ticker: 'NFLX',
    price: '$628.9',
    dailyPts: 5.4,
    dailyPct: 0.87,
    weekChg: 42.1,
    spark: genSpark(21556, 42, 58, 2.6, 48),
  },
];

// ============= CHART COMPONENTS =============

// Downsample the 407 daily points to one bar per week
const portfolioBars = portfolioData.filter((_, i) => i % 7 === 0);
const PORTFOLIO_MIN = 200000;
const PORTFOLIO_MAX = 320000;
const PORTFOLIO_BASE = 168;
const PORTFOLIO_PLOT = 138;
const PORTFOLIO_LEFT = 52;
const PORTFOLIO_WIDTH = 500;
const PORTFOLIO_STEP = PORTFOLIO_WIDTH / portfolioBars.length;
const portfolioYFor = (v: number) =>
  PORTFOLIO_BASE - ((v - PORTFOLIO_MIN) / (PORTFOLIO_MAX - PORTFOLIO_MIN)) * PORTFOLIO_PLOT;
const PORTFOLIO_Y_TICKS = [200000, 240000, 280000, 320000];

function PortfolioChart() {
  return (
    <VStack gap={3}>
      <Card padding={3} style={CHART_PANEL_STYLE}>
        <svg
          viewBox="0 0 560 210"
          width="100%"
          role="img"
          aria-label="Vault value by week, October to October">
          {PORTFOLIO_Y_TICKS.map(t => (
            <g key={t}>
              <line
                x1={PORTFOLIO_LEFT}
                y1={portfolioYFor(t)}
                x2={PORTFOLIO_LEFT + PORTFOLIO_WIDTH}
                y2={portfolioYFor(t)}
                stroke="var(--color-separator)"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <text
                x={PORTFOLIO_LEFT - 8}
                y={portfolioYFor(t) + 4}
                textAnchor="end"
                fontSize={13}
                fill="var(--color-text-paragraph)"
                fontFamily="var(--font-family-mono)">
                ${(t / 1000).toFixed(0)}k
              </text>
            </g>
          ))}
          {portfolioBars.map((d, i) => {
            const h = Math.max(3, PORTFOLIO_BASE - portfolioYFor(d.value));
            return (
              <rect
                key={d.label}
                x={PORTFOLIO_LEFT + i * PORTFOLIO_STEP + 1}
                y={PORTFOLIO_BASE - h}
                width={Math.max(2, PORTFOLIO_STEP - 2)}
                height={h}
                rx={4}
                fill="var(--dracula-green)"
              />
            );
          })}
          {xAxisTicks.map(m => (
            <text
              key={m}
              x={PORTFOLIO_LEFT + (m / 12) * PORTFOLIO_WIDTH}
              y={192}
              textAnchor={m === 12 ? 'end' : 'middle'}
              fontSize={13}
              fill="var(--color-text-paragraph)"
              fontFamily="var(--font-family-mono)">
              {xAxisLabels[m] ?? ''}
            </text>
          ))}
          <text
            x={PORTFOLIO_LEFT + PORTFOLIO_WIDTH - 4}
            y={portfolioYFor(294200) - 8}
            textAnchor="end"
            fontSize={13}
            fill="var(--color-text-highlight)"
            fontFamily="var(--font-family-mono)">
            $294k
          </text>
        </svg>
      </Card>
      <Text type="supporting" color="secondary">
        Weekly closes · trailing 12 months
      </Text>
    </VStack>
  );
}

// ============= CARD COMPONENTS =============

function MarketCard({
  name,
  ticker,
  price,
  change,
  positive,
  spark,
}: {
  name: string;
  ticker: string;
  price: string;
  change: string;
  positive: boolean;
  spark: SparkPoint[];
}) {
  return (
    <Card>
      <VStack gap={4}>
        <VStack gap={0}>
          <Heading level={3}>{name}</Heading>
          <Text type="supporting" color="secondary">
            {ticker}
          </Text>
        </VStack>
        <Sparkline
          data={spark}
          label={`${name} 24-hour trend`}
          positive={positive}
          mode="range"
        />
        <HStack gap={3} vAlign="center">
          <Text type="display-3" weight="semibold" hasTabularNumbers>
            {price}
          </Text>
          <MetricDelta value={change} positive={positive} />
        </HStack>
      </VStack>
    </Card>
  );
}

// Signed figures render with an explicit sign, so the value reads as a move
// even before the tone does.
const formatSigned = (value: number, digits: number, suffix = '') =>
  `${value >= 0 ? '+' : ''}${value.toFixed(digits)}${suffix}`;

const trendingColumns: TableColumn<StockRow>[] = [
  {
    key: 'ticker',
    header: 'Ticker',
    width: pixel(88),
    renderCell: (row: StockRow) => (
      <Text type="body" weight="semibold" maxLines={1}>
        {row.ticker}
      </Text>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    width: pixel(88),
    renderCell: (row: StockRow) => (
      <Text type="body" hasTabularNumbers maxLines={1}>
        {row.price}
      </Text>
    ),
  },
  {
    key: 'dailyPts',
    header: 'Chg (pts)',
    width: pixel(104),
    renderCell: (row: StockRow) => (
      <MetricDelta
        value={formatSigned(row.dailyPts, 2)}
        positive={row.dailyPts >= 0}
      />
    ),
  },
  {
    key: 'dailyPct',
    header: 'Chg (%)',
    width: pixel(96),
    renderCell: (row: StockRow) => (
      <MetricDelta
        value={formatSigned(row.dailyPct, 2, '%')}
        positive={row.dailyPct >= 0}
      />
    ),
  },
  {
    key: 'weekChg',
    header: '52W (%)',
    width: pixel(96),
    renderCell: (row: StockRow) => (
      <MetricDelta
        value={formatSigned(row.weekChg, 1, '%')}
        positive={row.weekChg >= 0}
      />
    ),
  },
  {
    key: 'spark',
    header: '24h Trend',
    width: proportional(1, {minWidth: 96}),
    renderCell: (row: StockRow) => (
      <Sparkline
        data={row.spark}
        label={`${row.ticker} 24-hour trend`}
        positive={row.dailyPct >= 0}
        mode="range"
        isCompact
      />
    ),
  },
];

function MetricCard({
  value,
  change,
  label,
  caption,
}: {
  value: string;
  change: string;
  label: string;
  caption: string;
}) {
  const positive = !change.startsWith('-');
  return (
    <Card>
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
        <HStack gap={2} vAlign="center">
          <Text type="display-3" weight="semibold" hasTabularNumbers>
            {value}
          </Text>
          <MetricDelta value={change} positive={positive} />
        </HStack>
        <Text type="supporting" color="secondary">
          {caption}
        </Text>
      </VStack>
    </Card>
  );
}

function AssetRow({
  ticker,
  name,
  value,
  change,
}: {
  ticker: string;
  name: string;
  value: string;
  change: string;
}) {
  return (
    <ListItem
      label={<Text weight="semibold">{ticker}</Text>}
      description={name}
      href="#/templates/dashboard-portfolio"
      startContent={<Avatar name={ticker} size="md" />}
      endContent={
        <VStack gap={0} hAlign="end">
          <Text type="body" hasTabularNumbers>
            {value}
          </Text>
          <MetricDelta value={change} positive={!change.startsWith('-')} />
        </VStack>
      }
    />
  );
}

// ============= SIDENAV =============

// ============= MAIN COMPONENT =============

export default function DashboardPortfolio() {
  const [timeRange, setTimeRange] = useState('1 year');

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={6}>
          <VStack gap={6}>
            {/* Page header */}
            <HStack hAlign="between" vAlign="center">
              <Heading level={1}>The night vault</Heading>
              <DropdownMenu
                button={{
                  label: timeRange,
                  variant: 'secondary',
                  size: 'lg',
                }}
                hasChevron
                items={[
                  {label: '1 month', onClick: () => setTimeRange('1 month')},
                  {label: '3 months', onClick: () => setTimeRange('3 months')},
                  {label: '6 months', onClick: () => setTimeRange('6 months')},
                  {label: '1 year', onClick: () => setTimeRange('1 year')},
                  {label: '5 years', onClick: () => setTimeRange('5 years')},
                  {label: 'All time', onClick: () => setTimeRange('All time')},
                ]}
              />
            </HStack>

            {/* KPI metric cards */}
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              {metrics.map(m => (
                <MetricCard key={m.label} {...m} />
              ))}
            </Grid>

            {/* Chart + Top holdings */}
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              <Card>
                <VStack gap={4}>
                  <HStack hAlign="between" vAlign="center">
                    <Heading level={2}>Vault value</Heading>
                    <Link href="#/templates/dashboard-portfolio">
                      View details
                    </Link>
                  </HStack>
                  <PortfolioChart />
                </VStack>
              </Card>
              <VStack gap={4}>
                <HStack hAlign="between" vAlign="center">
                  <Heading level={2}>Top holdings</Heading>
                  <Link href="#/templates/dashboard-portfolio">View all</Link>
                </HStack>
                <List density="spacious">
                  {topAssets.map(asset => (
                    <AssetRow key={asset.ticker} {...asset} />
                  ))}
                </List>
              </VStack>
            </Grid>

            <Divider />

            {/* Market section */}
            <HStack hAlign="between" vAlign="start">
              <VStack gap={1}>
                <Heading level={2}>Market at midnight</Heading>
                <Text type="body" color="secondary">
                  Past 24 hours under moonlight
                </Text>
              </VStack>
              <Button label="View more" variant="secondary" size="md" />
            </HStack>

            {/* Market index cards */}
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              {marketIndices.map(m => (
                <MarketCard key={m.ticker} {...m} />
              ))}
            </Grid>

            {/* Trending stocks table */}
            <Card>
              <VStack gap={4}>
                <Heading level={3}>Trending stocks</Heading>
                <Table<StockRow>
                  data={trendingStocks}
                  columns={trendingColumns}
                  idKey="id"
                  textOverflow="truncate"
                  hasHover
                  dividers="rows"
                />
              </VStack>
            </Card>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
