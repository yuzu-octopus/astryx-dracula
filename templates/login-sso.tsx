// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > C[p=8 mw=400] > V[g=4] > ((V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Whisper your details to enter the night"[t=body]) + TI"Work email"[t=email] + Lk"Having trouble signing in?" + B.primary"Continue" + D"Or continue with" + B.secondary"Continue with SSO" + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Request access") + (V[g=2 a=center] > Av + Hd"Sign in with Google Workspace"[level=1] + Tx"You will be redirected back after signing in."[t=body]) + (C[p=0] > S[p=4 muted] > (H[g=2 a=center] > Ic + (V[g=0] > Tx"Google Workspace"[t=label] + Tx"vlad@castle.ro"[t=supporting]))) + (V[g=3] > B.primary"Continue with Google Workspace" + B.ghost"Use a different email") + (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"vlad@castle.ro"[t=body]) + (V[g=4] > (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?") + B.primary"Enter the night" + B.ghost"Use a different email") + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting]))

//   Step-conditional h1: the email and SSO-confirm steps each render their own
//   h1 (email entry vs provider confirm); the password fallback reuses the
//   family heading, so exactly one h1 shows per step.
import {useState, useTransition, type CSSProperties} from 'react';
import {demoLogin} from 'astryx-dracula/shared/login-demo';
import {
  AUTH_HEADING,
  AUTH_PRIMARY_CTA,
  AUTH_SIGNUP_PROMPT,
  AUTH_SSO_DIVIDER,
  AUTH_FORGOT_PASSWORD,
  AUTH_ERROR_MESSAGE,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_TERMS_PREFIX,
  AUTH_TERMS_SERVICE,
  AUTH_TERMS_PRIVACY,
} from 'astryx-dracula/shared/auth-copy';
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
// WCAG 1.3.5 wants autocomplete on identity fields. TextInput forwards unknown
// props to the <input>, but its prop type omits input-only attributes, so the
// attribute is spread in through a widened record.
const inputAutoComplete = (value: string) =>
  ({autoComplete: value}) as Record<string, string>;

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
  const [isLoading, startTransition] = useTransition();

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
  };

  const handleSignIn = () => {
    if (!password) {
      setLoginFailed(true);
      return;
    }
    setLoginFailed(false);
    startTransition(async () => {
      await demoLogin();
      setLoginFailed(true);
    });
  };

  return (
    <Center axis="both" style={pageStyle}>
      <Card padding={8} width="100%" maxWidth={400}>
        <VStack gap={4} hAlign="stretch">
          {/* ── Step 1: Email entry, route by domain ──
              The password is collected on the fallback step below, never
              here: a recognised domain goes straight to SSO. */}
          {step === 'email' && (
            <>
              <VStack gap={1} hAlign="center">
                <Heading level={1}>{AUTH_HEADING}</Heading>
                <Text type="body" color="secondary">
                  Whisper your details to enter the night
                </Text>
              </VStack>

              <TextInput
                label="Work email"
                isLabelHidden
                type="email"
                {...inputAutoComplete('email')}
                placeholder={AUTH_EMAIL_PLACEHOLDER}
                value={email}
                onChange={(v: string) => {
                  setEmail(v);
                  setLoginFailed(false);
                }}
                size="lg"
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
              />

              <Link href="#/templates/login-sso">
                Having trouble signing in?
              </Link>

              <Button
                label="Continue"
                variant="primary"
                size="lg"
                onClick={handleContinue}
                isDisabled={!emailValid}
              />

              <Divider label={AUTH_SSO_DIVIDER} />

              <Button
                label="Continue with SSO"
                variant="secondary"
                size="lg"
                onClick={handleContinue}
                isDisabled={!emailValid}
              />

              <VStack hAlign="center">
                <Text type="supporting" color="secondary">
                  {AUTH_SIGNUP_PROMPT}{' '}
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
                <Heading level={1}>Sign in with {provider.name}</Heading>
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
                  onClick={() => {
                    startTransition(async () => {
                      await demoLogin();
                    });
                  }}
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
                <Heading level={1}>{AUTH_HEADING}</Heading>
                <Text type="body" color="secondary">
                  {email}
                </Text>
              </VStack>

              <VStack gap={4}>
                <VStack gap={1}>
                  <TextInput
                    label="Password"
                    type="password"
                    {...inputAutoComplete('current-password')}
                    value={password}
                    size="lg"
                    onChange={(v: string) => {
                      setPassword(v);
                      setLoginFailed(false);
                    }}
                    onEnter={handleSignIn}
                    status={
                      loginFailed
                        ? {
                            type: 'error',
                            message: AUTH_ERROR_MESSAGE,
                          }
                        : undefined
                    }
                  />
                  {loginFailed && (
                    <VStack hAlign="end">
                      <Link href="#/templates/login-sso">
                        {AUTH_FORGOT_PASSWORD}
                      </Link>
                    </VStack>
                  )}
                </VStack>

                <Button
                  label={AUTH_PRIMARY_CTA}
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

          {/* Terms — family line, shown on every step */}
          <VStack hAlign="center" width="100%">
            <Text type="supporting" color="secondary" justify="center">
              {AUTH_TERMS_PREFIX}{' '}
              <Link href="#/templates/login-sso" type="supporting">
                {AUTH_TERMS_SERVICE}
              </Link>{' '}
              and{' '}
              <Link href="#/templates/login-sso" type="supporting">
                {AUTH_TERMS_PRIVACY}
              </Link>
              .
            </Text>
          </VStack>
        </VStack>
      </Card>
    </Center>
  );
}
