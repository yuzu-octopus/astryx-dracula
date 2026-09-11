// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=8] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?") + B.primary"Enter the night" + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition, type CSSProperties} from 'react';
import {Moon} from 'lucide-react';
import {demoLogin} from 'astryx-dracula/shared/login-demo';
import {
  AUTH_HEADING,
  AUTH_SUBTITLE,
  AUTH_PRIMARY_CTA,
  AUTH_SIGNUP_PROMPT,
  AUTH_SIGNUP_LINK,
  AUTH_FORGOT_PASSWORD,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_PASSWORD_PLACEHOLDER,
  AUTH_BRAND_NAME,
  AUTH_TERMS_PREFIX,
  AUTH_TERMS_SERVICE,
  AUTH_TERMS_PRIVACY,
} from 'astryx-dracula/shared/auth-copy';
import {VStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';

// Standalone auth page paints its own body background (no host shell).
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-6)',
};
// Cap the column at 400px but let it shrink to fit narrow screens (Stack
// has no maxWidth prop, so it's set here).
const contentStyle: CSSProperties = {
  width: '100%',
  maxWidth: 400,
};
// WCAG 1.3.5 wants autocomplete on identity fields. TextInput forwards unknown
// props to the <input>, but its prop type omits input-only attributes, so the
// attribute is spread in through a widened record.
const inputAutoComplete = (value: string) =>
  ({autoComplete: value}) as Record<string, string>;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) {
      setError('Whisper both your email and password to enter the night.');
      return;
    }
    startTransition(async () => {
      await demoLogin();
    });
  };

  return (
    <Center axis="both" style={pageStyle}>
      <VStack gap={4} hAlign="center" style={contentStyle}>
        {/* Logo */}
        <VStack gap={2} hAlign="center">
          <Icon icon={Moon} size="lg" color="accent" />
          <Text type="body" weight="semibold" size="lg">
            {AUTH_BRAND_NAME}
          </Text>
        </VStack>

        {/* Card */}
        <Card padding={8} width="100%">
          <VStack gap={4} hAlign="stretch">
            <VStack gap={1} hAlign="center">
              <Heading level={1} justify="center">
                {AUTH_HEADING}
              </Heading>
              <Text type="body" color="secondary">
                {AUTH_SUBTITLE}
              </Text>
            </VStack>

            <TextInput
              label="Email"
              isLabelHidden
              value={email}
              onChange={setEmail}
              placeholder={AUTH_EMAIL_PLACEHOLDER}
              type="email"
              {...inputAutoComplete('email')}
              size="lg"
              onEnter={handleSignIn}
            />

            <VStack gap={1}>
              <TextInput
                label="Password"
                isLabelHidden
                value={password}
                onChange={setPassword}
                placeholder={AUTH_PASSWORD_PLACEHOLDER}
                type="password"
                {...inputAutoComplete('current-password')}
                size="lg"
                onEnter={handleSignIn}
                status={
                  error
                    ? {
                        type: 'error',
                        message: error,
                      }
                    : undefined
                }
              />
              {error && (
                <VStack hAlign="end">
                  <Link
                    href="#/templates/login"
                    size="sm"
                    color="secondary"
                    type="supporting">
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

            {/* Sign up link */}
            <VStack hAlign="center">
              <Text type="supporting" color="secondary">
                {AUTH_SIGNUP_PROMPT}{' '}
                <Link href="#/templates/login" type="supporting">
                  {AUTH_SIGNUP_LINK}
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Card>

        {/* Terms */}
        <VStack hAlign="center" width="100%">
          <Text type="supporting" color="secondary" justify="center">
            {AUTH_TERMS_PREFIX}{' '}
            <Link href="#/templates/login" type="supporting">
              {AUTH_TERMS_SERVICE}
            </Link>{' '}
            and{' '}
            <Link href="#/templates/login" type="supporting">
              {AUTH_TERMS_PRIVACY}
            </Link>
            .
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
