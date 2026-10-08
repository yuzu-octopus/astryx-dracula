// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > Ctr[h=80vh] > B.primary"Open settings"[opens=#settings] ;; Dlg#settings > L > (LP[w=280 divider p=3] > V[g=4] > Tx"Account settings"[t=label] + (UL > LI"Personal information"*8)) + (LC[p=6] > V[g=6] > DH"Account" + SE"Settings section" + (V[g=0] > TabList + (V[g=0] > Hd"Login"[level=3] + (H[j=between a=start] > (V[g=0] > Tx"Password"[weight=semibold] + Tx"Not created"[t=supporting]) + B"Create") + (H[g=3 a=start] > Ic + (V[g=0] > (H[g=2 a=center wrap] > Tx"OS X 10.15.7 Chrome"[weight=semibold] + SD) + Tx"March 30, 2026"[t=supporting])))))

/**
 * Settings Dialog — account sections inside one modal.  Frame: the trigger page, then a Dialog that sizes to (Frame/responsive/container: see XLE header above.)
 */

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
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
import type { DeviceRow, InfoTileData } from "astryx-dracula/shared/settings-data";
import {
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
import { Lock, Monitor, ShieldCheck } from "lucide-react";
import { type CSSProperties, useState } from "react";

// Sticky dialog header bar — no Astryx prop for sticky/background/z-index.
// Inline + block padding comes from the parent LayoutContent `padding`.
const headerSticky: CSSProperties = {
	position: "sticky",
	top: 0,
	backgroundColor: "var(--color-background-surface)",
	zIndex: 1,
};

// Width cap on the content column (VStack `maxWidth`; inline padding comes
// from the parent LayoutContent `padding`).
const dialogHeight: CSSProperties = {
	height: "85vh",
};

// Same-route hash: demo links stay focusable anchors without escaping the
// template through the hash router (bare "#" would drop back to the home page).
const SELF_HASH = "#/templates/settings-dialog";

// InfoTile renders the icon tile plus title/body stacked text. DeviceRowItem
// renders the session icon, label + current-session badge, timestamp, and
// trailing action Button. Both live here — not in shared/settings-rows.tsx —
// because that module already covered InfoRowItem/ExpandableRow at its size
// limit, and these two are used by this dialog only.

function InfoTile({ icon, title, body }: InfoTileData) {
	return (
		<HStack gap={3} vAlign="start">
			<Center width={48} height={48} style={iconBox}>
				<Icon icon={icon} />
			</Center>
			<VStack gap={1}>
				<Text type="body" weight="semibold" display="block">
					{title}
				</Text>
				<Text type="body" color="secondary" display="block">
					{body}
				</Text>
			</VStack>
		</HStack>
	);
}

function DeviceRowItem({ label, isCurrent, location, action }: DeviceRow) {
	return (
		<HStack gap={3} vAlign="start">
			<Icon icon={Monitor} />
			<StackItem size="fill">
				<VStack gap={1}>
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
					<Text type="supporting" color="secondary" display="block" hasTabularNumbers>
						{location}
					</Text>
				</VStack>
			</StackItem>
			{/* Ending a session changes state in place — a Button, not a Link. */}
			{action && <Button label={action} variant="secondary" size="sm" />}
		</HStack>
	);
}

export default function SettingsDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeNav, setActiveNav] = useState("Login & security");
	const [expandedRow, setExpandedRow] = useState<string | null>(null);

	const [language, setLanguage] = useState("en-CA");
	const [currency, setCurrency] = useState("CAD");
	const [timezone, setTimezone] = useState("ET");
	const [activeTab, setActiveTab] = useState("login");

	const [legalName, setLegalName] = useState("Vlad Dracul");
	const [preferredName, setPreferredName] = useState("");
	const [email, setEmail] = useState("v***d@castle-dracula.ro");
	const [phone, setPhone] = useState("+1 ***-***-0123");
	const [address, setAddress] = useState("");
	const [mailingAddress, setMailingAddress] = useState("");
	const [emergencyContact, setEmergencyContact] = useState("Provided");
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
	const isCompact = useMediaQuery("(max-width: 640px)");

	const handleEdit = (row: string) => setExpandedRow(row);
	const handleCancel = () => setExpandedRow(null);
	const handleSave = () => setExpandedRow(null);

	return (
		<>
			<Layout
				height="auto"
				content={
					<LayoutContent padding={0}>
						<Center height="80vh">
							<Button label="Open settings" variant="primary" onClick={() => setIsOpen(true)} />
						</Center>
					</LayoutContent>
				}
			/>

			<Dialog
				isOpen={isOpen}
				onOpenChange={(open) => setIsOpen(open)}
				// One width for every viewport: below 932px the dialog shrinks with the
				// window instead of clipping, so no compact branch is needed.
				width="min(900px, calc(100vw - 32px))"
				maxHeight="85vh"
				padding={0}
				purpose="form"
				style={dialogHeight}
			>
				<Layout
					height="fill"
					start={
						isCompact ? undefined : (
							<LayoutPanel width={280} hasDivider role="navigation" padding={3}>
								<VStack gap={4}>
									<Text type="label" style={sideNavHeading}>
										Account settings
									</Text>
									<List density="spacious">
										{NAV_ITEMS.map((item) => (
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
										title={activeNav === "Personal information" ? "Personal info" : activeNav}
										onOpenChange={(open) => setIsOpen(open)}
										hasDivider={false}
									/>
								</VStack>
								{isCompact && (
									<Selector
										label="Settings section"
										value={activeNav}
										onChange={(value) => {
											setActiveNav(value);
											setExpandedRow(null);
										}}
										options={NAV_ITEMS.map((item) => ({
											label: item.label,
											value: item.label,
										}))}
										width="100%"
									/>
								)}
								<VStack gap={0} maxWidth={680}>
									{activeNav === "Personal information" && (
										<VStack gap={6}>
											<VStack gap={4}>
												<ExpandableRow
													label="Legal name"
													value={legalName}
													isExpanded={expandedRow === "legalName"}
													onEdit={() => handleEdit("legalName")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("preferredName")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("email")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("phone")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
												/>
												<ExpandableRow
													label="Residential address"
													value={address || "Not provided"}
													isExpanded={expandedRow === "address"}
													onEdit={() => handleEdit("address")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("mailingAddress")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("emergencyContact")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
												>
													<TextInput
														label="Emergency contact"
														isLabelHidden
														value={emergencyContact}
														onChange={setEmergencyContact}
													/>
												</ExpandableRow>
											</VStack>

											{/* One divider at most per panel: the tiles are one
                          group, so `gap` carries the rhythm. */}
											<Card padding={4}>
												<VStack gap={4}>
													{INFO_TILES.map((tile) => (
														<InfoTile key={tile.title} {...tile} />
													))}
												</VStack>
											</Card>
										</VStack>
									)}

									{activeNav === "Login & security" && (
										<VStack gap={6}>
											<TabList value={activeTab} onChange={setActiveTab} hasDivider>
												<Tab value="login" label="Login" />
												<Tab value="shared" label="Shared access" />
											</TabList>

											{/* Four genuinely different groups, each with its own
                          heading: `gap` is the boundary, so no rule between
                          them and none after the last row. */}
											{activeTab === "login" && (
												<VStack gap={8}>
													<VStack gap={2}>
														<Heading level={3}>Login</Heading>
														{LOGIN_ROWS.map((row) => (
															<InfoRowItem key={row.label} {...row} hasDivider={false} />
														))}
													</VStack>

													<VStack gap={2}>
														<Heading level={3}>Social accounts</Heading>
														{SOCIAL_ROWS.map((row) => (
															<InfoRowItem key={row.label} {...row} hasDivider={false} />
														))}
													</VStack>

													<VStack gap={2}>
														<Heading level={3}>Device history</Heading>
														{DEVICE_ROWS.map((device) => (
															<DeviceRowItem key={device.location} {...device} />
														))}
													</VStack>

													<VStack gap={2}>
														<Heading level={3}>Account</Heading>
														<HStack hAlign="between" vAlign="start">
															<VStack gap={1}>
																<Text type="body" weight="semibold" display="block">
																	Deactivate your account
																</Text>
																<Text type="supporting" color="secondary" display="block">
																	This action cannot be undone
																</Text>
															</VStack>
															{/* Deactivating changes state in place. */}
															<Button label="Deactivate" variant="destructive" size="sm" />
														</HStack>
													</VStack>
												</VStack>
											)}

											{activeTab === "shared" && (
												<VStack gap={8}>
													<VStack gap={2}>
														<Heading level={3}>Shared access</Heading>
														<Text type="body" color="secondary">
															Review each request carefully before approving access. We&apos;ll
															email your kin or coven-mate a 4-digit code that lets them enter your
															crypt from their trusted device.
														</Text>
													</VStack>

													<Card variant="muted">
														<HStack gap={4} vAlign="start">
															<Center width={48} height={48} style={iconBox}>
																<Icon icon={Lock} />
															</Center>
															<VStack gap={1}>
																<Text type="body">Adding devices for your trusted coven</Text>
																<Text type="body" color="secondary">
																	When you approve a request, you grant them full passage through
																	your crypt. They&apos;ll be able to change bookings and send
																	ravens on your behalf.
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
											<VStack gap={4}>
												<ExpandableRow
													label="Preferred language"
													value={LANGUAGES.find((l) => l.value === language)?.label ?? language}
													isExpanded={expandedRow === "language"}
													onEdit={() => handleEdit("language")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("currency")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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
													onEdit={() => handleEdit("timezone")}
													onCancel={handleCancel}
													onSave={handleSave}
													hasDivider={false}
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

									{activeNav === "Notifications" && (
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
												<Switch
													label="Push notifications"
													description="Time-sensitive alerts, delivered by raven."
													value={pushNotif}
													onChange={setPushNotif}
													labelPosition="start"
													labelSpacing="spread"
												/>
											</VStack>
										</VStack>
									)}

									{activeNav === "Payments" && (
										<VStack gap={6}>
											<VStack gap={4}>
												<Heading level={3}>Payments</Heading>
												<InfoRowItem
													label="Payout crypt"
													value="Visa ending in 4821"
													action=""
													hasDivider={false}
												/>
												<InfoRowItem
													label="Past payouts"
													value="No tributes yet"
													action=""
													hasDivider={false}
												/>
											</VStack>
										</VStack>
									)}

									{activeNav === "Taxes" && (
										<VStack gap={6}>
											<VStack gap={4}>
												<Heading level={3}>Taxes</Heading>
												<InfoRowItem
													label="Tax scrolls"
													value="Not submitted"
													action=""
													hasDivider={false}
												/>
												<InfoRowItem
													label="Past scrolls"
													value="Available after your first tribute"
													action=""
													hasDivider={false}
												/>
											</VStack>
										</VStack>
									)}

									{activeNav === "Travel for work" && (
										<VStack gap={6}>
											<VStack gap={4}>
												<Heading level={3}>Travel for work</Heading>
												<Switch
													label="Show night-errand options at checkout"
													description="Adds a night-errand toggle to your account."
													value={workTravel}
													onChange={setWorkTravel}
													labelPosition="start"
													labelSpacing="spread"
												/>
											</VStack>
										</VStack>
									)}

									{activeNav === "Privacy" && (
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
												</VStack>

												<VStack gap={4}>
													<Heading level={3}>Reviews</Heading>
													<Text type="body" color="secondary">
														Choose what&apos;s shared when you write a review.{" "}
														<Link href={SELF_HASH} hasUnderline>
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
													<Heading level={3}>Data privacy</Heading>
													<Card>
														<HStack hAlign="between" vAlign="center">
															<Text type="body">Request my personal data</Text>
															{/* A request is submitted in place, so it acts. */}
															<Button label="Request" variant="secondary" size="sm" />
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
															<Button label="Delete" variant="destructive" size="sm" />
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
																	We&apos;re committed to keeping your data protected. See details
																	in our{" "}
																	<Link href={SELF_HASH} hasUnderline>
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
