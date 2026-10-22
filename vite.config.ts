import { readdirSync } from "node:fs";
import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The component count the demo prints, derived from the INSTALLED core
// package rather than written by hand.
//
// A count a page prints must be derived from the data, never written as a
// numeral: the demo said "All 155 Astryx components" through the 0.6.3
// upgrade, and 155 was true for core 0.6.3. It is a number about a
// dependency, so it drifts the moment the dependency moves.
//
// This counts the component DIRECTORIES the package ships. The CLI's
// "exported component names" count is a different number (it also lists
// compound parts like AvatarGroup individually) and needs the CLI's private
// discovery to reproduce, so it is not used here. AGENTS.md names both and
// says which is which.
const CORE_SRC = join(process.cwd(), "node_modules", "@astryxdesign", "core", "src");
const NOT_COMPONENTS = new Set(["__tests__", "hooks", "i18n", "theme", "utils"]);
const componentCount = readdirSync(CORE_SRC, { withFileTypes: true }).filter(
	(entry) => entry.isDirectory() && !NOT_COMPONENTS.has(entry.name),
).length;

// Glimpse-style minimal config: Astryx ships prebuilt CSS + runtime Theme
// injection, so no StyleX plugin, no src alias, no optimizeDeps exclusion.
// (The /facebook/astryx example-vite source-compile setup is only for
// zero-runtime `astryx theme build` consumers; see USAGE.md.)
export default defineConfig({
	define: {
		"import.meta.env.ASTRYX_COMPONENT_COUNT": JSON.stringify(String(componentCount)),
	},
	// Showcase serves under /astryx-dracula/ (Pages project site): public/
	// ships at the root, so public/fonts/*.woff2 resolves to
	// /astryx-dracula/fonts/*.woff2, matching the base-scoped @font-face URLs
	// in tokens.css. Never add a fonts alias — the copy step is the wiring.
	base: "/astryx-dracula/",
	plugins: [
		// Declare the layer order Astryx core expects (see the header of its
		// reset.css): reset, then component styles in astryx-base (astryx.css),
		// then theme overrides in astryx-theme (theme.css or runtime injection).
		// Any layer left out of this statement gets appended after the declared
		// ones, which would let core base styles beat the theme.
		{
			name: "astryx-css-layer-order",
			transformIndexHtml() {
				return [
					{
						tag: "style",
						children: "@layer reset, astryx-base, astryx-theme;",
						injectTo: "head-prepend",
					},
				];
			},
		},
		react(),
	],
});
