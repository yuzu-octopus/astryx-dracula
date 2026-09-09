import {
  Badge,
  Banner,
  Button,
  Card,
  Code,
  Grid,
  Heading,
  HStack,
  Kbd,
  Link,
  ProgressBar,
  StatusDot,
  Text,
  VStack,
} from '@astryxdesign/core';

export function Gallery() {
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>Component System</Heading>
        <Text type="body" color="secondary">
          Statuses, interactive surfaces, and taxonomy wearing the dark Dracula ramp.
        </Text>
      </VStack>

      {/* System Banners */}
      <VStack gap={3}>
        <Heading level={3}>System Banners</Heading>
        <Grid columns={{ minWidth: 320, max: 2 }} gap={3}>
          <Banner
            status="info"
            title="Deploy preview active"
            description="Preview branch synced with Dracula tokens."
          />
          <Banner
            status="success"
            title="All contract checks green"
            description="Zero color drift detected across 12 spec tokens."
          />
          <Banner
            status="warning"
            title="Prebuilt CSS rebuild recommended"
            description="Generated stylesheet is 1 revision behind source."
          />
          <Banner
            status="error"
            title="Hex drift prevented"
            description="Audit blocked an unregistered color value from entering build."
          />
        </Grid>
      </VStack>

      {/* Actions and Badges Grid */}
      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        {/* Buttons */}
        <Card padding={4}>
          <VStack gap={4}>
            <VStack gap={0.5}>
              <Heading level={3}>Actions & Buttons</Heading>
              <Text type="supporting" color="secondary">
                Variants, sizes, and states
              </Text>
            </VStack>

            <VStack gap={2}>
              <Text type="label" color="secondary">
                Standard Variants
              </Text>
              <HStack gap={2} wrap="wrap">
                <Button label="Primary" variant="primary" />
                <Button label="Secondary" variant="secondary" />
                <Button label="Ghost" variant="ghost" />
                <Button label="Destructive" variant="destructive" />
              </HStack>
            </VStack>

            <VStack gap={2}>
              <Text type="label" color="secondary">
                States & Sizes
              </Text>
              <HStack gap={2} wrap="wrap" vAlign="center">
                <Button label="Small Primary" size="sm" variant="primary" />
                <Button label="Loading..." isLoading variant="secondary" />
                <Button label="Disabled" isDisabled variant="ghost" />
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Taxonomy and Badges */}
        <Card padding={4}>
          <VStack gap={4}>
            <VStack gap={0.5}>
              <Heading level={3}>Taxonomy & Badges</Heading>
              <Text type="supporting" color="secondary">
                Categorical labels & presence dots
              </Text>
            </VStack>

            <VStack gap={2}>
              <Text type="label" color="secondary">
                Spectral Color Ramps
              </Text>
              <HStack gap={1.5} wrap="wrap">
                <Badge label="purple" variant="purple" />
                <Badge label="pink" variant="pink" />
                <Badge label="cyan" variant="cyan" />
                <Badge label="green" variant="green" />
                <Badge label="yellow" variant="yellow" />
                <Badge label="orange" variant="orange" />
                <Badge label="red" variant="red" />
              </HStack>
            </VStack>

            <VStack gap={2}>
              <Text type="label" color="secondary">
                Semantic Status & Indicators
              </Text>
              <HStack gap={2} wrap="wrap" vAlign="center">
                <HStack gap={1} vAlign="center">
                  <StatusDot variant="success" label="Active" isPulsing />
                  <Text type="supporting">Production</Text>
                </HStack>
                <HStack gap={1} vAlign="center">
                  <StatusDot variant="warning" label="Warning" />
                  <Text type="supporting">Staging</Text>
                </HStack>
                <HStack gap={1} vAlign="center">
                  <StatusDot variant="error" label="Error" />
                  <Text type="supporting">Canary</Text>
                </HStack>
                <HStack gap={1} vAlign="center">
                  <StatusDot variant="accent" label="Accent" />
                  <Text type="supporting">Edge</Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </Card>
      </Grid>

      {/* Progress & Shortcuts Card */}
      <Card padding={4}>
        <VStack gap={4}>
          <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
            <VStack gap={0.5}>
              <Heading level={3}>Indicators & Utilities</Heading>
              <Text type="supporting" color="secondary">
                Linear loaders, key bindings, and token lookups
              </Text>
            </VStack>
            <Badge label="JetBrains Mono" variant="neutral" />
          </HStack>

          <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
            <ProgressBar label="Build pipeline execution" value={62} variant="accent" hasValueLabel />
            <ProgressBar label="Network bandwidth headroom" value={38} variant="success" hasValueLabel />
          </Grid>

          <Card
            padding={3}
            style={{
              backgroundColor: 'var(--color-background)',
              border: 'var(--border-width) solid var(--color-separator)',
            }}
          >
            <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
              <Text>
                Press <Kbd keys="mod+K" /> to command, inspect <Code>tokens.css</Code>, and follow{' '}
                <Link href="https://github.com/yuzu-octopus/astryx-dracula">the skill guidelines</Link>.
              </Text>
              <Badge label="Zero runtime" variant="green" />
            </HStack>
          </Card>
        </VStack>
      </Card>
    </VStack>
  );
}
