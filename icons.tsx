// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * Vendored from @astryxdesign/theme-stone (MIT, Meta Platforms) so this
 * theme ships zero theme dependencies. Maps semantic icon names to Lucide
 * icon components bundled with the theme, not with @astryxdesign/core.
 */

import type { IconRegistry } from "@astryxdesign/core/Icon";
import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Calendar,
	Check,
	CheckCheck,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Clock,
	Columns,
	Copy,
	ExternalLink,
	EyeOff,
	Filter,
	Info,
	Menu,
	Mic,
	MoreHorizontal,
	Search,
	Square,
	Wrench,
	X,
	XCircle,
} from "lucide-react";
import React from "react";

const iconProps = {
	size: "1em",
	"aria-hidden": true as const,
};

export const draculaIconRegistry: IconRegistry = {
	close: <X {...iconProps} />,
	chevronDown: <ChevronDown {...iconProps} />,
	chevronLeft: <ChevronLeft {...iconProps} />,
	chevronRight: <ChevronRight {...iconProps} />,
	chevronsLeft: <ChevronsLeft {...iconProps} />,
	chevronsRight: <ChevronsRight {...iconProps} />,
	check: <Check {...iconProps} />,
	success: <CheckCircle {...iconProps} />,
	error: <XCircle {...iconProps} />,
	warning: <AlertTriangle {...iconProps} />,
	info: <Info {...iconProps} />,
	calendar: <Calendar {...iconProps} />,
	clock: <Clock {...iconProps} />,
	externalLink: <ExternalLink {...iconProps} />,
	menu: <Menu {...iconProps} />,
	moreHorizontal: <MoreHorizontal {...iconProps} />,
	search: <Search {...iconProps} />,
	arrowUp: <ArrowUp {...iconProps} />,
	arrowDown: <ArrowDown {...iconProps} />,
	arrowsUpDown: <ArrowUpDown {...iconProps} />,
	funnel: <Filter {...iconProps} />,
	eyeSlash: <EyeOff {...iconProps} />,
	viewColumns: <Columns {...iconProps} />,
	copy: <Copy {...iconProps} />,
	checkDouble: <CheckCheck {...iconProps} />,
	wrench: <Wrench {...iconProps} />,
	stop: <Square {...iconProps} />,
	microphone: <Mic {...iconProps} />,
};
