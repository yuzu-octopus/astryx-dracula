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
