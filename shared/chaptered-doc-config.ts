// Chaptered-doc TYPES and FRAME STYLES, split from the components.
//
// WHY: chaptered-doc.tsx exports components, and a .tsx exporting
// non-components breaks React Fast Refresh.
// `react-doctor/only-export-components` catches it. See shared/scene-hues.ts
// for the same split, same reason.
//
// Everything the four callers (chaptered-doc, documentation-design,
// documentation-technical, product-tour, tech-report) share lives here; the
// outline-building and scroll helpers that only chaptered-doc itself calls stay
// unexported in that file.
import type {CSSProperties} from 'react';
import type {IconType} from '@astryxdesign/core/Icon';
import type {OutlineItem} from '@astryxdesign/core/Outline';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DocSection {
  // Unique within the chapter; the DOM id is derived from it so the outline
  // links and the headings can never drift apart.
  key: string;
  heading: string;
  body: string;
  bullets?: string[];
  code?: {language: string; title: string; source: string};
}

export interface DocChapter {
  id: string;
  title: string;
  icon: IconType;
  intro: string;
  hasArt?: boolean;
  sections: DocSection[];
}

export type ChapterGroup = {title: string; chapters: DocChapter[]};

export const sectionId = (chapterId: string, key: string) =>
  `${chapterId}--${key}`;

// Astryx has no image primitive: AspectRatio exposes no objectFit or radius
// props, so the scene fill and the corner clip live in these two styles.
export const sceneFill: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
export const sceneClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};

// The outline is sticky so it tracks the chapter as the document scrolls.
export const outlinePanel: CSSProperties = {
  position: 'sticky',
  top: 'var(--spacing-6)',
  alignSelf: 'start',
  // No paddingBlockStart. This object is applied via `style=` to the outline
  // LayoutPanels (chaptered-doc.tsx:316, documentation-design.tsx:592,
  // documentation-technical.tsx:82), and an inline style prop BEATS the stylex
  // class -- so this 8px silently overrode the panel's own 16px block padding
  // at the top edge only, leaving every "On this page" rail in the kit
  // asymmetric by 8px. The panel already owns its block padding.
};

// Derived once per page so the Outline receives a stable array identity
// and does not re-register its scroll spy on every render.
export function buildOutlineByChapter(
  chapters: DocChapter[],
): Record<string, OutlineItem[]> {
  return Object.fromEntries(
    chapters.map(chapter => [
      chapter.id,
      chapter.sections.map(section => ({
        id: sectionId(chapter.id, section.key),
        label: section.heading,
        level: 2,
      })),
    ]),
  );
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target != null) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}

// ─── Rail ────────────────────────────────────────────────────────────────────

