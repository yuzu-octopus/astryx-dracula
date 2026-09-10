// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   TN"Nocturne" + (S[p6] > V[g10] > (Ctr > V[g4 a=center] > Hd"Little haunts"[level=1 type=display-2] + Tx"We believe"[t=body]) + (G[c={min:200,max:3} g4] > (C[p0] > AR + V[g2 a=center] > Bd + Hd"Product"[level=2] + Tx"Description"[t=body] + (H[g2] > NI + B"Add to cart"))*3)) + (V[g8] > (G[c={min:200} g4] > (GS[c=1] > C > Hd"Checkout"[level=2]) + (GS[c=2] > C > Hd"Night Owl AI"[level=2])) + (G[c={min:200} g4] > (GS[c=3] > C > T) + (GS[c=1] > C > Hd"Revenue"[level=2])))

/**
 * Theme Showcase — the storefront page each theme is previewed against, and
 * the only template that is deliberately shell-less: it paints its own TopNav
 * and page surfaces so a preview covers the whole viewport (no AppShell, no
 * Layout). Keep it that way.
 *
 * Responsive contract:
 *   > 600px  the inventory table renders all six columns
 *   <= 600px the table drops selection, location and tags, so a row fits the
 *            card without being read sideways
 * The card decks collapse to one column through Grid's minWidth, and
 * `isMobile` (host AppShell context; false when rendered standalone) trims the
 * top nav and switches the deck spans.
 */

import {type CSSProperties, type ReactNode} from 'react';
import {
  Plus,
  Search,
  Tag,
  Folder,
  MapPin,
  List,
  LayoutGrid,
  ShoppingBag,
  Banknote,
  Mic,
  CreditCard,
  Lock,
  X,
  Download,
  Smartphone,
  Wallet,
  User,
} from 'lucide-react';
import {Text, Heading} from '@astryxdesign/core/Text';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {useAppShellMobile} from '@astryxdesign/core/AppShell';
import {Grid, GridSpan} from '@astryxdesign/core/Grid';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Item} from '@astryxdesign/core/Item';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {SelectableCard} from '@astryxdesign/core/SelectableCard';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {Center} from '@astryxdesign/core/Center';
import {Section} from '@astryxdesign/core/Section';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {OverflowList} from '@astryxdesign/core/OverflowList';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {
  ChatComposer,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSystemMessage,
} from '@astryxdesign/core/Chat';

// Styles passed to Astryx components via their `style` prop. Astryx components
// forward the DOM `style` prop, so these work with no CSS compiler — in
// compiled builds and in the live playground preview alike.
const styles: Record<string, CSSProperties> = {
  card: {
    backgroundColor: 'var(--color-background-body)',
    color: 'var(--color-text-primary)',
    minWidth: 0,
    borderColor: 'transparent',
  },
  checkoutStack: {
    minWidth: 0,
    width: '100%',
  },
  paymentCardContent: {
    minWidth: 0,
    width: '100%',
    textAlign: 'center',
    wordBreak: 'break-word',
  },
  inventoryCard: {
    backgroundColor: 'var(--color-background-surface)',
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
  },
  inventoryHeader: {
    paddingBlock: 'var(--spacing-6)',
    paddingInline: 'var(--spacing-6)',
  },
  inventoryFilterRow: {
    paddingBlock: 'var(--spacing-4)',
    paddingInline: 'var(--spacing-6)',
    width: '100%',
    overflowX: 'auto' as const,
  },
  // Inset the table by --spacing-6 (the card is padding={0}) so its edge lines
  // up with the header/filter row in every theme's spacing scale.
  inventoryTableWrap: {
    paddingInline: 'var(--spacing-6)',
    paddingBlockEnd: 'var(--spacing-2)',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    maxWidth: 240,
  },
  filterRowFill: {
    flex: 1,
    minWidth: 0,
  },
  activityCard: {
    backgroundColor: 'var(--color-background-surface)',
    color: 'var(--color-text-primary)',
    minWidth: 0,
    height: '100%',
  },
  chatCard: {
    backgroundColor: 'var(--color-background-surface)',
    color: 'var(--color-text-primary)',
    minWidth: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  chatHeader: {
    paddingBlock: 'var(--spacing-4)',
    paddingInline: 'var(--spacing-4)',
  },
  activityCardStack: {
    height: '100%',
  },
  inventoryItemText: {
    minWidth: 0,
  },
  activityListFade: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    maskImage:
      'linear-gradient(to bottom, black calc(100% - 48px), transparent)',
    WebkitMaskImage:
      'linear-gradient(to bottom, black calc(100% - 48px), transparent)',
    marginInline: 'calc(var(--spacing-2) * -1)',
  },
  // The hero column: centered, narrower than the grid below it.
  contentFluid: {
    maxWidth: 880,
    marginInline: 'auto',
    minWidth: 0,
  },
  heroText: {
    textAlign: 'center' as const,
    maxWidth: 560,
  },
  centerText: {
    textAlign: 'center',
  },
  cardStack: {
    height: '100%',
  },
  cardDescription: {
    flex: 1,
    textAlign: 'center' as const,
  },
  // Store surfaces: the shell is intentionally absent, so the page paints its
  // own body and card-showcase bands.
  storeRoot: {
    minHeight: '100%',
    backgroundColor: 'var(--color-background-body)',
  },
  showcaseBand: {
    padding: 'var(--spacing-6)',
    backgroundColor: 'var(--color-background-surface)',
  },
  quantityInput: {
    // minWidth (not a hard width) so the field grows to fit the digit + the
    // theme's input padding. A fixed 40px was too tight on themes with larger
    // padding / bigger type scale (e.g. Matcha, Y2K), clipping the value.
    minWidth: 64,
    flexShrink: 0,
  },
  cartButton: {
    flex: 1,
  },
};

// Styles applied directly to plain DOM elements via the `style` prop.
// Plain inline styles so they render with no CSS compiler. All are static
// (no media/pseudo variants), so inline styles reproduce them exactly.
const inlineStyles: Record<string, CSSProperties> = {
  inventoryBannerWrap: {
    paddingInline: 'var(--spacing-6)',
    paddingBottom: 'var(--spacing-4)',
  },
  chatBody: {
    flex: 1,
    minHeight: 0,
    // The message region is the scroll owner: the card is stretched to the
    // grid row height, so longer conversations must scroll here rather than
    // clip against the card.
    overflowY: 'auto' as const,
  },
  chatSuggestions: {
    paddingInline: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-2)',
  },
  chatComposer: {
    paddingInline: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-4)',
  },
  // Center supplies the 32px box and the centering; only the paint stays here.
  activityIcon: {
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--color-background-muted)',
    color: 'var(--color-text-secondary)',
    flexShrink: 0,
  },
  cardBody: {
    padding: 'var(--spacing-4)',
    flex: 1,
  },
};

// Fills the AspectRatio box with a Dracula product scene. No Image primitive
// in Astryx (#2582), so product tiles are inline SVG on brand tokens.
const artImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
// Rounded inventory swatch. No radius prop where the swatch renders, so the
// SVG carries its own rounded corners (rx=4).
const thumbSwatch: CSSProperties = {
  flexShrink: 0,
  display: 'block',
};

// One Dracula accent per hero product slot. Purple stays off decorative art:
// it reads as interactive, and nothing here is tappable.
const PRODUCT_HUES = [
  'var(--dracula-green)',
  'var(--dracula-cyan)',
  'var(--dracula-yellow)',
];

// Grid recipes the store renders at every width above the phone layout. Kept
// at module scope: an object literal rebuilt per render is a new value prop
// every time.
const SHOWCASE_COLUMNS = {minWidth: 200, repeat: 'fit'} as const;
const PRODUCT_COLUMNS = {minWidth: 200, max: 3} as const;
const PAYMENT_COLUMNS = {minWidth: 70, max: 3} as const;
const EXPIRY_COLUMNS = {minWidth: 90, max: 2} as const;

/** Categorical badge variants usable for showcase product/inventory tags. */
export type ShowcaseBadgeVariant =
  | 'blue'
  | 'cyan'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

export interface ProductSpec {
  name: string;
  description: string;
  badge: string;
  badgeVariant: ShowcaseBadgeVariant;
}

const DEFAULT_PRODUCTS: ProductSpec[] = [
  {
    name: 'Moonphase Watch',
    description: 'Clean lines and lume that carry through the longest night.',
    badge: 'New',
    badgeVariant: 'blue',
  },
  {
    name: 'Night-Owl Headphones',
    description: 'Deep sound and soft cushions for all-night listening.',
    badge: 'Popular',
    badgeVariant: 'green',
  },
  {
    name: 'Coven Canvas Backpack',
    description: 'Waxed canvas with a quiet, moonlit profile.',
    badge: 'Limited',
    badgeVariant: 'yellow',
  },
];

// Dracula product scene: harvest moon over sleeping hills with a per-product
// accent glyph. All fills are brand vars, corners rx=4.
function ProductArt({hue, label}: {hue: string; label: string}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={artImage}
      role="img"
      aria-label={`${label} artwork`}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      <circle cx="200" cy="110" r="52" fill={hue} opacity={0.9} />
      <circle
        cx="184"
        cy="100"
        r={44}
        fill="var(--dracula-bg-light)"
        opacity={0.55}
      />
      <path
        d="M0 210 Q120 170 240 200 T400 190 V300 H0 Z"
        fill="var(--dracula-current-line)"
      />
      <path
        d="M0 245 Q140 215 300 240 T400 235 V300 H0 Z"
        fill="var(--dracula-bg)"
      />
      <g
        transform="translate(200 232)"
        fill="none"
        stroke={hue}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="-30" y="-30" width="60" height="60" rx={4} />
        <circle cx="13" cy="-13" r="2.5" fill={hue} stroke="none" />
        <path d="M-22 20 L-5 2 L7 12 L14 5 L23 15" />
      </g>
    </svg>
  );
}

// Rounded inventory swatch: Dracula surface with a per-row accent ring.
function ThumbSwatch({hue, label}: {hue: string; label: string}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={40}
      height={40}
      style={thumbSwatch}
      role="img"
      aria-label={`${label} swatch`}>
      <rect width={40} height={40} rx={5} fill="var(--dracula-bg-light)" />
      <rect
        x={1}
        y={1}
        width={38}
        height={38}
        rx={4}
        fill="none"
        stroke="var(--color-widget-content-border)"
      />
      <circle cx={20} cy={20} r={8} fill="none" stroke={hue} strokeWidth={3} />
    </svg>
  );
}

export interface ThemeShowcaseProps {
  /** The three hero product cards. Defaults to the nocturne store products. */
  products?: ProductSpec[];
  /** Inventory table rows. Defaults to the nocturne store inventory. */
  inventory?: InventoryRow[];
}

// Default export is the route page (sandbox renders this as a Next.js page, so
// it must take no props / satisfy PageProps). It renders the store with the
// nocturne defaults. Consumers that need per-theme content import the named
// `ThemeShowcaseStore` below and pass products/inventory.
export default function ThemeShowcase() {
  return <ThemeShowcaseStore />;
}

export function ThemeShowcaseStore({
  products = DEFAULT_PRODUCTS,
  inventory = DEFAULT_INVENTORY,
}: ThemeShowcaseProps = {}) {
  const {isMobile} = useAppShellMobile();
  return (
    <VStack gap={0} style={styles.storeRoot}>
      <StorePreview products={products} isMobile={isMobile} />
      <VStack gap={0} style={styles.showcaseBand}>
        <CardShowcase inventory={inventory} isMobile={isMobile} />
      </VStack>
    </VStack>
  );
}

function CardShowcase({
  inventory,
  isMobile,
}: {
  inventory: InventoryRow[];
  isMobile: boolean;
}) {
  const columns = isMobile ? 1 : SHOWCASE_COLUMNS;

  return (
    <VStack gap={8}>
      <Grid columns={columns} gap={4}>
        <GridSpan columns={1}>
          <CheckoutCard isMobile={isMobile} />
        </GridSpan>
        <GridSpan columns={isMobile ? 1 : 2}>
          <ChatCard />
        </GridSpan>
      </Grid>
      <Grid columns={columns} gap={4}>
        <GridSpan columns={isMobile ? 1 : 3}>
          <InventoryCard inventory={inventory} />
        </GridSpan>
        <GridSpan columns={1}>
          <LatestActivityCard isMobile={isMobile} />
        </GridSpan>
      </Grid>
    </VStack>
  );
}

function StorePreview({
  products,
  isMobile,
}: {
  products: ProductSpec[];
  isMobile: boolean;
}) {
  return (
    <VStack gap={0} data-theme-preview="true">
      <VStack gap={0}>
        <TopNav
          label="Theme preview navigation"
          heading={<TopNavHeading heading="Nocturne" />}
          centerContent={
            isMobile ? undefined : (
              <>
                <TopNavItem label="Shop" href="#/templates/theme-showcase" isSelected />
                <TopNavItem label="New In" href="#/templates/theme-showcase" />
                <TopNavItem label="Stories" href="#/templates/theme-showcase" />
                <TopNavItem label="Help" href="#/templates/theme-showcase" />
              </>
            )
          }
          endContent={
            <HStack gap={2} vAlign="center">
              <HStack gap={0.5}>
                <Button
                  label="Search"
                  tooltip="Search"
                  variant="ghost"
                  isIconOnly
                  icon={<Search size={20} />}
                  href="#/templates/theme-showcase"
                />
                <Button
                  label="Account"
                  tooltip="Account"
                  variant="ghost"
                  isIconOnly
                  icon={<User size={20} />}
                  href="#/templates/theme-showcase"
                />
                <Button
                  label="Cart"
                  tooltip="Cart"
                  variant="ghost"
                  isIconOnly
                  icon={<ShoppingBag size={20} />}
                  href="#/templates/theme-showcase"
                />
              </HStack>
              <Button label="Sign in" variant="primary" href="#/templates/theme-showcase" />
            </HStack>
          }
        />

        <Section padding={6} variant="transparent">
          <VStack gap={10} style={styles.contentFluid}>
            <Center>
              <VStack gap={4} hAlign="center" style={styles.heroText}>
                <Heading level={1} type="display-2" color="accent">
                  Little haunts,
                  <br />
                  everywhere you roam
                </Heading>
                <Text type="body" color="secondary">
                  We believe the smallest shadows are the ones that matter most.
                  Turn an ordinary evening into something worth remembering.
                </Text>
              </VStack>
            </Center>

            <Grid columns={isMobile ? 1 : PRODUCT_COLUMNS} gap={4}>
              {products.map((p, i) => (
                <Card key={p.name} padding={0} height="100%">
                  <VStack gap={0} style={styles.cardStack}>
                    <AspectRatio ratio={1}>
                      <ProductArt
                        hue={PRODUCT_HUES[i % PRODUCT_HUES.length]}
                        label={p.name}
                      />
                    </AspectRatio>
                    <VStack
                      gap={2}
                      hAlign="center"
                      style={inlineStyles.cardBody}>
                      <HStack>
                        <Badge label={p.badge} variant={p.badgeVariant} />
                      </HStack>
                      <Heading level={2} style={styles.centerText}>
                        {p.name}
                      </Heading>
                      <Text
                        type="body"
                        color="secondary"
                        style={styles.cardDescription}>
                        {p.description}
                      </Text>
                      <HStack gap={2} vAlign="center" hAlign="center">
                        <NumberInput
                          label="Quantity"
                          isLabelHidden
                          value={1}
                          onChange={() => {}}
                          min={1}
                          max={99}
                          size="sm"
                          style={styles.quantityInput}
                        />
                        <Button
                          label="Add to cart"
                          variant="secondary"
                          size="sm"
                          href="#/templates/theme-showcase"
                          style={styles.cartButton}
                        />
                      </HStack>
                    </VStack>
                  </VStack>
                </Card>
              ))}
            </Grid>
          </VStack>
        </Section>
      </VStack>
    </VStack>
  );
}

function CheckoutCard({isMobile}: {isMobile: boolean}) {
  return (
    <Card padding={5} style={styles.card}>
      <VStack gap={4} style={styles.checkoutStack}>
        <Heading level={2}>Checkout</Heading>

        <VStack gap={3} style={styles.checkoutStack}>
          <TextInput
            label="Email"
            placeholder="you@nocturne.shop"
            value=""
            onChange={() => {}}
            size="lg"
          />

          <RadioList
            label="Shipping method"
            description="Delivery time may vary based on location and availability."
            value="economy"
            onChange={() => {}}>
            <RadioListItem
              value="economy"
              label="Economy Shipping"
              description="Delivered in 5–7 business days"
              endContent={
                <Text type="body" weight="semibold" hasTabularNumbers>
                  $12.00
                </Text>
              }
            />
            <RadioListItem
              value="standard"
              label="Standard Shipping"
              description="Delivered in 3–5 business days"
              endContent={
                <Text type="body" weight="semibold" hasTabularNumbers>
                  $16.00
                </Text>
              }
            />
            <RadioListItem
              value="express"
              label="Express Shipping"
              description="Delivered in 1–2 business days"
              endContent={
                <Text type="body" weight="semibold" hasTabularNumbers>
                  $24.00
                </Text>
              }
            />
          </RadioList>

          <VStack gap={2} style={styles.checkoutStack}>
            <Text type="label" weight="semibold">
              Payment method
            </Text>
            <Grid columns={isMobile ? 1 : PAYMENT_COLUMNS} gap={2}>
              <SelectableCard
                label="Pay with card"
                isSelected={true}
                onChange={() => {}}
                padding={3}>
                <VStack
                  gap={1}
                  hAlign="center"
                  style={styles.paymentCardContent}>
                  <CreditCard size={20} />
                  <Text type="supporting" weight="semibold">
                    Card
                  </Text>
                </VStack>
              </SelectableCard>
              <SelectableCard
                label="Pay with Apple Pay"
                isSelected={false}
                onChange={() => {}}
                padding={3}>
                <VStack
                  gap={1}
                  hAlign="center"
                  style={styles.paymentCardContent}>
                  <Smartphone size={20} />
                  <Text type="supporting" weight="semibold">
                    Apple Pay
                  </Text>
                </VStack>
              </SelectableCard>
              <SelectableCard
                label="Pay with Google Pay"
                isSelected={false}
                onChange={() => {}}
                padding={3}>
                <VStack
                  gap={1}
                  hAlign="center"
                  style={styles.paymentCardContent}>
                  <Wallet size={20} />
                  <Text type="supporting" weight="semibold">
                    Google Pay
                  </Text>
                </VStack>
              </SelectableCard>
            </Grid>
          </VStack>

          <TextInput
            label="Card number"
            placeholder="1234 1234 1234 1234"
            value=""
            onChange={() => {}}
            startIcon={<CreditCard size={16} />}
            size="lg"
          />

          <Grid columns={isMobile ? 1 : EXPIRY_COLUMNS} gap={2}>
            <TextInput
              label="Expiry"
              placeholder="MM / YY"
              value=""
              onChange={() => {}}
              size="lg"
            />
            <TextInput
              label="CVC"
              placeholder="123"
              value=""
              onChange={() => {}}
              size="lg"
            />
          </Grid>

          <Selector
            label="Country"
            value="us"
            onChange={() => {}}
            size="lg"
            options={[
              {value: 'us', label: 'United States'},
              {value: 'ca', label: 'Canada'},
              {value: 'uk', label: 'United Kingdom'},
              {value: 'de', label: 'Germany'},
              {value: 'jp', label: 'Japan'},
              {value: 'au', label: 'Australia'},
            ]}
          />
        </VStack>

        <CheckboxInput
          label="Securely save my information for 1-click checkout"
          description="Pay faster on Nocturne and everywhere Link is accepted."
          value={true}
          onChange={() => {}}
        />

        <Button
          variant="primary"
          size="lg"
          label="Pay now"
          icon={<Lock size={16} />}
        />
      </VStack>
    </Card>
  );
}

const SUGGESTED_QUESTIONS = [
  'Reschedule delivery',
  'Update shipping address',
  'Start a return',
];

function ChatCard() {
  return (
    <Card padding={0} style={styles.chatCard}>
      <HStack
        hAlign="between"
        vAlign="center"
        gap={3}
        style={styles.chatHeader}>
        <Heading level={2}>Night Owl AI</Heading>

        <HStack gap={1} vAlign="center">
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            label="Export conversation"
            tooltip="Export conversation"
            icon={<Download size={16} />}
          />
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            label="Close chat"
            tooltip="Close chat"
            icon={<X size={16} />}
          />
        </HStack>
      </HStack>

      <Divider variant="subtle" />

      <VStack gap={0} style={inlineStyles.chatBody}>
        <ChatMessageList>
          <ChatSystemMessage>Today</ChatSystemMessage>

          <ChatMessage sender="user">
            <ChatMessageBubble variant="filled">
              Where’s my order?
            </ChatMessageBubble>
          </ChatMessage>

          <ChatMessage sender="assistant">
            <VStack gap={3}>
              <Text type="body">
                Your order #1043 (the Moonphase Watch and Belfry Throw)
                shipped this morning from the Aisle 3 warehouse and is currently
                in transit with UPS. It’s on track to arrive at your address by
                end of day tomorrow.
              </Text>
              <Text type="body">
                Let me know if you’d like to reschedule the delivery, redirect
                it to a pickup point, or start a return once it arrives.
              </Text>
            </VStack>
          </ChatMessage>

          <ChatMessage sender="user">
            <ChatMessageBubble variant="filled">
              Can you show me the full details?
            </ChatMessageBubble>
          </ChatMessage>

          <ChatMessage sender="assistant">
            <VStack gap={3}>
              <Text type="body">Here’s everything I have on order #1043:</Text>
              <Card padding={3}>
                <VStack gap={1}>
                  <Item
                    label="Items"
                    description="Moonphase Watch · Belfry Throw"
                    endContent={
                      <Text type="body" weight="semibold" hasTabularNumbers>
                        $248
                      </Text>
                    }
                  />
                  <Item
                    label="Shipping"
                    description="UPS Ground"
                    endContent={
                      <Text type="body" weight="semibold" hasTabularNumbers>
                        $12
                      </Text>
                    }
                  />
                  <Item
                    label="Estimated arrival"
                    description="Tomorrow by 8pm"
                    endContent={
                      <HStack gap={1} vAlign="center">
                        <StatusDot variant="success" label="On time" />
                        <Text type="supporting" color="secondary">
                          On time
                        </Text>
                      </HStack>
                    }
                  />
                  <Item
                    label="Tracking"
                    description="UPS 1Z 999 AA1 0123 4567 84"
                    endContent={<Link href="#/templates/theme-showcase">Track →</Link>}
                  />
                </VStack>
              </Card>
            </VStack>
          </ChatMessage>
        </ChatMessageList>
      </VStack>

      <VStack gap={0} style={inlineStyles.chatSuggestions}>
        <HStack gap={1} hAlign="center" wrap="wrap">
          {SUGGESTED_QUESTIONS.map(question => (
            <Button
              key={question}
              variant="secondary"
              size="sm"
              label={question}
            />
          ))}
        </HStack>
      </VStack>

      <VStack gap={0} style={inlineStyles.chatComposer}>
        <ChatComposer
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          placeholder="Ask Night Owl…"
          footerActions={
            <Button
              variant="ghost"
              size="md"
              isIconOnly
              label="Attach"
              tooltip="Attach"
              icon={<Plus size={16} />}
            />
          }
          sendActions={
            <Button
              variant="ghost"
              size="md"
              isIconOnly
              label="Voice input"
              tooltip="Voice input"
              icon={<Mic size={16} />}
            />
          }
        />
      </VStack>
    </Card>
  );
}

interface ActivityRow {
  id: string;
  icon: ReactNode;
  label: string;
  detail: string;
  time: string;
  amount: number;
}

const ACTIVITY: ActivityRow[] = [
  {
    id: '1',
    icon: <ShoppingBag size={16} />,
    label: 'Order #1043',
    detail: 'Placed · 1:59 pm',
    time: '1:59 pm',
    amount: 248,
  },
  {
    id: '2',
    icon: <Banknote size={16} />,
    label: 'Order #1041',
    detail: 'Refunded · 12:40 pm',
    time: '12:40 pm',
    amount: -89,
  },
  {
    id: '3',
    icon: <ShoppingBag size={16} />,
    label: 'Order #1040',
    detail: 'Placed · 10:30 am',
    time: '10:30 am',
    amount: 156,
  },
  {
    id: '4',
    icon: <ShoppingBag size={16} />,
    label: 'Order #1038',
    detail: 'Placed · 9:11 am',
    time: '9:11 am',
    amount: 412,
  },
  {
    id: '5',
    icon: <ShoppingBag size={16} />,
    label: 'Order #1037',
    detail: 'Placed · 8:42 am',
    time: '8:42 am',
    amount: 95,
  },
];

function formatAmount(amount: number): string {
  const sign = amount < 0 ? '−' : '+';
  return sign + '$' + Math.abs(amount).toLocaleString();
}

function LatestActivityCard({isMobile}: {isMobile: boolean}) {
  return (
    <Card padding={5} style={styles.activityCard}>
      <VStack gap={4} style={styles.activityCardStack}>
        <Heading level={2}>Revenue</Heading>

        <Grid columns={isMobile ? 1 : 2} gap={3}>
          <VStack gap={0}>
            <Text type="display-3" weight="semibold" hasTabularNumbers>
              18K
            </Text>
            <Text type="supporting" color="secondary">
              Monthly revenue
            </Text>
          </VStack>
          <VStack gap={0}>
            <Text type="display-3" weight="semibold" hasTabularNumbers>
              +12%
            </Text>
            <Text type="supporting" color="secondary">
              Order growth
            </Text>
          </VStack>
        </Grid>

        <Divider variant="subtle" />

        <HStack hAlign="between" vAlign="center">
          <Heading level={3}>Activity</Heading>
          <Link href="#/templates/theme-showcase">See all</Link>
        </HStack>

        <VStack gap={1} style={styles.activityListFade}>
          {ACTIVITY.map(item => (
            <Item
              key={item.id}
              startContent={
                <Center
                  width={32}
                  height={32}
                  style={inlineStyles.activityIcon}
                  aria-hidden="true">
                  {item.icon}
                </Center>
              }
              label={item.label}
              description={item.detail}
              endContent={
                <Text
                  type="body"
                  weight="semibold"
                  hasTabularNumbers
                  color={item.amount < 0 ? 'secondary' : 'primary'}>
                  {formatAmount(item.amount)}
                </Text>
              }
              href="#/templates/theme-showcase"
            />
          ))}
        </VStack>
      </VStack>
    </Card>
  );
}

type TagSpec = {label: string; variant: ShowcaseBadgeVariant};

export interface InventoryRow extends Record<string, unknown> {
  id: string;
  name: string;
  meta: string;
  available: number;
  location: string;
  tags: TagSpec[];
  hue: string;
  selected: boolean;
}

const DEFAULT_INVENTORY: InventoryRow[] = [
  {
    id: 'a',
    name: 'Moonphase Watch',
    meta: 'Steel case, moonphase dial',
    available: 42,
    location: 'Aisle 3',
    tags: [{label: 'New', variant: 'blue'}],
    hue: 'var(--dracula-comment)',
    selected: false,
  },
  {
    id: 'b',
    name: 'Night-Owl Headphones',
    meta: 'ANC, 30hr battery',
    available: 128,
    location: 'Aisle 1',
    tags: [{label: 'Popular', variant: 'green'}],
    hue: 'var(--dracula-cyan)',
    selected: true,
  },
  {
    id: 'c',
    name: 'Coven Canvas Backpack',
    meta: 'Waxed canvas, 25L',
    available: 63,
    location: 'Aisle 2',
    tags: [{label: 'Limited', variant: 'yellow'}],
    hue: 'var(--dracula-yellow)',
    selected: false,
  },
  {
    id: 'd',
    name: 'Night Market Wallet',
    meta: 'Full-grain, RFID blocking',
    available: 15,
    location: 'Aisle 4',
    tags: [{label: 'Leather', variant: 'yellow'}],
    hue: 'var(--dracula-orange)',
    selected: true,
  },
  {
    id: 'e',
    name: 'Midnight Tumbler',
    meta: 'Vacuum insulated, 16oz',
    available: 87,
    location: 'Aisle 5',
    tags: [{label: 'Drinkware', variant: 'green'}],
    hue: 'var(--dracula-pink)',
    selected: false,
  },
  {
    id: 'f',
    name: 'Belfry Throw',
    meta: 'Heavyweight, oat',
    available: 24,
    location: 'Aisle 6',
    tags: [{label: 'Home', variant: 'orange'}],
    hue: 'var(--dracula-green)',
    selected: true,
  },
];

const LOW_STOCK_THRESHOLD = 25;

function SelectCell({row}: {row: InventoryRow}) {
  return (
    <CheckboxInput
      label={'Select ' + row.name}
      isLabelHidden
      value={row.selected}
      onChange={() => {}}
    />
  );
}

function ItemCell({row}: {row: InventoryRow}) {
  return (
    <HStack gap={3} vAlign="center">
      <ThumbSwatch hue={row.hue} label={row.name} />
      <VStack gap={0} style={styles.inventoryItemText}>
        <Text type="body" weight="semibold">
          {row.name}
        </Text>
        <Text type="supporting" color="secondary">
          {row.meta}
        </Text>
      </VStack>
    </HStack>
  );
}

function TagsCell({row}: {row: InventoryRow}) {
  return (
    <HStack gap={1} wrap="wrap" hAlign="end">
      {row.tags.map(tag => (
        <Badge key={tag.label} label={tag.label} variant={tag.variant} />
      ))}
    </HStack>
  );
}

function ActionsCell() {
  return (
    <MoreMenu
      label="Row actions"
      size="sm"
      items={[
        {label: 'Edit'},
        {label: 'Duplicate'},
        {label: 'Move to…'},
        {type: 'divider'},
        {label: 'Delete'},
      ]}
    />
  );
}

// The full column set needs 64+80+100+100+80+64 = 488px of grid and the card
// insets cost 2 × --spacing-6 on top, so it stops fitting below ~600px. A 375px
// phone leaves ~280px inside the card: the phone layout drops the selection
// control (no bulk action bar acts on it) and the two metadata columns, which
// needs 244px. Table keeps its own scroll wrapper either way; the point is that
// a row should not have to be read sideways.
const NARROW_TABLE_QUERY = '(max-width: 600px)';
const NARROW_COLUMN_KEYS: Record<string, true> = {
  select: true,
  location: true,
  tags: true,
};

const INVENTORY_COLUMNS: TableColumn<InventoryRow>[] = [
  {
    key: 'select',
    header: '',
    // Wide enough that the control + the theme's cell padding (up to
    // --spacing-4 = 16px/side on spacious density) fit inside the cell,
    // so the control's hover background doesn't overflow toward the
    // card's clipped (rounded) edge on larger-padding themes.
    width: pixel(64),
    renderCell: row => <SelectCell row={row} />,
  },
  {
    key: 'item',
    header: 'Item',
    // Lower min-width (default 120) so the table fits its container on
    // larger-spacing themes instead of overflowing the actions column.
    width: proportional(3, {minWidth: 80}),
    renderCell: row => <ItemCell row={row} />,
  },
  {
    key: 'available',
    header: 'Available',
    width: pixel(100),
    renderCell: row => (
      <Text type="body" hasTabularNumbers>
        {row.available}
      </Text>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    width: pixel(100),
    renderCell: row => <Text type="body">{row.location}</Text>,
  },
  {
    key: 'tags',
    header: 'Tags',
    width: proportional(2, {minWidth: 80}),
    align: 'end',
    renderCell: row => <TagsCell row={row} />,
  },
  {
    key: 'actions',
    header: '',
    // Match the select column: fit the sm more-menu button + cell
    // padding so its hover background stays clear of the card's
    // clipped rounded edge across themes.
    width: pixel(64),
    align: 'end',
    renderCell: () => <ActionsCell />,
  },
];

const NARROW_INVENTORY_COLUMNS = INVENTORY_COLUMNS.filter(
  column => !NARROW_COLUMN_KEYS[column.key],
);

function InventoryCard({inventory}: {inventory: InventoryRow[]}) {
  const isNarrow = useMediaQuery(NARROW_TABLE_QUERY);
  const lowStockCount = inventory.filter(
    row => row.available < LOW_STOCK_THRESHOLD,
  ).length;
  return (
    <Card padding={0} style={styles.inventoryCard}>
      <HStack hAlign="between" vAlign="center" style={styles.inventoryHeader}>
        <Heading level={2}>Inventory</Heading>
        <Button
          label="Add item"
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
        />
      </HStack>

      <Divider variant="subtle" />

      <HStack
        gap={3}
        vAlign="center"
        hAlign="between"
        style={styles.inventoryFilterRow}>
        <HStack gap={2} vAlign="center" style={styles.filterRowFill}>
          <TextInput
            label="Search inventory"
            isLabelHidden
            placeholder="Type and hit enter…"
            value=""
            onChange={() => {}}
            startIcon={<Search size={16} />}
            style={styles.searchInput}
          />
          <OverflowList
            gap={2}
            overflowRenderer={() => (
              <Button
                label="Filters"
                variant="ghost"
                size="sm"
                icon={<Tag size={16} />}
              />
            )}>
            <Selector
              label="Categories"
              isLabelHidden
              placeholder="Categories"
              size="sm"
              startIcon={<Folder size={16} />}
              value={undefined}
              onChange={() => {}}
              options={['Wearables', 'Audio', 'Bags', 'Drinkware', 'Home']}
            />
            <Selector
              label="Locations"
              isLabelHidden
              placeholder="Locations"
              size="sm"
              startIcon={<MapPin size={16} />}
              value={undefined}
              onChange={() => {}}
              options={[
                'Aisle 1',
                'Aisle 2',
                'Aisle 3',
                'Aisle 4',
                'Aisle 5',
                'Aisle 6',
              ]}
            />
            <Selector
              label="Tags"
              isLabelHidden
              placeholder="Tags"
              size="sm"
              startIcon={<Tag size={16} />}
              value={undefined}
              onChange={() => {}}
              options={[
                'New',
                'Popular',
                'Limited',
                'Leather',
                'Drinkware',
                'Home',
              ]}
            />
          </OverflowList>
        </HStack>
        <HStack gap={1} vAlign="center">
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            label="List view"
            tooltip="List view"
            icon={<List size={18} />}
          />
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            label="Grid view"
            tooltip="Grid view"
            icon={<LayoutGrid size={18} />}
          />
        </HStack>
      </HStack>

      {lowStockCount > 0 && (
        <VStack gap={0} style={inlineStyles.inventoryBannerWrap}>
          <Banner
            status="warning"
            title={lowStockCount + ' items are running low'}
          />
        </VStack>
      )}

      <VStack gap={0} style={styles.inventoryTableWrap}>
        <Table<InventoryRow>
          data={inventory}
          columns={
            isNarrow ? NARROW_INVENTORY_COLUMNS : INVENTORY_COLUMNS
          }
          density="spacious"
          dividers="rows"
          hasHover
        />
      </VStack>
    </Card>
  );
}
