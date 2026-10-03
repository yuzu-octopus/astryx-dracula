// Scene art-treatment vocabulary, split from the component that renders it.
//
// WHY A SEPARATE MODULE: a .tsx that exports both components and
// non-components breaks React Fast Refresh -- editing a constant forces a
// full remount instead of a hot update. `react-doctor/only-export-components`
// catches it; this is the fix it asks for. It also matches shared/chart-hues.ts,
// which the chart vocabulary already uses, so the kit has one shape rather than
// one precedent and one exception.

export type SceneTileSize = 'lg' | 'sm';

/**
 * Art-treatment hues for scene tiles. Purple-free by this module's remit.
 * Membership is not a contrast decision — every candidate clears WCAG 1.4.11
 * on both dark surfaces at the disc's 0.9 opacity, including purple.
 */
export const SCENE_HUES = {
  muted: 'var(--dracula-comment)',
  cyan: 'var(--dracula-cyan)',
  green: 'var(--dracula-green)',
  yellow: 'var(--dracula-yellow)',
  orange: 'var(--dracula-orange)',
  pink: 'var(--dracula-pink)',
  red: 'var(--dracula-red)',
} as const;

export type SceneHue = (typeof SCENE_HUES)[keyof typeof SCENE_HUES];

// Shared alt list for the nine-tile side/classic wall (folded into one
// module so the two surfaces cannot drift apart again).
export const SCENE_TILE_ALTS = [
  'Moonlit ridge trail under a harvest moon',
  'Late portrait in violet lamplight',
  'Lamplit reading nook after midnight',
  'Fog rolling over the night pines',
  'Dancer caught mid-step in stage pink',
  'Kitchen table set for a midnight feast',
  'Castle silhouette over sleeping hills',
  'Attic window glowing amber at 2am',
  'Cellar shelves lined with bottled dusk',
] as const;
