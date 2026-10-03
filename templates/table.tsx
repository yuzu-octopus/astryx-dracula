// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > H[a=center j=between] > Hd"Artifacts"[level=1] + B.primary"Add artifact") + (LC > T[hover] > (TR > THC"Name" + THC"Status" + THC"Updated" + THC"Actions") + (TR > TC"Blood Vial" + (TC > SD.success + Tx"Active") + TC"2025-01-15" + (TC > B.secondary"Edit"))*3)

import {Layout, LayoutHeader, LayoutContent, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Table, pixel} from '@astryxdesign/core/Table';
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
    width: pixel(144),
    renderCell: (item: Relic) => (
      <Text type="body" weight="semibold">
        {item.name}
      </Text>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(112),
    renderCell: (item: Relic) => (
      <HStack gap={1} vAlign="center">
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
    width: pixel(112),
    renderCell: (item: Relic) => (
      <Text type="body" color="secondary" hasTabularNumbers>
        {item.updatedAt}
      </Text>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    width: pixel(96),
    renderCell: (item: Relic) => (
      <Button label={`Edit ${item.name}`} variant="secondary" size="sm">
        Edit
      </Button>
    ),
  },
];

export default function SimpleTable() {
  const data = SAMPLE_DATA;

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
          {/* Each column below declares the width its own content needs, so the table
              takes that sum instead of splitting the viewport four ways and leaving a
              quarter of the page empty after a ten-character name and 290px of empty
              table to the right of an Edit button. `width: auto` is what lets the pixel
              widths survive — under the default `width: 100%` the fixed table layout
              hands the leftover space back to every column and the voids return. */}
          <Table<Relic>
            data={data}
            columns={columns}
            idKey="id"
            hasHover
            style={{width: 'auto'}}
          />
        </LayoutContent>
      }
    />
  );
}
