// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @sideNav=(SN > SNI"New chat" + SNI"Search" + SNI"Library" + D + (SNI"Personal" > SNI"Weekend trip planning")*3)] > L > (LC[p=6] > V[g=5] > (H > C.muted[p=0])*4) + (LF > TI"Message Night Owl")

import {useState} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Divider} from '@astryxdesign/core/Divider';
import {Layout, LayoutContent, LayoutFooter} from '@astryxdesign/core/Layout';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Icon} from '@astryxdesign/core/Icon';
import type {IconType} from '@astryxdesign/core/Icon';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import type {StatusDotVariant} from '@astryxdesign/core/StatusDot';
import {Card} from '@astryxdesign/core/Card';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack, HStack} from '@astryxdesign/core/Stack';
import {
  Sparkles,
  Plus,
  Search,
  BookOpen,
  Settings,
  CircleUserRound,
  User,
  Building2,
  CodeXml,
} from 'lucide-react';

type Conversation = {
  label: string;
  status: StatusDotVariant;
  statusLabel: string;
};

type Workspace = {
  name: string;
  icon: IconType;
  chats: Conversation[];
};

const WORKSPACES: Workspace[] = [
  {
    name: 'Personal',
    icon: User,
    chats: [
      {
        label: 'Weekend trip planning',
        status: 'success',
        statusLabel: 'Active',
      },
      {
        label: 'Recipe ideas for the week',
        status: 'neutral',
        statusLabel: 'Idle',
      },
      {
        label: 'Book recommendations',
        status: 'warning',
        statusLabel: 'Needs review',
      },
      {label: 'Home workout plan', status: 'neutral', statusLabel: 'Idle'},
    ],
  },
  {
    name: 'Acme Corp',
    icon: Building2,
    chats: [
      {label: 'Q3 roadmap draft', status: 'accent', statusLabel: 'In progress'},
      {
        label: 'Customer onboarding flow',
        status: 'success',
        statusLabel: 'Active',
      },
      {
        label: 'Pricing strategy review',
        status: 'warning',
        statusLabel: 'Needs review',
      },
      {label: 'Standup summary', status: 'neutral', statusLabel: 'Idle'},
    ],
  },
  {
    name: 'Open Source',
    icon: CodeXml,
    chats: [
      {
        label: 'StyleX migration notes',
        status: 'accent',
        statusLabel: 'In progress',
      },
      {
        label: 'Skeleton loading states',
        status: 'success',
        statusLabel: 'Active',
      },
      {label: 'Accessibility audit', status: 'error', statusLabel: 'Blocked'},
      {label: 'Release notes v4.0', status: 'neutral', statusLabel: 'Idle'},
    ],
  },
];

const SELECTED_CHAT = 'StyleX migration notes';
// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = '#/templates/shell-side-nav';

const MESSAGES = [
  {role: 'assistant', width: '78%', height: 104},
  {role: 'user', width: '48%', height: 48},
  {role: 'assistant', width: '64%', height: 132},
  {role: 'user', width: '38%', height: 40},
];

function ConversationItem({
  label,
  status,
  statusLabel,
  isSelected,
  onSelect,
}: {
  label: string;
  status: StatusDotVariant;
  statusLabel: string;
  isSelected?: boolean;
  onSelect: () => void;
}) {
  // The hover-only MoreMenu was four dead actions unreachable by keyboard and
  // touch, so it goes: the status dot is always visible (its label doubles as
  // the tooltip), and selecting a conversation actually switches selection.
  return (
    <SideNavItem
      label={label}
      href={SELF_HASH}
      isSelected={isSelected}
      onClick={onSelect}
      endContent={<StatusDot variant={status} label={statusLabel} />}
    />
  );
}

export default function ShellSideNav() {
  const [selectedChat, setSelectedChat] = useState(SELECTED_CHAT);
  const [draft, setDraft] = useState('');
  return (
    <AppShell
      contentPadding={0}
      sideNav={
        <SideNav
          collapsible
          resizable={{defaultWidth: 300, minWidth: 220, maxWidth: 420}}
          header={
            <SideNavHeading
              heading="Night Owl"
              icon={<NavIcon icon={<Icon icon={Sparkles} size="sm" />} />}
              headingHref={SELF_HASH}
            />
          }
          footer={
            <SideNavSection title="Account" isHeaderHidden>
              <SideNavItem label="Settings" icon={Settings} href={SELF_HASH} />
              <SideNavItem
                label="Sarah Chen"
                icon={CircleUserRound}
                href={SELF_HASH}
              />
            </SideNavSection>
          }>
          <SideNavSection title="Menu" isHeaderHidden>
            <SideNavItem label="New chat" icon={Plus} href={SELF_HASH} />
            <SideNavItem label="Search" icon={Search} href={SELF_HASH} />
            <SideNavItem label="Library" icon={BookOpen} href={SELF_HASH} />
          </SideNavSection>
          <Divider />
          <SideNavSection title="Workspaces" isHeaderHidden>
            {WORKSPACES.map(workspace => (
              <SideNavItem
                key={workspace.name}
                label={workspace.name}
                icon={workspace.icon}
                collapsible={{defaultIsCollapsed: false}}>
                <VStack gap={0.5}>
                  {workspace.chats.map(chat => (
                    <ConversationItem
                      key={chat.label}
                      label={chat.label}
                      status={chat.status}
                      statusLabel={chat.statusLabel}
                      isSelected={chat.label === selectedChat}
                      onSelect={() => setSelectedChat(chat.label)}
                    />
                  ))}
                </VStack>
              </SideNavItem>
            ))}
          </SideNavSection>
        </SideNav>
      }>
      <Layout
        height="fill"
        contentWidth={768}
        content={
          <LayoutContent padding={6}>
            <VStack gap={5}>
              {MESSAGES.map((message, mi) => (
                <HStack
                  key={mi}
                  hAlign={message.role === 'assistant' ? 'start' : 'end'}>
                  <Card
                    variant="muted"
                    padding={0}
                    width={message.width}
                    height={message.height}
                  />
                </HStack>
              ))}
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <TextInput
              label="Message Night Owl"
              isLabelHidden
              placeholder="Message Night Owl…"
              value={draft}
              onChange={setDraft}
              width="100%"
            />
          </LayoutFooter>
        }
      />
    </AppShell>
  );
}
