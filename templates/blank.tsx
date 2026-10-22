// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure of the tree below; the CLI had no XLE validator
// after `astryx layout` was removed in 0.7.0, so this is a reading aid and a
// human drift check — update it with the file, never alone):
//   L[h=auto] > LC > Hd"A blank crypt awaits its story"[level=1 t=display-2]

import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Text";

export default function BlankPage() {
	return (
		<Layout
			height="auto"
			content={
				<LayoutContent>
					<Heading level={1} type="display-2">
						A blank crypt awaits its story
					</Heading>
				</LayoutContent>
			}
		/>
	);
}
