// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > (LP[p=4] > V[g=2] > TI"Search files" + TreeList) + (LC[p=0] > (Hd"Code editor"[level=1] + V > (SI[fill] > Cd) + (V > (TL > Tab"Terminal"! + Tab"Problems" + Tab"Output" + Tab"Debug") + Cd))) + (LP[p=4] > V[g=3] > (SG > SGI"Properties"! + SGI"History") + (V[g=3] > (V[g=1] > Hd"NightCounter.tsx"[level=3] + Tx"src/components/NightCounter.tsx"[t=supporting]) + ML + (V[g=2] > B.secondary"Format Document" + B.secondary"Go to Definition" + B.secondary"Find References")))

import {useState, useMemo, type CSSProperties} from 'react';

import {Layout, LayoutContent, LayoutPanel} from '@astryxdesign/core/Layout';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {ResizeHandle, useResizable} from '@astryxdesign/core/Resizable';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Center} from '@astryxdesign/core/Center';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Stack, StackItem} from '@astryxdesign/core/Layout';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {Button} from '@astryxdesign/core/Button';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {List, ListItem} from '@astryxdesign/core/List';
import {Icon} from '@astryxdesign/core/Icon';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TreeList} from '@astryxdesign/core/TreeList';
import type {TreeListItemData} from '@astryxdesign/core/TreeList';
import {Folder, FileText, Search} from 'lucide-react';

const styles: Record<string, CSSProperties> = {
  contentFill: {
    height: '100%',
  },
  terminalWrapper: {
    minHeight: 0,
    overflow: 'hidden',
    display: 'grid',
  },
  tabListPadding: {
    paddingTop: 'var(--spacing-2)',
  },
  metadataCompact: {
    gap: 'var(--spacing-1) var(--spacing-3)',
  },
  editorArea: {
    overflow: 'auto',
    minHeight: 0,
  },
  fileExplorer: {
    minWidth: 0,
  },
  propertiesPanel: {
    height: '100%',
  },
  propertiesContent: {
    flex: 1,
    minHeight: 0,
  },
  propertyActions: {
    marginTop: 'auto',
  },
  terminalPanel: {
    flexShrink: 0,
    overflow: 'hidden',
  },
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'clip',
    whiteSpace: 'nowrap',
  },
};

const EDITOR_CODE = `import {useState, useCallback} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 16,
};
const counterStyle = {
  fontSize: 48,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
};

export default function NightCounter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div style={containerStyle}>
      <Text type="label">Night counter</Text>
      <span style={counterStyle}>
        {count}
      </span>
      <Button label="Increment" onClick={increment} />
      <Button label="Reset" variant="secondary" onClick={reset} />
    </div>
  );
}`;

const TERMINAL_OUTPUT = `$ yarn dev
yarn run v1.22.22
$ next dev
   \u25B2 Next.js 15.5.15
   - Local:   http://localhost:3000

 \u2713 Ready in 2.4s
 \u25CB Compiling /night-counter ...
 \u2713 Compiled /night-counter in 1.2s (847 modules)
 GET /night-counter 200 in 1340ms

$ `;

const OUTPUT_LOG = `[@astryxdesign/core] theme tokens resolved in 38ms
[@astryxdesign/core] 12 components hydrated, 0 warnings
[HMR] connected, watching src/components/NightCounter.tsx
[HMR] updated src/tokens.ts in 122ms`;

function buildFileTree(
  onFileClick: (name: string) => void,
): TreeListItemData[] {
  const label = (text: string) => <Text maxLines={1}>{text}</Text>;
  const file = (id: string): TreeListItemData => ({
    id,
    label: label(id),
    startContent: <Icon icon={FileText} size="xsm" />,
    onClick: () => onFileClick(id),
  });
  return [
    {
      id: 'src',
      label: label('src'),
      startContent: <Icon icon={Folder} size="xsm" />,
      isExpanded: true,
      children: [
        {
          id: 'components',
          label: label('components'),
          startContent: <Icon icon={Folder} size="xsm" />,
          isExpanded: true,
          children: [
            file('NightCounter.tsx'),
            file('Header.tsx'),
            file('Layout.tsx'),
          ],
        },
        {
          id: 'pages',
          label: label('pages'),
          startContent: <Icon icon={Folder} size="xsm" />,
          isExpanded: true,
          children: [file('index.tsx'), file('about.tsx')],
        },
        {
          id: 'styles',
          label: label('styles'),
          startContent: <Icon icon={Folder} size="xsm" />,
          isExpanded: true,
          children: [file('tokens.ts'), file('theme.ts')],
        },
      ],
    },
    file('package.json'),
    file('tsconfig.json'),
    file('next.config.mjs'),
  ];
}

function filterFileTree(
  items: TreeListItemData[],
  query: string,
): TreeListItemData[] {
  const out: TreeListItemData[] = [];
  for (const item of items) {
    const children = item.children
      ? filterFileTree(item.children, query)
      : undefined;
    if (
      item.id.toLowerCase().includes(query) ||
      (children && children.length > 0)
    ) {
      out.push({...item, ...(children ? {children, isExpanded: true} : null)});
    }
  }
  return out;
}

const PROPERTIES = [
  {label: 'Type', value: 'React Component'},
  {label: 'Language', value: 'TypeScript'},
  {label: 'Lines', value: '42'},
  {label: 'Size', value: '1.2 KB'},
  {label: 'Last modified', value: '2 hours ago'},
  {label: 'Imports', value: '4 modules'},
  {label: 'Exports', value: '1 default'},
  {label: 'Hooks', value: 'useState, useCallback'},
];

const HISTORY_ITEMS = [
  {label: 'Opened NightCounter.tsx', time: '2 min ago'},
  {label: 'Opened Layout.tsx', time: '6 min ago'},
  {label: 'Viewed tokens.ts', time: '11 min ago'},
];

export default function IdeWorkspace() {
  const [activeFile, setActiveFile] = useState('NightCounter.tsx');
  const [activeTermTab, setActiveTermTab] = useState('terminal');
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  const [query, setQuery] = useState('');
  const fileTree = useMemo(() => buildFileTree(setActiveFile), []);
  const visibleTree = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? filterFileTree(fileTree, q) : fileTree;
  }, [fileTree, query]);

  const startPanel = useResizable({
    defaultSize: 256,
    minSizePx: 160,
    maxSizePx: 400,
    collapsible: true,
    collapsedSize: 50,
  });

  const endPanel = useResizable({
    defaultSize: 320,
    minSizePx: 180,
    maxSizePx: 500,
    collapsible: true,
    collapsedSize: 50,
  });

  // Capped so the terminal cannot swallow the canvas: the editor stack above
  // has no minimum of its own, and an unbounded drag leaves nothing to grab.
  const bottomPanel = useResizable({
    defaultSize: 300,
    minSizePx: 80,
    maxSizePx: 520,
    collapsible: true,
    collapsedSize: 40,
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={0}>
          <Heading level={1} style={styles.visuallyHidden}>
            Code editor
          </Heading>
          <Layout
            height="fill"
            start={
              isMobile ? undefined : (
                <>
                  {!startPanel.isCollapsed && (
                    <LayoutPanel
                      width={startPanel.size}
                      hasDivider={false}
                      padding={4}>
                      <Stack
                        direction="vertical"
                        style={styles.fileExplorer}
                        gap={2}>
                        <TextInput
                          label="Search files"
                          isLabelHidden
                          value={query}
                          onChange={setQuery}
                          placeholder="Search the night"
                          size="md"
                          startIcon={Search}
                          hasClear
                        />
                        {visibleTree.length > 0 ? (
                          <TreeList items={visibleTree} density="compact" />
                        ) : (
                          <EmptyState
                            title="No files match"
                            description={`Nothing in the night answers to "${query.trim()}".`}
                            isCompact
                          />
                        )}
                      </Stack>
                    </LayoutPanel>
                  )}
                  <ResizeHandle
                    direction="horizontal"
                    hasDivider
                    isAlwaysVisible={false}
                    resizable={startPanel.props}
                    label="Resize file explorer"
                  />
                </>
              )
            }
            content={
              <LayoutContent padding={0}>
                <Layout
                  height="fill"
                  content={
                    <LayoutContent padding={0}>
                      <Stack direction="vertical" style={styles.contentFill}>
                        <StackItem size="fill" style={styles.editorArea}>
                          <CodeBlock
                            code={EDITOR_CODE}
                            language="typescript"
                            container="section"
                            hasLanguageLabel={false}
                            hasLineNumbers
                            highlightLines={[21]}
                            hasCopyButton={false}
                            size="sm"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderWidth: 0,
                              borderRadius: 0,
                            }}
                          />
                        </StackItem>
                        <ResizeHandle
                          direction="vertical"
                          hasDivider
                          isReversed
                          isAlwaysVisible={false}
                          resizable={bottomPanel.props}
                          label="Resize terminal"
                        />
                        {!bottomPanel.isCollapsed && (
                          <Stack
                            direction="vertical"
                            height={bottomPanel.size}
                            style={styles.terminalPanel}>
                            <TabList
                              value={activeTermTab}
                              onChange={val => setActiveTermTab(val)}
                              size="sm"
                              hasDivider={false}
                              style={styles.tabListPadding}>
                              <Tab label="Terminal" value="terminal" />
                              <Tab label="Problems" value="problems" />
                              <Tab label="Output" value="output" />
                              <Tab label="Debug" value="debug" />
                            </TabList>
                            <StackItem
                              size="fill"
                              style={styles.terminalWrapper}>
                              {activeTermTab === 'terminal' && (
                                <CodeBlock
                                  code={TERMINAL_OUTPUT}
                                  language="bash"
                                  container="section"
                                  hasLanguageLabel={false}
                                  hasCopyButton={false}
                                  size="sm"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderWidth: 0,
                                    borderRadius: 0,
                                  }}
                                />
                              )}
                              {activeTermTab === 'output' && (
                                <CodeBlock
                                  code={OUTPUT_LOG}
                                  language="bash"
                                  container="section"
                                  hasLanguageLabel={false}
                                  hasCopyButton={false}
                                  size="sm"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderWidth: 0,
                                    borderRadius: 0,
                                  }}
                                />
                              )}
                              {activeTermTab === 'problems' && (
                                <Center style={{height: '100%'}}>
                                  <EmptyState
                                    title="No problems"
                                    description="The night watch reports no errors or warnings."
                                    isCompact
                                  />
                                </Center>
                              )}
                              {activeTermTab === 'debug' && (
                                <Center style={{height: '100%'}}>
                                  <EmptyState
                                    title="No debug session"
                                    description="Start debugging to inspect the night shift."
                                    isCompact
                                  />
                                </Center>
                              )}
                            </StackItem>
                          </Stack>
                        )}
                      </Stack>
                    </LayoutContent>
                  }
                  end={
                    isMobile ? undefined : (
                      <>
                        <ResizeHandle
                          direction="horizontal"
                          hasDivider
                          isReversed
                          isAlwaysVisible={false}
                          resizable={endPanel.props}
                          label="Resize properties panel"
                        />
                        {!endPanel.isCollapsed && (
                          <LayoutPanel
                            width={endPanel.size}
                            hasDivider={false}
                            padding={4}>
                            <Stack
                              direction="vertical"
                              gap={3}
                              style={styles.propertiesPanel}>
                              <SegmentedControl
                                label="Properties panel sections"
                                value={activePropertiesTab}
                                onChange={setActivePropertiesTab}
                                size="sm"
                                layout="fill">
                                <SegmentedControlItem
                                  label="Properties"
                                  value="properties"
                                />
                                <SegmentedControlItem
                                  label="History"
                                  value="history"
                                />
                              </SegmentedControl>
                              {activePropertiesTab === 'properties' ? (
                                <Stack
                                  direction="vertical"
                                  gap={3}
                                  style={styles.propertiesContent}>
                                  <Stack direction="vertical" gap={1}>
                                    <Heading level={3} maxLines={1}>
                                      {activeFile}
                                    </Heading>
                                    <Text
                                      color="secondary"
                                      type="supporting"
                                      maxLines={1}>
                                      src/components/{activeFile}
                                    </Text>
                                  </Stack>
                                  <MetadataList style={styles.metadataCompact}>
                                    {PROPERTIES.map(prop => (
                                      <MetadataListItem
                                        key={prop.label}
                                        label={prop.label}>
                                        {prop.value}
                                      </MetadataListItem>
                                    ))}
                                  </MetadataList>
                                  <Stack
                                    direction="vertical"
                                    gap={2}
                                    style={styles.propertyActions}>
                                    <Button
                                      label="Format Document"
                                      size="sm"
                                      variant="secondary"
                                    />
                                    <Button
                                      label="Go to Definition"
                                      size="sm"
                                      variant="secondary"
                                    />
                                    <Button
                                      label="Find References"
                                      size="sm"
                                      variant="secondary"
                                    />
                                  </Stack>
                                </Stack>
                              ) : (
                                <Stack direction="vertical" gap={1}>
                                  <List>
                                    {HISTORY_ITEMS.map(item => (
                                      <ListItem
                                        key={item.label}
                                        label={item.label}
                                        endContent={
                                          <Text
                                            type="supporting"
                                            color="secondary"
                                            maxLines={1}
                                            hasTabularNumbers>
                                            {item.time}
                                          </Text>
                                        }
                                        startContent={
                                          <StatusDot
                                            variant="neutral"
                                            label="Timeline marker"
                                          />
                                        }
                                      />
                                    ))}
                                  </List>
                                </Stack>
                              )}
                            </Stack>
                          </LayoutPanel>
                        )}
                      </>
                    )
                  }
                />
              </LayoutContent>
            }
          />
        </LayoutContent>
      }
    />
  );
}
