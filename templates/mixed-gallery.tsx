// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=8] > ((V[g=2 a=center] > Hd"Every corner of the castle, caught after dark."[level=1] + Tx"Relics, sketches, and moonlit views from the coven archives, collected over one long Transylvanian night."[t=body]) + (V[g=3] > (V[g=2] > AR[ratio=3/1] + Tx"Title"[t=supporting]) + (G[c={min:280} g=4] > (V[g=2] > AR[ratio=3/2] + Tx"Title"[t=supporting])*4)))

import type {CSSProperties} from 'react';
import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';

// ─── Styles ────────────────────────────────────────────────────────────────
// Image fill + radius are custom because Astryx has no image primitive
// (#2582). Both are local to the tiles below.

// Fills the AspectRatio box with a Dracula placeholder scene. No Image
// primitive in Astryx (#2582), so gallery tiles are inline SVG on brand
// tokens instead of light-mode data-URI bitmaps.
const svgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
// Rounds the image corners. No radius prop on AspectRatio (#2582).
const clipStyle: CSSProperties = {
  borderRadius: 'var(--radius-element)',
};

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
      <AspectRatio ratio={ratio} style={clipStyle}>
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
          style={svgStyle}
          role="img"
          aria-label={image.title}>
          <rect width="400" height="300" fill="var(--dracula-bg-light)" />
          <g
            transform="translate(200 150)"
            fill="none"
            stroke="var(--dracula-comment)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="-44" y="-44" width="88" height="88" rx="5" />
            <circle cx="18" cy="-18" r="2.5" fill={image.hue} stroke="none" />
            <path d="M-34 30 L-8 0 L10 18 L20 8 L34 24" />
          </g>
        </svg>
      </AspectRatio>
      <Text type="supporting" justify="center">
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
