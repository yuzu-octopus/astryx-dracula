// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LP[p=0] > V[g=4] > Tx"Account settings"[t=label] + (UL > LI*8) + D + LI"Professional hosting tools") + (LC[p=6] > V[g=0] > (Tbar > B.ghost + Hd"Personal info"[level=1]) + Hd"Personal info"[level=1] + (V[g=0] > (H[j=between a=start] > (V[g=0] > Tx"Legal name"[weight=semibold] + Tx"Vlad Dracul"[t=supporting]) + Lk"Edit")*7) + (C.muted > V[g=4] > (H[g=3 a=start] > Ic + (V[g=1] > Tx"Why is info hidden?"[weight=semibold] + Tx[t=supporting]))*3))

/**
 * Settings Panels — account sections with a nav panel and divided rows.
 *
 * Frame: Layout nav panel (fill) | content column of section views. One
 * section renders at a time; rows are [label + value][action] pairs divided
 * edge-to-edge, never card-wrapped.
 *
 * Responsive contract:
 *   > 768px  the nav panel sits beside the content and the selected nav row
 *            carries the selection
 *   <= 768px master to detail: the nav fills the page, and selecting a row
 *            drills into the detail view behind a back button
 */

import {Fragment, useState, type CSSProperties} from 'react';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutPanel,
} from '@astryxdesign/core/Layout';
import {List, ListItem} from '@astryxdesign/core/List';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Button} from '@astryxdesign/core/Button';
import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Card} from '@astryxdesign/core/Card';
import {Switch} from '@astryxdesign/core/Switch';
import {Divider} from '@astryxdesign/core/Divider';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Icon} from '@astryxdesign/core/Icon';
import {Center} from '@astryxdesign/core/Center';
import {
  Lock,
  ShieldCheck,
  Wrench,
  Monitor,
  SquarePen,
  Share2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import {
  NAV_ITEMS,
  LOGIN_ROWS,
  SOCIAL_ROWS,
  DEVICE_ROWS,
  INFO_TILES,
} from 'astryx-dracula/shared/settings-rows';
import type {InfoRow} from 'astryx-dracula/shared/settings-rows';

// Anchor the page to the viewport height so the sidebar + content fill the
// screen. Layout height="fill" is min-height:100% which collapses when the
// host container is content-sized; Layout has no viewport-height prop.
const fillViewport: CSSProperties = {
  minHeight: '100dvh',
};
const iconBox: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  backgroundColor: 'var(--color-background-surface)',
  flexShrink: 0,
};
const rowPadding: CSSProperties = {
  paddingBlock: 'var(--spacing-4)',
};
// Keeps row actions ("Log out", "Deactivate") on one line: without this the
// action column wraps mid-phrase at tablet widths while the info column still
// has room to wrap instead.
const actionNoWrap: CSSProperties = {
  flexShrink: 0,
  whiteSpace: 'nowrap',
};
const sideNavPadding: CSSProperties = {
  paddingBlock: 'var(--spacing-4)',
  paddingInline: 'var(--spacing-3)',
};
const sideNavHeading: CSSProperties = {
  marginInline: 'var(--spacing-4)',
};

// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = '#/templates/settings-sidebar';

// Section title shown beside the mobile back button (matches each section's
// in-content heading, which is hidden on mobile to avoid a duplicate).
const SECTION_TITLES: Record<string, string> = {
  'Personal information': 'Personal info',
  'Login & security': 'Login & security',
  Privacy: 'Privacy',
  Notifications: 'Notifications',
  Taxes: 'Taxes',
  Payments: 'Payments',
  'Languages & currency': 'Languages & currency',
  'Travel for work': 'Travel for work',
  'Professional hosting tools': 'Hosting tools',
};

const TAX_ROWS: InfoRow[] = [
  {label: 'Tithe information', value: 'Not provided', action: 'Add'},
  {label: 'Tithe scrolls', value: 'No scrolls yet', action: 'View'},
];

const PAYOUT_ROWS: InfoRow[] = [
  {label: 'Tribute method', value: 'Not set up', action: 'Add'},
  {label: 'Past tributes', value: 'No tributes yet', action: 'View'},
];

function InfoRowItem({label, value, action}: InfoRow) {
  return (
    <>
      <HStack hAlign="between" vAlign="start" style={rowPadding}>
        <VStack gap={0}>
          <Text type="body" weight="semibold" display="block">
            {label}
          </Text>
          <Text type="supporting" color="secondary" display="block">
            {value}
          </Text>
        </VStack>
        {action && (
          <Link href={SELF_HASH} style={actionNoWrap}>
            {action}
          </Link>
        )}
      </HStack>
      <Divider />
    </>
  );
}

interface ExpandableRowProps {
  label: string;
  value: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

function ExpandableRowEditing({
  label,
  children,
  onCancel,
  onSave,
}: {
  label: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <VStack gap={4} style={rowPadding}>
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
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
        <HStack hAlign="between" vAlign="start" style={rowPadding}>
          <VStack gap={0}>
            <Text type="body" weight="semibold" display="block">
              {label}
            </Text>
            <Text type="supporting" color="secondary" display="block">
              {value}
            </Text>
          </VStack>
          <Link
            href={SELF_HASH}
            style={actionNoWrap}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onEdit();
            }}>
            Edit
          </Link>
        </HStack>
  );
}

function ExpandableRow({
  label,
  value,
  children,
  isExpanded,
  onEdit,
  onCancel,
  onSave,
}: ExpandableRowProps) {
  return (
    <>
      {isExpanded ? (
        <ExpandableRowEditing
          label={label}
          onCancel={onCancel}
          onSave={onSave}>
          {children}
        </ExpandableRowEditing>
      ) : (
        <ExpandableRowViewing label={label} value={value} onEdit={onEdit} />
      )}
      <Divider />
    </>
  );
}

const LANGUAGES = [
  {label: 'English (Canada)', value: 'en-CA'},
  {label: 'English (US)', value: 'en-US'},
  {label: 'French', value: 'fr'},
  {label: 'Spanish', value: 'es'},
  {label: 'German', value: 'de'},
  {label: 'Japanese', value: 'ja'},
];

const CURRENCIES = [
  {label: 'Canadian dollar (CAD)', value: 'CAD'},
  {label: 'US dollar (USD)', value: 'USD'},
  {label: 'Euro (EUR)', value: 'EUR'},
  {label: 'British pound (GBP)', value: 'GBP'},
  {label: 'Japanese yen (JPY)', value: 'JPY'},
];

const TIMEZONES = [
  {label: '(GMT-05:00) Eastern Time (US & Canada)', value: 'ET'},
  {label: '(GMT-06:00) Central Time (US & Canada)', value: 'CT'},
  {label: '(GMT-07:00) Mountain Time (US & Canada)', value: 'MT'},
  {label: '(GMT-08:00) Pacific Time (US & Canada)', value: 'PT'},
  {label: '(GMT+00:00) UTC', value: 'UTC'},
  {label: '(GMT+01:00) London', value: 'GMT+1'},
];

export default function SettingsSidebar() {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  // Mobile is a master→detail drill-down: 'nav' shows the menu, 'detail' shows
  // the selected section with a back button. Desktop shows both side-by-side.
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav');
  const [activeNav, setActiveNav] = useState('Personal information');
  const [activeTab, setActiveTab] = useState('login');
  const [readReceipts, setReadReceipts] = useState(true);
  const [searchEngines, setSearchEngines] = useState(true);
  const [showCity, setShowCity] = useState(true);
  const [showTripType, setShowTripType] = useState(true);
  const [showStayLength, setShowStayLength] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [aiFeatures, setAiFeatures] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [workTrips, setWorkTrips] = useState(false);

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [language, setLanguage] = useState('en-CA');
  const [currency, setCurrency] = useState('CAD');
  const [timezone, setTimezone] = useState('ET');

  const [legalName, setLegalName] = useState('Vlad Dracul');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('v***d@castle-dracula.ro');
  const [phone, setPhone] = useState('+1 ***-***-0123');
  const [address, setAddress] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('Provided');

  // Selecting a nav item also drills into the detail view on mobile.
  const selectNav = (label: string) => {
    setActiveNav(label);
    setMobileView('detail');
  };

  const navList = (
    <VStack gap={4} style={sideNavPadding}>
      <Text type="label" style={sideNavHeading}>
        Account settings
      </Text>
      <List density="spacious">
        {NAV_ITEMS.map(item => (
          <ListItem
            key={item.label}
            label={item.label}
            startContent={<Icon icon={item.icon} />}
            endContent={
              isNarrow ? (
                <Icon icon={ChevronRight} size="sm" color="secondary" />
              ) : undefined
            }
            isSelected={!isNarrow && activeNav === item.label}
            onClick={() => selectNav(item.label)}
          />
        ))}
      </List>
      <Divider />
      <List density="spacious">
        <ListItem
          label="Professional hosting tools"
          startContent={<Icon icon={Wrench} />}
          onClick={() => {}}
        />
      </List>
    </VStack>
  );

  // Mobile, nav view: show only the menu (full width, no sidebar slot).
  if (isNarrow && mobileView === 'nav') {
    return (
      <Layout
        height="fill"
        style={fillViewport}
        content={<LayoutContent padding={2}>{navList}</LayoutContent>}
      />
    );
  }

  return (
    <Layout
      height="fill"
      contentWidth={1200}
      style={fillViewport}
      start={
        isNarrow ? undefined : (
          <LayoutPanel hasDivider padding={0}>
            {navList}
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent padding={6}>
          <VStack gap={0}>
            {/* Mobile detail view: a back button sits beside the section title
                (the per-section headings below are hidden on mobile). Toolbar's
                start slot edge-compensates the ghost button so its icon aligns
                flush with the content edge. */}
            {isNarrow && (
              <Toolbar
                label={`Back to Account settings: ${SECTION_TITLES[activeNav]}`}
                gap={2}
                startContent={
                  <>
                    <Button
                      label="Back to Account settings"
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      icon={<Icon icon={ArrowLeft} size="sm" />}
                      onClick={() => setMobileView('nav')}
                    />
                    <Heading level={1}>{SECTION_TITLES[activeNav]}</Heading>
                  </>
                }
              />
            )}
            {activeNav === 'Login & security' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Login &amp; security</Heading>}

                <TabList value={activeTab} onChange={setActiveTab} hasDivider>
                  <Tab value="login" label="Login" />
                  <Tab value="shared" label="Shared access" />
                </TabList>

                {activeTab === 'login' && (
                  <VStack gap={8}>
                    <VStack gap={0}>
                      <Heading level={3}>Login</Heading>
                      <Divider />
                      {LOGIN_ROWS.map(row => (
                        <InfoRowItem key={row.label} {...row} />
                      ))}
                    </VStack>

                    <VStack gap={0}>
                      <Heading level={3}>Social accounts</Heading>
                      <Divider />
                      {SOCIAL_ROWS.map(row => (
                        <InfoRowItem key={row.label} {...row} />
                      ))}
                    </VStack>

                    <VStack gap={0}>
                      <Heading level={3}>Device history</Heading>
                      <Divider />
                      {DEVICE_ROWS.map((device) => (
                        <HStack
                          key={device.location}
                          gap={3}
                          vAlign="start"
                          style={rowPadding}>
                          <Icon icon={Monitor} />
                          <StackItem size="fill">
                            <VStack gap={0}>
                              {/* wrap: the label plus the session status
                                  exceed the content width on a phone. */}
                              <HStack gap={2} vAlign="center" wrap="wrap">
                                <Text type="body" weight="semibold">
                                  {device.label}
                                </Text>
                                {device.isCurrent && (
                                  <HStack gap={1} vAlign="center">
                                    <StatusDot
                                      variant="success"
                                      label="Current session"
                                    />
                                    <Text type="supporting" color="secondary">
                                      Current session
                                    </Text>
                                  </HStack>
                                )}
                              </HStack>
                              <Text
                                type="supporting"
                                color="secondary"
                                display="block"
                                hasTabularNumbers>
                                {device.location}
                              </Text>
                            </VStack>
                          </StackItem>
                          {device.action && (
                            <Link href={SELF_HASH} style={actionNoWrap}>
                              {device.action}
                            </Link>
                          )}
                        </HStack>
                      ))}
                      <Divider />
                    </VStack>

                    <VStack gap={0}>
                      <Heading level={3}>Account</Heading>
                      <Divider />
                      <HStack
                        hAlign="between"
                        vAlign="start"
                        style={rowPadding}>
                        <VStack gap={0}>
                          <Text type="body" weight="semibold" display="block">
                            Deactivate your account
                          </Text>
                          <Text
                            type="supporting"
                            color="secondary"
                            display="block">
                            This action cannot be undone
                          </Text>
                        </VStack>
                        <Link href={SELF_HASH} style={actionNoWrap}>
                          Deactivate
                        </Link>
                      </HStack>
                      <Divider />
                    </VStack>
                  </VStack>
                )}

                {activeTab === 'shared' && (
                  <VStack gap={8}>
                    <VStack gap={2}>
                      <Heading level={3}>Shared access</Heading>
                      <Divider />
                      <Text type="body" color="secondary">
                        Review each request carefully before approving access.
                        We&apos;ll email your kin or coven-mate a 4-digit
                        code that lets them enter your crypt from their
                        trusted device.
                      </Text>
                    </VStack>

                    <Card variant="muted">
                      <HStack gap={4} vAlign="start">
                        <Center width={48} height={48} style={iconBox}>
                          <Icon icon={Lock} />
                        </Center>
                        <VStack gap={1}>
                          <Text type="body" weight="bold">
                            Adding devices from people you trust
                          </Text>
                          <Text type="body" color="secondary">
                            When you approve a request, you grant someone full
                            access to your account. They&apos;ll be able to
                            change reservations and send messages on your
                            behalf.
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  </VStack>
                )}
              </VStack>
            )}

            {activeNav === 'Languages & currency' && (
              <VStack gap={6}>
                {!isNarrow && (
                  <Heading level={1}>Languages &amp; currency</Heading>
                )}
                <VStack gap={0}>
                  <ExpandableRow
                    label="Preferred language"
                    value={
                      LANGUAGES.find(l => l.value === language)?.label ??
                      language
                    }
                    isExpanded={expandedRow === 'language'}
                    onEdit={() => setExpandedRow('language')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <Selector
                      label="Language"
                      isLabelHidden
                      size="lg"
                      value={language}
                      onChange={setLanguage}
                      options={LANGUAGES}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Preferred currency"
                    value={
                      CURRENCIES.find(c => c.value === currency)?.label ??
                      currency
                    }
                    isExpanded={expandedRow === 'currency'}
                    onEdit={() => setExpandedRow('currency')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <Selector
                      label="Currency"
                      isLabelHidden
                      size="lg"
                      value={currency}
                      onChange={setCurrency}
                      options={CURRENCIES}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Time zone"
                    value={
                      TIMEZONES.find(t => t.value === timezone)?.label ??
                      timezone
                    }
                    isExpanded={expandedRow === 'timezone'}
                    onEdit={() => setExpandedRow('timezone')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <Selector
                      label="Time zone"
                      isLabelHidden
                      size="lg"
                      value={timezone}
                      onChange={setTimezone}
                      options={TIMEZONES}
                    />
                  </ExpandableRow>
                </VStack>
              </VStack>
            )}

            {activeNav === 'Personal information' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Personal info</Heading>}
                <VStack gap={0}>
                  <ExpandableRow
                    label="Legal name"
                    value={legalName}
                    isExpanded={expandedRow === 'legalName'}
                    onEdit={() => setExpandedRow('legalName')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Legal name"
                      isLabelHidden
                      value={legalName}
                      onChange={setLegalName}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Preferred first name"
                    value={preferredName || 'Not provided'}
                    isExpanded={expandedRow === 'preferredName'}
                    onEdit={() => setExpandedRow('preferredName')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Preferred first name"
                      isLabelHidden
                      value={preferredName}
                      onChange={setPreferredName}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Email address"
                    value={email}
                    isExpanded={expandedRow === 'email'}
                    onEdit={() => setExpandedRow('email')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Email address"
                      isLabelHidden
                      value={email}
                      onChange={setEmail}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Phone number"
                    value={phone}
                    isExpanded={expandedRow === 'phone'}
                    onEdit={() => setExpandedRow('phone')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Phone number"
                      isLabelHidden
                      value={phone}
                      onChange={setPhone}
                    />
                  </ExpandableRow>
                  <InfoRowItem
                    label="Identity verification"
                    value="Verified"
                    action=""
                  />
                  <ExpandableRow
                    label="Residential address"
                    value={address || 'Not provided'}
                    isExpanded={expandedRow === 'address'}
                    onEdit={() => setExpandedRow('address')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Residential address"
                      isLabelHidden
                      value={address}
                      onChange={setAddress}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Mailing address"
                    value={mailingAddress || 'Not provided'}
                    isExpanded={expandedRow === 'mailingAddress'}
                    onEdit={() => setExpandedRow('mailingAddress')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Mailing address"
                      isLabelHidden
                      value={mailingAddress}
                      onChange={setMailingAddress}
                    />
                  </ExpandableRow>
                  <ExpandableRow
                    label="Emergency contact"
                    value={emergencyContact}
                    isExpanded={expandedRow === 'emergencyContact'}
                    onEdit={() => setExpandedRow('emergencyContact')}
                    onCancel={() => setExpandedRow(null)}
                    onSave={() => setExpandedRow(null)}>
                    <TextInput
                      label="Emergency contact"
                      isLabelHidden
                      value={emergencyContact}
                      onChange={setEmergencyContact}
                    />
                  </ExpandableRow>
                </VStack>

                <Card padding={4}>
                  <VStack gap={4}>
                    {INFO_TILES.map((tile, i) => (
                      <Fragment key={tile.title}>
                        {i > 0 && <Divider />}
                        <HStack gap={3} vAlign="start">
                          <Center width={48} height={48} style={iconBox}>
                            <Icon icon={tile.icon} />
                          </Center>
                          <VStack gap={0}>
                            <Text type="body" weight="semibold" display="block">
                              {tile.title}
                            </Text>
                            <Text
                              type="supporting"
                              color="secondary"
                              display="block">
                              {tile.body}
                            </Text>
                          </VStack>
                        </HStack>
                      </Fragment>
                    ))}
                  </VStack>
                </Card>
              </VStack>
            )}

            {activeNav === 'Privacy' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Privacy</Heading>}

                <VStack gap={8}>
                  <VStack gap={0}>
                    <Heading level={3}>Messages</Heading>
                    <VStack style={rowPadding}>
                      <Switch
                        label="Show people when I've read their messages."
                        value={readReceipts}
                        onChange={setReadReceipts}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                    </VStack>
                    <HStack hAlign="between" vAlign="center" style={rowPadding}>
                      <Text type="body" weight="semibold">
                        Blocked people
                      </Text>
                      <Link href={SELF_HASH}>View</Link>
                    </HStack>
                    <Divider />
                  </VStack>

                  <VStack gap={0}>
                    <Heading level={3}>Listings</Heading>
                    <VStack style={rowPadding}>
                      <Switch
                        label="List my wares in the scrying mirrors"
                        description="Turning this on means scrying engines, like Google, will show your wares to seekers."
                        value={searchEngines}
                        onChange={setSearchEngines}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                    </VStack>
                    <Divider />
                  </VStack>

                  <VStack gap={4}>
                    <Heading level={3}>Reviews</Heading>
                    <Text type="body" color="secondary">
                      Choose what&apos;s shared when you write a review.{' '}
                      <Link href={SELF_HASH} type="body">
                        Learn more
                      </Link>
                    </Text>
                    <VStack gap={4}>
                      <Switch
                        label="Show my home haunt and country"
                        description="Ex: City and country"
                        value={showCity}
                        onChange={setShowCity}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                      <Switch
                        label="Show my journey type"
                        description="Ex: Rested with kin or familiars"
                        value={showTripType}
                        onChange={setShowTripType}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                      <Switch
                        label="Show my length of stay"
                        description="Ex: A few nights, about a week, etc."
                        value={showStayLength}
                        onChange={setShowStayLength}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                      <Switch
                        label="Show my booked revels"
                        description="Ex: Midnight feasts and tasting rituals"
                        value={showServices}
                        onChange={setShowServices}
                        labelPosition="start"
                        labelSpacing="spread"
                      />
                    </VStack>
                    <Divider />
                  </VStack>

                  <VStack gap={4}>
                    <Heading level={3}>Data privacy</Heading>
                    <Card>
                      <HStack hAlign="between" vAlign="center">
                        <Text type="body">Request my personal data</Text>
                        <Link href={SELF_HASH}>Request</Link>
                      </HStack>
                    </Card>
                    <Switch
                      label="Help improve AI-powered features"
                      description="When this is on, we use your data to develop and improve AI models."
                      value={aiFeatures}
                      onChange={setAiFeatures}
                      labelPosition="start"
                      labelSpacing="spread"
                    />
                    <Card>
                      <HStack hAlign="between" vAlign="center">
                        <Text type="body">Delete my account</Text>
                        <Link href={SELF_HASH}>Delete</Link>
                      </HStack>
                    </Card>
                    <Card variant="muted">
                      <HStack gap={4} vAlign="start">
                        <Center width={48} height={48} style={iconBox}>
                          <Icon icon={ShieldCheck} />
                        </Center>
                        <VStack gap={1}>
                          <Text type="body" weight="bold">
                            Committed to privacy
                          </Text>
                          <Text type="supporting" color="secondary">
                            We&apos;re committed to keeping your data protected.
                            See details in our{' '}
                            <Link href={SELF_HASH} type="supporting">
                              Privacy Policy
                            </Link>
                            .
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  </VStack>
                </VStack>
              </VStack>
            )}

            {activeNav === 'Notifications' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Notifications</Heading>}
                <VStack gap={0}>
                  <Heading level={3}>Messages</Heading>
                  <VStack style={rowPadding}>
                    <Switch
                      label="Email notifications"
                      description="Coven updates, journey reminders, and crypt activity."
                      value={emailNotif}
                      onChange={setEmailNotif}
                      labelPosition="start"
                      labelSpacing="spread"
                    />
                  </VStack>
                  <Divider />
                  <VStack style={rowPadding}>
                    <Switch
                      label="Push notifications"
                      description="Swift ravens for messages and booking requests."
                      value={pushNotif}
                      onChange={setPushNotif}
                      labelPosition="start"
                      labelSpacing="spread"
                    />
                  </VStack>
                  <Divider />
                </VStack>
              </VStack>
            )}

            {activeNav === 'Taxes' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Taxes</Heading>}
                <VStack gap={0}>
                  <Heading level={3}>Tax documents</Heading>
                  <Divider />
                  {TAX_ROWS.map(row => (
                    <InfoRowItem key={row.label} {...row} />
                  ))}
                </VStack>
              </VStack>
            )}

            {activeNav === 'Payments' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Payments</Heading>}
                <VStack gap={0}>
                  <Heading level={3}>Payouts</Heading>
                  <Divider />
                  {PAYOUT_ROWS.map(row => (
                    <InfoRowItem key={row.label} {...row} />
                  ))}
                </VStack>
              </VStack>
            )}

            {activeNav === 'Travel for work' && (
              <VStack gap={6}>
                {!isNarrow && <Heading level={1}>Travel for work</Heading>}
                <VStack gap={0}>
                  <Heading level={3}>Work trips</Heading>
                  <VStack style={rowPadding}>
                    <Switch
                      label="Show night-errand options at checkout"
                      description="Add a coven address to expense night errands and unlock travel-ready wares."
                      value={workTrips}
                      onChange={setWorkTrips}
                      labelPosition="start"
                      labelSpacing="spread"
                    />
                  </VStack>
                  <Divider />
                </VStack>
              </VStack>
            )}

            {activeNav === 'Professional hosting tools' && (
              <VStack gap={6}>
                {!isNarrow && (
                  <Heading level={1}>Professional hosting tools</Heading>
                )}
                <Card variant="muted">
                  <HStack gap={4} vAlign="start">
                    <Center width={48} height={48} style={iconBox}>
                      <Icon icon={Wrench} />
                    </Center>
                    <VStack gap={1}>
                      <Text type="body" weight="bold">
                        Tools for professional hosts
                      </Text>
                      <Text type="supporting" color="secondary">
                        Manage multiple listings, route tasks to co-hosts, and
                        review consolidated payouts from one place.
                      </Text>
                    </VStack>
                  </HStack>
                </Card>
              </VStack>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
