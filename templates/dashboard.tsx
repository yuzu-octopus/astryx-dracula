// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=6] > (Hd"The night shift"[level=1] + V[g=6] > (H[j=between a=center] > Hd"Awake after dark"[level=2] + B.secondary"Reload") + (V[g=3] > C[p=3] + Tx"Hourly intervals"[t=supporting] + (H[g=6] > (H[g=2 a=center] > Ic + Tx"Desktop"[t=supporting])*2))) + (G[c={min:280} g=4] > (C > V[g=2] > Tx"Moonlit visitors"[t=supporting] + (H[g=2] > Tx"27.3 k"[t=display-3] + Tx"+18.2%"[t=body]) + Tx"Last 30 days vs. Previous"[t=supporting])*4) + D + (H[j=between a=center] > Hd"Night denizens"[level=2] + B.secondary"View more") + (G[c={min:280} g=4] > (C > V[g=4] > Hd"Territory"[level=3] + (H[g=4 wrap] > (V[g=0] > (H[g=2 a=center] > Ic + Tx[t=supporting]) + Tx[t=supporting])*5))*2) + D + (H[j=between a=center] > Hd"Engagement"[level=2] + B.secondary"View more") + (G[c={min:280} g=4] > (C > V[g=6] > (H[j=between a=center] > Hd"Top pages"[level=3] + Lk"All pages") + T)*2)

/**
 * Analytics Dashboard — the night shift at a glance: live active users, four
 * KPI tiles, audience breakdown strips, and engagement tables.
 *
 * Frame: one content column, sections separated by dividers.
 *
 * Container policy: a widget dashboard, so tiles are Cards on an auto-fit grid
 * while the engagement tables stay edge-to-edge inside their own card. KPI
 * tiles lead with a supporting label above the figure, chart hues follow the
 * metric's direction (green up, red down), and card headings sit at level 3
 * under level 2 sections.
 *
 * Responsive contract:
 *   no media queries — every row is an auto-fit Grid. Tiles step from four
 *   columns down to one as the content column narrows (280px track floor), and
 *   the two engagement tables scroll horizontally inside their card below
 *   ~440px while every cell truncates to a single line.
 */

import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Grid} from '@astryxdesign/core/Grid';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Divider} from '@astryxdesign/core/Divider';
import {Link} from '@astryxdesign/core/Link';
import {Icon} from '@astryxdesign/core/Icon';

// ============= ICONS =============

import {RefreshCw, Square} from 'lucide-react';
import {CHART_HUES} from 'astryx-dracula/shared/chart-hues';
import {MetricDelta} from 'astryx-dracula/shared/metric-delta';

// ============= DATA =============

// Active users chart data (96 points over 24h at 15-min intervals: Apr 1 14:00 → Apr 2 14:00)
// Each point has an index (0–95) for even spacing, plus a label for display
const activeUsersData = [
  // Apr 1 14:00 — mid-afternoon, strong work hours
  {hour: 0, label: 'Apr 1 14:00', allUsers: 116, desktop: 79, mobile: 37},
  {hour: 1, label: 'Apr 1 14:15', allUsers: 118, desktop: 80, mobile: 38},
  {hour: 2, label: 'Apr 1 14:30', allUsers: 117, desktop: 79, mobile: 38},
  {hour: 3, label: 'Apr 1 14:45', allUsers: 119, desktop: 81, mobile: 38},
  // Apr 1 15:00 — afternoon lull
  {hour: 4, label: 'Apr 1 15:00', allUsers: 116, desktop: 79, mobile: 37},
  {hour: 5, label: 'Apr 1 15:15', allUsers: 113, desktop: 76, mobile: 37},
  {hour: 6, label: 'Apr 1 15:30', allUsers: 109, desktop: 72, mobile: 37},
  {hour: 7, label: 'Apr 1 15:45', allUsers: 111, desktop: 74, mobile: 37},
  // Apr 1 16:00 — late afternoon, some leaving early
  {hour: 8, label: 'Apr 1 16:00', allUsers: 110, desktop: 72, mobile: 38},
  {hour: 9, label: 'Apr 1 16:15', allUsers: 107, desktop: 69, mobile: 38},
  {hour: 10, label: 'Apr 1 16:30', allUsers: 104, desktop: 66, mobile: 38},
  {hour: 11, label: 'Apr 1 16:45', allUsers: 101, desktop: 62, mobile: 39},
  // Apr 1 17:00 — 5PM exodus, desktop drops fast, mobile bumps
  {hour: 12, label: 'Apr 1 17:00', allUsers: 100, desktop: 57, mobile: 43},
  {hour: 13, label: 'Apr 1 17:15', allUsers: 99, desktop: 54, mobile: 45},
  {hour: 14, label: 'Apr 1 17:30', allUsers: 97, desktop: 50, mobile: 47},
  {hour: 15, label: 'Apr 1 17:45', allUsers: 95, desktop: 46, mobile: 49},
  // Apr 1 18:00 — commute, mobile overtakes desktop
  {hour: 16, label: 'Apr 1 18:00', allUsers: 93, desktop: 41, mobile: 52},
  {hour: 17, label: 'Apr 1 18:15', allUsers: 91, desktop: 39, mobile: 52},
  {hour: 18, label: 'Apr 1 18:30', allUsers: 89, desktop: 37, mobile: 52},
  {hour: 19, label: 'Apr 1 18:45', allUsers: 87, desktop: 36, mobile: 51},
  // Apr 1 19:00 — dinner, decline slowing
  {hour: 20, label: 'Apr 1 19:00', allUsers: 85, desktop: 34, mobile: 51},
  {hour: 21, label: 'Apr 1 19:15', allUsers: 83, desktop: 32, mobile: 51},
  {hour: 22, label: 'Apr 1 19:30', allUsers: 80, desktop: 30, mobile: 50},
  {hour: 23, label: 'Apr 1 19:45', allUsers: 77, desktop: 28, mobile: 49},
  // Apr 1 20:00 — couch browsing, mobile plateau
  {hour: 24, label: 'Apr 1 20:00', allUsers: 75, desktop: 26, mobile: 49},
  {hour: 25, label: 'Apr 1 20:15', allUsers: 76, desktop: 26, mobile: 50},
  {hour: 26, label: 'Apr 1 20:30', allUsers: 76, desktop: 27, mobile: 49},
  {hour: 27, label: 'Apr 1 20:45', allUsers: 75, desktop: 27, mobile: 48},
  // Apr 1 21:00 — winding down, mobile dropping off
  {hour: 28, label: 'Apr 1 21:00', allUsers: 73, desktop: 27, mobile: 46},
  {hour: 29, label: 'Apr 1 21:15', allUsers: 71, desktop: 27, mobile: 44},
  {hour: 30, label: 'Apr 1 21:30', allUsers: 69, desktop: 27, mobile: 42},
  {hour: 31, label: 'Apr 1 21:45', allUsers: 67, desktop: 28, mobile: 39},
  // Apr 1 22:00 — bedtime wave, mobile drops, desktop holds
  {hour: 32, label: 'Apr 1 22:00', allUsers: 65, desktop: 29, mobile: 36},
  {hour: 33, label: 'Apr 1 22:15', allUsers: 63, desktop: 29, mobile: 34},
  {hour: 34, label: 'Apr 1 22:30', allUsers: 61, desktop: 30, mobile: 31},
  {hour: 35, label: 'Apr 1 22:45', allUsers: 60, desktop: 31, mobile: 29},
  // Apr 1 23:00 — desktop overtakes as local users sleep, other TZs active
  {hour: 36, label: 'Apr 1 23:00', allUsers: 59, desktop: 33, mobile: 26},
  {hour: 37, label: 'Apr 1 23:15', allUsers: 58, desktop: 34, mobile: 24},
  {hour: 38, label: 'Apr 1 23:30', allUsers: 57, desktop: 35, mobile: 22},
  {hour: 39, label: 'Apr 1 23:45', allUsers: 56, desktop: 36, mobile: 20},
  // Apr 2 00:00 — EMEA morning starts, desktop dominant
  {hour: 40, label: 'Apr 2 00:00', allUsers: 56, desktop: 38, mobile: 18},
  {hour: 41, label: 'Apr 2 00:15', allUsers: 56, desktop: 39, mobile: 17},
  {hour: 42, label: 'Apr 2 00:30', allUsers: 57, desktop: 40, mobile: 17},
  {hour: 43, label: 'Apr 2 00:45', allUsers: 56, desktop: 40, mobile: 16},
  // Apr 2 01:00 — EMEA working, plateau
  {hour: 44, label: 'Apr 2 01:00', allUsers: 56, desktop: 41, mobile: 15},
  {hour: 45, label: 'Apr 2 01:15', allUsers: 55, desktop: 41, mobile: 14},
  {hour: 46, label: 'Apr 2 01:30', allUsers: 55, desktop: 41, mobile: 14},
  {hour: 47, label: 'Apr 2 01:45', allUsers: 54, desktop: 40, mobile: 14},
  // Apr 2 02:00 — EMEA mid-morning, holding steady
  {hour: 48, label: 'Apr 2 02:00', allUsers: 54, desktop: 40, mobile: 14},
  {hour: 49, label: 'Apr 2 02:15', allUsers: 53, desktop: 39, mobile: 14},
  {hour: 50, label: 'Apr 2 02:30', allUsers: 53, desktop: 39, mobile: 14},
  {hour: 51, label: 'Apr 2 02:45', allUsers: 52, desktop: 38, mobile: 14},
  // Apr 2 03:00 — EMEA lunch gap, slight dip
  {hour: 52, label: 'Apr 2 03:00', allUsers: 51, desktop: 37, mobile: 14},
  {hour: 53, label: 'Apr 2 03:15', allUsers: 50, desktop: 36, mobile: 14},
  {hour: 54, label: 'Apr 2 03:30', allUsers: 49, desktop: 35, mobile: 14},
  {hour: 55, label: 'Apr 2 03:45', allUsers: 49, desktop: 35, mobile: 14},
  // Apr 2 04:00 — EMEA afternoon, floor
  {hour: 56, label: 'Apr 2 04:00', allUsers: 48, desktop: 34, mobile: 14},
  {hour: 57, label: 'Apr 2 04:15', allUsers: 48, desktop: 33, mobile: 15},
  {hour: 58, label: 'Apr 2 04:30', allUsers: 49, desktop: 33, mobile: 16},
  {hour: 59, label: 'Apr 2 04:45', allUsers: 49, desktop: 32, mobile: 17},
  // Apr 2 05:00 — early risers checking phones, mobile climbing
  {hour: 60, label: 'Apr 2 05:00', allUsers: 50, desktop: 31, mobile: 19},
  {hour: 61, label: 'Apr 2 05:15', allUsers: 51, desktop: 30, mobile: 21},
  {hour: 62, label: 'Apr 2 05:30', allUsers: 52, desktop: 29, mobile: 23},
  {hour: 63, label: 'Apr 2 05:45', allUsers: 54, desktop: 28, mobile: 26},
  // Apr 2 06:00 — alarms going off, mobile surging
  {hour: 64, label: 'Apr 2 06:00', allUsers: 56, desktop: 27, mobile: 29},
  {hour: 65, label: 'Apr 2 06:15', allUsers: 58, desktop: 26, mobile: 32},
  {hour: 66, label: 'Apr 2 06:30', allUsers: 61, desktop: 26, mobile: 35},
  {hour: 67, label: 'Apr 2 06:45', allUsers: 64, desktop: 27, mobile: 37},
  // Apr 2 07:00 — commute, mobile peaks, desktop starting
  {hour: 68, label: 'Apr 2 07:00', allUsers: 67, desktop: 28, mobile: 39},
  {hour: 69, label: 'Apr 2 07:15', allUsers: 70, desktop: 30, mobile: 40},
  {hour: 70, label: 'Apr 2 07:30', allUsers: 73, desktop: 33, mobile: 40},
  {hour: 71, label: 'Apr 2 07:45', allUsers: 76, desktop: 37, mobile: 39},
  // Apr 2 08:00 — arriving at desks, desktop ramping
  {hour: 72, label: 'Apr 2 08:00', allUsers: 80, desktop: 43, mobile: 37},
  {hour: 73, label: 'Apr 2 08:15', allUsers: 85, desktop: 49, mobile: 36},
  {hour: 74, label: 'Apr 2 08:30', allUsers: 90, desktop: 55, mobile: 35},
  {hour: 75, label: 'Apr 2 08:45', allUsers: 95, desktop: 61, mobile: 34},
  // Apr 2 09:00 — work day, desktop dominant
  {hour: 76, label: 'Apr 2 09:00', allUsers: 99, desktop: 66, mobile: 33},
  {hour: 77, label: 'Apr 2 09:15', allUsers: 102, desktop: 69, mobile: 33},
  {hour: 78, label: 'Apr 2 09:30', allUsers: 104, desktop: 72, mobile: 32},
  {hour: 79, label: 'Apr 2 09:45', allUsers: 104, desktop: 72, mobile: 32},
  // Apr 2 10:00 — coffee break stall, then climbing
  {hour: 80, label: 'Apr 2 10:00', allUsers: 106, desktop: 74, mobile: 32},
  {hour: 81, label: 'Apr 2 10:15', allUsers: 109, desktop: 76, mobile: 33},
  {hour: 82, label: 'Apr 2 10:30', allUsers: 112, desktop: 78, mobile: 34},
  {hour: 83, label: 'Apr 2 10:45', allUsers: 114, desktop: 80, mobile: 34},
  // Apr 2 11:00 — approaching peak
  {hour: 84, label: 'Apr 2 11:00', allUsers: 116, desktop: 81, mobile: 35},
  {hour: 85, label: 'Apr 2 11:15', allUsers: 117, desktop: 81, mobile: 36},
  {hour: 86, label: 'Apr 2 11:30', allUsers: 119, desktop: 83, mobile: 36},
  {hour: 87, label: 'Apr 2 11:45', allUsers: 119, desktop: 82, mobile: 37},
  // Apr 2 12:00 — lunch dip, mobile ticks up
  {hour: 88, label: 'Apr 2 12:00', allUsers: 120, desktop: 83, mobile: 37},
  {hour: 89, label: 'Apr 2 12:15', allUsers: 115, desktop: 78, mobile: 37},
  {hour: 90, label: 'Apr 2 12:30', allUsers: 111, desktop: 74, mobile: 37},
  {hour: 91, label: 'Apr 2 12:45', allUsers: 110, desktop: 73, mobile: 37},
  // Apr 2 13:00 — returning from lunch
  {hour: 92, label: 'Apr 2 13:00', allUsers: 113, desktop: 76, mobile: 37},
  {hour: 93, label: 'Apr 2 13:15', allUsers: 116, desktop: 79, mobile: 37},
  {hour: 94, label: 'Apr 2 13:30', allUsers: 118, desktop: 81, mobile: 37},
  {hour: 95, label: 'Apr 2 14:00', allUsers: 120, desktop: 83, mobile: 37},
];

// Metric cards
const metrics = [
  {
    label: 'Moonlit visitors',
    value: '27.3 k',
    change: '+18.2%',
    positive: true,
  },
  {
    label: 'Midnight page views',
    value: '48.2 k',
    change: '+12.5%',
    positive: true,
  },
  {
    label: 'Avg. night visit',
    value: '4.5 min',
    change: '-14.3%',
    positive: false,
  },
  {
    label: 'Sunrise bounce rate',
    value: '42.3%',
    change: '-8.7%',
    positive: true,
  },
];

interface SparkPoint {
  id: string;
  value: number;
}

// Sparkline data for each metric card (30 days, weekends at indices 5-6, 12-13,
// 19-20, 26-27). Every sample carries its day, so the bars key off the series
// rather than off the array slot.
function toSparkSeries(values: number[]): SparkPoint[] {
  return values.map((value, day) => ({id: `day-${day + 1}`, value}));
}

const sparklines: SparkPoint[][] = [
  // Monthly Visitors: +18.2% — declining first 2 weeks, hits bottom around day 14, then sharp recovery
  // prettier-ignore
  toSparkSeries([48, 46, 44, 42, 40, 18, 16, 38, 36, 34, 32, 30, 12, 10, 28, 26, 28, 32, 36, 14, 12, 40, 44, 48, 52, 56, 28, 24, 58, 62]),
  // Monthly Page Views: +12.5% — flat/choppy first 3 weeks, then kicks up sharply in final week
  // prettier-ignore
  toSparkSeries([36, 38, 35, 37, 36, 14, 12, 38, 36, 34, 37, 35, 12, 10, 36, 34, 36, 35, 38, 14, 12, 40, 44, 50, 54, 56, 26, 22, 58, 60]),
  // Avg. Session: -14.3% — strong start, holds through week 2, then clear drop-off week 3-4
  // prettier-ignore
  toSparkSeries([58, 56, 60, 58, 62, 30, 26, 60, 58, 62, 60, 58, 28, 24, 56, 54, 50, 46, 42, 18, 14, 38, 36, 34, 32, 30, 10, 8, 28, 26]),
  // Bounce Rate: -8.7% — high and volatile first half, starts dropping around day 16, steady decline
  // prettier-ignore
  toSparkSeries([52, 56, 50, 54, 58, 62, 60, 54, 52, 56, 50, 54, 60, 58, 50, 48, 46, 44, 40, 46, 44, 38, 36, 34, 36, 32, 38, 36, 30, 28]),
];

// Demographics
const regionData = [
  {
    label: 'NORAM',
    value: 38,
    color: CHART_HUES.cyan,
  },
  {
    label: 'EMEA',
    value: 28,
    color: CHART_HUES.orange,
  },
  {
    label: 'APAC',
    value: 22,
    color: CHART_HUES.green,
  },
  {
    label: 'LATAM',
    value: 8,
    color: CHART_HUES.pink,
  },
  {label: 'Other', value: 4, color: CHART_HUES.muted},
];

const roleData = [
  {
    label: 'Engineer',
    value: 45,
    color: CHART_HUES.cyan,
  },
  {
    label: 'Manager',
    value: 20,
    color: CHART_HUES.orange,
  },
  {
    label: 'Designer',
    value: 15,
    color: CHART_HUES.green,
  },
  {
    label: 'Data Scientist',
    value: 12,
    color: CHART_HUES.pink,
  },
  {label: 'Other', value: 8, color: CHART_HUES.muted},
];

// Engagement — Top pages
interface PageRow extends Record<string, unknown> {
  id: string;
  page: string;
  views: number;
  newUsers: string;
  avgTime: string;
}

const topPagesData: PageRow[] = [
  {
    id: '1',
    page: '/home',
    views: 8420,
    newUsers: '62.3%',
    avgTime: '3:42',
  },
  {
    id: '2',
    page: '/products',
    views: 6150,
    newUsers: '45.1%',
    avgTime: '4:15',
  },
  {
    id: '3',
    page: '/pricing',
    views: 4830,
    newUsers: '38.7%',
    avgTime: '2:58',
  },
  {
    id: '4',
    page: '/blog',
    views: 3920,
    newUsers: '71.4%',
    avgTime: '5:30',
  },
  {
    id: '5',
    page: '/docs',
    views: 3410,
    newUsers: '29.8%',
    avgTime: '6:12',
  },
  {
    id: '6',
    page: '/about',
    views: 2980,
    newUsers: '55.6%',
    avgTime: '2:15',
  },
  {
    id: '7',
    page: '/contact',
    views: 2540,
    newUsers: '48.2%',
    avgTime: '1:48',
  },
  {
    id: '8',
    page: '/changelog',
    views: 2210,
    newUsers: '22.1%',
    avgTime: '4:55',
  },
  {
    id: '9',
    page: '/support',
    views: 1870,
    newUsers: '59.3%',
    avgTime: '3:22',
  },
  {
    id: '10',
    page: '/careers',
    views: 1520,
    newUsers: '83.1%',
    avgTime: '2:34',
  },
];

// Counts render with thousands separators in every table cell.
const formatCount = (value: number) => value.toLocaleString();

const topPagesMaxViews = Math.max(...topPagesData.map(d => d.views));

const topPagesColumns: TableColumn<PageRow>[] = [
  {key: 'page', header: 'Page', width: pixel(112)},
  {
    key: 'views',
    header: 'Views',
    width: proportional(1),
    renderCell: (item: PageRow) => (
      <VStack gap={1}>
        <ProgressBar
          value={item.views}
          max={topPagesMaxViews}
          label={`${item.page} views`}
          isLabelHidden
        />
        <Text type="supporting" hasTabularNumbers maxLines={1}>
          {formatCount(item.views)}
        </Text>
      </VStack>
    ),
  },
  {
    key: 'newUsers',
    header: 'New Users',
    width: pixel(104),
    renderCell: (item: PageRow) => (
      <Text hasTabularNumbers maxLines={1}>
        {item.newUsers}
      </Text>
    ),
  },
  {
    key: 'avgTime',
    header: 'Avg. Time',
    width: pixel(104),
    renderCell: (item: PageRow) => (
      <Text hasTabularNumbers maxLines={1}>
        {item.avgTime}
      </Text>
    ),
  },
];

// Engagement — Top events
interface EventRow extends Record<string, unknown> {
  id: string;
  event: string;
  count: number;
  users: number;
  newUsers: number;
}

const topEventsData: EventRow[] = [
  {id: '1', event: 'page_view', count: 18420, users: 12300, newUsers: 4920},
  {id: '2', event: 'session_start', count: 14850, users: 9870, newUsers: 3950},
  {id: '3', event: 'first_visit', count: 8230, users: 8230, newUsers: 8230},
  {id: '4', event: 'user_engagement', count: 6120, users: 4510, newUsers: 1580},
  {id: '5', event: 'click', count: 3540, users: 2680, newUsers: 940},
  {id: '6', event: 'scroll', count: 2910, users: 2140, newUsers: 750},
  {id: '7', event: 'form_submit', count: 1870, users: 1350, newUsers: 540},
  {id: '8', event: 'video_play', count: 1240, users: 980, newUsers: 390},
  {id: '9', event: 'search', count: 960, users: 720, newUsers: 290},
  {id: '10', event: 'share', count: 580, users: 410, newUsers: 160},
];

const topEventsMaxCount = Math.max(...topEventsData.map(d => d.count));

const topEventsColumns: TableColumn<EventRow>[] = [
  {key: 'event', header: 'Event', width: pixel(112)},
  {
    key: 'count',
    header: 'Count',
    width: proportional(1),
    renderCell: (item: EventRow) => (
      <VStack gap={1}>
        <ProgressBar
          value={item.count}
          max={topEventsMaxCount}
          label={`${item.count}`}
          isLabelHidden
        />
        <Text type="supporting" hasTabularNumbers maxLines={1}>
          {formatCount(item.count)}
        </Text>
      </VStack>
    ),
  },
  {
    key: 'users',
    header: 'Users',
    width: pixel(72),
    renderCell: (item: EventRow) => (
      <Text hasTabularNumbers maxLines={1}>
        {formatCount(item.users)}
      </Text>
    ),
  },
  {
    key: 'newUsers',
    header: 'New Users',
    width: pixel(104),
    renderCell: (item: EventRow) => (
      <Text hasTabularNumbers maxLines={1}>
        {formatCount(item.newUsers)}
      </Text>
    ),
  },
];

// ============= CHART COMPONENTS =============

// Chart series colors: desktop glows orange, mobile glows cyan. Sourced from
// the shared categorical hues so data encoding can never reach for purple.
const chartColors = {
  desktop: CHART_HUES.orange,
  mobile: CHART_HUES.cyan,
};

function ChartLegendItem({color, label}: {color: string; label: string}) {
  return (
    <HStack gap={2} vAlign="center">
      <Icon icon={Square} size="xsm" style={{color}} />
      <Text type="supporting" color="secondary">
        {label}
      </Text>
    </HStack>
  );
}

function ActiveUsersChart() {
  // Downsample the 96 quarter-hour points to one bar per hour, stacking
  // mobile atop desktop so each bar total is all users
  const bars = activeUsersData.filter((_, i) => i % 4 === 0);
  const max = 130;
  const tickHours = [0, 32, 64, 92];
  // SVG type scales up with the viewBox, so unit sizes stay small
  return (
    <VStack gap={3}>
      <Card
        padding={3}
        style={{
          backgroundColor: 'var(--color-background)',
          border: 'var(--border-width) solid var(--color-separator)',
        }}>
        <svg
          viewBox="0 0 540 180"
          width="100%"
          role="img"
          aria-label="Hourly active users, desktop and mobile stacked">
          <line x1="20" y1="30" x2="520" y2="30" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
          <line x1="20" y1="80" x2="520" y2="80" stroke="var(--color-separator)" strokeDasharray="3 3" opacity={0.5} />
          <line x1="20" y1="130" x2="520" y2="130" stroke="var(--color-separator)" />
          {bars.map((d, i) => {
            const hAll = (d.allUsers / max) * 110;
            const hDesktop = (d.desktop / max) * 110;
            const x = 32 + i * 21;
            return (
              <g key={d.hour}>
                <rect
                  x={x}
                  y={130 - hAll}
                  width={14}
                  height={hAll - hDesktop}
                  rx={4}
                  fill={chartColors.mobile}
                />
                <rect
                  x={x}
                  y={130 - hDesktop}
                  width={14}
                  height={hDesktop}
                  rx={4}
                  fill={chartColors.desktop}
                />
                {(i % 6 === 0 || i === bars.length - 1) && (
                  <text
                    x={x + 7}
                    y={120 - hAll}
                    textAnchor="middle"
                    fontSize={5.5}
                    fill="var(--color-text-highlight)"
                    fontFamily="var(--font-family-mono)">
                    {d.allUsers}
                  </text>
                )}
                {tickHours.includes(d.hour) && (
                  <text
                    x={x + 7}
                    y={150}
                    textAnchor="middle"
                    fontSize={5.5}
                    fill="var(--color-text-paragraph)"
                    fontFamily="var(--font-family-mono)">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Card>
      <Text type="supporting" color="secondary">
        Hourly intervals · trailing 24 hours
      </Text>
      <HStack gap={6} vAlign="center">
        <ChartLegendItem color={chartColors.desktop} label="Desktop" />
        <ChartLegendItem color={chartColors.mobile} label="Mobile" />
      </HStack>
    </VStack>
  );
}

// Thirty-day trend bars. The tone follows the metric's direction; purple stays
// out of the chart so it keeps meaning "interactive".
function Sparkline({
  data,
  label,
  positive,
}: {
  data: SparkPoint[];
  label: string;
  positive: boolean;
}) {
  const max = Math.max(...data.map(point => point.value));
  return (
    <svg
      viewBox="0 0 300 40"
      width="100%"
      height={40}
      role="img"
      aria-label={`${label} thirty-day trend`}>
      {data.map((point, day) => {
        const barHeight = Math.max(3, (point.value / max) * 32);
        return (
          <rect
            key={point.id}
            x={day * 10}
            y={36 - barHeight}
            width={7}
            height={barHeight}
            rx={4}
            fill={positive ? 'var(--dracula-green)' : 'var(--dracula-red)'}
          />
        );
      })}
    </svg>
  );
}

// ============= CARD COMPONENTS =============

function MetricCard({
  label,
  value,
  change,
  positive,
  sparkline,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline: SparkPoint[];
}) {
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
          Last 30 days vs. Previous
        </Text>
        <Sparkline data={sparkline} label={label} positive={positive} />
      </VStack>
    </Card>
  );
}

function StackedBarCard({
  title,
  data,
}: {
  title: string;
  data: Array<{label: string; value: number; color: string}>;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const clipId = `stacked-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  let offset = 0;
  const segments = data.map(d => {
    const x = (offset / total) * 540;
    offset += d.value;
    return {...d, x, width: (d.value / total) * 540};
  });

  return (
    <Card>
      <VStack gap={4}>
        <Heading level={3}>{title}</Heading>
        <svg
          viewBox="0 0 540 24"
          width="100%"
          height={24}
          role="img"
          aria-label={`${title} distribution strip`}>
          <defs>
            <clipPath id={clipId}>
              <rect width={540} height={24} rx={4} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {segments.map(s => (
              <rect
                key={s.label}
                x={s.x}
                y={0}
                width={s.width}
                height={24}
                fill={s.color}
              />
            ))}
          </g>
        </svg>
        {/* Legend */}
        <HStack gap={4} wrap="wrap">
          {data.map(d => (
            <VStack key={d.label} gap={0}>
              <HStack gap={2} vAlign="center">
                <Icon icon={Square} size="xsm" style={{color: d.color}} />
                <Text type="supporting">{d.label}</Text>
              </HStack>
              <Text type="supporting" color="secondary" hasTabularNumbers>
                {((d.value / total) * 100).toFixed(0)}%
              </Text>
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Card>
  );
}

// ============= TABLE COMPONENTS =============

function TableCard<T extends {id: string}>({
  title,
  linkLabel,
  linkHref,
  data,
  columns,
}: {
  title: string;
  linkLabel: string;
  linkHref: string;
  data: T[];
  columns: TableColumn<T>[];
}) {
  return (
    <Card>
      <VStack gap={6}>
        <HStack hAlign="between" vAlign="center">
          <Heading level={3}>{title}</Heading>
          <Link href={linkHref}>{linkLabel}</Link>
        </HStack>
        <Table<T>
          data={data}
          columns={columns}
          idKey="id"
          density="compact"
          dividers="rows"
          textOverflow="truncate"
          hasHover
        />
      </VStack>
    </Card>
  );
}

// ============= SIDENAV =============

// ============= MAIN COMPONENT =============

export default function DashboardTemplate() {
  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={6}>
          <VStack gap={6}>
            {/* Page header — the only h1; section titles sit at level 2 */}
            <Heading level={1}>The night shift</Heading>

            {/* Active Users Chart */}
            <VStack gap={6}>
              <HStack hAlign="between" vAlign="center">
                <Heading level={2}>Awake after dark</Heading>
                <Button
                  label="Reload"
                  variant="secondary"
                  size="md"
                  icon={<Icon icon={RefreshCw} size="sm" />}
                />
              </HStack>
              <ActiveUsersChart />
            </VStack>

            {/* Metric Cards */}
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              {metrics.map((m, index) => (
                <MetricCard key={m.label} {...m} sparkline={sparklines[index]} />
              ))}
            </Grid>

            <Divider />

            {/* Demographics */}
            <HStack hAlign="between" vAlign="center">
              <Heading level={2}>Night denizens</Heading>
              <Button label="View more" variant="secondary" size="md" />
            </HStack>
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              <StackedBarCard title="Territory" data={regionData} />
              <StackedBarCard title="Role" data={roleData} />
            </Grid>

            <Divider />

            {/* Engagement */}
            <HStack hAlign="between" vAlign="center">
              <Heading level={2}>Engagement</Heading>
              <Button label="View more" variant="secondary" size="md" />
            </HStack>
            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              <TableCard
                title="Top pages"
                linkLabel="All pages"
                linkHref="#"
                data={topPagesData}
                columns={topPagesColumns}
              />
              <TableCard
                title="Top events"
                linkLabel="All events"
                linkHref="#"
                data={topEventsData}
                columns={topEventsColumns}
              />
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
