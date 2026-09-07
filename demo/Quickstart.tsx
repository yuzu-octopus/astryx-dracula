import {
  Badge,
  Card,
  Code,
  CodeBlock,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from '@astryxdesign/core';

export function Quickstart() {
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>Quickstart</Heading>
        <Text type="supporting" color="secondary">
          Four steps to drop pure Dracula into your Astryx application.
        </Text>
      </VStack>

      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        <Card padding={4}>
          <VStack gap={3}>
            <HStack gap={2} vAlign="center">
              <Badge label="01" variant="purple" />
              <Heading level={3}>Clone the Kit</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Clone the Dracula theme repository to get the frozen tokens, assets, and type definitions.
            </Text>
            <CodeBlock
              code="git clone https://github.com/yuzu-octopus/astryx-theme.git"
              language="bash"
              hasCopyButton
              width="100%"
            />
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={3}>
            <HStack gap={2} vAlign="center">
              <Badge label="02" variant="purple" />
              <Heading level={3}>Install Dependencies & Fonts</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Install required peer packages and copy JetBrains Mono fonts into your public asset directory.
            </Text>
            <CodeBlock
              code={`bun add @astryxdesign/core lucide-react @stylexjs/stylex\ncp -r <kit>/fonts public/fonts`}
              language="bash"
              hasCopyButton
              width="100%"
            />
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={3}>
            <HStack gap={2} vAlign="center">
              <Badge label="03" variant="purple" />
              <Heading level={3}>Wrap Your Application Root</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Import the prebuilt stylesheet and pass <Code>astryxDraculaTheme</Code> to the Theme provider.
            </Text>
            <CodeBlock
              code={`import { Theme } from '@astryxdesign/core/theme';\nimport { astryxDraculaTheme } from './astryx-dracula';\nimport './theme.css';\n\n<Theme theme={astryxDraculaTheme} mode="dark">\n  <App />\n</Theme>;`}
              language="tsx"
              title="src/main.tsx"
              hasLineNumbers
              width="100%"
            />
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={3}>
            <HStack gap={2} vAlign="center">
              <Badge label="04" variant="purple" />
              <Heading level={3}>Style With Tokens</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Component props first, <Code>var(--color-*)</Code> second, raw hex never. Pinned hexes enforce zero drift.
            </Text>
            <Card
              padding={3}
              style={{
                backgroundColor: 'var(--color-background)',
                border: 'var(--border-width) solid var(--color-separator)',
              }}
            >
              <VStack gap={2}>
                <Text type="label" color="secondary">
                  Core Theme Tokens
                </Text>
                <HStack gap={1.5} wrap="wrap">
                  <Badge label="var(--color-primary)" variant="purple" />
                  <Badge label="var(--color-positive)" variant="green" />
                  <Badge label="var(--color-info)" variant="cyan" />
                  <Badge label="var(--color-warning)" variant="yellow" />
                  <Badge label="var(--color-negative)" variant="red" />
                  <Badge label="var(--border-radius)" variant="neutral" />
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </Card>
      </Grid>
    </VStack>
  );
}
