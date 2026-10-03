// Shared mountain-glyph scene tile for owned gallery surfaces.
// Large fork: documentation/library/mixed/payment/product-detail/
// product-gallery — centered glyph on a flat field. Small fork:
// classic/side — full night landscape (stars, moon, hills) with a tighter
// glyph frame. The glyph stroke stays comment so tiles stay on-brand in the
// dark-only theme.
// Wave 2 owns the documentation + payment-form migration — those templates
// keep their local glyphs until then.
//
// REMIT (art treatment, not data): this module's scenes take a `SceneHue` from
// `SCENE_HUES` below. Purple is excluded because this module reserves it for
// tappables — NOT because of contrast, which it passes (4.27:1 on the surface
// tier at the disc's 0.9 opacity). This is a separate vocabulary from
// `CHART_HUES` on purpose: that set is purple-free because purple must never
// encode DATA, this one is purple-free because this module says so. Two sets,
// two stated reasons. Reusing `CHART_HUES` here would make it purple-free for
// a reason that has nothing to do with this rule.
//
// The type is the enforcement, not this comment. `hue: string` accepted any
// `var(--dracula-*)` and every caller decided alone, which is how purple
// reached a 34px disc. The union turns that into a compile error at the call
// site with the exact offending value named.

import {galleryImage} from 'astryx-dracula/shared/gallery-image';
import type {SceneHue, SceneTileSize} from 'astryx-dracula/shared/scene-hues';


interface SceneTileProps {
  /**
   * Per-tile accent: the sm fork paints it as the moon disc (`:70`, a 34px
   * radius at 0.9 opacity) and as glyph dots; the lg fork paints the glyph.
   * One prop, three areas of very different size — the split by role is a
   * deliberate follow-up, not an oversight. Both areas clear 1.4.11 at the
   * same `SceneHue`, so the split is about which role may take which subset,
   * not about a second contrast axis.
   */
  hue: SceneHue;
  /** Accessible name for the tile art. */
  label: string;
  /** `lg` for grid thumbs, `sm` for the classic/side landscape tiles. */
  size?: SceneTileSize;
  /** Positional seed so repeated sm tiles vary moon, hills, and star field.
   *  Ignored by the lg fork (one centered glyph, no variance). */
  index?: number;
}


export function SceneTile({
  hue,
  label,
  size = 'lg',
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
          {/* Stars: decorative wash, comment so purple stays reserved for tappables. */}
          <g fill="var(--dracula-comment)" opacity={0.55}>
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
