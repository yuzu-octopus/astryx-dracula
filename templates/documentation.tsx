// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > V[g=10] > (C[p=10] > (H[g=8 a=center] > (V[g=4] > Hd"The coven grimoire"[level=1 t=display-1] + Tx.lg"Every incantation in the Astryx spellbook"[t=large] + (H > B.primary"Enter the grimoire")))) + (V[g=4] > (H[j=between a=center] > Hd"Core"[level=2] + Tx"15 spells"[t=supporting]) + (H[j=between a=center] > Hd"Layout"[level=2] + Tx"4 spells"[t=supporting]) + (H[j=between a=center] > Hd"Navigation"[level=2] + Tx"4 spells"[t=supporting]) + (H[j=between a=center] > Hd"Form"[level=2] + Tx"5 spells"[t=supporting]) + (G[c={min:260} g=2] > (CC[p=2] > V[g=3] > C[p=0] + (V[g=1] > Tx"Avatar"[t=body] + Tx"Avatars represent"[t=body]))*4))

/**
 * Documentation catalog — every component shelf in the grimoire.
 *
 * Frame-first layout (see `bunx astryx docs layout`):
 *
 *   Frame: hero card | category shelves (heading + card grid)
 *
 * Responsive contract:
 *   No JS breakpoints: the grid fills the content column with as many 260px
 *   cards as fit and lands on a single column on phone widths; the hero copy
 *   wraps in place.
 *
 * Container policy (catalog archetype): the shelf is the only grouping. Each
 * category pairs a level-2 heading with its card grid, and the previews carry
 * the density — rows would flatten them into a list of names.
 */

import type {CSSProperties} from 'react';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {HStack, VStack, StackItem} from '@astryxdesign/core/Stack';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {SceneTile} from 'astryx-dracula/shared/scene-tile';
import {galleryImageClip} from 'astryx-dracula/shared/gallery-image';

// Negative margin offsets each card's 8px padding so the grid content stays
// visually aligned while giving every card a padded hover/click target.
const cardGrid: CSSProperties = {
  margin: 'calc(var(--spacing-2) * -1)',
};

// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = '#/templates/documentation';

// Decorative accent per grimoire shelf. None of them is purple: the sigils
// are not interactive, and purple belongs to the things that are. Art lives
// in shared/scene-tile (lg fork: centered glyph on a flat field).
const SHELF_HUES: Record<string, string> = {
  Core: 'var(--dracula-pink)',
  Layout: 'var(--dracula-cyan)',
  Navigation: 'var(--dracula-green)',
  Form: 'var(--dracula-yellow)',
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const COMPONENT_CATEGORIES = [
  {
    label: 'Core',
    items: [
      {
        key: 'appshell',
        name: 'AppShell',
        desc: 'AppShell provides a foundational page layout with header, sidebar, and content regions. Use it to establish consistent structure across your application.',
      },
      {
        key: 'avatar',
        name: 'Avatar',
        desc: 'Avatars represent a person or entity with an image, initials, or icon. They are commonly used in user profiles, comments, and contact lists.',
      },
      {
        key: 'badge',
        name: 'Badge',
        desc: 'Badges display small counts or status labels. They can be attached to icons, buttons, or list items to surface key information at a glance.',
      },
      {
        key: 'banner',
        name: 'Banner',
        desc: 'Banners show important, non-modal messages at the top of a page or section. They communicate status, warnings, or promotional information.',
      },
      {
        key: 'button',
        name: 'Button',
        desc: 'Buttons let people take action. They can be used in forms, dialogs, and toolbars, or as standalone links.',
      },
      {
        key: 'calendar',
        name: 'Calendar',
        desc: 'Calendar provides a date-picking grid for selecting single dates or date ranges. It integrates with form fields for date input.',
      },
      {
        key: 'dialog',
        name: 'Dialog',
        desc: 'Dialogs are modal overlays that require user attention or action before continuing. They are used for confirmations, forms, and critical decisions.',
      },
      {
        key: 'dropdownmenu',
        name: 'DropdownMenu',
        desc: 'DropdownMenu presents a list of actions or options in a floating overlay. It is triggered by a button and supports nested submenus.',
      },
      {
        key: 'empty-state',
        name: 'EmptyState',
        desc: 'EmptyState provides a placeholder when there is no content to display. It guides users with a message, illustration, and optional call-to-action.',
      },
      {
        key: 'hovercard',
        name: 'HoverCard',
        desc: 'HoverCard shows a rich preview of content when users hover over a trigger element. It is ideal for previewing profiles, links, or details.',
      },
      {
        key: 'icon',
        name: 'Icon',
        desc: 'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text.',
      },
      {
        key: 'kbd',
        name: 'Kbd',
        desc: 'Kbd renders keyboard shortcut hints in a styled inline element. Use it to show users which key combinations perform specific actions.',
      },
      {
        key: 'link',
        name: 'Link',
        desc: 'Links provide navigation between pages or to external resources. They follow accessible anchor semantics with visual affordance.',
      },
      {
        key: 'list',
        name: 'List',
        desc: 'List displays a vertical set of related items. It supports selection, icons, and metadata for building menus, nav lists, and more.',
      },
      {
        key: 'popover',
        name: 'Popover',
        desc: 'Popover displays rich content in a floating panel anchored to a trigger element. It is used for forms, filters, and contextual tools.',
      },
      {
        key: 'table',
        name: 'Table',
        desc: 'Table displays structured data in rows and columns with support for sorting, selection, and custom cell rendering.',
      },
      {
        key: 'token',
        name: 'Token',
        desc: 'Tokens display compact metadata labels such as tags, categories, or filters. They can be dismissible and support selection state.',
      },
      {
        key: 'tooltip',
        name: 'Tooltip',
        desc: 'Tooltips show concise helper text when users hover over or focus an element. They clarify icons, truncated labels, and controls.',
      },
    ],
  },
  {
    label: 'Layout',
    items: [
      {
        key: 'card',
        name: 'Card',
        desc: 'Cards group related content and actions in a contained surface. They can include headers, media, body text, and action bars.',
      },
      {
        key: 'divider',
        name: 'Divider',
        desc: 'Dividers separate content into distinct sections with a subtle or strong horizontal line. They can optionally include a label.',
      },
      {
        key: 'grid',
        name: 'Grid',
        desc: 'Grid provides a CSS grid-based layout container with configurable columns, rows, and gap. It simplifies responsive multi-column designs.',
      },
      {
        key: 'stack',
        name: 'Stack',
        desc: 'Stack arranges child elements in a row or column with consistent gap spacing. It is the primary tool for one-dimensional layout composition.',
      },
    ],
  },
  {
    label: 'Navigation',
    items: [
      {
        key: 'breadcrumbs',
        name: 'Breadcrumbs',
        desc: "Breadcrumbs show the user's current location within a navigation hierarchy. They provide quick links back to parent pages.",
      },
      {
        key: 'sidenav',
        name: 'SideNav',
        desc: 'SideNav renders a vertical navigation panel with links, sections, and collapsible groups. It is used as the primary nav in dashboard layouts.',
      },
      {
        key: 'tablist',
        name: 'TabList',
        desc: 'TabList switches between content views using a horizontal row of tabs. Only one tab is active at a time, and content changes without a page reload.',
      },
      {
        key: 'topnav',
        name: 'TopNav',
        desc: 'TopNav provides an app-level navigation bar across the top of the page. It holds branding, primary links, search, and user actions.',
      },
    ],
  },
  {
    label: 'Form',
    items: [
      {
        key: 'checkboxinput',
        name: 'CheckboxInput',
        desc: 'CheckboxInput renders a single checkbox with a label. It is used for boolean opt-in choices like terms acceptance or feature toggles.',
      },
      {
        key: 'selector',
        name: 'Selector',
        desc: 'Selector lets users pick a single item from a dropdown list. It supports search, grouping, and custom option rendering.',
      },
      {
        key: 'switch',
        name: 'Switch',
        desc: 'Switch toggles a setting between on and off states with immediate effect. It is used for preferences, feature flags, and real-time controls.',
      },
      {
        key: 'textinput',
        name: 'TextInput',
        desc: 'TextInput is a single-line text field for short user input like names, emails, and search queries. It supports icons, prefixes, and validation.',
      },
      {
        key: 'typeahead',
        name: 'Typeahead',
        desc: 'Typeahead provides an autocomplete search input that suggests results as the user types. It supports async data sources and custom rendering.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DocumentationCatalog() {
  return (
    <Layout
      height="fill"
      contentWidth={1200}
      content={
        <LayoutContent padding={8}>
          <VStack gap={10}>
            <Card variant="gray" padding={10}>
              <HStack gap={8} vAlign="center">
                <StackItem size="fill">
                  <VStack gap={4}>
                    <Heading level={1} type="display-1">
                      The coven grimoire
                    </Heading>
                    <Text type="large" weight="normal" color="secondary">
                      Every incantation in the Astryx spellbook, with
                      twenty-eight components for building beautiful,
                      accessible products after dark.
                    </Text>
                    <HStack>
                      <Button
                        label="Enter the grimoire"
                        variant="primary"
                      />
                    </HStack>
                  </VStack>
                </StackItem>
              </HStack>
            </Card>

            {COMPONENT_CATEGORIES.map(category => (
              <VStack key={category.label} gap={4}>
                <HStack justify="between" vAlign="center">
                  <Heading level={2}>{category.label}</Heading>
                  <Text
                    type="supporting"
                    color="secondary"
                    hasTabularNumbers>
                    {category.items.length}{' '}
                    {category.items.length === 1 ? 'spell' : 'spells'}
                  </Text>
                </HStack>
                <Grid columns={{minWidth: 260}} gap={2} style={cardGrid}>
                  {category.items.map(item => (
                    <ClickableCard
                      key={item.key}
                      label={`Open ${item.name}`}
                      href={SELF_HASH}
                      variant="transparent"
                      padding={2}>
                      <VStack gap={3}>
                        <Card
                          variant="muted"
                          padding={0}
                          minHeight={160}
                          style={galleryImageClip}>
                          <SceneTile
                            label={`${item.name} sigil`}
                            hue={
                              SHELF_HUES[category.label] ??
                              'var(--dracula-comment)'
                            }
                            size="lg"
                          />
                        </Card>
                        <VStack gap={1}>
                          <Text type="body" weight="semibold">
                            {item.name}
                          </Text>
                          <Text type="body" color="secondary" maxLines={3}>
                            {item.desc}
                          </Text>
                        </VStack>
                      </VStack>
                    </ClickableCard>
                  ))}
                </Grid>
              </VStack>
            ))}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
