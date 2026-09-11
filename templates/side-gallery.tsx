// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > G[c={min:280} g8 a=center] > (V[g6] > (V[g3] > Tx"AFTER DARK"[t=supporting] + Hd"Make every night"[level=1] + Tx"The smallest rituals"[t=body]) + B.primary"Explore the night" + (V[g4] > D + (H[g6] > (V > Tx"12k+"[t=large] + Tx"Night shots"[t=supporting])*3))) + (G[c3 g3] > AR*9)

import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';
import {Divider} from '@astryxdesign/core/Divider';
import {galleryImageClip} from 'astryx-dracula/shared/gallery-image';
import {SceneTile, SCENE_TILE_ALTS} from 'astryx-dracula/shared/scene-tile';

// ─── Gallery Data ─────────────────────────────────────────────────────────────

// One Dracula accent per tile from the fixed categorical vocabulary; alts are
// shared with classic-gallery via SCENE_TILE_ALTS.
const GALLERY_SCENES = [
  {alt: SCENE_TILE_ALTS[0], hue: 'var(--dracula-cyan)'},
  {alt: SCENE_TILE_ALTS[1], hue: 'var(--dracula-pink)'},
  {alt: SCENE_TILE_ALTS[2], hue: 'var(--dracula-yellow)'},
  {alt: SCENE_TILE_ALTS[3], hue: 'var(--dracula-green)'},
  {alt: SCENE_TILE_ALTS[4], hue: 'var(--dracula-pink)'},
  {alt: SCENE_TILE_ALTS[5], hue: 'var(--dracula-orange)'},
  {alt: SCENE_TILE_ALTS[6], hue: 'var(--dracula-cyan)'},
  {alt: SCENE_TILE_ALTS[7], hue: 'var(--dracula-yellow)'},
  {alt: SCENE_TILE_ALTS[8], hue: 'var(--dracula-green)'},
];

// ─── Stat Block ─────────────────────────────────────────────────────────────

function StatBlock({value, label}: {value: string; label: string}) {
  return (
    <VStack gap={0}>
      <Text type="large" weight="semibold" hasTabularNumbers>
        {value}
      </Text>
      <Text type="supporting" color="secondary">
        {label}
      </Text>
    </VStack>
  );
}

// ─── Image Grid ─────────────────────────────────────────────────────────────

function ImageGrid() {
  return (
    <Grid columns={3} gap={3}>
      {GALLERY_SCENES.map((scene, index) => (
        <AspectRatio key={scene.alt} ratio={1} style={galleryImageClip}>
          <SceneTile
            label={scene.alt}
            hue={scene.hue}
            size="sm"
            index={index}
          />
        </AspectRatio>
      ))}
    </Grid>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SideGallery() {
  return (
    <Layout
      height="fill"
      contentWidth={1400}
      content={
        <LayoutContent padding={6}>
          <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={8} align="center">
            {/* Left side: Text + CTA */}
            <VStack gap={6} vAlign="center">
              <VStack gap={3}>
                <Text type="supporting" color="secondary" weight="semibold">
                  AFTER DARK
                </Text>
                <Heading level={1}>
                  Make every night a little more spellbinding, one small ritual
                  at a time.
                </Heading>
                <Text type="body" color="secondary">
                  The smallest rituals are the ones that matter most. A little
                  lamplight that catches your eye and makes you pause;
                  that&apos;s what turns an ordinary evening into something
                  worth remembering.
                </Text>
              </VStack>

              <Button label="Explore the night" variant="primary" />

              <VStack gap={4}>
                <Divider />
                <HStack gap={6}>
                  <StatBlock value="12k+" label="Night shots" />
                  <StatBlock value="350+" label="Dark builds" />
                  <StatBlock value="8yrs" label="Years prowling" />
                </HStack>
              </VStack>
            </VStack>

            {/* Right side: Image Grid */}
            <ImageGrid />
          </Grid>
        </LayoutContent>
      }
    />
  );
}
