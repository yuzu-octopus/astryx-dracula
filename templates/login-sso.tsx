// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type CSSProperties} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Section} from '@astryxdesign/core/Section';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';
import {Avatar} from '@astryxdesign/core/Avatar';

// ============= ICONS (verified lucide-react exports) =============
// ShieldCheck ← ShieldCheckIcon.
import {ShieldCheck} from 'lucide-react';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

// Standalone auth page paints its own body background (no host shell).
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-6)',
};

type SSOProvider = {
  name: string;
  abbr: string;
};
const SSO_PROVIDERS: Record<string, SSOProvider> = {
  'google.com': {name: 'Google Workspace', abbr: 'G'},
  'microsoft.com': {name: 'Microsoft Entra ID', abbr: 'M'},
  'okta.com': {name: 'Okta', abbr: 'O'},
  'meta.com': {name: 'Meta SSO', abbr: 'M'},
  'apple.com': {name: 'Apple Business', abbr: 'A'},
};

function getProvider(email: string) {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? (SSO_PROVIDERS[domain] ?? null) : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Step = 'email' | 'sso-confirm' | 'password-fallback';

export default function LoginSso() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const provider = getProvider(email);
  const emailValid = isValidEmail(email);

  const handleContinue = () => {
    if (!emailValid) {
      return;
    }
    if (provider) {
      setStep('sso-confirm');
    } else {
      setStep('password-fallback');
    }
  };

  const handleBack = () => {
    setStep('email');
    setLoginFailed(false);
    setIsLoading(false);
  };

  const handleSignIn = () => {
    if (!password) {
      setLoginFailed(true);
      return;
    }
    setIsLoading(true);
    setLoginFailed(false);
    setTimeout(() => {
      setIsLoading(false);
      setLoginFailed(true);
    }, 2000);
  };

  return (
    <Center axis="both" style={pageStyle}>
      <Card padding={8} width="100%" maxWidth={400}>
        <VStack gap={4} hAlign="stretch">
          {/* ── Step 1: Email entry ── */}
          {step === 'email' && (
            <>
              <VStack gap={1} hAlign="center">
                <Heading level={2}>Welcome back to the night</Heading>
                <Text type="body" color="secondary">
                  Whisper your details to enter the night
                </Text>
              </VStack>

              <VStack gap={2}>
                <TextInput
                  label="Work email"
                  isLabelHidden
                  type="email"
                  placeholder="you@castle.dracula"
                  value={email}
                  onChange={setEmail}
                  size="lg"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      handleContinue();
                    }
                  }}
                />
                <TextInput
                  label="Password"
                  isLabelHidden
                  type="password"
                  placeholder="Whisper your password"
                  value={password}
                  onChange={setPassword}
                  size="lg"
                />
              </VStack>

              <Link href="#/templates/login-sso" size="sm" color="secondary" type="supporting">
                Having trouble signing in?
              </Link>

              <Button
                label="Enter the night"
                variant="primary"
                size="lg"
                onClick={handleContinue}
                isDisabled={!emailValid}
              />

              <Divider label="Or sign in with" />

              <Button
                label="Continue with SSO"
                variant="secondary"
                size="lg"
                onClick={handleContinue}
                isDisabled={!emailValid}
              />

              <VStack hAlign="center">
                <Text type="supporting" color="secondary">
                  New to the castle?{' '}
                  <Link href="#/templates/login-sso" type="supporting">
                    Request access
                  </Link>
                </Text>
              </VStack>
            </>
          )}

          {/* ── Step 2a: SSO provider detected ── */}
          {step === 'sso-confirm' && provider && (
            <>
              <VStack gap={2} hAlign="center">
                <Avatar name={provider.name} size={48} />
                <Heading level={2}>Sign in with {provider.name}</Heading>
                <Text type="body" color="secondary">
                  You will be redirected back after signing in.
                </Text>
              </VStack>

              <Card padding={0}>
                <Section variant="muted" padding={4}>
                  <HStack gap={2} vAlign="center">
                    <Icon icon={ShieldCheck} color="secondary" />
                    <VStack gap={0}>
                      <Text type="label">{provider.name}</Text>
                      <Text type="supporting" color="secondary">
                        {email}
                      </Text>
                    </VStack>
                  </HStack>
                </Section>
              </Card>

              <VStack gap={3}>
                <Button
                  label={`Continue with ${provider.name}`}
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onClick={() => setIsLoading(true)}
                />
                <Button
                  label="Use a different email"
                  variant="ghost"
                  size="lg"
                  onClick={handleBack}
                />
              </VStack>
            </>
          )}

          {/* ── Step 2b: No SSO — password fallback ── */}
          {step === 'password-fallback' && (
            <>
              <VStack gap={1} hAlign="center">
                <Heading level={2}>Welcome back to the night</Heading>
                <Text type="body" color="secondary">
                  {email}
                </Text>
              </VStack>

              <VStack gap={4}>
                <VStack gap={1}>
                  <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    size="lg"
                    onChange={(v: string) => {
                      setPassword(v);
                      setLoginFailed(false);
                    }}
                    status={
                      loginFailed
                        ? {
                            type: 'error',
                            message: 'Wrong incantation. Try again.',
                          }
                        : undefined
                    }
                  />
                  {loginFailed && (
                    <VStack hAlign="end">
                      <Link
                        href="#/templates/login-sso"
                        size="sm"
                        color="secondary"
                        type="supporting">
                        Forgot password?
                      </Link>
                    </VStack>
                  )}
                </VStack>

                <Button
                  label="Enter the night"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onClick={handleSignIn}
                />
                <Button
                  label="Use a different email"
                  variant="ghost"
                  size="lg"
                  onClick={handleBack}
                />
              </VStack>
            </>
          )}
        </VStack>
      </Card>
    </Center>
  );
}
