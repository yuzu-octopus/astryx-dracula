import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AppShell,
  Badge,
  Button,
  Card,
  HStack,
  Link,
  Section,
  StatusDot,
  Text,
  TopNav,
  VStack,
} from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';

// Shared showcase chrome: top bar plus centered section plus footer.
// Template detail pages keep their minimal breadcrumb bar instead.
export function SiteShell({
  children,
  ctaHref,
  onCta,
}: {
  children: ReactNode;
  ctaHref?: string;
  onCta?: () => void;
}) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const q = window.matchMedia('(max-width: 768px)');
    setNarrow(q.matches);
    const fn = (e: MediaQueryListEvent) => setNarrow(e.matches);
    q.addEventListener('change', fn);
    return () => q.removeEventListener('change', fn);
  }, []);

  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <AppShell
        height="auto"
        contentPadding={0}
        topNav={
          <TopNav
            heading={
              <HStack gap={1.5} vAlign="center">
                <StatusDot variant="accent" label="Dracula" isPulsing />
                <Text weight="semibold">Astryx Dracula</Text>
                {!narrow && <Badge label="dark-only" variant="purple" />}
              </HStack>
            }
            startContent={
              !narrow ? (
                <HStack gap={3} vAlign="center">
                  <Link href="#palette">Palette</Link>
                  <Link href="#dashboard">Dashboard</Link>
                  <Link href="#components">Components</Link>
                  <Link href="#quickstart">Quickstart</Link>
                  <Link href="#/templates">Templates</Link>
                  <Link href="#/bento">Bento</Link>
                </HStack>
              ) : undefined
            }
            endContent={
              <HStack gap={2} vAlign="center">
                {!narrow && (
                  <>
                    <Link href="https://github.com/yuzu-octopus/astryx-dracula" isExternalLink>
                      GitHub
                    </Link>
                    <Link href="./llms.txt">llms.txt</Link>
                  </>
                )}
                <Button label="Use this theme" variant="primary" href={ctaHref} onClick={onCta} />
              </HStack>
            }
          />
        }
      >
        <Section
          variant="transparent"
          padding={0}
          style={{
            maxWidth: '1160px',
            marginInline: 'auto',
            width: '100%',
            paddingInline: 'var(--spacing-4)',
            paddingBlock: 'var(--spacing-8)',
          }}
        >
          <VStack gap={10}>
            {children}
            <Card
              padding={4}
              style={{
                backgroundColor: 'var(--color-background)',
                border: 'var(--border-width) solid var(--color-separator)',
              }}
            >
              <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
                <VStack gap={0.5}>
                  <Text weight="semibold">Astryx Dracula Theme</Text>
                  <Text type="supporting" color="secondary">
                    Copy the kit, read the skill, ship dark interfaces. Dracula spec at{' '}
                    <Link href="https://draculatheme.com" target="_blank" rel="noopener noreferrer">
                      draculatheme.com
                    </Link>
                    .
                  </Text>
                </VStack>
                <HStack gap={2} vAlign="center">
                  <Link href="https://github.com/yuzu-octopus/astryx-dracula" isExternalLink>
                    GitHub
                  </Link>
                  <Link href="./llms.txt">llms.txt</Link>
                </HStack>
              </HStack>
            </Card>
          </VStack>
        </Section>
      </AppShell>
    </Theme>
  );
}
