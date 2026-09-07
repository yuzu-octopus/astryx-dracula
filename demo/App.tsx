import { useState } from 'react';
import { Badge, Banner, Button, CodeBlock, Divider, Heading, Link, Text, VStack } from '@astryxdesign/core';
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
  return (
    <Theme theme={astryxStylesTheme} mode="dark">
      <VStack style={{ maxWidth: 1080, marginInline: 'auto', width: '100%' }}>
        <Text>
          Astryx Dracula <Badge label="dark-only" variant="purple" /> <Link href="https://github.com/yuzu-octopus/astryx-theme">GitHub</Link> <Link href="./llms.txt">llms.txt</Link>
        </Text>
        <Card>
          <Heading level={1}>Dracula, live in every component</Heading>
          <Text>Pure Dracula brand kit for Astryx sites. Full token system, syntax highlighting, chart colors. Prebuilt CSS, zero runtime cost.</Text>
          <Button label={applied ? 'Theme applied' : 'Apply the theme'} variant="primary" onClick={() => setApplied(!applied)} />
          <Link href="https://draculatheme.com">Purple means tappable</Link>
          {applied && <Banner status="success" title="Theme applied" />}
        </Card>
        <CodeBlock code={HERO_CODE} language="tsx" title="wrap-your-app.tsx" hasLineNumbers isWrapped />
        <Palette />
        <Divider />
        <Dashboard />
        <Divider />
        <Gallery />
        <Divider />
        <Quickstart />
        <Divider />
        <Text>Copy the kit, read the skill, ship dark interfaces. Dracula spec at draculatheme.com.</Text>
      </VStack>
    </Theme>
  );
}
