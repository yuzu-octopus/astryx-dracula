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
 *
 * Seam rule: nav/content whitespace pairs use hasDivider=false (LayoutPanel
 * beside LayoutContent); dialog chrome and inset panels keep their divider.
 */

import { Button } from "@astryxdesign/core/Button";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import {
	HStack,
	Layout,
	LayoutContent,
	LayoutHeader,
	LayoutPanel,
	StackItem,
	VStack,
} from "@astryxdesign/core/Layout";
import { List, ListItem } from "@astryxdesign/core/List";
import { Tab, TabList, TabMenu } from "@astryxdesign/core/TabList";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import type { SearchableItem, SearchSource } from "@astryxdesign/core/Typeahead";
import { Typeahead } from "@astryxdesign/core/Typeahead";
import { inputAutoComplete } from "astryx-dracula/shared/auth-chrome-config";
import { Search } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = ["Profile", "Account", "Members", "Billing", "Invoices", "API"];

const SETTINGS_ITEMS: SearchableItem[] = [
	{ id: "1", label: "Username" },
	{ id: "2", label: "First name" },
	{ id: "3", label: "Last name" },
	{ id: "4", label: "Email address" },
	{ id: "5", label: "Change password" },
	{ id: "6", label: "Data Export Access" },
	{ id: "7", label: "Allow Admin to Add Members" },
	{ id: "8", label: "Two-Factor Authentication" },
];

const settingsSearchSource: SearchSource<SearchableItem> = {
	search: (query: string) =>
		SETTINGS_ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
	bootstrap: () => SETTINGS_ITEMS,
};

// One entry per section grid below: the heading + lede in the left column and
// the fields in the right column. Text and check fields share one row shape;
// the renderer switches on `kind`.
type SettingsTextKey =
	| "username"
	| "firstName"
	| "lastName"
	| "email"
	| "currentPw"
	| "newPw"
	| "confirmPw";
type SettingsCheckKey = "dataExport" | "adminMembers" | "twoFactor";
type SettingsField =
	| {
			key: string;
			kind: "text";
			label: string;
			inputType?: "email" | "password";
			autoComplete?: string;
			valueKey: SettingsTextKey;
	  }
	| {
			key: string;
			kind: "check";
			label: string;
			description: string;
			valueKey: SettingsCheckKey;
	  };
type SettingsSectionData = {
	key: string;
	heading: string;
	body: string;
	fields: SettingsField[];
};

const SECTIONS: SettingsSectionData[] = [
	{
		key: "basic",
		heading: "Basic information",
		body: "View and update your crypt details and coven account information.",
		fields: [
			{ key: "username", kind: "text", label: "Username", valueKey: "username" },
			{
				key: "first-name",
				kind: "text",
				label: "First name",
				valueKey: "firstName",
			},
			{ key: "last-name", kind: "text", label: "Last name", valueKey: "lastName" },
			{
				key: "email",
				kind: "text",
				label: "Email address",
				inputType: "email",
				autoComplete: "email",
				valueKey: "email",
			},
		],
	},
	{
		key: "password",
		heading: "Change password",
		body: "Update your password to keep your coffin sealed.",
		fields: [
			{
				key: "current-pw",
				kind: "text",
				label: "Verify current password",
				inputType: "password",
				autoComplete: "current-password",
				valueKey: "currentPw",
			},
			{
				key: "new-pw",
				kind: "text",
				label: "New password",
				inputType: "password",
				autoComplete: "new-password",
				valueKey: "newPw",
			},
			{
				key: "confirm-pw",
				kind: "text",
				label: "Confirm password",
				inputType: "password",
				autoComplete: "new-password",
				valueKey: "confirmPw",
			},
		],
	},
	{
		key: "advanced",
		heading: "Advanced settings",
		body: "Configure detailed coven preferences and warding options.",
		fields: [
			{
				key: "data-export",
				kind: "check",
				label: "Data Export Access",
				description: "Allow export of personal data and backups.",
				valueKey: "dataExport",
			},
			{
				key: "admin-members",
				kind: "check",
				label: "Allow Admin to Add Members",
				description: "Admins can invite and manage members.",
				valueKey: "adminMembers",
			},
			{
				key: "two-factor",
				kind: "check",
				label: "Enable Two-Factor Authentication",
				description: "Require 2FA for added account security.",
				valueKey: "twoFactor",
			},
		],
	},
];

function SettingsSection({
	section,
	textValues,
	onTextChange,
	checkValues,
	onCheckChange,
	isLast,
}: {
	section: SettingsSectionData;
	textValues: Record<SettingsTextKey, string>;
	onTextChange: (key: SettingsTextKey, value: string) => void;
	checkValues: Record<SettingsCheckKey, boolean>;
	onCheckChange: (key: SettingsCheckKey, value: boolean) => void;
	isLast: boolean;
}) {
	return (
		<>
			<Grid columns={{ minWidth: 280 }} gap={8}>
				<VStack gap={1}>
					<Heading level={2}>{section.heading}</Heading>
					<Text type="body" color="secondary">
						{section.body}
					</Text>
				</VStack>
				<VStack gap={4}>
					{section.fields.map((field) =>
						field.kind === "check" ? (
							<CheckboxInput
								key={field.key}
								label={field.label}
								description={field.description}
								value={checkValues[field.valueKey]}
								onChange={(value) => onCheckChange(field.valueKey, value)}
							/>
						) : (
							<TextInput
								key={field.key}
								label={field.label}
								type={field.inputType}
								{...(field.autoComplete ? inputAutoComplete(field.autoComplete) : {})}
								value={textValues[field.valueKey]}
								onChange={(value) => onTextChange(field.valueKey, value)}
							/>
						),
					)}
					<HStack>
						<Button label="Save" variant="primary" />
					</HStack>
				</VStack>
			</Grid>
			{!isLast && <Divider />}
		</>
	);
}

export default function SettingsTemplate() {
	const isNarrow = useMediaQuery("(max-width: 768px)");
	const [activeNav, setActiveNav] = useState("Profile");
	const [textValues, setTextValues] = useState<Record<SettingsTextKey, string>>({
		username: "vlad_tepes",
		firstName: "Vlad",
		lastName: "Tepes",
		email: "vlad_tepes@castle-dracula.ro",
		currentPw: "password123",
		newPw: "password123",
		confirmPw: "password123",
	});
	const [checkValues, setCheckValues] = useState<Record<SettingsCheckKey, boolean>>({
		dataExport: false,
		adminMembers: false,
		twoFactor: false,
	});
	const [searchValue, setSearchValue] = useState<SearchableItem | null>(null);

	return (
		<Layout
			height="fill"
			contentWidth={1200}
			header={
				<LayoutHeader hasDivider padding={6}>
					<HStack vAlign="center" wrap="wrap">
						<StackItem size="fill">
							<Heading level={1} type="display-2">
								Settings
							</Heading>
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
							{NAV_ITEMS.map((item) => (
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
									{NAV_ITEMS.slice(0, 3).map((item) => (
										<Tab key={item} value={item} label={item} />
									))}
									<TabMenu
										label="More"
										options={NAV_ITEMS.slice(3).map((item) => ({
											value: item,
											label: item,
										}))}
									/>
								</TabList>
							</VStack>
						)}
						{SECTIONS.map((section, index) => (
							<SettingsSection
								key={section.key}
								section={section}
								textValues={textValues}
								onTextChange={(fieldKey, value) =>
									setTextValues((prev) => ({ ...prev, [fieldKey]: value }))
								}
								checkValues={checkValues}
								onCheckChange={(fieldKey, value) =>
									setCheckValues((prev) => ({ ...prev, [fieldKey]: value }))
								}
								isLast={index === SECTIONS.length - 1}
							/>
						))}
					</VStack>
				</LayoutContent>
			}
		/>
	);
}
