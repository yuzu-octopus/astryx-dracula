import { Card, Grid, Heading, Text, VStack } from '@astryxdesign/core';

const SWATCHES: Array<{ name: string; hex: string; fg: string }> = [
  { name: 'Background', hex: '#282A36', fg: '#F8F8F2' },
  { name: 'Current line', hex: '#6272A4', fg: '#F8F8F2' },
  { name: 'Selection', hex: '#44475A', fg: '#F8F8F2' },
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

export function Palette() {
  return (
    <VStack gap={4}>
      <Heading level={2}>Palette</Heading>
      <Text>Twelve spec tokens. Every token below resolves to one of these.</Text>
      <Grid columns={{ minWidth: 220 }} gap={3}>
        {SWATCHES.map((s) => (
          <Card key={s.name} style={{ backgroundColor: s.hex }}>
            <Text style={{ color: s.fg }}>
              {s.name} {s.hex}
            </Text>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}
