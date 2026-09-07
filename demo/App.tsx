import { Banner, Button, Card, Grid, Heading, Link, Text } from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxStylesTheme } from '../astryx-theme';

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

export default function App() {
  return (
    <Theme theme={astryxStylesTheme} mode="dark">
      <Card>
        <Heading level={1}>Astryx Styles — Dracula</Heading>
        <Text>11 frozen hexes. No new colors without an audit change.</Text>
      </Card>
      <Banner status="info" title="Semantic check: purple links, green good, red bad" />
      <Card>
        <Link href="#">Purple means tappable</Link>
        <Text>Theme link, button, and card overrides live.</Text>
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
      </Card>
      <Grid columns={{ minWidth: 220 }} gap={2}>
        {SWATCHES.map((s) => (
          <Card key={s.name} style={{ backgroundColor: s.hex }}>
            <Text style={{ color: s.fg }}>
              {s.name} {s.hex}
            </Text>
          </Card>
        ))}
      </Grid>
    </Theme>
  );
}
