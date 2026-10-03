// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=4] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + (V[g=2] > TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?")) + B.primary"Enter the night" + D"Or continue with" + (V[g=3] > B.secondary"Login with Apple" + B.secondary"Login with Google") + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition} from 'react';
import {demoLogin} from 'astryx-dracula/shared/login-demo';
import {AppleIcon, GoogleIcon} from 'astryx-dracula/shared/sso-icons';
import {
  AUTH_SSO_DIVIDER,
  AUTH_ERROR_MESSAGE,
} from 'astryx-dracula/shared/auth-copy';
import {VStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';

import {authPageStyle as pageStyle, authContentStyle as contentStyle} from 'astryx-dracula/shared/auth-chrome-config';
import {LoginBrand, AuthCard, AuthLoginFields} from 'astryx-dracula/shared/auth-chrome';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const handleLogin = () => {
    if (!email || !password) {
      setError(AUTH_ERROR_MESSAGE);
      return;
    }
    setError(null);
    startTransition(async () => {
      await demoLogin();
      setError(AUTH_ERROR_MESSAGE);
    });
  };

  return (
    <Center axis="both" style={pageStyle}>
      <VStack gap={4} hAlign="center" style={contentStyle}>
        <LoginBrand />

        <AuthCard selfHash="#/templates/login-card">
          <AuthLoginFields
            email={email}
            password={password}
            error={error}
            selfHash="#/templates/login-card"
            isLoading={isLoading}
            onEmailChange={(v: string) => {
              setEmail(v);
              setError(null);
            }}
            onPasswordChange={(v: string) => {
              setPassword(v);
              setError(null);
            }}
            onSubmit={handleLogin}
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
        </AuthCard>
      </VStack>
    </Center>
  );
}
