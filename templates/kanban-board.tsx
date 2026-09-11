// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   S > L > (LH[divider] > Tbar > (Hd"Sprint Board"[level=1] + Bd.neutral"8") + (H[g=2] > SE + D.strong + IB"Sort" + IB"Filter" + IB"Search" + B.primary"Add task")) + (LC[p=0] > G[c={min:280,max:4} g=4] > (C.muted[p=0] > L > (LH[divider] > H[j=between a=center] > (H[g=2 a=center] > SD + Hd"To-do"[level=2] + IB) + Tx) + (LC[p=4] > V[g=2] > (C[p=3] > V[g=2] > (H[j=between] > (H[g=2] > Tk + Bd) + MM) + (V[g=1] > Hd[level=3] + Tx) + Tx)*2))*4)

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

import {
  Layout,
  LayoutHeader,
  LayoutContent,
  HStack,
  VStack,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Badge} from '@astryxdesign/core/Badge';
import {Token} from '@astryxdesign/core/Token';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {Selector} from '@astryxdesign/core/Selector';
import {Popover} from '@astryxdesign/core/Popover';
import {Divider} from '@astryxdesign/core/Divider';
import {Toolbar} from '@astryxdesign/core/Toolbar';
import {Section} from '@astryxdesign/core/Section';
import {Grid} from '@astryxdesign/core/Grid';

import {
  Plus,
  Search,
  ArrowUpDown,
  Filter,
  RotateCw,
  CircleCheck,
  Inbox,
  Info,
  ClipboardCheck,
} from 'lucide-react';

// ============= TYPES =============

type ColumnId = 'todo' | 'in-progress' | 'in-review' | 'done';
type Priority = 'high' | 'medium' | 'low';

interface WorkItem {
  id: string;
  column: ColumnId;
  ref: string;
  priority: Priority;
  title: string;
  description: string;
  lastEdited: string;
  dueDate: string;
}

interface ColumnMeta {
  id: ColumnId;
  title: string;
  variant: 'neutral' | 'info' | 'warning' | 'success';
  tooltip: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: typeof Inbox;
}

// Where a dragged card will land: a column and an insertion index within it
// (measured against the cards remaining after the dragged card is removed).
interface DropTarget {
  column: ColumnId;
  index: number;
}

// Live state of an in-progress pointer drag. Coordinates are in viewport space.
interface DragState {
  id: string;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  pointerX: number;
  pointerY: number;
  target: DropTarget | null;
}

// ============= DATA =============

const COLUMNS: ColumnMeta[] = [
  {
    id: 'todo',
    title: 'To-do',
    variant: 'neutral',
    tooltip: 'Palette tasks queued for this sprint, waiting to be picked up.',
    emptyTitle: 'To-do is empty',
    emptyDescription: 'Tasks pulled into this sprint appear here.',
    emptyIcon: Inbox,
  },
  {
    id: 'in-progress',
    title: 'In progress',
    variant: 'info',
    tooltip: 'Theme work currently on the easel.',
    emptyTitle: 'Nothing in progress',
    emptyDescription: 'Tasks being worked on appear here.',
    emptyIcon: RotateCw,
  },
  {
    id: 'in-review',
    title: 'In review',
    variant: 'warning',
    tooltip: 'Shades waiting for your contrast review.',
    emptyTitle: 'Nothing in review',
    emptyDescription: 'Tasks awaiting your review appear here.',
    emptyIcon: ClipboardCheck,
  },
  {
    id: 'done',
    title: 'Done',
    variant: 'success',
    tooltip: 'Shipped shades, sealed after dark.',
    emptyTitle: 'Nothing done yet',
    emptyDescription: 'Completed tasks appear here.',
    emptyIcon: CircleCheck,
  },
];

const PRIORITY_META: Record<
  Priority,
  {label: string; variant: 'red' | 'yellow' | 'cyan'}
> = {
  high: {label: 'High', variant: 'red'},
  medium: {label: 'Medium', variant: 'yellow'},
  low: {label: 'Low', variant: 'cyan'},
};

function groupByColumn(items: WorkItem[]): Record<ColumnId, WorkItem[]> {
  const map: Record<ColumnId, WorkItem[]> = {
    todo: [],
    'in-progress': [],
    'in-review': [],
    done: [],
  };
  for (const item of items) {
    map[item.column].push(item);
  }
  return map;
}

const INITIAL_ITEMS: WorkItem[] = [
  {
    id: 't1',
    column: 'todo',
    ref: 'Task 4821',
    priority: 'low',
    title: 'Draft the palette rollout brief',
    description:
      'Write a short brief outlining goals, scope, and contrast criteria for the Dracula rollout.',
    lastEdited: '2h ago',
    dueDate: 'Jul 8',
  },
  {
    id: 't2',
    column: 'todo',
    ref: 'Task 4842',
    priority: 'low',
    title: 'Collect feedback from night-shift reviewers',
    description:
      'Gather input from key reviewers and summarize the main themes for the next review.',
    lastEdited: '1d ago',
    dueDate: 'Jul 11',
  },
  {
    id: 'p1',
    column: 'in-progress',
    ref: 'Task 4825',
    priority: 'high',
    title: 'Design the midnight landing page',
    description:
      'Create a first-pass layout in pure Dracula and share it for early feedback after dark.',
    lastEdited: '18m ago',
    dueDate: 'Jul 3',
  },
  {
    id: 'p2',
    column: 'in-progress',
    ref: 'Task 4833',
    priority: 'medium',
    title: 'Set up the theme workspace',
    description:
      'Configure the shared workspace and invite the coven so everyone has access.',
    lastEdited: '5m ago',
    dueDate: 'Jul 4',
  },
  {
    id: 'v1',
    column: 'in-review',
    ref: 'Task 4831',
    priority: 'medium',
    title: 'Review the moonlight contrast pass',
    description:
      'Check the new palette against text and border contrast gates before it ships.',
    lastEdited: '2h ago',
    dueDate: 'Jul 5',
  },
  {
    id: 'r1',
    column: 'done',
    ref: 'Task 4788',
    priority: 'low',
    title: 'Publish the weekly changelog',
    description:
      'Summarize progress, blockers, and next steps in a short update for the night shift.',
    lastEdited: 'Yesterday',
    dueDate: 'Jul 1',
  },
  {
    id: 'r2',
    column: 'done',
    ref: 'Task 4789',
    priority: 'high',
    title: 'Prepare the midnight demo walkthrough',
    description:
      'Put together a candlelit walkthrough covering the main haunts for the demo.',
    lastEdited: '3d ago',
    dueDate: 'Jun 30',
  },
  {
    id: 'r3',
    column: 'done',
    ref: 'Task 4790',
    priority: 'medium',
    title: 'Review and merge open pull requests',
    description:
      'Go through the pending bloodlines, leave comments, and merge the ones that are ready.',
    lastEdited: '4d ago',
    dueDate: 'Jun 28',
  },
];

// Pointer travel (px) before a press is promoted to a drag, so taps and clicks
// on card controls still register normally.
const DRAG_THRESHOLD = 5;

// ============= STYLES =============

// Responsive board grid: columns collapse to fewer tracks, then a single
// stack. The board keeps its own internal scroll as the only scroller;
// grid children get room to shrink so nothing forces page-level scroll.
const boardColumnsStyle: CSSProperties = {
  overflowX: 'auto',
  overflowY: 'auto',
  height: '100%',
  padding: 'var(--spacing-6)',
};
const columnShellStyle: CSSProperties = {
  minWidth: 0,
  height: '100%',
};
// Cards stay static per the Dracula brand (no hover lift); the floating drag
// clone floats above the board with the high shadow token instead.
const cardStyle: CSSProperties = {
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'none',
};
// The dragged card is lifted out of flow and follows the pointer. It ignores
// pointer events so hit-testing reads the columns underneath it. The clone
// rides above shell chrome (layered 0-3) but stays under overlay surfaces
// (menus, dialogs layer at 500+ plus the top layer), so an open menu wins.
const DRAG_CLONE_LAYER = 100;
const floatingStyle: CSSProperties = {
  position: 'fixed',
  insetBlockStart: 0,
  insetInlineStart: 0,
  pointerEvents: 'none',
  cursor: 'grabbing',
  zIndex: DRAG_CLONE_LAYER,
};
// Placeholder marking the landing slot; matches the dragged card's height.
const ghostStyle = (height: number): CSSProperties => ({
  height,
  borderRadius: 'var(--radius-element)',
  backgroundColor: 'var(--color-background-muted)',
});
const toolbarDividerStyle: CSSProperties = {
  alignSelf: 'stretch',
};
const columnEmptyStateStyle: CSSProperties = {
  paddingBlock: 'var(--spacing-6)',
};

// ============= CARD BODY =============

// Shared card contents, rendered both in the column list and inside the
// floating drag clone so the two stay pixel-identical.
function BoardCardBody({
  item,
  onMove,
}: {
  item: WorkItem;
  onMove: (id: string, to: ColumnId) => void;
}) {
  const priority = PRIORITY_META[item.priority];
  const moveTargets = COLUMNS.filter(c => c.id !== item.column).map(c => ({
    label: `Move to ${c.title}`,
    onClick: () => onMove(item.id, c.id),
  }));

  return (
    <VStack gap={2}>
      <HStack hAlign="between" vAlign="start">
        <HStack gap={2} vAlign="center" wrap="wrap">
          <Token label={item.ref} size="sm" />
          <Badge label={priority.label} variant={priority.variant} />
        </HStack>
        <MoreMenu
          label="Work item actions"
          size="sm"
          items={[
            {label: 'Open', onClick: () => {}},
            {label: 'Assign to me', onClick: () => {}},
            {type: 'divider'},
            ...moveTargets,
          ]}
        />
      </HStack>

      <VStack gap={1}>
        <Heading level={3}>{item.title}</Heading>
        <Text type="body" color="secondary" maxLines={2}>
          {item.description}
        </Text>
      </VStack>

      <Text type="supporting" color="secondary">
        Edited {item.lastEdited} · Due {item.dueDate}
      </Text>
    </VStack>
  );
}

// ============= BOARD CARD =============

function BoardCard({
  item,
  cardRef,
  onPointerDown,
  onMove,
}: {
  item: WorkItem;
  cardRef: (el: HTMLDivElement | null) => void;
  onPointerDown: (e: ReactPointerEvent, id: string) => void;
  onMove: (id: string, to: ColumnId) => void;
}) {
  // Keyboard-move path for the core drag interaction: arrow keys move the
  // focused card across columns. The pointer DnD below stays quarantined and
  // untouched; this only reuses its moveItem commit.
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const at = COLUMNS.findIndex(c => c.id === item.column);
    const to =
      e.key === 'ArrowRight'
        ? COLUMNS[Math.min(COLUMNS.length - 1, at + 1)]
        : e.key === 'ArrowLeft'
          ? COLUMNS[Math.max(0, at - 1)]
          : undefined;
    if (!to || to.id === item.column) {
      return;
    }
    e.preventDefault();
    onMove(item.id, to.id);
  };
  return (
    <Card
      ref={cardRef}
      padding={3}
      style={cardStyle}
      tabIndex={0}
      role="button"
      aria-label={`${item.title}. In ${COLUMNS.find(c => c.id === item.column)?.title}. Press left or right arrow to move across columns.`}
      onPointerDown={e => onPointerDown(e, item.id)}
      onKeyDown={onKeyDown}>
      <BoardCardBody item={item} onMove={onMove} />
    </Card>
  );
}

// ============= BOARD COLUMN =============

function BoardColumn({
  meta,
  count,
  contentRef,
  children,
}: {
  meta: ColumnMeta;
  count: number;
  contentRef: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <Card variant="muted" padding={0} style={columnShellStyle}>
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider padding={3}>
            <HStack hAlign="between" vAlign="center">
              <HStack gap={2} vAlign="center">
                <StatusDot
                  variant={meta.variant}
                  label={`${meta.title} status`}
                  isPulsing={meta.id === 'in-progress'}
                />
                <Heading level={2}>{meta.title}</Heading>
                <Popover
                  placement="below"
                  width="min(20rem, calc(100vw - 2 * var(--space-viewport)))"
                  label={`${meta.title} column help`}
                  content={
                    <Text type="body" color="secondary">
                      {meta.tooltip}
                    </Text>
                  }>
                  <IconButton
                    label={`About the ${meta.title} column`}
                    icon={<Icon icon={Info} size="sm" />}
                    variant="ghost"
                    size="sm"
                  />
                </Popover>
              </HStack>
              <Text type="supporting" color="secondary" hasTabularNumbers>
                {count}
              </Text>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent ref={contentRef} padding={4}>
            {children ?? (
              <EmptyState
                isCompact
                style={columnEmptyStateStyle}
                icon={
                  <Icon icon={meta.emptyIcon} size="lg" color="secondary" />
                }
                title={meta.emptyTitle}
                description={meta.emptyDescription}
              />
            )}
          </LayoutContent>
        }
      />
    </Card>
  );
}

// ============= MAIN =============

export default function KanbanBoard() {
  const [items, setItems] = useState<WorkItem[]>(INITIAL_ITEMS);
  const [sprint, setSprint] = useState('003');
  const [drag, setDrag] = useState<DragState | null>(null);

  // Live element registries for pointer hit-testing (kept out of render state).
  const columnEls = useRef(new Map<ColumnId, HTMLElement>());
  const cardEls = useRef(new Map<string, HTMLElement>());
  const columnRefCbs = useRef(
    new Map<ColumnId, (el: HTMLDivElement | null) => void>(),
  );
  const cardRefCbs = useRef(
    new Map<string, (el: HTMLDivElement | null) => void>(),
  );
  const teardownRef = useRef<(() => void) | null>(null);

  // Stable ref callbacks so registering an element never churns across renders.
  const getColumnRef = (id: ColumnId) => {
    let cb = columnRefCbs.current.get(id);
    if (!cb) {
      cb = el => {
        if (el) {
          columnEls.current.set(id, el);
        } else {
          columnEls.current.delete(id);
        }
      };
      columnRefCbs.current.set(id, cb);
    }
    return cb;
  };

  const getCardRef = (id: string) => {
    let cb = cardRefCbs.current.get(id);
    if (!cb) {
      cb = el => {
        if (el) {
          cardEls.current.set(id, el);
        } else {
          cardEls.current.delete(id);
        }
      };
      cardRefCbs.current.set(id, cb);
    }
    return cb;
  };

  const itemsByColumn = groupByColumn(items);

  const moveItem = (id: string, to: ColumnId) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? {...item, column: to} : item)),
    );
  };

  // Resolve the pointer position to a column + insertion index, ignoring the
  // card being dragged so the math is against the cards that stay in place.
  const computeTarget = (
    px: number,
    py: number,
    draggedId: string,
  ): DropTarget | null => {
    for (const [colId, el] of Array.from(columnEls.current.entries())) {
      const r = el.getBoundingClientRect();
      if (px < r.left || px > r.right || py < r.top || py > r.bottom) {
        continue;
      }

      const ids: string[] = [];
      for (const it of itemsByColumn[colId]) {
        if (it.id !== draggedId) {
          ids.push(it.id);
        }
      }

      let index = ids.length;
      for (let i = 0; i < ids.length; i++) {
        const cardEl = cardEls.current.get(ids[i]);
        if (!cardEl) {
          continue;
        }
        const cr = cardEl.getBoundingClientRect();
        if (py < cr.top + cr.height / 2) {
          index = i;
          break;
        }
      }
      return {column: colId, index};
    }
    return null;
  };

  // Rebuild the flat item list so the dragged card lands at the resolved slot
  // while every other card keeps its relative order.
  const commitDrag = (id: string, target: DropTarget) => {
    setItems(prev => {
      const moved = prev.find(it => it.id === id);
      if (!moved) {
        return prev;
      }

      const rest = prev.filter(it => it.id !== id);
      const updated: WorkItem = {...moved, column: target.column};
      const colItems = rest.filter(it => it.column === target.column);
      const anchor = colItems[target.index];

      if (!anchor) {
        return [...rest, updated];
      }
      const at = rest.indexOf(anchor);
      return [...rest.slice(0, at), updated, ...rest.slice(at)];
    });
  };

  const onCardPointerDown = (e: ReactPointerEvent, id: string) => {
    if (e.button !== 0) {
      return;
    }
    // Let the card's own controls (the actions menu) handle the press.
    if (
      (e.target as HTMLElement).closest(
        'button, [role="menuitem"], [role="menu"]',
      )
    ) {
      return;
    }

    const el = cardEls.current.get(id);
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;
    const {width, height} = rect;

    let started = false;
    let target: DropTarget | null = null;

    const onMove = (ev: PointerEvent) => {
      if (
        !started &&
        Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) <
          DRAG_THRESHOLD
      ) {
        return;
      }
      started = true;
      target = computeTarget(ev.clientX, ev.clientY, id);
      setDrag({
        id,
        width,
        height,
        offsetX,
        offsetY,
        pointerX: ev.clientX,
        pointerY: ev.clientY,
        target,
      });
    };

    const onUp = () => {
      teardownRef.current?.();
      if (started && target) {
        commitDrag(id, target);
      }
      setDrag(null);
    };

    const teardown = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      teardownRef.current = null;
    };
    teardownRef.current = teardown;

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const draggedItem = drag ? items.find(it => it.id === drag.id) : undefined;
  const isDragging = drag !== null;

  // Suppress selection while dragging and detach listeners on unmount.
  useEffect(() => {
    if (!isDragging) {
      return;
    }
    const previous = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.userSelect = previous;
    };
  }, [isDragging]);

  useEffect(() => () => teardownRef.current?.(), []);

  // Card nodes for a column, or null when the column should show its empty
  // state. A dashed ghost box marks the landing slot during a drag.
  const renderColumnCards = (colId: ColumnId): ReactNode => {
    const colItems = itemsByColumn[colId];
    const visible = drag ? colItems.filter(it => it.id !== drag.id) : colItems;
    const ghostTarget =
      drag && drag.target && drag.target.column === colId ? drag : null;

    if (visible.length === 0 && !ghostTarget) {
      return null;
    }

    const nodes: ReactNode[] = visible.map(it => (
      <BoardCard
        key={it.id}
        item={it}
        cardRef={getCardRef(it.id)}
        onPointerDown={onCardPointerDown}
        onMove={moveItem}
      />
    ));

    if (ghostTarget && ghostTarget.target) {
      const index = Math.min(ghostTarget.target.index, nodes.length);
      nodes.splice(
        index,
        0,
        <VStack key="drag-ghost" style={ghostStyle(ghostTarget.height)} />,
      );
    }

    return <VStack gap={2}>{nodes}</VStack>;
  };

  return (
    <Section height="100dvh">
      <Layout
        height="fill"
        header={
          <LayoutHeader hasDivider padding={6}>
            <Toolbar
              label="Board actions"
              gap={2}
              startContent={
                <>
                  <Heading level={1}>Sprint Board</Heading>
                  <Badge label={items.length} variant="neutral" />
                </>
              }
              endContent={
                <HStack gap={2} wrap="wrap">
                  <Selector
                    label="Sprint"
                    size="lg"
                    width={160}
                    isLabelHidden
                    value={sprint}
                    onChange={setSprint}
                    options={[
                      {value: '003', label: 'Sprint 003'},
                      {value: '002', label: 'Sprint 002'},
                      {value: '001', label: 'Sprint 001'},
                    ]}
                  />
                  <Divider
                    variant="strong"
                    orientation="vertical"
                    style={toolbarDividerStyle}
                  />
                  <HStack gap={1} vAlign="center" wrap="wrap">
                    <IconButton
                      icon={<Icon icon={ArrowUpDown} size="sm" />}
                      label="Sort"
                    />
                    <IconButton
                      icon={<Icon icon={Filter} size="sm" />}
                      label="Filter"
                    />
                    <IconButton
                      icon={<Icon icon={Search} size="sm" />}
                      label="Search"
                    />
                  </HStack>
                  <Button
                    label="Add task"
                    variant="primary"
                    icon={<Icon icon={Plus} size="sm" />}
                  />
                </HStack>
              }
            />
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={0} isScrollable={false}>
            <Grid
              columns={{ minWidth: 280, max: 4 }}
              gap={4}
              style={boardColumnsStyle}
              tabIndex={0}
              role="region"
              aria-label="Sprint board columns">
              {COLUMNS.map(meta => (
                <BoardColumn
                  key={meta.id}
                  meta={meta}
                  count={itemsByColumn[meta.id].length}
                  contentRef={getColumnRef(meta.id)}>
                  {renderColumnCards(meta.id)}
                </BoardColumn>
              ))}
            </Grid>
          </LayoutContent>
        }
      />
      {drag && draggedItem ? (
        <Card
          padding={3}
          elevation="high"
          style={{
            ...floatingStyle,
            width: drag.width,
            transform: `translate(${drag.pointerX - drag.offsetX}px, ${drag.pointerY - drag.offsetY}px)`,
          }}>
          <BoardCardBody item={draggedItem} onMove={() => {}} />
        </Card>
      ) : null}
    </Section>
  );
}
