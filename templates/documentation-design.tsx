// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LC > V[g=8] > (V[g=2] > Hd"Button"[level=1] + Tx"March 30, 2026"[t=supporting]) + (C.muted[p=0] > Ctr[h=360]) + (V[g=4] > Hd"Usage"[level=2] + Tx"Usage"[t=body] + Hd"Best practices"[level=3] + T) + D + (V[g=4] > Hd"Examples"[level=2] + Tx"Explore"[t=body]) + (V[g=8] > (C[p=0] > (S[p=3] > Tx"Semantics"[t=body]) + Ctr[h=280] + (S.muted[p=3] > V[g=3] > (TL > Tab"Description"! + Tab"Code") + Tx"We have four"[t=body])) + (C[p=0] > (S[p=3] > Tx"Default button with badge"[t=body]) + Ctr[h=280] + (S.muted[p=3] > V[g=3] > (TL > Tab"Description"! + Tab"Code") + Tx"Buttons can include"[t=body])))) + (LP > Outline)

/**
 * Documentation detail — one component, its usage, its guidance and its live examples. (Frame/responsive/container: see XLE header above.)
 */

import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Divider } from "@astryxdesign/core/Divider";
import { useMediaQuery } from "@astryxdesign/core/hooks";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutPanel } from "@astryxdesign/core/Layout";
import { Outline, type OutlineItem } from "@astryxdesign/core/Outline";
import { Section } from "@astryxdesign/core/Section";
import { Selector } from "@astryxdesign/core/Selector";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Tab, TabList } from "@astryxdesign/core/TabList";
import { pixel, proportional, Table } from "@astryxdesign/core/Table";
import { Heading, Text } from "@astryxdesign/core/Text";
import { outlinePanel } from "astryx-dracula/shared/chaptered-doc-config";
import { Plus } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";

const COMPONENT_OUTLINE_ITEMS: OutlineItem[] = [
	{ id: "usage", label: "Usage", level: 2 },
	{ id: "best-practices", label: "Best practices", level: 3 },
	{ id: "examples", label: "Examples", level: 2 },
];

const COMPONENT_OUTLINE_OPTIONS = COMPONENT_OUTLINE_ITEMS.map((item) => ({
	value: item.id,
	label: item.label,
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// This page renders exactly one component's detail. The key is a module
// constant, not a prop: the only caller passed "button" unconditionally, and
// the name/docs/previews below index it directly instead of threading a
// parameter that can never vary.
// The only caller ever passed 'button': the component name is a literal, not a lookup.
const ACTIVE_COMPONENT_NAME = "Button";

const COMPONENT_DOCS: Record<
	string,
	{
		usage: string;
		bestPractices: { type: "do" | "dont"; text: string }[];
		examples: { title: string; description: string; code: string }[];
	}
> = {
	button: {
		usage:
			"Buttons provide visual cues for actions and events. These fundamental components allow users to commit actions and navigate a page flow. Use a Button when a user needs to submit a form, start a new task or action, or trigger a new UI element to appear on the page.",
		bestPractices: [
			{
				type: "do",
				text: "Convey clear action hierarchy: Each surface should only have 1 primary button. A majority of buttons should be in default or flat style.",
			},
			{
				type: "do",
				text: "Promote clarity: Consider labels alongside icons where appropriate.",
			},
			{
				type: "dont",
				text: "Overuse primary or special buttons: Overusing colored buttons will result in a page with less intentionality, create visual confusion and a lack of page hierarchy.",
			},
		],
		examples: [
			{
				title: "Semantics",
				description:
					"We have four semantic buttons types: flat, default, primary, and destructive. Flat buttons are used to limit visual prominence, whereas primary emphasizes a single action. Use destructive for deletions that trigger dialog confirmations.",
				code: `<Button label="Flat" variant="ghost" />\n<Button label="Default" variant="secondary" />\n<Button label="Primary" variant="primary" />\n<Button label="Destructive" variant="destructive" />`,
			},
			{
				title: "Default button with badge",
				description: "Buttons can include a badge to highlight new or updated actions.",
				code: `<Button\n  label="Button"\n  variant="secondary"\n/>`,
			},
		],
	},
};

const ACTIVE_DOCS = COMPONENT_DOCS["button"];

// One preview node per example in ACTIVE_DOCS.examples, index-aligned. The
// old EXAMPLE_PREVIEWS record carried only this key, so the record wrapper
// bought nothing; the avatar/badge/card/banner/dialog/text/divider/token/
// tooltip entries in the old COMPONENT_PREVIEWS map were reachable only
// through nav keys this page never renders, so they are gone.
const EXAMPLE_PREVIEW_NODES: ReactNode[] = [
	<HStack key="semantics" gap={3} vAlign="center" wrap="wrap">
		<Button label="Flat" variant="ghost" />
		<Button label="Default" variant="secondary" />
		<Button label="Primary" variant="primary" />
		<Button label="Destructive" variant="destructive" />
	</HStack>,
	<Button key="badge" label="Button" variant="secondary" />,
];

const HERO_PREVIEW = (
	<Button
		label="Button"
		variant="secondary"
		icon={<Icon icon={Plus} />}
		endContent={<Badge label="New" variant="cyan" />}
	/>
);

// ---------------------------------------------------------------------------
// ComponentDetailView
// ---------------------------------------------------------------------------

function ComponentDetailView() {
	const [exampleTabs, setExampleTabs] = useState<Record<string, string>>({});
	const [activeId, setActiveId] = useState<string | undefined>(COMPONENT_OUTLINE_ITEMS[0]?.id);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const scrollToId = useCallback((id: string) => {
		setActiveId(id);
		const target = document.getElementById(id);
		if (target != null) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			window.history.pushState(null, "", `#${id}`);
		}
	}, []);

	const docs = ACTIVE_DOCS;
	const previews = EXAMPLE_PREVIEW_NODES;

	return (
		<Layout
			height="auto"
			contentWidth={960}
			end={
				isMobile ? undefined : (
					<LayoutPanel
						isScrollable={false}
						label="On this page"
						role="complementary"
						style={outlinePanel}
					>
						<Outline items={COMPONENT_OUTLINE_ITEMS} onActiveIdChange={setActiveId} />
					</LayoutPanel>
				)
			}
			content={
				<LayoutContent isScrollable={false} padding={8}>
					<VStack gap={8}>
						<VStack gap={2}>
							<Heading level={1} type="display-2">
								{ACTIVE_COMPONENT_NAME}
							</Heading>
							<Text type="supporting" color="secondary" hasTabularNumbers>
								March 30, 2026 · Updated 5:40 p.m. PST
							</Text>
							{isMobile && (
								<Selector
									label="On this page"
									isLabelHidden
									options={COMPONENT_OUTLINE_OPTIONS}
									value={activeId}
									onChange={scrollToId}
									width="100%"
								/>
							)}
						</VStack>

						<Card variant="muted" padding={0}>
							<Center height={360}>{HERO_PREVIEW}</Center>
						</Card>

						<VStack gap={4}>
							<Heading id="usage" level={2}>
								Usage
							</Heading>
							<Text type="body">{docs.usage}</Text>
							<Heading id="best-practices" level={3}>
								Best practices
							</Heading>
							<Table
								data={docs.bestPractices as Record<string, unknown>[]}
								dividers="none"
								hasHover
								columns={[
									{
										key: "type",
										header: "Guidance",
										width: pixel(125),
										renderCell: (item: Record<string, unknown>) => (
											<Badge
												label={item.type === "do" ? "Do" : "Don't"}
												variant={item.type === "do" ? "green" : "red"}
											/>
										),
									},
									{
										key: "text",
										header: "Practices",
										width: proportional(1),
										renderCell: (item: Record<string, unknown>) => (
											<Text type="body" textWrap="wrap">
												{item.text as string}
											</Text>
										),
									},
								]}
								density="spacious"
							/>
						</VStack>

						<Divider />

						<VStack gap={4}>
							<Heading id="examples" level={2}>
								Examples
							</Heading>
							<Text type="body">
								Explore common configurations, variations, and states for this component.
							</Text>
						</VStack>
						<VStack gap={8}>
							{docs.examples.map((example, i) => {
								const tabKey = `example-${i}`;
								const activeTab = exampleTabs[tabKey] ?? "description";
								return (
									<Card key={example.title} padding={0}>
										<Section padding={3} variant="transparent">
											<Text type="body" weight="semibold">
												{example.title}
											</Text>
										</Section>
										<Center height={280}>
											{previews[i] ?? (
												<Text type="supporting" color="secondary">
													Quiet in the crypt — no preview haunts this shelf yet.
												</Text>
											)}
										</Center>
										<Section variant="muted" padding={3} dividers={["top"]}>
											<VStack gap={3}>
												<TabList
													value={activeTab}
													onChange={(value) =>
														setExampleTabs((prev) => ({
															...prev,
															[tabKey]: value,
														}))
													}
													size="sm"
												>
													<Tab value="description" label="Description" />
													<Tab value="code" label="Code" />
												</TabList>
												{activeTab === "description" ? (
													<Text type="body">{example.description}</Text>
												) : (
													<CodeBlock code={example.code} language="tsx" width="100%" />
												)}
											</VStack>
										</Section>
									</Card>
								);
							})}
						</VStack>
					</VStack>
				</LayoutContent>
			}
		/>
	);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DocumentationDesign() {
	return <ComponentDetailView />;
}
