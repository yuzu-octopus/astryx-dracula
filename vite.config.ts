import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Glimpse-style minimal config: Astryx ships prebuilt CSS + runtime Theme
// injection, so no StyleX plugin, no src alias, no optimizeDeps exclusion.
// (The /facebook/astryx example-vite source-compile setup is only for
// zero-runtime `astryx theme build` consumers; see USAGE.md.)
export default defineConfig({
  // Showcase serves under /astryx-dracula/ (Pages project site): public/
  // ships at the root, so public/fonts/*.woff2 resolves to
  // /astryx-dracula/fonts/*.woff2, matching the base-scoped @font-face URLs
  // in tokens.css. Never add a fonts alias — the copy step is the wiring.
  base: '/astryx-dracula/',
  plugins: [
    // Declare the layer order Astryx core expects (see the header of its
    // reset.css): reset, then component styles in astryx-base (astryx.css),
    // then theme overrides in astryx-theme (theme.css or runtime injection).
    // Any layer left out of this statement gets appended after the declared
    // ones, which would let core base styles beat the theme.
    {
      name: 'astryx-css-layer-order',
      transformIndexHtml() {
        return [
          {
            tag: 'style',
            children: '@layer reset, astryx-base, astryx-theme;',
            injectTo: 'head-prepend',
          },
        ];
      },
    },
    react(),
  ],
});
