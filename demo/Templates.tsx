import { lazy } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import {
  Badge,
  ClickableCard,
  Grid,
  HStack,
  Heading,
  Link,
  Text,
  VStack,
} from '@astryxdesign/core';
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '../astryx-theme';
import { SiteShell } from './Chrome';
import { TEMPLATES } from './templateRegistry';

export function TemplatesIndex() {
  return (
    <SiteShell ctaHref="#/">
      <VStack gap={6}>
        <VStack gap={1}>
          <Heading level={1}>Templates in Dracula</Heading>
          <Text type="body" color="secondary">
            {TEMPLATES.length} Astryx pages, themed and retokened. Open one live, or scaffold it with
            bunx astryx template.
          </Text>
        </VStack>
        <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
          {TEMPLATES.map((t) => (
            <ClickableCard key={t.id} padding={4} href={`#/templates/${t.id}`} label={`Open ${t.name}`}>
              <VStack gap={2}>
                <HStack justify="between" vAlign="center" wrap="wrap" gap={2}>
                  <Heading level={2}>{t.name}</Heading>
                  <Badge label={t.id} variant="neutral" />
                </HStack>
                <Text type="body" color="secondary">
                  {t.description}
                </Text>
              </VStack>
            </ClickableCard>
          ))}
        </Grid>
      </VStack>
    </SiteShell>
  );
}

const LAZY_PAGES: Record<string, ComponentType> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, lazy(t.load)]),
);

// Templates assume they own the viewport: AppShell sizes itself to 100dvh and
// sizes its side nav to calc(100dvh - header). Rendered inline under a
// breadcrumb bar, every page ends up exactly one bar-height too tall, which
// pushes its bottom edge, including the SideNav collapse button, below the
// fold. So the viewer gives each template a frame of its own that matches the
// space left over, and the template renders bare inside it.
const bareHref = (id: string) => `${window.location.pathname}?bare=${id}`;

// The bare document owns the viewport height. Layout height="fill" is
// height:100%, which only resolves against a definite ancestor height —
// <html>/<body> don't set one, so without this an unconstrained Layout grows
// to its content height and the *document* scrolls instead of the template's
// own LayoutContent/Table scroll containers (a redundant outer scrollbar that
// shouldn't be there). height="auto" pages are unaffected: taller content
// still overflows visibly and the document scrolls as designed. Consumers
// scaffolding a template into their own app must provide the same
// definite-height ancestor (the editor template's pageStyle is the pattern).
const bareViewport: CSSProperties = {
  height: '100dvh',
};

const viewerFrame: CSSProperties = {
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: 'var(--color-background)',
};
const viewerBar: CSSProperties = {
  padding: '12px 24px',
};
const viewerPage: CSSProperties = {
  flex: 1,
  minHeight: 0,
  width: '100%',
  border: 0,
  display: 'block',
  backgroundColor: 'var(--color-background)',
};

export function TemplateDetail({ id }: { id: string }) {
  const entry = TEMPLATES.find((t) => t.id === id);
  if (!entry) {
    return (
      <Theme theme={astryxDraculaTheme} mode="dark">
        <VStack gap={3} style={{ padding: '32px' }}>
          <Heading level={1}>Unknown template</Heading>
          <Text type="body" color="secondary">
            No template named {id}.
          </Text>
          <Link href="#/templates">Back to templates</Link>
        </VStack>
      </Theme>
    );
  }
  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <VStack gap={0} style={viewerFrame}>
        <HStack gap={2} vAlign="center" style={viewerBar}>
          <Link href="#/templates">Templates</Link>
          <Text color="secondary">/</Text>
          <Text weight="semibold">{entry.name}</Text>
        </HStack>
        {/* Bundled same-origin templates: allow-scripts keeps the page app
            running, allow-same-origin keeps module, font, and runtime theme
            fetches working. Top navigation, forms, popups, pointer lock, and
            downloads stay blocked. */}
        <iframe
          title={entry.name}
          src={bareHref(entry.id)}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          style={viewerPage}
        />
      </VStack>
    </Theme>
  );
}

// Renders a template with no viewer chrome, for the frame above. An id the
// registry does not know falls back to the index, so no `?bare=` value can end
// up as an empty page.
export function BareTemplate({ id }: { id: string }) {
  const Page = LAZY_PAGES[id];
  if (!Page) return <TemplatesIndex />;
  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <div style={bareViewport}>
        <Page />
      </div>
    </Theme>
  );
}
