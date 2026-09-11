// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > G[c={min:280} g8 a=center] > (V[g6] > (V[g3] > Tx"AFTER DARK"[t=supporting] + Hd"Make every night"[level=1] + Tx"The smallest rituals"[t=body]) + B.primary"Explore the night" + (V[g4] > D + (H[g6] > (V > Tx"12k+"[t=large] + Tx"Night shots"[t=supporting])*3))) + (G[c3 g3] > AR*9)

import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';
import {Divider} from '@astryxdesign/core/Divider';

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

// ─── Gallery Data ─────────────────────────────────────────────────────────────

// One Dracula accent per tile from the fixed categorical vocabulary.
const GALLERY_SCENES = [
  {alt: 'Moonlit ridge trail under a harvest moon', hue: 'var(--dracula-cyan)'},
  {alt: 'Late portrait in violet lamplight', hue: 'var(--dracula-pink)'},
  {
    alt: 'Lamplit reading nook after midnight',
    hue: 'var(--dracula-yellow)',
  },
  {alt: 'Fog rolling over the night pines', hue: 'var(--dracula-green)'},
  {alt: 'Dancer caught mid-step in stage pink', hue: 'var(--dracula-pink)'},
  {
    alt: 'Kitchen table set for a midnight feast',
    hue: 'var(--dracula-orange)',
  },
  {alt: 'Castle silhouette over sleeping hills', hue: 'var(--dracula-cyan)'},
  {alt: 'Attic window glowing amber at 2am', hue: 'var(--dracula-yellow)'},
  {alt: 'Cellar shelves lined with bottled dusk', hue: 'var(--dracula-green)'},
];

// ─── Gallery Art ────────────────────────────────────────────────────────────

function NightScene({alt, hue, index}: {alt: string; hue: string; index: number}) {
  const moonX = 90 + ((index * 53) % 220);
  const moonY = 62 + ((index * 29) % 60);
  const hillA = 190 + ((index * 13) % 40);
  const hillB = 215 + ((index * 17) % 40);
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={galleryImage}
      role="img"
      aria-label={alt}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      <g fill="var(--dracula-comment)" opacity={0.55}>
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
        <rect x="-22" y="-22" width="44" height="44" rx={4} />
        <circle cx="9" cy="-9" r="2" fill={hue} stroke="none" />
        <path d="M-17 15 L-4 0 L5 9 L10 4 L17 12" />
      </g>
    </svg>
  );
}

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
          <NightScene alt={scene.alt} hue={scene.hue} index={index} />
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
