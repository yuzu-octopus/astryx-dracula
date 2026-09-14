// Shared demo fixtures: the single source for the traffic chart and route
// table rendered by both Dashboard and Bento. Colors are Dracula token vars.
export const BARS = [
  { month: 'Jan', value: 42, color: 'var(--dracula-purple)' },
  { month: 'Feb', value: 68, color: 'var(--dracula-pink)' },
  { month: 'Mar', value: 55, color: 'var(--dracula-cyan)' },
  { month: 'Apr', value: 90, color: 'var(--dracula-green)' },
  { month: 'May', value: 74, color: 'var(--dracula-yellow)' },
  { month: 'Jun', value: 61, color: 'var(--dracula-orange)' },
  { month: 'Jul', value: 83, color: 'var(--dracula-red)' },
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
