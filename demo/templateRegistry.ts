import type { ComponentType } from 'react';

// Template registry (data only, no components): the single source of truth
// for the showcase's template list. `Templates.tsx` renders these entries and
// `main.tsx` validates `?bare=` against `TEMPLATE_IDS`, so neither component
// module needs to export data itself.
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
  {
    id: 'ai-chat',
    name: 'AI Chat',
    description: 'Conversation view with tool calls and artifacts.',
    load: () => import('../templates/ai-chat'),
  },
  {
    id: 'classic-gallery',
    name: 'Classic Gallery',
    description: 'Image gallery with filter tabs.',
    load: () => import('../templates/classic-gallery'),
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Lead capture with toggles and full-width CTA.',
    load: () => import('../templates/contact-form'),
  },
  {
    id: 'dashboard-portfolio',
    name: 'Portfolio Dashboard',
    description: 'Holdings overview with trend strips.',
    load: () => import('../templates/dashboard-portfolio'),
  },
  {
    id: 'detail-page',
    name: 'Detail Page',
    description: 'Record detail with metadata and timeline.',
    load: () => import('../templates/detail-page'),
  },
  {
    id: 'documentation',
    name: 'Documentation Catalog',
    description: 'Hero banner plus component category grid.',
    load: () => import('../templates/documentation'),
  },
  {
    id: 'documentation-design',
    name: 'Documentation Design',
    description: 'Live preview with usage and best practices.',
    load: () => import('../templates/documentation-design'),
  },
  {
    id: 'documentation-technical',
    name: 'Documentation Technical',
    description: 'Getting-started guide with theming setup.',
    load: () => import('../templates/documentation-technical'),
  },
  {
    id: 'editor',
    name: 'Page Editor',
    description: 'Block editor with toolbar and preview.',
    load: () => import('../templates/editor'),
  },
  {
    id: 'form-two-column',
    name: 'Two-column Form',
    description: 'Split form with summary rail.',
    load: () => import('../templates/form-two-column'),
  },
  {
    id: 'gallery-hero',
    name: 'Gallery Hero',
    description: 'Headline above a three-image gallery.',
    load: () => import('../templates/gallery-hero'),
  },
  {
    id: 'ide',
    name: 'IDE',
    description: 'File explorer, tabbed editor, terminal.',
    load: () => import('../templates/ide'),
  },
  {
    id: 'login',
    name: 'Login Page',
    description: 'Full-page auth with brand panel.',
    load: () => import('../templates/login'),
  },
  {
    id: 'mixed-gallery',
    name: 'Mixed Gallery',
    description: 'Uneven card heights, masonry feel.',
    load: () => import('../templates/mixed-gallery'),
  },
  {
    id: 'product-detail',
    name: 'Product Detail',
    description: 'Gallery, options, reviews, related.',
    load: () => import('../templates/product-detail'),
  },
  {
    id: 'product-gallery',
    name: 'Product Gallery',
    description: 'Browsable product grid.',
    load: () => import('../templates/product-gallery'),
  },
  {
    id: 'settings-dialog',
    name: 'Settings Dialog',
    description: 'Modal settings with section nav.',
    load: () => import('../templates/settings-dialog'),
  },
  {
    id: 'shell-nav',
    name: 'Shell Nav',
    description: 'App shell with combined navigation.',
    load: () => import('../templates/shell-nav'),
  },
  {
    id: 'shell-side-nav',
    name: 'Side Nav Shell',
    description: 'Workspace sidebar with status.',
    load: () => import('../templates/shell-side-nav'),
  },
  {
    id: 'shell-top-nav',
    name: 'Top Nav Shell',
    description: 'Store top bar with featured card.',
    load: () => import('../templates/shell-top-nav'),
  },
  {
    id: 'table',
    name: 'Simple Table',
    description: 'Minimal vault table.',
    load: () => import('../templates/table'),
  },
  {
    id: 'table-page-chart',
    name: 'Chart Table',
    description: 'Orders with SVG trend strips.',
    load: () => import('../templates/table-page-chart'),
  },
  {
    id: 'table-page-heatmap-status',
    name: 'Heatmap Table',
    description: 'Day-hour activity grid with status.',
    load: () => import('../templates/table-page-heatmap-status'),
  },
  {
    id: 'table-page-shoe-store-heatmap',
    name: 'Store Heatmap Table',
    description: 'Product rows with cyan trend strips.',
    load: () => import('../templates/table-page-shoe-store-heatmap'),
  },
  {
    id: 'blank',
    name: 'Blank',
    description: 'Minimal page scaffold.',
    load: () => import('../templates/blank'),
  },
  {
    id: 'incident-console',
    name: 'Incident Console',
    description: 'On-call response with severity rows and inspector.',
    load: () => import('../templates/incident-console'),
  },
  {
    id: 'product-tour',
    name: 'Product Tour',
    description: 'Chapter rail, walkthrough content, and outline.',
    load: () => import('../templates/product-tour'),
  },
  {
    id: 'login-split',
    name: 'Login Split',
    description: 'Split auth with brand cover panel.',
    load: () => import('../templates/login-split'),
  },
  {
    id: 'login-sso',
    name: 'Login SSO',
    description: 'Single sign-on with provider list.',
    load: () => import('../templates/login-sso'),
  },
  {
    id: 'messaging-shell',
    name: 'Messaging Shell',
    description: 'Conversation list with message thread.',
    load: () => import('../templates/messaging-shell'),
  },
  {
    id: 'side-gallery',
    name: 'Side Gallery',
    description: 'Sidebar plus gallery wall.',
    load: () => import('../templates/side-gallery'),
  },
  {
    id: 'theme-showcase',
    name: 'Theme Showcase',
    description: 'Storefront theme switcher demo.',
    load: () => import('../templates/theme-showcase'),
  },
  {
    id: 'tech-report',
    name: 'Technical Report',
    description: 'Chapter rail, paper walkthrough, and outline.',
    load: () => import('../templates/tech-report'),
  },
];

// Ids the bare frame accepts. The router checks `?bare=` against this list so
// an unknown or empty value lands on the index instead of a blank page.
export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id);
