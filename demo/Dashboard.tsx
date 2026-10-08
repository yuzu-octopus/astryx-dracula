import {
	Badge,
	Card,
	Grid,
	Heading,
	HStack,
	proportional,
	StatusDot,
	Table,
	Text,
	VStack,
} from "@astryxdesign/core";
import { DataBar } from "../shared/data-bar";
import { MetricDelta } from "../shared/metric-delta";
import { ROUTES, type RouteRow } from "./fixture-data";
import { RouteCell, TrafficChart } from "./fixtures";

function Kpi({
	label,
	value,
	delta,
	hint,
}: {
	label: string;
	value: string;
	delta: number;
	hint: string;
}) {
	const up = delta >= 0;
	return (
		<Card padding={4}>
			<VStack gap={2}>
				<Text type="supporting" color="secondary">
					{label}
				</Text>
				<HStack gap={2} vAlign="center">
					<Text type="display-3" weight="semibold" hasTabularNumbers>
						{value}
					</Text>
					<MetricDelta value={`${up ? "+" : ""}${delta}%`} positive={up} />
				</HStack>
				<Text type="supporting" color="secondary">
					{hint}
				</Text>
			</VStack>
		</Card>
	);
}

export function Dashboard() {
	return (
		<VStack gap={6}>
			<VStack gap={1}>
				<Heading level={2}>Observability Dashboard</Heading>
				<Text type="body" color="secondary">
					Dense telemetry, key indicators, and categorical data visualisations styled with Dracula
					tokens.
				</Text>
			</VStack>

			<Grid columns={{ minWidth: 220, max: 4 }} gap={3}>
				<Kpi label="Active Users" value="84.9k" delta={12.4} hint="vs last week" />
				<Kpi label="Total Page Views" value="312k" delta={8.1} hint="vs last week" />
				<Kpi label="Bounce Rate" value="31%" delta={-3.2} hint="vs last week" />
				<Kpi label="Design Adoption" value="72%" delta={21.0} hint="vs last week" />
			</Grid>

			<Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
				<Card padding={4}>
					<VStack gap={4}>
						<HStack justify="between" vAlign="center">
							<VStack gap={0.5}>
								<Heading level={3}>Traffic by Month</Heading>
								<Text type="supporting" color="secondary">
									Categorical spectral distribution
								</Text>
							</VStack>
							<Badge label="Categorical" variant="yellow" />
						</HStack>

						<Card
							padding={3}
							style={{
								backgroundColor: "var(--color-background)",
								border: "var(--border-width) solid var(--color-separator)",
							}}
						>
							<TrafficChart showValues />
						</Card>
					</VStack>
				</Card>

				<Card padding={4}>
					<VStack gap={4}>
						<HStack justify="between" vAlign="center">
							<VStack gap={0.5}>
								<Heading level={3}>Cluster Capacity</Heading>
								<Text type="supporting" color="secondary">
									Real-time resource allowances
								</Text>
							</VStack>
							<HStack gap={1.5} vAlign="center">
								<StatusDot variant="success" label="Healthy" isPulsing />
								<Text type="supporting" color="secondary">
									Operational
								</Text>
							</HStack>
						</HStack>

						<VStack gap={4}>
							{/* Quota/bandwidth/budget are magnitudes against a 0-100 domain,
                  not task completion, so they are DataBar and not core's
                  ProgressBar. See shared/data-bar.tsx for why. */}
							<DataBar
								label="Build minutes quota"
								segments={[{ id: "used", value: 62, color: "var(--color-data-categorical-green)" }]}
								hasValueLabel
								formatValue={(used) => `${used}% used`}
							/>
							<DataBar
								label="Network egress bandwidth"
								segments={[{ id: "used", value: 38, color: "var(--color-data-categorical-green)" }]}
								hasValueLabel
								formatValue={(used) => `${used}% used`}
							/>
							<DataBar
								label="Monthly error budget"
								// No --color-data-categorical-yellow ships. Nearest real one is
								// the ramp's step 2, #F0F980, 2.5 L from the spec yellow
								// #F1FA8C; the DataBar contract admits a --color-data-<family>-N
								// step as well as a categorical.
								segments={[{ id: "used", value: 91, color: "var(--color-data-yellow-2)" }]}
								hasValueLabel
								formatValue={(used) => `${used}% used`}
							/>
							<DataBar
								label="Memory pool allocation"
								segments={[{ id: "used", value: 45, color: "var(--color-data-categorical-green)" }]}
								hasValueLabel
								formatValue={(used) => `${used}% used`}
							/>
						</VStack>

						<Card
							padding={3}
							style={{
								backgroundColor: "var(--color-background)",
								border: "var(--border-width) solid var(--color-separator)",
							}}
						>
							<HStack justify="between" vAlign="center">
								<VStack gap={0.5}>
									<Text weight="semibold">SLA Guarantee: 99.98%</Text>
									<Text type="supporting" color="secondary">
										32 edge regions · zero dropped connections
									</Text>
								</VStack>
								<Badge label="Compliant" variant="green" />
							</HStack>
						</Card>
					</VStack>
				</Card>
			</Grid>

			<Card padding={4}>
				<VStack gap={3}>
					<HStack justify="between" vAlign="center">
						<VStack gap={0.5}>
							<Heading level={3}>Top Routes</Heading>
							<Text type="supporting" color="secondary">
								Edge routing throughput and p99 response times
							</Text>
						</VStack>
						<Badge label="5 endpoints" variant="neutral" />
					</HStack>

					<Table
						data={ROUTES}
						idKey="page"
						hasHover
						density="balanced"
						columns={[
							{
								key: "page",
								header: "Route",
								width: proportional(2),
								renderCell: (row) => <RouteCell row={row as RouteRow} />,
							},
							{
								key: "views",
								header: "Views",
								width: proportional(1),
								align: "end",
								renderCell: (row) => <Text hasTabularNumbers>{String(row.views)}</Text>,
							},
							{
								key: "latency",
								header: "p99 Latency",
								width: proportional(1),
								align: "end",
								renderCell: (row) => (
									<Text type="code" color="secondary">
										{String(row.latency)}
									</Text>
								),
							},
							{
								key: "change",
								header: "Trend",
								width: proportional(1),
								align: "end",
								renderCell: (row) => {
									const num = row.change as number;
									const up = num >= 0;
									return <MetricDelta value={`${up ? "+" : ""}${num.toFixed(1)}%`} positive={up} />;
								},
							},
						]}
					/>
				</VStack>
			</Card>
		</VStack>
	);
}
