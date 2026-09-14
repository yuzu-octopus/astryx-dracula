// Parametric order desk shared by the table-page-chart (Matcha Bar) and
// table-page-shoe-store-heatmap (Midnight Kicks) templates. The two pages are
// one archetype — revenue line over the order log — differing only in catalogue,
// rows, and chart scale, so the frame/columns live here once.
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

export interface OrderDeskProduct {
  name: string;
  category: string;
  accent: string;
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

const STATUS_TOKEN_COLOR: Record<
  OrderDeskRow['status'],
  'green' | 'cyan' | 'orange' | 'red'
> = {
  completed: 'green',
  shipped: 'cyan',
  processing: 'orange',
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
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider padding={6}>
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              <Heading level={1}>{title}</Heading>
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
  );
}
