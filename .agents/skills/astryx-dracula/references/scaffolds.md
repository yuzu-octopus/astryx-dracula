# Layout scaffolds

Copy-paste skeletons distilled from the showcase (`demo/`). Same vocabulary everywhere: Theme dark, AppShell or page VStack, section fragments, Card 4 outer / 3 nested inset, h2 plus body headers, h3 plus supporting titles.

## Shared section fragment

```tsx
<VStack gap={6}>
  <VStack gap={1}>
    <Heading level={2}>Title</Heading>
    <Text type="body" color="secondary">One-line remit.</Text>
  </VStack>
  {/* body grids/cards below */}
</VStack>
```

## Showcase shell plus hero (new-site outer recipe)

```tsx
<Theme theme={astryxDraculaTheme} mode="dark">
  <AppShell height="auto" contentPadding={0}
    topNav={<TopNav
      heading={<HStack gap={1.5} vAlign="center">
        <StatusDot variant="accent" label="Dracula" isPulsing />
        <Text weight="semibold">Site name</Text>
        <Badge label="dark-only" variant="purple" />
      </HStack>}
      startContent={<HStack gap={3} vAlign="center">{/* anchor Links */}</HStack>}
      endContent={<HStack gap={2} vAlign="center">
        <Link href="...">Docs</Link>
        <Button label="Primary CTA" variant="primary" onClick={scrollToCta} />
      </HStack>} />}>
    <Section variant="transparent" padding={0} style={{
      maxWidth: '1160px', marginInline: 'auto', width: '100%',
      paddingInline: 'var(--spacing-4)', paddingBlock: 'var(--spacing-8)',
    }}>
      <VStack gap={10}>
        <section id="top">
          <Grid columns={{ minWidth: 340, max: 2 }} gap={6} align="center">
            <VStack gap={4}>
              <HStack gap={2} vAlign="center" wrap="wrap">
                <StatusDot variant="success" label="Active Spec" />
                <Text type="supporting" color="secondary">Proof line</Text>
              </HStack>
              <VStack gap={2}>
                <Heading level={1} type="display-2">Promise</Heading>
                <Text type="large" color="secondary">Lede sentence.</Text>
              </VStack>
              <HStack gap={3} vAlign="center" wrap="wrap">
                <Button label="Primary CTA" variant="primary" />
                <Link href="...">Secondary action</Link>
              </HStack>
              <HStack gap={1.5} wrap="wrap">{/* proof Badges */}</HStack>
            </VStack>
            <Card padding={3} style={insetCard}>
              <CodeBlock code={HERO_CODE} language="tsx" title="wrap-your-app.tsx"
                hasLineNumbers isWrapped width="100%" />
            </Card>
          </Grid>
        </section>
        <Divider />
        {/* sections... */}
        <Divider />
        <Card padding={4} style={insetCard}>
          <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
            <VStack gap={0.5}>
              <Text weight="semibold">Product name</Text>
              <Text type="supporting" color="secondary">Line + <Link>...</Link>.</Text>
            </VStack>
            <HStack gap={2} vAlign="center">{/* footer Links */}</HStack>
          </HStack>
        </Card>
      </VStack>
    </Section>
  </AppShell>
</Theme>
// insetCard = { backgroundColor: 'var(--color-background)',
//   border: 'var(--border-width) solid var(--color-separator)' }
```

## Bento overview (dense showcase, `#/bento` route)

Fixed `columns={4}` with spans through `style` (Grid has no span prop). Size equals importance: hero strip, wide feature span 2, tall table row-span 2, metric cells.

```tsx
<Card padding={4}>{/* hero strip */}
  <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
    <VStack gap={1}>
      <Heading level={1} type="display-2">Promise</Heading>
      <Text type="body" color="secondary">Remit.</Text>
    </VStack>
    <HStack gap={6} vAlign="center">{/* stat cells: semibold 20px tinted value + supporting label */}</HStack>
  </HStack>
</Card>
<Grid columns={4} gap={4}>
  <Card padding={4} style={{ gridColumn: 'span 2' }}>{/* wide: chart */}</Card>
  <Card padding={4} style={{ gridRow: 'span 2' }}>{/* tall: table */}</Card>
  <Card padding={4}>{/* metric */}</Card>
  {/* ...metric cells fill the remaining tracks... */}
</Grid>
```

## Dashboard (observability)

```tsx
<VStack gap={6}>
  {/* section header */}
  <Grid columns={{ minWidth: 220, max: 4 }} gap={3}>
    {/* 4x KPI: Card padding={4}, label supporting + StatusDot, value Heading display-2,
        delta semibold tinted positive/negative + hint supporting */}
  </Grid>
  <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
    {/* chart card: h3 + supporting + badge, inset chart well, spectral badge legend */}
    {/* capacity card: h3 + status, ProgressBars hasValueLabel, inset SLA strip */}
  </Grid>
  <Card padding={4}>{/* full-width table: h3 + supporting + badge, Table hasHover */}
  </Card>
</VStack>
```

Table columns: Route `proportional(2)` with StatusDot plus semibold text, numerics `proportional(1)` `align="end"`, values `hasTabularNumbers`, latency `type="code"`, trend semibold tinted. `density="balanced"` for feature tables, `"compact"` for dense ones. Never wrap a Card in `overflowX`; Table brings its own scroll container.

## Numbered steps (quickstart)

```tsx
<Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
  <Card padding={4}><VStack gap={3}>
    <HStack gap={2} vAlign="center">
      <Badge label="01" variant="purple" />
      <Heading level={3}>Step name</Heading>
    </HStack>
    <Text type="body" color="secondary">What this step does.</Text>
    <CodeBlock code={...} language="bash" hasCopyButton width="100%" />
  </VStack></Card>
  {/* ... */}
</Grid>
```

Step badges purple; one nested token inset (`Card padding={3}` plus `insetCard`) where a step needs a reference strip.

## Spec grid (palette / taxonomy wall)

```tsx
<Grid columns={{ minWidth: 240, max: 4 }} gap={3}>
  {/* swatch cards padding={3}: color well (Card padding={0}, token bg, radius,
      separator border) + name semibold / hex code / token code / role supporting */}
</Grid>
```

## Responsive rules

- Multi-column grids collapse to fewer columns, then a single stack. Hero and summary content keeps the top.
- Nothing may force page-level horizontal scroll on mobile. Tables and charts scroll inside their own containers; flex children need room to shrink.
- Verify at 1568, 768, and 390 before calling a layout done. The 768 checkpoint catches its own class of defect: two-column yields with no gap, sticky panels covering form inputs, toolbar crowding.
- Sticky elements must never cover interactive content at any width. A sticky summary or rail that overlaps inputs unsticks or restacks below 1024px. Sticky needs a top offset clearing the nav and a z-order below overlays.
- Touch targets floor at 24px (WCAG AA); build to 44 where touch matters. Wrappers and pills do not count, only the native control box that fires.
- Truncation always pairs with tooltips: ellipsis plus full-text tooltip on nav rows, table cells, badge labels, and card titles. A clipped node without a tooltip is a defect; verify in the DOM, not by eye.

## App shell (sidebar tool)

Three regions: left nav, main panel, right rail. For tool apps like the RSA toolkit, not showcases.

```tsx
<HStack gap={0} style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
  <SideNav>{/* groups below */}</SideNav>
  <VStack gap={4} style={{ flex: 1, padding: '24px', minWidth: 0 }}>
    <VStack gap={1}>
      <Heading level={2}>Panel title</Heading>
      <Text type="body" color="secondary">What this panel does.</Text>
    </VStack>
    {/* panel body */}
  </VStack>
  <VStack gap={3} style={{ width: '280px', padding: '24px' }}>
    <Heading level={3}>Results</Heading>
    {/* rail body; empty state when idle */}
  </VStack>
</HStack>
```

Main panel gets `minWidth: 0` so wide children (tables, code) never force page-level horizontal scroll.

## Sidebar groups

Group header carries the count badge and chevron; rows truncate with full-text tooltips, never raw clip.

```tsx
<VStack gap={1}>
  <HStack justify="between" vAlign="center">
    <Text weight="semibold">Factorization</Text>
    <HStack gap={1} vAlign="center">
      <Badge label="20" variant="neutral" />
      {/* chevron */}
    </HStack>
  </HStack>
  <Link href="#ecm" tooltip="ECM Full Factorization">ECM Full Factorization</Link>
  {/* rows: Link with tooltip holding the full label */}
</VStack>
```

Truncation rule: any label that can exceed its container gets ellipsis plus a tooltip with the full text. Applies to nav rows, table cells, badge labels, and card titles.

## Footer

Copyright plus Powered by GitHub Pages plus Built with React, Vite, and Astryx. One line, supporting size, links inherit.

```tsx
<VStack gap={1} style={{ padding: '24px', borderTop: '1px solid var(--color-separator)' }}>
  <Text type="supporting" color="secondary">© 2026 yuzu-octopus</Text>
  <Text type="supporting" color="secondary">
    Powered by <Link href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</Link>
  </Text>
  <Text type="supporting" color="secondary">
    Built with <Link href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</Link>
    , <Link href="https://vite.dev/" target="_blank" rel="noopener noreferrer">Vite</Link>
    , <Link href="https://astryx.atmeta.com/" target="_blank" rel="noopener noreferrer">Astryx</Link>
  </Text>
</VStack>
```

## Empty state

Heading plus one-line why plus primary CTA, centered, width-constrained. Never a bare message.

```tsx
<VStack gap={3} style={{ alignItems: 'center', maxWidth: '420px', marginInline: 'auto', padding: '48px 24px' }}>
  <Heading level={3}>No results yet</Heading>
  <Text type="body" color="secondary">Run an attack and findings land here.</Text>
  <Button label="Open panel" variant="primary" />
</VStack>
```
