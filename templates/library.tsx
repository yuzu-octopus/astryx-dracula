// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > (V[g=1] > Hd"Library"[level=1] + Tx"30 components across 5 categories"[t=body])) + (LC[p=6] > V[g=8] > (V[g=4] > TI"Search the stacks…" + (H[a=center g=3] > (SI[fill] > TgG"Filter" > OFL > Tg"All"! + Tg"Layout" + Tg"Forms" + Tg"Navigation" + Tg"Feedback" + Tg"Data") + DM"Sort")) + D + (V[g=8] > (H[j=between a=center] > Hd"Layout"[level=2] + Tx"6 items"[t=body]) + (G[c={min:280} g=4] > (C[p=0] > AR + (S.transparent[p=4] > V[g=1] > Hd"Card"[level=3] + Tx"Description"[t=supporting]))*4)))

/**
 * Library — a browsable grid of design-system entries grouped by category.  Frame: page header (title) | content column (search, filter row, s (Frame/responsive/container: see XLE header above.)
 */

import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Divider } from "@astryxdesign/core/Divider";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { OverflowList } from "@astryxdesign/core/OverflowList";
import { Section } from "@astryxdesign/core/Section";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Stack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ToggleButton, ToggleButtonGroup } from "@astryxdesign/core/ToggleButton";
import type { SceneHue } from "astryx-dracula/shared/scene-hues";
import { SceneTile } from "astryx-dracula/shared/scene-tile";
import { Search } from "lucide-react";
import { useState } from "react";

interface LibraryItem {
	id: string;
	name: string;
	description: string;
	category: string;
	type: "Component" | "Pattern" | "Utility";
}

// One Dracula accent per category shelf. Purple stays out of the map: it is
// reserved for interactive elements, and these hues only tint the thumbnail
// dot, so each shelf takes a non-purple accent instead.
const CATEGORY_HUES: Record<string, SceneHue> = {
	Layout: "var(--dracula-orange)",
	Forms: "var(--dracula-cyan)",
	Navigation: "var(--dracula-pink)",
	Feedback: "var(--dracula-yellow)",
	Data: "var(--dracula-green)",
};

const CATEGORIES = ["All", "Layout", "Forms", "Navigation", "Feedback", "Data"];

const ITEMS: LibraryItem[] = [
	{
		id: "1",
		name: "Stack",
		description: "Vertical and horizontal stack layouts with configurable gap and alignment.",
		category: "Layout",
		type: "Component",
	},
	{
		id: "2",
		name: "Grid",
		description: "Responsive grid container with auto-fit columns and gap control.",
		category: "Layout",
		type: "Component",
	},
	{
		id: "3",
		name: "Card",
		description: "Surface container with optional padding, border, and shadow variants.",
		category: "Layout",
		type: "Component",
	},
	{
		id: "4",
		name: "Center",
		description: "Centers its child both horizontally and vertically.",
		category: "Layout",
		type: "Utility",
	},
	{
		id: "5",
		name: "Section",
		description: "Semantic page section with optional heading and divider.",
		category: "Layout",
		type: "Pattern",
	},
	{
		id: "6",
		name: "Collapsible",
		description: "Expandable region with animated height transition.",
		category: "Layout",
		type: "Component",
	},
	{
		id: "7",
		name: "TextInput",
		description: "Single-line text field with label, placeholder, and validation states.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "8",
		name: "TextArea",
		description: "Multi-line text field with auto-resize and character count.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "9",
		name: "CheckboxInput",
		description: "Checkbox with label, indeterminate state, and group support.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "10",
		name: "RadioList",
		description: "Group of radio buttons with accessible fieldset wrapper.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "11",
		name: "Switch",
		description: "Toggle switch for binary on/off settings.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "12",
		name: "Selector",
		description: "Dropdown or inline option selector with single and multi-select modes.",
		category: "Forms",
		type: "Component",
	},
	{
		id: "13",
		name: "TabList",
		description: "Horizontal tab navigation with underline indicator and keyboard support.",
		category: "Navigation",
		type: "Component",
	},
	{
		id: "14",
		name: "TopNav",
		description: "Application top bar with logo, nav links, and action slots.",
		category: "Navigation",
		type: "Pattern",
	},
	{
		id: "15",
		name: "SideNav",
		description: "Vertical sidebar navigation with collapsible groups and active states.",
		category: "Navigation",
		type: "Pattern",
	},
	{
		id: "16",
		name: "Breadcrumbs",
		description: "Path trail navigation with separator and truncation support.",
		category: "Navigation",
		type: "Component",
	},
	{
		id: "17",
		name: "Pagination",
		description: "Page navigation with prev/next controls and page count display.",
		category: "Navigation",
		type: "Component",
	},
	{
		id: "18",
		name: "MobileNav",
		description: "Bottom tab bar for mobile viewports with icon and label slots.",
		category: "Navigation",
		type: "Pattern",
	},
	{
		id: "19",
		name: "Badge",
		description: "Compact label for status, count, or category with semantic color variants.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "20",
		name: "Banner",
		description: "Full-width alert bar for info, success, warning, and error messages.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "21",
		name: "Spinner",
		description: "Animated loading indicator with size and color variants.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "22",
		name: "ProgressBar",
		description: "Horizontal bar indicating task completion percentage.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "23",
		name: "StatusDot",
		description: "Small dot indicator for presence, health, or pipeline status.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "24",
		name: "Tooltip",
		description: "Contextual label that appears on hover with configurable placement.",
		category: "Feedback",
		type: "Component",
	},
	{
		id: "25",
		name: "Table",
		description: "Feature-rich data table with sorting, selection, and column resizing.",
		category: "Data",
		type: "Component",
	},
	{
		id: "26",
		name: "Avatar",
		description: "User profile image with fallback initials and status dot support.",
		category: "Data",
		type: "Component",
	},
	{
		id: "27",
		name: "Skeleton",
		description: "Placeholder shimmer for loading states matching content shapes.",
		category: "Data",
		type: "Utility",
	},
	{
		id: "28",
		name: "HoverCard",
		description: "Rich popover that appears on hover with arbitrary content.",
		category: "Data",
		type: "Component",
	},
	{
		id: "29",
		name: "PowerSearch",
		description: "Command-palette style search with grouped results and keyboard nav.",
		category: "Data",
		type: "Pattern",
	},
	{
		id: "30",
		name: "Typeahead",
		description: "Autocomplete input with async suggestion loading and selection.",
		category: "Data",
		type: "Component",
	},
];

// =============================================================================
// Side Nav
// =============================================================================

function LibraryCard({ item }: { item: LibraryItem }) {
	const hue = CATEGORY_HUES[item.category] ?? "var(--dracula-comment)";
	return (
		<Card padding={0}>
			<AspectRatio ratio={16 / 9}>
				<SceneTile label={`${item.name} thumbnail`} hue={hue} size="lg" />
			</AspectRatio>
			<Section variant="transparent" padding={4}>
				<VStack gap={1}>
					<Heading level={3}>{item.name}</Heading>
					<Text type="body" color="secondary">
						{item.description}
					</Text>
				</VStack>
			</Section>
		</Card>
	);
}

export default function LibraryGrid() {
	const [activeTab, setActiveTab] = useState("All");
	const [search, setSearch] = useState("");
	const [sortOrder, setSortOrder] = useState("A-Z");

	// ITEMS is module-static (only .filter over it and .sort over copies below),
	// so plain consts recompute cheaply per render with no memo needed.
	const query = search.trim().toLowerCase();
	const visible = activeTab === "All" ? ITEMS : ITEMS.filter((i) => i.category === activeTab);
	const searched = query
		? visible.filter(
				(i) => i.name.toLowerCase().includes(query) || i.description.toLowerCase().includes(query),
			)
		: visible;
	const filtered = [...searched];
	if (sortOrder === "A-Z") {
		filtered.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sortOrder === "Z-A") {
		filtered.sort((a, b) => b.name.localeCompare(a.name));
	} else if (sortOrder === "Newest") {
		filtered.sort((a, b) => Number(b.id) - Number(a.id));
	}

	let groupedSections: Array<{ category: string; items: LibraryItem[] }> | null = null;
	if (activeTab === "All") {
		const order = CATEGORIES.filter((c) => c !== "All");
		const byCategory: Record<string, LibraryItem[]> = {};
		for (const item of filtered) {
			const group = byCategory[item.category] ?? [];
			group.push(item);
			byCategory[item.category] = group;
		}
		groupedSections = [];
		for (const cat of order) {
			const items = byCategory[cat];
			if (items) {
				groupedSections.push({ category: cat, items });
			}
		}
	}

	return (
		<Layout
			height="fill"
			header={
				<LayoutHeader hasDivider padding={6}>
					<VStack gap={1}>
						<Heading level={1}>Library</Heading>
						<Text type="body" color="secondary">
							30 components across 5 categories
						</Text>
					</VStack>
				</LayoutHeader>
			}
			content={
				<LayoutContent padding={6}>
					<VStack gap={8}>
						<VStack gap={4}>
							<TextInput
								label="Search"
								isLabelHidden
								placeholder="Search the stacks…"
								value={search}
								onChange={setSearch}
								startIcon={Search}
								size="lg"
							/>
							<HStack vAlign="center" gap={3}>
								<StackItem size="fill">
									<VStack>
										<ToggleButtonGroup
											label="Filter by category"
											value={activeTab}
											onChange={(v) => setActiveTab(v ?? "All")}
										>
											<OverflowList
												gap={1}
												behavior="observeParent"
												overflowRenderer={(overflowItems) => (
													<DropdownMenu
														button={{
															label: `+${overflowItems.length}`,
															variant: "ghost",
															size: "lg",
														}}
														items={overflowItems.map(({ index }) => ({
															label: CATEGORIES[index],
															onClick: () => setActiveTab(CATEGORIES[index]),
														}))}
													/>
												)}
											>
												{CATEGORIES.map((cat) => (
													<ToggleButton key={cat} label={cat} value={cat} size="lg" />
												))}
											</OverflowList>
										</ToggleButtonGroup>
									</VStack>
								</StackItem>
								<DropdownMenu
									button={{ label: sortOrder, size: "lg" }}
									items={[
										{ label: "A-Z", onClick: () => setSortOrder("A-Z") },
										{ label: "Z-A", onClick: () => setSortOrder("Z-A") },
										{ label: "Newest", onClick: () => setSortOrder("Newest") },
									]}
								/>
							</HStack>
						</VStack>

						{filtered.length === 0 ? (
							<EmptyState
								icon={<Icon icon={Search} size="lg" color="secondary" />}
								title="Nothing stirs in the stacks"
								description="No entries match this search and filter. Clear them to browse the full library."
								actions={
									<Button
										label="Clear search & filters"
										variant="primary"
										onClick={() => {
											setSearch("");
											setActiveTab("All");
										}}
									/>
								}
							/>
						) : (
							<VStack gap={8}>
								{(groupedSections ?? [{ category: activeTab, items: filtered }]).flatMap(
									(section) => [
										<Divider key={`d-${section.category}`} />,
										<VStack key={section.category} gap={8}>
											<HStack justify="between" vAlign="center">
												<Heading level={2}>{section.category}</Heading>
												<Text type="body" color="secondary" hasTabularNumbers>
													{section.items.length} {section.items.length === 1 ? "item" : "items"}
												</Text>
											</HStack>
											<Grid columns={{ minWidth: 280 }} gap={4}>
												{section.items.map((item) => (
													<LibraryCard key={item.id} item={item} />
												))}
											</Grid>
										</VStack>,
									],
								)}
							</VStack>
						)}
					</VStack>
				</LayoutContent>
			}
		/>
	);
}
