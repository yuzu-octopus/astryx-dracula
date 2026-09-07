import { Card, Code, Heading, Text, VStack } from '@astryxdesign/core';

export function Quickstart() {
  return (
    <VStack gap={4}>
      <Heading level={2}>Quickstart</Heading>
      <Text>Four steps, in order.</Text>
      <Card>
        <Heading level={3}>1. Get the kit</Heading>
        <Code>git clone https://github.com/yuzu-octopus/astryx-theme.git</Code>
      </Card>
      <Card>
        <Heading level={3}>2. Install and copy fonts</Heading>
        <Code>bun add react react-dom @stylexjs/stylex</Code>
        <Code>bun add @astryxdesign/core @astryxdesign/theme-neutral</Code>
        <Code>cp -r &lt;kit&gt;/fonts public/fonts</Code>
      </Card>
      <Card>
        <Heading level={3}>3. Wrap your app</Heading>
        <Code>{`import { astryxDraculaTheme } from './astryx-dracula';\nimport './theme.css';\n\n<Theme theme={astryxDraculaTheme} mode="dark">\n  <App />\n</Theme>;`}</Code>
      </Card>
      <Card>
        <Heading level={3}>4. Style with tokens</Heading>
        <Text>Component props first, <Code>var(--color-*)</Code> second, raw hex never.</Text>
      </Card>
    </VStack>
  );
}
