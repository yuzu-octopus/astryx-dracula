// Shared scene frame: the accessible, colour-correct wrapper every hand-drawn
// scene SVG in the kit sits inside.
//
// WHY THIS EXISTS: twelve scene components across tech-report (795 lines) and
// product-tour (504 lines) each open with the same seven lines — viewBox,
// preserveAspectRatio, a fill style, role="img", aria-label, and a backdrop
// rect — and shared/scene-tile.tsx and shared/scene-castle.tsx carry the same
// frame a third and fourth time. Beyond the duplication, those scenes painted
// 45 values with --dracula-comment, which is a BORDER colour, not a text or
// data colour. This module exists so that mistake has exactly one place to
// happen.
//
// COLOUR CONTRACT (UIAuditColorMotion, measured against --dracula-bg-dark
// #21222C, the tier every scene paints on — a tier darker than the page #282A36,
// which is why the old ratios were worse than they looked):
//   value  #F8F8F2  14.81:1   --color-text-highlight
//   para   #B0B3C4   7.59:1   --color-text-paragraph (axes, ticks, captions)
//   sec    #9AA1BC   6.16:1   --color-text-secondary
//   cyan   #8BE9FD  11.41:1   --color-data-categorical-cyan (accent marks)
//   COMMENT #6272A4  3.36:1   clears the 3:1 GRAPHICAL floor, FAILS the 4.5:1
//                             TEXT floor, and any fillOpacity below 0.9 makes
//                             it worse: 0.85 -> 2.81, 0.60 -> 2.06. The two
//                             floors are different rules and Comment sits
//                             between them, so its correctness depends entirely
//                             on what it paints:
//                               TEXT  -> never Comment. It is disabled text.
//                                        Use paragraph (7.59:1) or highlight
//                                        (14.81:1) for values. This is the
//                                        45-instance defect.
//                               EMPTY CELL / subtle grid line -> Comment is
//                                        CORRECT at full opacity (3.36:1).
//                                        An empty cell is a graphical object
//                                        carrying data — a reader must see
//                                        that a position exists and was not
//                                        kept — so the 3:1 floor applies, and
//                                        3.36:1 clears it.
// Do NOT "improve" an empty cell to --color-separator #44475A. Measured on
// #21222C: separator's CEILING is 1.73:1 at full opacity, and at 0.55 it is
// 1.32:1. No alpha fixes it, and a grid whose empty cells have vanished is not
// a grid. Subtle is not the same as invisible.
//
// CORRECTNESS CONSTRAINT, not a style note: this module MUST NOT own a <defs>
// id namespace. product-tour hardcodes gradient ids pt-night-glow and
// pt-night-pool, and twelve scenes can render on one page. If this file ever
// generates ids, those scenes collide and the second scene's gradients resolve
// to the first's. Callers pass their own gradient ids in via children.
//
// Not interactive. A scene is artwork, not a control: no hover, no focus ring.

import type { CSSProperties, ReactNode } from "react";

export interface SceneFrameProps {
	/** Accessible name for the art. Required and unique per instance: four or
	 *  more scenes sharing one name is the a11y defect the Sparkline `label` prop
	 *  was extracted to fix. */
	label: string;
	/** Scene contents. Any <defs> and gradient ids belong to the caller. */
	children: ReactNode;
	/** @default '0 0 400 225' */
	viewBox?: string;
	/** Backdrop fill painted behind the scene. @default 'var(--dracula-bg-dark)' */
	fill?: string;
	/** Paints the backdrop rect. Set false when the scene draws its own. @default true */
	hasBackdrop?: boolean;
	/** Forwarded to the root svg. */
	style?: CSSProperties;
}

export function SceneFrame({
	label,
	children,
	viewBox = "0 0 400 225",
	fill = "var(--dracula-bg-dark)",
	hasBackdrop = true,
	style,
}: SceneFrameProps) {
	return (
		<svg
			viewBox={viewBox}
			preserveAspectRatio="xMidYMid slice"
			style={{ width: "100%", height: "100%", display: "block", ...style }}
			role="img"
			aria-label={label}
		>
			{hasBackdrop ? <rect width="100%" height="100%" fill={fill} /> : null}
			{children}
		</svg>
	);
}
