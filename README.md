# astryx-dracula

[![NPM version](https://img.shields.io/npm/v/@yuzu-octopus/astryx-dracula.svg)](https://www.npmjs.com/package/@yuzu-octopus/astryx-dracula)
[![Build Status](https://github.com/yuzu-octopus/astryx-dracula/workflows/Deploy%20showcase/badge.svg)](https://github.com/yuzu-octopus/astryx-dracula/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Pure Dracula brand theme for Astryx React sites. Dark-only tokens, syntax highlighting, and chart colors with prebuilt CSS.

Live showcase: https://yuzu-octopus.github.io/astryx-dracula/

## Features

- 270+ tokens pinned to the official Dracula specification, dark-only
- Spec-exact code syntax theme plus chart series and sequential ramps
- Prebuilt CSS with zero runtime cost, or runtime injection for prototyping
- WCAG contrast gates enforced in CI via `bun run audit`
- Vendored JetBrains Mono fonts and Lucide icons, zero theme dependencies
- Agent skill, `llms.txt`, and copy-paste quickstart for AI-assisted adoption

## Installation

```bash
bun add @yuzu-octopus/astryx-dracula
```

## Usage

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from '@yuzu-octopus/astryx-dracula';
import '@yuzu-octopus/astryx-dracula/theme.css';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;
```

Copy `fonts/` from the package into your served `public/fonts/` directory.

> [!NOTE]
> For the plain-CSS path, migrating an existing codebase, and the full token reference, see [USAGE.md](USAGE.md) and [BRAND.md](BRAND.md). AI agents should start with the skill in `.agents/skills/astryx-dracula/SKILL.md`.

## Project layout

```text
astryx-theme.ts   defineTheme source, single source of truth
theme.css         prebuilt output of bun run theme:build
tokens.css        plain-CSS :root fallback for any stack
icons.tsx         vendored Lucide icon registry
fonts/            JetBrains Mono woff2 files
scripts/check.ts  palette plus contrast gates
demo/             showcase source, deployed to GitHub Pages
```

## Scripts

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `bun run audit`      | Palette plus contrast gates, fails on drift |
| `bun run theme:build`| Rebuild `theme.css` from the source        |
| `bun run theme:check`| Fail if committed theme outputs are stale  |
| `bun run build`      | Typecheck plus showcase build              |
