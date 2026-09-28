// Demo fixture DATA, split from demo/fixtures.tsx.
//
// WHY: fixtures.tsx exports components, and a .tsx exporting non-components
// breaks React Fast Refresh. Same split and same reason as
// shared/scene-hues.ts. Nothing here ships -- demo/ is not in package.json
// `files` -- so this is purely to keep Fast Refresh intact while developing
// the viewer.

export interface Bar {
  month: string;
  value: number;
}

export const BARS = [
  {month: 'Jan', value: 42},
  {month: 'Feb', value: 68},
  {month: 'Mar', value: 55},
  {month: 'Apr', value: 90},
  {month: 'May', value: 74},
  {month: 'Jun', value: 61},
  {month: 'Jul', value: 83},
];

export interface RouteRow extends Record<string, unknown> {
  page: string;
  views: string;
  latency: string;
  status: 'healthy' | 'degraded';
  change: number;
}

export const ROUTES: RouteRow[] = [
  { page: '/', views: '48,210', latency: '12ms', status: 'healthy', change: 12.4 },
  { page: '/docs', views: '21,740', latency: '18ms', status: 'healthy', change: 8.1 },
  { page: '/components', views: '9,430', latency: '24ms', status: 'degraded', change: -3.2 },
  { page: '/themes', views: '3,908', latency: '21ms', status: 'healthy', change: 5.6 },
];

// ─── Shared renders ──────────────────────────────────────────────────────────
// Bento and Dashboard each hand-rolled a bar chart over BARS and a route cell
// over ROUTES, in two incompatible shapes. One of each lives here so a fixture
// change cannot land in one page and miss the other.

