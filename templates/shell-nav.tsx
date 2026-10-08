// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @topNav=(TN) @sideNav=(SN > TL)] > L > (LH[divider] > H[g=2 wrap] > C.muted[p=0]*3) + (LC[p=6] > V[g=2] > (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*3 + C.muted[p=0] + (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*4 + C.muted[p=0] + (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*5)
// Note: skeleton placeholders carry no Hd by design (skill skeleton-shell
// exemption) — routed pages supply the h1.

import { AppShell } from "@astryxdesign/core/AppShell";
import { Button } from "@astryxdesign/core/Button";
import { CommandPalette } from "@astryxdesign/core/CommandPalette";
import { Divider } from "@astryxdesign/core/Divider";
import { DropdownMenu, DropdownMenuItem } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { Kbd } from "@astryxdesign/core/Kbd";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { SideNav } from "@astryxdesign/core/SideNav";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TopNav } from "@astryxdesign/core/TopNav";
import type { TreeListItemData } from "@astryxdesign/core/TreeList";
import { TreeList } from "@astryxdesign/core/TreeList";
import { createStaticSource } from "@astryxdesign/core/Typeahead";
import { FileText, Folder, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

const folder = (id: string, children: TreeListItemData[], isExpanded = true): TreeListItemData => ({
	id,
	label: <Text maxLines={1}>{id}</Text>,
	startContent: <Icon icon={Folder} size="xsm" />,
	isExpanded,
	children,
});

const file = (id: string, isSelected = false): TreeListItemData => ({
	id,
	label: <Text maxLines={1}>{id}</Text>,
	startContent: <Icon icon={FileText} size="xsm" />,
	isSelected,
});

// Five nodes: one expanded folder per level plus leaf files. The factories
// keep the TreeListItemData shape (id/label/icon/expansion) in one place.
const FILE_TREE: TreeListItemData[] = [
	folder("src", [
		folder("components", [file("AppShell.tsx", true), file("TopNav.tsx")]),
		file("index.tsx"),
	]),
	file("package.json"),
];

// Each menu is split into groups; groups are separated by a divider.
// `[label, shortcut]` — the shortcut renders as a single combined Kbd
// (e.g. ⌘N); an empty shortcut renders no Kbd.
type MenuEntry = [label: string, shortcut: string];

// Wide enough that label + Kbd shortcut never clip at the menu edge —
// "Previous Tab ⌃⇧⇥" is the widest row and touched the border at 280.
const MENU_WIDTH = 300;

const MENUS: { label: string; groups: MenuEntry[][] }[] = [
	{
		label: "File",
		groups: [
			[
				["New File", "⌘N"],
				["New Window", "⇧⌘N"],
			],
			[
				["Open…", "⌘O"],
				["Save", "⌘S"],
				["Save As…", "⇧⌘S"],
			],
			[["Close Editor", "⌘W"]],
		],
	},
	{
		label: "Edit",
		groups: [
			[
				["Undo", "⌘Z"],
				["Redo", "⇧⌘Z"],
			],
			[
				["Cut", "⌘X"],
				["Copy", "⌘C"],
				["Paste", "⌘V"],
			],
			[["Find", "⌘F"]],
		],
	},
	{
		label: "View",
		groups: [
			[["Command Palette", "⇧⌘P"]],
			[
				["Explorer", "⇧⌘E"],
				["Search", "⇧⌘F"],
			],
			[
				["Toggle Terminal", "⌃`"],
				["Zen Mode", "⌘K"],
			],
		],
	},
	{
		label: "Window",
		groups: [
			[
				["Minimize", "⌘M"],
				["Zoom", ""],
			],
			[
				["Next Tab", "⌃⇥"],
				["Previous Tab", "⌃⇧⇥"],
			],
			[["Bring All to Front", ""]],
		],
	},
	{
		label: "Help",
		groups: [
			[
				["Documentation", ""],
				["Release Notes", ""],
				["Report Issue", ""],
				["About", ""],
			],
		],
	},
];

// Five placeholder rows: three code lines plus two 1px blank-line rules.
const CODE_LINES = [
	{ id: "line-1", width: "38%" },
	{ id: "line-2", width: "62%" },
	{ id: "line-3", width: "0%" },
	{ id: "line-4", width: "46%" },
	{ id: "line-5", width: "0%" },
];

const EDITOR_TABS = ["AppShell.tsx", "TopNav.tsx"];

// Six entries: three file results plus three commands, so the palette shows
// both halves of its static source.
const COMMANDS = [
	{ id: "new-file", label: "New File" },
	{ id: "save-all", label: "Save All" },
	{ id: "toggle-terminal", label: "Toggle Terminal" },
	{ id: "appshell", label: "AppShell.tsx" },
	{ id: "topnav", label: "TopNav.tsx" },
	{ id: "sidenav", label: "SideNav.tsx" },
];

export default function ShellNav() {
	const [isPaletteOpen, setIsPaletteOpen] = useState(false);
	const searchSource = useMemo(() => createStaticSource(COMMANDS), []);

	return (
		<>
			<AppShell
				contentPadding={0}
				topNav={
					<TopNav
						label="Dracula Studio menu bar"
						startContent={
							<>
								{MENUS.map((menu) => (
									<DropdownMenu
										key={menu.label}
										button={{ label: menu.label, variant: "ghost", size: "sm" }}
										hasChevron={false}
										menuWidth={MENU_WIDTH}
									>
										{/* Keyed by the group's first label, not its position:
                        an index key remounts every group when the menu
                        data shifts. `gi` only decides the divider. */}
										{menu.groups.map((group, gi) => (
											<Fragment key={group[0][0]}>
												{gi > 0 && <Divider />}
												{group.map(([label, shortcut]) => (
													<DropdownMenuItem
														key={label}
														label={label}
														endContent={shortcut ? <Kbd keys={shortcut} /> : undefined}
													/>
												))}
											</Fragment>
										))}
									</DropdownMenu>
								))}
							</>
						}
						endContent={
							// A real palette trigger, not a lookalike field: the previous
							// TextInput swallowed keystrokes while a wrapper div opened the
							// palette on click. The dead Run and Share buttons go with it —
							// demo chrome must not ship controls that do nothing.
							<Button
								label="Search files and commands"
								variant="secondary"
								size="sm"
								tooltip="Search files and commands (⌘K)"
								icon={<Icon icon={Search} size="sm" />}
								onClick={() => setIsPaletteOpen(true)}
							/>
						}
					/>
				}
				sideNav={
					<SideNav resizable={{ defaultWidth: 240, minWidth: 180, maxWidth: 400 }}>
						<TreeList items={FILE_TREE} density="compact" />
					</SideNav>
				}
			>
				<Layout
					height="fill"
					header={
						<LayoutHeader hasDivider padding={6}>
							{/* Wraps rather than clipping: two 132px tabs need ~280px. */}
							<HStack gap={2} wrap="wrap">
								{EDITOR_TABS.map((tab) => (
									<Skeleton key={tab} width={132} height={36} />
								))}
							</HStack>
						</LayoutHeader>
					}
					content={
						<LayoutContent padding={6}>
							{/* Skeleton chrome only — the open file supplies the h1. */}
							<VStack gap={2}>
								{CODE_LINES.map((line) =>
									line.width === "0%" ? (
										<Skeleton key={line.id} width={1} height={14} />
									) : (
										<HStack key={line.id} gap={3} vAlign="center">
											<Skeleton width={20} height={14} />
											<Skeleton width={line.width} height={14} />
										</HStack>
									),
								)}
							</VStack>
						</LayoutContent>
					}
				/>
			</AppShell>
			<CommandPalette
				isOpen={isPaletteOpen}
				onOpenChange={setIsPaletteOpen}
				searchSource={searchSource}
				label="Search files and commands"
				onValueChange={() => setIsPaletteOpen(false)}
			/>
		</>
	);
}
