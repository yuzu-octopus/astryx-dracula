// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > H[a=center j=between] > Hd"Artifacts"[level=1] + B.primary"Add artifact") + (LC > T[hover] > (TR > THC"Name" + THC"Status" + THC"Updated" + THC"Actions") + (TR > TC"Blood Vial" + (TC > SD.success + Tx"Active") + TC"2025-01-15" + (TC > B.secondary"Edit"))*3)

import {useState} from 'react';
import {Layout, LayoutHeader, LayoutContent, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Table} from '@astryxdesign/core/Table';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import type {TableColumn} from '@astryxdesign/core/Table';

type Relic = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  updatedAt: string;
};

const STATUS_LABEL: Record<Relic['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const STATUS_VARIANT: Record<Relic['status'], 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
};

const SAMPLE_DATA: Relic[] = [
  {id: '1', name: 'Blood Vial', status: 'active', updatedAt: '2025-01-15'},
  {id: '2', name: 'Garlic Charm', status: 'inactive', updatedAt: '2025-01-14'},
  {id: '3', name: 'Silver Stake', status: 'active', updatedAt: '2025-01-13'},
];

const columns: TableColumn<Relic>[] = [
  {
    key: 'name',
    header: 'Name',
    renderCell: (item: Relic) => (
      <Text type="body" weight="semibold">
        {item.name}
      </Text>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    renderCell: (item: Relic) => (
      <HStack gap={2} vAlign="center">
        <StatusDot
          variant={STATUS_VARIANT[item.status]}
          label={STATUS_LABEL[item.status]}
        />
        <Text type="body" color="secondary">
          {STATUS_LABEL[item.status]}
        </Text>
      </HStack>
    ),
  },
  {
    key: 'updatedAt',
    header: 'Updated',
    renderCell: (item: Relic) => (
      <Text type="body" color="secondary" hasTabularNumbers>
        {item.updatedAt}
      </Text>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    renderCell: (item: Relic) => (
      <Button label={`Edit ${item.name}`} variant="secondary" size="sm">
        Edit
      </Button>
    ),
  },
];

export default function SimpleTable() {
  const [data] = useState<Relic[]>(SAMPLE_DATA);

  return (
    <Layout
      height="auto"
      header={
        <LayoutHeader hasDivider>
          <HStack vAlign="center" hAlign="between">
            <Heading level={1}>Artifacts</Heading>
            <Button label="Add artifact" variant="primary" />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent>
          <Table<Relic> data={data} columns={columns} idKey="id" hasHover />
        </LayoutContent>
      }
    />
  );
}
