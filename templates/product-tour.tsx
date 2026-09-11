// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @sideNav=(SN > (SNS"Getting started" > (SNI"Introduction"! + SNI"Install")) + (SNS"The brand" > (SNI"Palette" + SNI"Type and shape")) + (SNS"In practice" > (SNI"Components" + SNI"Templates")) + (SNS"Reference" > (SNI"Tokens" + SNI"Migrating")))] > L[h=auto] > (LC[p=8 !scroll] > V[g=8] > (V[g=2] > (H[g=2 a=center] > MNT + Tx[t=supporting]) + Hd"Introduction"[level=1 t=display-2] + Tx"v0.2.1"[t=supporting]) + Tx"Intro"[t=large] + AR + (V[g=8] > (V[g=3] > Hd"What it is"[level=2] + Tx"Body"[t=body] + UL + Cd)*2) + D + (H[j=between] > B.secondary"Previous" + B.secondary"Next")) + (LP[!scroll] > Outline)

/**
 * Product Tour — a chaptered walkthrough of this theme.
 *
 * Frame-first layout (see `npx astryx docs layout`):
 *
 *   Frame: chapter rail 264 (SideNav) | chapter content (fill) | outline 240
 *
 * Responsive contract:
 *   > 1024px  rail | content | outline
 *   <= 1024px outline hidden and replaced by the "On this page" Selector above
 *             the chapter; the rail collapses into the AppShell mobile drawer
 *
 * Container policy (docs archetype): one prose column of headings, paragraphs
 * and code. No cards, no badges. The rail and the outline carry the structure,
 * and status or metadata rides on Text.
 */

import {useState, type CSSProperties} from 'react';

import {AppShell} from '@astryxdesign/core/AppShell';
import {MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutPanel,
  StackItem,
  VStack,
} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import type {IconType} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {Divider} from '@astryxdesign/core/Divider';
import {List, ListItem} from '@astryxdesign/core/List';
import {Outline, type OutlineItem} from '@astryxdesign/core/Outline';
import {Selector} from '@astryxdesign/core/Selector';
import {useMediaQuery} from '@astryxdesign/core/hooks';

import {
  ChevronLeft,
  ChevronRight,
  Hash,
  LayoutGrid,
  Rocket,
  RotateCw,
  Rows3,
  Sparkles,
  SquareTerminal,
  Type,
} from 'lucide-react';

const SELF_HASH = '#/templates/product-tour';

// Astryx has no image primitive: AspectRatio exposes no objectFit or radius
// props, so the scene fill and the corner clip live in these two styles.
const sceneFill: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
const sceneClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};

// The outline is sticky so it tracks the chapter as the document scrolls.
const outlinePanel: CSSProperties = {
  position: 'sticky',
  top: 'var(--spacing-6)',
  alignSelf: 'start',
  paddingBlockStart: 'var(--spacing-2)',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocSection {
  // Unique within the chapter; the DOM id is derived from it so the outline
  // links and the headings can never drift apart.
  key: string;
  heading: string;
  body: string;
  bullets?: string[];
  code?: {language: string; title: string; source: string};
}

interface DocChapter {
  id: string;
  title: string;
  icon: IconType;
  intro: string;
  hasArt?: boolean;
  sections: DocSection[];
}

const sectionId = (chapterId: string, key: string) => `${chapterId}--${key}`;

// ─── Content ─────────────────────────────────────────────────────────────────

const CHAPTER_GROUPS: Array<{title: string; chapters: DocChapter[]}> = [
  {
    title: 'Getting started',
    chapters: [
      {
        id: 'introduction',
        title: 'Introduction',
        icon: Rocket,
        hasArt: true,
        intro:
          'astryx-dracula is a pure Dracula brand theme for Astryx React sites. It pins the official palette, compiles to prebuilt CSS, and costs nothing at runtime. Dark is not a mode here, it is the brand.',
        sections: [
          {
            key: 'what-it-is',
            heading: 'What it is',
            body: 'Four decisions shape everything else in this theme.',
            bullets: [
              'Dark only. The Dracula spec is a dark scheme, so every token pins the same value in both mode slots. No light theme exists or is planned.',
              'Spec exact. Every colour is a hex from the official specification. Nothing is invented, and a new colour need is a brand question, not a one-off value.',
              'Zero runtime cost. The theme compiles to prebuilt CSS, with a runtime injection path for prototyping.',
              'Zero theme dependencies. Fonts and icons are vendored, so adopting the theme installs nothing else.',
            ],
          },
          {
            key: 'how-it-fits',
            heading: 'How it fits together',
            body: 'One source of truth, three outputs, and a gate that refuses to let them drift.',
            bullets: [
              'astryx-theme.ts is the only place a colour is decided.',
              'theme.css is the compiled result that apps import.',
              'tokens.css is a plain :root fallback for stacks that are not Astryx.',
              'scripts/check.ts enforces the palette and the contrast floors, so drift fails the build instead of shipping.',
            ],
          },
        ],
      },
      {
        id: 'install',
        title: 'Install',
        icon: SquareTerminal,
        intro:
          'Three import paths, same hexes. Pick one per site and stay on it. The prebuilt path is the recommended one for an Astryx app.',
        sections: [
          {
            key: 'install-package',
            heading: 'Install the package',
            body: 'The package carries the compiled theme, the plain-CSS fallback, the fonts and the icon registry.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `bun add astryx-dracula`,
            },
          },
          {
            key: 'wire-the-entry',
            heading: 'Wire the entry',
            body: 'Import order matters. Core reset and component CSS load first, then the theme tokens, then the compiled theme so its overrides win.',
            code: {
              language: 'tsx',
              title: 'main.tsx',
              source: `import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import 'astryx-dracula/tokens.css';
import 'astryx-dracula/theme.css';
import {Theme} from '@astryxdesign/core/theme';
import {astryxDraculaTheme} from 'astryx-dracula';

<Theme theme={astryxDraculaTheme} mode="dark">
  <App />
</Theme>;`,
            },
          },
          {
            key: 'ship-the-fonts',
            heading: 'Ship the fonts',
            body: 'Copy the package fonts directory into your served static folder. tokens.css declares the font faces, so skipping the copy falls back to a system monospace rather than failing loudly.',
            bullets: [
              'Vite and similar bundlers serve from public/, so copy to public/fonts/.',
              'The theme sets one family, JetBrains Mono, for body, heading and code alike.',
              'If text renders in a system monospace, the copy step is the first thing to check.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'The brand',
    chapters: [
      {
        id: 'palette',
        title: 'Palette',
        icon: Sparkles,
        hasArt: true,
        intro:
          'Fifteen colours carry the entire brand: twelve from the specification and three derived surface steps. Every one is a variable, and none of them is ever written by hand in a component.',
        sections: [
          {
            key: 'the-spec',
            heading: 'The specification twelve',
            body: 'Background, Current Line, Selection and Foreground set the stage. Comment, Cyan, Green, Orange, Pink, Purple, Red and Yellow do the semantic work.',
            bullets: [
              'Current Line doubles as the colour for subtle borders and separators.',
              'Comment and Current Line intentionally share one hex in the spec, which is why they look identical in the strip above.',
              'Purple is reserved for anything tappable, so it never appears as decoration.',
            ],
          },
          {
            key: 'surfaces',
            heading: 'Surface steps',
            body: 'Cards, popovers and shadows come from the spec UI palette rather than from opacity tricks.',
            bullets: [
              'Background Light is the card and surface colour.',
              'Background Lighter is for popovers and floating elements.',
              'Background Dark carries shadows and recessed areas.',
            ],
          },
          {
            key: 'derived-lifts',
            heading: 'Derived lifts',
            body: 'Three text greys are deliberately not spec hexes. The spec Comment colour fails the WCAG AA floor for body text, so these are same-hue lifts that clear it. They are documented as deviations rather than silently invented.',
          },
        ],
      },
      {
        id: 'type-shape',
        title: 'Type and shape',
        icon: Type,
        hasArt: true,
        intro:
          'One typeface, a quiet weight range, and borders instead of shadows. The shape language stays flat on purpose.',
        sections: [
          {
            key: 'one-family',
            heading: 'One family, on purpose',
            body: 'JetBrains Mono runs body, heading and code alike. A single family is what makes the brand legible at a glance next to any sans-serif product.',
            bullets: [
              'Roles beat raw sizes: body, supporting, code, large and label.',
              'Nothing meaningful renders below twelve pixels.',
              'Quantities always carry tabular numerals so columns line up.',
            ],
          },
          {
            key: 'the-scale',
            heading: 'The scale',
            body: 'A base of fourteen with a 1.2 ladder generates the steps. Headings take their size from the scale roles, so a level three heading renders the large step rather than a pinned pixel value.',
          },
          {
            key: 'flat-and-crisp',
            heading: 'Flat and crisp',
            body: 'Five pixel radii on elements and four on inner surfaces. Depth comes from separator borders, never from soft grey shadows, and there are no pills or decorative circles.',
          },
        ],
      },
    ],
  },
  {
    title: 'In practice',
    chapters: [
      {
        id: 'components',
        title: 'Components',
        icon: Rows3,
        intro:
          'Styling follows one order: reach for a component prop first, then a theme override, and only then a token in a style object. Per-app CSS is not part of the plan.',
        sections: [
          {
            key: 'props-first',
            heading: 'Props before styles',
            body: 'Every Astryx component already reads the theme through its props. Passing a prop keeps the component in charge of its own layout and states; an inline style takes that control away.',
            bullets: [
              'Layout and spacing come from props, never from a wrapper element.',
              'Dense data renders as rows. Wrapping each row in a card is the fastest way to make a product look templated.',
              'Components do the layout. A raw div for structure is a defect, not a shortcut.',
            ],
          },
          {
            key: 'status-vocabulary',
            heading: 'Status has a fixed vocabulary',
            body: 'Green positive, red negative, yellow tags, cyan information, pink flair, orange warning. Status surfaces use a ten percent categorical wash with a semantic border rather than a direct fill.',
            code: {
              language: 'tsx',
              title: 'Status.tsx',
              source: `// Status rides on the component built for it.
<StatusDot variant="success" label="Live" />

// Counts are what Badge is for. Status is not.
<Badge label={unread} variant="neutral" />`,
            },
          },
          {
            key: 'purple-means-tappable',
            heading: 'Purple means tappable',
            body: 'Links, titles and primary actions are purple. Hover resolves to the foreground with an underline, and visited falls back to body text. Users learn the signal in seconds, which is exactly why nothing decorative is allowed to wear it.',
          },
        ],
      },
      {
        id: 'templates',
        title: 'Templates',
        icon: LayoutGrid,
        hasArt: true,
        intro:
          'Forty-four themed pages ship with the package as an Astryx integration pack. Each one is a real page, already retokened and structurally validated, and each one scaffolds in a single command.',
        sections: [
          {
            key: 'scaffold-a-page',
            heading: 'Scaffold a page',
            body: 'List the package in your Astryx config, then pull any page into your project.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `# any of the 44 page ids
bunx astryx template dashboard --package astryx-dracula
bunx astryx template product-tour --package astryx-dracula`,
            },
          },
          {
            key: 'pack-rules',
            heading: 'What the pages may import',
            body: 'Each template is self-contained: React, the Astryx core, Lucide icons, and the kit shared modules (astryx-dracula/shared/*). No chart library, no CSS framework, no other internal module. Every chart is a hand-drawn inline SVG, which is why a scaffolded page has no dependency surprises.',
          },
          {
            key: 'xle-headers',
            heading: 'Read the header first',
            body: 'Every template leads with a one-line structural expression describing the frame it renders, validated by the CLI. Reading that line costs a fraction of reading the file, which makes adapting a page much cheaper than rebuilding it.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `# validate the structure comment against the render
bunx astryx layout check "L > (LC > V[g=4] > Hd\\"Title\\"[level=1])"`,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Reference',
    chapters: [
      {
        id: 'tokens',
        title: 'Tokens',
        icon: Hash,
        intro:
          'The theme is a set of custom properties and nothing else. Knowing the four namespaces is enough to build any surface without inventing a value.',
        sections: [
          {
            key: 'namespaces',
            heading: 'The four namespaces',
            body: 'Each namespace answers a different question, and the answer is always a variable.',
            code: {
              language: 'css',
              title: 'tokens.css',
              source: `/* semantic role, set by the theme */
color: var(--color-text-primary);

/* raw Dracula hex, for art and one-off data colours */
fill: var(--dracula-cyan);

/* Astryx spacing scale */
padding: var(--spacing-6);

/* layout and shape */
border-radius: var(--radius-container);`,
            },
          },
          {
            key: 'never-invent-a-hex',
            heading: 'Never invent a hex',
            body: 'A new colour need goes through the theme source and the audit, not into a component. Overriding colour variables in an app root is the other half of the same rule: brand changes belong in the theme, so every site that uses it moves together.',
          },
          {
            key: 'audit-gates',
            heading: 'The audit gates',
            body: 'Two commands stand between a colour decision and a published package.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `bun run audit        # palette purity plus contrast floors
bun run theme:check  # fails when compiled CSS is stale`,
            },
          },
        ],
      },
      {
        id: 'migrating',
        title: 'Migrating',
        icon: RotateCw,
        intro:
          'Bringing an existing site onto the theme is an inventory problem before it is a styling problem. Find the colours first, then map them.',
        sections: [
          {
            key: 'inventory',
            heading: 'Inventory what is there',
            body: 'Search for raw hex values, existing root override blocks, utility frameworks and any theme provider already in the tree. The goal is a complete list before a single file is touched.',
          },
          {
            key: 'map-and-replace',
            heading: 'Map, then replace',
            body: 'Every found colour maps to a row in the brand guide. A colour that will not map is a brand question rather than a new hex, which is the point of doing the inventory first.',
            bullets: [
              'Delete the old provider and the root overrides in the same change that adds the new ones.',
              'Swap raw elements for the components that already carry the layout.',
              'Keep the diff boring: one mechanism per site, not a migration and a redesign at once.',
            ],
          },
          {
            key: 'verify',
            heading: 'Verify',
            body: 'Build, screenshot the key pages, and grep the source for stray hexes. A surviving hex in application code means the mapping was incomplete, not that the theme needed a new colour.',
          },
        ],
      },
    ],
  },
];

const CHAPTERS: DocChapter[] = CHAPTER_GROUPS.flatMap(group => group.chapters);

// Derived once at module scope so the Outline receives a stable array identity
// and does not re-register its scroll spy on every render.
const OUTLINE_BY_CHAPTER: Record<string, OutlineItem[]> = Object.fromEntries(
  CHAPTERS.map(chapter => [
    chapter.id,
    chapter.sections.map(section => ({
      id: sectionId(chapter.id, section.key),
      label: section.heading,
      level: 2,
    })),
  ]),
);

const DEFAULT_CHAPTER = 'introduction';

// ─── Scene: the theme at night ───────────────────────────────────────────────
// Drawn, not loaded. Inline SVG keeps a template dependency-free and paints in
// theme tokens instead of a fixed palette, so every scene follows the brand.

// A bat written once and placed three times, so the sky gets depth from scale
// and opacity rather than from three hand-tuned chevrons. The wing is a
// leading edge out to the tip and a scalloped trailing edge back; the second
// subpath is the same wing mirrored.
const BAT_WING =
  'M 2 -4.6 C 5.6 -8.6 12 -11 19.5 -9.6 C 18 -5 16.5 -1.6 14.2 1.2 ' +
  'C 13.6 -1.2 12.6 -2.2 11.2 -2.1 C 10.8 0.4 10 2.2 8.4 3.2 ' +
  'C 7.9 0.6 7.2 -0.4 6.1 -0.3 C 5.8 1.6 5.2 2.8 4.2 3.6 ' +
  'C 3.4 1.4 2.6 -1.6 2 -4.6 Z ' +
  'M -2 -4.6 C -5.6 -8.6 -12 -11 -19.5 -9.6 C -18 -5 -16.5 -1.6 -14.2 1.2 ' +
  'C -13.6 -1.2 -12.6 -2.2 -11.2 -2.1 C -10.8 0.4 -10 2.2 -8.4 3.2 ' +
  'C -7.9 0.6 -7.2 -0.4 -6.1 -0.3 C -5.8 1.6 -5.2 2.8 -4.2 3.6 ' +
  'C -3.4 1.4 -2.6 -1.6 -2 -4.6 Z';

// Body between the wings: two ears, a shoulder, a taper to the tail.
const BAT_BODY =
  'M -2.2 -5 C -2.5 -6.6 -3.2 -8.2 -4 -9.2 L -2.3 -7.6 ' +
  'C -1.5 -8.2 -0.8 -8.4 0 -8.4 C 0.8 -8.4 1.5 -8.2 2.3 -7.6 ' +
  'L 4 -9.2 C 3.2 -8.2 2.5 -6.6 2.2 -5 C 2.4 -0.8 1.9 2.6 0 6 ' +
  'C -1.9 2.6 -2.4 -0.8 -2.2 -5 Z';

// A stepped conifer, 20 tall on its base at the origin. Three of these on the
// near crest give the castle a scale to be measured against.
const FIR =
  'M 0 -20 L 2.6 -13.5 L 1.4 -13.5 L 4.2 -7.5 L 2.8 -7.5 L 5.6 -1.5 ' +
  'L -5.6 -1.5 L -2.8 -7.5 L -4.2 -7.5 L -1.4 -13.5 L -2.6 -13.5 Z';

function Bat({x, y, scale, opacity}: {x: number; y: number; scale: number; opacity: number}) {
  return (
    <g
      fill="var(--dracula-comment)"
      opacity={opacity}
      transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={BAT_WING} />
      <path d={BAT_BODY} />
    </g>
  );
}

function Fir({x, y, scale}: {x: number; y: number; scale: number}) {
  return <path d={FIR} transform={`translate(${x} ${y}) scale(${scale})`} />;
}

function NightScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <defs>
        {/* The moon's halo and the light it drops on the ridge below. Drawn as
            gradients: stacked flat circles band badly at this contrast. */}
        <radialGradient id="pt-night-glow">
          <stop
            offset="30%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0.16}}
          />
          <stop
            offset="65%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0.05}}
          />
          <stop
            offset="100%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0}}
          />
        </radialGradient>
        <radialGradient id="pt-night-pool">
          <stop
            offset="0%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0.13}}
          />
          <stop
            offset="55%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0.04}}
          />
          <stop
            offset="100%"
            style={{stopColor: 'var(--dracula-yellow)', stopOpacity: 0}}
          />
        </radialGradient>
        {/* The far ridge doubles as the clip for its own pool of moonlight. */}
        <clipPath id="pt-night-lit">
          <path d="M0 118 Q34 88 78 82 Q124 74 150 78 Q188 84 226 104 Q268 126 318 128 Q360 130 400 122 V225 H0 Z" />
        </clipPath>
      </defs>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      {/* Star field. Comment grey, never purple: purple is reserved. */}
      <g fill="var(--dracula-comment)">
        <circle cx="38" cy="34" r="1.5" opacity="0.85" />
        <circle cx="72" cy="58" r="1.1" opacity="0.6" />
        <circle cx="108" cy="26" r="1.3" opacity="0.75" />
        <circle cx="146" cy="72" r="1" opacity="0.5" />
        <circle cx="176" cy="34" r="1.6" opacity="0.9" />
        <circle cx="206" cy="84" r="1.1" opacity="0.55" />
        <circle cx="232" cy="20" r="1.2" opacity="0.7" />
        <circle cx="258" cy="62" r="1" opacity="0.5" />
        <circle cx="120" cy="74" r="1" opacity="0.45" />
        <circle cx="356" cy="30" r="1.3" opacity="0.75" />
        <circle cx="380" cy="86" r="1.1" opacity="0.55" />
        <circle cx="28" cy="72" r="1.2" opacity="0.6" />
        <circle cx="188" cy="60" r="1" opacity="0.45" />
      </g>
      <g fill="var(--dracula-cyan)" opacity="0.85">
        <circle cx="166" cy="46" r="1.4" />
        <circle cx="372" cy="22" r="1.2" />
      </g>
      <g fill="var(--dracula-pink)" opacity="0.8">
        <circle cx="94" cy="44" r="1.3" />
        <circle cx="272" cy="94" r="1.1" />
      </g>

      {/* Harvest moon: halo, disc, then the maria. */}
      <circle cx="306" cy="62" r="74" fill="url(#pt-night-glow)" />
      <circle cx="306" cy="62" r="25" fill="var(--dracula-yellow)" />
      <circle cx="296" cy="53" r="7" fill="var(--dracula-orange)" opacity="0.5" />
      <circle cx="314" cy="71" r="4.5" fill="var(--dracula-orange)" opacity="0.5" />
      <circle cx="310" cy="50" r="3" fill="var(--dracula-orange)" opacity="0.35" />

      {/* Far ridge, hazed toward the moon. It carries the castle, so it is the
          lightest plane in the scene. */}
      <path
        d="M0 118 Q34 88 78 82 Q124 74 150 78 Q188 84 226 104 Q268 126 318 128 Q360 130 400 122 V225 H0 Z"
        fill="var(--dracula-selection)"
      />
      <g clipPath="url(#pt-night-lit)">
        <ellipse
          cx="304"
          cy="182"
          rx="128"
          ry="68"
          fill="url(#pt-night-pool)"
          transform="rotate(-6 304 182)"
        />
      </g>

      {/* Castle, a silhouette against the lit ridge: battlements, two towers,
          the keep breaking the skyline, and four windows lit from inside. */}
      <g fill="var(--dracula-bg-dark)">
        <rect x="104" y="124" width="82" height="16" />
        <rect x="127" y="119" width="7" height="5" />
        <rect x="137" y="119" width="7" height="5" />
        <rect x="147" y="119" width="7" height="5" />
        <rect x="157" y="119" width="7" height="5" />
        <rect x="104" y="100" width="22" height="40" />
        <rect x="104.5" y="95" width="7" height="5" />
        <rect x="114.5" y="95" width="7" height="5" />
        <rect x="164" y="96" width="22" height="44" />
        <rect x="164.5" y="91" width="7" height="5" />
        <rect x="174.5" y="91" width="7" height="5" />
        <rect x="132" y="68" width="28" height="72" />
        <rect x="132.5" y="63" width="7" height="5" />
        <rect x="142" y="63" width="7" height="5" />
        <rect x="151.5" y="63" width="7" height="5" />
      </g>
      <g fill="var(--dracula-yellow)">
        <path d="M139 124 v-10 a6 6 0 0 1 12 0 v10 Z" />
        <rect x="142" y="84" width="6" height="8" rx="1" />
        <rect x="110" y="112" width="5" height="8" rx="1" />
        <rect x="173" y="108" width="5" height="8" rx="1" />
      </g>
      <rect x="173" y="124" width="5" height="8" rx="1" fill="var(--dracula-orange)" opacity="0.55" />

      {/* Three planes of ground, each darker than the one behind it. The near
          rise crops the castle's base, which is what puts it at a distance. */}
      <path
        d="M0 162 Q58 134 120 131 Q182 128 240 150 Q312 176 400 152 V225 H0 Z"
        fill="var(--dracula-bg-light)"
      />
      <path
        d="M0 196 Q86 176 168 186 Q250 196 322 182 Q366 174 400 184 V225 H0 Z"
        fill="var(--dracula-bg)"
      />
      <path
        d="M0 212 Q118 200 236 210 Q324 217 400 208 V225 H0 Z"
        fill="var(--dracula-bg-dark)"
      />

      <g fill="var(--dracula-bg-dark)">
        <Fir x={30} y={149} scale={0.7} />
        <Fir x={48} y={144} scale={0.5} />
        <Fir x={250} y={152} scale={0.7} />
        <Fir x={266} y={156} scale={0.55} />
        <Fir x={286} y={159} scale={0.8} />
        <Fir x={100} y={185} scale={0.95} />
      </g>

      {/* Bats: nearest is largest and most solid. */}
      <Bat x={252} y={92} scale={1.1} opacity={0.92} />
      <Bat x={178} y={42} scale={0.72} opacity={0.78} />
      <Bat x={352} y={96} scale={0.5} opacity={0.55} />
    </svg>
  );
}

// ─── Scene: the palette ──────────────────────────────────────────────────────

// Three rows of five: the six surfaces and neutrals, then the nine accents,
// in the same order as the palette table in the brand guide.
const PALETTE_ROWS: string[][] = [
  [
    'var(--dracula-bg)',
    'var(--dracula-current-line)',
    'var(--dracula-selection)',
    'var(--dracula-bg-light)',
    'var(--dracula-bg-lighter)',
  ],
  [
    'var(--dracula-bg-dark)',
    'var(--dracula-fg)',
    'var(--dracula-comment)',
    'var(--dracula-cyan)',
    'var(--dracula-green)',
  ],
  [
    'var(--dracula-orange)',
    'var(--dracula-pink)',
    'var(--dracula-purple)',
    'var(--dracula-red)',
    'var(--dracula-yellow)',
  ],
];

function PaletteScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />
      {/* Swatches run edge to edge with one hairline each. Without the stroke
          the three darkest surfaces vanish into a backdrop of the same tone. */}
      {PALETTE_ROWS.map((row, rowIndex) => (
        <g key={row.join('-')}>
          {row.map((fill, columnIndex) => (
            <rect
              key={fill}
              x={13 + columnIndex * 76}
              y={27 + rowIndex * 62}
              width={70}
              height={50}
              rx={6}
              fill={fill}
              stroke="var(--dracula-comment)"
              strokeOpacity={0.55}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── Scene: the type scale ───────────────────────────────────────────────────

const TYPE_LADDER = [
  {label: 'h1', size: 30},
  {label: 'h2', size: 24},
  {label: 'body', size: 18},
  {label: 'supporting', size: 14},
];

// The specimen is set on a 34px baseline grid and the ladder lands on the same
// lines, so the scale reads as a measurement rather than a list.
const TYPE_LEADING = 34;
const TYPE_BASELINE = 74;

function TypeScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      {/* One rule per ladder row: the grid is the scale's own rhythm. */}
      <g stroke="var(--dracula-comment)" strokeOpacity={0.3}>
        {TYPE_LADDER.map((step, index) => (
          <path
            key={step.label}
            d={`M0 ${TYPE_BASELINE + index * TYPE_LEADING} H400`}
          />
        ))}
      </g>
      {/* Specimen on the left of the rule, the ladder on the right. */}
      <path d="M206 52 V192" stroke="var(--dracula-comment)" strokeOpacity={0.22} />

      <g fontFamily="var(--font-family-mono)">
        <text x="20" y={TYPE_BASELINE} fontSize={52} fill="var(--dracula-fg)">
          Aa
        </text>
        <text
          x="98"
          y={TYPE_BASELINE}
          fontSize={30}
          fill="var(--dracula-cyan)">
          {'{}'}
        </text>
        <text
          x="152"
          y={TYPE_BASELINE}
          fontSize={20}
          fill="var(--dracula-pink)">
          =&gt;
        </text>
        <text
          x="20"
          y={TYPE_BASELINE + TYPE_LEADING}
          fontSize={15}
          fill="var(--dracula-comment)">
          0O1lI| 5S 2Z
        </text>
        <text
          x="20"
          y={TYPE_BASELINE + TYPE_LEADING * 2}
          fontSize={15}
          fill="var(--dracula-green)">
          0123456789
        </text>
        <text
          x="20"
          y={TYPE_BASELINE + TYPE_LEADING * 3}
          fontSize={15}
          fill="var(--dracula-orange)">
          $ % @ # &lt;-&gt; []
        </text>

        {TYPE_LADDER.map((step, index) => (
          <g key={step.label}>
            <text
              x="224"
              y={TYPE_BASELINE + index * TYPE_LEADING}
              fontSize={step.size}
              fill={index === 0 ? 'var(--dracula-fg)' : 'var(--dracula-comment)'}>
              {step.label}
            </text>
            <text
              x="384"
              y={TYPE_BASELINE + index * TYPE_LEADING}
              fontSize={9}
              textAnchor="end"
              fill="var(--dracula-comment)"
              fillOpacity={0.65}>
              {step.size}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ─── Scene: the page grid ────────────────────────────────────────────────────

const PAGE_CELLS = [
  {x: 24, y: 28, isAccent: true},
  {x: 116, y: 28, isAccent: false},
  {x: 208, y: 28, isAccent: false},
  {x: 300, y: 28, isAccent: false},
  {x: 24, y: 118, isAccent: false},
  {x: 116, y: 118, isAccent: false},
  {x: 208, y: 118, isAccent: false},
  {x: 300, y: 118, isAccent: false},
];

const PAGE_LINES = [0, 1, 2];

// One page layout per thumbnail, drawn in the 76x76 cell: a title bar, the
// body blocks that give the layout its shape, and copy rows on the PAGE_LINES
// rhythm. Eight different pages, so the grid reads as a set of layouts.
const PAGE_LAYOUTS: ReadonlyArray<{
  blocks: ReadonlyArray<readonly [number, number, number, number]>;
  rows: {x: number; y: number; width: number; count: number};
}> = [
  {blocks: [[10, 22, 56, 16]], rows: {x: 10, y: 44, width: 56, count: 3}},
  {
    blocks: [
      [40, 22, 26, 30],
      [10, 58, 56, 8],
    ],
    rows: {x: 10, y: 24, width: 26, count: 3},
  },
  {
    blocks: [
      [10, 22, 26, 15],
      [40, 22, 26, 15],
      [10, 41, 26, 15],
      [40, 41, 26, 15],
    ],
    rows: {x: 10, y: 62, width: 56, count: 1},
  },
  {blocks: [[10, 22, 20, 6]], rows: {x: 10, y: 34, width: 56, count: 3}},
  {
    blocks: [
      [10, 24, 5, 5],
      [10, 36, 5, 5],
      [10, 48, 5, 5],
    ],
    rows: {x: 19, y: 24, width: 47, count: 3},
  },
  {
    blocks: [
      [10, 22, 56, 9],
      [10, 35, 56, 9],
      [10, 50, 26, 9],
    ],
    rows: {x: 42, y: 50, width: 24, count: 1},
  },
  {
    blocks: [
      [10, 22, 16, 48],
      [32, 58, 34, 8],
    ],
    rows: {x: 32, y: 24, width: 34, count: 3},
  },
  {
    blocks: [
      [10, 22, 56, 9],
      [10, 35, 30, 6],
      [44, 35, 22, 6],
      [10, 45, 30, 6],
      [44, 45, 22, 6],
      [10, 55, 30, 6],
      [44, 55, 22, 6],
    ],
    rows: {x: 10, y: 65, width: 26, count: 1},
  },
];

function PagesScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg)" />
      {PAGE_CELLS.map((cell, index) => {
        const layout = PAGE_LAYOUTS[index];
        // Cyan marks the page being viewed; purple stays reserved for
        // controls, so the art never borrows it.
        const accent = cell.isAccent
          ? 'var(--dracula-cyan)'
          : 'var(--dracula-comment)';
        return (
          <g key={`${cell.x}-${cell.y}`} transform={`translate(${cell.x} ${cell.y})`}>
            <rect
              x="0.5"
              y="0.5"
              width="75"
              height="75"
              rx="5"
              fill="var(--dracula-bg-dark)"
              stroke={accent}
              strokeOpacity={cell.isAccent ? 1 : 0.55}
            />
            <rect
              x="10"
              y="11"
              width="40"
              height="6"
              rx="2"
              fill={accent}
              fillOpacity={cell.isAccent ? 1 : 0.5}
            />
            {layout.blocks.map(([x, y, width, height]) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={width}
                height={height}
                rx="2"
                fill={accent}
                fillOpacity={cell.isAccent ? 0.35 : 0.5}
              />
            ))}
            {PAGE_LINES.slice(0, layout.rows.count).map(line => (
              <rect
                key={line}
                x={layout.rows.x}
                y={layout.rows.y + line * 12}
                width={layout.rows.width}
                height="5"
                rx="2"
                fill="var(--dracula-comment)"
                fillOpacity={0.5}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function ChapterArt({chapterId}: {chapterId: string}) {
  if (chapterId === 'introduction') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <NightScene alt="A full moon over a castle on the ridge, with bats crossing a lit sky" />
      </AspectRatio>
    );
  }
  if (chapterId === 'palette') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <PaletteScene alt="Fifteen palette swatches: six surfaces and neutrals, then the accent colours" />
      </AspectRatio>
    );
  }
  if (chapterId === 'type-shape') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <TypeScene alt="A type specimen: monospace glyphs on a baseline grid beside the type scale ladder" />
      </AspectRatio>
    );
  }
  if (chapterId === 'templates') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <PagesScene alt="Eight page thumbnails in a grid, the first one highlighted" />
      </AspectRatio>
    );
  }
  return null;
}

// ─── Rail ────────────────────────────────────────────────────────────────────

function ChapterRail({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  // Resizable like the shell-side-nav template: 264 default, 220-400 range.
  // The AppShell drawer owns the rail below 1024px (see MobileNavToggle),
  // so the handle only matters at desktop widths.
  return (
    <SideNav
      collapsible
      resizable={{defaultWidth: 264, minWidth: 220, maxWidth: 400}}
      header={
        <SideNavHeading
          icon={<NavIcon icon={<Icon icon={Sparkles} size="sm" />} />}
          heading="astryx-dracula"
          subheading="Dracula theme for Astryx"
          headingHref={SELF_HASH}
        />
      }>
      {CHAPTER_GROUPS.map(group => (
        <SideNavSection key={group.title} title={group.title}>
          {group.chapters.map(chapter => (
            <SideNavItem
              key={chapter.id}
              label={chapter.title}
              icon={chapter.icon}
              isSelected={chapter.id === activeId}
              onClick={() => onSelect(chapter.id)}
            />
          ))}
        </SideNavSection>
      ))}
    </SideNav>
  );
}

// ─── Chapter body ────────────────────────────────────────────────────────────

function SectionBlock({
  chapterId,
  section,
}: {
  chapterId: string;
  section: DocSection;
}) {
  return (
    <VStack gap={3}>
      <Heading level={2} id={sectionId(chapterId, section.key)}>
        {section.heading}
      </Heading>
      <Text type="body" color="secondary" display="block">
        {section.body}
      </Text>
      {section.bullets != null && (
        <List listStyle="disc">
          {section.bullets.map(bullet => (
            <ListItem key={bullet} label={bullet} />
          ))}
        </List>
      )}
      {section.code != null && (
        <CodeBlock
          code={section.code.source}
          language={section.code.language}
          title={section.code.title}
          width="100%"
        />
      )}
    </VStack>
  );
}

function ChapterNav({
  chapter,
  onSelect,
}: {
  chapter: DocChapter;
  onSelect: (id: string) => void;
}) {
  const index = CHAPTERS.findIndex(entry => entry.id === chapter.id);
  const previous = index > 0 ? CHAPTERS[index - 1] : undefined;
  const next = index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined;
  return (
    <HStack gap={3} hAlign="between" vAlign="center">
      {previous != null ? (
        <Button
          label={previous.title}
          variant="secondary"
          icon={<Icon icon={ChevronLeft} size="sm" />}
          onClick={() => onSelect(previous.id)}
        />
      ) : (
        <StackItem size="fill" />
      )}
      {next != null ? (
        <Button
          label={next.title}
          variant="secondary"
          endContent={<Icon icon={ChevronRight} size="sm" />}
          onClick={() => onSelect(next.id)}
        />
      ) : (
        <StackItem size="fill" />
      )}
    </HStack>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProductTour() {
  const [chapterId, setChapterId] = useState(DEFAULT_CHAPTER);
  const [activeSection, setActiveSection] = useState(
    OUTLINE_BY_CHAPTER[DEFAULT_CHAPTER][0]?.id ?? '',
  );

  // Responsive contract: below 1024px the outline stops being a column, since
  // a narrow viewport has nothing to outline against.
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  const chapter = CHAPTERS.find(entry => entry.id === chapterId) ?? CHAPTERS[0];
  const outlineItems = OUTLINE_BY_CHAPTER[chapter.id] ?? [];

  const openChapter = (id: string) => {
    setChapterId(id);
    setActiveSection(OUTLINE_BY_CHAPTER[id]?.[0]?.id ?? '');
    // A chapter reads as a new page, so the document goes back to the top
    // instead of keeping the previous chapter's scroll offset.
    window.scrollTo({top: 0});
  };

  return (
    <AppShell
      height="auto"
      contentPadding={0}
      variant="section"
      mobileNav={{hasToggle: false}}
      sideNav={<ChapterRail activeId={chapter.id} onSelect={openChapter} />}>
      <Layout
        height="auto"
        end={
          isNarrow ? undefined : (
            <LayoutPanel
              isScrollable={false}
              label="On this page"
              role="complementary"
              style={outlinePanel}>
              <Outline
                items={outlineItems}
                onActiveIdChange={setActiveSection}
              />
            </LayoutPanel>
          )
        }
        content={
          <LayoutContent isScrollable={false} padding={8}>
            <VStack gap={8}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center">
                  <MobileNavToggle />
                  <Text type="supporting" color="secondary">
                    Documentation
                  </Text>
                </HStack>
                <Heading level={1} type="display-2">
                  {chapter.title}
                </Heading>
                <Text type="supporting" color="secondary" hasTabularNumbers>
                  astryx-dracula v0.2.1
                </Text>
                {isNarrow && (
                  <Selector
                    label="On this page"
                    isLabelHidden
                    options={outlineItems.map(item => ({
                      value: item.id,
                      label: item.label,
                    }))}
                    value={activeSection}
                    onChange={(id: string) => {
                      setActiveSection(id);
                      scrollToSection(id);
                    }}
                    width="100%"
                  />
                )}
              </VStack>

              <Text type="large" color="secondary" display="block">
                {chapter.intro}
              </Text>

              <ChapterArt chapterId={chapter.id} />

              <VStack gap={8}>
                {chapter.sections.map(section => (
                  <SectionBlock
                    key={section.key}
                    chapterId={chapter.id}
                    section={section}
                  />
                ))}
              </VStack>

              <Divider />

              <ChapterNav chapter={chapter} onSelect={openChapter} />
            </VStack>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}

// Scrolls the document to a heading and records it as the active section.
function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target != null) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
