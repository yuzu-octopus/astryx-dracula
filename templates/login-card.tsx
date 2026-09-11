// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=8] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + (V[g=2] > TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?")) + B.primary"Enter the night" + D"Or continue with" + (V[g=3] > B.secondary"Login with Apple" + B.secondary"Login with Google") + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition, type CSSProperties} from 'react';
import {Moon} from 'lucide-react';
import {demoLogin} from 'astryx-dracula/shared/login-demo';
import {AppleIcon, GoogleIcon} from 'astryx-dracula/shared/sso-icons';
import {
  AUTH_HEADING,
  AUTH_SUBTITLE,
  AUTH_PRIMARY_CTA,
  AUTH_SIGNUP_PROMPT,
  AUTH_SIGNUP_LINK,
  AUTH_SSO_DIVIDER,
  AUTH_FORGOT_PASSWORD,
  AUTH_ERROR_MESSAGE,
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
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';

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

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const handleLogin = () => {
    if (!email || !password) {
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
            {/* Header */}
            <VStack gap={1} hAlign="center">
              <Heading level={1}>{AUTH_HEADING}</Heading>
              <Text type="body" color="secondary">
                {AUTH_SUBTITLE}
              </Text>
            </VStack>

            {/* Form fields */}
            <VStack gap={2}>
              <TextInput
                label="Email"
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
                onEnter={handleLogin}
              />
              <VStack gap={1}>
                <TextInput
                  label="Password"
                  isLabelHidden
                  placeholder={AUTH_PASSWORD_PLACEHOLDER}
                  type="password"
                  {...inputAutoComplete('current-password')}
                  value={password}
                  onChange={(v: string) => {
                    setPassword(v);
                    setLoginFailed(false);
                  }}
                  size="lg"
                  onEnter={handleLogin}
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
                    <Link
                      href="#/templates/login-card"
                      size="sm"
                      color="secondary"
                      type="supporting">
                      {AUTH_FORGOT_PASSWORD}
                    </Link>
                  </VStack>
                )}
              </VStack>
            </VStack>

            {/* Login button */}
            <Button
              label={AUTH_PRIMARY_CTA}
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onClick={handleLogin}
            />

            {/* Divider */}
            <Divider label={AUTH_SSO_DIVIDER} />

            {/* Social buttons */}
            <VStack gap={3} hAlign="stretch">
              <Button
                label="Login with Apple"
                variant="secondary"
                icon={<AppleIcon />}
                size="lg"
              />
              <Button
                label="Login with Google"
                variant="secondary"
                icon={<GoogleIcon />}
                size="lg"
              />
            </VStack>

            {/* Sign up link */}
            <VStack hAlign="center">
              <Text type="supporting" color="secondary">
                {AUTH_SIGNUP_PROMPT}{' '}
                <Link href="#/templates/login-card" type="supporting">
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
            <Link href="#/templates/login-card" type="supporting">
              {AUTH_TERMS_SERVICE}
            </Link>{' '}
            and{' '}
            <Link href="#/templates/login-card" type="supporting">
              {AUTH_TERMS_PRIVACY}
            </Link>
            .
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
