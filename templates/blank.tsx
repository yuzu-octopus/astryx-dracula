// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > Tx.lg"A blank crypt awaits its story"

import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';

export default function BlankPage() {
  return (
    <Layout
      content={
        <LayoutContent>
          <Text type="large">A blank crypt awaits its story</Text>
        </LayoutContent>
      }
    />
  );
}
