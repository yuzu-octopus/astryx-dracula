// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > S.transparent[p=10] > V[g=10] > (G[c={min:320} g=10] > (V[g=6] > (V[g=3] > Hd"Let's conjure together"[level=1 t=display-1] + Tx"Tell us what you're brewing"[t=body]) + AR) + (C[p=8] > V[g=4] > Tx"Your details"[t=label] + TI"Full name" + (G[c={min:180} g=3] > TI"Email" + TI"Company") + (G[c={min:180} g=3] > TI"Job title" + TI"Phone") + (V[g=2] > Tx"Reason"[t=label] + (H[g=2] > Tk"Reason"*3)) + SE"Budget" + TA"Project details" + B.primary"Send it into the night")) + (V[g=6] > D + (G[c={min:200} g=6] > (V[g=1 a=center] > Tx"General"[t=supporting] + Lk"hello@castle.dracula")*3))

import {useState, type CSSProperties} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Section} from '@astryxdesign/core/Section';
import {Grid} from '@astryxdesign/core/Grid';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Button} from '@astryxdesign/core/Button';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Token} from '@astryxdesign/core/Token';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';
import {Card} from '@astryxdesign/core/Card';
import {Selector} from '@astryxdesign/core/Selector';

function CastleIllustration() {
  return (
    <svg
      style={illustrationImg}
      viewBox="0 0 400 300"
      role="img"
      aria-label="Moonlit castle where the night crew works">
      <title>Castle office after dark</title>
      <rect width="400" height="300" fill="var(--dracula-bg-dark)" />
      <g fill="var(--dracula-purple)">
        <circle cx="40" cy="40" r="2.5" />
        <circle cx="120" cy="70" r="2" />
        <circle cx="210" cy="36" r="2.5" />
        <circle cx="330" cy="60" r="2" />
      </g>
      <g fill="var(--dracula-cyan)">
        <circle cx="80" cy="55" r="2" />
        <circle cx="170" cy="60" r="2" />
        <circle cx="290" cy="36" r="2.5" />
      </g>
      <circle cx="315" cy="70" r="34" fill="var(--dracula-yellow)" />
      <circle
        cx="304"
        cy="61"
        r="6"
        fill="var(--dracula-orange)"
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="var(--dracula-purple)"
        strokeWidth={3}
        strokeLinecap="round">
        <path d="M90 100 q9 -9 18 0 q9 -9 18 0" />
        <path d="M180 84 q9 -9 18 0 q9 -9 18 0" />
      </g>
      <path
        d="M0 220 Q140 180 260 210 T400 200 V300 H0 Z"
        fill="var(--dracula-selection)"
      />
      <path
        d="M0 255 Q160 225 320 250 T400 245 V300 H0 Z"
        fill="var(--dracula-bg-light)"
      />
      <g>
        <rect
          x="140"
          y="150"
          width="120"
          height="100"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="122"
          y="122"
          width="38"
          height="128"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <rect
          x="240"
          y="122"
          width="38"
          height="128"
          rx={4}
          fill="var(--dracula-bg-lighter)"
        />
        <g fill="var(--dracula-yellow)">
          <rect x="156" y="172" width="12" height="18" rx={2} />
          <rect x="186" y="172" width="12" height="18" rx={2} />
          <rect x="216" y="172" width="12" height="18" rx={2} />
          <rect x="132" y="146" width="9" height="12" rx={2} />
          <rect x="251" y="146" width="9" height="12" rx={2} />
        </g>
        <path
          d="M185 250 v-24 a15 15 0 0 1 30 0 v24 Z"
          fill="var(--dracula-bg-dark)"
        />
      </g>
    </svg>
  );
}

const INQUIRY_REASONS = [
  'New business',
  'General inquiry',
  'Press & media',
  'Partnerships',
  'Product feedback',
  'Technical support',
  'Other',
];

const BUDGET_OPTIONS = [
  'Under $10k',
  '$10k – $50k',
  '$50k – $100k',
  '$100k – $500k',
  '$500k+',
  'Not sure yet',
];

const CONTACT_COLUMNS = [
  {label: 'General inquiries', email: 'hello@castle.dracula'},
  {label: 'New business', email: 'newbiz@castle.dracula'},
  {label: 'Press & partnerships', email: 'press@castle.dracula'},
];

// AspectRatio has no radius prop and there's no Image primitive (#2582), so
// the illustration carries its own corner radius directly.
const pageStyle: CSSProperties = {
  minHeight: '100%',
};
const illustrationImg: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  borderRadius: 'var(--radius-container)',
};

/**
 * Form (Two-column) — marketing contact form template.
 *
 * Layout:
 *   Top: two-column — left has headline + description + illustration,
 *        right has the contact form on a card.
 *   Bottom: three-column contact info strip.
 *   Mobile (<768px): single column stack.
 */
export default function TwoColumnForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryReason, setInquiryReason] = useState('');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted
    ? {
        fullName: !fullName.trim() ? 'Required' : undefined,
        email: !email.trim() ? 'Required' : undefined,
        details: !details.trim() ? 'Required' : undefined,
      }
    : {};

  const handleSubmit = () => setSubmitted(true);

  return (
    <Center style={pageStyle}>
      <Section maxWidth={1100} width="100%" padding={10} variant="transparent">
        <VStack gap={10}>
          {/* Two-column; stacks to one column below ~520px. */}
          <Grid columns={{minWidth: 320}} align="center" gap={10}>
            <VStack gap={6}>
              <VStack gap={3}>
                <Heading level={1} type="display-1">
                  Let&apos;s conjure together
                </Heading>
                <Text type="body" color="secondary">
                  Tell us what you&apos;re brewing and we&apos;ll help you find
                  the best path through the night.
                </Text>
              </VStack>
              <AspectRatio ratio={4 / 3}>
                <CastleIllustration />
              </AspectRatio>
            </VStack>

            <Card padding={8}>
              <VStack gap={4}>
                <Text type="label">Your details</Text>
                <TextInput
                  label="Full name"
                  isLabelHidden
                  placeholder="Full name*"
                  value={fullName}
                  onChange={setFullName}
                  status={
                    errors.fullName
                      ? {type: 'error', message: errors.fullName}
                      : undefined
                  }
                />
                <Grid columns={{minWidth: 180}} gap={3}>
                  <TextInput
                    label="Email"
                    isLabelHidden
                    placeholder="Email*"
                    value={email}
                    onChange={setEmail}
                    status={
                      errors.email
                        ? {type: 'error', message: errors.email}
                        : undefined
                    }
                  />
                  <TextInput
                    label="Company name"
                    isLabelHidden
                    placeholder="Company name"
                    value={company}
                    onChange={setCompany}
                  />
                </Grid>
                <Grid columns={{minWidth: 180}} gap={3}>
                  <TextInput
                    label="Job title"
                    isLabelHidden
                    placeholder="Job title"
                    value={jobTitle}
                    onChange={setJobTitle}
                  />
                  <TextInput
                    label="Phone number"
                    isLabelHidden
                    placeholder="Phone number"
                    value={phone}
                    onChange={setPhone}
                  />
                </Grid>

                <VStack gap={2}>
                  <Text type="label">What are you reaching out about?</Text>
                  <HStack gap={2} wrap="wrap">
                    {INQUIRY_REASONS.map(reason => (
                      <Token
                        key={reason}
                        label={reason}
                        color={inquiryReason === reason ? 'yellow' : 'default'}
                        onClick={() =>
                          setInquiryReason(prev =>
                            prev === reason ? '' : reason,
                          )
                        }
                      />
                    ))}
                  </HStack>
                </VStack>
                <Selector
                  label="Budget range"
                  options={BUDGET_OPTIONS}
                  value={budget}
                  onChange={setBudget}
                  placeholder="Select a budget range..."
                />
                <TextArea
                  label="Project details"
                  isLabelHidden
                  placeholder="Project details*"
                  value={details}
                  onChange={setDetails}
                  status={
                    errors.details
                      ? {type: 'error', message: errors.details}
                      : undefined
                  }
                />
                {/* hAlign="stretch" = full-width button workaround; Button
                    has no full-width prop (#2600). */}
                <VStack hAlign="stretch">
                  <Button
                    label="Send it into the night"
                    variant="primary"
                    onClick={handleSubmit}
                  />
                </VStack>
              </VStack>
            </Card>
          </Grid>

          {/* Contact strip; stacks below ~440px. */}
          <VStack gap={6}>
            <Divider />
            <Grid columns={{minWidth: 200}} gap={6}>
              {CONTACT_COLUMNS.map(col => (
                <VStack key={col.label} gap={1} hAlign="center">
                  <Text type="supporting" color="secondary">
                    {col.label}
                  </Text>
                  <Link href={`mailto:${col.email}`} type="body" size="sm">
                    {col.email}
                  </Link>
                </VStack>
              ))}
            </Grid>
          </VStack>
        </VStack>
      </Section>
    </Center>
  );
}
