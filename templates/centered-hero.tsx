// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=10] > ((V[g=6 a=center] > (V[g=3 a=center] > Hd"Small joys for creatures of the night"[level=1 t=display-2] + Tx"Sometimes all it takes is one small ritual to turn the whole night around."[t=body]) + (H[j=center g=3] > B.primary"Embrace the night" + B.secondary"Read the lore")) + (S.transparent[p=0] > AR[ratio=16/9]))

import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Section} from '@astryxdesign/core/Section';
import {ArrowRight} from 'lucide-react';

const heroImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
const heroFrame: CSSProperties = {
  maxWidth: 1200,
  marginInline: 'auto',
  borderRadius: 'var(--radius-page)',
  border: 'var(--border-width) solid var(--color-separator)',
  overflow: 'clip',
};

function NightCastleScene() {
  return (
    <svg
      style={heroImage}
      viewBox="0 0 800 450"
      role="img"
      aria-label="Moonlit castle on a hill in Dracula theme colors">
      <title>Castle under a harvest moon</title>
      <rect width="800" height="450" fill="var(--dracula-bg-dark)" />
      {/* Stars */}
      <g fill="var(--dracula-purple)">
        <circle cx="60" cy="60" r="2.5" />
        <circle cx="180" cy="120" r="2" />
        <circle cx="330" cy="50" r="2.5" />
        <circle cx="470" cy="90" r="2" />
        <circle cx="700" cy="200" r="2.5" />
        <circle cx="750" cy="80" r="2" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="120" cy="90" r="2" />
        <circle cx="270" cy="70" r="2.5" />
        <circle cx="540" cy="50" r="2" />
        <circle cx="660" cy="160" r="2" />
      </g>
      <g fill="var(--dracula-pink)">
        <circle cx="90" cy="170" r="2" />
        <circle cx="400" cy="130" r="2.5" />
        <circle cx="590" cy="200" r="2" />
        <circle cx="730" cy="260" r="2" />
      </g>
      {/* Harvest moon */}
      <circle cx="620" cy="110" r="56" fill="var(--dracula-yellow)" />
      <circle
        cx="600"
        cy="95"
        r="10"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <circle
        cx="638"
        cy="125"
        r="7"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      {/* Bats */}
      <g
        fill="none"
        stroke="var(--dracula-purple)"
        strokeWidth={4}
        strokeLinecap="round">
        <path d="M120 130 q12 -12 24 0 q12 -12 24 0" />
        <path d="M210 90 q9 -9 18 0 q9 -9 18 0" />
        <path d="M470 160 q9 -9 18 0 q9 -9 18 0" />
      </g>
      {/* Hills */}
      <path
        d="M0 330 Q200 260 400 320 T800 300 V450 H0 Z"
        fill="var(--dracula-selection)"
      />
      <path
        d="M0 385 Q240 320 480 375 T800 360 V450 H0 Z"
        fill="var(--dracula-bg-light)"
      />
      {/* Castle */}
      <g>
        <rect
          x="150"
          y="225"
          width="120"
          height="120"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="130"
          y="185"
          width="44"
          height="160"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="246"
          y="185"
          width="44"
          height="160"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <g fill="var(--dracula-bg-lighter)">
          <rect x="130" y="175" width="12" height="14" rx={2} />
          <rect x="149" y="175" width="12" height="14" rx={2} />
          <rect x="246" y="175" width="12" height="14" rx={2} />
          <rect x="265" y="175" width="12" height="14" rx={2} />
          <rect x="150" y="215" width="14" height="16" rx={2} />
          <rect x="173" y="215" width="14" height="16" rx={2} />
          <rect x="196" y="215" width="14" height="16" rx={2} />
          <rect x="219" y="215" width="14" height="16" rx={2} />
          <rect x="242" y="215" width="14" height="16" rx={2} />
        </g>
        <g fill="var(--dracula-yellow)">
          <rect x="168" y="255" width="14" height="20" rx={2} />
          <rect x="203" y="255" width="14" height="20" rx={2} />
          <rect x="238" y="255" width="14" height="20" rx={2} />
          <rect x="143" y="215" width="10" height="14" rx={2} />
          <rect x="259" y="215" width="10" height="14" rx={2} />
        </g>
        <path
          d="M195 345 v-30 a15 15 0 0 1 30 0 v30 Z"
          fill="var(--dracula-bg-dark)"
        />
      </g>
    </svg>
  );
}

export default function CenteredHero() {
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
                  Small joys for creatures of the night
                </Heading>
                <Text
                  type="body"
                  color="secondary"
                  justify="center"
                  textWrap="balance">
                  Sometimes all it takes is one small ritual to turn the whole
                  night around.
                </Text>
              </VStack>
              <HStack gap={3} wrap="wrap" justify="center">
                <Button
                  label="Embrace the night"
                  variant="primary"
                  endContent={
                    <Icon icon={ArrowRight} size="sm" color="inherit" />
                  }
                />
                <Button label="Read the lore" variant="secondary" />
              </HStack>
            </VStack>
            <Section variant="transparent" padding={0}>
              <AspectRatio ratio={16 / 9} style={heroFrame}>
                <NightCastleScene />
              </AspectRatio>
            </Section>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
