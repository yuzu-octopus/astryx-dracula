# Astryx Styles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a copy-paste Dracula brand kit in astryx-styles so every Astryx site renders identical styling.

**Architecture:** Extract-then-freeze from glimpse. Single source `tokens.json` generates `tokens.css` and `astryx-theme.ts`. Demo proves tokens render. Docs give agents copy-paste snippets.

**Tech Stack:** Bun 1.4, React 19, `@astryxdesign/core` 0.3.0, `@astryxdesign/theme-neutral` 0.3.0, `@stylexjs/stylex` 0.19.0, Vite 6, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-09-07-astryx-styles-design.md` (this repo, written next commit)

## Global Constraints

- Pure Dracula hexes only, verified vs https://draculatheme.com/contribute and https://spec.draculatheme.com/: bg #282A36, current-line #44475A, fg #F8F8F2, comment #6272A4, cyan #8BE9FD, green #50FA7B, orange #FFB86C, pink #FF79C6, purple #BD93F9, red #FF5555, yellow #F1FA8C.
- Package manager `bun` / `bunx` only, never npm/npx/node/pip.
- Astryx API truth is `node_modules/@astryxdesign/core/dist/**/*.d.ts` (`defineTheme`, `<Theme theme mode>`); never invent ThemeProvider/createTheme.
- Vite StyleX config follows `/facebook/astryx` example-vite: css-layer order style tag, lightningcss targets chrome 123 / firefox 120 / safari 17.5, `optimizeDeps.exclude` Astryx packages, stylex plugin before react plugin.
- Files now, package later. No npm publish in this plan.
- Dark-only. No light-mode inversion (pure Dracula is dark-only).

---

### Task 1: Bun + Astryx scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`

**Interfaces:**
- Consumes: nothing
- Produces: `bun run dev` serves demo; `bunx tsc --noEmit` clean

- [ ] **Step 1: Write package.json**

```json
{
  "name": "astryx-styles",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "audit": "bun scripts/audit-dracula.ts"
  },
  "dependencies": {
    "@astryxdesign/core": "^0.3.0",
    "@astryxdesign/theme-neutral": "^0.3.0",
    "@stylexjs/stylex": "^0.19.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@astryxdesign/cli": "^0.3.0",
    "@stylexjs/unplugin": "^0.19.0",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "typescript": "^7.0.2",
    "vite": "^6.0.0"
  },
  "trustedDependencies": [
    "@astryxdesign/core",
    "@astryxdesign/cli"
  ]
}
```

- [ ] **Step 2: Install with bun**

Run: `bun install`
Expected: PASS, `bun.lock` created, no npm/npx used.

- [ ] **Step 3: Write vite.config.ts per Astryx example-vite**

```typescript
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lightningcssTargets = {
  chrome: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

export default defineConfig({
  plugins: [
    {
      name: 'astryx-css-layer-order',
      transformIndexHtml() {
        return [
          {
            tag: 'style',
            children:
              '@layer reset, priority1, priority2, priority3, priority4, priority5, priority6, priority7, priority8, priority9, astryx-theme;',
            injectTo: 'head-prepend',
          },
        ];
      },
    },
    stylex.vite({
      dev: process.env.NODE_ENV === 'development',
      runtimeInjection: false,
      treeshakeCompensation: true,
      useCSSLayers: true,
      unstable_moduleResolution: { type: 'commonJS', rootDir: __dirname },
      lightningcssOptions: { targets: lightningcssTargets },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@astryxdesign/core/theme/tokens.stylex': path.resolve(
        __dirname,
        'node_modules/@astryxdesign/core/src/theme/tokens.stylex.ts',
      ),
      '@astryxdesign/core': path.resolve(
        __dirname,
        'node_modules/@astryxdesign/core/src',
      ),
    },
  },
  optimizeDeps: {
    exclude: ['@astryxdesign/core', '@astryxdesign/theme-neutral'],
  },
});
```

- [ ] **Step 4: Run Astryx CLI init**

Run: `bunx @astryxdesign/cli init`
Expected: PASS, component index written to AGENTS.md.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html bun.lock
git commit -m "feat: bun astryx vite scaffold"
```

---

### Task 2: Token source + CSS + Astryx theme

**Files:**
- Create: `tokens.json`
- Create: `tokens.css`
- Create: `astryx-theme.ts`
- Create: `scripts/audit-dracula.ts`

**Interfaces:**
- Consumes: glimpse `src/index.css` :root fallbacks, `src/shared/theme/glanceRamp.ts` ramp math, `src/shared/theme/glimpseTheme.ts` DIMS
- Produces: `tokens.css` plain-CSS import; `astryx-theme.ts` default export `astryxStylesTheme` for `<Theme theme mode>`

- [ ] **Step 1: Write tokens.json (single source)**

```json
{
  "primitives": {
    "dracula-bg": "#282A36",
    "dracula-current-line": "#44475A",
    "dracula-fg": "#F8F8F2",
    "dracula-comment": "#6272A4",
    "dracula-cyan": "#8BE9FD",
    "dracula-green": "#50FA7B",
    "dracula-orange": "#FFB86C",
    "dracula-pink": "#FF79C6",
    "dracula-purple": "#BD93F9",
    "dracula-red": "#FF5555",
    "dracula-yellow": "#F1FA8C"
  },
  "dims": {
    "--space-gap": "23px",
    "--space-viewport": "15px",
    "--widget-content-vertical": "15px",
    "--widget-content-horizontal": "17px",
    "--widget-gap": "23px",
    "--tile-row": "96px",
    "--border-radius": "5px",
    "--font-size-h1": "17px",
    "--font-size-h2": "16px",
    "--font-size-h3": "15px",
    "--font-size-h4": "14px",
    "--font-size-base": "13px",
    "--font-size-h5": "12px",
    "--font-size-h6": "11px",
    "--font-family-mono": "'JetBrains Mono', ui-monospace, monospace"
  },
  "semantic": {
    "--color-background": "dracula-bg",
    "--color-primary": "dracula-purple",
    "--color-positive": "dracula-green",
    "--color-negative": "dracula-red",
    "--color-warning": "dracula-yellow",
    "--color-info": "dracula-cyan",
    "--color-tag-orange": "dracula-orange",
    "--color-tag-pink": "dracula-pink",
    "--color-text-subdue": "#4C5067"
  }
}
```

- [ ] **Step 2: Write tokens.css (plain-CSS fallback, :root real values)**

```css
:root {
  color-scheme: dark;
  --dracula-bg: #282A36;
  --dracula-current-line: #44475A;
  --dracula-fg: #F8F8F2;
  --dracula-comment: #6272A4;
  --dracula-cyan: #8BE9FD;
  --dracula-green: #50FA7B;
  --dracula-orange: #FFB86C;
  --dracula-pink: #FF79C6;
  --dracula-purple: #BD93F9;
  --dracula-red: #FF5555;
  --dracula-yellow: #F1FA8C;
  --space-gap: 23px;
  --space-viewport: 15px;
  --widget-content-vertical: 15px;
  --widget-content-horizontal: 17px;
  --widget-gap: 23px;
  --tile-row: 96px;
  --border-radius: 5px;
  --font-size-base: 13px;
  --color-background: #282A36;
  --color-primary: #BD93F9;
  --color-positive: #50FA7B;
  --color-negative: #FF5555;
  --color-warning: #F1FA8C;
  --color-info: #8BE9FD;
  --color-tag-orange: #FFB86C;
  --color-tag-pink: #FF79C6;
  --color-text-subdue: #4C5067;
}
```

- [ ] **Step 3: Write astryx-theme.ts (defineTheme, dark tuples pinned)**

```typescript
import { defineTheme } from '@astryxdesign/core/theme';

export const astryxStylesTheme = defineTheme({
  name: 'astryx-dracula',
  tokens: {
    '--color-background': ['#282A36', '#282A36'],
    '--color-primary': ['#BD93F9', '#BD93F9'],
    '--color-positive': ['#50FA7B', '#50FA7B'],
    '--color-negative': ['#FF5555', '#FF5555'],
    '--color-warning': ['#F1FA8C', '#F1FA8C'],
    '--color-info': ['#8BE9FD', '#8BE9FD'],
    '--color-tag-orange': ['#FFB86C', '#FFB86C'],
    '--color-tag-pink': ['#FF79C6', '#FF79C6'],
    '--border-radius': '5px',
    '--space-gap': '23px',
  },
});
```

- [ ] **Step 4: Write scripts/audit-dracula.ts (fails on hex drift)**

```typescript
const expected: Record<string, string> = {
  bg: '#282A36',
  currentLine: '#44475A',
  fg: '#F8F8F2',
  comment: '#6272A4',
  cyan: '#8BE9FD',
  green: '#50FA7B',
  orange: '#FFB86C',
  pink: '#FF79C6',
  purple: '#BD93F9',
  red: '#FF5555',
  yellow: '#F1FA8C',
};

const css = await Bun.file('tokens.css').text();
let failed = false;
for (const [name, hex] of Object.entries(expected)) {
  if (!css.toLowerCase().includes(hex.toLowerCase())) {
    console.error(`missing ${name} ${hex} in tokens.css`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('dracula audit PASS: 11/11 hexes present');
```

- [ ] **Step 5: Run audit + typecheck**

Run: `bun scripts/audit-dracula.ts && bunx tsc --noEmit`
Expected: PASS both.

- [ ] **Step 6: Commit**

```bash
git add tokens.json tokens.css astryx-theme.ts scripts/audit-dracula.ts
git commit -m "feat: pure dracula tokens css and astryx theme"
```

---

### Task 3: Agent docs + demo

**Files:**
- Create: `BRAND.md`
- Create: `USAGE.md`
- Create: `AGENTS.snippet.md`
- Create: `demo/App.tsx`

**Interfaces:**
- Consumes: Task 2 tokens
- Produces: agent copy-paste path; visual proof page

- [ ] **Step 1: Write BRAND.md (palette table + semantic map + dims)**

Palette table lists all 11 hexes with roles. Semantic map: purple links/titles unvisited, green positive, red negative, yellow tags/chips, cyan info/secondary links, pink flair, orange warning, subdue #4C5067 metadata/separators. Dims list from tokens.json.

- [ ] **Step 2: Write USAGE.md (plain CSS + Astryx paths)**

Plain CSS path:

```css
@import '../tokens.css';
```

Astryx path:

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxStylesTheme } from '../astryx-theme';

<Theme theme={astryxStylesTheme} mode="dark">
  <App />
</Theme>;
```

- [ ] **Step 3: Write AGENTS.snippet.md (8-line copy block)**

```md
## Astryx Styles (brand source of truth)

Import `astryx-styles/tokens.css` for plain CSS vars, or
`astryx-styles/astryx-theme.ts` (`astryxStylesTheme`) with
`<Theme theme mode="dark">` from `@astryxdesign/core/theme`.
Never invent hexes: Dracula bg #282A36 fg #F8F8F2 comment #6272A4
purple #BD93F9 green #50FA7B red #FF5555 yellow #F1FA8C cyan #8BE9FD
pink #FF79C6 orange #FFB86C current-line #44475A.
```

- [ ] **Step 4: Write demo/App.tsx (swatch grid proving tokens)**

Renders 11 swatches reading `var(--dracula-*)` plus Card/Banner/Text from `@astryxdesign/core` inside `<Theme>`. No test file; visual proof only.

- [ ] **Step 5: Verify demo serves**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add BRAND.md USAGE.md AGENTS.snippet.md demo/App.tsx
git commit -m "docs: brand kit docs and demo"
```
