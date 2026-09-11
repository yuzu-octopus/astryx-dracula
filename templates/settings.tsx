// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > H[a=center wrap] > (SI[fill] > Hd"Settings"[level=1 t=display-2]) + TY"Search") + (LP[w=260 p=2] > UL > LI*6) + (LC[p=6] > V[g=4] > (V[a=center] > TabList) + ((G[c={min:280} g=8] > (V[g=1] > Hd"Basic information"[level=2] + Tx"View and update your details"[t=body]) + (V[g=4] > TI"Username" + TI"Email address" + (H > B.primary"Save"))) + D)*3)

/**
 * Settings — one scrolling page of account sections.
 *
 * Frame: Layout header (title + settings search) | optional 260px section nav |
 * content column of three section grids, divided.
 *
 * Responsive contract:
 *   > 768px  the section nav is a 260px LayoutPanel beside the content
 *   <= 768px the panel is dropped, the nav collapses to a centered TabList
 *            above the content, the header search wraps under the title, and
 *            every section grid falls to one column (280px floor)
 */

import {useState} from 'react';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {List, ListItem} from '@astryxdesign/core/List';
import {TabList, Tab, TabMenu} from '@astryxdesign/core/TabList';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Typeahead} from '@astryxdesign/core/Typeahead';
import {Search} from 'lucide-react';
import type {SearchableItem, SearchSource} from '@astryxdesign/core/Typeahead';

const NAV_ITEMS = [
  'Profile',
  'Account',
  'Members',
  'Billing',
  'Invoices',
  'API',
];

// WCAG 1.3.5 wants autocomplete on identity fields. TextInput forwards unknown
// props to the <input>, but its prop type omits input-only attributes, so the
// attribute is spread in through a widened record.
const inputAutoComplete = (value: string) =>
  ({autoComplete: value}) as Record<string, string>;

const SETTINGS_ITEMS: SearchableItem[] = [
  {id: '1', label: 'Username'},
  {id: '2', label: 'First name'},
  {id: '3', label: 'Last name'},
  {id: '4', label: 'Email address'},
  {id: '5', label: 'Change password'},
  {id: '6', label: 'Data Export Access'},
  {id: '7', label: 'Allow Admin to Add Members'},
  {id: '8', label: 'Two-Factor Authentication'},
];

const settingsSearchSource: SearchSource<SearchableItem> = {
  search: (query: string) =>
    SETTINGS_ITEMS.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    ),
  bootstrap: () => SETTINGS_ITEMS,
};

export default function SettingsTemplate() {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  const [activeNav, setActiveNav] = useState('Profile');
  const [username, setUsername] = useState('vlad_tepes');
  const [firstName, setFirstName] = useState('Vlad');
  const [lastName, setLastName] = useState('Tepes');
  const [email, setEmail] = useState('vlad_tepes@castle-dracula.ro');
  const [currentPw, setCurrentPw] = useState('password123');
  const [newPw, setNewPw] = useState('password123');
  const [confirmPw, setConfirmPw] = useState('password123');
  const [dataExport, setDataExport] = useState(false);
  const [adminMembers, setAdminMembers] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [searchValue, setSearchValue] = useState<SearchableItem | null>(null);

  return (
    <Layout
      height="fill"
      contentWidth={1440}
      header={
        <LayoutHeader hasDivider>
          <HStack vAlign="center" wrap="wrap">
            <StackItem size="fill">
              <Heading level={1} type="display-2">Settings</Heading>
            </StackItem>
            <Typeahead
              label="Search"
              isLabelHidden
              placeholder="Search coven settings…"
              searchSource={settingsSearchSource}
              value={searchValue}
              onChange={setSearchValue}
              hasEntriesOnFocus
              startIcon={Search}
            />
          </HStack>
        </LayoutHeader>
      }
      start={
        isNarrow ? undefined : (
          <LayoutPanel hasDivider={false} width={260} padding={2}>
            <List density="balanced">
              {NAV_ITEMS.map(item => (
                <ListItem
                  key={item}
                  label={item}
                  isSelected={activeNav === item}
                  onClick={() => setActiveNav(item)}
                />
              ))}
            </List>
          </LayoutPanel>
        )
      }
      content={
        <LayoutContent padding={6}>
          <VStack gap={4}>
            {/* Mobile: the sidebar nav collapses to a horizontal, centered
                tab bar above the content. */}
            {isNarrow && (
              <VStack hAlign="center">
                <TabList value={activeNav} onChange={setActiveNav}>
                  {NAV_ITEMS.slice(0, 3).map(item => (
                    <Tab key={item} value={item} label={item} />
                  ))}
                  <TabMenu
                    label="More"
                    options={NAV_ITEMS.slice(3).map(item => ({
                      value: item,
                      label: item,
                    }))}
                  />
                </TabList>
              </VStack>
            )}
            <Grid columns={{minWidth: 280}} gap={8}>
              <VStack gap={1}>
                <Heading level={2}>Basic information</Heading>
                <Text type="body" color="secondary">
                  View and update your crypt details and coven account information.
                </Text>
              </VStack>
              <VStack gap={4}>
                <TextInput
                  label="Username"
                  value={username}
                  onChange={setUsername}
                />
                <TextInput
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                />
                <TextInput
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                />
                <TextInput
                  label="Email address"
                  type="email"
                  {...inputAutoComplete('email')}
                  value={email}
                  onChange={setEmail}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>

            <Divider />

            <Grid columns={{minWidth: 280}} gap={8}>
              <VStack gap={1}>
                <Heading level={2}>Change password</Heading>
                <Text type="body" color="secondary">
                  Update your password to keep your coffin sealed.
                </Text>
              </VStack>
              <VStack gap={4}>
                <TextInput
                  label="Verify current password"
                  type="password"
                  {...inputAutoComplete('current-password')}
                  value={currentPw}
                  onChange={setCurrentPw}
                />
                <TextInput
                  label="New password"
                  type="password"
                  {...inputAutoComplete('new-password')}
                  value={newPw}
                  onChange={setNewPw}
                />
                <TextInput
                  label="Confirm password"
                  type="password"
                  {...inputAutoComplete('new-password')}
                  value={confirmPw}
                  onChange={setConfirmPw}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>

            <Divider />

            <Grid columns={{minWidth: 280}} gap={8}>
              <VStack gap={1}>
                <Heading level={2}>Advanced settings</Heading>
                <Text type="body" color="secondary">
                  Configure detailed coven preferences and warding options.
                </Text>
              </VStack>
              <VStack gap={4}>
                <CheckboxInput
                  label="Data Export Access"
                  description="Allow export of personal data and backups."
                  value={dataExport}
                  onChange={setDataExport}
                />
                <CheckboxInput
                  label="Allow Admin to Add Members"
                  description="Admins can invite and manage members."
                  value={adminMembers}
                  onChange={setAdminMembers}
                />
                <CheckboxInput
                  label="Enable Two-Factor Authentication"
                  description="Require 2FA for added account security."
                  value={twoFactor}
                  onChange={setTwoFactor}
                />
                <HStack>
                  <Button label="Save" variant="primary" />
                </HStack>
              </VStack>
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
