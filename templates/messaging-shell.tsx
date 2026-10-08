// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LP[w=68] > V > Av + (V > IB*4) + IB) + (LP[w=260] > V > (H > Hd"Messages"[level=1] + IB) + TI"Jump to…" + (V > Tx"Channels"[t=label] + (List > (ListItem)*4)) + (V > Tx"Direct messages"[t=label] + (List > (ListItem)*3))) + (LC[p=0] > V > (H > Hd"design-systems"[level=2] + SD + IB) + (ChL > ChML > (ChM > ChB)*6 + ChC)) + (LP[w=340] > V > (H > Tx"Thread"[weight=semibold] + IB) + (ChL > ChML > (ChM > ChB)*3 + ChC))

/**
 * Messaging Shell — Slack-style column frame for team messaging tools.  Frame (desktop, left to right): (Frame/responsive/container: see XLE header above.)
 */

import { Avatar, AvatarStatusDot } from "@astryxdesign/core/Avatar";
import { Badge } from "@astryxdesign/core/Badge";
import {
	ChatComposer,
	ChatLayout,
	ChatMessage,
	ChatMessageBubble,
	ChatMessageList,
	ChatMessageMetadata,
	ChatSystemMessage,
} from "@astryxdesign/core/Chat";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
	HStack,
	Layout,
	LayoutContent,
	LayoutPanel,
	Stack,
	StackItem,
	VStack,
} from "@astryxdesign/core/Layout";
import { List, ListItem } from "@astryxdesign/core/List";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Timestamp } from "@astryxdesign/core/Timestamp";
// ============= ICONS (verified lucide-react exports) =============
// Bell ← BellIcon, Bookmark ← BookmarkIcon, MessagesSquare ← ChatBubbleLeftRightIcon,
// Settings ← Cog6ToothIcon, Hash ← HashtagIcon, House ← HomeIcon, Inbox ← InboxIcon,
// Search ← MagnifyingGlassIcon, SquarePen ← PencilSquareIcon, Users ← UserGroupIcon,
// X ← XMarkIcon.
import {
	Bell,
	Bookmark,
	Hash,
	House,
	Inbox,
	MessagesSquare,
	Search,
	Settings,
	SquarePen,
	Users,
	X,
} from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------------
// Styles — semantic tokens only. Layout/Stack own their padding via props,
// so only surfaces Astryx has no prop for live here: dvh anchoring, scroll
// clipping with a ring budget, and the topic truncation floor.
// ---------------------------------------------------------------------------

// Fill the window: Layout height="fill" is height:100%, which only resolves
// against a definite height — the host's <html>/<body> don't set one.
const rootStyle: CSSProperties = { height: "100dvh", width: "100%" };
// Workspace rail: full height, centered, ring-safe vertical padding.
const railStyle: CSSProperties = {
	height: "100%",
	alignItems: "center",
	paddingTop: "var(--spacing-3)",
	paddingBottom: "var(--spacing-3)",
};
// Sidebar frame: full height, scrolls internally.
const sidebarStyle: CSSProperties = { height: "100%", minHeight: 0 };
const sidebarHeaderStyle: CSSProperties = {
	alignItems: "center",
	paddingInline: "var(--spacing-3)",
	paddingBlock: "var(--spacing-3)",
};
const sidebarSearchStyle: CSSProperties = {
	paddingInline: "var(--spacing-3)",
	paddingBottom: "var(--spacing-2)",
};
// Block-start only: the inline (8px) and bottom (12px) edges already clear.
// INLINE is a content gutter matching sidebarHeader/sidebarSearch (12px);
// BLOCK-START is a 4px ring budget (offset 2 + thickness 2). Not redundant.
const sidebarScrollStyle: CSSProperties = {
	minHeight: 0,
	overflowY: "auto",
	paddingInline: "var(--spacing-3)",
	paddingBlockStart: "var(--spacing-1)",
	paddingBottom: "var(--spacing-3)",
};
// DM section gap: List is the row container, so the gap rides on the second
// List's own margin instead of a wrapper element.
const sectionGapStyle: CSSProperties = { marginTop: "var(--spacing-4)" };
// Stream column: full height, scrolls internally.
const streamColumnStyle: CSSProperties = { height: "100%", minHeight: 0 };
const streamHeaderStyle: CSSProperties = {
	alignItems: "center",
	paddingInline: "var(--spacing-4)",
	paddingBlock: "var(--spacing-3)",
};
// Truncation floor: the topic StackItem must shrink before the header does.
const streamTopicStyle: CSSProperties = { minWidth: 0 };
const chatAreaStyle: CSSProperties = {
	minHeight: 0,
	display: "flex",
	flexDirection: "column",
};
const chatFillStyle: CSSProperties = { flex: 1, minHeight: 0 };
// Thread column: full height, scrolls internally.
const threadColumnStyle: CSSProperties = { height: "100%", minHeight: 0 };
const threadHeaderStyle: CSSProperties = {
	alignItems: "center",
	paddingInline: "var(--spacing-3)",
	paddingBlock: "var(--spacing-3)",
};
const threadScrollStyle: CSSProperties = {
	minHeight: 0,
	overflowY: "auto",
	paddingInline: "var(--spacing-3)",
	paddingBlock: "var(--spacing-3)",
};
const threadComposerStyle: CSSProperties = { padding: "var(--spacing-3)" };

// ---------------------------------------------------------------------------
// Deterministic fixtures — fixed ISO timestamps, stable ordering.
// ---------------------------------------------------------------------------

type Presence = "online" | "busy" | "offline";

interface User {
	name: string;
}

const USERS: Record<string, User> = {
	mira: { name: "Mira Chen" },
	devon: { name: "Devon Park" },
	sasha: { name: "Sasha Ortiz" },
	you: { name: "Riley Quinn" },
};

interface Channel {
	id: string;
	name: string;
	topic: string;
	unread: number;
}

const CHANNELS: Channel[] = [
	{
		id: "design-systems",
		name: "design-systems",
		topic: "Component APIs, tokens, and release coordination",
		unread: 0,
	},
	{
		id: "frontend-guild",
		name: "frontend-guild",
		topic: "Cross-team frontend practices",
		unread: 4,
	},
	{
		id: "releases",
		name: "releases",
		topic: "Release announcements and rollbacks",
		unread: 12,
	},
	{ id: "random", name: "random", topic: "Everything else", unread: 0 },
];

interface DirectMessage {
	id: string;
	userId: string;
	presence: Presence;
	unread: number;
}

const DIRECT_MESSAGES: DirectMessage[] = [
	{ id: "dm-mira", userId: "mira", presence: "online", unread: 0 },
	{ id: "dm-devon", userId: "devon", presence: "busy", unread: 2 },
	{ id: "dm-sasha", userId: "sasha", presence: "offline", unread: 0 },
];

// AvatarStatusDot supports success | neutral | error (no warning): busy stays
// error (do-not-disturb), never warning. One config — variant and label travel
// together, so the dot and its accessible name can't disagree.
const PRESENCE: Record<Presence, { variant: "success" | "error" | "neutral"; label: string }> = {
	online: { variant: "success", label: "Online" },
	busy: { variant: "error", label: "Busy" },
	offline: { variant: "neutral", label: "Offline" },
};

/** One bubble's copy. Ids key the bubble; its position only sets the grouping. */
interface StreamBubble {
	id: string;
	text: string;
}

/** One message group: consecutive bubbles from the same sender. */
interface StreamMessage {
	id: string;
	userId: string;
	time: string;
	bubbles: StreamBubble[];
}

const MESSAGES_BY_CHANNEL: Record<string, StreamMessage[]> = {
	"design-systems": [
		{
			id: "m1",
			userId: "mira",
			time: "2026-06-30T09:12:00",
			bubbles: [
				{
					id: "m1-1",
					text: "Morning! The Timestamp component now supports a `system_date` format, worth switching the audit log over.",
				},
				{
					id: "m1-2",
					text: "I put the migration notes in the wiki under Decisions.",
				},
			],
		},
		{
			id: "m2",
			userId: "devon",
			time: "2026-06-30T09:15:00",
			bubbles: [
				{
					id: "m2-1",
					text: "Nice. Does that unblock the incident console timeline work?",
				},
			],
		},
		{
			id: "m3",
			userId: "you",
			time: "2026-06-30T09:17:00",
			bubbles: [
				{
					id: "m3-1",
					text: "It does. I will pick that up after the template review.",
				},
				{
					id: "m3-2",
					text: "One question on the List density defaults, will start a thread.",
				},
			],
		},
		{
			id: "m4",
			userId: "sasha",
			time: "2026-06-30T09:24:00",
			bubbles: [
				{
					id: "m4-1",
					text: "Heads up: the token sync job ran clean overnight, no drift between core and the theme packages.",
				},
			],
		},
		{
			id: "m5",
			userId: "mira",
			time: "2026-06-30T09:26:00",
			bubbles: [{ id: "m5-1", text: "Great, closing out the drift task then." }],
		},
	],
	"frontend-guild": [
		{
			id: "g1",
			userId: "devon",
			time: "2026-06-30T08:40:00",
			bubbles: [
				{
					id: "g1-1",
					text: "Guild sync moved to Thursday this week to avoid the release freeze.",
				},
			],
		},
		{
			id: "g2",
			userId: "you",
			time: "2026-06-30T08:44:00",
			bubbles: [{ id: "g2-1", text: "Works for me, agenda doc is updated." }],
		},
	],
};

interface ThreadReply {
	id: string;
	userId: string;
	time: string;
	text: string;
}

// One map: the root plus its replies. [0] is the opener, the rest are replies —
// one lookup for the divider count and one slice for the reply list.
const THREAD: ThreadReply[] = [
	{
		id: "t0",
		userId: "you",
		time: "2026-06-30T09:17:30",
		text: "One question on the List density defaults: should channel sidebars use compact or balanced? The spec shows both.",
	},
	{
		id: "t1",
		userId: "mira",
		time: "2026-06-30T09:19:00",
		text: "Compact for navigation surfaces. Balanced is for content lists where descriptions carry weight.",
	},
	{
		id: "t2",
		userId: "devon",
		time: "2026-06-30T09:21:00",
		text: "Agreed, the sidebar rows here are a good reference implementation.",
	},
];

const RAIL_ITEMS = [
	{ id: "home", label: "Home", icon: House },
	{ id: "dms", label: "Direct messages", icon: MessagesSquare },
	{ id: "activity", label: "Activity", icon: Bell },
	{ id: "saved", label: "Saved items", icon: Bookmark },
];

// One thread message. The root carries the divider above the replies, so the
function ThreadMessage({ reply }: { reply: ThreadReply }) {
	return (
		<ChatMessage sender="assistant" avatar={<Avatar name={USERS[reply.userId].name} size="md" />}>
			<ChatMessageBubble
				name={USERS[reply.userId].name}
				metadata={
					<ChatMessageMetadata timestamp={<Timestamp value={reply.time} format="time" />} />
				}
			>
				{reply.text}
			</ChatMessageBubble>
		</ChatMessage>
	);
}

// One nav row factory for the sidebar lists. Search filtering stays at the
// call sites (visibleChannels/visibleDms); unread badges stay per-row. Only
// the ListItem shape is shared.
function NavRow({
	label,
	isSelected,
	onSelect,
	startContent,
	unread,
}: {
	label: string;
	isSelected: boolean;
	onSelect: () => void;
	startContent: ReactNode;
	unread: number;
}) {
	return (
		<ListItem
			label={label}
			isSelected={isSelected}
			onClick={onSelect}
			startContent={startContent}
			endContent={unread > 0 ? <Badge label={String(unread)} variant="neutral" /> : undefined}
		/>
	);
}
// ---------------------------------------------------------------------------
// Stream message group — avatar + name on the first bubble, timestamp on the
// last, `group` positions tighten corner radii between consecutive bubbles.
// ---------------------------------------------------------------------------

function StreamMessageGroup({ message }: { message: StreamMessage }) {
	const isSelf = message.userId === "you";
	const user = USERS[message.userId];
	const lastIndex = message.bubbles.length - 1;

	return (
		<ChatMessage
			sender={isSelf ? "user" : "assistant"}
			avatar={isSelf ? undefined : <Avatar name={user.name} size="md" />}
		>
			{message.bubbles.map((bubble, index) => (
				<ChatMessageBubble
					key={bubble.id}
					group={
						message.bubbles.length === 1
							? undefined
							: index === 0
								? "first"
								: index === lastIndex
									? "last"
									: "middle"
					}
					name={!isSelf && index === 0 ? user.name : undefined}
					metadata={
						index === lastIndex ? (
							<ChatMessageMetadata timestamp={<Timestamp value={message.time} format="time" />} />
						) : undefined
					}
				>
					{bubble.text}
				</ChatMessageBubble>
			))}
		</ChatMessage>
	);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MessagingShell() {
	const [selectedChannelId, setSelectedChannelId] = useState("design-systems");
	const [selectedDmId, setSelectedDmId] = useState<string | null>(null);
	const [isThreadOpen, setIsThreadOpen] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	// Responsive contract (see file header).
	const isThreadHidden = useMediaQuery("(max-width: 1024px)");
	const isSidebarHidden = useMediaQuery("(max-width: 768px)");

	const selectedChannel =
		CHANNELS.find((channel) => channel.id === selectedChannelId) ?? CHANNELS[0];
	const messages = MESSAGES_BY_CHANNEL[selectedChannel.id] ?? [];

	const normalizedQuery = searchQuery.trim().toLowerCase();
	const visibleChannels = CHANNELS.filter((channel) =>
		channel.name.toLowerCase().includes(normalizedQuery),
	);
	const visibleDms = DIRECT_MESSAGES.filter((dm) =>
		USERS[dm.userId].name.toLowerCase().includes(normalizedQuery),
	);

	const showThreadPanel = isThreadOpen && !isThreadHidden;

	const workspaceRail = (
		<VStack gap={2} style={railStyle}>
			<Avatar name="Night watch" size="md" />
			{RAIL_ITEMS.map((item) => (
				<IconButton
					key={item.id}
					label={item.label}
					tooltip={item.label}
					icon={<Icon icon={item.icon} size="sm" color="inherit" />}
					variant={item.id === "home" ? "secondary" : "ghost"}
					onClick={() => {}}
				/>
			))}
			<StackItem size="fill" />
			<IconButton
				label="Settings"
				tooltip="Settings"
				icon={<Icon icon={Settings} size="sm" color="inherit" />}
				variant="ghost"
				onClick={() => {}}
			/>
		</VStack>
	);

	const channelSidebar = (
		<Stack direction="vertical" style={sidebarStyle}>
			<HStack gap={2} style={sidebarHeaderStyle}>
				<StackItem size="fill">
					<Heading level={1}>Messages</Heading>
				</StackItem>
				<IconButton
					label="New message"
					tooltip="New message"
					icon={<Icon icon={SquarePen} size="sm" color="inherit" />}
					variant="ghost"
					size="sm"
					onClick={() => {}}
				/>
			</HStack>
			<VStack gap={0} style={sidebarSearchStyle}>
				<TextInput
					label="Jump to"
					isLabelHidden
					size="sm"
					placeholder="Jump to…"
					startIcon={Search}
					value={searchQuery}
					onChange={setSearchQuery}
				/>
			</VStack>
			<StackItem
				size="fill"
				style={sidebarScrollStyle}
				role="region"
				aria-label="Channels and direct messages"
				tabIndex={0}
			>
				<List
					density="compact"
					hasDividers={false}
					header={
						<Text type="label" size="sm" color="secondary">
							Channels
						</Text>
					}
				>
					{visibleChannels.map((channel) => (
						<NavRow
							key={channel.id}
							label={channel.name}
							isSelected={selectedDmId === null && channel.id === selectedChannelId}
							onSelect={() => {
								setSelectedChannelId(channel.id);
								setSelectedDmId(null);
							}}
							startContent={<Icon icon={Hash} size="sm" color="secondary" />}
							unread={channel.unread}
						/>
					))}
				</List>
				{/* The section gap rides on this List's own margin: List is the row
            container, so no wrapper element is needed. */}
				<List
					density="compact"
					hasDividers={false}
					style={sectionGapStyle}
					header={
						<Text type="label" size="sm" color="secondary">
							Direct messages
						</Text>
					}
				>
					{visibleDms.map((dm) => (
						<NavRow
							key={dm.id}
							label={USERS[dm.userId].name}
							isSelected={selectedDmId === dm.id}
							onSelect={() => setSelectedDmId(dm.id)}
							startContent={
								<Avatar
									name={USERS[dm.userId].name}
									size="sm"
									status={
										<AvatarStatusDot
											variant={PRESENCE[dm.presence].variant}
											label={PRESENCE[dm.presence].label}
										/>
									}
								/>
							}
							unread={dm.unread}
						/>
					))}
				</List>
			</StackItem>
		</Stack>
	);

	const messageStream = (
		<Stack direction="vertical" style={streamColumnStyle}>
			<HStack gap={3} style={streamHeaderStyle}>
				<Icon icon={Hash} size="sm" color="secondary" />
				<Heading level={2}>{selectedChannel.name}</Heading>
				<StackItem size="fill" style={streamTopicStyle}>
					<Text type="body" color="secondary" maxLines={1}>
						{selectedChannel.topic}
					</Text>
				</StackItem>
				<StatusDot variant="success" label="12 online" />
				<IconButton
					label="Members"
					tooltip="Members"
					icon={<Icon icon={Users} size="sm" color="inherit" />}
					variant="ghost"
					size="sm"
					onClick={() => {}}
				/>
			</HStack>
			<Divider />
			<StackItem size="fill" style={chatAreaStyle}>
				<ChatLayout
					style={chatFillStyle}
					composer={
						<ChatComposer placeholder={`Message #${selectedChannel.name}`} onSubmit={() => {}} />
					}
					emptyState={
						<EmptyState
							icon={<Icon icon={Inbox} size="lg" color="secondary" />}
							title="No messages yet"
							description="Start the conversation. Messages posted here are visible to the whole channel."
						/>
					}
				>
					{messages.length > 0 ? (
						<ChatMessageList density="balanced">
							<ChatSystemMessage variant="divider">Tuesday, June 30</ChatSystemMessage>
							<ChatSystemMessage>Sasha Ortiz joined #{selectedChannel.name}</ChatSystemMessage>
							{messages.map((message) => (
								<StreamMessageGroup key={message.id} message={message} />
							))}
						</ChatMessageList>
					) : null}
				</ChatLayout>
			</StackItem>
		</Stack>
	);

	const threadPanel = (
		<Stack direction="vertical" style={threadColumnStyle}>
			<HStack gap={2} style={threadHeaderStyle}>
				<StackItem size="fill">
					<HStack gap={2} style={{ alignItems: "baseline" }}>
						<Text weight="semibold">Thread</Text>
						<Text type="supporting" color="secondary">
							#{selectedChannel.name}
						</Text>
					</HStack>
				</StackItem>
				<IconButton
					label="Close thread"
					tooltip="Close thread"
					icon={<Icon icon={X} size="sm" color="inherit" />}
					variant="ghost"
					size="sm"
					onClick={() => setIsThreadOpen(false)}
				/>
			</HStack>
			<Divider />
			<StackItem
				size="fill"
				style={threadScrollStyle}
				role="region"
				aria-label="Thread messages"
				tabIndex={0}
			>
				<ChatMessageList density="compact">
					<ThreadMessage reply={THREAD[0]} />
					<ChatSystemMessage variant="divider">{THREAD.length - 1} replies</ChatSystemMessage>
					{THREAD.slice(1).map((reply) => (
						<ThreadMessage key={reply.id} reply={reply} />
					))}
				</ChatMessageList>
			</StackItem>
			<VStack gap={0} style={threadComposerStyle}>
				<ChatComposer density="compact" placeholder="Reply in thread…" onSubmit={() => {}} />
			</VStack>
		</Stack>
	);

	return (
		<Layout
			height="fill"
			style={rootStyle}
			start={
				<>
					<LayoutPanel width={68} padding={0}>
						{workspaceRail}
					</LayoutPanel>
					{!isSidebarHidden && (
						<LayoutPanel width={260} padding={0}>
							{channelSidebar}
						</LayoutPanel>
					)}
				</>
			}
			end={
				showThreadPanel ? (
					<LayoutPanel width={340} padding={0}>
						{threadPanel}
					</LayoutPanel>
				) : undefined
			}
			content={<LayoutContent padding={0}>{messageStream}</LayoutContent>}
		/>
	);
}
