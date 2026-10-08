// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   TN"Nocturne" + (S[p6] > V[g10] > (Ctr > V[g4 a=center] > Hd"Little haunts"[level=1 type=display-2] + Tx"We believe"[t=body]) + (G[c={min:200,max:3} g4] > (C[p0] > AR + V[g2 a=center] > Bd + Hd"Product"[level=2] + Tx"Description"[t=body] + (H[g2] > NI + B"Add to cart"))*3)) + (V[g8] > (C[p0] > Hd"Night Owl AI"[level=2]) + (G[c={min:200} g4] > (GS[c=3] > C > T) + (GS[c=1] > C > Hd"Revenue"[level=2])))

/**
 * Theme Showcase — the storefront page each theme is previewed against, and the only template that is deliberately shell-less: it paints its o (Frame/responsive/container: see XLE header above.)
 */

import { useAppShellMobile } from "@astryxdesign/core/AppShell";
import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Badge } from "@astryxdesign/core/Badge";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import {
	ChatComposer,
	ChatMessage,
	ChatMessageBubble,
	ChatMessageList,
	ChatSystemMessage,
} from "@astryxdesign/core/Chat";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid, GridSpan } from "@astryxdesign/core/Grid";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Item } from "@astryxdesign/core/Item";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { MoreMenu } from "@astryxdesign/core/MoreMenu";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { OverflowList } from "@astryxdesign/core/OverflowList";
import { Section } from "@astryxdesign/core/Section";
import { Selector } from "@astryxdesign/core/Selector";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import type { TableColumn } from "@astryxdesign/core/Table";
import { pixel, proportional, Table } from "@astryxdesign/core/Table";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { ProductSwatch } from "astryx-dracula/shared/revenue-chart";
import { SceneFrame } from "astryx-dracula/shared/scene-frame";
import type { SceneHue } from "astryx-dracula/shared/scene-hues";
import {
	Banknote,
	Download,
	Folder,
	LayoutGrid,
	List,
	MapPin,
	Mic,
	Plus,
	Search,
	ShoppingBag,
	Tag,
	User,
	X,
} from "lucide-react";
import type { ReactNode } from "react";

// One Dracula accent per hero product slot. Purple stays off decorative art:
// it reads as interactive, and nothing here is tappable.
const PRODUCT_HUES = ["var(--dracula-green)", "var(--dracula-cyan)", "var(--dracula-yellow)"];

// Grid recipes the store renders at every width above the phone layout. Kept
// at module scope: an object literal rebuilt per render is a new value prop
// every time.
const SHOWCASE_COLUMNS = { minWidth: 200, repeat: "fit" } as const;
const PRODUCT_COLUMNS = { minWidth: 200, max: 3 } as const;

/** Categorical badge variants usable for showcase product/inventory tags. */
export type ShowcaseBadgeVariant =
	| "blue"
	| "cyan"
	| "green"
	| "orange"
	| "pink"
	| "purple"
	| "red"
	| "teal"
	| "yellow";

export interface ProductSpec {
	name: string;
	description: string;
	badge: string;
	badgeVariant: ShowcaseBadgeVariant;
}

const DEFAULT_PRODUCTS: ProductSpec[] = [
	{
		name: "Moonphase Watch",
		description: "Clean lines and lume that carry through the longest night.",
		badge: "New",
		badgeVariant: "cyan",
	},
	{
		name: "Night-Owl Headphones",
		description: "Deep sound and soft cushions for all-night listening.",
		badge: "Popular",
		badgeVariant: "green",
	},
	{
		name: "Coven Canvas Backpack",
		description: "Waxed canvas with a quiet, moonlit profile.",
		badge: "Limited",
		badgeVariant: "yellow",
	},
];

// Dracula product scene: harvest moon over sleeping hills with a per-product
// accent glyph. All fills are brand vars, corners rx=4.
function ProductArt({ hue, label }: { hue: string; label: string }) {
	return (
		<SceneFrame
			label={`${label} artwork`}
			viewBox="0 0 400 300"
			fill="var(--dracula-bg-light)"
			hasBackdrop={false}
		>
			<rect width="400" height="300" fill="var(--dracula-bg-light)" />
			<circle cx="200" cy="110" r="52" fill={hue} opacity={0.9} />
			<circle cx="184" cy="100" r={44} fill="var(--dracula-bg-light)" opacity={0.55} />
			<path d="M0 210 Q120 170 240 200 T400 190 V300 H0 Z" fill="var(--dracula-current-line)" />
			<path d="M0 245 Q140 215 300 240 T400 235 V300 H0 Z" fill="var(--dracula-bg)" />
			<g
				transform="translate(200 232)"
				fill="none"
				stroke={hue}
				strokeWidth="5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="-30" y="-30" width="60" height="60" rx={4} />
				<circle cx="13" cy="-13" r="2.5" fill={hue} stroke="none" />
				<path d="M-22 20 L-5 2 L7 12 L14 5 L23 15" />
			</g>
		</SceneFrame>
	);
}

// Default export is the route page (sandbox renders this as a Next.js page, so
// it must take no props / satisfy PageProps). The store is hardcoded to the
// nocturne products and inventory: nothing outside this file passes products
// or inventory in, so the props/store split bought indirection for zero
// callers.
export default function ThemeShowcase() {
	const { isMobile } = useAppShellMobile();
	return (
		<VStack gap={0} minHeight="100%" style={{ backgroundColor: "var(--color-background-body)" }}>
			<StorePreview products={DEFAULT_PRODUCTS} isMobile={isMobile} />
			<VStack gap={0} padding={6} style={{ backgroundColor: "var(--color-background-surface)" }}>
				<CardShowcase inventory={DEFAULT_INVENTORY} isMobile={isMobile} />
			</VStack>
		</VStack>
	);
}

function CardShowcase({ inventory, isMobile }: { inventory: InventoryRow[]; isMobile: boolean }) {
	const columns = isMobile ? 1 : SHOWCASE_COLUMNS;

	return (
		<VStack gap={8}>
			<ChatCard />
			<Grid columns={columns} gap={4}>
				<GridSpan columns={isMobile ? 1 : 3}>
					<InventoryCard inventory={inventory} />
				</GridSpan>
				<GridSpan columns={1}>
					<LatestActivityCard isMobile={isMobile} />
				</GridSpan>
			</Grid>
		</VStack>
	);
}

function StorePreview({ products, isMobile }: { products: ProductSpec[]; isMobile: boolean }) {
	// Shell-less preview: no AppShell above means the host context always
	// reports desktop, so the nav reads the real viewport instead.
	const isNarrowViewport = useMediaQuery("(max-width: 640px)");
	const collapseNav = isMobile || isNarrowViewport;
	return (
		<VStack gap={0} data-theme-preview="true">
			<VStack gap={0}>
				<TopNav
					label="Theme preview navigation"
					heading={<TopNavHeading heading="Nocturne" />}
					centerContent={
						collapseNav ? undefined : (
							<>
								<TopNavItem label="Shop" href="#/templates/theme-showcase" isSelected />
								<TopNavItem label="New In" href="#/templates/theme-showcase" />
								<TopNavItem label="Stories" href="#/templates/theme-showcase" />
								<TopNavItem label="Help" href="#/templates/theme-showcase" />
							</>
						)
					}
					endContent={
						collapseNav ? (
							<Button
								label="Cart"
								tooltip="Cart"
								variant="ghost"
								isIconOnly
								icon={<ShoppingBag size={20} />}
								href="#/templates/theme-showcase"
							/>
						) : (
							<HStack gap={2} vAlign="center">
								<HStack gap={0.5}>
									<Button
										label="Search"
										tooltip="Search"
										variant="ghost"
										isIconOnly
										icon={<Search size={20} />}
										href="#/templates/theme-showcase"
									/>
									<Button
										label="Account"
										tooltip="Account"
										variant="ghost"
										isIconOnly
										icon={<User size={20} />}
										href="#/templates/theme-showcase"
									/>
									<Button
										label="Cart"
										tooltip="Cart"
										variant="ghost"
										isIconOnly
										icon={<ShoppingBag size={20} />}
										href="#/templates/theme-showcase"
									/>
								</HStack>
								<Button label="Sign in" variant="primary" href="#/templates/theme-showcase" />
							</HStack>
						)
					}
				/>

				<Section padding={6} variant="transparent">
					<VStack
						gap={10}
						maxWidth={880}
						width="100%"
						style={{ marginInline: "auto", minWidth: 0 }}
					>
						<Center>
							<VStack gap={4} hAlign="center" maxWidth={560}>
								<Heading level={1} type="display-2" justify="center">
									Little haunts,
									<br />
									everywhere you roam
								</Heading>
								<Text type="body" color="secondary" justify="center">
									We believe the smallest shadows are the ones that matter most. Turn an ordinary
									evening into something worth remembering.
								</Text>
							</VStack>
						</Center>

						<Grid columns={isMobile ? 1 : PRODUCT_COLUMNS} gap={4}>
							{products.map((p, i) => (
								<Card key={p.name} padding={0} height="100%">
									<VStack gap={0} height="100%">
										<AspectRatio ratio={1}>
											<ProductArt hue={PRODUCT_HUES[i % PRODUCT_HUES.length]} label={p.name} />
										</AspectRatio>
										<VStack gap={2} hAlign="center" padding={4} style={{ flex: 1 }}>
											<HStack>
												<Badge label={p.badge} variant={p.badgeVariant} />
											</HStack>
											<Heading level={2} justify="center">
												{p.name}
											</Heading>
											<Text type="body" color="secondary" justify="center" style={{ flex: 1 }}>
												{p.description}
											</Text>
											<HStack gap={2} vAlign="center" hAlign="center">
												<NumberInput
													label="Quantity"
													isLabelHidden
													value={1}
													onChange={() => {}}
													min={1}
													max={99}
													size="sm"
													// minWidth (not a hard width) so the field grows to
													// fit the digit + the theme's input padding. A fixed
													// 40px was too tight on themes with larger padding /
													// bigger type scale (e.g. Matcha, Y2K), clipping the
													// value.
													style={{ minWidth: 64, flexShrink: 0 }}
												/>
												<Button
													label="Add to cart"
													variant="secondary"
													size="sm"
													href="#/templates/theme-showcase"
													style={{ flex: 1 }}
												/>
											</HStack>
										</VStack>
									</VStack>
								</Card>
							))}
						</Grid>
					</VStack>
				</Section>
			</VStack>
		</VStack>
	);
}

const SUGGESTED_QUESTIONS = ["Reschedule delivery", "Update shipping address", "Start a return"];

function ChatCard() {
	return (
		<Card
			padding={0}
			style={{
				backgroundColor: "var(--color-background-surface)",
				color: "var(--color-text-primary)",
				minWidth: 0,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<HStack hAlign="between" vAlign="center" gap={3} paddingBlock={4} paddingInline={4}>
				<Heading level={2}>Night Owl AI</Heading>

				<HStack gap={1} vAlign="center">
					<Button
						variant="ghost"
						size="sm"
						isIconOnly
						label="Export conversation"
						tooltip="Export conversation"
						icon={<Download size={16} />}
					/>
					<Button
						variant="ghost"
						size="sm"
						isIconOnly
						label="Close chat"
						tooltip="Close chat"
						icon={<X size={16} />}
					/>
				</HStack>
			</HStack>

			<Divider variant="subtle" />

			<VStack
				gap={0}
				isScrollable={false}
				tabIndex={0}
				role="region"
				aria-label="Night Owl chat messages"
				style={{
					flex: 1,
					minHeight: 0,
					// The message region is the scroll owner: the card is stretched to the
					// grid row height, so longer conversations must scroll here rather than
					// clip against the card.
					overflowY: "auto",
				}}
			>
				<ChatMessageList>
					<ChatSystemMessage>Today</ChatSystemMessage>

					<ChatMessage sender="user">
						<ChatMessageBubble variant="filled">Where's my order?</ChatMessageBubble>
					</ChatMessage>

					<ChatMessage sender="assistant">
						<VStack gap={3}>
							<Text type="body">
								Your order #1043 (the Moonphase Watch and Belfry Throw) shipped this morning from
								the courier-raven roost and is currently in transit with courier-raven. It's on
								track to arrive at your address by end of day tomorrow.
							</Text>
							<Text type="body">
								Let me know if you'd like to reschedule the delivery, redirect it to a pickup point,
								or start a return once it arrives.
							</Text>
						</VStack>
					</ChatMessage>

					<ChatMessage sender="user">
						<ChatMessageBubble variant="filled">
							Can you show me the full details?
						</ChatMessageBubble>
					</ChatMessage>

					<ChatMessage sender="assistant">
						<VStack gap={3}>
							<Text type="body">Here's everything I have on order #1043:</Text>
							<Card padding={3}>
								<VStack gap={1}>
									<Item
										label="Items"
										description="Moonphase Watch · Belfry Throw"
										endContent={
											<Text type="body" weight="semibold" hasTabularNumbers>
												$248
											</Text>
										}
									/>
									<Item
										label="Shipping"
										description="Courier-raven ground"
										endContent={
											<Text type="body" weight="semibold" hasTabularNumbers>
												$12
											</Text>
										}
									/>
									<Item
										label="Estimated arrival"
										description="Tomorrow by 8pm"
										endContent={
											<HStack gap={1} vAlign="center">
												<StatusDot variant="success" label="On time" />
												<Text type="supporting" color="secondary">
													On time
												</Text>
											</HStack>
										}
									/>
									<Item
										label="Tracking"
										description="RVN 1Z 999 AA1 0123 4567 84"
										endContent={<Link href="#/templates/theme-showcase">Track</Link>}
									/>
								</VStack>
							</Card>
						</VStack>
					</ChatMessage>
				</ChatMessageList>
			</VStack>

			<VStack gap={0} paddingInline={4} paddingBlockEnd={2}>
				<HStack gap={1} hAlign="center" wrap="wrap">
					{SUGGESTED_QUESTIONS.map((question) => (
						<Button key={question} variant="secondary" size="sm" label={question} />
					))}
				</HStack>
			</VStack>

			<VStack gap={0} paddingInline={4} paddingBlockEnd={4}>
				<ChatComposer
					value=""
					onChange={() => {}}
					onSubmit={() => {}}
					placeholder="Ask Night Owl..."
					footerActions={
						<Button
							variant="ghost"
							size="md"
							isIconOnly
							label="Attach"
							tooltip="Attach"
							icon={<Plus size={16} />}
						/>
					}
					sendActions={
						<Button
							variant="ghost"
							size="md"
							isIconOnly
							label="Voice input"
							tooltip="Voice input"
							icon={<Mic size={16} />}
						/>
					}
				/>
			</VStack>
		</Card>
	);
}

interface ActivityRow {
	id: string;
	icon: ReactNode;
	label: string;
	detail: string;
	time: string;
	amount: number;
}

const ACTIVITY: ActivityRow[] = [
	{
		id: "1",
		icon: <ShoppingBag size={16} />,
		label: "Order #1043",
		detail: "Placed · 1:59 pm",
		time: "1:59 pm",
		amount: 248,
	},
	{
		id: "2",
		icon: <Banknote size={16} />,
		label: "Order #1041",
		detail: "Refunded · 12:40 pm",
		time: "12:40 pm",
		amount: -89,
	},
	{
		id: "3",
		icon: <ShoppingBag size={16} />,
		label: "Order #1040",
		detail: "Placed · 10:30 am",
		time: "10:30 am",
		amount: 156,
	},
	{
		id: "4",
		icon: <ShoppingBag size={16} />,
		label: "Order #1038",
		detail: "Placed · 9:11 am",
		time: "9:11 am",
		amount: 412,
	},
	{
		id: "5",
		icon: <ShoppingBag size={16} />,
		label: "Order #1037",
		detail: "Placed · 8:42 am",
		time: "8:42 am",
		amount: 95,
	},
];

function formatAmount(amount: number): string {
	const sign = amount < 0 ? "−" : "+";
	return sign + "$" + Math.abs(amount).toLocaleString();
}

function LatestActivityCard({ isMobile }: { isMobile: boolean }) {
	return (
		<Card
			padding={4}
			height="100%"
			style={{
				backgroundColor: "var(--color-background-surface)",
				color: "var(--color-text-primary)",
				minWidth: 0,
			}}
		>
			<VStack gap={4} height="100%">
				<Heading level={2}>Revenue</Heading>

				<Grid columns={isMobile ? 1 : 2} gap={3}>
					<VStack gap={0}>
						<Text type="display-3" weight="semibold" hasTabularNumbers>
							18K
						</Text>
						<Text type="supporting" color="secondary">
							Monthly revenue
						</Text>
					</VStack>
					<VStack gap={0}>
						<Text type="display-3" weight="semibold" hasTabularNumbers>
							+12%
						</Text>
						<Text type="supporting" color="secondary">
							Order growth
						</Text>
					</VStack>
				</Grid>

				<Divider variant="subtle" />

				<HStack hAlign="between" vAlign="center">
					<Heading level={3}>Activity</Heading>
					<Link href="#/templates/theme-showcase">See all</Link>
				</HStack>

				<VStack
					gap={1}
					style={{
						flex: 1,
						minHeight: 0,
						overflow: "hidden",
						maskImage: "linear-gradient(to bottom, black calc(100% - 48px), transparent)",
						WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 48px), transparent)",
						marginInline: "calc(var(--spacing-2) * -1)",
					}}
				>
					{/* The sign travels in the string (formatAmount prefixes U+2212), so
              direction is never colour-alone and 1.4.1 holds without a tint.
              A negative text role is not available here, and the reason is
              worth recording rather than working around:
                - TextColorMap is six keys (primary, secondary, disabled,
                  placeholder, accent, inherit). No negative.
                - `accent` is Purple in this theme, and principle 2 makes
                  purple tappable-only, so a refund would read as a link.
                - --color-negative #FF5555 measures 3.75:1 on this card
                  #343746, under the 4.5:1 floor, so a style-prop tint would
                  trade a weak signal for a real contrast failure.
              secondary therefore stays and the minus sign is the signal. A
              kit-wide negative text role needs a new token AND a colour that
              clears 4.5:1 on a card — a human call, not a call-site one. */}
					{ACTIVITY.map((item) => (
						<Item
							key={item.id}
							startContent={
								<Center
									width={32}
									height={32}
									aria-hidden="true"
									style={{
										// Center supplies the 32px box and the centering; only the
										// paint stays here. Surface, not muted: secondary
										// #9AA1BC is 3.57:1 on muted #44475A, under the 4.5:1 text
										// floor. The chip is aria-hidden decorative art so it
										// clears the 3:1 non-text bar as-is, but the surface fill
										// carries the same 4.60:1 pairing at no cost.
										borderRadius: "var(--radius-element)",
										backgroundColor: "var(--color-background-surface)",
										color: "var(--color-text-secondary)",
										flexShrink: 0,
									}}
								>
									{item.icon}
								</Center>
							}
							label={item.label}
							description={item.detail}
							endContent={
								<Text
									type="body"
									weight="semibold"
									hasTabularNumbers
									color={item.amount < 0 ? "secondary" : "primary"}
								>
									{formatAmount(item.amount)}
								</Text>
							}
							href="#/templates/theme-showcase"
						/>
					))}
				</VStack>
			</VStack>
		</Card>
	);
}

type TagSpec = { label: string; variant: ShowcaseBadgeVariant };

export interface InventoryRow extends Record<string, unknown> {
	id: string;
	name: string;
	meta: string;
	available: number;
	location: string;
	tags: TagSpec[];
	hue: SceneHue;
	selected: boolean;
}

const DEFAULT_INVENTORY: InventoryRow[] = [
	{
		id: "a",
		name: "Moonphase Watch",
		meta: "Steel case, moonphase dial",
		available: 42,
		location: "Roost 3",
		tags: [{ label: "New", variant: "cyan" }],
		hue: "var(--dracula-comment)",
		selected: false,
	},
	{
		id: "b",
		name: "Night-Owl Headphones",
		meta: "ANC, 30hr battery",
		available: 128,
		location: "Roost 1",
		tags: [{ label: "Popular", variant: "green" }],
		hue: "var(--dracula-cyan)",
		selected: true,
	},
	{
		id: "c",
		name: "Coven Canvas Backpack",
		meta: "Waxed canvas, 25L",
		available: 63,
		location: "Roost 2",
		tags: [{ label: "Limited", variant: "yellow" }],
		hue: "var(--dracula-yellow)",
		selected: false,
	},
	{
		id: "d",
		name: "Night Market Wallet",
		meta: "Full-grain, RFID blocking",
		available: 15,
		location: "Roost 4",
		tags: [{ label: "Leather", variant: "yellow" }],
		hue: "var(--dracula-orange)",
		selected: true,
	},
	{
		id: "e",
		name: "Midnight Tumbler",
		meta: "Vacuum insulated, 16oz",
		available: 87,
		location: "Roost 5",
		tags: [{ label: "Drinkware", variant: "yellow" }],
		hue: "var(--dracula-pink)",
		selected: false,
	},
	{
		id: "f",
		name: "Belfry Throw",
		meta: "Heavyweight, oat",
		available: 24,
		location: "Roost 6",
		tags: [{ label: "Home", variant: "yellow" }],
		hue: "var(--dracula-green)",
		selected: true,
	},
];

const LOW_STOCK_THRESHOLD = 25;

function SelectCell({ row }: { row: InventoryRow }) {
	return (
		<CheckboxInput
			label={"Select " + row.name}
			isLabelHidden
			value={row.selected}
			onChange={() => {}}
		/>
	);
}

function ItemCell({ row }: { row: InventoryRow }) {
	return (
		<HStack gap={3} vAlign="center">
			<ProductSwatch accent={row.hue} label={row.name} />
			<VStack gap={0} style={{ minWidth: 0 }}>
				<Text type="body" weight="semibold">
					{row.name}
				</Text>
				<Text type="supporting" color="secondary">
					{row.meta}
				</Text>
			</VStack>
		</HStack>
	);
}

function TagsCell({ row }: { row: InventoryRow }) {
	return (
		<HStack gap={1} wrap="wrap" hAlign="end">
			{row.tags.map((tag) => (
				<Badge key={tag.label} label={tag.label} variant={tag.variant} />
			))}
		</HStack>
	);
}

function ActionsCell() {
	return (
		<MoreMenu
			label="Row actions"
			size="sm"
			items={[
				{ label: "Edit" },
				{ label: "Duplicate" },
				{ label: "Move to…" },
				{ type: "divider" },
				{ label: "Delete" },
			]}
		/>
	);
}

// The full column set needs 64+80+100+100+80+64 = 488px of grid and the card
// insets cost 2 × --spacing-6 on top, so it stops fitting below ~600px. A 375px
// phone leaves ~280px inside the card: the phone layout drops the selection
// control (no bulk action bar acts on it) and the two metadata columns, which
// needs 244px. Table keeps its own scroll wrapper either way; the point is that
// a row should not have to be read sideways.
const NARROW_TABLE_QUERY = "(max-width: 600px)";
const NARROW_COLUMN_KEYS: Record<string, true> = {
	select: true,
	location: true,
	tags: true,
};

const INVENTORY_COLUMNS: TableColumn<InventoryRow>[] = [
	{
		key: "select",
		header: "",
		// Wide enough that the control + the theme's cell padding (up to
		// --spacing-4 = 16px/side on spacious density) fit inside the cell,
		// so the control's hover background doesn't overflow toward the
		// card's clipped (rounded) edge on larger-padding themes.
		width: pixel(64),
		renderCell: (row) => <SelectCell row={row} />,
	},
	{
		key: "item",
		header: "Item",
		// Lower min-width (default 120) so the table fits its container on
		// larger-spacing themes instead of overflowing the actions column.
		width: proportional(3, { minWidth: 80 }),
		renderCell: (row) => <ItemCell row={row} />,
	},
	{
		key: "available",
		header: "Available",
		width: pixel(100),
		renderCell: (row) => (
			<Text type="body" hasTabularNumbers>
				{row.available}
			</Text>
		),
	},
	{
		key: "location",
		header: "Location",
		width: pixel(100),
		renderCell: (row) => <Text type="body">{row.location}</Text>,
	},
	{
		key: "tags",
		header: "Tags",
		width: proportional(2, { minWidth: 80 }),
		align: "end",
		renderCell: (row) => <TagsCell row={row} />,
	},
	{
		key: "actions",
		header: "",
		// Match the select column: fit the sm more-menu button + cell
		// padding so its hover background stays clear of the card's
		// clipped rounded edge across themes.
		width: pixel(64),
		align: "end",
		renderCell: () => <ActionsCell />,
	},
];

const NARROW_INVENTORY_COLUMNS = INVENTORY_COLUMNS.filter(
	(column) => !NARROW_COLUMN_KEYS[column.key],
);

function InventoryCard({ inventory }: { inventory: InventoryRow[] }) {
	const isNarrow = useMediaQuery(NARROW_TABLE_QUERY);
	const lowStockCount = inventory.filter((row) => row.available < LOW_STOCK_THRESHOLD).length;
	return (
		<Card
			padding={0}
			style={{
				backgroundColor: "var(--color-background-surface)",
				color: "var(--color-text-primary)",
				overflow: "hidden",
			}}
		>
			<HStack hAlign="between" vAlign="center" paddingBlock={6} paddingInline={6}>
				<Heading level={2}>Inventory</Heading>
				<Button label="Add item" variant="primary" icon={<Plus size={16} />} />
			</HStack>

			<Divider variant="subtle" />

			<HStack
				gap={3}
				vAlign="center"
				hAlign="between"
				width="100%"
				paddingBlock={4}
				paddingInline={6}
				style={{ overflowX: "auto" }}
			>
				<HStack gap={2} vAlign="center" style={{ flex: 1, minWidth: 0 }}>
					<TextInput
						label="Search inventory"
						isLabelHidden
						placeholder="Type and hit enter…"
						value=""
						onChange={() => {}}
						startIcon={<Search size={16} />}
						style={{ flex: 1, minWidth: 0, maxWidth: 240 }}
					/>
					<OverflowList
						gap={2}
						overflowRenderer={() => (
							<Button label="Filters" variant="ghost" size="sm" icon={<Tag size={16} />} />
						)}
					>
						<Selector
							label="Categories"
							isLabelHidden
							placeholder="Categories"
							size="sm"
							startIcon={<Folder size={16} />}
							value={undefined}
							onChange={() => {}}
							options={["Wearables", "Audio", "Bags", "Drinkware", "Home"]}
						/>
						<Selector
							label="Locations"
							isLabelHidden
							placeholder="Locations"
							size="sm"
							startIcon={<MapPin size={16} />}
							value={undefined}
							onChange={() => {}}
							options={["Roost 1", "Roost 2", "Roost 3", "Roost 4", "Roost 5", "Roost 6"]}
						/>
						<Selector
							label="Tags"
							isLabelHidden
							placeholder="Tags"
							size="sm"
							startIcon={<Tag size={16} />}
							value={undefined}
							onChange={() => {}}
							options={["New", "Popular", "Limited", "Leather", "Drinkware", "Home"]}
						/>
					</OverflowList>
				</HStack>
				<HStack gap={1} vAlign="center">
					<Button
						variant="ghost"
						size="sm"
						isIconOnly
						label="List view"
						tooltip="List view"
						icon={<List size={18} />}
					/>
					<Button
						variant="ghost"
						size="sm"
						isIconOnly
						label="Grid view"
						tooltip="Grid view"
						icon={<LayoutGrid size={18} />}
					/>
				</HStack>
			</HStack>

			{lowStockCount > 0 && (
				<VStack gap={0} paddingInline={6} paddingBlockEnd={4}>
					<Banner status="warning" title={lowStockCount + " items are running low"} />
				</VStack>
			)}

			{/* Inset the table by --spacing-6 (the card is padding={0}) so its edge
          lines up with the header/filter row in every theme's spacing scale. */}
			<VStack gap={0} paddingInline={6} paddingBlockEnd={2}>
				<Table<InventoryRow>
					data={inventory}
					columns={isNarrow ? NARROW_INVENTORY_COLUMNS : INVENTORY_COLUMNS}
					density="spacious"
					dividers="rows"
					hasHover
				/>
			</VStack>
		</Card>
	);
}
