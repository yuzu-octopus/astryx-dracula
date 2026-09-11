// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=0] > Ctr > V[g=8] > ((Ctr > S.transparent > V[g=4 a=center] > (V[g=2 a=center] > Hd"Hung after dark"[level=1] + Tx"A coven-curated wall"[t=body]) + (TL > Tab"All"! + Tab"Lifestyle" + Tab"Scenery" + Tab"Home") + Tx"10 pieces on the wall"[t=supporting]) + (G[c={min:260} g=4] > (C[p=0] > AR[ratio=3/2])*10))

import {useState, type CSSProperties} from 'react';
import {VStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Card} from '@astryxdesign/core/Card';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {SceneTile, SCENE_TILE_ALTS} from 'astryx-dracula/shared/scene-tile';

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
  {alt: SCENE_TILE_ALTS[0], category: 'scene'},
  {alt: SCENE_TILE_ALTS[1], category: 'lifestyle'},
  {alt: SCENE_TILE_ALTS[2], category: 'home'},
  {alt: SCENE_TILE_ALTS[3], category: 'scene'},
  {alt: SCENE_TILE_ALTS[4], category: 'lifestyle'},
  {alt: SCENE_TILE_ALTS[5], category: 'lifestyle'},
  {alt: SCENE_TILE_ALTS[6], category: 'scene'},
  {alt: SCENE_TILE_ALTS[7], category: 'home'},
  {alt: SCENE_TILE_ALTS[8], category: 'home'},
  {alt: 'Bats crossing a violet harvest moon', category: 'scene'},
];

// ─── Gallery Art ────────────────────────────────────────────────────────────
// Small mountain-glyph fork lives in shared/scene-tile; decorative stars
// resolve to comment here (never purple — purple means tappable).

function GalleryArt({image, index}: {image: GalleryImage; index: number}) {
  const hue = CATEGORY_HUES[image.category];
  return <SceneTile label={image.alt} hue={hue} size="sm" index={index} />;
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
                        and lamplit rooms. Filter by haunt and stay a while.
                        The gallery never sleeps.
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
