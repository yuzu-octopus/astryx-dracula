import { Card, Code, Heading, Link, Text, VStack } from '@astryxdesign/core';

export function Quickstart() {
  return (
    <VStack>
      <Heading level={2}>Quickstart</Heading>
      <Card>
        <Heading level={3}>1. Install</Heading>
        <Code>bun add react react-dom @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral</Code>
        <Code>bun add -d typescript vite @vitejs/plugin-react @astryxdesign/cli</Code>
      </Card>
      <Card>
        <Heading level={3}>2. Copy the kit</Heading>
        <Code>cp -r ~/Documents/Projects/astryx-styles/fonts public/fonts</Code>
        <Text>Take <Code>astryx-dracula.js</Code> and <Code>theme.css</Code>, or <Code>tokens.css</Code> for plain CSS.</Text>
      </Card>
      <Card>
        <Heading level={3}>3. Wrap your app</Heading>
        <Code>{`import { astryxDraculaTheme } from './astryx-dracula';\nimport './theme.css';\n\n<Theme theme={astryxDraculaTheme} mode="dark">\n  <App />\n</Theme>;`}</Code>
      </Card>
      <Card>
        <Heading level={3}>4. Style with tokens</Heading>
        <Text>Component props first. Then <Code>var(--color-*)</Code>. Never a raw hex.</Text>
        <Link href="#">Read the agent skill for the full rules</Link>
      </Card>
    </VStack>
  );
}
