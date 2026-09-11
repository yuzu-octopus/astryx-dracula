// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > Ctr[h=80vh] > B.primary"Open settings"[opens=#settings] ;; Dlg#settings > L > (LP[w=280 divider p=3] > V[g=4] > Hd"Account settings"[level=2] + (UL > LI"Personal information"*8)) + (LC[p=6] > V[g=6] > DH"Account" + SE"Settings section" + (V[g=0] > TabList + (V[g=0] > Hd"Login"[level=3] + D + (H[j=between a=start] > (V[g=0] > Tx"Password"[weight=semibold] + Tx"Not created"[t=supporting]) + Lk"Create") + (H[g=3 a=start] > Ic + (V[g=0] > (H[g=2 a=center wrap] > Tx"OS X 10.15.7 Chrome"[weight=semibold] + SD) + Tx"March 30, 2026"[t=supporting])))))

/**
 * Settings Dialog — account sections inside one modal.
 *
 * Frame: the trigger page, then a Dialog that sizes to
 * min(900px, 100vw - 32px): section panel (280px, spaced nav list) | scrolling
 * content column with a sticky DialogHeader and one section at a time.
 *
 * Responsive contract:
 *   > 640px  the section panel sits beside the content
 *   <= 640px the panel is dropped and a section Selector renders above the
 *            content; row actions stay nowrap while the info column wraps
 */

import React, {useState, type CSSProperties} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutPanel,
  LayoutContent,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {List, ListItem} from '@astryxdesign/core/List';
import {Divider} from '@astryxdesign/core/Divider';
import {Selector} from '@astryxdesign/core/Selector';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Card} from '@astryxdesign/core/Card';
import {Switch} from '@astryxdesign/core/Switch';
import {Link} from '@astryxdesign/core/Link';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Icon} from '@astryxdesign/core/Icon';
import {Center} from '@astryxdesign/core/Center';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  User,
  Lock,
  Globe,
  ShieldCheck,
  Monitor,
  Bell,
  FileText,
  CreditCard,
  Briefcase,
  SquarePen,
  Share2,
} from 'lucide-react';

const iconBox: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  backgroundColor: 'var(--color-background-surface)',
  flexShrink: 0,
};
// Sticky dialog header bar — no Astryx prop for sticky/background/z-index.
// Inline + block padding comes from the parent LayoutContent `padding`.
const headerSticky: CSSProperties = {
  position: 'sticky',
  top: 0,
  backgroundColor: 'var(--color-background-surface)',
  zIndex: 1,
};
// No `maxWidth` prop on VStack — width only. Inline padding comes from
// the parent LayoutContent `padding`.
const contentMaxWidth: CSSProperties = {
  maxWidth: 680,
};
// Aligns the sidebar heading with list-item label text. No heading margin prop.
const sideNavHeading: CSSProperties = {
  marginInline: 'var(--spacing-4)',
};
const dialogHeight: CSSProperties = {
  height: '85vh',
};
// Keeps row actions ("Log out", "Deactivate") on one line: without this the
// action column wraps mid-phrase at tablet widths while the info column still
// has room to wrap instead.
const actionNoWrap: CSSProperties = {
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = '#/templates/settings-dialog';

const NAV_ITEMS = [
  {label: 'Personal information', icon: User},
  {label: 'Login & security', icon: Lock},
  {label: 'Privacy', icon: ShieldCheck},
  {label: 'Notifications', icon: Bell},
  {label: 'Taxes', icon: FileText},
  {label: 'Payments', icon: CreditCard},
  {label: 'Languages & currency', icon: Globe},
  {label: 'Travel for work', icon: Briefcase},
];

const LOGIN_ROWS = [
  {label: 'Password', value: 'Not created', action: 'Create'},
];

const SOCIAL_ROWS = [
  {label: 'Google', value: 'Connected', action: 'Disconnect'},
];

const DEVICE_ROWS: {
  label: string;
  isCurrent?: boolean;
  location: string;
  action?: string;
}[] = [
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

interface ExpandableRowProps {
  label: string;
  value: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const INFO_TILES: Array<{
  icon: typeof Lock;
  title: string;
  body: string;
}> = [
  {
    icon: Lock,
    title: "Why isn't my info shown here?",
    body: "We're hiding some account details to protect your identity.",
  },
  {
    icon: SquarePen,
    title: 'Which details can be edited?',
    body: "Contact info and personal details can be edited. If this info was used to verify your identity, you'll need to get verified again the next time you book, or to continue hosting.",
  },
  {
    icon: Share2,
    title: 'What info is shared with others?',
    body: 'We only release contact information after a reservation is confirmed.',
  },
];

function InfoTile({
  icon,
  title,
  body,
}: {
  icon: typeof Lock;
  title: string;
  body: string;
}) {
  return (
    <HStack gap={3} vAlign="start">
      <Center width={48} height={48} style={iconBox}>
        <Icon icon={icon} />
      </Center>
      <VStack gap={0}>
        <Text type="body" weight="semibold" display="block">
          {title}
        </Text>
        <Text type="supporting" color="secondary" display="block">
          {body}
        </Text>
      </VStack>
    </HStack>
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
    <HStack hAlign="between" vAlign="start">
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
    <VStack gap={4}>
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

function InfoRowItem({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action: string;
}) {
  return (
    <>
      <HStack hAlign="between" vAlign="start">
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

interface DeviceRow {
  label: string;
  isCurrent?: boolean;
  location: string;
  action?: string;
}

function DeviceRowItem({label, isCurrent, location, action}: DeviceRow) {
  return (
    <>
      <HStack gap={3} vAlign="start">
        <Icon icon={Monitor} />
        <StackItem size="fill">
          <VStack gap={0}>
            {/* wrap: the label plus the session status exceed the compact
                content width (~280px). */}
            <HStack gap={2} vAlign="center" wrap="wrap">
              <Text type="body" weight="semibold">
                {label}
              </Text>
              {isCurrent && (
                <HStack gap={1} vAlign="center">
                  <StatusDot variant="success" label="Current session" />
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
              {location}
            </Text>
          </VStack>
        </StackItem>
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

export default function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Login & security');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [language, setLanguage] = useState('en-CA');
  const [currency, setCurrency] = useState('CAD');
  const [timezone, setTimezone] = useState('ET');
  const [activeTab, setActiveTab] = useState('login');

  const [legalName, setLegalName] = useState('Vlad Dracul');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('v***d@castle-dracula.ro');
  const [phone, setPhone] = useState('+1 ***-***-0123');
  const [address, setAddress] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('Provided');
  const [readReceipts, setReadReceipts] = useState(true);
  const [searchEngines, setSearchEngines] = useState(true);
  const [showCity, setShowCity] = useState(true);
  const [showTripType, setShowTripType] = useState(true);
  const [showStayLength, setShowStayLength] = useState(true);
  const [showServices, setShowServices] = useState(true);
  const [aiFeatures, setAiFeatures] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [workTravel, setWorkTravel] = useState(false);

  // Below ~640px the 280px section sidebar crushes the content column to
  // ~110px. The sidebar hides and a section picker renders above the content.
  const isCompact = useMediaQuery('(max-width: 640px)');

  const handleEdit = (row: string) => setExpandedRow(row);
  const handleCancel = () => setExpandedRow(null);
  const handleSave = () => setExpandedRow(null);

  return (
    <>
      <Layout
        content={
          <LayoutContent padding={0}>
            <Center height="80vh">
              <Button
                label="Open settings"
                variant="primary"
                onClick={() => setIsOpen(true)}
              />
            </Center>
          </LayoutContent>
        }
      />

      <Dialog
        isOpen={isOpen}
        onOpenChange={open => setIsOpen(open)}
        // One width for every viewport: below 932px the dialog shrinks with the
        // window instead of clipping, so no compact branch is needed.
        width="min(900px, calc(100vw - 32px))"
        maxHeight="85vh"
        padding={0}
        purpose="form"
        style={dialogHeight}>
        <Layout
          height="fill"
          start={
            isCompact ? undefined : (
              <LayoutPanel width={280} hasDivider role="navigation" padding={3}>
              <VStack gap={4}>
                <Heading level={2} style={sideNavHeading}>
                  Account settings
                </Heading>
                <List density="spacious">
                  {NAV_ITEMS.map(item => (
                    <ListItem
                      key={item.label}
                      label={item.label}
                      startContent={<Icon icon={item.icon} />}
                      isSelected={activeNav === item.label}
                      onClick={() => {
                        setActiveNav(item.label);
                        setExpandedRow(null);
                      }}
                    />
                  ))}
                </List>
              </VStack>
              </LayoutPanel>
            )
          }
          content={
            <LayoutContent isScrollable padding={6}>
              <VStack gap={6}>
                <VStack style={headerSticky}>
                  <DialogHeader
                    title={
                      activeNav === 'Personal information'
                        ? 'Personal info'
                        : activeNav
                    }
                    onOpenChange={open => setIsOpen(open)}
                    hasDivider={false}
                  />
                </VStack>
                {isCompact && (
                  <Selector
                    label="Settings section"
                    value={activeNav}
                    onChange={value => {
                      setActiveNav(value);
                      setExpandedRow(null);
                    }}
                    options={NAV_ITEMS.map(item => ({
                      label: item.label,
                      value: item.label,
                    }))}
                    width="100%"
                  />
                )}
                <VStack gap={0} style={contentMaxWidth}>
                  {activeNav === 'Personal information' && (
                    <VStack gap={6}>
                      <VStack gap={4}>
                        <ExpandableRow
                          label="Legal name"
                          value={legalName}
                          isExpanded={expandedRow === 'legalName'}
                          onEdit={() => handleEdit('legalName')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('preferredName')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('email')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('phone')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('address')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('mailingAddress')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('emergencyContact')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                            <React.Fragment key={tile.title}>
                              {i > 0 && <Divider />}
                              <InfoTile {...tile} />
                            </React.Fragment>
                          ))}
                        </VStack>
                      </Card>
                    </VStack>
                  )}

                  {activeNav === 'Login & security' && (
                    <VStack gap={6}>
                      <TabList
                        value={activeTab}
                        onChange={setActiveTab}
                        hasDivider>
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
                            {DEVICE_ROWS.map(device => (
                              <DeviceRowItem
                                key={device.location}
                                {...device}
                              />
                            ))}
                          </VStack>

                          <VStack gap={0}>
                            <Heading level={3}>Account</Heading>
                            <Divider />
                            <HStack hAlign="between" vAlign="start">
                              <VStack gap={0}>
                                <Text
                                  type="body"
                                  weight="semibold"
                                  display="block">
                                  Deactivate your account
                                </Text>
                                <Text
                                  type="supporting"
                                  color="secondary"
                                  display="block">
                                  This action cannot be undone
                                </Text>
                              </VStack>
                              <Link href={SELF_HASH}>Deactivate</Link>
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
                              Review each request carefully before approving
                              access. We&apos;ll email your kin or coven-mate
                              a 4-digit code that lets them enter your crypt
                              from their trusted device.
                            </Text>
                          </VStack>

                          <Card variant="muted">
                            <HStack gap={4} vAlign="start">
                              <Center width={48} height={48} style={iconBox}>
                                <Icon icon={Lock} />
                              </Center>
                              <VStack gap={1}>
                                <Text type="body" weight="bold">
                                  Adding devices for your trusted coven
                                </Text>
                                <Text type="body" color="secondary">
                                  When you approve a request, you grant them
                                  full passage through your crypt. They&apos;ll
                                  be able to change bookings and send ravens
                                  on your behalf.
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
                      <VStack gap={4}>
                        <ExpandableRow
                          label="Preferred language"
                          value={
                            LANGUAGES.find(l => l.value === language)?.label ??
                            language
                          }
                          isExpanded={expandedRow === 'language'}
                          onEdit={() => handleEdit('language')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('currency')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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
                          onEdit={() => handleEdit('timezone')}
                          onCancel={handleCancel}
                          onSave={handleSave}>
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

                  {activeNav === 'Notifications' && (
                    <VStack gap={6}>
                      <VStack gap={4}>
                        <Heading level={3}>Notifications</Heading>
                        <Switch
                          label="Email notifications"
                          description="Booking updates, reminders, and coven decrees."
                          value={emailNotif}
                          onChange={setEmailNotif}
                          labelPosition="start"
                          labelSpacing="spread"
                        />
                        <Divider />
                        <Switch
                          label="Push notifications"
                          description="Time-sensitive alerts, delivered by raven."
                          value={pushNotif}
                          onChange={setPushNotif}
                          labelPosition="start"
                          labelSpacing="spread"
                        />
                        <Divider />
                      </VStack>
                    </VStack>
                  )}

                  {activeNav === 'Payments' && (
                    <VStack gap={6}>
                      <VStack gap={4}>
                        <Heading level={3}>Payments</Heading>
                        <Divider />
                        <InfoRowItem
                          label="Tribute method"
                          value="Visa ending in 4821"
                          action=""
                        />
                        <InfoRowItem
                          label="Tribute ledger"
                          value="No tributes yet"
                          action=""
                        />
                      </VStack>
                    </VStack>
                  )}

                  {activeNav === 'Taxes' && (
                    <VStack gap={6}>
                      <VStack gap={4}>
                        <Heading level={3}>Taxes</Heading>
                        <Divider />
                        <InfoRowItem
                          label="Tithe profile"
                          value="Not submitted"
                          action=""
                        />
                        <InfoRowItem
                          label="Tithe scrolls"
                          value="Available after your first tribute"
                          action=""
                        />
                      </VStack>
                    </VStack>
                  )}

                  {activeNav === 'Travel for work' && (
                    <VStack gap={6}>
                      <VStack gap={4}>
                        <Heading level={3}>Travel for work</Heading>
                        <Switch
                          label="Show night-errand options"
                          description="Adds a night-errand toggle at checkout."
                          value={workTravel}
                          onChange={setWorkTravel}
                          labelPosition="start"
                          labelSpacing="spread"
                        />
                        <Divider />
                      </VStack>
                    </VStack>
                  )}

                  {activeNav === 'Privacy' && (
                    <VStack gap={6}>
                      <VStack gap={8}>
                        <VStack gap={4}>
                          <Heading level={3}>Messages</Heading>
                          <Switch
                            label="Show people when I've read their messages."
                            value={readReceipts}
                            onChange={setReadReceipts}
                            labelPosition="start"
                            labelSpacing="spread"
                          />
                          <HStack hAlign="between" vAlign="center">
                            <Text type="body" weight="semibold">
                              Blocked people
                            </Text>
                            <Link href={SELF_HASH}>View</Link>
                          </HStack>
                          <Divider />
                        </VStack>

                        <VStack gap={4}>
                          <Heading level={3}>Listings</Heading>
                          <Switch
                            label="List my wares in the scrying mirrors"
                            description="Turning this on means scrying engines, like Google, will show your wares to seekers."
                            value={searchEngines}
                            onChange={setSearchEngines}
                            labelPosition="start"
                            labelSpacing="spread"
                          />
                          <Divider />
                        </VStack>

                        <VStack gap={4}>
                          <Heading level={3}>Reviews</Heading>
                          <Text type="body" color="secondary">
                            Choose what&apos;s shared when you write a review.{' '}
                            <Link href={SELF_HASH}>Learn more</Link>
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
                                  We&apos;re committed to keeping your data
                                  protected. See details in our{' '}
                                  <Link href={SELF_HASH}>
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
                </VStack>
              </VStack>
            </LayoutContent>
          }
        />
      </Dialog>
    </>
  );
}
