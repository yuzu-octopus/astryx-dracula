// Shared gallery image fill + radius-clip (pending core Image #2582).
// AspectRatio exposes no objectFit or radius props and Astryx ships no Image
// primitive, so gallery SVG scenes fill their box and clip to rounded corners
// through these two styles. Replace with component props once #2582 lands.

import type {CSSProperties} from 'react';

// Fills the AspectRatio box. No objectFit prop on AspectRatio (#2582).
export const galleryImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};

// Rounds the gallery corners. No radius prop on AspectRatio (#2582);
// overflow clip masks the SVG scene to the rounded corners.
export const galleryImageClip: CSSProperties = {
  borderRadius: 'var(--radius-element)',
  overflow: 'clip',
};
