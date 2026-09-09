// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > V[g=6] > (H[j=between a=center] > Hd"The night vault"[level=1] + DM"1 year") + (G[c=4 g=4] > (C > V[g=2] > Hd"Label"[level=4] + (H[g=2] > Hd"$1.2M"[level=2] + Tx"+2.4%"[t=body]))*4) + (G[c=4 g=4] > (GS[c=3] > C > V[g=4] > (H[j=between] > Hd"Vault value"[level=3] + Lk"View details") + AR) + (GS[c=1] > C > V[g=4] > (H[j=between] > Hd"Top holdings"[level=3] + Lk"View all") + UL)) + D + (H[j=between a=start] > (V[g=1] > Hd"Market at midnight"[level=2] + Tx"Past 24 hours under moonlight"[t=body]) + B"View more") + (G[c=3 g=4] > (C > V[g=3] > Hd"Index"[level=4] + Tx"$5,200"[t=body])*3) + (C > V[g=4] > Hd"Trending Stocks"[level=3] + T)

import {useState} from 'react';

import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Grid, GridSpan} from '@astryxdesign/core/Grid';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {Avatar} from '@astryxdesign/core/Avatar';
import {List, ListItem} from '@astryxdesign/core/List';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Table, proportional} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Divider} from '@astryxdesign/core/Divider';
import {ArrowUp, ArrowDown} from 'lucide-react';

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
// Deterministic LCG so the sparklines are stable across renders.
function genSpark(
  seed: number,
  start: number,
  end: number,
  volatility: number,
  N: number = 96,
): number[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const points: number[] = [];
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
    points.push(trend + wave + drift + spike);
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
  spark: number[];
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

function PortfolioChart() {
  // Downsample the 407 daily points to one bar per week
  const bars = portfolioData.filter((_, i) => i % 7 === 0);
  const min = 200000;
  const max = 320000;
  const base = 168;
  const plot = 138;
  const left = 52;
  const width = 500;
  const step = width / bars.length;
  const yFor = (v: number) => base - ((v - min) / (max - min)) * plot;
  const yTicks = [200000, 240000, 280000, 320000];
  return (
    <VStack gap={3}>
      <Card
        padding={3}
        style={{
          backgroundColor: 'var(--color-background)',
          border: 'var(--border-width) solid var(--color-separator)',
        }}>
        <svg
          viewBox="0 0 560 210"
          width="100%"
          role="img"
          aria-label="Vault value by week, October to October">
          {yTicks.map(t => (
            <g key={t}>
              <line
                x1={left}
                y1={yFor(t)}
                x2={left + width}
                y2={yFor(t)}
                stroke="var(--color-separator)"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <text
                x={left - 8}
                y={yFor(t) + 4}
                textAnchor="end"
                fontSize={13}
                fill="var(--color-text-paragraph)"
                fontFamily="var(--font-family-mono)">
                ${(t / 1000).toFixed(0)}k
              </text>
            </g>
          ))}
          {bars.map((d, i) => {
            const h = Math.max(3, base - yFor(d.value));
            return (
              <rect
                key={i}
                x={left + i * step + 1}
                y={base - h}
                width={Math.max(2, step - 2)}
                height={h}
                rx={4}
                fill="var(--dracula-green)"
              />
            );
          })}
          {xAxisTicks.map(m => (
            <text
              key={m}
              x={left + (m / 12) * width}
              y={192}
              textAnchor={m === 12 ? 'end' : 'middle'}
              fontSize={13}
              fill="var(--color-text-paragraph)"
              fontFamily="var(--font-family-mono)">
              {xAxisLabels[m] ?? ''}
            </text>
          ))}
          <text
            x={left + width - 4}
            y={yFor(294200) - 8}
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

function Sparkline({data, positive}: {data: number[]; positive: boolean}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = 300 / data.length;
  return (
    <svg
      viewBox="0 0 300 40"
      width="100%"
      height={40}
      role="img"
      aria-label="Twenty-four hour trend">
      {data.map((v, i) => {
        const h = Math.max(3, ((v - min) / range) * 32);
        return (
          <rect
            key={i}
            x={i * step}
            y={36 - h}
            width={Math.max(1.5, step - 1)}
            height={h}
            rx={4}
            fill={
              positive ? 'var(--dracula-green)' : 'var(--dracula-red)'
            }
          />
        );
      })}
    </svg>
  );
}

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
  spark: number[];
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
        <Sparkline data={spark} positive={positive} />
        <HStack gap={3} vAlign="center">
          <Text type="display-3" weight="semibold" hasTabularNumbers>
            {price}
          </Text>
          <HStack gap={1} vAlign="center">
            <Icon
              icon={positive ? ArrowUp : ArrowDown}
              size="xsm"
              color={positive ? 'success' : 'error'}
            />
            <Text type="body" color="secondary" hasTabularNumbers>
              {change}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Card>
  );
}

function TrendSparkline({data, positive}: {data: number[]; positive: boolean}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = 300 / data.length;
  return (
    <svg
      viewBox="0 0 300 24"
      width="100%"
      height={24}
      role="img"
      aria-label="Daily trend">
      {data.map((v, i) => {
        const h = Math.max(2, ((v - min) / range) * 18);
        return (
          <rect
            key={i}
            x={i * step}
            y={21 - h}
            width={Math.max(1.5, step - 1)}
            height={h}
            rx={4}
            fill={
              positive ? 'var(--dracula-green)' : 'var(--dracula-red)'
            }
          />
        );
      })}
    </svg>
  );
}

function ColoredValue({
  value,
  isPositive,
}: {
  value: string;
  isPositive: boolean;
}) {
  return <Badge label={value} variant={isPositive ? 'green' : 'red'} />;
}

const trendingColumns: TableColumn<StockRow>[] = [
  {
    key: 'ticker',
    header: 'Ticker',
    width: proportional(1),
    renderCell: (row: StockRow) => (
      <Text type="body" weight="semibold">
        {row.ticker}
      </Text>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    width: proportional(1),
    renderCell: (row: StockRow) => (
      <Text type="body" hasTabularNumbers>
        {row.price}
      </Text>
    ),
  },
  {
    key: 'dailyPts',
    header: 'Daily Chg (pts)',
    width: proportional(1),
    renderCell: (row: StockRow) => {
      const isPos = row.dailyPts >= 0;
      const formatted = (isPos ? '+' : '') + row.dailyPts.toFixed(2);
      return <ColoredValue value={formatted} isPositive={isPos} />;
    },
  },
  {
    key: 'dailyPct',
    header: 'Daily Chg (%)',
    width: proportional(1),
    renderCell: (row: StockRow) => {
      const isPos = row.dailyPct >= 0;
      const formatted = (isPos ? '+' : '') + row.dailyPct.toFixed(2) + '%';
      return <ColoredValue value={formatted} isPositive={isPos} />;
    },
  },
  {
    key: 'weekChg',
    header: '52W Chg (%)',
    width: proportional(1),
    renderCell: (row: StockRow) => {
      const isPos = row.weekChg >= 0;
      const formatted = (isPos ? '+' : '') + row.weekChg.toFixed(1) + '%';
      return <ColoredValue value={formatted} isPositive={isPos} />;
    },
  },
  {
    key: 'spark',
    header: '24h Trend',
    width: proportional(1),
    renderCell: (row: StockRow) => (
      <TrendSparkline data={row.spark} positive={row.dailyPct >= 0} />
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
        <Heading level={4}>{label}</Heading>
        <HStack gap={2} vAlign="center">
          <Heading level={2}>{value}</Heading>
          <HStack gap={1} vAlign="center">
            <Icon
              icon={positive ? ArrowUp : ArrowDown}
              size="xsm"
              color={positive ? 'success' : 'error'}
            />
            <Text type="body" color="secondary" hasTabularNumbers>
              {change}
            </Text>
          </HStack>
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
          <Badge
            label={change}
            variant={change.startsWith('-') ? 'red' : 'green'}
          />
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
              {Array.from({length: Math.ceil(metrics.length / 2)}, (_, i) => (
                <Grid key={i} columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
                  {metrics.slice(i * 2, i * 2 + 2).map(m => (
                    <MetricCard key={m.label} {...m} />
                  ))}
                </Grid>
              ))}
            </Grid>

            {/* Chart + Top assets */}
            <Grid columns={{minWidth: 280, max: 4}} gap={4}>
              <GridSpan columns={3}>
                <Card>
                  <VStack gap={4}>
                    <HStack hAlign="between" vAlign="center">
                      <Heading level={3}>Vault value</Heading>
                      <Link href="#/templates/dashboard-portfolio">View details</Link>
                    </HStack>
                    <PortfolioChart />
                  </VStack>
                </Card>
              </GridSpan>
              <GridSpan columns={1}>
                <Card>
                  <VStack gap={4}>
                    <HStack hAlign="between" vAlign="center">
                      <Heading level={3}>Top holdings</Heading>
                      <Link href="#/templates/dashboard-portfolio">View all</Link>
                    </HStack>
                    <List density="spacious">
                      {topAssets.map(asset => (
                        <AssetRow key={asset.ticker} {...asset} />
                      ))}
                    </List>
                  </VStack>
                </Card>
              </GridSpan>
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
              <Button label="View more" variant="secondary" size="lg" />
            </HStack>

            {/* Market index cards */}
            <Grid columns={{minWidth: 320, repeat: 'fit'}} gap={4}>
              {marketIndices.map(m => (
                <MarketCard key={m.ticker} {...m} />
              ))}
            </Grid>

            {/* Trending stocks table */}
            <Card>
              <VStack gap={4}>
                <Heading level={3}>Trending Stocks</Heading>
                <Table<StockRow>
                  data={trendingStocks}
                  columns={trendingColumns}
                  idKey="id"
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
