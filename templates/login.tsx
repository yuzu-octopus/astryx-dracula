// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=4] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?") + B.primary"Enter the night" + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition} from 'react';
import {demoLogin} from 'astryx-dracula/shared/login-demo';
import {AUTH_ERROR_MESSAGE} from 'astryx-dracula/shared/auth-copy';
import {VStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';

import {authPageStyle as pageStyle, authContentStyle as contentStyle} from 'astryx-dracula/shared/auth-chrome-config';
import {LoginBrand, AuthCard, AuthLoginFields} from 'astryx-dracula/shared/auth-chrome';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = () => {
    setError(null);
    if (!email || !password) {
      setError(AUTH_ERROR_MESSAGE);
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

        <AuthCard selfHash="#/templates/login">
          <AuthLoginFields
            email={email}
            password={password}
            error={error}
            selfHash="#/templates/login"
            isLoading={isLoading}
            onEmailChange={v => {
              setEmail(v);
              setError(null);
            }}
            onPasswordChange={v => {
              setPassword(v);
              setError(null);
            }}
            onSubmit={handleSignIn}
          />
        </AuthCard>
      </VStack>
    </Center>
  );
}
