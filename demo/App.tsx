import { useState } from 'react';
import {
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
  StatusDot,
  Text,
  VStack,
} from '@astryxdesign/core';
import { Palette } from './Palette';
import { Gallery } from './Gallery';
import { Dashboard } from './Dashboard';
import { Quickstart } from './Quickstart';
import { SiteShell } from './Chrome';

const HERO_CODE = `import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import 'astryx-dracula/tokens.css';
import 'astryx-dracula/theme.css';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`;

export default function App() {
  const [applied, setApplied] = useState(false);

  return (
    <SiteShell
      onCta={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}
    >
            {/* HERO SECTION */}
            <section id="top">
              <Grid columns={{ minWidth: 280, max: 2 }} gap={6} align="center">
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
                  padding={3}
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
    </SiteShell>
  );
}
