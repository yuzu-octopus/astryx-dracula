// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @sideNav=(SN > (SNS"Getting started" > (SNI"Introduction"! + SNI"Install the CLI")) + (SNS"Core concepts" > (SNI"Projects and builds" + SNI"Environments")) + (SNS"Guides" > (SNI"Custom domains" + SNI"Secrets and config")) + (SNS"Reference" > (SNI"Command reference" + SNI"nightloom.yml")))] > L[h=auto] > (LC[p=8 !scroll] > V[g=8] > (V[g=2] > (H[g=2 a=center] > MNT + Tx"The night shift"[t=supporting]) + Tx.display-1"Introduction" + Tx"Last updated September 10, 2026"[t=supporting]) + Tx"Intro paragraph"[t=body] + AR + (V[g=8] > (V[g=3] > Hd"What Nightloom does"[level=2] + Tx"Body"[t=body] + UL)*2) + D + (H[j=between] > B.secondary"Previous" + B.secondary"Next")) + (LP[!scroll] > Outline)

/**
 * Product Tour — a chaptered walkthrough of a product.
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
 * and code. No cards, no badges — the rail and the outline carry the structure,
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
  Boxes,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  Globe,
  KeyRound,
  Rocket,
  Settings2,
  SquareTerminal,
  Terminal,
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
  top: 24,
  alignSelf: 'start',
  paddingBlockStart: 8,
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
  updated: string;
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
        updated: 'September 10, 2026',
        hasArt: true,
        intro:
          'Nightloom turns a repository into a running service. A build runs in a container, the artifact is promoted through environments, and every deploy keeps a URL you can hand to someone else.',
        sections: [
          {
            key: 'what-it-does',
            heading: 'What Nightloom does',
            body: 'One command covers the whole path from commit to running service, so there is no separate build server to babysit.',
            bullets: [
              'Builds every branch in an isolated container and caches the layers that did not change.',
              'Gives each branch its own preview URL with its own environment variables.',
              'Promotes an artifact you already built instead of rebuilding it for production.',
              'Keeps the last thirty releases, so a rollback is a pointer move rather than a rebuild.',
            ],
          },
          {
            key: 'the-pipeline',
            heading: 'How a deploy moves',
            body: 'Each stage is observable on its own, which is what makes a failed deploy legible instead of mysterious.',
            bullets: [
              'Resolve reads nightloom.yml and locks the toolchain version.',
              'Build produces an immutable artifact keyed by the commit hash.',
              'Release attaches the artifact to an environment and runs its health checks.',
              'Promote shifts traffic once the new instances pass their checks.',
            ],
          },
        ],
      },
      {
        id: 'install',
        title: 'Install the CLI',
        icon: SquareTerminal,
        updated: 'September 4, 2026',
        intro:
          'The CLI is a single binary. It reads your config, talks to the API, and streams build output back to the terminal.',
        sections: [
          {
            key: 'requirements',
            heading: 'Requirements',
            body: 'Nightloom builds on Linux containers and does not need Docker installed on your machine.',
            bullets: [
              'macOS 13 or newer, or a Linux distribution with glibc 2.31 or newer.',
              'Git 2.30 or newer, with a repository that has at least one commit.',
              'A Nightloom account, or a read-only token for existing projects.',
            ],
          },
          {
            key: 'install-cli',
            heading: 'Install',
            body: 'Pick the package manager you already have. The binary is the same either way.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `# macOS
brew install nightloom/tap/nightloom

# anywhere with Node
npm install --global nightloom

# verify
nightloom version`,
            },
          },
          {
            key: 'authenticate',
            heading: 'Authenticate',
            body: 'This opens a browser once and stores the session token in your keychain. Use a token instead when the CLI runs in CI.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom login

# for CI, skip the browser
export NIGHTLOOM_TOKEN=ntl_xxxxxxxxxxxxxxxx`,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Core concepts',
    chapters: [
      {
        id: 'projects',
        title: 'Projects and builds',
        icon: Boxes,
        updated: 'August 28, 2026',
        intro:
          'A project is the unit that owns a repository, its build configuration, and its history. Builds belong to a project and are immutable once they finish.',
        sections: [
          {
            key: 'projects',
            heading: 'Projects',
            body: 'One project maps to one repository. A monorepo usually becomes several projects that share the repository but build different directories.',
            bullets: [
              'The project owns the build settings, so two projects can build the same repo differently.',
              'Deleting a project keeps its artifacts for thirty days, then removes them.',
            ],
          },
          {
            key: 'builds',
            heading: 'Builds',
            body: 'A build is identified by the commit it came from. Rebuilding the same commit produces a new build but reuses the cache from the previous one.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom build --watch

# the build id is what you promote later
# build_01H8XK2M4Q`,
            },
          },
          {
            key: 'build-cache',
            heading: 'Build cache',
            body: 'The cache is keyed on the lockfile plus the files each layer copies in, so a dependency bump invalidates only the layers below it.',
            bullets: [
              'Cached layers are shared across branches of the same project.',
              'A cache miss is reported in the build log rather than guessed at.',
            ],
          },
        ],
      },
      {
        id: 'environments',
        title: 'Environments',
        icon: Settings2,
        updated: 'August 28, 2026',
        intro:
          'An environment is a named target that points at a running set of instances. Most projects use exactly two, and preview environments appear on demand.',
        sections: [
          {
            key: 'preview',
            heading: 'Preview environments',
            body: 'Every branch gets one, named after the branch. They are destroyed a week after the branch goes quiet, and their variables are inherited from production unless overridden.',
          },
          {
            key: 'production',
            heading: 'Production',
            body: 'Production only accepts a promotion of an artifact that already passed its health checks in another environment. Nothing goes straight to production.',
          },
          {
            key: 'variables',
            heading: 'Environment variables',
            body: 'Variables are scoped to an environment and overlaid onto the build and the runtime.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom env set DATABASE_URL --value postgres://... --env production
nightloom env list --env production`,
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Guides',
    chapters: [
      {
        id: 'domains',
        title: 'Custom domains',
        icon: Globe,
        updated: 'August 19, 2026',
        intro:
          'A custom domain points at an environment rather than at a specific deploy, so the domain survives every release.',
        sections: [
          {
            key: 'add-domain',
            heading: 'Add a domain',
            body: 'Adding the domain returns the DNS records you need. Certificates are issued once the records resolve.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom domain add nightloom.example --env production`,
            },
          },
          {
            key: 'dns',
            heading: 'DNS records',
            body: 'Use a CNAME for subdomains and an A record for an apex domain. The CLI prints both, and only the matching one needs to be created.',
            bullets: [
              'Subdomains resolve through a CNAME to the environment hostname.',
              'Apex domains need the A record, since CNAME flattening is not universal.',
            ],
          },
          {
            key: 'certificates',
            heading: 'Certificates',
            body: 'Certificates renew automatically and are reissued when the record set changes. A domain that stops resolving keeps its certificate for thirty days.',
          },
        ],
      },
      {
        id: 'secrets',
        title: 'Secrets and config',
        icon: KeyRound,
        updated: 'August 19, 2026',
        intro:
          'Secrets are write-only. You can scope them to an environment, but you can never read one back out through the CLI or the API.',
        sections: [
          {
            key: 'scopes',
            heading: 'Secret scopes',
            body: 'A secret applied to a project is inherited by every environment in it. An environment-level secret of the same name wins.',
            bullets: [
              'Project scope suits a shared registry credential.',
              'Environment scope suits anything that differs between environments.',
            ],
          },
          {
            key: 'rotation',
            heading: 'Rotating a secret',
            body: 'Writing a new value takes effect on the next release. Roll the value in the provider first, then release, so no instance reads a stale credential.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom secret set STRIPE_KEY --env production
nightloom release --env production`,
            },
          },
          {
            key: 'precedence',
            heading: 'Config precedence',
            body: 'Later sources win. Environment variables set in the dashboard beat the ones in the config file, and values passed on the command line beat both.',
          },
        ],
      },
    ],
  },
  {
    title: 'Reference',
    chapters: [
      {
        id: 'cli',
        title: 'Command reference',
        icon: Terminal,
        updated: 'August 11, 2026',
        intro:
          'Every command takes --env and --project, so it can run outside the repository directory that defines them.',
        sections: [
          {
            key: 'deploy',
            heading: 'Deploy',
            body: 'Builds the current commit and releases it. With --prod the artifact is promoted into production after its health checks pass.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom deploy            # current environment
nightloom deploy --prod     # promote after health checks`,
            },
          },
          {
            key: 'rollback',
            heading: 'Rollback',
            body: 'Moves an environment back to an earlier release. No rebuild happens, so a rollback is a pointer move.',
            code: {
              language: 'bash',
              title: 'shell',
              source: `nightloom releases --env production
nightloom rollback --env production --to rel_01H8WQ3`,
            },
          },
          {
            key: 'logs',
            heading: 'Logs',
            body: 'Streams runtime logs for an environment. Pass --build to read the build log of a specific build instead.',
          },
        ],
      },
      {
        id: 'config',
        title: 'nightloom.yml',
        icon: FileCode2,
        updated: 'August 11, 2026',
        intro:
          'The config file lives at the repository root and describes how to build the project and how to tell whether a release is healthy.',
        sections: [
          {
            key: 'keys',
            heading: 'Top-level keys',
            body: 'Only build and release are required. Everything else has a default that suits a Node or Python service.',
            code: {
              language: 'yaml',
              title: 'nightloom.yml',
              source: `build:
  image: node:22
  command: npm ci && npm run build
  cache: [node_modules]

release:
  start: node dist/server.js
  port: 8080
  healthcheck:
    path: /healthz
    timeout: 20s

environments:
  preview:
    variables:
      LOG_LEVEL: debug
  production:
    replicas: 3`,
            },
          },
          {
            key: 'health',
            heading: 'Health checks',
            body: 'A release is promoted only after the health endpoint returns a success status for the whole timeout window, so a flapping instance fails the release instead of serving traffic.',
          },
          {
            key: 'migrate',
            heading: 'Migrations',
            body: 'A release can run one command before the new instances start. Treat it as additive only, since the previous release is still running while it executes.',
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

// ─── Chapter art ─────────────────────────────────────────────────────────────

const DEPLOY_STAGES = [
  {x: 96, label: 'build'},
  {x: 200, label: 'release'},
  {x: 304, label: 'promote'},
];

// Drawn rather than loaded: the scene paints in Dracula tokens and keeps the
// template dependency-free.
function DeployScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-light)" />
      <g fill="var(--dracula-purple)" opacity={0.5}>
        <circle cx="46" cy="34" r="2" />
        <circle cx="132" cy="22" r="1.6" />
        <circle cx="268" cy="30" r="2.2" />
        <circle cx="356" cy="48" r="1.6" />
        <circle cx="200" cy="16" r="1.4" />
      </g>
      <path
        d="M96 112 H304"
        fill="none"
        stroke="var(--dracula-comment)"
        strokeWidth={2}
        strokeDasharray="4 6"
      />
      {DEPLOY_STAGES.map((stage, index) => (
        <g key={stage.label}>
          <circle
            cx={stage.x}
            cy={112}
            r={18}
            fill="var(--dracula-bg-light)"
            stroke={
              index === DEPLOY_STAGES.length - 1
                ? 'var(--dracula-green)'
                : 'var(--dracula-comment)'
            }
            strokeWidth={2}
          />
          <text
            x={stage.x}
            y={117}
            textAnchor="middle"
            fontFamily="var(--font-family-mono)"
            fontSize={11}
            fill={
              index === DEPLOY_STAGES.length - 1
                ? 'var(--dracula-green)'
                : 'var(--dracula-comment)'
            }>
            {index + 1}
          </text>
          <text
            x={stage.x}
            y={146}
            textAnchor="middle"
            fontFamily="var(--font-family-mono)"
            fontSize={10}
            fill="var(--dracula-comment)">
            {stage.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Rail ────────────────────────────────────────────────────────────────────

function ChapterRail({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <SideNav
      collapsible
      resizable={{defaultWidth: 264, minWidth: 220, maxWidth: 360}}
      header={
        <SideNavHeading
          icon={<NavIcon icon={<Icon icon={Rocket} size="sm" />} />}
          heading="Nightloom"
          subheading="Deploy platform"
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
      sideNav={
        <ChapterRail activeId={chapter.id} onSelect={openChapter} />
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
                    Nightloom docs
                  </Text>
                </HStack>
                <Text type="display-1" id={sectionId(chapter.id, 'top')}>
                  {chapter.title}
                </Text>
                <Text
                  type="supporting"
                  color="secondary"
                  hasTabularNumbers>
                  Last updated {chapter.updated}
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

              {chapter.hasArt === true && (
                <AspectRatio ratio={16 / 9} style={sceneClip}>
                  <DeployScene
                    alt="A build moving through the build, release and promote stages"
                  />
                </AspectRatio>
              )}

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
