// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=10] > (V[g=6 a=center] > (V[g=3 a=center] > Hd"Little haunts, everywhere you roam"[level=1 t=display-2] + Tx"Sometimes all it takes"[t=body]) + (H[j=center g=3] > B.primary"Enter the gallery" + B.secondary"Read the lore")) + (G[c={min:200} g=4] > AR*3)

import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Grid} from '@astryxdesign/core/Grid';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {ArrowRight} from 'lucide-react';

// NOTE: The only custom styling here is gallery fill + corner radius. It
// exists because Astryx has no image primitive — AspectRatio exposes no
// objectFit or radius props and there's no Image. Tracked in issue #2582;
// replace these with component props once it lands.
// Fills the AspectRatio box. No objectFit prop on AspectRatio (#2582).
const galleryImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
// Rounds the gallery corners. No radius prop on AspectRatio (#2582);
// overflow clip masks the SVG scene to the rounded corners.
const galleryImageClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};

function NightCastleScene() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Moonlit castle on midnight hills">
      <title>Castle under a harvest moon</title>
      <rect width="400" height="500" fill="var(--dracula-bg-dark)" />
      <g fill="var(--dracula-purple)">
        <circle cx="50" cy="60" r="2.5" />
        <circle cx="140" cy="130" r="2" />
        <circle cx="240" cy="50" r="2.5" />
        <circle cx="330" cy="110" r="2" />
        <circle cx="300" cy="200" r="2.5" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="95" cy="90" r="2" />
        <circle cx="200" cy="100" r="2.5" />
        <circle cx="360" cy="60" r="2" />
      </g>
      <circle cx="290" cy="120" r="52" fill="var(--dracula-yellow)" />
      <circle
        cx="272"
        cy="106"
        r="9"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="var(--dracula-purple)"
        strokeWidth={4}
        strokeLinecap="round">
        <path d="M70 170 q12 -12 24 0 q12 -12 24 0" />
        <path d="M150 130 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path
        d="M0 360 Q140 300 260 350 T400 335 V500 H0 Z"
        fill="var(--dracula-selection)"
      />
      <path
        d="M0 420 Q160 365 300 410 T400 400 V500 H0 Z"
        fill="var(--dracula-bg-light)"
      />
      <g>
        <rect
          x="140"
          y="270"
          width="120"
          height="110"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="118"
          y="235"
          width="44"
          height="145"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="238"
          y="235"
          width="44"
          height="145"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <g fill="var(--dracula-yellow)">
          <rect x="160" y="300" width="14" height="20" rx={2} />
          <rect x="196" y="300" width="14" height="20" rx={2} />
          <rect x="232" y="300" width="14" height="20" rx={2} />
          <rect x="131" y="262" width="10" height="14" rx={2} />
          <rect x="253" y="262" width="10" height="14" rx={2} />
        </g>
        <path
          d="M185 380 v-28 a15 15 0 0 1 30 0 v28 Z"
          fill="var(--dracula-bg-dark)"
        />
      </g>
    </svg>
  );
}

function HarvestMoonScene() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Harvest moon over midnight pines">
      <title>Harvest moon over the pines</title>
      <rect width="400" height="500" fill="var(--dracula-bg-dark)" />
      <g fill="var(--dracula-pink)">
        <circle cx="60" cy="80" r="2" />
        <circle cx="160" cy="50" r="2.5" />
        <circle cx="320" cy="70" r="2" />
        <circle cx="90" cy="190" r="2.5" />
        <circle cx="250" cy="160" r="2" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="110" cy="120" r="2" />
        <circle cx="220" cy="90" r="2" />
        <circle cx="350" cy="150" r="2.5" />
      </g>
      <circle cx="200" cy="190" r="72" fill="var(--dracula-yellow)" />
      <circle
        cx="176"
        cy="170"
        r="12"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <circle
        cx="222"
        cy="210"
        r="8"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="var(--dracula-purple)"
        strokeWidth={4}
        strokeLinecap="round">
        <path d="M90 260 q12 -12 24 0 q12 -12 24 0" />
        <path d="M260 250 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path
        d="M0 380 Q200 320 400 370 V500 H0 Z"
        fill="var(--dracula-selection)"
      />
      <g fill="var(--dracula-bg-light)">
        <path d="M70 500 V400 l28 -44 28 44 v100 Z" />
        <path d="M170 500 V420 l28 -44 28 44 v80 Z" />
        <path d="M270 500 V410 l28 -44 28 44 v90 Z" />
      </g>
      <g fill="var(--dracula-yellow)">
        <rect x="81" y="442" width="8" height="12" rx={2} />
        <rect x="181" y="458" width="8" height="12" rx={2} />
        <rect x="281" y="450" width="8" height="12" rx={2} />
      </g>
    </svg>
  );
}

function BatFlightScene() {
  return (
    <svg
      style={galleryImage}
      viewBox="0 0 400 500"
      role="img"
      aria-label="Bats crossing a violet night sky">
      <title>Bats over violet hills</title>
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
  {alt: 'Moonlit castle on midnight hills', scene: <NightCastleScene />},
  {alt: 'Harvest moon over midnight pines', scene: <HarvestMoonScene />},
  {alt: 'Bats crossing a violet night sky', scene: <BatFlightScene />},
];

export default function GalleryHero() {
  return (
    <Layout
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
