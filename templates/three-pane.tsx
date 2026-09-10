// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @sideNav=(SN > SNS"Factorization" + SNS"Lattice" + SNS"Oracle" + SNS"Reference")] > L > (LH > H[g=3 a=center] > MNT + (TL > Tab"Overview"! + Tab"Input" + Tab"Source") + B.ghost"Copy result") + (LC[p=0] > V[g=0] > S[p=6] > V[g=6] > (V[g=2] > Hd"ROCA Vulnerability"[level=2] + Tx[t=supporting]) + V[g=5] > AR + G[c=3 g=3] > AR*3) + (LayoutPanel[w=360 p=6] > V[g=5] > (V[g=3] > H[g=2 a=center] > Hd"Results"[level=3] + SD + Tx[t=supporting]) + Banner[error] + D + (V[g=3] > H[g=2 a=center] > Hd"History"[level=4] + Bd) + (List > LI*4))

/**
 * Three-Pane Workspace — a cipher workbench for the night watch.
 *
 * Frame-first layout (see `npx astryx docs layout`):
 *
 *   Frame: rail 260 (SideNav) | working pane flex | results pane 360
 *
 * Responsive contract:
 *   > 1024px  rail | working pane | results 360
 *   <= 1024px results stack under the working pane; the rail collapses into
 *             the AppShell mobile drawer behind a MobileNavToggle
 *
 * Container policy (console archetype): the workbench is one scrolling column
 * of sections, the results pane is rows. Zero cards — the three panes are the
 * structure, so nothing needs boxing to look intentional.
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
  LayoutHeader,
  LayoutPanel,
  StackItem,
  VStack,
} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import type {IconType} from '@astryxdesign/core/Icon';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';
import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Kbd} from '@astryxdesign/core/Kbd';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import type {StatusDotVariant} from '@astryxdesign/core/StatusDot';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {TextArea} from '@astryxdesign/core/TextArea';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {Section} from '@astryxdesign/core/Section';
import {useMediaQuery} from '@astryxdesign/core/hooks';

import {
  BadgePercent,
  Bell,
  BookOpen,
  CircleCheck,
  Clock,
  Copy,
  Flame,
  Hash,
  LayoutGrid,
  List as ListIcon,
  Lock,
  RotateCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';

const SELF_HASH = '#/templates/three-pane';

// Static reference page: the actions here illustrate placement, not behavior.
const noop = () => {};

// Astryx has no image primitive: AspectRatio exposes no objectFit or radius
// props, so the art fill and the corner clip live in these two styles.
const artFill: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
const artClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};

// ─── Navigation ──────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: IconType;
}

interface NavSection {
  title: string;
  icon: IconType;
  count: number;
  items: NavItem[];
}

// Counts ride in a Badge because they are counts, the one thing Badge is for.
const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Factorization',
    icon: Lock,
    count: 20,
    items: [
      {label: 'ROCA Vulnerability', icon: Hash},
      {label: 'Nitros / ROCA Variant', icon: Zap},
      {label: 'FactorDB Lookup', icon: Search},
      {label: 'Small Public Exponent', icon: BadgePercent},
    ],
  },
  {
    title: 'Lattice',
    icon: LayoutGrid,
    count: 12,
    items: [
      {label: 'Partial Key Recovery', icon: SlidersHorizontal},
      {label: 'Coppersmith Small Roots', icon: Flame},
    ],
  },
  {
    title: 'Oracle',
    icon: Bell,
    count: 5,
    items: [
      {label: 'Bleichenbacher', icon: ShieldCheck},
      {label: 'Padding Oracle', icon: CircleCheck},
    ],
  },
  {
    title: 'Reference',
    icon: BookOpen,
    count: 5,
    items: [
      {label: 'Instructions', icon: BookOpen},
      {label: 'Magic Panel', icon: Sparkles},
      {label: 'Attack Index', icon: ListIcon},
      {label: 'Format Converter', icon: RotateCw},
      {label: 'PEM Decryptor', icon: Lock},
    ],
  },
];

const DEFAULT_ITEM = 'ROCA Vulnerability';

// ─── Placeholder art ─────────────────────────────────────────────────────────

type ArtVariant = 'cipher' | 'lattice' | 'oracle';

const ART_HUE: Record<ArtVariant, string> = {
  cipher: 'var(--dracula-purple)',
  lattice: 'var(--dracula-cyan)',
  oracle: 'var(--dracula-pink)',
};

// Drawn, not loaded: an inline scene keeps the template dependency-free and
// paints in the Dracula tokens rather than a fixed palette.
function VaultArt({alt, variant}: {alt: string; variant: ArtVariant}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={artFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      <g
        stroke="var(--dracula-comment)"
        strokeWidth={2}
        fill="none"
        opacity={0.6}>
        {variant === 'cipher' && (
          <>
            <rect x="152" y="132" width="96" height="78" rx="12" />
            <path d="M174 132 V114 a26 26 0 0 1 52 0 V132" />
          </>
        )}
        {variant === 'lattice' && (
          <>
            <path d="M50 60 H350 M50 120 H350 M50 180 H350 M50 240 H350" />
            <path d="M70 40 V260 M150 40 V260 M230 40 V260 M310 40 V260" />
          </>
        )}
        {variant === 'oracle' && (
          <>
            <circle cx="200" cy="150" r="36" />
            <circle cx="200" cy="150" r="70" />
            <circle cx="200" cy="150" r="104" />
          </>
        )}
      </g>
      <g fill={ART_HUE[variant]}>
        <circle cx="200" cy="150" r="10" />
        <circle cx="72" cy="52" r="3" />
        <circle cx="332" cy="80" r="4" />
        <circle cx="94" cy="250" r="4" />
        <circle cx="314" cy="240" r="3" />
      </g>
    </svg>
  );
}

const SAMPLE_ART: Array<{
  id: string;
  alt: string;
  variant: ArtVariant;
  caption: string;
}> = [
  {
    id: 'cipher',
    alt: 'Cipher trace drawn over the vault floor',
    variant: 'cipher',
    caption: '512-bit modulus',
  },
  {
    id: 'lattice',
    alt: 'Lattice points across the vault grid',
    variant: 'lattice',
    caption: 'Partial key, 40% recovered',
  },
  {
    id: 'oracle',
    alt: 'Oracle rings collapsing toward the core',
    variant: 'oracle',
    caption: 'Padding oracle trace',
  },
];

const MODULUS_SAMPLE = [
  '28569636280208041447067875266276562503376434746513047517879606250',
  '89454229309222067111836181133874403986328427422389991345326615077',
  '54555787069',
].join('\n');

const SCRIPT_SAMPLE = `from sage.all import Integer, discrete_log

def roca_factor(n):
    """Recover p where p = k*M + (65537**a % M)."""
    M = 2 ** (2 ** 5) * 3 ** 2 * 5 * 7 * 11 * 13 * 17 * 19 * 23 * 29 * 31 * 37 * 41 * 43
    prime_map = {p: pow(65537, 2 ** i, p) for i, p in enumerate(GEN_PRIMES)}
    return discrete_log(Integer(n), Integer(prime_map[0]), M, ...)`;

// ─── Run history ─────────────────────────────────────────────────────────────

interface RunRecord {
  id: string;
  label: string;
  meta: string;
  status: StatusDotVariant;
  statusLabel: string;
}

const HISTORY: RunRecord[] = [
  {
    id: 'run-4182',
    label: 'ROCA Vulnerability',
    meta: '512-bit, 2.4s',
    status: 'success',
    statusLabel: 'Completed',
  },
  {
    id: 'run-4181',
    label: 'FactorDB Lookup',
    meta: '2048-bit, cached',
    status: 'success',
    statusLabel: 'Completed',
  },
  {
    id: 'run-4180',
    label: 'Padding Oracle',
    meta: 'Timed out after 60s',
    status: 'error',
    statusLabel: 'Timed out',
  },
  {
    id: 'run-4179',
    label: 'Coppersmith Small Roots',
    meta: '1024-bit, 1.1s',
    status: 'success',
    statusLabel: 'Completed',
  },
];

// ─── Navigation rail ─────────────────────────────────────────────────────────

function SidebarFooter() {
  return (
    <VStack gap={3}>
      <HStack gap={2} vAlign="center">
        <Kbd keys="mod+K" />
        <Text type="body" color="secondary">
          Search attacks
        </Text>
      </HStack>
      <Divider />
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          51 attacks across 5 families
        </Text>
        <Link href={SELF_HASH} type="supporting">
          Read the attack index
        </Link>
      </VStack>
    </VStack>
  );
}

function WorkspaceNav({
  activeItem,
  onSelect,
}: {
  activeItem: string;
  onSelect: (label: string) => void;
}) {
  return (
    <SideNav
      collapsible
      resizable={{defaultWidth: 280, minWidth: 220, maxWidth: 400}}
      header={
        <SideNavHeading
          icon={<NavIcon icon={<Icon icon={Lock} size="sm" />} />}
          heading="Nightvault"
          subheading="Cipher workbench"
        />
      }
      footer={<SidebarFooter />}>
      {NAV_SECTIONS.map(section => (
        <SideNavSection
          key={section.title}
          title={section.title}
          endContent={<Badge label={section.count} variant="neutral" />}>
          {section.items.map(item => (
            <SideNavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              isSelected={item.label === activeItem}
              onClick={() => onSelect(item.label)}
            />
          ))}
        </SideNavSection>
      ))}
    </SideNav>
  );
}

// ─── Working pane ────────────────────────────────────────────────────────────

function SampleStrip() {
  return (
    <Grid columns={3} gap={3}>
      {SAMPLE_ART.map(sample => (
        <VStack key={sample.id} gap={2}>
          <AspectRatio ratio={1} style={artClip}>
            <VaultArt alt={sample.alt} variant={sample.variant} />
          </AspectRatio>
          <Text type="supporting" color="secondary">
            {sample.caption}
          </Text>
        </VStack>
      ))}
    </Grid>
  );
}

function OverviewTab() {
  return (
    <VStack gap={5}>
      <Text type="body" color="secondary" display="block">
        Run against a 512-bit key in under a minute, or hand it to the cached
        factor base for anything larger.
      </Text>
      <AspectRatio ratio={16 / 9} style={artClip}>
        <VaultArt
          variant="cipher"
          alt="Cipher trace crossing the vault floor at midnight"
        />
      </AspectRatio>
      <SampleStrip />
    </VStack>
  );
}

function InputTab({
  modulus,
  onChangeModulus,
}: {
  modulus: string;
  onChangeModulus: (value: string) => void;
}) {
  return (
    <VStack gap={5}>
      <TextArea
        label="n (modulus)"
        description="Decimal or hex, one value per line"
        isRequired
        rows={5}
        value={modulus}
        onChange={onChangeModulus}
      />
      <HStack gap={3}>
        <Button
          label="Generate"
          variant="secondary"
          icon={<Icon icon={Sparkles} size="sm" />}
          onClick={noop}
        />
        <StackItem size="fill">
          <Button label="Run" width="100%" onClick={noop} />
        </StackItem>
      </HStack>
    </VStack>
  );
}

function SourceTab() {
  return (
    <CodeBlock
      code={SCRIPT_SAMPLE}
      language="python"
      title="roca.sage"
      width="100%"
    />
  );
}

function WorkPane({
  tab,
  modulus,
  onChangeModulus,
}: {
  tab: string;
  modulus: string;
  onChangeModulus: (value: string) => void;
}) {
  return (
    <Section variant="transparent" padding={6}>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading level={2}>{DEFAULT_ITEM}</Heading>
          <Text type="supporting" color="secondary" display="block">
            Executed through the Nightvault cipher engine
          </Text>
        </VStack>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'input' && (
          <InputTab modulus={modulus} onChangeModulus={onChangeModulus} />
        )}
        {tab === 'source' && <SourceTab />}
      </VStack>
    </Section>
  );
}

// ─── Results pane ────────────────────────────────────────────────────────────

function HistoryRows() {
  return (
    <List hasDividers>
      {HISTORY.map(run => (
        <ListItem
          key={run.id}
          label={run.label}
          description={run.meta}
          startContent={<Icon icon={Clock} size="sm" />}
          endContent={
            <StatusDot variant={run.status} label={run.statusLabel} />
          }
        />
      ))}
    </List>
  );
}

function ResultsPane() {
  return (
    <VStack gap={5}>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <StackItem size="fill">
            <Heading level={3}>Results</Heading>
          </StackItem>
          <StatusDot variant="error" label="Engine unreachable" />
          <Text type="supporting" color="secondary">
            Engine unreachable
          </Text>
        </HStack>
        <Banner
          status="error"
          title="Run failed"
          description="No specific error came back. Check that every required input is filled and that the factor base is reachable."
        />
      </VStack>
      <Divider />
      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <StackItem size="fill">
            <Heading level={4}>History</Heading>
          </StackItem>
          <Badge label={HISTORY.length} variant="neutral" />
        </HStack>
        <HistoryRows />
      </VStack>
    </VStack>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ThreePaneWorkspace() {
  const [activeItem, setActiveItem] = useState(DEFAULT_ITEM);
  const [tab, setTab] = useState('overview');
  const [modulus, setModulus] = useState(MODULUS_SAMPLE);

  // Responsive contract: below 1024px the results pane stops being a column
  // and stacks under the working pane, so neither pane gets squeezed.
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  return (
    <AppShell
      height="fill"
      contentPadding={0}
      variant="section"
      mobileNav={{hasToggle: false}}
      sideNav={<WorkspaceNav activeItem={activeItem} onSelect={setActiveItem} />}>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider>
            <HStack gap={3} vAlign="center">
              <MobileNavToggle />
              <StackItem size="fill">
                <TabList value={tab} onChange={setTab} size="sm">
                  <Tab value="overview" label="Overview" />
                  <Tab value="input" label="Input" />
                  <Tab value="source" label="Source" />
                </TabList>
              </StackItem>
              {/* The tabs need the whole header on a phone. */}
              {!isNarrow && (
                <Button
                  label="Copy result"
                  variant="ghost"
                  size="sm"
                  icon={<Icon icon={Copy} size="sm" />}
                  onClick={noop}
                />
              )}
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={0}>
            <VStack gap={0}>
              <WorkPane
                tab={tab}
                modulus={modulus}
                onChangeModulus={setModulus}
              />
              {isNarrow && (
                <Section variant="transparent" padding={6} dividers={['top']}>
                  <ResultsPane />
                </Section>
              )}
            </VStack>
          </LayoutContent>
        }
        end={
          isNarrow ? undefined : (
            <LayoutPanel width={360} padding={6} label="Results">
              <ResultsPane />
            </LayoutPanel>
          )
        }
      />
    </AppShell>
  );
}
