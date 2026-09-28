// Parametric order desk shared by the table-page-chart (Matcha Bar) and
// table-page-shoe-store-heatmap (Midnight Kicks) templates. The two pages are
// one archetype — revenue line over the order log — differing only in catalogue,
// rows, and chart scale, so the frame/columns live here once.
import type {CSSProperties} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {Token} from '@astryxdesign/core/Token';
import {Link} from '@astryxdesign/core/Link';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Filter, Download, Plus} from 'lucide-react';
import {RevenueChart, ProductSwatch} from 'astryx-dracula/shared/revenue-chart';
import type {SceneHue} from 'astryx-dracula/shared/scene-hues';

// Anchor for the page wrapper.
//
// `height: '100dvh'`, NOT `minHeight: '100%'`. A percentage min-height
// resolves against the containing block's DEFINITE height and computes to 0
// when that is indefinite (CSS 2.1 10.5), so against a content-sized host it
// contributes nothing at all: the Layout's `height: 100%` still resolves to
// auto and the document keeps the scroll, which is the failure this exists to
// remove. Viewport units are absolute and need no ancestor, which is why every
// working instance in this repo uses them -- editor.tsx:302, file-explorer.tsx:
// 265, messaging-shell.tsx:67, ai-chat.tsx:64, kanban-board.tsx:704 -- and why
// minHeight appears in none of them.
//
// The wrapper is shared by all three callers (table-page-chart.tsx:410,
// table-page-shoe-store-heatmap.tsx:759, and this module's own default), so
// anchoring it here covers them together. Anchoring inside each caller instead
// would put a 100dvh box inside this one and overflow by the header height.
//
// The wrapper exists to give the Layout's `height: 100%` (Layout.tsx:58-63)
// something definite to resolve against when the host is content-sized, which
// is the case whenever a template ships standalone.
const pageStyle: CSSProperties = {height: '100dvh'};

export interface OrderDeskProduct {
  name: string;
  category: string;
  /**
   * Per-product art tint, painted by `ProductSwatch`. Same remit as
   * `SceneTile.hue` — an art treatment, not a data series — so it takes the
   * same `SceneHue` union rather than a free-form string. Typing the boundary
   * HERE is what makes the compile-error list the real list: typed only at the
   * consumer, a raw string flows through untyped and the error never fires.
   */
  accent: SceneHue;
  price: number;
}

export interface OrderDeskRow extends Record<string, unknown> {
  id: string;
  customer: string;
  email: string;
  product: string;
  category: string;
  imageIndex: number;
  amount: number;
  status: 'completed' | 'processing' | 'shipped' | 'refunded';
  date: string;
}

export interface RevenueDatum {
  date: string;
  revenue: number;
}

// Vocabulary, not a hue choice: orange is attention and constants only
// (principle 3), and an order being picked is routine in-flight work, not
// attention. In-progress/activity is cyan (info). refunded stays red — that
// is a real negative.
const STATUS_TOKEN_COLOR: Record<
  OrderDeskRow['status'],
  'green' | 'cyan' | 'red'
> = {
  completed: 'green',
  shipped: 'cyan',
  processing: 'cyan',
  refunded: 'red',
};

const STATUS_LABEL: Record<OrderDeskRow['status'], string> = {
  completed: 'Completed',
  shipped: 'Shipped',
  processing: 'Processing',
  refunded: 'Refunded',
};

function columnsFor(selfHash: string, products: OrderDeskProduct[]): TableColumn<OrderDeskRow>[] {
  return [
    {
      key: 'id',
      header: 'Order',
      width: pixel(96),
      renderCell: (item: OrderDeskRow) => (
        <Link href={selfHash} isStandalone>
          {item.id}
        </Link>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      width: proportional(3, {minWidth: 160}),
      renderCell: (item: OrderDeskRow) => (
        <HStack gap={3} vAlign="center">
          <ProductSwatch
            accent={products[item.imageIndex].accent}
            label={item.product}
          />
          <StackItem size="fill">
            <VStack gap={0}>
              <Text type="body" maxLines={1}>
                {item.product}
              </Text>
              <Text type="supporting" color="secondary" maxLines={1}>
                {item.category}
              </Text>
            </VStack>
          </StackItem>
        </HStack>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      width: pixel(88),
      renderCell: (item: OrderDeskRow) => (
        <Text type="body" hasTabularNumbers maxLines={1}>
          ${item.amount}
        </Text>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      width: proportional(2, {minWidth: 120}),
      renderCell: (item: OrderDeskRow) => (
        <Text type="body" maxLines={1}>
          {item.customer}
        </Text>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: proportional(2, {minWidth: 120}),
      renderCell: (item: OrderDeskRow) => (
        <Text type="body" maxLines={1}>
          {item.email}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: pixel(120),
      renderCell: (item: OrderDeskRow) => (
        <Token
          size="sm"
          color={STATUS_TOKEN_COLOR[item.status]}
          label={STATUS_LABEL[item.status]}
        />
      ),
    },
    {
      key: 'date',
      header: 'Date',
      width: pixel(112),
      renderCell: (item: OrderDeskRow) => (
        <Text type="body" hasTabularNumbers maxLines={1}>
          {item.date}
        </Text>
      ),
    },
  ];
}

export function OrderDesk({
  title,
  selfHash,
  products,
  orders,
  revenueData,
  chartMax,
  gridTicks,
}: {
  title: string;
  selfHash: string;
  products: OrderDeskProduct[];
  orders: OrderDeskRow[];
  revenueData: RevenueDatum[];
  chartMax: number;
  gridTicks: number[];
}) {
  return (
    // The anchor lives on a page-owned wrapper, never on the Layout. A bare
    // `height="fill"` resolves against `min-height: 100%`, which collapses when
    // the host is content-sized — and templates ship standalone, so that is the
    // common case. Putting the height on the Layout instead would trade
    // a soft failure (the document scrolls) for a hard one (content clipped,
    // because `LayoutContent` is `overflow: auto` with a definite height).
    <div style={pageStyle}>
      <Layout
        height="fill"
      header={
        <LayoutHeader hasDivider padding={6}>
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              {/* maxLines={1}, not wrap="wrap": at 390 the 35px display-2 title
                  wraps 2-3 lines in a 342px header (measured: 136px tall for
                  "Midnight Kicks", 180px for an 18-char title). Wrapping the
                  row measured IDENTICAL header heights in both configurations
                  — the controls already fit, the title is what is tall. And
                  maxLines wires core's useTruncation, so the full value stays
                  reachable in a Tooltip (SC 1.4.10, "truncation must reveal"). */}
              <Heading level={1} type="display-2" maxLines={1}>{title}</Heading>
            </StackItem>
            <IconButton
              label="Filter"
              icon={<Icon icon={Filter} size="sm" />}
              variant="ghost"
              tooltip="Filter"
            />
            <IconButton
              label="Export"
              icon={<Icon icon={Download} size="sm" />}
              variant="ghost"
              tooltip="Export"
            />
            <Button
              label="New order"
              variant="primary"
              icon={<Icon icon={Plus} size="sm" />}
            />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={4}>
            <RevenueChart
              data={revenueData}
              chartMax={chartMax}
              gridTicks={gridTicks}
            />
            <Table<OrderDeskRow>
              data={orders}
              columns={columnsFor(selfHash, products)}
              idKey="id"
              density="balanced"
              dividers="rows"
              textOverflow="truncate"
              hasHover
            />
          </VStack>
        </LayoutContent>
      }
      />
    </div>
  );
}
