// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=10] > (V[g=6 a=center] > (V[g=3 a=center] > Hd"Little haunts, everywhere you roam"[level=1 t=display-2] + Tx"Sometimes all it takes"[t=body]) + (H[j=center g=3] > B.primary"Enter the gallery" + B.secondary"Read the lore")) + (G[c={min:200} g=4] > AR*3)

import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Grid} from '@astryxdesign/core/Grid';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {ArrowRight} from 'lucide-react';
import {galleryImage, galleryImageClip} from 'astryx-dracula/shared/gallery-image';
import {SceneCastle} from 'astryx-dracula/shared/scene-castle';

// Castle + pines banners live in shared/scene-castle (`card`/`tall` variants:
// harvest-yellow moon, fg-stroke bats, per-scene hill constants). Fill +
// radius-clip live in shared/gallery-image (no Image primitive, #2582).
// The bats tile stays local: it is deliberately moonless-magic (the violet
// disc is ambient glow, not a moon — the alt names the violet sky), so the
// harvest-yellow rule does not apply; yellowing it would duplicate the pines
// tile instead.

function BatFlightScene() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Bats crossing a violet night sky">
      <rect width="400" height="500" fill="var(--dracula-bg-dark)" />
      <circle cx="200" cy="140" r="60" fill="var(--dracula-purple)" />
      <circle
        cx="200"
        cy="140"
        r="60"
        fill="none"
        stroke="var(--dracula-pink)"
        strokeWidth={3}
        opacity={0.6}
      />
      <g fill="var(--dracula-cyan)">
        <circle cx="60" cy="70" r="2" />
        <circle cx="150" cy="40" r="2.5" />
        <circle cx="260" cy="60" r="2" />
        <circle cx="340" cy="110" r="2.5" />
        <circle cx="100" cy="160" r="2" />
      </g>
      <g
        fill="none"
        stroke="var(--dracula-fg)"
        strokeWidth={4}
        strokeLinecap="round">
        <path d="M110 220 q12 -12 24 0 q12 -12 24 0" />
        <path d="M200 180 q12 -12 24 0 q12 -12 24 0" />
        <path d="M250 260 q9 -9 18 0 q9 -9 18 0" />
        <path d="M140 300 q9 -9 18 0 q9 -9 18 0" />
        <path d="M290 320 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path
        d="M0 370 Q140 310 270 355 T400 345 V500 H0 Z"
        fill="var(--dracula-bg-lighter)"
      />
      <path
        d="M0 430 Q180 375 400 415 V500 H0 Z"
        fill="var(--dracula-selection)"
      />
      <g fill="var(--dracula-green)">
        <circle cx="80" cy="440" r="6" />
        <circle cx="200" cy="455" r="6" />
        <circle cx="320" cy="445" r="6" />
      </g>
    </svg>
  );
}

const SCENES = [
  {alt: 'Moonlit castle on midnight hills', scene: <SceneCastle variant="card" />},
  {alt: 'Harvest moon over midnight pines', scene: <SceneCastle variant="tall" />},
  {alt: 'Bats crossing a violet night sky', scene: <BatFlightScene />},
];

export default function GalleryHero() {
  return (
    <Layout
      height="auto"
      content={
        <LayoutContent padding={6}>
          <VStack gap={10}>
            <VStack gap={6} hAlign="center">
              <VStack gap={3} hAlign="center">
                <Heading
                  level={1}
                  type="display-2"
                  justify="center"
                  textWrap="balance">
                  Little haunts, everywhere you roam
                </Heading>
                <Text
                  type="body"
                  color="secondary"
                  justify="center"
                  textWrap="balance">
                  Sometimes all it takes is one small shadow to turn the whole
                  night around.
                </Text>
              </VStack>
              <HStack gap={3} wrap="wrap" justify="center">
                <Button
                  label="Enter the gallery"
                  variant="primary"
                  endContent={
                    <Icon icon={ArrowRight} size="sm" color="inherit" />
                  }
                />
                <Button label="Read the lore" variant="secondary" />
              </HStack>
            </VStack>
            <Grid columns={{minWidth: 200, repeat: 'fit'}} gap={4}>
              {SCENES.map(item => (
                <AspectRatio
                  key={item.alt}
                  ratio={4 / 5}
                  style={galleryImageClip}>
                  {item.scene}
                </AspectRatio>
              ))}
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
