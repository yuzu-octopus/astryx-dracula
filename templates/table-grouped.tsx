// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LH[divider] > V[g=4] > (H[j=between a=center] > Hd"Night-shift issues"[level=1] + B.primary"Raise issue"[opens=#raise-issue]) + (H[g=2 a=center] > PS + Po > B.secondary"View options")) + (LC[p=0] > (Tx"Scroll the table sideways to see every column"[t=supporting] + D) + T[hover] > (TR > THC*7) + (TR > TC*7)*4) + (LP > V[g=4] > (H > Tx[t=supporting] + IB"Close panel") + (V[g=1] > Hd[level=2] + Tx[t=body]) + ML + (D + (V[g=2] > Tx"Labels"[t=label] + (H[g=2] > Tk*2)))) ;; Dlg#raise-issue > (DH"Raise issue" + (LC[p=4] > V[g=4] > TI*4) + (LF > H[j=end g=2] > B.secondary"Cancel" + B.primary"Raise issue"))

/**
 * Table Grouped — the night-shift issue tracker: a grouped, collapsible issue table with a PowerSearch bar and a resizable detail inspector. (Frame/responsive/container: see XLE header above.)
 */

import React, {useState, useMemo} from 'react';
import {useResizable, ResizeHandle} from '@astryxdesign/core/Resizable';
import type {ResizableProps} from '@astryxdesign/core/Resizable';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  VStack,
  HStack,
  StackItem,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Badge} from '@astryxdesign/core/Badge';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Selector} from '@astryxdesign/core/Selector';
import {PowerSearch, usePowerSearchConfig} from '@astryxdesign/core/PowerSearch';
import type {PowerSearchFilter} from '@astryxdesign/core/PowerSearch';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Popover} from '@astryxdesign/core/Popover';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Icon} from '@astryxdesign/core/Icon';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Divider} from '@astryxdesign/core/Divider';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Token} from '@astryxdesign/core/Token';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  Table,
  TableRow,
  TableCell,
  TableHeaderCell,
  proportional,
  pixel,
  resolveColumnWidths,
} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {
  ChevronRight,
  ChevronDown,
  Pencil,
  Copy,
  ArrowRight,
  Tag,
  User,
  Trash,
  Ellipsis,
  X,
  ChartBar,
} from 'lucide-react';

// Plain inline styles using Astryx design-token CSS variables (declared at
// :root by `@astryxdesign/core/astryx.css`). No StyleX compiler required.
// The group-header background + cursor live on the colSpan TableCell (which
// reliably forwards `style`) so they fill the full row width.
const groupHeaderCell: React.CSSProperties = {
  cursor: 'pointer',
  backgroundColor: 'var(--color-background-muted)',
  padding: 'var(--spacing-3) var(--spacing-4)',
};

// Types
type TaskStatus = 'in_progress' | 'todo' | 'backlog' | 'done';
type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

interface TaskRow extends Record<string, unknown> {
  id: string;
  taskId: string;
  title: string;
  subtitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  tags: string[];
  created: string;
  updated: string;
  assignee: string;
}

const STATUS_DOT_VARIANT: Record<
  TaskStatus,
  'success' | 'neutral' | 'warning' | 'info'
> = {
  in_progress: 'info',
  todo: 'warning',
  backlog: 'neutral',
  done: 'success',
};

const PRIORITY_COLOR: Record<
  TaskPriority,
  'error' | 'warning' | 'secondary' | 'disabled'
> = {
  urgent: 'error',
  high: 'warning',
  medium: 'secondary',
  low: 'disabled',
  none: 'disabled',
};

// Mock data matching a task tracker
const allTasks: TaskRow[] = [
  {
    id: '1',
    taskId: 'T235040469',
    title: 'Update user interface',
    subtitle: 'Update castle gate integration',
    status: 'in_progress',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'Olivia Martin',
  },
  {
    id: '2',
    taskId: 'T235040470',
    title: 'Chart the crypt to organize haunts for rituals or releases',
    subtitle: '',
    status: 'in_progress',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Jackson Lee',
  },
  {
    id: '3',
    taskId: 'T235040471',
    title: 'Follow moon cycles to focus haunts over n-weeks',
    subtitle: '',
    status: 'in_progress',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Isabella Nguyen',
  },
  {
    id: '4',
    taskId: 'T235040472',
    title: 'Test the gate wards before moonrise',
    subtitle: 'Update castle gate integration',
    status: 'todo',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'William Kim',
  },
  {
    id: '5',
    taskId: 'T235040473',
    title: 'Update backend code',
    subtitle: 'Update castle gate integration',
    status: 'todo',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'Sofia Davis',
  },
  {
    id: '6',
    taskId: 'T235040474',
    title: 'Update front end code',
    subtitle: 'Update castle gate integration',
    status: 'todo',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'Mia Wilson',
  },
  {
    id: '7',
    taskId: 'T235040475',
    title: 'Update castle gate integration',
    subtitle: '',
    status: 'todo',
    priority: 'high',
    project: 'Castle gate integration 2.0',
    tags: ['Improvement', '3rd Party'],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'Lucas Brown',
  },
  {
    id: '8',
    taskId: 'T235040476',
    title: 'Update payment gateway backend code',
    subtitle: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 3',
    assignee: 'Ethan Jones',
  },
  {
    id: '9',
    taskId: 'T235040477',
    title: 'Invite your fellow familiars to the crypt',
    subtitle: '',
    status: 'todo',
    priority: 'low',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 1',
    assignee: 'Ava Taylor',
  },
  {
    id: '10',
    taskId: 'T235040478',
    title: 'Next rites after moonrise',
    subtitle: '',
    status: 'todo',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Noah Garcia',
  },
  {
    id: '11',
    taskId: 'T235040479',
    title: 'Welcome to the crypt',
    subtitle: '',
    status: 'backlog',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Olivia Martin',
  },
  {
    id: '12',
    taskId: 'T235040480',
    title: 'Connect GitHub or GitLab',
    subtitle: '',
    status: 'backlog',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Jackson Lee',
  },
  {
    id: '13',
    taskId: 'T235040481',
    title: 'Customize settings',
    subtitle: '',
    status: 'backlog',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Isabella Nguyen',
  },
  {
    id: '14',
    taskId: 'T235040482',
    title: 'Try 3 ways to navigate: Command menu, keyboard or mouse',
    subtitle: '',
    status: 'done',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'William Kim',
  },
  {
    id: '15',
    taskId: 'T235040483',
    title: 'Connect to Slack',
    subtitle: '',
    status: 'done',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 3',
    assignee: 'Sofia Davis',
  },
  {
    id: '16',
    taskId: 'T235040484',
    title: 'Migrate database schema to v2',
    subtitle: 'Castle gate integration',
    status: 'in_progress',
    priority: 'high',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 4',
    updated: 'Jul 5',
    assignee: 'Lucas Brown',
  },
  {
    id: '17',
    taskId: 'T235040485',
    title: 'Write integration tests for checkout flow',
    subtitle: '',
    status: 'in_progress',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 4',
    updated: 'Jul 5',
    assignee: 'Ethan Jones',
  },
  {
    id: '18',
    taskId: 'T235040486',
    title: 'Set up CI/CD pipeline for staging',
    subtitle: '',
    status: 'in_progress',
    priority: 'high',
    project: '',
    tags: [],
    created: 'Jul 2',
    updated: 'Jul 5',
    assignee: 'Ava Taylor',
  },
  {
    id: '19',
    taskId: 'T235040487',
    title: 'Add rate limiting to public API endpoints',
    subtitle: '',
    status: 'todo',
    priority: 'urgent',
    project: '',
    tags: [],
    created: 'Jul 5',
    updated: 'Jul 5',
    assignee: 'Noah Garcia',
  },
  {
    id: '20',
    taskId: 'T235040488',
    title: 'Refactor auth middleware to support OAuth2',
    subtitle: '',
    status: 'todo',
    priority: 'high',
    project: '',
    tags: [],
    created: 'Jul 4',
    updated: 'Jul 5',
    assignee: 'Olivia Martin',
  },
  {
    id: '21',
    taskId: 'T235040489',
    title: 'Design error pages for 404 and 500',
    subtitle: '',
    status: 'todo',
    priority: 'low',
    project: '',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 4',
    assignee: 'Mia Wilson',
  },
  {
    id: '22',
    taskId: 'T235040490',
    title: 'Audit third-party dependencies for vulnerabilities',
    subtitle: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jul 5',
    updated: 'Jul 5',
    assignee: 'Jackson Lee',
  },
  {
    id: '23',
    taskId: 'T235040491',
    title: 'Implement webhook retry logic with exponential backoff',
    subtitle: 'Castle gate integration',
    status: 'todo',
    priority: 'medium',
    project: 'Castle gate integration 2.0',
    tags: [],
    created: 'Jul 4',
    updated: 'Jul 5',
    assignee: 'William Kim',
  },
  {
    id: '24',
    taskId: 'T235040492',
    title: 'Audit dashboard contrast against the Dracula ramp',
    subtitle: '',
    status: 'backlog',
    priority: 'low',
    project: '',
    tags: [],
    created: 'Jul 2',
    updated: 'Jul 3',
    assignee: 'Sofia Davis',
  },
  {
    id: '25',
    taskId: 'T235040493',
    title: 'Create onboarding flow for new team members',
    subtitle: '',
    status: 'backlog',
    priority: 'none',
    project: '',
    tags: [],
    created: 'Jul 1',
    updated: 'Jul 2',
    assignee: 'Isabella Nguyen',
  },
  {
    id: '26',
    taskId: 'T235040494',
    title: 'Set up error tracking with Sentry',
    subtitle: '',
    status: 'backlog',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jul 3',
    updated: 'Jul 4',
    assignee: 'Ethan Jones',
  },
  {
    id: '27',
    taskId: 'T235040495',
    title: 'Improve search performance with indexing',
    subtitle: '',
    status: 'backlog',
    priority: 'low',
    project: '',
    tags: [],
    created: 'Jul 2',
    updated: 'Jul 3',
    assignee: 'Ava Taylor',
  },
  {
    id: '28',
    taskId: 'T235040496',
    title: 'Write API documentation for v2 endpoints',
    subtitle: '',
    status: 'done',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jun 28',
    updated: 'Jul 3',
    assignee: 'Noah Garcia',
  },
  {
    id: '29',
    taskId: 'T235040497',
    title: 'Set up staging environment',
    subtitle: '',
    status: 'done',
    priority: 'high',
    project: '',
    tags: [],
    created: 'Jun 25',
    updated: 'Jul 1',
    assignee: 'Lucas Brown',
  },
  {
    id: '30',
    taskId: 'T235040498',
    title: 'Fix flaky end-to-end tests in CI',
    subtitle: '',
    status: 'done',
    priority: 'medium',
    project: '',
    tags: [],
    created: 'Jun 30',
    updated: 'Jul 2',
    assignee: 'Mia Wilson',
  },
];

const STATUS_LABEL: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  todo: 'Todo',
  backlog: 'Backlog',
  done: 'Done',
};

type GroupByField = 'status' | 'priority' | 'project' | 'assignee' | 'none';

const GROUP_BY_OPTIONS: {value: GroupByField; label: string}[] = [
  {value: 'none', label: 'None'},
  {value: 'status', label: 'Status'},
  {value: 'priority', label: 'Priority'},
  {value: 'project', label: 'Project'},
  {value: 'assignee', label: 'Assignee'},
];

function groupTasks(
  tasks: TaskRow[],
  groupBy: GroupByField,
): Map<string, TaskRow[]> {
  if (groupBy === 'none') {
    return new Map([['All', tasks]]);
  }
  const map = new Map<string, TaskRow[]>();
  for (const task of tasks) {
    const key = String(task[groupBy]) || 'None';
    let group = map.get(key);
    if (!group) {
      group = [];
      map.set(key, group);
    }
    group.push(task);
  }
  return map;
}

function getGroupLabel(groupBy: GroupByField, key: string): string {
  if (groupBy === 'status') {
    return STATUS_LABEL[key as TaskStatus] ?? key;
  }
  if (groupBy === 'priority') {
    // Group headers say "No priority" for the unprioritized bucket while the
    // inspector keeps the "None" filter vocabulary — same key, different
    // surface, so the shared label map is overridden only here.
    return {...PRIORITY_LABEL, none: 'No priority'}[key as TaskPriority] ?? key;
  }
  return key;
}

// Real widths, because `resolveColumnWidths` derives the table's aggregate
// min-width from exactly these numbers: every `pixel()` here also sets
// min-width (the table may not shrink a fixed column) and every
// `proportional()` contributes its own min. Set too small, the core honors the
// number anyway and clips the cell — that is how a 44px status column came to
// hold "In Progress" (91px of text) and a 72px date column came to hold a
// header plus a value. The floors below are the measured width of the widest
// real value in the column plus the 24px of balanced-density cell padding, so
// no value in the data is ever narrower than its own content.
// The consequence is an honest min-width of 1014px, which is why the table
// scrolls in the scroller core renders around it: at 390 the status and the
// Issue column both land on screen, and the remaining columns are one swipe
// away.
const columns: TableColumn<TaskRow>[] = [
  {
    key: 'status',
    header: '',
    // StatusDot + the status word, which WCAG 1.4.1 requires as a channel
    // beside the hue.
    width: pixel(116),
  },
  {
    key: 'title',
    header: 'Issue',
    // 2fr of the flexible pair: the issue id and title are what the reader
    // scans the list for.
    width: proportional(2, {minWidth: 280}),
  },
  {
    key: 'project',
    header: 'Project',
    width: proportional(1, {minWidth: 150}),
  },
  {
    key: 'created',
    header: 'Created',
    // 112, not 80: the header label measures 83px at label-semibold, and a
    // header cell always truncates, so the floor has to clear the label and
    // not just the "Jul 3" value underneath it.
    width: pixel(112),
  },
  {
    key: 'updated',
    header: 'Updated',
    width: pixel(112),
  },
  {
    key: 'assignee',
    header: 'Assignee',
    // Avatar AND name. At 52px the column showed the avatar alone, which
    // left the name reachable only in the inspector — and the inspector is
    // gone below 1024. 168 clears the widest name in the data
    // ("Isabella Nguyen", 108px of text) beside the 24px avatar, so it never
    // breaks across two lines.
    width: pixel(168),
  },
  {
    key: 'actions',
    header: '',
    width: pixel(56),
  },
];

const fieldDefs = [
  {
    key: 'status',
    type: 'enum',
    label: 'Status',
    enumValues: [
      {value: 'in_progress', label: 'In Progress'},
      {value: 'todo', label: 'Todo'},
      {value: 'backlog', label: 'Backlog'},
      {value: 'done', label: 'Done'},
    ],
  },
  {
    key: 'priority',
    type: 'enum',
    label: 'Priority',
    enumValues: [
      {value: 'urgent', label: 'Urgent'},
      {value: 'high', label: 'High'},
      {value: 'medium', label: 'Medium'},
      {value: 'low', label: 'Low'},
      {value: 'none', label: 'None'},
    ],
  },
  {key: 'title', type: 'string', label: 'Title'},
  {key: 'assignee', type: 'string', label: 'Assignee'},
  {key: 'project', type: 'string', label: 'Project'},
] as const;

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};

function TaskDetailPanel({
  task,
  onClose,
  resizable,
}: {
  task: TaskRow | null;
  onClose: () => void;
  resizable: ResizableProps;
}) {
  if (!task) {
    return null;
  }
  return (
    // Panel owns the separator (its full-height left border). The adjacent
    // ResizeHandle is kept divider-less + isAlwaysVisible={false} so its
    // always-on pill doesn't float above the panel as a stray stub.
    <LayoutPanel
      hasDivider
      resizable={resizable}
      padding={4}
      role="complementary"
      label="Task details">
      <VStack gap={4}>
        <HStack gap={2} vAlign="center">
          <StackItem size="fill">
            <Text type="supporting" color="secondary">
              {task.taskId}
            </Text>
          </StackItem>
          <Button
            label="Close panel"
            variant="ghost"
            size="sm"
            icon={<Icon icon={X} size="sm" />}
            isIconOnly
            onClick={onClose}
          />
        </HStack>

        <VStack gap={1}>
          <Heading level={2}>{task.title}</Heading>
          {task.subtitle && (
            <Text type="body" color="secondary">
              {task.subtitle}
            </Text>
          )}
        </VStack>

        <MetadataList label={{position: 'start'}}>
          <MetadataListItem label="Status">
            <HStack gap={1} vAlign="center">
              <StatusDot
                variant={STATUS_DOT_VARIANT[task.status]}
                label={STATUS_LABEL[task.status]}
                isPulsing={task.status === 'in_progress'}
              />
              <Text type="body">{STATUS_LABEL[task.status]}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Priority">
            <HStack gap={2} vAlign="center">
              <Icon
                icon={ChartBar}
                size="sm"
                color={PRIORITY_COLOR[task.priority]}
              />
              <Text type="body">{PRIORITY_LABEL[task.priority]}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Assignee">
            <HStack gap={2} vAlign="center">
              <Avatar name={task.assignee} size="sm" />
              <Text type="body">{task.assignee}</Text>
            </HStack>
          </MetadataListItem>
          <MetadataListItem label="Project">
            {task.project ? (
              <Text type="body">{task.project}</Text>
            ) : (
              <Text type="supporting" color="secondary">
                None
              </Text>
            )}
          </MetadataListItem>
          <MetadataListItem label="Created">
            <Text type="body">{task.created}</Text>
          </MetadataListItem>
          <MetadataListItem label="Updated">
            <Text type="body">{task.updated}</Text>
          </MetadataListItem>
        </MetadataList>

        {task.tags.length > 0 && (
          <>
            <Divider />
            <VStack gap={2}>
              <Text type="label">Labels</Text>
              <HStack gap={2}>
                {task.tags.map(tag => (
                  <Token key={tag} color="yellow" label={tag} />
                ))}
              </HStack>
            </VStack>
          </>
        )}
      </VStack>
    </LayoutPanel>
  );
}

export default function TableGrouped() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [powerSearchFilters, setPowerSearchFilters] = useState<
    ReadonlyArray<PowerSearchFilter>
  >([]);
  const {config: powerSearchConfig, applyFilters} = usePowerSearchConfig(
    fieldDefs,
    'IssueSearch',
  );
  const [groupBy, setGroupBy] = useState<GroupByField>('status');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(['in_progress', 'todo', 'backlog', 'done']),
  );

  // Responsive contract (see file header): below 1024px the inspector would
  // squeeze the grouped table, so it steps aside entirely.
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  const filtered = useMemo(() => {
    return applyFilters(powerSearchFilters, allTasks);
  }, [powerSearchFilters, applyFilters]);

  const grouped = useMemo(
    () => groupTasks(filtered, groupBy),
    [filtered, groupBy],
  );

  const groupKeys = Array.from(grouped.keys());

  // Expand every group whenever the grouping itself changes. Keyed on the
  // memoized Map, not on groupKeys, which is a fresh array each render.
  React.useEffect(() => {
    setExpandedGroups(new Set(grouped.keys()));
  }, [grouped]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const detailPanel = useResizable({
    defaultSize: 360,
    minSize: 280,
    maxSize: 500,
  });

  const resolvedWidths = resolveColumnWidths(columns);

  return (
    <>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider padding={6}>
            <VStack gap={4}>
              {/* wrap: below ~460px the Raise issue button drops to its own
                  line instead of starving the heading, so the display-2 title
                  keeps its full measure. The earlier maxLines={1} clipped it
                  to "Night-shift i…" at 390, and its reveal path was a
                  Tooltip — a hover affordance a phone never fires. Wrapping
                  breaks on the space between the two words, so no value is
                  lost and none is sliced mid-word (SC 1.4.10). */}
              <HStack gap={3} vAlign="center" wrap="wrap">
                <StackItem size="fill">
                  <Heading level={1} type="display-2">Night-shift issues</Heading>
                </StackItem>
                <Button
                  label="Raise issue"
                  variant="primary"
                  onClick={() => setDialogOpen(true)}
                />
              </HStack>
              <HStack gap={2} vAlign="center">
                <StackItem size="fill">
                  <PowerSearch
                    config={powerSearchConfig}
                    filters={powerSearchFilters}
                    onChange={newFilters => setPowerSearchFilters(newFilters)}
                    placeholder="Filter issues…"
                    resultCount={`${filtered.length} issue${filtered.length !== 1 ? 's' : ''}`}
                  />
                </StackItem>
                <Popover
                  placement="below"
                  alignment="end"
                  width="min(20rem, calc(100vw - 2 * var(--space-viewport)))"
                  label="Grouping options"
                  content={
                    <VStack gap={4}>
                      <RadioList
                        label="Group by"
                        value={groupBy}
                        onChange={v => setGroupBy(v as GroupByField)}>
                        {GROUP_BY_OPTIONS.map(opt => (
                          <RadioListItem
                            key={opt.value}
                            value={opt.value}
                            label={opt.label}
                          />
                        ))}
                      </RadioList>
                    </VStack>
                  }>
                  <Button label="View options" variant="secondary" size="md" />
                </Popover>
              </HStack>
            </VStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent role="main" padding={0}>
            <Table
              columns={columns}
              density="balanced"
              dividers="rows"
              textOverflow="wrap"
              hasHover>
              <colgroup>
                {columns.map(col => (
                  <col
                    key={col.key}
                    style={resolvedWidths.columns.get(col.key)?.style}
                  />
                ))}
              </colgroup>
              {/* A scroller needs its columns named: once the reader has
                  scrolled sideways at 390, this row is the only thing that
                  says which value they are looking at. Rendered from
                  `columns` so the labels and the widths cannot drift, and as
                  real <th scope="col"> cells so the association reaches
                  assistive tech. */}
              <TableRow>
                {columns.map(col => (
                  <TableHeaderCell key={col.key} scope="col">
                    {col.header}
                  </TableHeaderCell>
                ))}
              </TableRow>
              {groupKeys.map(key => {
                const tasks = grouped.get(key);
                if (!tasks || tasks.length === 0) {
                  return null;
                }
                const isExpanded = expandedGroups.has(key);

                return (
                  <React.Fragment key={key}>
                    {groupBy !== 'none' && (
                      <TableRow
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleGroup(key)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleGroup(key);
                          }
                        }}>
                        <TableCell colSpan={columns.length} style={groupHeaderCell}>
                          <HStack gap={2} vAlign="center">
                            <Icon
                              icon={
                                isExpanded ? ChevronDown : ChevronRight
                              }
                              size="sm"
                              color="secondary"
                            />
                            <Text type="body" weight="semibold">
                              {getGroupLabel(groupBy, key)}
                            </Text>
                            <Badge
                              variant="neutral"
                              label={String(tasks.length)}
                            />
                          </HStack>
                        </TableCell>
                      </TableRow>
                    )}
                    {(groupBy === 'none' || isExpanded) &&
                      tasks.map(task => (
                        <TableRow
                          key={task.id}
                          onClick={() => setSelectedTask(task)}>
                          <TableCell>
                            {/* StatusDot paints nothing but an 8px dot — its
                                label is aria-label on a role="img" span — so
                                four states here read as hue alone. Same
                                dot-plus-word pairing as the Status entry in
                                TaskDetailPanel's MetadataList. */}
                            <HStack gap={1} vAlign="center">
                              <StatusDot
                                variant={STATUS_DOT_VARIANT[task.status]}
                                label={STATUS_LABEL[task.status]}
                                isPulsing={task.status === 'in_progress'}
                              />
                              <Text type="supporting" color="secondary">
                                {STATUS_LABEL[task.status]}
                              </Text>
                            </HStack>
                          </TableCell>
                          <TableCell>
                            <HStack gap={3} vAlign="center" wrap="wrap">
                              <Icon
                                icon={ChartBar}
                                size="sm"
                                color={PRIORITY_COLOR[task.priority]}
                              />
                              <Text type="supporting" color="secondary">
                                {task.taskId}
                              </Text>
                              <StackItem size="fill">
                                <Text type="body">
                                  {task.title}
                                  {task.subtitle && (
                                    <Text type="inherit" color="secondary">
                                      {' › '}
                                      {task.subtitle}
                                    </Text>
                                  )}
                                </Text>
                              </StackItem>
                            </HStack>
                          </TableCell>
                          <TableCell>
                            {task.project ? (
                              <Text type="body">
                                {task.project}
                              </Text>
                            ) : (
                              <Text type="supporting" color="secondary">
                                None
                              </Text>
                            )}
                          </TableCell>
                          <TableCell>
                            <Text
                              type="supporting"
                              color="secondary">
                              {task.created}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text
                              type="supporting"
                              color="secondary">
                              {task.updated}
                            </Text>
                          </TableCell>
                          <TableCell>
                            {/* Name beside the avatar: below 1024 the
                                inspector is gone, so the avatar alone would
                                leave the assignee readable by screen reader
                                but not by eye. */}
                            <HStack gap={2} vAlign="center">
                              <Avatar name={task.assignee} size="sm" />
                              <Text type="supporting" color="secondary">
                                {task.assignee}
                              </Text>
                            </HStack>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu
                              button={{
                                label: 'Actions',
                                variant: 'ghost',
                                size: 'sm',
                                icon: (
                                  <Icon
                                    icon={Ellipsis}
                                    size="sm"
                                  />
                                ),
                                isIconOnly: true,
                              }}
                              hasChevron={false}
                              items={[
                                {label: 'Edit issue', icon: Pencil},
                                {label: 'Assign to...', icon: User},
                                {label: 'Add label', icon: Tag},
                                {label: 'Duplicate', icon: Copy},
                                {label: 'Move to project', icon: ArrowRight},
                                {type: 'divider' as const},
                                {label: 'Delete issue', icon: Trash},
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
            </Table>
          </LayoutContent>
        }
        end={
          !isNarrow &&
          selectedTask && (
            <>
              <ResizeHandle
                resizable={detailPanel.props}
                isReversed
                isAlwaysVisible={false}
              />
              <TaskDetailPanel
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                resizable={detailPanel.props}
              />
            </>
          )
        }
      />
      <Dialog isOpen={dialogOpen} onOpenChange={open => setDialogOpen(open)}>
        <Layout
          height="auto"
          header={
            <DialogHeader
              title="Raise issue"
              onOpenChange={open => setDialogOpen(open)}
            />
          }
          content={
            <LayoutContent padding={4}>
              <VStack gap={4}>
                <TextInput
                  label="Title"
                  placeholder="Issue title"
                  value=""
                />
                <Selector
                  label="Status"
                  value="todo"
                  options={[
                    {value: 'in_progress', label: 'In Progress'},
                    {value: 'todo', label: 'Todo'},
                    {value: 'backlog', label: 'Backlog'},
                  ]}
                />
                <Selector
                  label="Priority"
                  value="none"
                  options={[
                    {value: 'urgent', label: 'Urgent'},
                    {value: 'high', label: 'High'},
                    {value: 'medium', label: 'Medium'},
                    {value: 'low', label: 'Low'},
                    {value: 'none', label: 'No priority'},
                  ]}
                />
                <TextInput
                  label="Project"
                  placeholder="Project name"
                  value=""
                />
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter hasDivider>
              <HStack gap={2} hAlign="end">
                <Button
                  label="Cancel"
                  variant="secondary"
                  size="md"
                  onClick={() => setDialogOpen(false)}
                />
                <Button
                  label="Raise issue"
                  variant="primary"
                  size="md"
                  onClick={() => setDialogOpen(false)}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </>
  );
}
