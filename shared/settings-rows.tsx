// Row data shared by the settings dialog and settings sidebar templates.
// Voice and content are single-sourced here so the two surfaces cannot drift
// apart again (castle register throughout). Dialog-only data (languages,
// currencies, timezones) and sidebar-only data (section titles) stay local to
// their templates, as do tax/payout rows — the dialog shows a populated state
// while the sidebar shows an empty one, and that variance is intentional.
// settings.tsx is a different archetype (single scrolling form) and shares
// nothing with these row-driven panels.

import {
  User,
  Lock,
  ShieldCheck,
  Bell,
  FileText,
  CreditCard,
  Globe,
  Briefcase,
  SquarePen,
  Share2,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import type {CSSProperties, MouseEvent, ReactNode} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';

export interface SettingsNavItem {
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: SettingsNavItem[] = [
  {label: 'Personal information', icon: User},
  {label: 'Login & security', icon: Lock},
  {label: 'Privacy', icon: ShieldCheck},
  {label: 'Notifications', icon: Bell},
  {label: 'Taxes', icon: FileText},
  {label: 'Payments', icon: CreditCard},
  {label: 'Languages & currency', icon: Globe},
  {label: 'Travel for work', icon: Briefcase},
];

export interface InfoRow {
  label: string;
  value: string;
  action: string;
}

export const LOGIN_ROWS: InfoRow[] = [
  {label: 'Password', value: 'Not created', action: 'Create'},
];

export const SOCIAL_ROWS: InfoRow[] = [
  {label: 'Google', value: 'Connected', action: 'Disconnect'},
];

export interface DeviceRow {
  label: string;
  isCurrent?: boolean;
  location: string;
  action?: string;
}

export const DEVICE_ROWS: DeviceRow[] = [
  {
    label: 'OS X 10.15.7 · Chrome',
    isCurrent: true,
    location: 'Brașov, Transylvania · March 30, 2026 at 19:31',
  },
  {label: 'Session', location: 'August 9, 2023 at 04:19', action: 'Log out'},
  {
    label: 'OS X 10.15.7 · unknown',
    location: 'Whitby, England · April 14, 2023 at 17:47',
    action: 'Log out',
  },
];

export interface InfoTileData {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const INFO_TILES: InfoTileData[] = [
  {
    icon: Lock,
    title: "Why isn't my info shown here?",
    body: "We're veiling some crypt details to protect your identity.",
  },
  {
    icon: SquarePen,
    title: 'Which details can be edited?',
    body: "Contact runes and personal details can be edited. If these were used to verify your identity, you'll need to be verified anew before your next stay, or to keep hosting your crypt.",
  },
  {
    icon: Share2,
    title: 'What info is shared with others?',
    body: 'We only release contact runes after a booking is sealed.',
  },
];

// Shared row chrome: the icon chip, nowrap action column, and sidebar heading
// offset duplicated across settings-dialog and settings-sidebar. Tokens only,
// no layout opinions — templates keep their own padding/dividers.
export const iconBox: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  backgroundColor: 'var(--color-background-surface)',
  flexShrink: 0,
};

// Keeps row actions ("Log out", "Deactivate") on one line: without this the
// action column wraps mid-phrase at tablet widths while the info column still
// has room to wrap instead.
export const actionNoWrap: CSSProperties = {
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

// Aligns the sidebar heading with list-item label text. No heading margin prop.
export const sideNavHeading: CSSProperties = {
  marginInline: 'var(--spacing-4)',
};

// ─── Row components ──────────────────────────────────────────────────────────
// The row renderers themselves, moved here from both templates. The two copies
// were byte-identical apart from two things that genuinely differ per
// template, so those are props rather than forks: `href` (each template anchors
// its Links to its own route) and `style` (the sidebar pads its rows, the
// dialog does not). Verified by hash before the move — the row BODIES matched
// exactly; only these two call-site differences remained.

export function InfoRowItem({
  label,
  value,
  action,
  href,
  style,
}: InfoRow & {href: string; style?: CSSProperties}) {
  return (
    <>
      <HStack hAlign="between" vAlign="start" style={style}>
        <VStack gap={0}>
          <Text type="body" weight="semibold" display="block">
            {label}
          </Text>
          <Text type="body" color="secondary" display="block">
            {value}
          </Text>
        </VStack>
        {action && (
          <Link href={href} style={actionNoWrap}>
            {action}
          </Link>
        )}
      </HStack>
      <Divider />
    </>
  );
}

function ExpandableRowEditing({
  label,
  children,
  onCancel,
  onSave,
  style,
}: {
  label: string;
  children: ReactNode;
  onCancel: () => void;
  onSave: () => void;
  style?: CSSProperties;
}) {
  return (
    <VStack gap={4} style={style}>
      <Text type="body" weight="semibold" display="block">
        {label}
      </Text>
      {children}
      <HStack gap={2}>
        <Button label="Save" variant="primary" onClick={onSave} />
        <Button label="Cancel" variant="ghost" onClick={onCancel} />
      </HStack>
    </VStack>
  );
}

function ExpandableRowViewing({
  label,
  value,
  onEdit,
  href,
  style,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  href: string;
  style?: CSSProperties;
}) {
  return (
    <HStack hAlign="between" vAlign="start" style={style}>
      <VStack gap={0}>
        <Text type="body" weight="semibold" display="block">
          {label}
        </Text>
        <Text type="body" color="secondary" display="block">
          {value}
        </Text>
      </VStack>
      <Link
        href={href}
        style={actionNoWrap}
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          onEdit();
        }}>
        Edit
      </Link>
    </HStack>
  );
}

export function ExpandableRow({
  label,
  value,
  children,
  isExpanded,
  onEdit,
  onCancel,
  onSave,
  href,
  style,
}: {
  label: string;
  value: string;
  children: ReactNode;
  isExpanded: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  href: string;
  style?: CSSProperties;
}) {
  return (
    <>
      {isExpanded ? (
        <ExpandableRowEditing
          label={label}
          onCancel={onCancel}
          onSave={onSave}
          style={style}>
          {children}
        </ExpandableRowEditing>
      ) : (
        <ExpandableRowViewing
          label={label}
          value={value}
          onEdit={onEdit}
          href={href}
          style={style}
        />
      )}
      <Divider />
    </>
  );
}
