import { Button, Card, Code, Grid, Heading, Link, Text, VStack } from '@astryxdesign/core';

const SWATCHES: Array<{ name: string; hex: string; fg: string }> = [
  { name: 'Background', hex: '#282A36', fg: '#F8F8F2' },
  { name: 'Current line', hex: '#44475A', fg: '#F8F8F2' },
  { name: 'Foreground', hex: '#F8F8F2', fg: '#282A36' },
  { name: 'Comment', hex: '#6272A4', fg: '#F8F8F2' },
  { name: 'Cyan', hex: '#8BE9FD', fg: '#282A36' },
  { name: 'Green', hex: '#50FA7B', fg: '#282A36' },
  { name: 'Orange', hex: '#FFB86C', fg: '#282A36' },
  { name: 'Pink', hex: '#FF79C6', fg: '#282A36' },
  { name: 'Purple', hex: '#BD93F9', fg: '#282A36' },
  { name: 'Red', hex: '#FF5555', fg: '#282A36' },
  { name: 'Yellow', hex: '#F1FA8C', fg: '#282A36' },
];

export function Overview({ go }: { go: (tab: string) => void }) {
  return (
    <VStack>
      <Card>
        <Heading level={2}>One brand, every site</Heading>
        <Text>Tokens, syntax highlighting, and chart colors from a single Dracula source. Prebuilt CSS, no runtime cost.</Text>
        <Button label="See components" variant="primary" onClick={() => go('components')} />
        <Button label="See dashboard" variant="secondary" onClick={() => go('dashboard')} />
        <Link href="https://draculatheme.com">Purple means tappable</Link>
      </Card>
      <Heading level={2}>Palette</Heading>
      <Grid columns={{ minWidth: 220 }} gap={2}>
        {SWATCHES.map((s) => (
          <Card key={s.name} style={{ backgroundColor: s.hex }}>
            <Text style={{ color: s.fg }}>
              {s.name} {s.hex}
            </Text>
          </Card>
        ))}
      </Grid>
      <Heading level={2}>Type</Heading>
      <Card>
        <Heading level={2}>JetBrains Mono headings</Heading>
        <Heading level={3}>Geometric scale, base 13</Heading>
        <Text>Body copy, code, and headings share one monospace family.</Text>
        <Code>bun add @astryxdesign/core @astryxdesign/theme-neutral</Code>
      </Card>
      <Heading level={2}>Install</Heading>
      <Card>
        <Code>{`import { astryxDraculaTheme } from './astryx-dracula';\nimport './theme.css';`}</Code>
        <Text>Trapped? Read the agent skill first.</Text>
      </Card>
    </VStack>
  );
}
