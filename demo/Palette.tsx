import { Card, Grid, Heading, HStack, Text, VStack } from '@astryxdesign/core';

interface Swatch {
  name: string;
  hex: string;
  token: string;
  role: string;
  category: 'Foundation' | 'Accent';
}

const SWATCHES: Swatch[] = [
  { name: 'Background', hex: '#282A36', token: '--dracula-bg', role: 'Canvas & page wash', category: 'Foundation' },
  { name: 'Current Line', hex: '#6272A4', token: '--dracula-current-line', role: 'Active line & visible edges', category: 'Foundation' },
  { name: 'Selection', hex: '#44475A', token: '--dracula-selection', role: 'Selected rows & quiet borders', category: 'Foundation' },
  { name: 'Foreground', hex: '#F8F8F2', token: '--dracula-fg', role: 'Primary high-contrast text', category: 'Foundation' },
  { name: 'Comment', hex: '#6272A4', token: '--dracula-comment', role: 'Subdued captions & disabled text', category: 'Foundation' },
  { name: 'Purple', hex: '#BD93F9', token: '--dracula-purple', role: 'Primary accent & tappable titles', category: 'Accent' },
  { name: 'Cyan', hex: '#8BE9FD', token: '--dracula-cyan', role: 'Informational alerts & secondary links', category: 'Accent' },
  { name: 'Green', hex: '#50FA7B', token: '--dracula-green', role: 'Success, online status & added lines', category: 'Accent' },
  { name: 'Orange', hex: '#FFB86C', token: '--dracula-orange', role: 'Warnings & categorical charts', category: 'Accent' },
  { name: 'Pink', hex: '#FF79C6', token: '--dracula-pink', role: 'Accent flair & syntax keywords', category: 'Accent' },
  { name: 'Yellow', hex: '#F1FA8C', token: '--dracula-yellow', role: 'Tags, chips & string literals', category: 'Accent' },
  { name: 'Red', hex: '#FF5555', token: '--dracula-red', role: 'Errors, destructive actions & deletions', category: 'Accent' },
];

export function Palette() {
  return (
    <VStack gap={5}>
      <VStack gap={1}>
        <Heading level={2}>Spec Palette</Heading>
        <Text type="body" color="secondary">
          Twelve pinned hex values from the official Dracula specification. Every component token resolves to this palette.
        </Text>
      </VStack>

      <Grid columns={{ minWidth: 240, max: 4 }} gap={3}>
        {SWATCHES.map((s) => (
          <Card key={s.name} padding={3}>
            <VStack gap={2}>
              <Card
                padding={0}
                style={{
                  backgroundColor: s.hex,
                  height: 'var(--spacing-8)',
                  width: '100%',
                  borderRadius: 'var(--border-radius)',
                  border: 'var(--border-width) solid var(--color-separator)',
                }}
              >
                <></>
              </Card>
              <VStack gap={0.5}>
                <HStack justify="between" vAlign="center">
                  <Text weight="semibold">{s.name}</Text>
                  <Text type="code" color="secondary">
                    {s.hex}
                  </Text>
                </HStack>
                <Text type="code" color="secondary">
                  {s.token}
                </Text>
                <Text type="supporting" color="secondary">
                  {s.role}
                </Text>
              </VStack>
            </VStack>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}
