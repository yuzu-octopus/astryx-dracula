// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L[h=auto] > LC > Hd"A blank crypt awaits its story"[level=1]

import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Text';

export default function BlankPage() {
  return (
    <Layout
      height="auto"
      content={
        <LayoutContent>
          <Heading level={1}>A blank crypt awaits its story</Heading>
        </LayoutContent>
      }
    />
  );
}
