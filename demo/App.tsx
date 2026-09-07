import { useEffect, useState } from 'react';
import { AppShell, Badge, Banner, Button, Card, CodeBlock, Divider, Heading, Link, Text, TopNav } from '@astryxdesign/core';
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
    const q = window.matchMedia('(max-width: 640px)');
    setNarrow(q.matches);
    const fn = (e: MediaQueryListEvent) => setNarrow(e.matches);
    q.addEventListener('change', fn);
    return () => q.removeEventListener('change', fn);
  }, []);
  return (
    <Theme theme={astryxStylesTheme} mode="dark">
      <AppShell
        height="auto"
        contentPadding={4}
        topNav={
          <TopNav
            heading={
              <Text>
                Astryx Dracula <Badge label="dark-only" variant="purple" />
              </Text>
            }
            endContent={
              narrow ? (
                <Button label="Use this theme" variant="primary" onClick={() => document.getElementById('quickstart')?.scrollIntoView()} />
              ) : (
                <>
                  <Link href="https://github.com/yuzu-octopus/astryx-theme">GitHub</Link>
                  <Link href="./llms.txt">llms.txt</Link>
                  <Button label="Use this theme" variant="primary" onClick={() => document.getElementById('quickstart')?.scrollIntoView()} />
                </>
              )
            }
          />
        }
      >
        <section id="top">
          <Card padding={6}>
            <Heading level={1}>Dracula, live in every component</Heading>
            <Text>Pure Dracula brand kit for Astryx sites. Full token system, syntax highlighting, chart colors. Prebuilt CSS, zero runtime cost.</Text>
            <Button label={applied ? 'Theme applied' : 'Apply the theme'} variant="primary" onClick={() => setApplied(!applied)} />
            <Link href="https://draculatheme.com">Purple means tappable</Link>
            {applied && <Banner status="success" title="Theme applied" />}
          </Card>
          <CodeBlock code={HERO_CODE} language="tsx" title="wrap-your-app.tsx" hasLineNumbers isWrapped />
        </section>
        <Divider />
        <section id="palette">
          <Palette />
        </section>
        <Divider />
        <section id="dashboard">
          <Dashboard />
        </section>
        <Divider />
        <section id="components">
          <Gallery />
        </section>
        <Divider />
        <section id="quickstart">
          <Quickstart />
        </section>
        <Divider />
        <Text>Copy the kit, read the skill, ship dark interfaces. Dracula spec at draculatheme.com.</Text>
      </AppShell>
    </Theme>
  );
}
