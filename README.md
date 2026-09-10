# astryx-dracula

[![NPM version](https://img.shields.io/npm/v/astryx-dracula.svg)](https://www.npmjs.com/package/astryx-dracula)
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
- 44 themed pages in `templates/`, published as an Astryx integration pack and viewable live at `/astryx-dracula/#/templates`

## Installation

```bash
bun add astryx-dracula
```

## Usage

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { astryxDraculaTheme } from 'astryx-dracula';
import 'astryx-dracula/theme.css';

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
templates/        44 themed pages plus integration specs
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

## Attribution & License

- **Astryx Design System**: Created by the Astryx team at Meta Platforms, Inc. under the [MIT License](https://github.com/facebook/astryx/blob/main/LICENSE). The 44 template files in `templates/` are derived from Astryx's open source page templates and adapted for the Dracula brand (pure Dracula spec retokening, recharts replaced with zero-dependency inline SVGs, heroicons mapped to Lucide, XLE/XLO structural expression headers, and responsive layout hardening).
- **Dracula Theme**: Color palette and specification by [Zeno Rocha and the Dracula Theme community](https://draculatheme.com).
- **Package & Additions**: Released under the [MIT License](LICENSE).
