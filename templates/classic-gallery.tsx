// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type CSSProperties} from 'react';
import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Card} from '@astryxdesign/core/Card';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {TabList, Tab} from '@astryxdesign/core/TabList';

// ─── Styles ─────────────────────────────────────────────────────────────────

const outer: CSSProperties = {
  maxWidth: 1200,
  width: '100%',
  paddingInline: 'var(--space-viewport)',
  paddingBlock: 'var(--space-viewport)',
};
const frameClip: CSSProperties = {
  overflow: 'clip',
};
const artImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
const textCenter: CSSProperties = {
  textAlign: 'center',
};

// ─── Gallery Data ───────────────────────────────────────────────────────────

type Category = 'all' | 'lifestyle' | 'scene' | 'home';

interface GalleryImage {
  alt: string;
  category: Exclude<Category, 'all'>;
}

// Dracula accent per gallery shelf.
const CATEGORY_HUES: Record<Exclude<Category, 'all'>, string> = {
  scene: 'var(--dracula-cyan)',
  lifestyle: 'var(--dracula-pink)',
  home: 'var(--dracula-yellow)',
};

const GALLERY_IMAGES: GalleryImage[] = [
  {alt: 'Moonlit ridge trail under a harvest moon', category: 'scene'},
  {alt: 'Late portrait in violet lamplight', category: 'lifestyle'},
  {alt: 'Lamplit reading nook after midnight', category: 'home'},
  {alt: 'Fog rolling over the night pines', category: 'scene'},
  {alt: 'Dancer caught mid-step in stage pink', category: 'lifestyle'},
  {alt: 'Kitchen table set for a midnight feast', category: 'lifestyle'},
  {alt: 'Castle silhouette over sleeping hills', category: 'scene'},
  {alt: 'Attic window glowing amber at 2am', category: 'home'},
  {alt: 'Cellar shelves lined with bottled dusk', category: 'home'},
  {alt: 'Bats crossing a violet harvest moon', category: 'scene'},
];

// ─── Gallery Art ────────────────────────────────────────────────────────────

function GalleryArt({image, index}: {image: GalleryImage; index: number}) {
  const hue = CATEGORY_HUES[image.category];
  const moonX = 90 + ((index * 53) % 220);
  const moonY = 62 + ((index * 29) % 60);
  const hillA = 190 + ((index * 13) % 40);
  const hillB = 215 + ((index * 17) % 40);
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={artImage}
      role="img"
      aria-label={image.alt}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      <g fill="var(--dracula-purple)" opacity={0.55}>
        <circle cx={40 + ((index * 37) % 320)} cy={30} r={2} />
        <circle cx={120 + ((index * 23) % 200)} cy={52} r={1.6} />
        <circle cx={260 + ((index * 11) % 110)} cy={26} r={2.2} />
        <circle cx={330} cy={70 + ((index * 7) % 30)} r={1.6} />
      </g>
      <circle cx={moonX} cy={moonY} r={34} fill={hue} opacity={0.9} />
      <circle
        cx={moonX - 12}
        cy={moonY - 8}
        r={28}
        fill="var(--dracula-bg-light)"
        opacity={0.55}
      />
      <path
        d={`M0 ${hillA} Q100 ${hillA - 50} 200 ${hillA - 10} T400 ${hillA - 30} V300 H0 Z`}
        fill="var(--dracula-current-line)"
      />
      <path
        d={`M0 ${hillB} Q120 ${hillB - 40} 240 ${hillB} T400 ${hillB - 20} V300 H0 Z`}
        fill="var(--dracula-bg)"
      />
      <g
        transform={`translate(${60 + ((index * 41) % 280)} ${hillB - 34})`}
        fill="none"
        stroke={hue}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="-22" y="-22" width="44" height="44" rx="5" />
        <circle cx="9" cy="-9" r="2" fill={hue} stroke="none" />
        <path d="M-17 15 L-4 0 L5 9 L10 4 L17 12" />
      </g>
    </svg>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function ClassicGallery() {
  const [filter, setFilter] = useState<Category>('all');

  const filteredImages =
    filter === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={0}>
          <Center axis="horizontal">
            <VStack gap={8} style={outer}>
              {/* Header */}
              <Center axis="horizontal">
                <Section variant="transparent" maxWidth={680} padding={0}>
                  <VStack gap={4} hAlign="center" style={textCenter}>
                    <VStack gap={2} hAlign="center">
                      <Heading level={1}>Hung after dark</Heading>
                      <Text type="body" color="secondary">
                        A coven-curated wall of moonlit ridges, late portraits,
                        and lamplit rooms. Filter by haunt and stay a while —
                        the gallery never sleeps.
                      </Text>
                    </VStack>

                    <TabList
                      value={filter}
                      onChange={v => setFilter(v as Category)}>
                      <Tab value="all" label="All" />
                      <Tab value="lifestyle" label="Lifestyle" />
                      <Tab value="scene" label="Scenery" />
                      <Tab value="home" label="Home" />
                    </TabList>
                    <Text
                      type="supporting"
                      color="secondary"
                      hasTabularNumbers>
                      {filteredImages.length}{' '}
                      {filteredImages.length === 1 ? 'piece' : 'pieces'} on the
                      wall
                    </Text>
                  </VStack>
                </Section>
              </Center>

              {/* Gallery Grid */}
              <Grid columns={{minWidth: 260, repeat: 'fit'}} gap={4}>
                {filteredImages.map((image, i) => (
                  <Card key={image.alt} padding={0} style={frameClip}>
                    <AspectRatio ratio={3 / 2}>
                      <GalleryArt image={image} index={i} />
                    </AspectRatio>
                  </Card>
                ))}
              </Grid>
            </VStack>
          </Center>
        </LayoutContent>
      }
    />
  );
}
