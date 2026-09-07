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
- Vite config follows glimpse (prebuilt CSS + runtime Theme): stock Vite React plus css-layer order style tag. No StyleX plugin, no src alias, no `optimizeDeps.exclude`.
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
    "@types/bun": "^1.4.1",
    "@types/node": "^26.4.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "typescript": "^7.0.2",
    "vite": "^8.0.0"
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

- [ ] **Step 3: Write vite.config.ts (glimpse-style minimal, prebuilt CSS path)**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    react(),
  ],
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

- [ ] **Step 3: Write astryx-theme.ts (valid Astryx tokens, dark tuples pinned)**

Token names MUST be valid `TokenName`s (see `node_modules/@astryxdesign/core/dist/theme/tokens.stylex.d.ts`).
Glimpse-style: build a `Record<string, TokenValue>` (bypasses excess-property checks for glance compat vars),
`extends: neutralTheme`, JetBrains Mono typography. Dracula accents map to `--color-accent/success/error/warning/info`,
surfaces to `--color-background-body/surface/card/popover/muted`, plus glance `--color-*` compat vars.

```typescript
import { defineTheme, type DefinedTheme, type TokenValue } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

const pin = (hex: string): [string, string] => [hex, hex];

const tokens: Record<string, TokenValue> = {
  '--space-gap': '23px',
  '--space-viewport': '15px',
  '--widget-content-vertical': '15px',
  '--widget-content-horizontal': '17px',
  '--widget-gap': '23px',
  '--tile-row': '96px',
  '--border-radius': '5px',
  '--color-background-body': pin('#282A36'),
  '--color-background-surface': pin('#2A2C39'),
  '--color-background-card': pin('#2A2C39'),
  '--color-background-popover': pin('#2D3040'),
  '--color-background-muted': pin('#313342'),
  '--color-border': pin('#313342'),
  '--color-border-emphasized': pin('#424559'),
  '--color-accent': pin('#BD93F9'),
  '--color-accent-muted': pin('#8BE9FD'),
  '--color-success': pin('#50FA7B'),
  '--color-error': pin('#FF5555'),
  '--color-warning': pin('#F1FA8C'),
  '--color-info': pin('#8BE9FD'),
  '--color-text-accent': pin('#BD93F9'),
  '--color-icon-accent': pin('#BD93F9'),
  '--color-background': pin('#282A36'),
  '--color-primary': pin('#BD93F9'),
  '--color-text-subdue': pin('#4C5067'),
  '--radius-element': '5px',
  '--radius-container': '5px',
};

export const astryxStylesTheme: DefinedTheme = defineTheme({
  name: 'astryx-dracula',
  extends: neutralTheme,
  tokens,
  typography: {
    scale: { base: 13, ratio: 1.2 },
    body: { family: 'JetBrains Mono', fallbacks: 'monospace' },
    heading: { family: 'JetBrains Mono', fallbacks: 'monospace', weight: 'normal' },
    code: { family: 'JetBrains Mono', fallbacks: 'monospace' },
  },
});
```

Also add `@types/bun` + `@types/node` to devDependencies and `"types": ["bun", "node", "vite/client"]` in tsconfig.json
(vite.config `path`/`url`/`process` globals and `Bun.file`/`process.exit` in scripts need them — matches glimpse).

- [ ] **Step 4: Write scripts/audit-dracula.ts (fails on hex drift)**

```typescript
export {};
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
- Create: `demo/main.tsx`

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

Renders 11 swatches plus Card/Banner/Heading/Text/Grid from `@astryxdesign/core` inside `<Theme>`.
`Heading` needs `level={1}`. `demo/main.tsx` imports `@astryxdesign/core/reset.css`,
`@astryxdesign/core/astryx.css`, `../tokens.css` then mounts `App`. No test file; visual proof only.

- [ ] **Step 5: Verify demo serves**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add BRAND.md USAGE.md AGENTS.snippet.md demo/App.tsx demo/main.tsx
git commit -m "docs: brand kit docs and demo"
```
