// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
// NOTE on `t=display-2`: the h1 asked for display-2 from the start, but
// core 0.3.0's Heading emitted no `data-type`, and the 0.3.0 CLI emitted no
// `.astryx-heading[data-type]` rule, so --text-display-2-size never reached a
// heading and the 24px level-1 default leaked through. core+CLI 0.6.3 restored
// the path, so this title now renders at its declared 35px. Verified by
// pixel-diffing the pre-upgrade build against this one at 1440 and 390: the
// only regression was this header detaching at 390, fixed by stacking the
// title group under `isNarrow`.
//   L > (LH > H[g3 a=center] > (H[g2 a=center] > Hd"Night watch"[level=1 t=display-2] + Tx"3 investigating"[t=supporting]) + SegmentedControl"Filter by status" + B"Declare incident") + (LC[p0] > V[g0] > (H > PowerSearch"Search the night watch…") + (List > (ListItem)*7)) + (LayoutPanel[w380 p0] > V[g4] > (V[g2] > (H[g2 a=center] > StatusDot + Tx"INC-2417"[t=supporting] + Token"Investigating") + Hd"Checkout API elevated 5xx rate"[level=2]) + (H[g2] > B.primary"Mark mitigated" + B.secondary"Escalate") + Divider + MetadataList + Divider + (V[g2] > Hd"Timeline"[level=3] + List))

/**
 * Incident Console — an on-call incident response tool for the night watch.  Frame-first layout (see `bunx astryx docs layout`), distilled fro (Frame/responsive/container: see XLE header above.)
 */

import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Icon } from "@astryxdesign/core/Icon";
import {
	HStack,
	Layout,
	LayoutContent,
	LayoutHeader,
	LayoutPanel,
	StackItem,
	VStack,
} from "@astryxdesign/core/Layout";
import { List, ListItem } from "@astryxdesign/core/List";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import type { PowerSearchFilter } from "@astryxdesign/core/PowerSearch";
import { PowerSearch, usePowerSearchConfig } from "@astryxdesign/core/PowerSearch";
import { ResizeHandle, useResizable } from "@astryxdesign/core/Resizable";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Timestamp } from "@astryxdesign/core/Timestamp";
import { Token } from "@astryxdesign/core/Token";
// ============= ICONS (verified lucide-react exports) =============
// BellRing ← BellAlertIcon, Plus ← PlusIcon.
import { BellRing, Plus } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";

const styles: Record<string, CSSProperties> = {
	contentFill: {
		height: "100%",
		minHeight: 0,
	},
	searchRow: {
		padding: "var(--spacing-3)",
	},
	groupHeader: {
		padding: "var(--spacing-2) var(--spacing-3)",
		backgroundColor: "var(--color-background-muted)",
	},
	// All FOUR edges, not block-only. With `overflowY: auto` and no `overflowX`,
	// the inline axis computes to `auto` too, so this box clips horizontally as
	// well as vertically. A block-only padding lands green and still leaves the
	// inline half of the ring clipped.
	rows: {
		overflowY: "auto",
		minHeight: 0,
		padding: "var(--spacing-1)",
	},
	inspector: {
		padding: "var(--spacing-4)",
		height: "100%",
	},
	controlsRow: {
		// The four-option filter plus the action never fit a phone header; the
		// row scrolls instead of clipping options the pointer cannot reach.
		overflowX: "auto",
	},
};

type Severity = "sev1" | "sev2" | "sev3";
type Status = "investigating" | "mitigated" | "resolved";

interface TimelineEvent {
	at: string;
	label: string;
	detail: string;
}

interface Incident extends Record<string, unknown> {
	id: string;
	title: string;
	service: string;
	severity: Severity;
	status: Status;
	commander: string;
	startedAt: string;
	impact: string;
	timeline: TimelineEvent[];
}

// Deterministic fixtures: fixed ISO timestamps, no clocks, no randomness.
const INCIDENTS: Incident[] = [
	{
		id: "INC-2417",
		title: "Checkout API elevated 5xx rate",
		service: "checkout-api",
		severity: "sev1",
		status: "investigating",
		commander: "Priya Raman",
		startedAt: "2026-06-30T21:14:00Z",
		impact: "12% of checkout requests failing in us-east",
		timeline: [
			{
				at: "2026-06-30T21:14:00Z",
				label: "Incident declared",
				detail: "Paging monitor: checkout-api 5xx > 5% for 10m",
			},
			{
				at: "2026-06-30T21:19:00Z",
				label: "Commander assigned",
				detail: "Priya Raman took command",
			},
			{
				at: "2026-06-30T21:31:00Z",
				label: "Suspect identified",
				detail: "Deploy 8f31c2 correlates with error onset",
			},
		],
	},
	{
		id: "INC-2416",
		title: "Search indexing lag above 30 minutes",
		service: "search-indexer",
		severity: "sev2",
		status: "investigating",
		commander: "Marcus Webb",
		startedAt: "2026-06-30T19:42:00Z",
		impact: "New listings not searchable; stale results served",
		timeline: [
			{
				at: "2026-06-30T19:42:00Z",
				label: "Incident declared",
				detail: "Indexing lag alarm crossed 30m threshold",
			},
			{
				at: "2026-06-30T20:05:00Z",
				label: "Mitigation attempted",
				detail: "Doubled indexer worker pool; lag still climbing",
			},
		],
	},
	{
		id: "INC-2415",
		title: "Webhook delivery retries exhausting queue",
		service: "webhooks",
		severity: "sev3",
		status: "investigating",
		commander: "Ana Duarte",
		startedAt: "2026-06-30T18:20:00Z",
		impact: "Third-party webhook delivery delayed up to 15m",
		timeline: [
			{
				at: "2026-06-30T18:20:00Z",
				label: "Incident declared",
				detail: "Queue depth alarm on webhook-delivery",
			},
		],
	},
	{
		id: "INC-2414",
		title: "Payments settlement job stalled",
		service: "payments",
		severity: "sev1",
		status: "mitigated",
		commander: "Priya Raman",
		startedAt: "2026-06-30T14:03:00Z",
		impact: "Settlement batch delayed; no customer-visible impact",
		timeline: [
			{
				at: "2026-06-30T14:03:00Z",
				label: "Incident declared",
				detail: "Settlement job heartbeat missed twice",
			},
			{
				at: "2026-06-30T14:26:00Z",
				label: "Mitigated",
				detail: "Job restarted on standby worker; batch draining",
			},
		],
	},
	{
		id: "INC-2413",
		title: "CDN cache hit ratio degraded in eu-west",
		service: "edge-cdn",
		severity: "sev2",
		status: "mitigated",
		commander: "Tom Okafor",
		startedAt: "2026-06-30T11:47:00Z",
		impact: "Origin load 3x baseline; p95 latency +180ms in EU",
		timeline: [
			{
				at: "2026-06-30T11:47:00Z",
				label: "Incident declared",
				detail: "Cache hit ratio dropped below 80%",
			},
			{
				at: "2026-06-30T12:12:00Z",
				label: "Mitigated",
				detail: "Rolled back cache-key config change",
			},
		],
	},
	{
		id: "INC-2412",
		title: "Login rate limiting misfiring for SSO users",
		service: "auth",
		severity: "sev2",
		status: "resolved",
		commander: "Ana Duarte",
		startedAt: "2026-06-29T22:31:00Z",
		impact: "SSO users intermittently blocked at login",
		timeline: [
			{
				at: "2026-06-29T22:31:00Z",
				label: "Incident declared",
				detail: "Support surge: SSO login failures",
			},
			{
				at: "2026-06-29T23:02:00Z",
				label: "Mitigated",
				detail: "Raised limiter threshold for SSO IdP ranges",
			},
			{
				at: "2026-06-30T09:15:00Z",
				label: "Resolved",
				detail: "Limiter keying fixed to per-user; monitors green 8h",
			},
		],
	},
	{
		id: "INC-2411",
		title: "Notification digests sent twice",
		service: "notifications",
		severity: "sev3",
		status: "resolved",
		commander: "Marcus Webb",
		startedAt: "2026-06-29T08:12:00Z",
		impact: "Duplicate daily digest for ~40k users",
		timeline: [
			{
				at: "2026-06-29T08:12:00Z",
				label: "Incident declared",
				detail: "Duplicate-send reports from support",
			},
			{
				at: "2026-06-29T10:40:00Z",
				label: "Resolved",
				detail: "Dedup key restored in scheduler; backfill verified",
			},
		],
	},
];

const STATUS_ORDER: Status[] = ["investigating", "mitigated", "resolved"];

// One union: label for group headings + row tokens, color for row tokens.
// SEVERITY_DOT stays separate — it keys on severity (sev1/2/3), a different
// axis than status, so merging would conflate two domains in one map.
const STATUS: Record<Status, { label: string; tokenColor: "cyan" | "yellow" | "green" }> = {
	investigating: { label: "Investigating", tokenColor: "cyan" },
	mitigated: { label: "Mitigated", tokenColor: "yellow" },
	resolved: { label: "Resolved", tokenColor: "green" },
};

const SEVERITY_DOT: Record<Severity, "error" | "warning" | "neutral"> = {
	sev1: "error",
	sev2: "warning",
	sev3: "neutral",
};

// SEV badge shared by rows and the inspector: dot + uppercase word travel
// together (a bare dot leaves SEV1/2/3 as hue alone; StatusDot's label is
// aria-only on a role="img" span and paints nothing).
function SeverityBadge({
	severity,
	isPulsing = false,
}: {
	severity: Severity;
	isPulsing?: boolean;
}) {
	return (
		<HStack gap={1} vAlign="center">
			<StatusDot
				variant={SEVERITY_DOT[severity]}
				label={severity.toUpperCase()}
				isPulsing={isPulsing}
			/>
			<Text type="supporting" color="secondary">
				{severity.toUpperCase()}
			</Text>
		</HStack>
	);
}

const SERVICE_VALUES = [
	{ value: "checkout-api", label: "checkout-api" },
	{ value: "search-indexer", label: "search-indexer" },
	{ value: "webhooks", label: "webhooks" },
	{ value: "payments", label: "payments" },
	{ value: "edge-cdn", label: "edge-cdn" },
	{ value: "auth", label: "auth" },
	{ value: "notifications", label: "notifications" },
];

const SEVERITY_VALUES = [
	{ value: "sev1", label: "SEV1" },
	{ value: "sev2", label: "SEV2" },
	{ value: "sev3", label: "SEV3" },
];

const fieldDefs = [
	{ key: "title", type: "string", label: "Title" },
	{ key: "service", type: "enum", label: "Service", enumValues: SERVICE_VALUES },
	{
		key: "severity",
		type: "enum",
		label: "Severity",
		enumValues: SEVERITY_VALUES,
	},
	{ key: "commander", type: "string", label: "Commander" },
] as const;

function IncidentRows({
	incidents,
	selectedId,
	onSelect,
}: {
	incidents: Incident[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}) {
	const groups = STATUS_ORDER.map((status) => ({
		status,
		items: incidents.filter((incident) => incident.status === status),
	})).filter((group) => group.items.length > 0);

	if (groups.length === 0) {
		return (
			<EmptyState
				title="Quiet in the crypt"
				description="No incidents match. Adjust the status filter or clear search filters."
				icon={<Icon icon={BellRing} size="lg" color="secondary" />}
			/>
		);
	}

	return (
		<VStack gap={0}>
			{groups.map((group) => (
				<VStack gap={0} key={group.status}>
					<HStack gap={2} vAlign="center" style={styles.groupHeader}>
						{/* Primary, not secondary: --color-text-secondary #9AA1BC on
                --color-background-muted #44475A is 3.57:1, under the 4.5:1
                floor. The group heading is the string this sidebar is scanned
                for. Hierarchy comes from the two type roles (principle 6),
                not from dimming the count. */}
						<Text type="label">{STATUS[group.status].label}</Text>
						<Text type="supporting" hasTabularNumbers>
							{group.items.length}
						</Text>
					</HStack>
					<List density="compact" hasDividers>
						{group.items.map((incident) => (
							<ListItem
								key={incident.id}
								label={incident.title}
								description={`${incident.id} · ${incident.service} · ${incident.impact}`}
								startContent={
									<SeverityBadge
										severity={incident.severity}
										isPulsing={incident.status === "investigating"}
									/>
								}
								endContent={
									<HStack gap={3} vAlign="center">
										<Token
											size="sm"
											color={STATUS[incident.status].tokenColor}
											label={STATUS[incident.status].label}
										/>
										<Timestamp value={incident.startedAt} format="relative" color="secondary" />
									</HStack>
								}
								onClick={() => onSelect(incident.id)}
								isSelected={incident.id === selectedId}
							/>
						))}
					</List>
				</VStack>
			))}
		</VStack>
	);
}

function IncidentInspector({ incident }: { incident: Incident }) {
	const nextAction =
		incident.status === "investigating"
			? "Mark mitigated"
			: incident.status === "mitigated"
				? "Resolve"
				: "Reopen";

	return (
		<VStack gap={4} style={styles.inspector}>
			<VStack gap={2}>
				<HStack gap={1} vAlign="center">
					<SeverityBadge
						severity={incident.severity}
						isPulsing={incident.status === "investigating"}
					/>
					<Text type="supporting" color="secondary">
						{incident.id}
					</Text>
					<Token
						size="sm"
						color={STATUS[incident.status].tokenColor}
						label={STATUS[incident.status].label}
					/>
				</HStack>
				<Heading level={2}>{incident.title}</Heading>
			</VStack>

			<HStack gap={2} wrap="wrap">
				<Button label={nextAction} variant="primary" />
				<Button label="Escalate" variant="secondary" />
			</HStack>

			<Divider />

			<MetadataList columns="single" label={{ position: "start", width: 96 }}>
				<MetadataListItem label="Service">
					<Text type="body">{incident.service}</Text>
				</MetadataListItem>
				<MetadataListItem label="Severity">
					<Text type="body">{incident.severity.toUpperCase()}</Text>
				</MetadataListItem>
				<MetadataListItem label="Commander">
					<Text type="body">{incident.commander}</Text>
				</MetadataListItem>
				<MetadataListItem label="Started">
					<Timestamp value={incident.startedAt} format="date_time" />
				</MetadataListItem>
				<MetadataListItem label="Impact">
					<Text type="body">{incident.impact}</Text>
				</MetadataListItem>
			</MetadataList>

			<Divider />

			<VStack gap={2}>
				<Heading level={3}>Timeline</Heading>
				<List density="compact">
					{incident.timeline.map((event) => (
						<ListItem
							key={`${event.at}-${event.label}`}
							label={event.label}
							description={event.detail}
							endContent={<Timestamp value={event.at} format="time" color="secondary" />}
						/>
					))}
				</List>
			</VStack>
		</VStack>
	);
}

export default function IncidentConsole() {
	const [statusFilter, setStatusFilter] = useState("all");
	const [filters, setFilters] = useState<PowerSearchFilter[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(INCIDENTS[0].id);
	const { config, applyFilters } = usePowerSearchConfig(fieldDefs, "Incidents");

	// Responsive contract: the inspector is hidden at <= 1024px so the row
	// list keeps its full width (never compress dense rows).
	const isNarrow = useMediaQuery("(max-width: 1024px)");

	const inspectorPanel = useResizable({
		defaultSize: 380,
		minSize: 320,
		maxSize: 480,
	});

	const visible = useMemo(() => {
		const searched = applyFilters(filters, INCIDENTS);
		return statusFilter === "all"
			? searched
			: searched.filter((incident) => incident.status === statusFilter);
	}, [filters, applyFilters, statusFilter]);

	const selected = visible.find((incident) => incident.id === selectedId) ?? null;

	const openCount = INCIDENTS.filter((incident) => incident.status === "investigating").length;

	// Extracted so a narrow header can drop them onto their own scrollable row
	// instead of squeezing the title, the filter and the action into one line.
	const statusFilterControl = (
		<SegmentedControl
			label="Filter by status"
			value={statusFilter}
			onChange={setStatusFilter}
			size="sm"
		>
			<SegmentedControlItem label="All" value="all" />
			<SegmentedControlItem label="Investigating" value="investigating" />
			<SegmentedControlItem label="Mitigated" value="mitigated" />
			<SegmentedControlItem label="Resolved" value="resolved" />
		</SegmentedControl>
	);
	const declareButton = <Button label="Declare incident" icon={<Icon icon={Plus} size="sm" />} />;
	// Stacks below 1024px. The H1 asks for `display-2` (35px), which is the
	// theme's own declared value but only started rendering in core 0.6.3 —
	// see the note in the XLE header. At 35px the title wraps to two lines on a
	// phone, and the counter beside it then wraps too and detaches into the
	// corner. Stacking keeps the counter on the title's own line at any width
	// the title needs more than one, and costs nothing at desktop.
	const titleGroup = (
		<HStack gap={2} vAlign="center" wrap="wrap">
			<Heading level={1} type="display-2">
				Night watch
			</Heading>
			<Text type="supporting" color="secondary" hasTabularNumbers>
				{openCount} investigating
			</Text>
		</HStack>
	);

	return (
		<Layout
			height="fill"
			header={
				<LayoutHeader hasDivider padding={6}>
					{isNarrow ? (
						<VStack gap={2}>
							{titleGroup}
							<HStack
								gap={2}
								vAlign="center"
								style={styles.controlsRow}
								tabIndex={0}
								role="region"
								aria-label="Incident filter actions"
							>
								{statusFilterControl}
								{declareButton}
							</HStack>
						</VStack>
					) : (
						<HStack gap={3} vAlign="center">
							<StackItem size="fill">{titleGroup}</StackItem>
							{statusFilterControl}
							{declareButton}
						</HStack>
					)}
				</LayoutHeader>
			}
			content={
				<LayoutContent padding={0} isScrollable={false}>
					<VStack gap={0} style={styles.contentFill}>
						<HStack style={styles.searchRow}>
							<StackItem size="fill">
								<PowerSearch
									config={config}
									filters={filters}
									onChange={(newFilters) => setFilters([...newFilters])}
									placeholder="Search the night watch…"
									resultCount={visible.length}
								/>
							</StackItem>
						</HStack>
						<StackItem
							size="fill"
							style={styles.rows}
							tabIndex={0}
							role="region"
							aria-label="Incident rows"
						>
							<IncidentRows
								incidents={visible}
								selectedId={selected?.id ?? null}
								onSelect={setSelectedId}
							/>
						</StackItem>
					</VStack>
				</LayoutContent>
			}
			end={
				isNarrow ? undefined : (
					<>
						<ResizeHandle
							direction="horizontal"
							hasDivider
							isAlwaysVisible={false}
							resizable={inspectorPanel.props}
							label="Resize inspector"
						/>
						<LayoutPanel width={inspectorPanel.size} padding={0} label="Incident details">
							{selected ? (
								<IncidentInspector incident={selected} />
							) : (
								<EmptyState
									title="No incident under the lens"
									description="Select an incident from the rows to inspect its timeline."
									icon={<Icon icon={BellRing} size="lg" color="secondary" />}
									isCompact
								/>
							)}
						</LayoutPanel>
					</>
				)
			}
		/>
	);
}
