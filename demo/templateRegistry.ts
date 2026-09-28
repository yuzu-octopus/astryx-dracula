import type {ComponentType} from 'react';

// Template registry (data only, no components): the single source of truth
// for the showcase's template list. `Templates.tsx` renders these entries and
// `main.tsx` validates `?bare=` against `TEMPLATE_IDS`, so neither component
// module needs to export data itself.
//
// Names and descriptions come from `templates/<id>.template.mjs` — the same
// specs the Astryx CLI reads when scaffolding — so a template cannot be called
// one thing here and another there. Ids and lazy loaders come from
// `import.meta.glob`, so adding a template means adding a .tsx and a .mjs and
// touching nothing in this file except the order list below.
export interface TemplateEntry {
  id: string;
  name: string;
  description: string;
  load: () => Promise<{default: ComponentType}>;
}

interface TemplateSpec {
  name: string;
  description: string;
}

// Showcase order is curated, not alphabetical, so it stays a hand-maintained
// list of ids. That is the only thing here a human still maintains.
const ORDER = [
  'dashboard', 'table-grouped', 'table-page', 'kanban-board', 'settings-sidebar',
  'settings', 'payment-form', 'login-card', 'file-explorer', 'ai-chat-landing',
  'library', 'centered-hero', 'ai-chat', 'classic-gallery', 'contact-form',
  'dashboard-portfolio', 'detail-page', 'documentation', 'documentation-design',
  'documentation-technical', 'editor', 'form-two-column', 'gallery-hero', 'ide',
  'login', 'mixed-gallery', 'product-detail', 'product-gallery',
  'settings-dialog', 'shell-nav', 'shell-side-nav', 'shell-top-nav', 'table',
  'table-page-chart', 'table-page-heatmap-status',
  'table-page-shoe-store-heatmap', 'blank', 'incident-console', 'product-tour',
  'login-split', 'login-sso', 'messaging-shell', 'side-gallery', 'theme-showcase',
  'tech-report',
];

const specs = import.meta.glob<{default: TemplateSpec}>(
  '../templates/*.template.mjs',
  {eager: true},
);
const pages = import.meta.glob<{default: ComponentType}>('../templates/*.tsx');

export const TEMPLATES: TemplateEntry[] = ORDER.map(id => ({
  id,
  name: specs[`../templates/${id}.template.mjs`]!.default.name,
  description: specs[`../templates/${id}.template.mjs`]!.default.description,
  load: pages[`../templates/${id}.tsx`]!,
}));

// Ids the bare frame accepts. The router checks `?bare=` against this list so
// an unknown or empty value lands on the index instead of a blank page.
export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id);
