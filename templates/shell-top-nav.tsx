// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=6 @topNav=(TN > TNI"Shop" + TNI"Brands" + TNI"Sale" + TNI"Service")] > Ctr[axis=horizontal] > S[mw=1100 w=100% p=0] > V[g=10] > C.muted[p=0 w=100% h=360] + (V[g=4] > C.muted[p=0 w=200 h=24] + (G[c={min:160} g=4] > (V[g=2] > C.muted[p=0 w=100% h=120] + C.muted[p=0 w=60% h=14])*6))*3
// Note: skeleton placeholders carry no Hd by design (skill skeleton-shell
// exemption) — routed pages supply the h1.

import { AppShell } from "@astryxdesign/core/AppShell";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Grid } from "@astryxdesign/core/Grid";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import type { IconType } from "@astryxdesign/core/Icon";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { NavIcon } from "@astryxdesign/core/NavIcon";
import { Section } from "@astryxdesign/core/Section";
import { Stack, VStack } from "@astryxdesign/core/Stack";
import {
	TopNav,
	TopNavHeading,
	TopNavItem,
	TopNavMegaMenu,
	TopNavMegaMenuFeaturedCard,
	TopNavMegaMenuItem,
	useTopNavRenderMode,
} from "@astryxdesign/core/TopNav";
import { House, Search, ShoppingBag, ShoppingCart, Sparkles, SwatchBook, Tag } from "lucide-react";

// Cap + center the page body so wide screens show whitespace gutters.
const CONTENT_MAX_WIDTH = 1100;
// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = "#/templates/shell-top-nav";
// Lock both mega-menu panels to an identical size. Without fixed widths Shop
// and Brands size to their own content (different widths); since both anchor
// to the centered nav, switching between them resizes the panel — which reads
// as flashing/jumping. The pair needs roughly 800px of clear space, so
// narrower viewports fall back to natural-width single columns (see
// MegaItems) instead of painting past the edge.

// Three identical shelves; the ids keep React keys stable if they reorder.
const SHELVES = ["new-in", "featured", "sale"];

type MegaItem = { name: string; tagline: string; icon: IconType };

// Shop and Brands each render 4 items — the mega menu's built-in 2-column
// grid lays them out as 2 columns × 2 rows, alongside a featured card.
const SHOP_ITEMS: MegaItem[] = [
	{ name: "New Moon Arrivals", tagline: "Fresh from the kiln", icon: Sparkles },
	{
		name: "Gowns & Cloaks",
		tagline: "Dresses, knitwear & moonlit layers",
		icon: SwatchBook,
	},
	{ name: "Doublets & Tailoring", tagline: "Shirts, cloaks & more", icon: Tag },
	{ name: "Keep & Crypt", tagline: "Bedding, candlelight & décor", icon: House },
];

const BRAND_ITEMS: MegaItem[] = [
	{ name: "Aether", tagline: "Moonlit essentials", icon: Sparkles },
	{ name: "Loomwell", tagline: "Everyday knitwear, coven-stitched", icon: Tag },
	{ name: "Verdant", tagline: "Earth-kept basics", icon: House },
	{ name: "Studio Mara", tagline: "Modern tailoring for the night", icon: SwatchBook },
];

// Shelf tiles mirror the Shop menu so the page previews what the menu links.
const CATEGORY_TILES = SHOP_ITEMS.map((item) => item.name);

// Both panels share one item renderer so the drawer's single column and the
// desktop popover's fixed-width grid stay in lockstep. Fixed widths keep the
// two panels pixel-identical (no resize flash when switching menus); the
// drawer and narrow viewports fall back to a natural-width column so the
// locked 520px panel never paints past the edge.
function MegaItems({ items }: { items: MegaItem[] }) {
	// In the mobile drawer the fixed 520px panel would overflow the ~350px
	// drawer, and the 2-column grid overlaps item text there — so the drawer
	// gets a natural-width single column. The same goes for viewports too
	// narrow to seat the locked desktop panel, which would otherwise paint
	// past the edge: below 1024px the popover keeps the natural-width column.
	const isDrawer = useTopNavRenderMode() === "drawer";
	const isCompact = useMediaQuery("(max-width: 1024px)");
	if (isDrawer || isCompact) {
		return (
			<VStack gap={1}>
				{items.map((item) => (
					<TopNavMegaMenuItem
						key={item.name}
						title={item.name}
						description={item.tagline}
						icon={<Icon icon={item.icon} size="md" color="secondary" />}
						href={SELF_HASH}
					/>
				))}
			</VStack>
		);
	}
	return (
		<Stack style={{ gridColumn: "1 / -1", width: 520 }}>
			<Grid columns={2} gap={2}>
				{items.map((item) => (
					<TopNavMegaMenuItem
						key={item.name}
						title={item.name}
						description={item.tagline}
						icon={<Icon icon={item.icon} size="md" color="secondary" />}
						href={SELF_HASH}
					/>
				))}
			</Grid>
		</Stack>
	);
}

// Pins the featured card to a fixed width so both panels match exactly.
function MegaFeatured(props: {
	title: string;
	description: string;
	linkLabel: string;
	linkHref: string;
}) {
	const isDrawer = useTopNavRenderMode() === "drawer";
	const isCompact = useMediaQuery("(max-width: 1024px)");
	return (
		<Stack style={isDrawer || isCompact ? undefined : { width: 240 }}>
			<TopNavMegaMenuFeaturedCard {...props} />
		</Stack>
	);
}

export default function ShellTopNav() {
	// Below ~640px the mobile bar (heading + actions + toggle) overflows 390px
	// viewports, pushing the nav toggle off-screen. Dropping the text Sign in
	// button there restores room for search, checkout, and the toggle.
	const isCompact = useMediaQuery("(max-width: 640px)");
	return (
		<AppShell
			variant="surface"
			contentPadding={6}
			topNav={
				<TopNav
					label="Nocturne storefront navigation"
					heading={
						<TopNavHeading
							heading="Nocturne"
							logo={<NavIcon icon={<Icon icon={ShoppingBag} size="sm" />} />}
						/>
					}
					centerContent={
						<>
							<TopNavMegaMenu
								label="Shop"
								items={<MegaItems items={SHOP_ITEMS} />}
								featured={
									<MegaFeatured
										title="The Midnight Edit"
										description="Layered staples in moonlit purples."
										linkLabel="Shop the edit"
										linkHref={SELF_HASH}
									/>
								}
							/>
							<TopNavMegaMenu
								label="Brands"
								items={<MegaItems items={BRAND_ITEMS} />}
								featured={
									<MegaFeatured
										title="Meet Studio Mara"
										description="Modern tailoring, made to last."
										linkLabel="Discover the label"
										linkHref={SELF_HASH}
									/>
								}
							/>
							<TopNavItem label="Sale" href={SELF_HASH} />
							<TopNavItem label="Service" href={SELF_HASH} />
						</>
					}
					endContent={
						<>
							<IconButton
								label="Search products"
								tooltip="Search"
								variant="ghost"
								icon={<Icon icon={Search} size="sm" />}
							/>
							{!isCompact && <Button label="Sign in" variant="ghost" />}
							<Button
								label="Checkout"
								variant="primary"
								tooltip="Cart, 3 items"
								icon={<Icon icon={ShoppingCart} size="sm" />}
								endContent={<Badge label={3} />}
							/>
						</>
					}
				/>
			}
		>
			<Center axis="horizontal">
				<Section variant="transparent" maxWidth={CONTENT_MAX_WIDTH} width="100%" padding={0}>
					<VStack gap={10}>
						{/* Skeleton shelves only — the routed collection supplies the h1. */}
						<Card variant="muted" padding={0} width="100%" height={360} />

						{SHELVES.map((shelf) => (
							<VStack key={shelf} gap={4}>
								<Card variant="muted" padding={0} width={200} height={24} />
								<Grid columns={{ minWidth: 160, repeat: "fit" }} gap={4}>
									{CATEGORY_TILES.map((tile) => (
										<VStack key={tile} gap={2}>
											<Card variant="muted" padding={0} width="100%" height={120} />
											<Card variant="muted" padding={0} width="60%" height={14} />
										</VStack>
									))}
								</Grid>
							</VStack>
						))}
					</VStack>
				</Section>
			</Center>
		</AppShell>
	);
}
