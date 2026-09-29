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
// THREE RULES these rows are built around, from USAGE.md "Rules":
//  - A link is a destination, a button is an action. The trailing control is
//    whichever it actually is, and the caller says which via `actionHref`:
//    with it, the row's action column goes somewhere and is a `Link` ("View"
//    on a list of past records); without it, the control changes state in
//    place and is a `Button` ("Create", "Disconnect"). Getting this backwards
//    is the failure this pass exists to remove, so it is a prop rather than a
//    guess. Buttons are `secondary`, not `primary`: a row action must not
//    outrank the panel's own primary, and a filled accent button in a
//    trailing column is what made these panels read as a form.
//  - A divider is a section boundary, not a row background. Rows therefore
//    render one ONLY when the caller marks `hasDivider` at a real group
//    boundary; without it the row leaves the rhythm to the caller's own
//    `Stack gap` / row padding rather than adding a rule of its own.
//  - Spacing comes from the scale. The label/value pair is spaced with
//    `Stack gap`, never a margin, and `gap={1}` matches the rows each template
//    builds itself (device history, Deactivate, the info tiles) so no row on
//    the page reads tighter than its neighbours.
//
// `href` is retained as an accepted-but-unused prop on both public rows. It
// was the anchor for Links this file no longer renders unconditionally, so
// nothing reads it; deleting it would break every in-flight call site that
// still passes it. `actionHref` is the live signal for a destination action —
// deliberately a different name, because `href` is inert and must not be
// confused with a real one. Both can go once no caller passes them.

export function InfoRowItem({
  label,
  value,
  action,
  style,
  actionHref,
  hasDivider = true,
}: InfoRow & {
  /** Accepted for call-site compatibility; unused — see the note above. */
  href?: string;
  style?: CSSProperties;
  /**
   * Destination for the trailing control: present means it navigates and
   * renders a `Link`, absent means it acts in place and renders a `Button`.
   */
  actionHref?: string;
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
          (actionHref ? (
            <Link href={actionHref} style={actionNoWrap}>
              {action}
            </Link>
          ) : (
            <Button
              label={action}
              variant="secondary"
              size="sm"
              style={actionNoWrap}
              onClick={() => {}}
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
  /** Accepted for call-site compatibility; unused — see the note above. */
  href?: string;
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
