import { useEffect, useState } from 'react';
import {
  AppShell,
  Badge,
  Banner,
  Button,
  Card,
  CodeBlock,
  Divider,
  Grid,
  Heading,
  HStack,
  Link,
  Section,
  StatusDot,
  Text,
  TopNav,
  VStack,
} from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxStylesTheme } from '../astryx-theme';
import { Palette } from './Palette';
import { Gallery } from './Gallery';
import { Dashboard } from './Dashboard';
import { Quickstart } from './Quickstart';

const HERO_CODE = `import { astryxDraculaTheme } from './astryx-dracula';
import './theme.css';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`;

export default function App() {
  const [applied, setApplied] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const q = window.matchMedia('(max-width: 768px)');
    setNarrow(q.matches);
    const fn = (e: MediaQueryListEvent) => setNarrow(e.matches);
    q.addEventListener('change', fn);
    return () => q.removeEventListener('change', fn);
  }, []);

  return (
    <Theme theme={astryxStylesTheme} mode="dark">
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
                </HStack>
              ) : undefined
            }
            endContent={
              <HStack gap={2} vAlign="center">
                {!narrow && (
                  <>
                    <Link href="https://github.com/yuzu-octopus/astryx-theme" isExternalLink>
                      GitHub
                    </Link>
                    <Link href="./llms.txt">llms.txt</Link>
                  </>
                )}
                <Button
                  label="Use this theme"
                  variant="primary"
                  onClick={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}
                />
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
            {/* HERO SECTION */}
            <section id="top">
              <Grid columns={{ minWidth: 340, max: 2 }} gap={6} align="center">
                <VStack gap={4}>
                  <HStack gap={2} vAlign="center" wrap="wrap">
                    <StatusDot variant="success" label="Active Spec" />
                    <Text type="supporting" color="secondary">
                      Dracula Classic · 12 Spec Tokens · WCAG AA
                    </Text>
                  </HStack>

                  <VStack gap={2}>
                    <Heading level={1} type="display-2">
                      Dracula, live in every component
                    </Heading>
                    <Text type="large" color="secondary">
                      Pure Dracula brand kit for Astryx sites. Full token system, syntax highlighting, chart colors. Prebuilt CSS, zero runtime cost.
                    </Text>
                  </VStack>

                  <HStack gap={3} vAlign="center" wrap="wrap">
                    <Button
                      label={applied ? 'Theme applied' : 'Apply the theme'}
                      variant="primary"
                      onClick={() => setApplied(!applied)}
                    />
                    <Link href="https://draculatheme.com" isExternalLink>
                      Purple means tappable
                    </Link>
                  </HStack>

                  {applied && (
                    <Banner
                      status="success"
                      title="Theme applied"
                      description="All 155 Astryx components resolving Dracula tokens with zero runtime overhead."
                    />
                  )}

                  <HStack gap={1.5} wrap="wrap">
                    <Badge label="0.0 kB runtime" variant="neutral" />
                    <Badge label="12 spec tokens" variant="purple" />
                    <Badge label="4.5:1+ contrast" variant="green" />
                    <Badge label="JetBrains Mono" variant="cyan" />
                  </HStack>
                </VStack>

                <Card
                  padding={2}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: 'var(--border-width) solid var(--color-separator)',
                  }}
                >
                  <CodeBlock
                    code={HERO_CODE}
                    language="tsx"
                    title="wrap-your-app.tsx"
                    hasLineNumbers
                    isWrapped
                    width="100%"
                  />
                </Card>
              </Grid>
            </section>

            <Divider />

            {/* PALETTE SECTION */}
            <section id="palette">
              <Palette />
            </section>

            <Divider />

            {/* DASHBOARD SECTION */}
            <section id="dashboard">
              <Dashboard />
            </section>

            <Divider />

            {/* COMPONENTS SECTION */}
            <section id="components">
              <Gallery />
            </section>

            <Divider />

            {/* QUICKSTART SECTION */}
            <section id="quickstart">
              <Quickstart />
            </section>

            <Divider />

            {/* FOOTER */}
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
                    <Link href="https://draculatheme.com" isExternalLink>
                      draculatheme.com
                    </Link>
                    .
                  </Text>
                </VStack>
                <HStack gap={2} vAlign="center">
                  <Link href="https://github.com/yuzu-octopus/astryx-theme" isExternalLink>
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
