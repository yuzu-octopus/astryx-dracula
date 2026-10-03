// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L[h=fill] > LC[p=6] > V[g=6] > (H[j=between a=center] > Hd"The night vault"[level=1] + Tx"1 year"[t=body]) + (G[c={min:280} g=4] > (C > V[g=2] > Tx"Total value"[t=supporting] + (H[g=2] > Tx"$294,200"[t=display-3] + Tx"+14.8%"[t=body]))*4) + (G[c={min:280} g=4] > (C > V[g=4] > (H[j=between] > Hd"Vault value"[level=2] + Lk"View details") + (C > V[g=3] > Tx"Weekly closes"[t=supporting])) + (V[g=4] > (H[j=between] > Hd"Top holdings"[level=2] + Lk"View all") + UL)) + D + (H[j=between a=start] > (V[g=1] > Hd"Market at midnight"[level=2] + Tx"Past 24 hours under moonlight"[t=body]) + B"View more") + (G[c={min:280} g=4] > (C > V[g=3] > Hd"Index"[level=3] + Tx"$5,200"[t=body])*8) + (C > V[g=4] > Hd"Trending stocks"[level=3] + T)

/**
 * Portfolio Dashboard — the night vault: KPI tiles, a weekly value chart, the holdings list, and the market board. (Frame/responsive/container: see XLE header above.)
 */
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Link} from '@astryxdesign/core/Link';
import {Avatar} from '@astryxdesign/core/Avatar';
import {List, ListItem} from '@astryxdesign/core/List';
import {Button} from '@astryxdesign/core/Button';
import {proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn, PixelWidth} from '@astryxdesign/core/Table';
import {MetricCard, TableCard} from 'astryx-dracula/shared/metric-card';
import {Divider} from '@astryxdesign/core/Divider';
import {MetricDelta} from 'astryx-dracula/shared/metric-delta';
import {Sparkline, type SparkPoint} from 'astryx-dracula/shared/sparkline';
import {CHART_PANEL_STYLE} from 'astryx-dracula/shared/chart-panel-style';
import {ChartLabel} from 'astryx-dracula/shared/chart-labels';

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
// Static arrays: the dashboard metric tiles already establish the toSparkSeries
// precedent (static number rows + stable ids), so these print the same LCG
// output the generator produced instead of rerunning it per render. Every
// sample carries the slot it was generated for, so the bars key off data
// rather than off the array position.
function toSparkSeries(seed: number, values: number[]): SparkPoint[] {
  return values.map((value, i) => ({id: `${seed}-${i}`, value}));
}

// Market index cards — 24h sparkline data (every 15min, 96 points)
const marketIndices = [
  {
    name: 'Dow Jones',
    ticker: 'DJI',
    price: '43,821.67',
    change: '+0.42%',
    positive: true,
    // prettier-ignore
    spark: toSparkSeries(1337, [77.87, 75.96, 76.35, 77.99, 78.95, 77.57, 78.14, 75.12, 74.24, 74.03, 72.88, 71.93, 74.65, 71.43, 69.56, 74.19, 72.66, 72.02, 76.09, 74.07, 75.82, 78.14, 77.91, 80.15, 79.18, 76.96, 76.57, 81.07, 83.59, 83.21, 81.58, 83.82, 84.82, 88.56, 87.03, 89.64, 87.35, 89.63, 90.67, 87.45, 87.4, 86.09, 87.85, 82.63, 81.81, 84.78, 82.26, 83.25, 80.04, 80.63, 83.56, 84.28, 83.96, 84.49, 80.85, 79.3, 80.45, 84.58, 81.83, 83.45, 87.92, 90.46, 89.1, 88.1, 90.6, 87.26, 84.82, 84.27, 86.7, 82.89, 84.38, 89.24, 82.39, 82.18, 82.24, 81.38, 82.38, 78.55, 76.91, 75.31, 78.55, 76.46, 73.89, 76.36, 77.01, 79.15, 78.98, 79.79, 78.68, 77.35, 76.01, 84.41, 82.31, 81.97, 80.42, 80.29]),
  },
  {
    name: 'NASDAQ',
    ticker: 'IXIC',
    price: '18,942.18',
    change: '-0.50%',
    positive: false,
    // prettier-ignore
    spark: toSparkSeries(2042, [88.89, 94.82, 92.53, 93.22, 91.88, 91.07, 90.86, 89.3, 89.42, 85.69, 88.02, 82.52, 84.79, 86.08, 81.15, 78.83, 79.56, 80.01, 83.14, 84.1, 88.09, 84.29, 82.48, 84.9, 84.15, 86.04, 87.12, 86.85, 82.29, 84.8, 81.87, 79.88, 79.57, 78.77, 82.32, 83.19, 85.35, 86.71, 87.68, 80, 74.7, 73.28, 77.07, 71.96, 68.62, 70.7, 73.72, 74.67, 68.28, 71.29, 69.49, 71.73, 72.22, 73.75, 77.29, 79.86, 76.32, 78.94, 78.77, 77.52, 78.62, 80.01, 85.09, 86.36, 83.71, 88.49, 89.99, 86.02, 89.11, 83.46, 84.72, 85.43, 85.97, 84.73, 86.18, 88.06, 82.82, 82.32, 87.12, 82.77, 79.32, 84.78, 84.46, 80.3, 84.21, 82.15, 84.84, 75.1, 82.07, 85.92, 78.74, 82.77, 82.99, 87.84, 88.57, 90.07]),
  },
  {
    name: 'S&P 500',
    ticker: 'SPX',
    price: '5,918.33',
    change: '+0.21%',
    positive: true,
    // prettier-ignore
    spark: toSparkSeries(3155, [73.95, 72.03, 71.08, 71.6, 73.2, 72.67, 74.14, 73.45, 76.38, 75.1, 77.61, 79.72, 77.52, 79.27, 78.25, 75.63, 76.23, 76.58, 72.42, 72.4, 69.84, 66.76, 67.12, 67.73, 64.69, 68.27, 65.01, 64.02, 66.05, 69.6, 68.7, 70.05, 69.54, 65.52, 66.42, 66.58, 69.36, 71.28, 71.66, 73.08, 70.32, 69.85, 72.45, 72.94, 72.02, 74.88, 71.61, 71.7, 72.69, 74.3, 74.46, 71.99, 70.45, 70.11, 72.53, 69.96, 71.6, 72, 74.4, 70.78, 72.74, 71.44, 71.37, 73.54, 71.05, 72.86, 70.79, 69.5, 73.43, 72.36, 73.76, 75.05, 77.58, 77.17, 78.5, 82.25, 78.78, 78.42, 78.07, 82.01, 78.82, 78.48, 78.36, 79.8, 79, 76.6, 75.18, 75.82, 78.39, 80.59, 80.93, 79.71, 78.44, 74.41, 74.09, 75.98]),
  },
  {
    name: 'NYSE Composite',
    ticker: 'NYA',
    price: '19,752.41',
    change: '-0.20%',
    positive: false,
    // prettier-ignore
    spark: toSparkSeries(4287, [64.45, 61.11, 62.04, 60.88, 61.84, 66.42, 65.95, 68.68, 66.53, 66.2, 64.61, 66.78, 65.37, 64.69, 64.48, 60.48, 70.11, 69.62, 67.37, 70.31, 73.61, 74.74, 71.95, 68.83, 68.85, 66.69, 65.72, 64.01, 65.91, 64.38, 68.51, 63.62, 68.71, 66.45, 66.61, 70.22, 67.86, 68.96, 72.44, 74.53, 74.4, 75.52, 72.63, 69.2, 67.72, 72.46, 75.34, 74.64, 76.13, 73.74, 73.53, 74.47, 76.73, 76.4, 74.91, 74.34, 73.92, 70.94, 71.5, 68.68, 68.44, 65.97, 68.07, 69.63, 70.45, 68.45, 65.12, 63.93, 64.71, 66.68, 61.08, 58, 61.79, 63.61, 65.05, 62.4, 68.06, 65.87, 66.63, 68.18, 68.06, 67.32, 64.23, 65.72, 63.78, 62.09, 63.94, 61.55, 59.14, 59.95, 58.74, 59.44, 61.25, 63.96, 60.62, 59.61]),
  },
  {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    price: '$177.39',
    change: '+0.93%',
    positive: true,
    // prettier-ignore
    spark: toSparkSeries(5519, [66.26, 68.28, 68.39, 65.49, 62.97, 68.15, 71.28, 67.14, 71.53, 68.43, 69.39, 73.97, 67.92, 57.1, 61.58, 64.45, 59.15, 55.38, 56.78, 60.73, 63.46, 59.3, 56.58, 56.55, 59.43, 58.93, 57.88, 57.25, 56.11, 61.79, 62.87, 65.09, 66.15, 59.93, 60.64, 63.97, 65.3, 65.5, 66.02, 67.5, 67.43, 61.9, 59.69, 59.48, 59.88, 61.71, 59.95, 54.99, 52.18, 51.09, 52.02, 53.2, 55.88, 60.58, 56.65, 58.89, 55.9, 58.03, 60.31, 62.14, 57.94, 61.24, 60.94, 59.09, 64.39, 63.59, 64.45, 65.84, 66.83, 69.01, 68.41, 71.9, 74.79, 69.82, 67.76, 68.77, 67.7, 65.13, 62.97, 66.86, 69.31, 69.64, 67.68, 67.14, 67.12, 68.13, 61.27, 66.8, 63.53, 68.48, 64.28, 68.53, 69.09, 66.14, 66.67, 72.57]),
  },
  {
    name: 'Intel Corp.',
    ticker: 'INTC',
    price: '$50.38',
    change: '+4.89%',
    positive: true,
    // prettier-ignore
    spark: toSparkSeries(6701, [40.29, 36.52, 38.65, 38.66, 38.73, 39.59, 39.74, 40.27, 37.68, 37.74, 38.19, 38.45, 34.69, 33.53, 36.19, 35.7, 37.18, 36.76, 36.8, 38.82, 38.54, 36.97, 38.21, 39.09, 43.08, 45.5, 42.94, 40.59, 40.6, 43.51, 42.51, 44.7, 47.77, 46.53, 44.78, 45.66, 45.29, 47.54, 45.72, 47.71, 47.55, 49.13, 47.53, 43.52, 41.69, 40.58, 41.74, 46.68, 47.53, 49.99, 46.64, 49.91, 49.01, 51.21, 47.53, 45.66, 47.51, 48.7, 50.76, 53.95, 48.88, 50.92, 51.45, 51.69, 49.34, 52.86, 55.07, 51.08, 50.1, 49.78, 49.18, 49.55, 49.15, 45.34, 47.77, 45.99, 43.61, 44.84, 48.01, 46.33, 43.42, 46.93, 46.35, 47.6, 45.09, 45.85, 43.72, 41.2, 42.89, 42.83, 43.48, 46.41, 49.01, 48.49, 48.68, 51.78]),
  },
  {
    name: 'Nokia Corp.',
    ticker: 'NOK',
    price: '$8.82',
    change: '+6.65%',
    positive: true,
    // prettier-ignore
    spark: toSparkSeries(7823, [27.46, 26.98, 25.8, 25.95, 22.92, 23.25, 27.1, 28.27, 26.12, 28.96, 28.95, 27.78, 29.41, 30.28, 30.85, 32.49, 31.78, 32.11, 34.47, 36.23, 36.59, 37.96, 35.38, 36.79, 37.14, 37.87, 36.61, 35.2, 39.04, 40.18, 41.09, 41.92, 38.86, 36.21, 33.95, 35.27, 35.61, 35.38, 37.29, 37.02, 36.76, 34.27, 34.9, 34.79, 33.48, 34.53, 35.99, 38.24, 37.76, 39.23, 38.1, 36.08, 35.04, 36.38, 37.29, 39.2, 41.21, 42.11, 41.35, 38.23, 36.64, 37.97, 39.03, 39.17, 36.98, 35.69, 33.04, 31.86, 38.61, 35.08, 35.33, 36.35, 34.24, 36.73, 32.08, 32.11, 32.87, 31.23, 33.2, 33.36, 32.8, 31.44, 32.34, 29.65, 36.02, 38.33, 39.14, 42.58, 44.72, 43.06, 40.97, 40.47, 41.21, 40.21, 40.21, 40.11]),
  },
  {
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    price: '$360.59',
    change: '-5.42%',
    positive: false,
    // prettier-ignore
    spark: toSparkSeries(8945, [89.21, 88.42, 91.95, 94.9, 97.2, 93.76, 95.02, 93.99, 96.41, 93.71, 92.92, 95.4, 91.94, 97.48, 96.94, 95.45, 92.4, 93.76, 96.33, 97.28, 96.74, 92.99, 92.26, 90.48, 93.76, 92.11, 86.82, 83.2, 87.28, 88.08, 86.09, 81.46, 77.09, 79.91, 85.21, 80.13, 85.23, 80.03, 81.33, 84.31, 84.52, 84.57, 81.19, 81.81, 75.98, 77.99, 77.95, 75.93, 76.87, 81.09, 83.04, 82.12, 78.12, 78.69, 77.63, 79.19, 74.18, 75.44, 77.03, 77.73, 71.89, 76.98, 74.25, 77.95, 77.4, 81.04, 78.54, 77.9, 78.6, 76.53, 73.58, 71.02, 71.9, 70.44, 76.85, 77.69, 76.22, 81.78, 82.78, 85.32, 87.59, 91.37, 88.55, 86.27, 84.09, 86.52, 85.12, 84.64, 86.29, 82.58, 81.71, 86.28, 88.26, 83.47, 80.1, 79.92]),
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
    // prettier-ignore
    spark: toSparkSeries(11023, [62.59, 62.87, 66.28, 66.94, 63.05, 60.71, 60.87, 63.01, 65.63, 66.72, 66.14, 65.67, 63.28, 63.24, 64.03, 65.31, 69.18, 67.03, 67.02, 65.16, 63.09, 63.23, 59.79, 57.91, 60.58, 62.7, 59.12, 60.59, 60.07, 64.53, 64.61, 68.12, 66.44, 67.6, 65.99, 65.37, 67.56, 64.35, 65.35, 66.14, 65.38, 65.53, 63.89, 68.35, 70.22, 72.78, 73.31, 77.18]),
  },
  {
    id: '2',
    ticker: 'MSFT',
    price: '$415.6',
    dailyPts: 3.2,
    dailyPct: 0.78,
    weekChg: 18.6,
    // prettier-ignore
    spark: toSparkSeries(12591, [52.61, 54.67, 54.37, 52.39, 53.13, 54.24, 53.77, 56.96, 54.21, 56.36, 52.87, 52.91, 52.91, 53.06, 54.05, 56.77, 55.22, 53.5, 55.24, 55.21, 55.57, 57.52, 58.11, 60.48, 62.67, 64.05, 67.62, 67.64, 70.11, 69.7, 67.71, 66.07, 64.31, 61.5, 60.25, 60.01, 62.04, 63.71, 64.69, 65.02, 63.57, 64.63, 65.9, 61.94, 64.71, 63.25, 60.84, 62.99]),
  },
  {
    id: '3',
    ticker: 'NVDA',
    price: '$177.39',
    dailyPts: 1.65,
    dailyPct: 0.93,
    weekChg: 45.2,
    // prettier-ignore
    spark: toSparkSeries(13744, [42.97, 43.84, 42.55, 43.07, 41.45, 45.69, 47.46, 45.15, 47.75, 43.08, 44.46, 37.8, 37.94, 35.72, 35.14, 32.33, 41.42, 45.22, 46.61, 45, 44.99, 48.42, 56.57, 59.5, 54.67, 55.56, 53.34, 54.15, 56.29, 57.95, 59.47, 59.02, 58.39, 61.6, 59.14, 66.24, 68.92, 69.13, 73.86, 76.15, 73.14, 74.89, 71.4, 71.95, 74.65, 69.61, 63.98, 63.68]),
  },
  {
    id: '4',
    ticker: 'AMZN',
    price: '$186.5',
    dailyPts: -0.8,
    dailyPct: -0.43,
    weekChg: 15.3,
    // prettier-ignore
    spark: toSparkSeries(14882, [65.57, 69.23, 72.54, 70.58, 69.7, 67.79, 66.66, 69.84, 72.05, 73.69, 71.33, 72.56, 68.97, 67.02, 69.25, 68.04, 70.12, 73.38, 71.49, 70.24, 70.59, 69.81, 70.5, 66.45, 63.72, 61.63, 63.06, 60.22, 61.87, 61.91, 61.4, 61.43, 62.03, 63.27, 65.56, 61.76, 62.77, 62.52, 63.4, 65.86, 61.54, 60.71, 61.09, 66, 62.46, 64, 67.5, 65.32]),
  },
  {
    id: '5',
    ticker: 'GOOGL',
    price: '$155.72',
    dailyPts: 2.1,
    dailyPct: 1.37,
    weekChg: 12.8,
    // prettier-ignore
    spark: toSparkSeries(15967, [50.19, 52.48, 56.14, 57.13, 53.58, 52.4, 49.76, 51.71, 53.73, 52.83, 47.01, 48.64, 46.49, 44.71, 45.84, 47.51, 51.21, 51.75, 47.07, 53.25, 53.02, 56.04, 53.9, 54.27, 53.09, 56.7, 54.86, 53.61, 54.39, 55.27, 58.44, 59.21, 58.89, 60.97, 63.5, 64.41, 64.28, 65.48, 63.86, 62.88, 65.82, 64.06, 60.89, 57.93, 60.15, 57.94, 57.86, 54.45]),
  },
  {
    id: '6',
    ticker: 'META',
    price: '$505.3',
    dailyPts: 4.5,
    dailyPct: 0.9,
    weekChg: 35.1,
    // prettier-ignore
    spark: toSparkSeries(17105, [46.75, 47.76, 46.13, 45.91, 45.34, 49.3, 50.87, 48.9, 46.85, 49.07, 50.88, 54.37, 54.34, 54.17, 52.62, 52.71, 55.65, 55.18, 57.28, 59.71, 56.07, 57.36, 56.8, 52.95, 49.59, 50.35, 50.11, 48.92, 51.6, 52.4, 50.29, 52.17, 54.87, 55.44, 54.27, 52.27, 53.76, 55.31, 55.75, 56.16, 57.8, 58.73, 54.6, 53.58, 55.27, 55.62, 62.45, 62.94]),
  },
  {
    id: '7',
    ticker: 'TSLA',
    price: '$360.59',
    dailyPts: -20.67,
    dailyPct: -5.42,
    weekChg: -8.3,
    // prettier-ignore
    spark: toSparkSeries(18249, [83.75, 78.44, 81.1, 79.12, 76.61, 84.38, 84.64, 87.7, 86.31, 80.02, 74.82, 75.1, 75.36, 73.06, 74.86, 75.38, 78.07, 78.02, 75.42, 81.25, 85.54, 86.68, 84.46, 86.89, 80.57, 84.1, 82.48, 85.83, 87.06, 79.95, 74.26, 68.41, 64.98, 70.44, 71.17, 74.21, 69.56, 73.59, 70.47, 70.24, 65.12, 64.41, 69.18, 62.39, 63.5, 59.78, 59.96, 60.64]),
  },
  {
    id: '8',
    ticker: 'INTC',
    price: '$50.38',
    dailyPts: 2.35,
    dailyPct: 4.89,
    weekChg: -12.5,
    // prettier-ignore
    spark: toSparkSeries(19388, [71.45, 75.23, 76.21, 71.96, 69.34, 69.92, 69.21, 65.68, 62.87, 64.07, 64.44, 62.98, 59.15, 61.12, 62.74, 64.13, 62.29, 65.14, 60.86, 58.23, 56.22, 57.6, 60.39, 57.87, 57.04, 54.84, 55.29, 56.38, 56.92, 58.48, 61.09, 59.01, 58.65, 61.44, 61.55, 58.75, 61.48, 60.6, 58.99, 61.4, 56.7, 57.42, 59.98, 57.74, 64.44, 59.11, 59.16, 59.45]),
  },
  {
    id: '9',
    ticker: 'AMD',
    price: '$162.45',
    dailyPts: -1.2,
    dailyPct: -0.73,
    weekChg: 28.7,
    // prettier-ignore
    spark: toSparkSeries(20471, [44.8, 46.66, 43.7, 46.12, 47.65, 50.65, 48.05, 52.96, 54.41, 54.91, 53.77, 49.18, 50.01, 52.14, 49.46, 49.81, 52.08, 52.56, 50.02, 50.61, 56.27, 56.79, 62.63, 61.99, 65.99, 62.88, 59.6, 57.44, 58.61, 62.78, 62, 59.58, 57.36, 54.92, 59.1, 55.37, 64.03, 63.13, 63.88, 65.3, 65.22, 60.4, 62.84, 60.12, 59.42, 65.11, 58, 57.8]),
  },
  {
    id: '10',
    ticker: 'NFLX',
    price: '$628.9',
    dailyPts: 5.4,
    dailyPct: 0.87,
    weekChg: 42.1,
    // prettier-ignore
    spark: toSparkSeries(21556, [42.07, 41.72, 43.08, 43.95, 42.71, 43, 47.8, 51.53, 49.82, 51.72, 51.75, 54.86, 54.64, 54.28, 55.52, 55.2, 53.51, 49.34, 45.58, 51.95, 44.7, 46.57, 48.92, 47.16, 49.62, 47.2, 47.47, 49.84, 51.12, 53.9, 53.39, 51.34, 51.56, 47.93, 50.31, 50.69, 50.32, 50.04, 53.93, 52.8, 52.46, 55.01, 56.66, 58.11, 59.39, 60.81, 62.81, 64]),
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
      <Card padding={4} style={CHART_PANEL_STYLE}>
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
              <ChartLabel
                x={PORTFOLIO_LEFT - 8}
                y={portfolioYFor(t) + 4}
                textAnchor="end">
                ${(t / 1000).toFixed(0)}k
              </ChartLabel>
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
            <ChartLabel
              key={m}
              x={PORTFOLIO_LEFT + (m / 12) * PORTFOLIO_WIDTH}
              y={192}
              textAnchor={m === 12 ? 'end' : 'middle'}>
              {xAxisLabels[m] ?? ''}
            </ChartLabel>
          ))}
          <ChartLabel
            x={PORTFOLIO_LEFT + PORTFOLIO_WIDTH - 4}
            y={portfolioYFor(294200) - 8}
            textAnchor="end"
            fill="var(--color-text-highlight)">
            $294k
          </ChartLabel>
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

const chgColumns: Array<{
  key: 'dailyPts' | 'dailyPct' | 'weekChg';
  header: string;
  width: PixelWidth;
  digits: number;
  suffix: string;
}> = [
  {key: 'dailyPts', header: 'Chg (pts)', width: pixel(104), digits: 2, suffix: ''},
  {key: 'dailyPct', header: 'Chg (%)', width: pixel(96), digits: 2, suffix: '%'},
  {key: 'weekChg', header: '52W (%)', width: pixel(96), digits: 1, suffix: '%'},
];
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
  ...chgColumns.map(column => ({
    key: column.key,
    header: column.header,
    width: column.width,
    renderCell: (row: StockRow) => {
      const value = row[column.key] as number;
      return (
        <MetricDelta value={formatSigned(value, column.digits, column.suffix)} positive={value >= 0} />
      );
    },
  })),
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

// ============= MAIN COMPONENT =============

export default function DashboardPortfolio() {
  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={6}>
          <VStack gap={6}>
            {/* Page header */}
            <HStack hAlign="between" vAlign="center">
              <Heading level={1}>The night vault</Heading>
              <Text type="body" color="secondary">
                1 year
              </Text>
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
            <TableCard
              title="Trending stocks"
              data={trendingStocks}
              columns={trendingColumns}
            />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
