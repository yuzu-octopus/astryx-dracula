// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > V[g=8 a=center] > (V[g=1] > (H[g=2 a=center] > Ic + Tx"Hi, Vlad"[t=body]) + Hd"Where should we start?"[level=1 type=display-2]) + ChC"Ask anything" + (V[g=6] > (TgG"Category" > H[g=1 wrap] > Tg"Writing"*4) + Hd"Suggested prompts"[level=2] + (G[c={min:280} g=3] > (CC[p=4] > V[g=0.5] > Hd"Draft"[level=3] + Tx"Compose"[t=body])*4))

import {useRef, useState, type CSSProperties} from 'react';

import {Layout, LayoutContent, VStack, HStack} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {
  ChatComposer,
  ChatComposerDrawer,
  ChatComposerInput,
  ChatDictationButton,
  useChatDictation,
  type ChatComposerInputHandle,
  type ChatComposerToken,
  type ChatComposerTrigger,
} from '@astryxdesign/core/Chat';
import {
  createStaticSource,
  TypeaheadItem,
  type SearchableItem,
} from '@astryxdesign/core/Typeahead';
import {ToggleButton, ToggleButtonGroup} from '@astryxdesign/core/ToggleButton';
import {Token} from '@astryxdesign/core/Token';
import {VisuallyHidden} from '@astryxdesign/core/VisuallyHidden';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {Icon} from '@astryxdesign/core/Icon';
import {DropdownMenu, DropdownMenuItem} from '@astryxdesign/core/DropdownMenu';
import {
  Settings,
  AtSign,
  Sparkles,
  SquarePen,
  CodeXml,
  Search,
  Lock,
  Clock,
  Lightbulb,
} from 'lucide-react';

// Fill the content area so the greeting and composer stay vertically centered.
// `height`, not `minHeight`. A percentage min-height resolves against the
// containing block's DEFINITE height and computes to 0 when that is indefinite
// (CSS 2.1 10.5), so against a content-sized host it contributes nothing and
// the Layout's `height: 100%` still resolves to auto -- the edit is a no-op.
// Viewport units are absolute and need no ancestor, which is why every working
// instance in this repo uses them (editor.tsx:302, file-explorer.tsx:265,
// messaging-shell.tsx:67, ai-chat.tsx:64, kanban-board.tsx:704).
const pageStyle: CSSProperties = {height: '100dvh'};
// Five --spacing-4 steps: the box opens at ~80px so the empty composer reads
// as a writing surface, not a single-line field. No single token is 80px.
const composerInput: CSSProperties = {minHeight: 'calc(var(--spacing-4) * 5)'};

// Suggestion cards shown once a category is selected.
const CATEGORY_SUGGESTIONS: Record<
  string,
  Array<{heading: string; body: string; prompt: string}>
> = {
  writing: [
    {
      heading: 'Draft a release announcement',
      body: 'Compose a clear, polished note for the night-shift crew',
      prompt: 'Help me draft a release announcement',
    },
    {
      heading: 'Improve my writing',
      body: 'Enhance the clarity, tone, and flow of my text',
      prompt: 'Review and improve the following text:',
    },
    {
      heading: 'Create a palette proposal',
      body: 'Write a proposal with hues, ramps, and contrast proofs',
      prompt: 'Help me write a palette proposal for',
    },
    {
      heading: 'Summarize a document',
      body: 'Condense a long grimoire into key takeaways',
      prompt: 'Summarize the following document into key points:',
    },
  ],
  coding: [
    {
      heading: 'Debug my code',
      body: 'Find and fix issues in a moonlit code snippet',
      prompt: 'Help me debug the following code:',
    },
    {
      heading: 'Write a function',
      body: 'Conjure a well-typed function warded against the dark',
      prompt: 'Write a function that',
    },
    {
      heading: 'Theme my editor',
      body: 'Port this palette to a Dracula editor theme',
      prompt: 'Convert the following colors to a Dracula theme:',
    },
    {
      heading: 'Review my pull request',
      body: 'Hunt bugs by moonlight, weigh contrast, bless the rite',
      prompt: 'Review this code for bugs and improvements:',
    },
  ],
  research: [
    {
      heading: 'Compare purple hues',
      body: 'Analyze the spectral trade-offs of each shade',
      prompt: 'Compare the pros and cons of',
    },
    {
      heading: 'Explain a concept',
      body: 'Unravel a tangled grimoire into plain night-tongue',
      prompt: 'Explain the concept of',
    },
    {
      heading: 'Find contrast proofs',
      body: 'Research AA pairings for text on dark surfaces',
      prompt: 'What are the best practices for',
    },
    {
      heading: 'Summarize findings',
      body: 'Compile research into a structured overview',
      prompt: 'Summarize the key findings on',
    },
  ],
  creative: [
    {
      heading: 'Brainstorm theme variants',
      body: 'Generate nocturnal concepts for a new variant',
      prompt: 'Brainstorm ideas for',
    },
    {
      heading: 'Write a dark tale',
      body: 'Spin a moonlit tale crawling with night creatures',
      prompt: 'Write a short story about',
    },
    {
      heading: 'Design a concept',
      body: 'Conjure nocturnal rites for product or visual haunts',
      prompt: 'Help me design a concept for',
    },
    {
      heading: 'Name a new shade',
      body: 'Craft a memorable name for a color or token',
      prompt: 'Create a catchy name for',
    },
  ],
};

// Category filters, shared by the toggle group and the composer mode menu.
const CATEGORIES = [
  {key: 'writing', label: 'Writing', icon: SquarePen},
  {key: 'coding', label: 'Coding', icon: CodeXml},
  {key: 'research', label: 'Research', icon: Search},
  {key: 'creative', label: 'Creative', icon: Lightbulb},
] as const;

// Composer mode menu: categories plus special modes.
const MODE_OPTIONS = [
  {key: 'auto', label: 'Auto', icon: Sparkles},
  ...CATEGORIES,
  {key: 'sensitive', label: 'Sensitive', icon: Lock},
  {key: 'deep', label: 'Deep Mode', icon: Clock},
] as const;

// Modes that insert a composer token instead of switching the active category.
const TOKEN_MODES: Record<string, string> = {
  sensitive: '/sensitive',
  deep: '/deep-mode',
};

// Composer trigger data: @ mentions and / commands.
const MENTION_ITEMS: SearchableItem<{role: string}>[] = [
  {id: 'vesper', label: 'Vesper Lin', auxiliaryData: {role: 'Design Systems'}},
  {id: 'alex', label: 'Alex Nocturne', auxiliaryData: {role: 'Frontend'}},
  {id: 'sam', label: 'Sam Sable', auxiliaryData: {role: 'Backend'}},
  {id: 'jordan', label: 'Jordan Hex', auxiliaryData: {role: 'Product'}},
  {id: 'taylor', label: 'Taylor Twilight', auxiliaryData: {role: 'Design'}},
  {id: 'morgan', label: 'Morgan Morrow', auxiliaryData: {role: 'Infrastructure'}},
];

const COMMAND_ITEMS: SearchableItem<{description: string}>[] = [
  {
    id: 'summarize',
    label: 'summarize',
    auxiliaryData: {description: 'Summarize the conversation'},
  },
  {
    id: 'translate',
    label: 'translate',
    auxiliaryData: {description: 'Translate text to another language'},
  },
  {
    id: 'search',
    label: 'search',
    auxiliaryData: {description: 'Search the web or documents'},
  },
  {
    id: 'code',
    label: 'code',
    auxiliaryData: {description: 'Generate or explain code'},
  },
  {
    id: 'help',
    label: 'help',
    auxiliaryData: {description: 'Show available commands'},
  },
];

// One factory for both composer triggers. Render (TypeaheadItem + auxiliary
// description) and select (token value/label/variant) differ per trigger;
// the trigger shape doesn't.
function makeTrigger<TAux>({
  character,
  items,
  getDescription,
  toToken,
}: {
  character: string;
  items: SearchableItem<TAux>[];
  getDescription: (aux: TAux | undefined) => string | undefined;
  toToken: (item: SearchableItem<TAux>) => string | ChatComposerToken;
}): ChatComposerTrigger {
  return {
    character,
    searchSource: createStaticSource(items),
    renderItem: item => (
      <TypeaheadItem
        item={item}
        description={getDescription(item.auxiliaryData as TAux | undefined)}
      />
    ),
    onSelect: item => toToken(item as SearchableItem<TAux>),
  };
}

const mentionTrigger = makeTrigger({
  character: '@',
  items: MENTION_ITEMS,
  getDescription: aux => aux?.role,
  toToken: item => ({
    value: `@${item.id}`,
    label: item.label,
    variant: 'cyan',
  }),
});

const commandTrigger = makeTrigger({
  character: '/',
  items: COMMAND_ITEMS,
  getDescription: aux => aux?.description,
  toToken: item => ({
    value: `/${item.label}`,
    label: `/${item.label}`,
    variant: 'yellow',
  }),
});

const composerTriggers = [mentionTrigger, commandTrigger];

/** Composer attachment. The name is user-facing; the id is the React key, since
 * two dropped files can share a name. */
interface Attachment {
  id: string;
  name: string;
}

const INITIAL_ATTACHMENTS: Attachment[] = [
  'palette_brief.pdf',
  'nocturne_v2.fig',
  'api_spec.yaml',
  'contrast_audit.csv',
  'dracula_spec.pdf',
].map(name => ({id: crypto.randomUUID(), name}));

// The composer's imperative insert methods mutate the DOM without emitting a
// change, so dispatch an input event to sync its value and clear the placeholder.
const syncComposerValue = () => {
  document.activeElement?.dispatchEvent(new Event('input', {bubbles: true}));
};

// One inserter for every composer write. `insertText` replaces the selection
// (suggestion prompts); `insertToken` inserts a chip at the cursor without
// touching the selection (mentions, mode tokens).
function insertIntoComposer(
  input: ChatComposerInputHandle | null,
  write: {text: string} | {token: ChatComposerToken},
  collapseToEnd = false,
) {
  if (!input) {
    return;
  }
  input.focus();
  if (document.activeElement) {
    if (collapseToEnd) {
      const sel = window.getSelection();
      sel?.selectAllChildren(document.activeElement);
      sel?.collapseToEnd();
    } else {
      window.getSelection()?.selectAllChildren(document.activeElement);
    }
  }
  if ('text' in write) {
    input.insertText(write.text);
  } else {
    input.insertToken(write.token);
  }
  syncComposerValue();
}

// Main component

export default function AiChatLanding() {
  const [mode, setMode] = useState<string | null>('auto');
  const [category, setCategory] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(
    INITIAL_ATTACHMENTS,
  );
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const composerInputRef = useRef<ChatComposerInputHandle>(null);
  const shouldFocusComposerRef = useRef(false);
  // Dictation mic stays: the composer still renders ChatDictationButton below.
  const dictation = useChatDictation({inputRef: composerInputRef});

  const activeMode = MODE_OPTIONS.find(m => m.key === mode) ?? MODE_OPTIONS[0];
  const suggestions = category ? CATEGORY_SUGGESTIONS[category] : null;

  const applySuggestion = (prompt: string) => {
    insertIntoComposer(composerInputRef.current, {text: prompt});
  };
  const insertMention = (item: (typeof MENTION_ITEMS)[number]) => {
    insertIntoComposer(
      composerInputRef.current,
      {
        token: {
          value: `@${item.id}`,
          label: item.label,
          variant: 'cyan',
        },
      },
      true,
    );
  };
  const insertModeToken = (label: string) => {
    insertIntoComposer(composerInputRef.current, {
      token: {
        value: label,
        label,
        variant: 'orange',
      },
    });
  };

  return (
    <Layout
      height="fill"
      contentWidth={720}
      padding={6}
      content={
        <LayoutContent>
          <VStack gap={8} vAlign="center" style={pageStyle}>
            {/* Greeting */}
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Icon icon={Sparkles} size="md" color="secondary" />
                <Text type="body">
                  Hi, Vlad
                </Text>
              </HStack>
              <Heading level={1} type="display-2">
                Where should we start?
              </Heading>
            </VStack>

            {/* Composer */}
            <ChatComposer
              onSubmit={() => {}}
              placeholder="Ask anything"
              input={
                <ChatComposerInput
                  handleRef={composerInputRef}
                  triggers={composerTriggers}
                  style={composerInput}
                  onFiles={files =>
                    setAttachments(prev => [
                      ...prev,
                      ...files.map(file => ({
                        id: crypto.randomUUID(),
                        name: file.name,
                      })),
                    ])
                  }
                />
              }
              drawer={
                attachments.length > 0 ? (
                  <ChatComposerDrawer count={attachments.length}>
                    {attachments.map(attachment => (
                      <Token
                        key={attachment.id}
                        label={attachment.name}
                        onRemove={() =>
                          setAttachments(prev =>
                            prev.filter(item => item.id !== attachment.id),
                          )
                        }
                      />
                    ))}
                  </ChatComposerDrawer>
                ) : undefined
              }
              headerActions={
                <DropdownMenu
                  button={{
                    label: 'Reference',
                    variant: 'ghost',
                    size: 'sm',
                    icon: <Icon icon={AtSign} size="sm" />,
                    isIconOnly: true,
                  }}
                  hasChevron={false}
                  menuWidth={240}>
                  {MENTION_ITEMS.map(item => (
                    <DropdownMenuItem
                      key={item.id}
                      label={item.label}
                      description={item.auxiliaryData?.role}
                      onClick={() => insertMention(item)}
                    />
                  ))}
                </DropdownMenu>
              }
              footerActions={
                <>
                  <DropdownMenu
                    button={{
                      label: activeMode.label,
                      variant: 'ghost',
                      size: 'md',
                      icon: <Icon icon={activeMode.icon} size="sm" />,
                      children: activeMode.label,
                    }}
                    menuWidth={200}
                    isMenuOpen={isModeMenuOpen}
                    onOpenChange={isOpen => {
                      setIsModeMenuOpen(isOpen);
                      // Restore focus to the composer after inserting a mode token.
                      if (!isOpen && shouldFocusComposerRef.current) {
                        shouldFocusComposerRef.current = false;
                        setTimeout(() => composerInputRef.current?.focus(), 50);
                      }
                    }}
                    items={MODE_OPTIONS.flatMap(opt => {
                      const item = {
                        label: opt.label,
                        icon: opt.icon,
                        onClick: () => {
                          const tokenLabel = TOKEN_MODES[opt.key];
                          if (tokenLabel) {
                            insertModeToken(tokenLabel);
                            shouldFocusComposerRef.current = true;
                          } else {
                            setMode(opt.key);
                          }
                        },
                      };
                      return opt.key === 'sensitive'
                        ? [{type: 'divider' as const}, item]
                        : [item];
                    })}
                  />
                  <DropdownMenu
                    button={{
                      label: 'Settings',
                      variant: 'ghost',
                      size: 'md',
                      icon: <Icon icon={Settings} size="sm" />,
                      children: 'Settings',
                    }}
                    menuWidth={200}
                    items={[
                      {label: 'Preferences', onClick: () => {}},
                      {label: 'Keyboard shortcuts', onClick: () => {}},
                      {label: 'About', onClick: () => {}},
                    ]}
                  />
                </>
              }
              sendActions={<ChatDictationButton dictation={dictation} />}
            />

            {/* Category filters + suggestion cards */}
            <VStack gap={6}>
              <ToggleButtonGroup
                label="Category"
                value={category}
                onChange={setCategory}
                size="lg">
                {/* ToggleButtonGroup is a single nowrap flex row and the four
                    chips measure 488px together. In a 390px pane the fourth
                    chip was cut in half by the viewport edge, which reads as a
                    rendering fault rather than as overflow. The wrapping
                    HStack gives the row a second line instead; the group keeps
                    its own selection semantics either way. */}
                <HStack gap={1} wrap="wrap">
                  {CATEGORIES.map(cat => (
                    <ToggleButton
                      key={cat.key}
                      value={cat.key}
                      label={cat.label}
                      icon={<Icon icon={cat.icon} size="sm" />}
                    />
                  ))}
                </HStack>
              </ToggleButtonGroup>

              {suggestions && (
                <>
                  <VisuallyHidden as="h2">Suggested prompts</VisuallyHidden>
                  <Grid columns={{minWidth: 280}} gap={3}>
                  {suggestions.map(suggestion => (
                    <ClickableCard
                      key={suggestion.heading}
                      label={suggestion.heading}
                      variant="muted"
                      padding={4}
                      onClick={() => {
                        applySuggestion(suggestion.prompt);
                        setMode(category);
                      }}>
                      <VStack gap={0.5}>
                        <Heading level={3}>{suggestion.heading}</Heading>
                        <Text type="body" color="secondary">
                          {suggestion.body}
                        </Text>
                      </VStack>
                    </ClickableCard>
                  ))}
                  </Grid>
                </>
              )}
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
