// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LP[p=0] > V[g=4] > Tx"Account settings"[t=label] + (UL > LI*8) + D + LI"Professional hosting tools") + (LC[p=6] > V[g=0] > (Tbar > B.ghost + Hd"Personal info"[level=1]) + Hd"Personal info"[level=1] + (V[g=0] > (H[j=between a=start] > (V[g=1] > Tx"Legal name"[weight=semibold] + Tx"Vlad Dracul"[t=supporting]) + B.secondary"Edit")*7) + (C.muted > V[g=4] > (H[g=3 a=start] > Ic + (V[g=1] > Tx"Why is info hidden?"[weight=semibold] + Tx[t=supporting]))*3))

/**
 * Settings Panels — account sections with a nav panel and spaced rows.  Frame: Layout nav panel (fill) | content column of section views. One (Frame/responsive/container: see XLE header above.)
 */

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Divider } from "@astryxdesign/core/Divider";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Icon } from "@astryxdesign/core/Icon";
import {
	HStack,
	Layout,
	LayoutContent,
	LayoutPanel,
	StackItem,
	VStack,
} from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { List, ListItem } from "@astryxdesign/core/List";
import { Selector } from "@astryxdesign/core/Selector";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Switch } from "@astryxdesign/core/Switch";
import { Tab, TabList } from "@astryxdesign/core/TabList";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Toolbar } from "@astryxdesign/core/Toolbar";
import type { InfoRow } from "astryx-dracula/shared/settings-data";
import {
	actionNoWrap,
	CURRENCIES,
	DEVICE_ROWS,
	INFO_TILES,
	iconBox,
	LANGUAGES,
	LOGIN_ROWS,
	NAV_ITEMS,
	SOCIAL_ROWS,
	sideNavHeading,
	TIMEZONES,
} from "astryx-dracula/shared/settings-data";
import { ExpandableRow, InfoRowItem } from "astryx-dracula/shared/settings-rows";
import { ArrowLeft, ChevronRight, Lock, Monitor, ShieldCheck, Wrench } from "lucide-react";
import { type CSSProperties, useState } from "react";

// Anchor the page to the viewport height so the sidebar + content fill the
// screen. Layout height="fill" is min-height:100% which collapses when the
// host container is content-sized; Layout has no viewport-height prop.
const fillViewport: CSSProperties = {
	minHeight: "100dvh",
};
const rowPadding: CSSProperties = {
	paddingBlock: "var(--spacing-4)",
};

// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = "#/templates/settings-sidebar";

// Title beside the mobile back button: the section's own heading, except the
// long "Professional hosting tools" which shortens to "Hosting tools".
const HOSTING_TOOLS_TITLE = "Professional hosting tools";

// Both record sections pair a setup row ("Add") with a history row that
// navigates to past records — one factory, not two copied arrays.
function recordRows(
	currentLabel: string,
	currentValue: string,
	pastLabel: string,
	pastValue: string,
): InfoRow[] {
	return [
		{ label: currentLabel, value: currentValue, action: "Add" },
		{
			label: pastLabel,
			value: pastValue,
			action: "View",
			actionKind: "destination",
			href: SELF_HASH,
		},
	];
}

const TAX_ROWS = recordRows("Tax scrolls", "Not provided", "Past scrolls", "No scrolls yet");

const PAYOUT_ROWS = recordRows("Payout crypt", "Not set up", "Past payouts", "No tributes yet");

export default function SettingsSidebar() {
	const isNarrow = useMediaQuery("(max-width: 768px)");
	// Mobile is a master→detail drill-down: 'nav' shows the menu, 'detail' shows
	// the selected section with a back button. Desktop shows both side-by-side.
	const [mobileView, setMobileView] = useState<"nav" | "detail">("nav");
	const [activeNav, setActiveNav] = useState("Personal information");
	const [activeTab, setActiveTab] = useState("login");
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
	const [language, setLanguage] = useState("en-CA");
	const [currency, setCurrency] = useState("CAD");
	const [timezone, setTimezone] = useState("ET");

	const [legalName, setLegalName] = useState("Vlad Dracul");
	const [preferredName, setPreferredName] = useState("");
	const [email, setEmail] = useState("v***d@castle-dracula.ro");
	const [phone, setPhone] = useState("+1 ***-***-0123");
	const [address, setAddress] = useState("");
	const [mailingAddress, setMailingAddress] = useState("");
	const [emergencyContact, setEmergencyContact] = useState("Provided");

	// Selecting a nav item also drills into the detail view on mobile.
	const selectNav = (label: string) => {
		setActiveNav(label);
		setMobileView("detail");
	};

	const navList = (
		<VStack gap={4} paddingBlock={4} paddingInline={3}>
			<Text type="label" style={sideNavHeading}>
				Account settings
			</Text>
			<List density="spacious">
				{NAV_ITEMS.map((item) => (
					<ListItem
						key={item.label}
						label={item.label}
						startContent={<Icon icon={item.icon} />}
						endContent={
							isNarrow ? <Icon icon={ChevronRight} size="sm" color="secondary" /> : undefined
						}
						isSelected={!isNarrow && activeNav === item.label}
						onClick={() => selectNav(item.label)}
					/>
				))}
			</List>
			<Divider />
			<List density="spacious">
				<ListItem label="Professional hosting tools" startContent={<Icon icon={Wrench} />} />
			</List>
		</VStack>
	);

	// Mobile, nav view: show only the menu (full width, no sidebar slot).
	if (isNarrow && mobileView === "nav") {
		return (
			<Layout
				height="fill"
				style={fillViewport}
				// padding={0}, not padding={2}. This wraps the SAME navList element
				// the desktop LayoutPanel renders with padding={0}, and the navList's
				// own paddingBlock/paddingInline props supply the 16px/12px inset.
				// The extra 8px here is what made the same nav list measure 20px on
				// mobile against 12px on desktop -- and against 24px further down,
				// disagreed with each other too. The container owns no gutter; the
				// list owns its own.
				content={<LayoutContent padding={0}>{navList}</LayoutContent>}
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
								label={`Back to Account settings: ${activeNav === HOSTING_TOOLS_TITLE ? "Hosting tools" : activeNav}`}
								gap={2}
								startContent={
									<>
										<Button
											label="Back to Account settings"
											variant="ghost"
											size="sm"
											isIconOnly
											icon={<Icon icon={ArrowLeft} size="sm" />}
											onClick={() => setMobileView("nav")}
										/>
										<Heading level={1}>
											{activeNav === HOSTING_TOOLS_TITLE ? "Hosting tools" : activeNav}
										</Heading>
									</>
								}
							/>
						)}
						{activeNav === "Login & security" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Login &amp; security</Heading>}

								<TabList value={activeTab} onChange={setActiveTab} hasDivider>
									<Tab value="login" label="Login" />
									<Tab value="shared" label="Shared access" />
								</TabList>

								{activeTab === "login" && (
									<VStack gap={8}>
										<VStack gap={2}>
											<Heading level={2}>Login</Heading>
											{LOGIN_ROWS.map((row) => (
												<InfoRowItem
													key={row.label}
													{...row}
													hasDivider={false}
													style={rowPadding}
												/>
											))}
										</VStack>

										<VStack gap={2}>
											<Heading level={2}>Social accounts</Heading>
											{SOCIAL_ROWS.map((row) => (
												<InfoRowItem
													key={row.label}
													{...row}
													hasDivider={false}
													style={rowPadding}
												/>
											))}
										</VStack>

										<VStack gap={2}>
											<Heading level={2}>Device history</Heading>
											{DEVICE_ROWS.map((device) => (
												<HStack key={device.location} gap={3} vAlign="start" style={rowPadding}>
													<Icon icon={Monitor} />
													<StackItem size="fill">
														<VStack gap={1}>
															<HStack gap={2} vAlign="center" wrap="wrap">
																<Text type="body" weight="semibold">
																	{device.label}
																</Text>
																{device.isCurrent && (
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
																hasTabularNumbers
															>
																{device.location}
															</Text>
														</VStack>
													</StackItem>
													{device.action && (
														<Button
															label={device.action}
															variant="secondary"
															size="sm"
															onClick={() => {}}
															style={actionNoWrap}
														/>
													)}
												</HStack>
											))}
										</VStack>

										<VStack gap={2}>
											<Heading level={2}>Account</Heading>
											<HStack hAlign="between" vAlign="start" style={rowPadding}>
												<VStack gap={1}>
													<Text type="body" weight="semibold" display="block">
														Deactivate your account
													</Text>
													<Text type="supporting" color="secondary" display="block">
														This action cannot be undone
													</Text>
												</VStack>
												<Button
													label="Deactivate"
													variant="secondary"
													size="sm"
													onClick={() => {}}
													style={actionNoWrap}
												/>
											</HStack>
										</VStack>
									</VStack>
								)}

								{activeTab === "shared" && (
									<VStack gap={8}>
										<VStack gap={2}>
											<Heading level={2}>Shared access</Heading>
											<Text type="body" color="secondary">
												Review each request carefully before approving access. We&apos;ll email your
												kin or coven-mate a 4-digit code that lets them enter your crypt from their
												trusted device.
											</Text>
										</VStack>

										<Card variant="muted">
											<HStack gap={4} vAlign="start">
												<Center width={48} height={48} style={iconBox}>
													<Icon icon={Lock} />
												</Center>
												<VStack gap={1}>
													<Text type="body">Adding devices from people you trust</Text>
													<Text type="body" color="secondary">
														When you approve a request, you grant someone full access to your
														account. They&apos;ll be able to change reservations and send messages
														on your behalf.
													</Text>
												</VStack>
											</HStack>
										</Card>
									</VStack>
								)}
							</VStack>
						)}

						{activeNav === "Languages & currency" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Languages &amp; currency</Heading>}
								<VStack gap={0}>
									<ExpandableRow
										label="Preferred language"
										value={LANGUAGES.find((l) => l.value === language)?.label ?? language}
										isExpanded={expandedRow === "language"}
										onEdit={() => setExpandedRow("language")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										value={CURRENCIES.find((c) => c.value === currency)?.label ?? currency}
										isExpanded={expandedRow === "currency"}
										onEdit={() => setExpandedRow("currency")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										value={TIMEZONES.find((t) => t.value === timezone)?.label ?? timezone}
										isExpanded={expandedRow === "timezone"}
										onEdit={() => setExpandedRow("timezone")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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

						{activeNav === "Personal information" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Personal information</Heading>}
								<VStack gap={0}>
									<ExpandableRow
										label="Legal name"
										value={legalName}
										isExpanded={expandedRow === "legalName"}
										onEdit={() => setExpandedRow("legalName")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
										<TextInput
											label="Legal name"
											isLabelHidden
											value={legalName}
											onChange={setLegalName}
										/>
									</ExpandableRow>
									<ExpandableRow
										label="Preferred first name"
										value={preferredName || "Not provided"}
										isExpanded={expandedRow === "preferredName"}
										onEdit={() => setExpandedRow("preferredName")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										isExpanded={expandedRow === "email"}
										onEdit={() => setExpandedRow("email")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										isExpanded={expandedRow === "phone"}
										onEdit={() => setExpandedRow("phone")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										hasDivider={false}
										style={rowPadding}
									/>
									<ExpandableRow
										label="Residential address"
										value={address || "Not provided"}
										isExpanded={expandedRow === "address"}
										onEdit={() => setExpandedRow("address")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
										<TextInput
											label="Residential address"
											isLabelHidden
											value={address}
											onChange={setAddress}
										/>
									</ExpandableRow>
									<ExpandableRow
										label="Mailing address"
										value={mailingAddress || "Not provided"}
										isExpanded={expandedRow === "mailingAddress"}
										onEdit={() => setExpandedRow("mailingAddress")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										isExpanded={expandedRow === "emergencyContact"}
										onEdit={() => setExpandedRow("emergencyContact")}
										onCancel={() => setExpandedRow(null)}
										onSave={() => setExpandedRow(null)}
										hasDivider={false}
										style={rowPadding}
									>
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
										{INFO_TILES.map((tile) => (
											<HStack key={tile.title} gap={3} vAlign="start">
												<Center width={48} height={48} style={iconBox}>
													<Icon icon={tile.icon} />
												</Center>
												<VStack gap={1}>
													<Text type="body" weight="semibold" display="block">
														{tile.title}
													</Text>
													<Text type="body" color="secondary" display="block">
														{tile.body}
													</Text>
												</VStack>
											</HStack>
										))}
									</VStack>
								</Card>
							</VStack>
						)}

						{activeNav === "Privacy" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Privacy</Heading>}

								<VStack gap={8}>
									<VStack gap={2}>
										<Heading level={2}>Messages</Heading>
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
									</VStack>

									<VStack gap={2}>
										<Heading level={2}>Listings</Heading>
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
									</VStack>

									<VStack gap={4}>
										<Heading level={2}>Reviews</Heading>
										<Text type="body" color="secondary">
											Choose what&apos;s shared when you write a review.{" "}
											<Link href={SELF_HASH} type="body" hasUnderline>
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
									</VStack>

									<VStack gap={4}>
										<Heading level={2}>Data privacy</Heading>
										<Card>
											<HStack hAlign="between" vAlign="center">
												<Text type="body">Request my personal data</Text>
												<Button
													label="Request"
													variant="secondary"
													size="sm"
													onClick={() => {}}
													style={actionNoWrap}
												/>
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
												<Button
													label="Delete"
													variant="secondary"
													size="sm"
													onClick={() => {}}
													style={actionNoWrap}
												/>
											</HStack>
										</Card>
										<Card variant="muted">
											<HStack gap={4} vAlign="start">
												<Center width={48} height={48} style={iconBox}>
													<Icon icon={ShieldCheck} />
												</Center>
												<VStack gap={1}>
													<Text type="body">Committed to privacy</Text>
													<Text type="body" color="secondary">
														We&apos;re committed to keeping your data protected. See details in our{" "}
														<Link href={SELF_HASH} type="supporting" hasUnderline>
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

						{activeNav === "Notifications" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Notifications</Heading>}
								<VStack gap={2}>
									<Heading level={2}>Messages</Heading>
									<VStack gap={4} style={rowPadding}>
										<Switch
											label="Email notifications"
											description="Coven updates, journey reminders, and crypt activity."
											value={emailNotif}
											onChange={setEmailNotif}
											labelPosition="start"
											labelSpacing="spread"
										/>
										<Switch
											label="Push notifications"
											description="Swift ravens for messages and booking requests."
											value={pushNotif}
											onChange={setPushNotif}
											labelPosition="start"
											labelSpacing="spread"
										/>
									</VStack>
								</VStack>
							</VStack>
						)}

						{activeNav === "Taxes" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Taxes</Heading>}
								<VStack gap={2}>
									<Heading level={2}>Tax scrolls</Heading>
									{TAX_ROWS.map((row) => (
										<InfoRowItem key={row.label} {...row} hasDivider={false} style={rowPadding} />
									))}
								</VStack>
							</VStack>
						)}

						{activeNav === "Payments" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Payments</Heading>}
								<VStack gap={2}>
									<Heading level={2}>Payout crypt</Heading>
									{PAYOUT_ROWS.map((row) => (
										<InfoRowItem key={row.label} {...row} hasDivider={false} style={rowPadding} />
									))}
								</VStack>
							</VStack>
						)}

						{activeNav === "Travel for work" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Travel for work</Heading>}
								<VStack gap={2}>
									<Heading level={2}>Work haunts</Heading>
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
								</VStack>
							</VStack>
						)}

						{activeNav === "Professional hosting tools" && (
							<VStack gap={6}>
								{!isNarrow && <Heading level={1}>Professional hosting tools</Heading>}
								<Card variant="muted">
									<HStack gap={4} vAlign="start">
										<Center width={48} height={48} style={iconBox}>
											<Icon icon={Wrench} />
										</Center>
										<VStack gap={1}>
											<Text type="body">Hosting grimoire</Text>
											<Text type="body" color="secondary">
												Manage multiple listings, route tasks to co-hosts, and review consolidated
												payouts from one place.
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
