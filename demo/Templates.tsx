import { lazy } from 'react';
import type { ComponentType } from 'react';
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

export interface TemplateEntry {
  id: string;
  name: string;
  description: string;
  load: () => Promise<{ default: ComponentType }>;
}

export const TEMPLATES: TemplateEntry[] = [
  {
    id: 'dashboard',
    name: 'Analytics Dashboard',
    description: 'KPI cards, SVG chart strips, and data tables.',
    load: () => import('../templates/dashboard'),
  },
  {
    id: 'table-grouped',
    name: 'Grouped Table',
    description: 'Collapsible status sections with detail panel.',
    load: () => import('../templates/table-grouped'),
  },
  {
    id: 'table-page',
    name: 'Searchable Table',
    description: 'Filterable data table with toolbar actions.',
    load: () => import('../templates/table-page'),
  },
  {
    id: 'kanban-board',
    name: 'Kanban Board',
    description: 'Status columns with priority tags and metadata.',
    load: () => import('../templates/kanban-board'),
  },
  {
    id: 'settings-sidebar',
    name: 'Settings Panels',
    description: 'Sidebar sections with account and workspace panels.',
    load: () => import('../templates/settings-sidebar'),
  },
  {
    id: 'settings',
    name: 'Settings Form',
    description: 'Single scrolling form with profile sections.',
    load: () => import('../templates/settings'),
  },
  {
    id: 'payment-form',
    name: 'Checkout Form',
    description: 'Billing info, card details, and order summary.',
    load: () => import('../templates/payment-form'),
  },
  {
    id: 'login-card',
    name: 'Login Card',
    description: 'Centered auth card with email and password.',
    load: () => import('../templates/login-card'),
  },
  {
    id: 'file-explorer',
    name: 'File Explorer',
    description: 'Column-based file browser with preview.',
    load: () => import('../templates/file-explorer'),
  },
  {
    id: 'ai-chat-landing',
    name: 'AI Chat Landing',
    description: 'Composer, greeting, and category toggles.',
    load: () => import('../templates/ai-chat-landing'),
  },
  {
    id: 'library',
    name: 'Card Grid',
    description: 'Browsable grid with tabs and filters.',
    load: () => import('../templates/library'),
  },
  {
    id: 'centered-hero',
    name: 'Centered Hero',
    description: 'Headline, CTAs, and hero visual.',
    load: () => import('../templates/centered-hero'),
  },
];

export function TemplatesIndex() {
  return (
    <SiteShell ctaHref="#/">
      <VStack gap={6}>
        <VStack gap={1}>
          <Heading level={1}>Templates in Dracula</Heading>
          <Text type="body" color="secondary">
            Twelve Astryx pages, themed and retokened. Open one live, or scaffold it with
            bunx astryx template.
          </Text>
        </VStack>
        <Grid columns={{ minWidth: 300, max: 3 }} gap={4}>
          {TEMPLATES.map((t) => (
            <ClickableCard key={t.id} padding={4} href={`#/templates/${t.id}`} label={`Open ${t.name}`}>
              <VStack gap={2}>
                <HStack justify="between" vAlign="center">
                  <Heading level={3}>{t.name}</Heading>
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

export function TemplateDetail({ id }: { id: string }) {
  const entry = TEMPLATES.find((t) => t.id === id);
  if (!entry) {
    return (
      <Theme theme={astryxDraculaTheme} mode="dark">
        <VStack gap={3} style={{ padding: '32px' }}>
          <Heading level={2}>Unknown template</Heading>
          <Text type="body" color="secondary">
            No template named {id}.
          </Text>
          <Link href="#/templates">Back to templates</Link>
        </VStack>
      </Theme>
    );
  }
  const Page = LAZY_PAGES[entry.id];
  return (
    <Theme theme={astryxDraculaTheme} mode="dark">
      <VStack gap={0} style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
        <HStack gap={2} vAlign="center" style={{ padding: '12px 24px' }}>
          <Link href="#/templates">Templates</Link>
          <Text color="secondary">/</Text>
          <Text weight="semibold">{entry.name}</Text>
        </HStack>
        <Page />
      </VStack>
    </Theme>
  );
}
