// Settings row DATA, split from the row renderers in settings-rows.tsx.
//
// WHY: settings-rows.tsx exports components, and a .tsx exporting non-components
// breaks React Fast Refresh -- editing NAV_ITEMS would remount every settings
// row instead of hot-updating. `react-doctor/only-export-components` catches it.
// Three templates (settings, settings-sidebar, settings-dialog) read from here,
// so this data is genuinely shared rather than co-located by accident.
import type {CSSProperties} from 'react';
import type {LucideIcon} from 'lucide-react';
import {
  Bell,
  Briefcase,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  KeyRound,
  Laptop,
  Lock,
  Share2,
  ShieldCheck,
  Smartphone,
  SquarePen,
  Tablet,
  User,
  UserCog,
} from 'lucide-react';

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

/**
 * How a row's trailing Button reads. Deliberately narrower than core's
 * `ButtonVariant`: a trailing row control is not a place to choose freely, and
 * two of core's four options can never be right here — `primary` would
 * outrank the panel's own primary, `ghost` would leave an action with no
 * affordance at all. Only the two that can be are offered.
 */
export type RowActionVariant = 'secondary' | 'destructive';
export interface InfoRow {
  label: string;
  value: string;
  action: string;
  /**
   * What `action` actually is. 'action' (the default) changes state in place
   * and renders a Button; 'destination' navigates and renders a Link. Stated
   * in the data rather than inferred from `href` or read off the label, so
   * renaming "View" cannot silently turn a destination back into an action.
   */
  actionKind?: 'action' | 'destination';
  /** Where a 'destination' action goes. Read only when actionKind is 'destination'. */
  href?: string;
  /**
   * Visual weight of the trailing Button. `secondary` is the default and the
   * right answer for almost every row. `destructive` is for a row whose action
   * ends or destroys something — disconnecting an account, deleting data — so
   * that control agrees with the templates' inline Deactivate/Delete buttons
   * instead of rendering identically to "Create" sitting above it. Stated
   * here for the same reason `actionKind` is: the renderer cannot recover it
   * from the label without reading the English verb off the row, which is how
   * "View" became a button in the first place. Ignored for a `'destination'`
   * row, which renders a Link and takes no variant.
   */
  variant?: RowActionVariant;
  /**
   * What the Button does, when something wants it to. Optional on purpose: a
   * row with no `onAction` renders an inert control, which is the honest
   * default for a showcase with no backend — better than a toggle that flips
   * "Connected" to "Disconnected" and pretends a call happened. A consumer
   * that has a real handler passes one and the row goes live. Nothing here
   * simulates a result or invents state to make the button look busy.
   */
  onAction?: () => void;
}

export const LOGIN_ROWS: InfoRow[] = [
  {label: 'Password', value: 'Not created', action: 'Create'},
];

// Disconnecting ends an account link the user set up on purpose, so it is the
// one destructive row in this file — marked here, from the verb, not by
// position. LOGIN_ROWS' "Create" is the opposite (it adds a password) and
// keeps the default `secondary`.
export const SOCIAL_ROWS: InfoRow[] = [
  {label: 'Google', value: 'Connected', action: 'Disconnect', variant: 'destructive'},
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

// Locale pickers shared by the sidebar and dialog templates. The two copies
// were byte-identical walls; a single source keeps them in sync.
export const LANGUAGES: {label: string; value: string}[] = [
  {label: 'English (Canada)', value: 'en-CA'},
  {label: 'English (US)', value: 'en-US'},
  {label: 'French', value: 'fr'},
  {label: 'Spanish', value: 'es'},
  {label: 'German', value: 'de'},
  {label: 'Japanese', value: 'ja'},
];

export const CURRENCIES: {label: string; value: string}[] = [
  {label: 'Canadian dollar (CAD)', value: 'CAD'},
  {label: 'US dollar (USD)', value: 'USD'},
  {label: 'Euro (EUR)', value: 'EUR'},
  {label: 'British pound (GBP)', value: 'GBP'},
  {label: 'Japanese yen (JPY)', value: 'JPY'},
];

export const TIMEZONES: {label: string; value: string}[] = [
  {label: '(GMT-05:00) Eastern Time (US & Canada)', value: 'ET'},
  {label: '(GMT-06:00) Central Time (US & Canada)', value: 'CT'},
  {label: '(GMT-07:00) Mountain Time (US & Canada)', value: 'MT'},
  {label: '(GMT-08:00) Pacific Time (US & Canada)', value: 'PT'},
  {label: '(GMT+00:00) UTC', value: 'UTC'},
  {label: '(GMT+01:00) London', value: 'GMT+1'},
];

