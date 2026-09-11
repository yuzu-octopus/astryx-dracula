// Shared mountain-glyph scene tile for owned gallery surfaces.
// Large fork: documentation/library/mixed/payment/product-detail/
// product-gallery — centered glyph on a flat field. Small fork:
// classic/side — full night landscape (stars, moon, hills) with a tighter
// glyph frame. The glyph stroke stays comment so tiles stay on-brand in the
// dark-only theme; purple never touches these scenes (purple means tappable).
// Wave 2 owns the documentation + payment-form migration — those templates
// keep their local glyphs until then.

import {galleryImage} from 'astryx-dracula/shared/gallery-image';

export type SceneTileSize = 'lg' | 'sm';

interface SceneTileProps {
  /** Per-tile Dracula accent: moon wash (sm) and glyph dot (both forks). */
  hue: string;
  /** Accessible name for the tile art. */
  label: string;
  /** `lg` for grid thumbs, `sm` for the classic/side landscape tiles. */
  size?: SceneTileSize;
  /** Star wash for the sm landscape. Decorative stars are never purple. */
  stars?: string;
  /** Positional seed so repeated sm tiles vary moon, hills, and star field.
   *  Ignored by the lg fork (one centered glyph, no variance). */
  index?: number;
}

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

export function SceneTile({
  hue,
  label,
  size = 'lg',
  stars = 'var(--dracula-comment)',
  index = 0,
}: SceneTileProps) {
  const moonX = 90 + ((index * 53) % 220);
  const moonY = 62 + ((index * 29) % 60);
  const hillA = 190 + ((index * 13) % 40);
  const hillB = 215 + ((index * 17) % 40);
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={galleryImage}
      role="img"
      aria-label={label}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      {size === 'sm' && (
        <>
          {/* Stars */}
          <g fill={stars} opacity={0.55}>
            <circle cx={40 + ((index * 37) % 320)} cy={30} r={2} />
            <circle cx={120 + ((index * 23) % 200)} cy={52} r={1.6} />
            <circle cx={260 + ((index * 11) % 110)} cy={26} r={2.2} />
            <circle cx={330} cy={70 + ((index * 7) % 30)} r={1.6} />
          </g>
          <circle cx={moonX} cy={moonY} r={34} fill={hue} opacity={0.9} />
          <circle
            cx={moonX - 12}
            cy={moonY - 8}
            r={28}
            fill="var(--dracula-bg-light)"
            opacity={0.55}
          />
          <path
            d={`M0 ${hillA} Q100 ${hillA - 50} 200 ${hillA - 10} T400 ${hillA - 30} V300 H0 Z`}
            fill="var(--dracula-current-line)"
          />
          <path
            d={`M0 ${hillB} Q120 ${hillB - 40} 240 ${hillB} T400 ${hillB - 20} V300 H0 Z`}
            fill="var(--dracula-bg)"
          />
        </>
      )}
      {size === 'sm' ? (
        <g
          transform={`translate(${60 + ((index * 41) % 280)} ${hillB - 34})`}
          fill="none"
          stroke={hue}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="-22" y="-22" width="44" height="44" rx={4} />
          <circle cx="9" cy="-9" r="2" fill={hue} stroke="none" />
          <path d="M-17 15 L-4 0 L5 9 L10 4 L17 12" />
        </g>
      ) : (
        <g
          transform="translate(200 150)"
          fill="none"
          stroke="var(--dracula-comment)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="-44" y="-44" width="88" height="88" rx="5" />
          <circle cx="18" cy="-18" r="2.5" fill={hue} stroke="none" />
          <path d="M-34 30 L-8 0 L10 18 L20 8 L34 24" />
        </g>
      )}
    </svg>
  );
}
