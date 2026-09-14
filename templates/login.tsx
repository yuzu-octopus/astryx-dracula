// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=4] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?") + B.primary"Enter the night" + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition} from 'react';
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

import {
  authPageStyle as pageStyle,
  authContentStyle as contentStyle,
  inputAutoComplete,
  LoginBrand,
} from 'astryx-dracula/shared/auth-chrome';

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
        <LoginBrand />

        {/* Card */}
        <Card padding={4} width="100%">
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
                    color="secondary">
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
