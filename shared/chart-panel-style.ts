// The one chart-panel look, shared by every hand-drawn SVG chart panel in the
// kit (dashboard, portfolio, chart, heatmap-status, shoe-store). Split from
// shared/revenue-chart.tsx so that file exports only components and React Fast
// Refresh stays intact; see shared/scene-hues.ts for the same reason.
import type { CSSProperties } from "react";

// One chart-panel look for every hand-drawn SVG chart panel in this wave's
// templates (dashboard, portfolio, chart, heatmap-status, shoe-store). Restate
// nowhere: theme Card variant work lands in wave 2.
export const CHART_PANEL_STYLE: CSSProperties = {
	backgroundColor: "var(--color-background)",
	border: "var(--border-width) solid var(--color-separator)",
};
