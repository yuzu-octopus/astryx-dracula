// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC > V[g=8 a=center] > (V[g=1] > (H[g=2 a=center] > Ic + Tx.lg"Hi, Vlad") + Hd"Where should we start?"[level=1 type=display-2]) + ChC"Ask anything" + (V[g=6] > (TgG"Category" > Tg"Writing"*4) + Hd"Suggested prompts"[level=2] + (G[c={min:280} g=3] > (CC[p=4] > V[g=0.5] > Hd"Draft"[level=3] + Tx"Compose"[t=body])*4))

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
const pageStyle: CSSProperties = {minHeight: '100%'};
// Five --spacing-4 steps: the box opens at ~80px so the empty composer reads
// as a writing surface, not a single-line field. No single token is 80px.
const composerInput: CSSProperties = {minHeight: 'calc(var(--spacing-4) * 5)'};
const categories: CSSProperties = {paddingInline: 'var(--space-viewport)'};

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

const mentionTrigger: ChatComposerTrigger = {
  character: '@',
  searchSource: createStaticSource(MENTION_ITEMS),
  renderItem: item => (
    <TypeaheadItem
      item={item}
      description={(item.auxiliaryData as {role: string})?.role}
    />
  ),
  onSelect: item => ({
    value: `@${item.id}`,
    label: item.label,
    variant: 'cyan',
  }),
};

const commandTrigger: ChatComposerTrigger = {
  character: '/',
  searchSource: createStaticSource(COMMAND_ITEMS),
  renderItem: item => (
    <TypeaheadItem
      item={item}
      description={(item.auxiliaryData as {description: string})?.description}
    />
  ),
  onSelect: item => ({
    value: `/${item.label}`,
    label: `/${item.label}`,
    variant: 'yellow',
  }),
};

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
].map((name, index) => ({id: `file-${index + 1}`, name}));

// The composer's imperative insert methods mutate the DOM without emitting a
// change, so dispatch an input event to sync its value and clear the placeholder.
const syncComposerValue = () => {
  document.activeElement?.dispatchEvent(new Event('input', {bubbles: true}));
};

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
  // Two dropped files can share a name, so attachments carry their own id.
  const nextAttachmentId = useRef(INITIAL_ATTACHMENTS.length);
  const dictation = useChatDictation({inputRef: composerInputRef});

  const activeMode = MODE_OPTIONS.find(m => m.key === mode) ?? MODE_OPTIONS[0];
  const suggestions = category ? CATEGORY_SUGGESTIONS[category] : null;

  const applySuggestion = (prompt: string) => {
    const input = composerInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    if (document.activeElement) {
      window.getSelection()?.selectAllChildren(document.activeElement);
    }
    input.insertText(prompt);
    syncComposerValue();
  };

  const insertMention = (item: (typeof MENTION_ITEMS)[number]) => {
    const input = composerInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    if (document.activeElement) {
      const sel = window.getSelection();
      sel?.selectAllChildren(document.activeElement);
      sel?.collapseToEnd();
    }
    input.insertToken({
      value: `@${item.id}`,
      label: item.label,
      variant: 'cyan',
    });
    syncComposerValue();
  };

  const insertModeToken = (label: string) => {
    composerInputRef.current?.focus();
    composerInputRef.current?.insertToken({
      value: label,
      label,
      variant: 'orange',
    });
    syncComposerValue();
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
                <Icon icon={Sparkles} size="md" color="accent" />
                <Text type="large">
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
                        id: `file-${++nextAttachmentId.current}`,
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
            <VStack gap={6} style={categories}>
              <ToggleButtonGroup
                label="Category"
                value={category}
                onChange={setCategory}
                size="lg">
                {CATEGORIES.map(cat => (
                  <ToggleButton
                    key={cat.key}
                    value={cat.key}
                    label={cat.label}
                    icon={<Icon icon={cat.icon} size="sm" />}
                  />
                ))}
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
