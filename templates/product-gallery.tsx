// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=8] > (G[c={min:280} g=4 a=start] > Hd"Small comforts for the midnight hours."[level=1 t=display-2] + (V[g=3 a=start] > Tx"Provisions from the castle workshops"[t=body] + B.primary"Browse the collection")) + (V[g=8] > (V[g=2] > Hd"The collection"[level=2] + Tx"Each piece is made in small batches"[t=body]) + (G[c={min:280} g=8] > (V[g=3] > (C[p=0] > AR[ratio=1]) + (V[g=1] > Hd"Nightfall Stoneware Mug"[level=3] + Tx"A hand-thrown mug that sits easy"[t=body color=secondary] + Tx.lg"$75.00"))*6))

import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Grid} from '@astryxdesign/core/Grid';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowRight} from 'lucide-react';
import {SceneTile} from 'astryx-dracula/shared/scene-tile';

// ─── Styles ─────────────────────────────────────────────────────────────────
// Product tile art lives in shared/scene-tile (large fork); there is no Image
// primitive to fill the AspectRatio box with `object-fit` (#2582).

// ─── Product Data ───────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  hue: string;
}

// One accent per product from the fixed badge vocabulary.
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Nightfall Stoneware Mug',
    description:
      'A hand-thrown mug that sits easy in the hand through the longest night watch.',
    price: 75.0,
    hue: 'var(--dracula-purple)',
  },
  {
    id: 2,
    name: 'Coven Gathering Candle',
    description:
      'Smoked amber and clove poured for slow evenings around the table.',
    price: 80.0,
    hue: 'var(--dracula-orange)',
  },
  {
    id: 3,
    name: 'Belfry Wool Throw',
    description:
      'A heavy weave that keeps the chill of the tower off your shoulders.',
    price: 75.0,
    hue: 'var(--dracula-cyan)',
  },
  {
    id: 4,
    name: 'Crypt Archive Journal',
    description:
      'Stitched pages that take ink well for field notes and midnight lists.',
    price: 75.0,
    hue: 'var(--dracula-yellow)',
  },
  {
    id: 5,
    name: 'Moonrise Enamel Pin',
    description:
      'A small harvest moon for the lapel of your favourite coat.',
    price: 60.0,
    hue: 'var(--dracula-pink)',
  },
  {
    id: 6,
    name: 'Transylvanian Tea Blend',
    description:
      'Black tea with midnight berries, packed for the cold months.',
    price: 80.0,
    hue: 'var(--dracula-green)',
  },
];

const fmt = (n: number) => `$${n.toFixed(2)}`;

// ─── Product Card ───────────────────────────────────────────────────────────

function ProductCard({product}: {product: Product}) {
  return (
    <VStack gap={3}>
      <Card padding={0}>
        <AspectRatio ratio={1}>
          <SceneTile
            label={`${product.name} thumbnail`}
            hue={product.hue}
            size="lg"
          />
        </AspectRatio>
      </Card>
      <VStack gap={1}>
        <Heading level={3}>{product.name}</Heading>
        <Text type="body" color="secondary" maxLines={2}>
          {product.description}
        </Text>
        <Text type="large" hasTabularNumbers>
          {fmt(product.price)}
        </Text>
      </VStack>
    </VStack>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ProductGallery() {
  return (
    <Layout
      height="fill"
      contentWidth={1200}
      content={
        <LayoutContent padding={6}>
          <VStack gap={8}>
            {/* Header — Grid handles responsive stacking */}
            <Grid columns={{minWidth: 280}} gap={4} align="start">
              <Heading level={1} type="display-2">
                Small comforts for the midnight hours.
              </Heading>
              <VStack gap={3} hAlign="start">
                <Text type="body">
                  Provisions from the castle workshops: kiln-fired, hand-poured,
                  and stitched by the coven.
                </Text>
                <Button
                  label="Browse the collection"
                  variant="primary"
                  endContent={<Icon icon={ArrowRight} color="inherit" />}
                  clickAction={() =>
                    document
                      .getElementById('products')
                      ?.scrollIntoView({behavior: 'smooth'})
                  }
                />
              </VStack>
            </Grid>

            {/* Product Grid — reflows 3 → 2 → 1 columns as width narrows */}
            <VStack gap={8}>
              <VStack gap={2}>
                <Heading level={2}>The collection</Heading>
                <Text type="body" color="secondary">
                  Each piece is made in small batches and restocked with every
                  full moon.
                </Text>
              </VStack>
              <Grid columns={{minWidth: 280}} gap={8} id="products">
                {PRODUCTS.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Grid>
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
