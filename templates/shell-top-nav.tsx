// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {CSSProperties} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMegaMenu,
  TopNavMegaMenuItem,
  TopNavMegaMenuFeaturedCard,
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
  return (
    <Stack style={megaItems}>
      <Grid columns={2} gap={2}>
        {items.map(item => (
          <TopNavMegaMenuItem
            key={item.name}
            title={item.name}
            description={item.tagline}
            icon={<Icon icon={item.icon} size="md" color="secondary" />}
            href="#"
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
  return (
    <Stack style={megaFeatured}>
      <TopNavMegaMenuFeaturedCard {...props} />
    </Stack>
  );
}

export default function ShellTopNav() {
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
              headingHref="#"
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
                    linkHref="#midnight-edit"
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
                    linkHref="#studio-mara"
                  />
                }
              />
              <TopNavItem label="Sale" href="#" />
              <TopNavItem label="Service" href="#" />
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
              <Button label="Sign in" variant="ghost" />
              <Button
                label="Checkout"
                variant="primary"
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
