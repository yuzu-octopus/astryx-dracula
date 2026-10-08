// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=0] > H > (SI[fill] > ChL > ChML > (ChM > ChB)*4 + ChC"Ask a follow up...") + (C.transparent > Tbar + S.section > MD) ;; Dlg#artifact[variant=fullscreen] > L > (DH"JWT Token Refresh" + (LC[p=0] > S.section > MD))

import { Avatar } from "@astryxdesign/core/Avatar";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import {
	ChatComposer,
	ChatComposerInput,
	ChatLayout,
	ChatMessage,
	ChatMessageBubble,
	ChatMessageList,
	ChatMessageMetadata,
	ChatSystemMessage,
	ChatTokenizedText,
	ChatToolCalls,
} from "@astryxdesign/core/Chat";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, Layout, LayoutContent, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Markdown } from "@astryxdesign/core/Markdown";
import { MoreMenu } from "@astryxdesign/core/MoreMenu";
import { ResizeHandle, useResizable } from "@astryxdesign/core/Resizable";
import { Section } from "@astryxdesign/core/Section";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Timestamp } from "@astryxdesign/core/Timestamp";
import { Token } from "@astryxdesign/core/Token";
import { Toolbar } from "@astryxdesign/core/Toolbar";
import { VisuallyHidden } from "@astryxdesign/core/VisuallyHidden";
import { AtSign, ChevronRight, Copy, FileText, Paperclip, Share2, X } from "lucide-react";
import { type CSSProperties, useState } from "react";

// Below this container width the split-pane collapses to a single chat column
// and the artifact opens as a full-screen dialog instead. Single source:
// MOBILE_MAX_WIDTH feeds useMediaQuery below, which both gates the panel and
// routes openArtifact — no container query, no manual width read to drift.
// 1023 keeps tablet widths from squeezing the chat into a ~100px rail beside
// the 640px default artifact panel.
const MOBILE_MAX_WIDTH = 1023;
const root: CSSProperties = {
	// The viewer owns its chrome: the root fills the viewport and the message
	// list plus artifact body scroll inside it (editor pattern).
	height: "100dvh",
	width: "100%",
};
const chatColumn: CSSProperties = {
	flex: 1,
	width: "100%",
	minWidth: 0,
	height: "100%",
};
const chatLayout: CSSProperties = {
	flex: 1,
	minHeight: 0,
};
// ChatMessage already separates its children by --spacing-2, so this doubles
// that step to set the attached document apart from its bubble. --space-gap
// (24px) is a layout gutter, not an in-message rhythm.
const artifactCard: CSSProperties = {
	marginBlockStart: "var(--spacing-2)",
};
const artifactScroll: CSSProperties = {
	flex: 1,
	overflowY: "auto",
};
const articleBody: CSSProperties = {
	maxWidth: 720,
	marginInline: "auto",
};

// Width for the artifact panel. Plain style object — the panel unmounts below
// the breakpoint (see useMediaQuery in the component), so no container query
// or <style> tag is needed to hide it.
const artifactPanelWidthVar = (size: number | string): CSSProperties =>
	({
		width: typeof size === "number" ? `${size}px` : size,
		flexShrink: 0,
		overflow: "hidden",
	}) as CSSProperties;

// Artifact content

const MENTION_TOKENS = [{ value: "@agent", label: "@Agent", variant: "cyan" as const }];

const ARTIFACT_TITLE = "JWT Token Refresh: Design & Rollout";

const ARTIFACT_SUBTITLE = "Grimoire · Sealed just now";

const ARTIFACT_CONTENT = `## Overview

Our API gateway authenticates every request with a short-lived JWT access token. Until now, an expired token meant an immediate \`401\`, even when the user still held a valid refresh token. This document describes the silent-refresh flow we just shipped and how we're rolling it out.

## The Problem

Token validation ran **before** any refresh logic, so the middleware rejected expired tokens outright:

1. A request arrives with an expired access token
2. \`validateToken()\` throws \`TokenExpiredError\`
3. The catch block returns \`401\`: \`refreshToken()\` is never reached

The result was users getting logged out whenever an access token lapsed mid-session.

## The Fix

The middleware now catches \`TokenExpiredError\` specifically and attempts a silent refresh before rejecting. On success it reissues an access token and continues the request; on failure it falls back to \`401\`.

- **Transparent**: valid sessions never see an interruption
- **Safe**: a missing or invalid refresh token still returns \`401\`
- **Cheap**: refresh only runs on the expiry path, not on every request

## Testing

The refresh path is covered end to end:

| Scenario | Expected |
|----------|----------|
| Valid token passes through | \`200\` |
| Expired token, valid refresh | \`200\` + new access token |
| Expired token, invalid refresh | \`401\` |
| Malformed token | \`401\` |

## Rollout & Monitoring

1. Ship behind the \`silent_refresh\` flag at 5% of traffic
2. Watch the \`auth.refresh.success\` and \`auth.refresh.failure\` counters
3. Alert if the failure rate exceeds **2%** over any 5-minute window
4. Ramp to 100% once metrics hold steady for 24 hours`;

// Artifact subviews

// Copy/Share live in both surfaces: desktop toolbar buttons and the mobile
// overflow menu. One items array so the two can't drift.
const ARTIFACT_ACTION_ITEMS = [
	{ label: "Copy", icon: Copy },
	{ label: "Share", icon: Share2 },
] as const;

// Header actions: version menu, copy, share. Pass `onClose` for the desktop
// close button. A fragment so each control is a direct child of the toolbar.
function ArtifactActions({ onClose }: { onClose?: () => void }) {
	return (
		<>
			<DropdownMenu
				button={{
					label: "v2",
					variant: "ghost",
					size: "sm",
				}}
				items={[{ label: "v2 (current)" }, { label: "v1" }]}
			/>
			{ARTIFACT_ACTION_ITEMS.map((item) => (
				<Button
					key={item.label}
					label={item.label}
					variant="ghost"
					size="sm"
					icon={<Icon icon={item.icon} size="sm" />}
					isIconOnly
				/>
			))}
			{onClose != null && (
				<Button
					label="Close document"
					variant="ghost"
					size="sm"
					icon={<Icon icon={X} size="sm" />}
					isIconOnly
					onClick={onClose}
				/>
			)}
		</>
	);
}

// Mobile variant: the actions collapse into an overflow menu.
function MobileArtifactActions() {
	return (
		<MoreMenu
			label="Document actions"
			size="sm"
			items={[
				{
					type: "section",
					title: "Version",
					items: [{ label: "v2 (current)" }, { label: "v1" }],
				},
				{ type: "divider" },
				...ARTIFACT_ACTION_ITEMS,
			]}
		/>
	);
}

// Scrollable artifact content — the formatted document, no heading. The
// desktop panel renders ArtifactBody above it; the mobile dialog renders its
// title in DialogHeader instead, so both share this rather than a flag prop.
function ArtifactContent() {
	return <Markdown>{ARTIFACT_CONTENT}</Markdown>;
}
// Desktop body: in-body heading plus the shared content.
function ArtifactBody() {
	return (
		<Section
			variant="transparent"
			style={artifactScroll}
			role="region"
			aria-label={ARTIFACT_TITLE}
			tabIndex={0}
		>
			<VStack gap={2} style={articleBody}>
				<Heading level={2} type="display-2">
					{ARTIFACT_TITLE}
				</Heading>
				<ArtifactContent />
			</VStack>
		</Section>
	);
}

// In-message card that opens the artifact panel/dialog.
function ArtifactCard({ onOpen }: { onOpen: () => void }) {
	return (
		<ClickableCard
			label={`Open ${ARTIFACT_TITLE}`}
			onClick={onOpen}
			variant="muted"
			padding={3}
			maxWidth={360}
			style={artifactCard}
		>
			<HStack gap={3} vAlign="center" width="100%">
				<Icon icon={FileText} size="md" color="secondary" />
				<StackItem size="fill">
					<VStack gap={0}>
						<Text type="label" weight="semibold">
							{ARTIFACT_TITLE}
						</Text>
						<Text type="supporting" color="secondary">
							Grimoire
						</Text>
					</VStack>
				</StackItem>
				<Icon icon={ChevronRight} size="sm" color="secondary" />
			</HStack>
		</ClickableCard>
	);
}

// Main component

export default function AiChat() {
	const [composerMode, setComposerMode] = useState("ask");
	// Mobile shows the artifact as a full-screen dialog; desktop as a side panel.
	const [isArtifactDialogOpen, setIsArtifactDialogOpen] = useState(false);
	const [isArtifactOpen, setIsArtifactOpen] = useState(true);
	const artifactResize = useResizable({
		defaultSize: 640,
		minSize: 480,
		maxSize: 960,
		autoSaveId: "ai-chat-artifact-panel",
	});

	// Single source for the breakpoint: the media query both gates the panel
	// below and routes openArtifact, so the split-pane and the dialog target
	// can't disagree about which surface is live.
	const isMobileWidth = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
	const openArtifact = () => {
		if (isMobileWidth) {
			setIsArtifactDialogOpen(true);
		} else {
			setIsArtifactOpen(true);
		}
	};

	return (
		<VStack style={root}>
			<Layout
				height="fill"
				content={
					<LayoutContent padding={0}>
						<HStack height="100%">
							{/* Chat column — flexes to fill the space the artifact leaves */}
							<VStack style={chatColumn}>
								<ChatLayout
									density="spacious"
									style={chatLayout}
									composer={
										<ChatComposer
											onSubmit={() => {}}
											placeholder={
												composerMode === "ask"
													? "Ask the night anything..."
													: "Describe the rite..."
											}
											input={<ChatComposerInput />}
											headerActions={
												<>
													<Button
														label="Mention"
														variant="ghost"
														size="sm"
														icon={<Icon icon={AtSign} size="sm" />}
														isIconOnly
													/>
													<Button
														label="Attach"
														variant="ghost"
														size="sm"
														icon={<Icon icon={Paperclip} size="sm" />}
														isIconOnly
													/>
												</>
											}
											footerActions={
												<DropdownMenu
													button={{
														label: composerMode === "ask" ? "Ask" : "Edit",
														variant: "ghost",
														size: "sm",
													}}
													items={[
														{
															label: "Ask",
															onClick: () => setComposerMode("ask"),
														},
														{
															label: "Edit",
															onClick: () => setComposerMode("edit"),
														},
													]}
												/>
											}
										/>
									}
								>
									<VisuallyHidden as="h1">Night thread</VisuallyHidden>
									<ChatMessageList>
										{/* Date divider */}
										<ChatSystemMessage variant="divider">Today</ChatSystemMessage>

										{/* User message: mention + file attachments */}
										<ChatMessage sender="user">
											<HStack gap={1} wrap="wrap">
												<Token label="auth-service.ts" />
												<Token label="middleware.ts" />
											</HStack>
											<ChatMessageBubble
												metadata={
													<ChatMessageMetadata
														timestamp={<Timestamp value="2026-04-29T10:15:00" format="time" />}
													/>
												}
											>
												<ChatTokenizedText tokens={MENTION_TOKENS}>
													@agent Can you review these auth files? The JWT refresh logic seems
													broken, tokens expire but the middleware doesn't catch it.
												</ChatTokenizedText>
											</ChatMessageBubble>
										</ChatMessage>

										{/* Assistant message: tool calls, markdown, code block */}
										<ChatMessage sender="assistant" avatar={<Avatar name="Agent" size="md" />}>
											<ChatMessageBubble variant="ghost">
												Looking into the auth files now. Let me read through the code and trace the
												token refresh flow.
											</ChatMessageBubble>
											<ChatToolCalls
												defaultIsExpanded
												calls={[
													{
														name: "read",
														target: "auth-service.ts",
														status: "complete",
														duration: "45ms",
													},
													{
														name: "read",
														target: "middleware.ts",
														status: "complete",
														duration: "38ms",
													},
													{
														name: "bash",
														target: 'grep -rn "refreshToken" src/',
														status: "complete",
														duration: "120ms",
														node: "cli:remote-server",
													},
												]}
											/>

											<ChatMessageBubble variant="ghost">
												<Markdown density="compact">{`Found the issue. In \`middleware.ts\`, the token validation runs **before** the refresh check. When a token expires, the middleware rejects the request immediately instead of attempting a refresh.

Here's the problematic sequence:

1. Request arrives with an expired access token
2. \`validateToken()\` throws \`TokenExpiredError\`
3. The catch block returns \`401\`, never reaching \`refreshToken()\`

The fix is to catch \`TokenExpiredError\` specifically and attempt a refresh before rejecting:`}</Markdown>
											</ChatMessageBubble>

											<ChatMessageBubble variant="ghost">
												<CodeBlock
													title="middleware.ts"
													language="typescript"
													width="100%"
													code={`async function authMiddleware(req: Request) {
  try {
    const decoded = validateToken(req.headers.authorization);
    req.user = decoded;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Attempt silent refresh before rejecting
      const refreshed = await refreshToken(req.cookies.refreshToken);
      if (refreshed) {
        req.user = refreshed.user;
        req.newAccessToken = refreshed.accessToken;
        return next(req);
      }
    }
    return new Response('Unauthorized', { status: 401 });
  }
  return next(req);
}`}
												/>
											</ChatMessageBubble>

											<ChatToolCalls
												calls={[
													{
														name: "edit",
														target: "middleware.ts",
														status: "complete",
														duration: "85ms",
														additions: 8,
														deletions: 2,
													},
												]}
											/>

											<ChatMessageMetadata
												timestamp={<Timestamp value="2026-04-29T10:15:30" format="time" />}
												footer={
													<Text type="supporting" color="secondary">
														Agent
													</Text>
												}
											/>
										</ChatMessage>

										{/* User message: multi-bubble grouping */}
										<ChatMessage sender="user">
											<ChatMessageBubble group="first">
												Nice catch, that makes sense
											</ChatMessageBubble>
											<ChatMessageBubble
												group="last"
												metadata={
													<ChatMessageMetadata
														timestamp={<Timestamp value="2026-04-29T10:16:00" format="time" />}
														status="delivered"
													/>
												}
											>
												Can you also add a test for the refresh path?
											</ChatMessageBubble>
										</ChatMessage>

										{/* Assistant message: test results table + code block */}
										<ChatMessage sender="assistant" avatar={<Avatar name="Agent" size="md" />}>
											<ChatToolCalls
												defaultIsExpanded
												calls={[
													{
														name: "read",
														target: "middleware.test.ts",
														status: "complete",
														duration: "32ms",
													},
													{
														name: "edit",
														target: "middleware.test.ts",
														status: "complete",
														duration: "110ms",
														additions: 24,
														deletions: 0,
													},
													{
														name: "bash",
														target: "yarn test middleware",
														status: "complete",
														duration: "3.2s",
														node: "cli:remote-server",
													},
												]}
											/>
											<ChatMessageBubble variant="ghost">
												<Markdown density="compact">{`Added a test for the refresh flow. All **4 tests** pass:

| Test | Status |
|------|--------|
| Valid token passes through | ✅ |
| Expired token triggers refresh | ✅ |
| Expired token with invalid refresh returns 401 | ✅ |
| Malformed token returns 401 immediately | ✅ |`}</Markdown>
											</ChatMessageBubble>

											<ChatMessageBubble variant="ghost">
												<CodeBlock
													title="middleware.test.ts"
													language="typescript"
													width="100%"
													code={`describe('authMiddleware', () => {
  it('refreshes an expired token silently', async () => {
    const expiredToken = createExpiredJWT(mockUser);
    const validRefresh = createRefreshToken(mockUser);

    const req = mockRequest({
      authorization: \`Bearer \${expiredToken}\`,
      cookies: { refreshToken: validRefresh },
    });

    const res = await authMiddleware(req);

    expect(res.status).toBe(200);
    expect(req.user.id).toBe(mockUser.id);
    expect(req.newAccessToken).toBeDefined();
  });
});`}
												/>
											</ChatMessageBubble>
											<ChatMessageMetadata
												timestamp={<Timestamp value="2026-04-29T10:16:45" format="time" />}
											/>
										</ChatMessage>

										{/* Status message */}
										<ChatSystemMessage>Changes sealed in the crypt</ChatSystemMessage>

										{/* User message: requests a document artifact */}
										<ChatMessage sender="user">
											<ChatMessageBubble
												metadata={
													<ChatMessageMetadata
														timestamp={<Timestamp value="2026-04-29T10:18:00" format="time" />}
													/>
												}
											>
												Looks solid. Before I open the PR, can you write up a short design doc
												explaining the token-refresh flow for the team?
											</ChatMessageBubble>
										</ChatMessage>

										{/* Assistant message: artifact card */}
										<ChatMessage sender="assistant" avatar={<Avatar name="Agent" size="md" />}>
											<ChatMessageBubble variant="ghost">
												<Markdown density="compact">
													{`I've drafted a design doc covering the problem, the fix, and the test matrix, pulling straight from the changes we just made.\n\nOpen the document below to review it. Want me to expand any section?`}
												</Markdown>
											</ChatMessageBubble>
											<ArtifactCard onOpen={openArtifact} />
											<ChatMessageMetadata
												timestamp={<Timestamp value="2026-04-29T10:18:40" format="time" />}
											/>
										</ChatMessage>

										{/* User follow-up */}
										<ChatMessage sender="user">
											<ChatMessageBubble
												metadata={
													<ChatMessageMetadata
														timestamp={<Timestamp value="2026-04-29T10:20:00" format="time" />}
														status="delivered"
													/>
												}
											>
												This is great. Can you add a section on rollout and monitoring at the end?
											</ChatMessageBubble>
										</ChatMessage>

										{/* Assistant message: in-progress tool call */}
										<ChatMessage sender="assistant" avatar={<Avatar name="Agent" size="md" />}>
											<ChatMessageBubble variant="ghost">
												<Markdown density="compact">
													{`On it: adding a **Rollout & Monitoring** section with a staged flag ramp and the alert thresholds. Updating the document now.`}
												</Markdown>
											</ChatMessageBubble>
											<ChatToolCalls
												calls={[
													{
														name: "edit",
														target: "docs/token-refresh.md",
														status: "running",
														node: "cli:remote-server",
													},
												]}
											/>
											<ChatMessageMetadata
												timestamp={<Timestamp value="2026-04-29T10:20:30" format="time" />}
											/>
										</ChatMessage>
									</ChatMessageList>
								</ChatLayout>
							</VStack>

							{/* Desktop split-pane: resize handle + artifact panel. Gated on
                  the same media query that routes openArtifact, so shrinking
                  the window while open moves to the dialog instead of
                  squeezing the chat into a rail. */}
							{isArtifactOpen && !isMobileWidth && (
								<>
									<ResizeHandle
										direction="horizontal"
										resizable={artifactResize.props}
										isReversed
										pillPlacement="start"
										hasDivider
										label="Resize artifact panel"
									/>

									{/* Toolbar as the card header, body below */}
									<Card
										variant="transparent"
										height="100%"
										style={artifactPanelWidthVar(artifactResize.size)}
									>
										<Toolbar
											label="Artifact actions"
											dividers={["bottom"]}
											startContent={
												<HStack gap={3} vAlign="center">
													<Icon icon={FileText} size="sm" color="secondary" />
													<VStack gap={0}>
														<Text type="label" weight="semibold">
															{ARTIFACT_TITLE}
														</Text>
														<Text type="supporting" color="secondary">
															{ARTIFACT_SUBTITLE}
														</Text>
													</VStack>
												</HStack>
											}
											endContent={<ArtifactActions onClose={() => setIsArtifactOpen(false)} />}
										/>

										<ArtifactBody />
									</Card>
								</>
							)}
						</HStack>
					</LayoutContent>
				}
			/>
			{/* Mobile artifact view — full-screen Dialog */}
			<Dialog
				isOpen={isArtifactDialogOpen}
				onOpenChange={setIsArtifactDialogOpen}
				purpose="info"
				variant="fullscreen"
			>
				<Layout
					height="auto"
					header={
						<DialogHeader
							title={ARTIFACT_TITLE}
							subtitle={ARTIFACT_SUBTITLE}
							hasDivider
							onOpenChange={setIsArtifactDialogOpen}
							endContent={<MobileArtifactActions />}
						/>
					}
					content={
						<LayoutContent padding={0}>
							<Section
								variant="transparent"
								style={artifactScroll}
								role="region"
								aria-label={ARTIFACT_TITLE}
								tabIndex={0}
							>
								<VStack gap={2} style={articleBody}>
									<ArtifactContent />
								</VStack>
							</Section>
						</LayoutContent>
					}
				/>
			</Dialog>
		</VStack>
	);
}
