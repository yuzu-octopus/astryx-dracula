// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
// AR*9 is the live count: SCENE_TILE_ALTS has 9 entries and a bare .map renders
// all 9, with no slice.
//   L > LC[p=6] > G[c={min:280} g8 a=center] > (V[g6] > (V[g3] > Tx"AFTER DARK"[t=supporting] + Hd"Make every night"[level=1] + Tx"The smallest rituals"[t=body]) + B.primary"Explore the night" + (V[g4] > D + (H[g6] > (V > Tx"12k+"[t=display-3] + Tx"Night shots"[t=supporting])*3))) + (G[c3 g3] > AR*9)

import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { HStack, Layout, LayoutContent, VStack } from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { galleryImageClip } from "astryx-dracula/shared/gallery-image";
import type { SceneHue } from "astryx-dracula/shared/scene-hues";
import { SCENE_TILE_ALTS } from "astryx-dracula/shared/scene-hues";
import { SceneTile } from "astryx-dracula/shared/scene-tile";
import type { CSSProperties } from "react";

// ─── Gallery Data ─────────────────────────────────────────────────────────────

// One Dracula accent per tile from the fixed categorical vocabulary; alts come
// straight from SCENE_TILE_ALTS, shared with classic-gallery.
const GALLERY_HUES: SceneHue[] = [
	"var(--dracula-cyan)",
	"var(--dracula-pink)",
	"var(--dracula-yellow)",
	"var(--dracula-green)",
	"var(--dracula-pink)",
	"var(--dracula-orange)",
	"var(--dracula-cyan)",
	"var(--dracula-yellow)",
	"var(--dracula-green)",
];

// ─── Stat Block ─────────────────────────────────────────────────────────────

function StatBlock({ value, label }: { value: string; label: string }) {
	return (
		<VStack gap={0}>
			<Text type="display-3" weight="semibold" hasTabularNumbers>
				{value}
			</Text>
			<Text type="supporting" color="secondary">
				{label}
			</Text>
		</VStack>
	);
}

// ─── Image Grid ─────────────────────────────────────────────────────────────

function ImageGrid() {
	return (
		<Grid columns={3} gap={3}>
			{SCENE_TILE_ALTS.map((alt, index) => (
				<AspectRatio key={alt} ratio={1} style={galleryImageClip}>
					<SceneTile label={alt} hue={GALLERY_HUES[index]} size="sm" index={index} />
				</AspectRatio>
			))}
		</Grid>
	);
}

// ─── Main Page ──────────────────────────────────────────────────────────────

// A definite ancestor for `Layout height="fill"`. 100dvh, not minHeight: '100%':
// a percentage min-height against an indefinite containing block computes to 0
// (CSS 2.1 10.5), so the soft failure would survive and the document would keep
// the scroll. LayoutContent is overflow:auto, so the definite height lands as a
// content-pane scroller rather than a clip. Same shape as dashboard.tsx and
// editor.tsx:302.
const pageStyle: CSSProperties = { height: "100dvh" };

export default function SideGallery() {
	return (
		<Layout
			style={pageStyle}
			height="fill"
			contentWidth={1400}
			content={
				<LayoutContent padding={6}>
					<Grid columns={{ minWidth: 280, repeat: "fit" }} gap={8} align="center">
						{/* Left side: Text + CTA */}
						<VStack gap={6} vAlign="center">
							<VStack gap={3}>
								<Text type="supporting" color="secondary">
									AFTER DARK
								</Text>
								<Heading level={1}>
									Make every night a little more spellbinding, one small ritual at a time.
								</Heading>
								<Text type="body" color="secondary">
									The smallest rituals are the ones that matter most. A little lamplight that
									catches your eye and makes you pause; that&apos;s what turns an ordinary evening
									into something worth remembering.
								</Text>
							</VStack>

							<Button label="Explore the night" variant="primary" />

							<VStack gap={4}>
								<Divider />
								<HStack gap={6}>
									<StatBlock value="12k+" label="Night shots" />
									<StatBlock value="350+" label="Dark builds" />
									<StatBlock value="8yrs" label="Years prowling" />
								</HStack>
							</VStack>
						</VStack>

						{/* Right side: Image Grid */}
						<ImageGrid />
					</Grid>
				</LayoutContent>
			}
		/>
	);
}
