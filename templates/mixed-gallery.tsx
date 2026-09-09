// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=6] > (V[g=2 a=center] > Hd"Every corner of the castle, caught after dark."[level=1] + Tx"Relics, sketches, and moonlit views"[t=body]) + (G[g=4] > (V[g=2] > AR + Tx"Title"[t=supporting])*5)

import type {CSSProperties} from 'react';
import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';

// ─── Styles ────────────────────────────────────────────────────────────────
// The masonry needs a responsive column count AND a hero that spans 2 columns
// on desktop but goes full-width on mobile. Grid forces grid-template-columns
// inline, so a responsive span can't be expressed through its props — this is a
// @container grid (the sanctioned Astryx pattern for container-responsive layout).
// The container query lives in a plain <style> tag below so it needs NO CSS
// compiler. Image fill + radius are custom because Astryx has no image
// primitive (#2582).

// Named inline-size container on the page column so the grid responds to the
// available content width (works inside the sandbox's resizable preview).
const containerStyle: CSSProperties = {
  containerType: 'inline-size',
  containerName: 'gallery',
};
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

// 3 columns on desktop, dropping straight to 1 column below 720px (no 2-col
// middle state). minmax(0, 1fr) (not 1fr) so tracks split evenly and ignore the
// images' intrinsic min-width. The hero spans 2 columns on desktop, then fills
// the row once it's single-column.
const GALLERY_CSS = `
.mixed-gallery-grid {
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.mixed-gallery-hero {
  grid-column: span 2;
}
/* The hero image stretches to the row height instead of keeping its own
   ratio: a 3:1 hero spanning 2 columns + 1 gap is taller than the 3:2 sidebar
   by exactly gap/3, so ratio-driven heights can never align. The sidebar keeps
   its ratio (it defines the row height); the hero flex-fills the leftover cell
   height. flex-basis is 0px — not 0%: a percentage basis falls back to content
   size against the indefinite grid-row measurement, which would let the hero's
   own ratio define the row again. 0px contributes nothing, so the row follows
   the sidebar exactly (equal single-line captions keep the math exact), and
   the hero grows into it. AspectRatio's aspect-ratio yields once flex gives it
   a definite height; the svg slice-fills either way. */
.mixed-gallery-hero > :first-child {
  flex: 1 1 0px;
  min-height: 0;
}
@container gallery (max-width: 720px) {
  .mixed-gallery-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .mixed-gallery-hero {
    grid-column: 1 / -1;
  }
  /* Single column: no sibling defines the row, so the hero falls back to its
     own 3:1 ratio. */
  .mixed-gallery-hero > :first-child {
    flex: none;
  }
}
`;

// ─── Gallery Data ───────────────────────────────────────────────────────────

interface GalleryImage {
  title: string;
  hue: string;
}

// One accent per tile from the fixed badge vocabulary; the SVG scenes below
// resolve to Dracula tokens so tiles stay on-brand in the dark-only theme.
const IMAGES: GalleryImage[] = [
  {title: 'The castle at moonrise', hue: 'var(--dracula-purple)'},
  {title: 'Coven gathering', hue: 'var(--dracula-cyan)'},
  {title: 'Belfry view', hue: 'var(--dracula-pink)'},
  {title: 'Crypt archives', hue: 'var(--dracula-yellow)'},
  {title: 'Midnight garden', hue: 'var(--dracula-green)'},
];

// ─── Gallery Card ─────────────────────────────────────────────────────────
// Each tile is an image plus its caption (titles lived only in aria-labels
// before, leaving the tiles cryptic). AspectRatio gives every image a
// definite, self-contained height from its ratio, so images can't overflow
// their grid cell (no row-track guesswork). The hero image stretches to the
// row height instead via GALLERY_CSS (see above).

function GalleryCard({
  image,
  ratio,
  className,
}: {
  image: GalleryImage;
  ratio: number;
  className?: string;
}) {
  return (
    <VStack gap={2} className={className}>
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
          <style>{GALLERY_CSS}</style>
          <VStack gap={6} style={containerStyle}>
            {/* Header */}
            <VStack gap={2} hAlign="center">
              <Heading level={1} justify="center">
                Every corner of the castle, caught after dark.
              </Heading>
              <Text type="body" color="secondary" justify="center">
                Relics, sketches, and moonlit views from the coven archives —
                collected over one long Transylvanian night.
              </Text>
            </VStack>

            {/* Featured layout — a wide hero next to a single tile, above a row
                of three. The sidebar's 3:2 image defines the top-row height and
                the hero stretches to it exactly (equal captions keep the math
                exact). The bottom row is three equal 3:2 tiles. Responsive via
                @container: 3 columns → 1 column at ≤720px, where the hero
                falls back to its 3:1 ratio. */}
            <div className="mixed-gallery-grid">
              {/* Hero — spans 2 columns and stretches to the sidebar's height */}
              <GalleryCard
                image={IMAGES[0]}
                ratio={3 / 1}
                className="mixed-gallery-hero"
              />

              {/* Sidebar — its ratio defines the row height */}
              <GalleryCard image={IMAGES[2]} ratio={3 / 2} />

              {/* Bottom row — three equal tiles */}
              <GalleryCard image={IMAGES[3]} ratio={3 / 2} />
              <GalleryCard image={IMAGES[4]} ratio={3 / 2} />
              <GalleryCard image={IMAGES[1]} ratio={3 / 2} />
            </div>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
