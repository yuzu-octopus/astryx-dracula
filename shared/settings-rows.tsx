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
import type {CSSProperties, ReactNode} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';

// ─── Row components ──────────────────────────────────────────────────────────
// The row renderers themselves, moved here from both templates. The two copies
// were byte-identical apart from things that genuinely differ per template, so
// those are props rather than forks: `style` (the sidebar pads its rows, the
// dialog does not) and `hasDivider` (each template draws its own group
// boundaries). Verified by hash before the move — the row BODIES matched
// exactly; only these call-site differences remained.
//
// FOUR RULES these rows are built around, from USAGE.md "Rules":
//  - A link is a destination, a button is an action. The trailing control is a
//    `Button` when the row acts in place and a `Link` when it navigates, and
//    the row data says which: `actionKind` is `'action'` (the default) for
//    "Create"/"Disconnect", `'destination'` for "View" on a list of past
//    records, with `href` carrying the destination. It is stated in the data
//    rather than guessed from the label, because reading the English verb off
//    the row is what made "View" a button. The Link takes the kit's
//    hover-only underline — it jumps out of the panel, which is the
//    navigation case, not prose — and never a hand-rolled `textDecoration`.
//  - The Button is configured from the row data, never from a constant here.
//    `variant` defaults to `secondary` and a row opts into `destructive` when
//    its action ends or destroys something, so a trailing "Disconnect" reads
//    like the panels' own inline Deactivate/Delete controls instead of like
//    the "Create" sitting above it. It is never `primary`: a row action must
//    not outrank the panel's own primary, and a filled accent button in a
//    trailing column is what made these panels read as a form.
//    `onAction` becomes the Button's `onClick` and is optional — with no
//    handler the Button renders inert, which is the honest default for a
//    showcase with no backend. A consumer with a real handler passes one and
//    the row goes live; nothing here fabricates state to make it look live.
//  - A divider is a section boundary, not a row background. Rows therefore
//    render one ONLY when the caller marks `hasDivider` at a real group
//    boundary; without it the row leaves the rhythm to the caller's own
//    `Stack gap` / row padding rather than adding a rule of its own.
//  - Spacing comes from the scale. The label/value pair is spaced with
//    `Stack gap`, never a margin, and `gap={1}` matches the rows each template
//    builds itself (device history, Deactivate, the info tiles) so no row on
//    the page reads tighter than its neighbours.
//
// `href` is a real field on `InfoRow`: where a `'destination'` action goes,
// read only when `actionKind` says the row navigates.

export function InfoRowItem({
  label,
  value,
  action,
  actionKind,
  href,
  variant = 'secondary',
  onAction,
  style,
  hasDivider = true,
}: InfoRow & {
  style?: CSSProperties;
  /** Draw a Divider after the row. True only at a group boundary. */
  hasDivider?: boolean;
}) {
  return (
    <>
      <HStack hAlign="between" vAlign="start" style={style}>
        <VStack gap={1}>
          <Text type="body" weight="semibold" display="block">
            {label}
          </Text>
          <Text type="body" color="secondary" display="block">
            {value}
          </Text>
        </VStack>
        {action &&
          (actionKind === 'destination' && href ? (
            <Link href={href} style={actionNoWrap}>
              {action}
            </Link>
          ) : (
            <Button
              label={action}
              variant={variant}
              size="sm"
              style={actionNoWrap}
              onClick={onAction}
            />
          ))}
      </HStack>
      {hasDivider && <Divider />}
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
  style,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  style?: CSSProperties;
}) {
  return (
    <HStack hAlign="between" vAlign="start" style={style}>
      <VStack gap={1}>
        <Text type="body" weight="semibold" display="block">
          {label}
        </Text>
        <Text type="body" color="secondary" display="block">
          {value}
        </Text>
      </VStack>
      <Button
        label="Edit"
        variant="secondary"
        size="sm"
        style={actionNoWrap}
        onClick={onEdit}
      />
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
  style,
  hasDivider = true,
}: {
  label: string;
  value: string;
  children: ReactNode;
  isExpanded: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  style?: CSSProperties;
  /** Draw a Divider after the row. True only at a group boundary. */
  hasDivider?: boolean;
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
          style={style}
        />
      )}
      {hasDivider && <Divider />}
    </>
  );
}
