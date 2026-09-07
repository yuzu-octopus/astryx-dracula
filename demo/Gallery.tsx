import { Badge, Banner, Button, Card, Code, Grid, Heading, Kbd, Link, ProgressBar, Text, VStack } from '@astryxdesign/core';

export function Gallery() {
  return (
    <VStack gap={4}>
      <Heading level={2}>Components</Heading>
      <Text>Statuses, actions, and tags wearing the ramp.</Text>
      <Banner status="info" title="Info: deploy preview ready" />
      <Banner status="success" title="Success: checks green" />
      <Banner status="warning" title="Warning: stale theme.css" />
      <Banner status="error" title="Error: hex drift detected" />
      <Card>
        <Grid columns={{ minWidth: 160 }} gap={3}>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Destructive" variant="destructive" />
        </Grid>
      </Card>
      <Card>
        <Badge label="purple" variant="purple" />
        <Badge label="pink" variant="pink" />
        <Badge label="cyan" variant="cyan" />
        <Badge label="green" variant="green" />
        <Badge label="yellow" variant="yellow" />
      </Card>
      <Card>
        <ProgressBar label="Build minutes" value={62} hasValueLabel />
        <ProgressBar label="Bandwidth" value={38} variant="success" hasValueLabel />
        <Text>
          Press <Kbd keys="mod+K" />, read <Code>tokens.css</Code>, follow <Link href="#">the skill</Link>.
        </Text>
      </Card>
    </VStack>
  );
}
