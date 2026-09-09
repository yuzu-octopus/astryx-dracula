// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import {Layout, LayoutHeader, LayoutContent, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Table} from '@astryxdesign/core/Table';
import {Badge} from '@astryxdesign/core/Badge';
import type {TableColumn} from '@astryxdesign/core/Table';

type Relic = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  updatedAt: string;
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
      <Badge
        variant={item.status === 'active' ? 'success' : 'neutral'}
        label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      />
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
