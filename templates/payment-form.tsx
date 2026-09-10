// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   L > LC[p=0] > Ctr > S.transparent[p=6 mw=1100] > V[g=5] > (V[g=6] > (V[g=2] > (Hd"Payment Request"[level=1 t=display-1] + Tx"Review your order"[t=body]) + D) + H[g=8] > (SI > V[g=8] > (V[g=1] > (H[j=between] > (Hd"Sign in"[level=2] + B"Sign In") + Tx"Sign in to track your order"[t=body]) + V[g=3] > (Hd"Contact Information"[level=2] + TI"Email" + CB"Email offers") + V[g=3] > (Hd"Shipping Information"[level=2] + G[c=2 g=3] > (TI"First Name" + TI"Last Name") + TI"Address" + G[c=2 g=3] > (TI"City" + TI"ZIP Code") + SE"State" + TI"Phone Number" + CB"Save information") + V[g=3] > (V[g=1] > (Hd"Delivery"[level=2] + Tx"Processing time"[t=body]) + RL"Delivery method" > RLI*2) + V[g=3] > (V[g=1] > (Hd"Payment Method"[level=2] + Tx"Encrypted"[t=body]) + G[c=2 g=3] > (B"PayPal" + B"Google Pay") + TI"Card Number" + G[c=3 g=3] > (SE"Expiry Month" + SE"Expiry Year" + TI"CVC") + TI"Name on Card" + CB"Billing address") + V[g=3] > (Hd"Promo Code"[level=2] + H[g=2] > (TI"Promo code" + B"Apply")) + V[g=3] > (Hd"Gift Options"[level=2] + CB"Gift message" + TA"Gift message") + V[g=4] > (H[g=5] > (H[g=1] > (Ic + Tx))*3 + V[g=2] > (B"Place Order"[primary] + B"Continue Shopping") + D + H[g=4] > (Lk"Refund policy" + Lk"Privacy policy" + Lk"Terms" + Lk"Cancellations"))) + SI > C[p=5] > Col"Order Summary" > V[g=4] > (V[g=3] > V[g=3] > (H[g=3] > (Tmb + V[g=1] > (Tx"Obsidian Ritual Chalice" + Tx"Hand-carved"[t=supporting])) + D)*3 + V[g=3] > (Hd"Order Total"[level=3] + H[j=between] > (Tx"Subtotal" + Tx"$91.20") + D + H[j=between] > (Tx"Total"[t=large] + Tx"$91.20"[t=large]) + Bn"Free shipping over $300"))))

import {useState, type CSSProperties} from 'react';
import {
  VStack,
  HStack,
  Stack,
  StackItem,
  Layout,
  LayoutContent,
} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Button} from '@astryxdesign/core/Button';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Selector} from '@astryxdesign/core/Selector';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Link} from '@astryxdesign/core/Link';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Divider} from '@astryxdesign/core/Divider';
import {Banner} from '@astryxdesign/core/Banner';
import {Card} from '@astryxdesign/core/Card';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {NumberInput} from '@astryxdesign/core/NumberInput';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Section} from '@astryxdesign/core/Section';
import {Center} from '@astryxdesign/core/Center';
import {Icon} from '@astryxdesign/core/Icon';
import {ShieldCheck, Lock, CircleCheck, Truck} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];
const YEARS = Array.from({length: 12}, (_, i) => String(2025 + i));

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

// One Dracula accent per line item, from the fixed categorical vocabulary.
const ITEM_HUES: Record<string, string> = {
  '1': 'var(--dracula-cyan)',
  '2': 'var(--dracula-pink)',
  '3': 'var(--dracula-yellow)',
};

const ORDER_ITEMS = [
  {
    id: '1',
    name: 'Obsidian Ritual Chalice',
    variant: 'Hand-carved · 12 oz',
    price: 78,
    qty: 1,
    limited: false,
  },
  {
    id: '2',
    name: 'Blood-Moon Offering Plate',
    variant: 'Moon-glazed · 10 in',
    price: 72,
    qty: 1,
    limited: false,
  },
  {
    id: '3',
    name: 'Crypt Cereal Bowl',
    variant: 'Speckled obsidian · 6 in',
    price: 80,
    qty: 1,
    limited: true,
  },
];

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 300;
const fmt = (n: number) => `$${n.toFixed(2)}`;

// ── Styles ────────────────────────────────────────────────────────────────────
// Plain inline styles using Astryx design-token CSS variables (declared at
// :root by `@astryxdesign/core/astryx.css`). No StyleX compiler required.

const fullWidth: CSSProperties = {width: '100%'};
// Form column flex-basis so the two checkout columns share width evenly.
const formColBasis: CSSProperties = {flexBasis: 0};
// Space the Order Summary content below its collapsible trigger title.
const summaryContent: CSSProperties = {paddingBlockStart: 'var(--spacing-2)'};
// Order-summary column: sticky beside the form on desktop.
const summarySticky: CSSProperties = {
  flexBasis: 0,
  position: 'sticky',
  top: 'var(--spacing-4)',
  alignSelf: 'flex-start',
};
// On mobile the summary moves above the form.
const summaryMobileOrder: CSSProperties = {order: -1};
// Express-checkout buttons (Dracula tokens stand in for brand colors).
const paypalButton: CSSProperties = {
  backgroundColor: 'var(--color-warning)',
  borderColor: 'var(--color-warning)',
};
// Google Pay button: widget-surface token stands in for the official dark
// button background (no raw hex on brand surfaces).
const gpayButton: CSSProperties = {
  backgroundColor: 'var(--color-widget-background)',
  borderColor: 'var(--color-widget-background)',
};
// Brand logos inside the express-checkout buttons.
const brandLogo: CSSProperties = {height: 'var(--spacing-5)', width: 'auto'};
// Line-item photo: a fixed square frame that clips the inline scene.
// Astryx has no Image primitive (#2582), so the placeholder is inline SVG on
// brand tokens instead of a data-URI bitmap with baked-in hex.
const itemPhotoFrame: CSSProperties = {
  width: 'var(--spacing-10)',
  height: 'var(--spacing-10)',
  overflow: 'clip',
  flexShrink: 0,
};
const itemPhoto: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
// Accepted card-network marks (Visa/Mastercard/Amex), shared style.
const cardLogo: CSSProperties = {
  height: 'var(--spacing-7)',
  width: 'auto',
  borderRadius: 'var(--radius-element)',
  borderWidth: 'var(--border-width)',
  borderStyle: 'solid',
  borderColor: 'var(--color-border)',
  backgroundColor: 'var(--color-background-surface)',
};

function OrderItemPhoto({item}: {item: (typeof ORDER_ITEMS)[number]}) {
  return (
    <Card padding={0} style={itemPhotoFrame}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        style={itemPhoto}
        role="img"
        aria-label={item.name}>
        <rect width="400" height="300" fill="var(--dracula-bg-light)" />
        <g
          transform="translate(200 150)"
          fill="none"
          stroke="var(--dracula-comment)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="-44" y="-44" width="88" height="88" rx="5" />
          <circle
            cx="18"
            cy="-18"
            r="2.5"
            fill={ITEM_HUES[item.id]}
            stroke="none"
          />
          <path d="M-34 30 L-8 0 L10 18 L20 8 L34 24" />
        </g>
      </svg>
    </Card>
  );
}

function OrderLineItem({
  item,
  qty,
  onChangeQty,
}: {
  item: (typeof ORDER_ITEMS)[number];
  qty: number;
  onChangeQty: (v: number) => void;
}) {
  return (
    <VStack gap={3}>
      <HStack gap={3} vAlign="start">
        <OrderItemPhoto item={item} />
        <StackItem size="fill">
          <VStack gap={1}>
            <HStack gap={2} hAlign="between" vAlign="start">
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Text type="body" weight="medium">
                  {item.name}
                </Text>
                {item.limited && (
                  <HStack gap={1} vAlign="center">
                    <StatusDot variant="warning" label="Limited edition" />
                    <Text type="supporting" color="secondary">
                      Limited edition
                    </Text>
                  </HStack>
                )}
              </HStack>
              <Text type="body" weight="bold" hasTabularNumbers>
                {fmt(item.price)}
              </Text>
            </HStack>
            <Text type="supporting" color="secondary">
              {item.variant}
            </Text>
            <HStack gap={2} vAlign="end" wrap="wrap">
              <NumberInput
                label="Qty"
                value={qty}
                onChange={onChangeQty}
                min={1}
                max={10}
                isIntegerOnly
              />
              <Link href={SELF_HREF} type="supporting">
                Remove
              </Link>
              <Link href={SELF_HREF} type="supporting">
                Save
              </Link>
            </HStack>
          </VStack>
        </StackItem>
      </HStack>
      <Divider />
    </VStack>
  );
}

function OrderSummaryCard({
  quantities,
  onChangeQty,
  subtotal,
  shipping,
  tax,
  total,
}: {
  quantities: Record<string, number>;
  onChangeQty: (id: string, v: number) => void;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <Card padding={5}>
      <VStack gap={4}>
        {/* Accordion header — clickable on mobile only */}
        <Collapsible trigger="Order Summary" defaultIsOpen={true}>
          <VStack gap={4} style={summaryContent}>
            {ORDER_ITEMS.map(item => (
              <OrderLineItem
                key={item.id}
                item={item}
                qty={quantities[item.id] ?? item.qty}
                onChangeQty={v => onChangeQty(item.id, v)}
              />
            ))}
            <OrderTotalSection
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </VStack>
        </Collapsible>
      </VStack>
    </Card>
  );
}

function OrderTotalSection({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <VStack gap={3}>
      <Heading level={3}>Order Total</Heading>
      <VStack gap={2}>
        <HStack hAlign="between" vAlign="center">
          <Text type="body" color="secondary">
            Subtotal
          </Text>
          <Text type="body" hasTabularNumbers>
            {fmt(subtotal)}
          </Text>
        </HStack>
        <HStack hAlign="between" vAlign="center">
          <Text type="body" color="secondary">
            Shipping
          </Text>
          <Text type="body" hasTabularNumbers>
            {fmt(shipping)}
          </Text>
        </HStack>
        <HStack hAlign="between" vAlign="center">
          <Text type="body" color="secondary">
            Tax
          </Text>
          <Text type="body" hasTabularNumbers>
            {fmt(tax)}
          </Text>
        </HStack>
      </VStack>
      <Divider />
      <HStack hAlign="between" vAlign="center">
        <Text type="large" weight="bold">
          Total
        </Text>
        <Text type="large" weight="bold" hasTabularNumbers>
          {fmt(total)}
        </Text>
      </HStack>
      <Banner
        status="info"
        icon={<Icon icon={Truck} size="sm" />}
        title="Free shipping on orders over $300"
      />
    </VStack>
  );
}

const TRUST_ITEMS: Array<{icon: typeof ShieldCheck; label: string}> = [
  {icon: ShieldCheck, label: 'Secure Payment'},
  {icon: Lock, label: 'SSL Encrypted'},
  {icon: CircleCheck, label: 'Free Returns'},
];

const SELF_HREF = '#/templates/payment-form';

const POLICY_LINKS = [
  'Refund policy',
  'Privacy policy',
  'Terms of service',
  'Cancellations',
];

function TrustBar() {
  return (
    <HStack gap={5} hAlign="center" wrap="wrap">
      {TRUST_ITEMS.map(item => (
        <HStack key={item.label} gap={1} vAlign="center">
          <Icon icon={item.icon} size="sm" color="secondary" />
          <Text type="supporting" color="secondary">
            {item.label}
          </Text>
        </HStack>
      ))}
    </HStack>
  );
}

function PolicyLinks() {
  return (
    <HStack gap={4} vAlign="center" wrap="wrap">
      {POLICY_LINKS.map(label => (
        <Link key={label} href={SELF_HREF} type="supporting">
          {label}
        </Link>
      ))}
    </HStack>
  );
}

export default function PaymentForm() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isStacked = useMediaQuery('(max-width: 1024px)');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [email, setEmail] = useState('');
  const [emailOffers, setEmailOffers] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, _setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [expYear, setExpYear] = useState('');
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingState, setBillingState] = useState('');
  const [addGiftMessage, setAddGiftMessage] = useState(false);
  const [giftTo, setGiftTo] = useState('');
  const [giftFrom, setGiftFrom] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [promo, setPromo] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    '1': 1,
    '2': 1,
    '3': 1,
  });
  const [submitted, setSubmitted] = useState(false);

  // Totals follow the editable quantities (and the free-shipping banner:
  // orders at or over the threshold ship free).
  const subtotal = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? item.qty),
    0,
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : deliveryMethod === 'expedited'
        ? 9.95
        : 4.95;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;

  const errors = submitted
    ? {
        firstName: !firstName.trim() ? 'Required' : undefined,
        lastName: !lastName.trim() ? 'Required' : undefined,
        address: !address.trim() ? 'Required' : undefined,
        city: !city.trim() ? 'Required' : undefined,
        zip: !zip.trim() ? 'Required' : undefined,
        state: !state ? 'Required' : undefined,
        email: !email.trim() ? 'Required' : undefined,
        phone: !phone.trim() ? 'Required' : undefined,
        expiry: !expiry ? 'Required' : undefined,
        expYear: !expYear ? 'Required' : undefined,
        cvc: !cvc.trim() ? 'Required' : undefined,
        cardNumber:
          paymentMethod === 'card' && !cardNumber.trim()
            ? 'Required'
            : undefined,
        cardName:
          paymentMethod === 'card' && !cardName.trim() ? 'Required' : undefined,
        billingAddress:
          !billingMatchesShipping && !billingAddress.trim()
            ? 'Required'
            : undefined,
        billingCity:
          !billingMatchesShipping && !billingCity.trim()
            ? 'Required'
            : undefined,
        billingZip:
          !billingMatchesShipping && !billingZip.trim()
            ? 'Required'
            : undefined,
        billingState:
          !billingMatchesShipping && !billingState ? 'Required' : undefined,
      }
    : {};

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={0}>
          <Center axis="horizontal">
            <Section
              variant="transparent"
              maxWidth={1100}
              width="100%"
              padding={6}>
              <VStack gap={5}>
                {/* Page header */}
                <VStack gap={6}>
                  <VStack gap={2}>
                    <Heading level={1} type="display-1">
                      Payment Request
                    </Heading>
                    <Text type="body" color="secondary">
                      Review your order and complete your purchase. All
                      transactions are sealed with 256-bit SSL encryption.
                    </Text>
                  </VStack>
                  <Divider />
                </VStack>

                <Stack
                  direction={isStacked ? 'vertical' : 'horizontal'}
                  gap={8}
                  vAlign="start">
                  <StackItem
                    size="fill"
                    style={isStacked ? undefined : formColBasis}>
                    <VStack gap={8}>
                      {/* Sign in */}
                      <VStack gap={1}>
                        <HStack gap={2} hAlign="between" vAlign="center">
                          <Heading level={2}>Sign in to check out</Heading>
                          <Button
                            label="Sign In"
                            variant="secondary"
                            size="sm"
                            onClick={() => {}}
                          />
                        </HStack>
                        <Text type="body" color="secondary">
                          Sign in to track your order and save your information
                          for faster checkout.
                        </Text>
                      </VStack>

                      {/* Contact Information */}
                      <VStack gap={3}>
                        <Heading level={2}>Contact Information</Heading>
                        <TextInput
                          size="lg"
                          label="Email"
                          isRequired
                          placeholder="you@example.com"
                          value={email}
                          onChange={setEmail}
                          status={
                            errors.email
                              ? {type: 'error', message: errors.email}
                              : undefined
                          }
                        />
                        <CheckboxInput
                          label="Email me with news and offers"
                          value={emailOffers}
                          onChange={setEmailOffers}
                        />
                      </VStack>

                      {/* Shipping Information */}
                      <VStack gap={3}>
                        <Heading level={2}>Shipping Information</Heading>
                        <Grid columns={isMobile ? 1 : 2} gap={3}>
                          <TextInput
                            size="lg"
                            label="First Name"
                            isRequired
                            placeholder="John"
                            value={firstName}
                            onChange={setFirstName}
                            status={
                              errors.firstName
                                ? {type: 'error', message: errors.firstName}
                                : undefined
                            }
                          />
                          <TextInput
                            size="lg"
                            label="Last Name"
                            isRequired
                            placeholder="Doe"
                            value={lastName}
                            onChange={setLastName}
                            status={
                              errors.lastName
                                ? {type: 'error', message: errors.lastName}
                                : undefined
                            }
                          />
                        </Grid>
                        <TextInput
                          size="lg"
                          label="Address"
                          isRequired
                          placeholder="123 Main Street"
                          value={address}
                          onChange={setAddress}
                          status={
                            errors.address
                              ? {type: 'error', message: errors.address}
                              : undefined
                          }
                        />
                        <Grid columns={isMobile ? 1 : 2} gap={3}>
                          <TextInput
                            size="lg"
                            label="City"
                            isRequired
                            placeholder="New York"
                            value={city}
                            onChange={setCity}
                            status={
                              errors.city
                                ? {type: 'error', message: errors.city}
                                : undefined
                            }
                          />
                          <TextInput
                            size="lg"
                            label="ZIP Code"
                            isRequired
                            placeholder="10001"
                            value={zip}
                            onChange={setZip}
                            status={
                              errors.zip
                                ? {type: 'error', message: errors.zip}
                                : undefined
                            }
                          />
                        </Grid>
                        <Selector
                          size="lg"
                          label="State"
                          isRequired
                          placeholder="Select state"
                          options={US_STATES}
                          value={state}
                          onChange={setState}
                          status={
                            errors.state
                              ? {type: 'error', message: errors.state}
                              : undefined
                          }
                        />
                        <TextInput
                          size="lg"
                          label="Phone Number"
                          isRequired
                          placeholder="+1 (555) 123-4567"
                          value={phone}
                          onChange={setPhone}
                          labelTooltip="We use your phone number to provide shipping updates and contact you about your delivery if needed."
                          status={
                            errors.phone
                              ? {type: 'error', message: errors.phone}
                              : undefined
                          }
                        />
                        <CheckboxInput
                          label="Save my information for a faster checkout"
                          value={saveInfo}
                          onChange={setSaveInfo}
                        />
                      </VStack>

                      {/* Delivery */}
                      <VStack gap={3}>
                        <VStack gap={1}>
                          <Heading level={2}>Delivery</Heading>
                          <Text type="body" color="secondary">
                            Please allow 1–3 business days processing time
                            before your order ships.
                          </Text>
                        </VStack>
                        <RadioList
                          label="Delivery method"
                          value={deliveryMethod}
                          onChange={setDeliveryMethod}>
                          <RadioListItem
                            value="standard"
                            label="Standard (3–7 business days)"
                            endContent={
                              <Text
                                type="body"
                                weight="medium"
                                hasTabularNumbers>
                                $4.95
                              </Text>
                            }
                          />
                          <RadioListItem
                            value="expedited"
                            label="Expedited (1–2 business days)"
                            endContent={
                              <Text
                                type="body"
                                weight="medium"
                                hasTabularNumbers>
                                $9.95
                              </Text>
                            }
                          />
                        </RadioList>
                      </VStack>

                      {/* Payment Method */}
                      <VStack gap={3}>
                        <VStack gap={1}>
                          <Heading level={2}>Payment Method</Heading>
                          <Text type="body" color="secondary">
                            All transactions are secure and encrypted.
                          </Text>
                        </VStack>

                        {/* Express checkout */}
                        <VStack gap={3}>
                          <Grid columns={isMobile ? 1 : 2} gap={3}>
                            {/* PayPal */}
                            <Button
                              label="PayPal"
                              variant="primary"
                              size="lg"
                              onClick={() => {}}
                              style={paypalButton}>
                              <img
                                src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                                alt="PayPal"
                                style={brandLogo}
                              />
                            </Button>
                            {/* Google Pay */}
                            <Button
                              label="Google Pay"
                              variant="primary"
                              size="lg"
                              onClick={() => {}}
                              style={gpayButton}>
                              <img
                                src="https://pay.google.com/about/static_kcs/images/logos/google-pay-logo.svg"
                                alt="Google Pay"
                                style={brandLogo}
                              />
                            </Button>
                          </Grid>
                        </VStack>

                        {/* OR divider */}
                        <HStack gap={3} vAlign="center">
                          <StackItem size="fill">
                            <Divider />
                          </StackItem>
                          <Text type="supporting" color="secondary">
                            OR
                          </Text>
                          <StackItem size="fill">
                            <Divider />
                          </StackItem>
                        </HStack>

                        {/* Credit card fields */}
                        <VStack gap={3}>
                          {/* Card type icons */}
                          <HStack gap={1.5} vAlign="center">
                            <img
                              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/visa.svg"
                              alt="Visa"
                              style={cardLogo}
                            />
                            <img
                              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/mastercard.svg"
                              alt="Mastercard"
                              style={cardLogo}
                            />
                            <img
                              src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/amex.svg"
                              alt="Amex"
                              style={cardLogo}
                            />
                          </HStack>
                          <TextInput
                            size="lg"
                            label="Card Number"
                            isRequired
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={setCardNumber}
                            status={
                              errors.cardNumber
                                ? {type: 'error', message: errors.cardNumber}
                                : undefined
                            }
                          />
                          <Grid columns={isMobile ? 1 : 3} gap={3}>
                            <Selector
                              size="lg"
                              label="Expiry Month"
                              isRequired
                              placeholder="MM"
                              options={MONTHS}
                              value={expiry}
                              onChange={setExpiry}
                              status={
                                errors.expiry
                                  ? {type: 'error', message: errors.expiry}
                                  : undefined
                              }
                            />
                            <Selector
                              size="lg"
                              label="Expiry Year"
                              isRequired
                              placeholder="YY"
                              options={YEARS}
                              value={expYear}
                              onChange={setExpYear}
                              status={
                                errors.expYear
                                  ? {type: 'error', message: errors.expYear}
                                  : undefined
                              }
                            />
                            <TextInput
                              size="lg"
                              label="CVC"
                              isRequired
                              placeholder="123"
                              value={cvc}
                              onChange={setCvc}
                              labelTooltip="3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front."
                              status={
                                errors.cvc
                                  ? {type: 'error', message: errors.cvc}
                                  : undefined
                              }
                            />
                          </Grid>
                          <TextInput
                            size="lg"
                            label="Name on Card"
                            isRequired
                            placeholder="John Doe"
                            value={cardName}
                            onChange={setCardName}
                            status={
                              errors.cardName
                                ? {type: 'error', message: errors.cardName}
                                : undefined
                            }
                          />
                          <CheckboxInput
                            label="Use shipping address as billing address"
                            value={billingMatchesShipping}
                            onChange={setBillingMatchesShipping}
                          />
                          {!billingMatchesShipping && (
                            <VStack gap={3}>
                              <TextInput
                                size="lg"
                                label="Address"
                                isRequired
                                placeholder="123 Main Street"
                                value={billingAddress}
                                onChange={setBillingAddress}
                                status={
                                  errors.billingAddress
                                    ? {
                                        type: 'error',
                                        message: errors.billingAddress,
                                      }
                                    : undefined
                                }
                              />
                              <Grid columns={isMobile ? 1 : 2} gap={3}>
                                <TextInput
                                  size="lg"
                                  label="City"
                                  isRequired
                                  placeholder="New York"
                                  value={billingCity}
                                  onChange={setBillingCity}
                                  status={
                                    errors.billingCity
                                      ? {
                                          type: 'error',
                                          message: errors.billingCity,
                                        }
                                      : undefined
                                  }
                                />
                                <TextInput
                                  size="lg"
                                  label="ZIP Code"
                                  isRequired
                                  placeholder="10001"
                                  value={billingZip}
                                  onChange={setBillingZip}
                                  status={
                                    errors.billingZip
                                      ? {
                                          type: 'error',
                                          message: errors.billingZip,
                                        }
                                      : undefined
                                  }
                                />
                              </Grid>
                              <Selector
                                size="lg"
                                label="State"
                                isRequired
                                placeholder="Select state"
                                options={US_STATES}
                                value={billingState}
                                onChange={setBillingState}
                                status={
                                  errors.billingState
                                    ? {
                                        type: 'error',
                                        message: errors.billingState,
                                      }
                                    : undefined
                                }
                              />
                            </VStack>
                          )}
                        </VStack>
                      </VStack>

                      {/* Promo Code */}
                      <VStack gap={3}>
                        <Heading level={2}>Promo Code</Heading>
                        <HStack gap={2} vAlign="end">
                          <StackItem size="fill">
                            <TextInput
                              size="lg"
                              label="Promo code"
                              placeholder="Enter promo code"
                              value={promo}
                              onChange={setPromo}
                              style={fullWidth}
                            />
                          </StackItem>
                          <Button
                            label="Apply"
                            variant="secondary"
                            size="lg"
                            onClick={() => {}}
                          />
                        </HStack>
                      </VStack>

                      {/* Gift Options */}
                      <VStack gap={3}>
                        <Heading level={2}>Gift Options</Heading>
                        <CheckboxInput
                          label="Add a gift message"
                          value={addGiftMessage}
                          onChange={setAddGiftMessage}
                        />
                        {addGiftMessage && (
                          <VStack gap={3}>
                            <Grid columns={isMobile ? 1 : 2} gap={3}>
                              <TextInput
                                size="lg"
                                label="To"
                                placeholder="Recipient name"
                                value={giftTo}
                                onChange={setGiftTo}
                              />
                              <TextInput
                                size="lg"
                                label="From"
                                placeholder="Your name"
                                value={giftFrom}
                                onChange={setGiftFrom}
                              />
                            </Grid>
                            <TextArea
                              label="Gift message"
                              placeholder="Write something here"
                              value={giftMessage}
                              onChange={setGiftMessage}
                            />
                          </VStack>
                        )}
                      </VStack>

                      {/* Trust bar + CTAs + policy links */}
                      <VStack gap={4}>
                        <TrustBar />
                        <VStack gap={2}>
                          <Button
                            label="Place Order"
                            variant="primary"
                            size="lg"
                            style={fullWidth}
                            onClick={() => setSubmitted(true)}
                          />
                          <Button
                            label="Continue Shopping"
                            variant="secondary"
                            size="lg"
                            style={fullWidth}
                            onClick={() => {}}
                          />
                        </VStack>
                        <Divider />
                        <PolicyLinks />
                      </VStack>
                    </VStack>
                  </StackItem>

                  <StackItem
                    size="fill"
                    style={isStacked ? summaryMobileOrder : summarySticky}>
                    <OrderSummaryCard
                      quantities={quantities}
                      onChangeQty={(id, v) =>
                        setQuantities(q => ({...q, [id]: v}))
                      }
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={tax}
                      total={total}
                    />
                  </StackItem>
                </Stack>
              </VStack>
            </Section>
          </Center>
        </LayoutContent>
      }
    />
  );
}
