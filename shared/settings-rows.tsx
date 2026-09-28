// Row RENDERERS for the settings dialog and settings sidebar templates.
// The data they render lives in shared/settings-data.ts, split out so this file
// exports only components -- a .tsx exporting non-components breaks React Fast
// Refresh, and three templates read that data, so it was never private to here.

import {
  DEVICE_ROWS,
  INFO_TILES,
  LOGIN_ROWS,
  SOCIAL_ROWS,
  actionNoWrap,
  iconBox,
  type DeviceRow,
  type InfoRow,
  type InfoTileData,
  type SettingsNavItem,
} from 'astryx-dracula/shared/settings-data';
import {
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
import type {CSSProperties, MouseEvent, ReactNode} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';

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
