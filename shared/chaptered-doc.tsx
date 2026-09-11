// Identical scaffold shared by the product-tour and tech-report templates:
// chapter rail (SideNav) + Layout content + sticky Outline that collapses to
// an "On this page" Selector below 1024px (the AppShell drawer owns the rail
// there behind the MobileNavToggle). Chapter data stays in each template.
// Scene systems stay local too: product-tour keeps BAT_WING/BAT_BODY/FIR +
// NightScene/PaletteScene/TypeScene/PagesScene, tech-report keeps its own.

import {useState, type CSSProperties, type ReactNode} from 'react';

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

import {ChevronLeft, ChevronRight} from 'lucide-react';

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
  paddingBlockStart: 'var(--spacing-2)',
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

export function ChapterRail({
  groups,
  activeId,
  onSelect,
  heading,
  subheading,
  headingHref,
  headingIcon,
}: {
  groups: ChapterGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  heading: string;
  subheading: string;
  headingHref: string;
  headingIcon: ReactNode;
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
          icon={<NavIcon icon={headingIcon} />}
          heading={heading}
          subheading={subheading}
          headingHref={headingHref}
        />
      }>
      {groups.map(group => (
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

export function SectionBlock({
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

export function ChapterNav({
  chapters,
  chapter,
  onSelect,
}: {
  chapters: DocChapter[];
  chapter: DocChapter;
  onSelect: (id: string) => void;
}) {
  const index = chapters.findIndex(entry => entry.id === chapter.id);
  const previous = index > 0 ? chapters[index - 1] : undefined;
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined;
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

export function ChapterArtFrame({children}: {children: ReactNode}) {
  return (
    <AspectRatio ratio={16 / 9} style={sceneClip}>
      {children}
    </AspectRatio>
  );
}

export default function ChapteredDoc({
  groups,
  defaultChapter,
  railHeading,
  railSubheading,
  railHref,
  railIcon,
  eyebrow,
  badge,
  art,
  footer,
}: {
  groups: ChapterGroup[];
  defaultChapter: string;
  railHeading: string;
  railSubheading: string;
  railHref: string;
  railIcon: ReactNode;
  eyebrow: string;
  badge: (chapter: DocChapter, index: number, total: number) => ReactNode;
  art: (chapterId: string) => ReactNode;
  footer?: ReactNode;
}) {
  const chapters = groups.flatMap(group => group.chapters);
  const [outlineByChapter] = useState(() => buildOutlineByChapter(chapters));
  const [chapterId, setChapterId] = useState(defaultChapter);
  const [activeSection, setActiveSection] = useState(
    outlineByChapter[defaultChapter]?.[0]?.id ?? '',
  );

  // Responsive contract: below 1024px the outline stops being a column, since
  // a narrow viewport has nothing to outline against.
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  const chapter = chapters.find(entry => entry.id === chapterId) ?? chapters[0];
  const outlineItems = outlineByChapter[chapter.id] ?? [];

  const openChapter = (id: string) => {
    setChapterId(id);
    setActiveSection(outlineByChapter[id]?.[0]?.id ?? '');
    // A chapter reads as a new page, so the document goes back to the top
    // instead of keeping the previous chapter's scroll offset.
    window.scrollTo({top: 0});
  };

  return (
    <AppShell
      height="auto"
      contentPadding={0}
      mobileNav={{hasToggle: false}}
      sideNav={
        <ChapterRail
          groups={groups}
          activeId={chapter.id}
          onSelect={openChapter}
          heading={railHeading}
          subheading={railSubheading}
          headingHref={railHref}
          headingIcon={railIcon}
        />
      }>
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
                    {eyebrow}
                  </Text>
                </HStack>
                <Heading level={1} type="display-2">
                  {chapter.title}
                </Heading>
                <Text type="supporting" color="secondary" hasTabularNumbers>
                  {badge(
                    chapter,
                    chapters.findIndex(entry => entry.id === chapter.id),
                    chapters.length,
                  )}
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

              {art(chapter.id)}

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

              <ChapterNav
                chapters={chapters}
                chapter={chapter}
                onSelect={openChapter}
              />

              {footer}
            </VStack>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
