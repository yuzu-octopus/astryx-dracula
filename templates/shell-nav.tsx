// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @topNav=(TN) @sideNav=(SN > TL)] > L > (LH[divider] > H[g=2 wrap] > C.muted[p=0]*3) + (LC[p=6] > V[g=2] > (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*3 + C.muted[p=0] + (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*4 + C.muted[p=0] + (H[g=3 a=center] > C.muted[p=0] + C.muted[p=0])*5)

import {Fragment, useState, useMemo, useEffect} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Layout, LayoutHeader, LayoutContent} from '@astryxdesign/core/Layout';
import {TopNav} from '@astryxdesign/core/TopNav';
import {DropdownMenu, DropdownMenuItem} from '@astryxdesign/core/DropdownMenu';
import {CommandPalette} from '@astryxdesign/core/CommandPalette';
import {createStaticSource} from '@astryxdesign/core/Typeahead';
import {Divider} from '@astryxdesign/core/Divider';
import {Kbd} from '@astryxdesign/core/Kbd';
import {SideNav} from '@astryxdesign/core/SideNav';
import {TreeList} from '@astryxdesign/core/TreeList';
import type {TreeListItemData} from '@astryxdesign/core/TreeList';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {VStack, HStack} from '@astryxdesign/core/Stack';
import {Search, Folder, FileText} from 'lucide-react';

const noop = () => {};

const folder = (
  id: string,
  children: TreeListItemData[],
  isExpanded = true,
): TreeListItemData => ({
  id,
  label: <Text maxLines={1}>{id}</Text>,
  startContent: <Icon icon={Folder} size="xsm" />,
  isExpanded,
  children,
});

const file = (id: string, isSelected = false): TreeListItemData => ({
  id,
  label: <Text maxLines={1}>{id}</Text>,
  startContent: <Icon icon={FileText} size="xsm" />,
  isSelected,
});

const FILE_TREE: TreeListItemData[] = [
  folder('src', [
    folder('components', [
      file('AppShell.tsx', true),
      file('TopNav.tsx'),
      file('SideNav.tsx'),
    ]),
    folder('hooks', [file('useTheme.ts'), file('useResizable.ts')]),
    file('index.tsx'),
    file('App.tsx'),
  ]),
  folder('public', [file('favicon.ico'), file('robots.txt')], false),
  file('package.json'),
  file('tsconfig.json'),
  file('README.md'),
];

// Each menu is split into groups; groups are separated by a divider.
// `[label, shortcut]` — the shortcut renders as a single combined Kbd
// (e.g. ⌘N); an empty shortcut renders no Kbd.
type MenuEntry = [label: string, shortcut: string];

// Wide enough that label + Kbd shortcut never clip at the menu edge —
// "Previous Tab ⌃⇧⇥" is the widest row and touched the border at 280.
const MENU_WIDTH = 300;

const MENUS: {label: string; groups: MenuEntry[][]}[] = [
  {
    label: 'File',
    groups: [
      [
        ['New File', '⌘N'],
        ['New Window', '⇧⌘N'],
      ],
      [
        ['Open…', '⌘O'],
        ['Save', '⌘S'],
        ['Save As…', '⇧⌘S'],
      ],
      [['Close Editor', '⌘W']],
    ],
  },
  {
    label: 'Edit',
    groups: [
      [
        ['Undo', '⌘Z'],
        ['Redo', '⇧⌘Z'],
      ],
      [
        ['Cut', '⌘X'],
        ['Copy', '⌘C'],
        ['Paste', '⌘V'],
      ],
      [['Find', '⌘F']],
    ],
  },
  {
    label: 'View',
    groups: [
      [['Command Palette', '⇧⌘P']],
      [
        ['Explorer', '⇧⌘E'],
        ['Search', '⇧⌘F'],
      ],
      [
        ['Toggle Terminal', '⌃`'],
        ['Zen Mode', '⌘K'],
      ],
    ],
  },
  {
    label: 'Window',
    groups: [
      [
        ['Minimize', '⌘M'],
        ['Zoom', ''],
      ],
      [
        ['Next Tab', '⌃⇥'],
        ['Previous Tab', '⌃⇧⇥'],
      ],
      [['Bring All to Front', '']],
    ],
  },
  {
    label: 'Help',
    groups: [
      [
        ['Documentation', ''],
        ['Release Notes', ''],
        ['Report Issue', ''],
        ['About', ''],
      ],
    ],
  },
];

const CODE_LINES = [
  {id: 'line-1', width: '38%'},
  {id: 'line-2', width: '62%'},
  {id: 'line-3', width: '54%'},
  {id: 'line-4', width: '0%'},
  {id: 'line-5', width: '46%'},
  {id: 'line-6', width: '70%'},
  {id: 'line-7', width: '58%'},
  {id: 'line-8', width: '34%'},
  {id: 'line-9', width: '0%'},
  {id: 'line-10', width: '50%'},
  {id: 'line-11', width: '66%'},
  {id: 'line-12', width: '42%'},
  {id: 'line-13', width: '60%'},
  {id: 'line-14', width: '28%'},
];

const EDITOR_TABS = ['AppShell.tsx', 'TopNav.tsx', 'theme.ts'];

const COMMANDS = [
  {id: 'new-file', label: 'New File'},
  {id: 'open-file', label: 'Open File…'},
  {id: 'save-all', label: 'Save All'},
  {id: 'find-in-files', label: 'Find in Files'},
  {id: 'toggle-terminal', label: 'Toggle Terminal'},
  {id: 'go-to-symbol', label: 'Go to Symbol…'},
  {id: 'appshell', label: 'AppShell.tsx'},
  {id: 'topnav', label: 'TopNav.tsx'},
  {id: 'sidenav', label: 'SideNav.tsx'},
  {id: 'use-theme', label: 'useTheme.ts'},
  {id: 'theme', label: 'theme.ts'},
];

export default function ShellNav() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const searchSource = useMemo(() => createStaticSource(COMMANDS), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <AppShell
        contentPadding={0}
        topNav={
          <TopNav
            label="Dracula Studio menu bar"
            startContent={
              <>
                {MENUS.map(menu => (
                  <DropdownMenu
                    key={menu.label}
                    button={{label: menu.label, variant: 'ghost', size: 'sm'}}
                    hasChevron={false}
                    menuWidth={MENU_WIDTH}>
                    {/* Keyed by the group's first label, not its position:
                        an index key remounts every group when the menu
                        data shifts. `gi` only decides the divider. */}
                    {menu.groups.map((group, gi) => (
                      <Fragment key={group[0][0]}>
                        {gi > 0 && <Divider />}
                        {group.map(([label, shortcut]) => (
                          <DropdownMenuItem
                            key={label}
                            label={label}
                            onClick={noop}
                            endContent={
                              shortcut ? <Kbd keys={shortcut} /> : undefined
                            }
                          />
                        ))}
                      </Fragment>
                    ))}
                  </DropdownMenu>
                ))}
              </>
            }
            endContent={
              // A real palette trigger, not a lookalike field: the previous
              // TextInput swallowed keystrokes (fixed value, noop onChange)
              // while a wrapper div opened the palette on click. The dead Run
              // and Share buttons go with it — demo chrome must not ship
              // controls that do nothing.
              <Button
                label="Search files and commands"
                variant="secondary"
                size="sm"
                tooltip="Search files and commands (⌘K)"
                icon={<Icon icon={Search} size="sm" />}
                onClick={() => setIsPaletteOpen(true)}
              />
            }
          />
        }
        sideNav={
          <SideNav
            resizable={{defaultWidth: 240, minWidth: 180, maxWidth: 400}}>
            <TreeList items={FILE_TREE} density="compact" />
          </SideNav>
        }>
        <Layout
          height="fill"
          header={
            <LayoutHeader hasDivider padding={6}>
              {/* Wraps rather than clipping: three 132px tabs need ~410px. */}
              <HStack gap={2} wrap="wrap">
                {EDITOR_TABS.map(tab => (
                  <Card
                    key={tab}
                    variant="muted"
                    padding={0}
                    width={132}
                    height={36}
                  />
                ))}
              </HStack>
            </LayoutHeader>
          }
          content={
            <LayoutContent padding={6}>
              <VStack gap={2}>
                {CODE_LINES.map(line =>
                  line.width === '0%' ? (
                    <Card
                      key={line.id}
                      variant="muted"
                      padding={0}
                      width={1}
                      height={14}
                    />
                  ) : (
                    <HStack key={line.id} gap={3} vAlign="center">
                      <Card
                        variant="muted"
                        padding={0}
                        width={20}
                        height={14}
                      />
                      <Card
                        variant="muted"
                        padding={0}
                        width={line.width}
                        height={14}
                      />
                    </HStack>
                  ),
                )}
              </VStack>
            </LayoutContent>
          }
        />
      </AppShell>
      <CommandPalette
        isOpen={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        searchSource={searchSource}
        label="Search files and commands"
        onValueChange={() => setIsPaletteOpen(false)}
      />
    </>
  );
}
