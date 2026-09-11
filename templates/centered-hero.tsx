// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > V[g=10] > ((V[g=6 a=center] > (V[g=3 a=center] > Hd"Small joys for creatures of the night"[level=1 t=display-2] + Tx"Sometimes all it takes is one small ritual to turn the whole night around."[t=body] + Tx"astryx-dracula v0.2.1"[t=supporting]) + (H[j=center g=3] > B.primary"Embrace the night" + B.secondary"Read the lore")) + (S.transparent[p=0] > AR[ratio=16/9]))

import type {CSSProperties} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Section} from '@astryxdesign/core/Section';
import {ArrowRight} from 'lucide-react';
import {SceneCastle} from 'astryx-dracula/shared/scene-castle';

// Wide castle banner lives in shared/scene-castle (`wide` variant: harvest
// moon, fg-stroke bats, comment first star group). Frame keeps the page radius
// + separator border; the scene fills the AspectRatio box via gallery-image.
const heroFrame: CSSProperties = {
  maxWidth: 1200,
  marginInline: 'auto',
  borderRadius: 'var(--radius-page)',
  border: 'var(--border-width) solid var(--color-separator)',
  overflow: 'clip',
};

export default function CenteredHero() {
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
                <Text
                  type="supporting"
                  color="secondary"
                  justify="center"
                  hasTabularNumbers>
                  astryx-dracula v0.2.1
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
                <SceneCastle variant="wide" />
              </AspectRatio>
            </Section>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
