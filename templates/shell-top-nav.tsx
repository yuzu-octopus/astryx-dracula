// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {CSSProperties} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
  useTopNavRenderMode,
} from '@astryxdesign/core/TopNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Icon} from '@astryxdesign/core/Icon';
import type {IconType} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Button} from '@astryxdesign/core/Button';
import {Badge} from '@astryxdesign/core/Badge';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Stack, VStack} from '@astryxdesign/core/Stack';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Sparkles,
  SwatchBook,
  Tag,
  House,
  Smile,
  BadgePercent,
  Gift,
  Cloud,
  Zap,
  Sun,
  Star,
  Flame,
  Globe,
  Moon,
} from 'lucide-react';

// Cap + center the page body so wide screens show whitespace gutters.
const contentMax: CSSProperties = {maxWidth: 1100, marginInline: 'auto'};
// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = '#/templates/shell-top-nav';
// Lock both mega-menu panels to an identical size. Without this, Shop and
// Brands size to their own content (different widths); since both anchor to
// the centered nav, switching between them resizes the panel — which reads
// as flashing/jumping. Fixed item + featured widths make the panels
// pixel-identical so the transition is seamless.
const megaItems: CSSProperties = {gridColumn: '1 / -1', width: 520};
const megaFeatured: CSSProperties = {width: 240};

type MegaItem = {name: string; tagline: string; icon: IconType};

// Shop and Brands each render 8 items — the mega menu's built-in 2-column grid
// lays them out as 2 columns × 4 rows, alongside a featured card.
const SHOP_ITEMS: MegaItem[] = [
  {name: 'New Arrivals', tagline: 'The latest drops', icon: Sparkles},
  {name: 'Womenswear', tagline: 'Dresses, knitwear & more', icon: SwatchBook},
  {name: 'Menswear', tagline: 'Shirts, tailoring & more', icon: Tag},
  {name: 'Home', tagline: 'Bedding, lighting & décor', icon: House},
  {
    name: 'Beauty',
    tagline: 'Skincare, fragrance & makeup',
    icon: Smile,
  },
  {
    name: 'Accessories',
    tagline: 'Bags, hats & sunglasses',
    icon: ShoppingBag,
  },
  {name: 'Sale', tagline: 'Up to 50% off', icon: BadgePercent},
  {name: 'Gift Cards', tagline: 'The perfect present', icon: Gift},
];

const BRAND_ITEMS: MegaItem[] = [
  {name: 'Aether', tagline: 'Performance essentials', icon: Sparkles},
  {name: 'Northwind', tagline: 'Outdoor & technical', icon: Cloud},
  {name: 'Loomwell', tagline: 'Everyday knitwear', icon: Zap},
  {name: 'Verdant', tagline: 'Sustainable basics', icon: Sun},
  {name: 'Studio Mara', tagline: 'Modern tailoring', icon: Star},
  {name: 'Atelier Kos', tagline: 'Limited ateliers', icon: Flame},
  {name: 'Rue & Co', tagline: 'City streetwear', icon: Globe},
  {name: 'Halden', tagline: 'Minimal staples', icon: Moon},
];

const CATEGORY_TILES = [
  'New Arrivals',
  'Womenswear',
  'Menswear',
  'Home & Living',
  'Beauty',
  'Accessories',
];

// Wraps the 8 items in a fixed-width 2-column grid so every mega menu's item
// area is exactly the same width regardless of its content.
function MegaItems({items}: {items: MegaItem[]}) {
  // In the mobile drawer the fixed 520px panel would overflow the ~350px
  // drawer, and the 2-column grid overlaps item text there — so the drawer
  // gets a natural-width single column. Desktop keeps the lock.
  const isDrawer = useTopNavRenderMode() === 'drawer';
  if (isDrawer) {
    return (
      <VStack gap={1}>
        {items.map(item => (
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
    <Stack style={megaItems}>
      <Grid columns={2} gap={2}>
        {items.map(item => (
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
  const isDrawer = useTopNavRenderMode() === 'drawer';
  return (
    <Stack style={isDrawer ? undefined : megaFeatured}>
      <TopNavMegaMenuFeaturedCard {...props} />
    </Stack>
  );
}

export default function ShellTopNav() {
  // Below ~640px the mobile bar (heading + actions + toggle) overflows 390px
  // viewports, pushing the nav toggle off-screen. Dropping the text Sign in
  // button there restores room for search, checkout, and the toggle.
  const isCompact = useMediaQuery('(max-width: 640px)');
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
              logo={
                <NavIcon icon={<Icon icon={ShoppingBag} size="sm" />} />
              }
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
      }>
      <VStack gap={10} style={contentMax}>
        <Card variant="muted" padding={0} width="100%" height={360} />

        {[0, 1, 2].map(section => (
          <VStack key={section} gap={4}>
            <Card variant="muted" padding={0} width={200} height={24} />
            <Grid columns={{minWidth: 160, repeat: 'fit'}} gap={4}>
              {CATEGORY_TILES.map(tile => (
                <VStack key={tile} gap={2}>
                  <Card variant="muted" padding={0} width="100%" height={120} />
                  <Card variant="muted" padding={0} width="60%" height={14} />
                </VStack>
              ))}
            </Grid>
          </VStack>
        ))}
      </VStack>
    </AppShell>
  );
}
