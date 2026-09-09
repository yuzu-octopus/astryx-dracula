// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=6] > G[c={min:360} g=8] > (V[g=4] > AR + (G[c=3 g=3] > C*6)) + (V[g=6] > (V[g=2] > Hd"Midnight Ceremony Mug & Plate Set"[level=1 t=display-2] + (H[g=2] > Tx"$89.00"[t=large] + Tx"$119.00"[t=body] + Bd.pink"Sale")) + Tx"A hand-thrown mug and plate set"[t=large] + (V[g=2] > Tx"Glaze"[t=label] + SG) + (V[g=2] > Tx"Finish"[t=label] + SG) + (V[g=2] > Tx"Quantity"[t=label] + (H[g=1] > B.ghost"-" + TI"1" + B.ghost"+")) + (V[g=2] > B.primary"Add to Cart" + B.secondary"Buy it now") + (ColG > Col"Composition" + Col"Delivery & Returns" + Col"Dimensions"))

import {useState} from 'react';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Grid} from '@astryxdesign/core/Grid';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {Icon} from '@astryxdesign/core/Icon';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Divider} from '@astryxdesign/core/Divider';
import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {SelectableCard} from '@astryxdesign/core/SelectableCard';
import type {CSSProperties} from 'react';

// Custom CSS here is limited to what Astryx components can't express today:
// - image fill + corner radius (no Image primitive — #2582)
// - the sticky info column (no sticky prop on Astryx layout primitives — #2613)
// Keeps the info column in view while the gallery scrolls. No sticky prop on
// Astryx layout primitives.
const stickyInfo: CSSProperties = {
  position: 'sticky',
  top: 'var(--spacing-8)',
  alignSelf: 'start',
};
// Product scenes are inline Dracula SVG — there is no Image primitive in
// Astryx (#2582). Fills the AspectRatio box + rounds hero corners. No
// objectFit/radius props on AspectRatio.
const heroImage: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};
// Fills the thumbnail card. Corner radius + selection ring come from
// SelectableCard; the scene only needs to fill the box (#2582).
const thumbImage: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};

// One Dracula placeholder scene per view, drawn from the fixed badge
// vocabulary. Resolves to theme tokens so the gallery stays on-brand in the
// dark-only theme.
function ProductScene({hue, label}: {hue: string; label: string}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={thumbImage}
      role="img"
      aria-label={label}>
      <rect width="400" height="300" fill="var(--dracula-bg-light)" />
      <g
        transform="translate(200 150)"
        fill="none"
        stroke="var(--dracula-comment)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <rect x="-44" y="-44" width="88" height="88" rx="5" />
        <circle cx="18" cy="-18" r="2.5" fill={hue} stroke="none" />
        <path d="M-34 30 L-8 0 L10 18 L20 8 L34 24" />
      </g>
    </svg>
  );
}

import {Minus, Plus, Star} from 'lucide-react';

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({rating, count}: {rating: number; count: number}) {
  const filled = Math.round(rating);
  const empty = 5 - filled;

  return (
    <HStack gap={1} vAlign="center">
      {Array.from({length: filled}, (_, i) => (
        <Icon key={`full-${i}`} icon={Star} size="sm" color="warning" />
      ))}
      {Array.from({length: empty}, (_, i) => (
        <Icon key={`empty-${i}`} icon={Star} size="sm" color="disabled" />
      ))}
      <Text type="body" color="secondary" hasTabularNumbers>
        {rating} ({count})
      </Text>
    </HStack>
  );
}

// ─── Image hues ─────────────────────────────────────────────────────────────
// IMAGES[selected] is the hero; all six double as thumbnails so the 3-column
// grid closes into two full rows (a slice(1) subset left a ragged 3+2 row and
// a fallback entry that never rendered).
const IMAGES = [
  'var(--dracula-purple)',
  'var(--dracula-cyan)',
  'var(--dracula-pink)',
  'var(--dracula-yellow)',
  'var(--dracula-green)',
  'var(--dracula-orange)',
];

// ─── Product Data ───────────────────────────────────────────────────────────
const PRODUCT = {
  name: 'Midnight Ceremony Mug & Plate Set',
  price: 89.0,
  originalPrice: 119.0,
  description:
    'A hand-thrown mug and plate set that brings quiet warmth to every midnight meal. The mug sits easy in the hand with a generous 12 oz capacity, while the 8-inch plate works for everything from toast to tapas. Each piece is kiln-fired at 2,300\u00B0F for a finish that resists chips and stains. Subtle variations in the reactive glaze pool like night mist, so no two sets are exactly alike. Dishwasher and microwave safe.',
  composition:
    'High-fire stoneware clay, wheel-thrown and trimmed by hand. Reactive glaze applied by dipping \u2014 color pools and breaks naturally over the clay body. Lead-free and food-safe. Unglazed foot ring reveals the raw clay underneath. Each piece is bisque-fired, glazed, then fired again to cone 10 in a gas reduction kiln.',
  deliveryReturns:
    'Free shipping on all ceramics orders over $75. Each piece is individually wrapped in recycled kraft paper and cushioned for transit. Returns accepted within 30 days \u2014 items must be unused and in original packaging. Replacement pieces available individually.',
  dimensions:
    'Mug height: 9.5 cm / 3.75 in. Mug diameter: 8.5 cm / 3.35 in. Capacity: 350 ml / 12 oz. Plate diameter: 20 cm / 8 in. Plate height: 2 cm / 0.75 in. Weight: 680 g / 1.5 lb (set).',
};

const COLORS = [
  {value: 'midnight', label: 'Midnight'},
  {value: 'crypt', label: 'Crypt'},
  {value: 'moonlight', label: 'Moonlight'},
];

const FINISHES = [
  {value: 'matte', label: 'Matte'},
  {value: 'satin', label: 'Satin'},
  {value: 'speckled', label: 'Speckled'},
];

const fmt = (n: number) => `$${n.toFixed(2)}`;

// ─── Image Gallery ──────────────────────────────────────────────────────────
function ImageGallery({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  const heroHue = IMAGES[selected];
  const thumbnails = IMAGES;

  return (
    <VStack gap={3}>
      <AspectRatio ratio={4 / 5} style={heroImage}>
        <ProductScene hue={heroHue} label={PRODUCT.name} />
      </AspectRatio>
      <Grid columns={3} gap={2}>
        {thumbnails.map((hue, i) => (
          <AspectRatio key={i} ratio={1}>
            <SelectableCard
              label={`Product image ${i + 1}`}
              isSelected={selected === i}
              onChange={() => onSelect(i)}
              variant="transparent"
              padding={0}
              width="100%"
              height="100%">
              <ProductScene hue={hue} label={`Product image ${i + 1}`} />
            </SelectableCard>
          </AspectRatio>
        ))}
      </Grid>
    </VStack>
  );
}

// ─── Product Info ───────────────────────────────────────────────────────────
function ProductInfo() {
  const [color, setColor] = useState('midnight');
  const [finish, setFinish] = useState('matte');
  const [quantity, setQuantity] = useState<number | null>(1);
  const [notice, setNotice] = useState<{
    status: 'success' | 'info';
    title: string;
  } | null>(null);

  const decrement = () => setQuantity(q => Math.max(1, (q ?? 1) - 1));
  const increment = () => setQuantity(q => Math.min(10, (q ?? 1) + 1));

  return (
    <VStack gap={5}>
      <VStack gap={2}>
        <Heading level={1} type="display-2">
          {PRODUCT.name}
        </Heading>
        <StarRating rating={4.3} count={128} />
        <HStack gap={2} vAlign="center">
          <Text type="large" weight="bold" hasTabularNumbers>
            {fmt(PRODUCT.price)}
          </Text>
          <Text type="body" color="secondary" hasStrikethrough hasTabularNumbers>
            {fmt(PRODUCT.originalPrice)}
          </Text>
          <Badge variant="pink" label="Sale" />
        </HStack>
      </VStack>
      <Text type="large" weight="normal">
        {PRODUCT.description}
      </Text>
      <VStack gap={2}>
        <Text type="label">Glaze</Text>
        <VStack hAlign="start">
          <SegmentedControl value={color} onChange={setColor} label="Glaze">
            {COLORS.map(c => (
              <SegmentedControlItem
                key={c.value}
                value={c.value}
                label={c.label}
              />
            ))}
          </SegmentedControl>
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text type="label">Finish</Text>
        <VStack hAlign="start">
          <SegmentedControl value={finish} onChange={setFinish} label="Finish">
            {FINISHES.map(f => (
              <SegmentedControlItem
                key={f.value}
                value={f.value}
                label={f.label}
              />
            ))}
          </SegmentedControl>
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text type="label">Quantity</Text>
        <HStack gap={1} vAlign="center">
          <Button
            label="Decrease quantity"
            variant="ghost"
            icon={<Icon icon={Minus} size="sm" />}
            clickAction={decrement}
            isDisabled={(quantity ?? 1) <= 1}
            isIconOnly
            tooltip="Decrease quantity"
          />
          <Center width={100}>
            <NumberInput
              label="Quantity"
              isLabelHidden
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={10}
              isIntegerOnly
            />
          </Center>
          <Button
            label="Increase quantity"
            variant="ghost"
            icon={<Icon icon={Plus} size="sm" />}
            clickAction={increment}
            isDisabled={(quantity ?? 1) >= 10}
            isIconOnly
            tooltip="Increase quantity"
          />
        </HStack>
      </VStack>
      <VStack gap={2}>
        {notice && (
          <Banner
            status={notice.status}
            title={notice.title}
            container="card"
            isDismissable
            onDismiss={() => setNotice(null)}
          />
        )}
        <Button
          label="Add to Cart"
          variant="primary"
          size="lg"
          clickAction={() =>
            setNotice({
              status: 'success',
              title: `Added ${quantity ?? 1} × ${PRODUCT.name} to your cart.`,
            })
          }
        />
        <Button
          label="Buy it now"
          size="lg"
          clickAction={() =>
            setNotice({
              status: 'info',
              title: 'Checkout is disabled in this preview.',
            })
          }
        />
      </VStack>
      <CollapsibleGroup type="multiple" defaultValue={['composition']}>
        <Divider />
        <Collapsible
          value="composition"
          trigger={
            <Heading level={3} accessibilityLevel={2}>
              Composition
            </Heading>
          }>
          <Text type="body">{PRODUCT.composition}</Text>
        </Collapsible>
        <Divider />
        <Collapsible
          value="delivery"
          defaultIsOpen={false}
          trigger={
            <Heading level={3} accessibilityLevel={2}>
              Delivery &amp; Returns
            </Heading>
          }>
          <Text type="body">{PRODUCT.deliveryReturns}</Text>
        </Collapsible>
        <Divider />
        <Collapsible
          value="dimensions"
          defaultIsOpen={false}
          trigger={
            <Heading level={3} accessibilityLevel={2}>
              Dimensions
            </Heading>
          }>
          <Text type="body" hasTabularNumbers>
            {PRODUCT.dimensions}
          </Text>
        </Collapsible>
        <Divider />
      </CollapsibleGroup>
    </VStack>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const [selectedThumb, setSelectedThumb] = useState(0);

  return (
    <Layout
      height="fill"
      contentWidth={1200}
      content={
        <LayoutContent padding={6}>
          <Grid columns={{minWidth: 320, repeat: 'fit'}} gap={5}>
            <ImageGallery
              selected={selectedThumb}
              onSelect={setSelectedThumb}
            />
            <VStack gap={0} style={stickyInfo}>
              <ProductInfo />
            </VStack>
          </Grid>
        </LayoutContent>
      }
    />
  );
}
