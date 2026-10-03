// Shared dashboard cards: the KPI tile (MetricCard), the linked table panel
// (TableCard), and the two table-cell renderers the engagement tables share
// (BarCell = magnitude bar + formatted count, CountCell = plain tabular
// count). One home so the analytics and portfolio templates can't drift into
// a second KPI/table vocabulary.

import type {ReactNode} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Stack';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Link} from '@astryxdesign/core/Link';
import {Table} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {MetricDelta} from 'astryx-dracula/shared/metric-delta';
import {Sparkline, type SparkPoint} from 'astryx-dracula/shared/sparkline';

export function MetricCard({
  label,
  value,
  change,
  positive,
  caption = 'Last 30 days vs. Previous',
  sparkline,
}: {
  label: string;
  value: string;
  change: string;
  /** Defaults to "no leading minus means positive". */
  positive?: boolean;
  caption?: string;
  /** Rendered as a thirty-day trend sparkline when provided. */
  sparkline?: SparkPoint[];
}) {
  const isPositive = positive ?? !change.startsWith('-');
  return (
    <Card>
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
        <HStack gap={2} vAlign="center">
          <Text type="display-3" weight="semibold" hasTabularNumbers>
            {value}
          </Text>
          <MetricDelta value={change} positive={isPositive} />
        </HStack>
        <Text type="supporting" color="secondary">
          {caption}
        </Text>
        {sparkline && (
          <Sparkline
            data={sparkline}
            label={`${label} thirty-day trend`}
            positive={isPositive}
          />
        )}
      </VStack>
    </Card>
  );
}

export function TableCard<T extends {id: string}>({
  title,
  linkLabel,
  linkHref,
  data,
  columns,
}: {
  title: string;
  /** Omit both for a linkless panel (e.g. portfolio trending stocks). */
  linkLabel?: string;
  linkHref?: string;
  data: T[];
  columns: TableColumn<T>[];
}) {
  return (
    <Card>
      <VStack gap={6}>
        <HStack hAlign="between" vAlign="center">
          <Heading level={3}>{title}</Heading>
          {linkLabel && linkHref && <Link href={linkHref}>{linkLabel}</Link>}
        </HStack>
        <Table<T>
          data={data}
          columns={columns}
          idKey="id"
          density="compact"
          dividers="rows"
          textOverflow="truncate"
          hasHover
        />
      </VStack>
    </Card>
  );
}

export function BarCell({
  label,
  value,
  max,
  children,
}: {
  /** Accessible bar label, e.g. "/home views". */
  label: string;
  value: number;
  max: number;
  /** Formatted count rendered under the bar. */
  children: ReactNode;
}) {
  return (
    <VStack gap={1}>
      <ProgressBar value={value} max={max} label={label} isLabelHidden />
      <Text type="body" hasTabularNumbers maxLines={1}>
        {children}
      </Text>
    </VStack>
  );
}

export function CountCell({children}: {children: ReactNode}) {
  return (
    <Text hasTabularNumbers maxLines={1}>
      {children}
    </Text>
  );
}
