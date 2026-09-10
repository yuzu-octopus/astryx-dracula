// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4 a=center] > (V[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (C[p=8] > V[g=4] > (V[g=1 a=center] > Hd"Welcome back to the night"[level=2] + Tx"Sign in to your crypt"[t=body]) + TI"Email"[t=email] + TI"Password"[t=password] + B.primary"Enter the night")

import {useState, useTransition, type CSSProperties} from 'react';
import {Moon} from 'lucide-react';
import {VStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Text, Heading} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Banner} from '@astryxdesign/core/Banner';

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
      const {promise, resolve} = Promise.withResolvers<void>();
      setTimeout(resolve, 2000);
      await promise;
    });
  };

  return (
    <Center axis="both" style={pageStyle}>
      <VStack gap={4} hAlign="center" style={contentStyle}>
        {/* Logo */}
        <VStack gap={2} hAlign="center">
          <Icon icon={Moon} size="lg" color="accent" />
          <Text type="body" weight="bold" size="lg">
            Castle Dracula
          </Text>
        </VStack>

        {/* Card */}
        <Card padding={8} width="100%">
          <VStack gap={4} hAlign="stretch">
            <VStack gap={1} hAlign="center">
              <Heading level={2} justify="center">
                Welcome back to the night
              </Heading>
              <Text type="body" color="secondary">
                Sign in to your crypt
              </Text>
            </VStack>

            {error && <Banner status="error" title={error} container="card" />}

            <TextInput
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@castle.dracula"
              type="email"
              size="lg"
            />

            <TextInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Whisper your password"
              type="password"
              size="lg"
            />

            <Button
              label="Enter the night"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onClick={handleSignIn}
            />
          </VStack>
        </Card>
      </VStack>
    </Center>
  );
}
