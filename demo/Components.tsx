import { Badge, Banner, Button, Card, Code, Divider, Grid, Heading, Kbd, Link, ProgressBar, Text, VStack } from '@astryxdesign/core';

export function ComponentGallery() {
  return (
    <VStack>
      <Heading level={2}>Banners</Heading>
      <Banner status="info" title="Info: deploy preview ready" />
      <Banner status="success" title="Success: checks green" />
      <Banner status="warning" title="Warning: stale theme.css" />
      <Banner status="error" title="Error: hex drift detected" />
      <Heading level={2}>Buttons</Heading>
      <Card>
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Ghost" variant="ghost" />
        <Button label="Destructive" variant="destructive" />
      </Card>
      <Heading level={2}>Tags</Heading>
      <Card>
        <Badge label="purple" variant="purple" />
        <Badge label="pink" variant="pink" />
        <Badge label="cyan" variant="cyan" />
        <Badge label="green" variant="green" />
        <Badge label="yellow" variant="yellow" />
        <Badge label="red" variant="red" />
        <Badge label="orange" variant="orange" />
      </Card>
      <Heading level={2}>Progress</Heading>
      <Card>
        <ProgressBar label="Accent" value={70} hasValueLabel />
        <ProgressBar label="Success" value={100} variant="success" hasValueLabel />
        <ProgressBar label="Warning" value={45} variant="warning" hasValueLabel />
        <ProgressBar label="Error" value={12} variant="error" hasValueLabel />
      </Card>
      <Heading level={2}>Inline</Heading>
      <Card>
        <Text>
          Press <Kbd keys="mod+K" />, read <Code>tokens.css</Code>, follow <Link href="#">the skill</Link>.
        </Text>
      </Card>
      <Divider />
      <Grid columns={{ minWidth: 260 }} gap={2}>
        <Card>
          <Heading level={3}>Cards group content</Heading>
          <Text>Widgets, galleries, settings. Never list rows.</Text>
        </Card>
        <Card>
          <Heading level={3}>Tokens beat hexes</Heading>
          <Text>Every value resolves from the Dracula theme.</Text>
        </Card>
      </Grid>
    </VStack>
  );
}
