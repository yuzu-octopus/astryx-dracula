// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=8] > ((V[g=2 a=center] > Hd"Every corner of the castle, caught after dark."[level=1] + Tx"Relics, sketches, and moonlit views from the coven archives, collected over one long Transylvanian night."[t=body]) + (V[g=3] > (V[g=2] > AR[ratio=3/1] + Tx"The castle at moonrise"[t=body]) + (G[c={min:280} g=4] > (V[g=2] > AR[ratio=3/2] + Tx"Coven gathering"[t=body]) + (V[g=2] > AR[ratio=3/2] + Tx"Belfry view"[t=body]) + (V[g=2] > AR[ratio=3/2] + Tx"Crypt archives"[t=body]) + (V[g=2] > AR[ratio=3/2] + Tx"Midnight garden"[t=body]))))

import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';
import {galleryImageClip} from 'astryx-dracula/shared/gallery-image';
import {SceneTile} from 'astryx-dracula/shared/scene-tile';

// ─── Styles ────────────────────────────────────────────────────────────────
// Image fill + radius live in shared/gallery-image (no Image primitive in
// Astryx, #2582). Tile art lives in shared/scene-tile (large fork).

// ─── Gallery Data ───────────────────────────────────────────────────────────

interface GalleryImage {
  title: string;
  hue: string;
}

// One accent per tile from the fixed badge vocabulary; the SVG scenes below
// resolve to Dracula tokens so tiles stay on-brand in the dark-only theme.
const IMAGES: GalleryImage[] = [
  {title: 'The castle at moonrise', hue: 'var(--dracula-orange)'},
  {title: 'Coven gathering', hue: 'var(--dracula-cyan)'},
  {title: 'Belfry view', hue: 'var(--dracula-pink)'},
  {title: 'Crypt archives', hue: 'var(--dracula-yellow)'},
  {title: 'Midnight garden', hue: 'var(--dracula-green)'},
];

// ─── Gallery Card ─────────────────────────────────────────────────────────
// Each tile is an image plus its caption (titles lived only in aria-labels
// before, leaving the tiles cryptic). AspectRatio gives every image a
// definite, self-contained height from its ratio, so images can't overflow
// their grid cell and no tile depends on a neighbour's caption height.

function GalleryCard({image, ratio}: {image: GalleryImage; ratio: number}) {
  return (
    <VStack gap={2}>
      <AspectRatio ratio={ratio} style={galleryImageClip}>
        <SceneTile label={image.title} hue={image.hue} size="lg" />
      </AspectRatio>
      <Text type="body" color="secondary" justify="center">
        {image.title}
      </Text>
    </VStack>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function MixedGallery() {
  return (
    <Layout
      height="fill"
      contentWidth={1400}
      content={
        <LayoutContent padding={6}>
          <VStack gap={8}>
            {/* Header */}
            <VStack gap={2} hAlign="center">
              <Heading level={1} justify="center">
                Every corner of the castle, caught after dark.
              </Heading>
              <Text type="body" color="secondary" justify="center">
                Relics, sketches, and moonlit views from the coven archives,
                collected over one long Transylvanian night.
              </Text>
            </VStack>

            {/* Featured layout: the wide 3:1 hero heads the page, then the rest
                of the set reflows as a grid (4 → 2 → 1 columns). Every tile
                keeps its own ratio, so no tile's height depends on another's
                caption wrapping. */}
            <VStack gap={3}>
              <GalleryCard image={IMAGES[0]} ratio={3 / 1} />
              <Grid columns={{minWidth: 280}} gap={4}>
                {IMAGES.slice(1).map(image => (
                  <GalleryCard key={image.title} image={image} ratio={3 / 2} />
                ))}
              </Grid>
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
