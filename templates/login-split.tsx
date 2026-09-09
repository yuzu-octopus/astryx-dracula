// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, type CSSProperties} from 'react';
import {VStack, HStack, StackItem} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Center} from '@astryxdesign/core/Center';
import {Card} from '@astryxdesign/core/Card';
import {Section} from '@astryxdesign/core/Section';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';

// ============= ICONS (verified lucide-react exports) =============
// Moon is the castle brand mark (see login, login-card); CircleCheck ←
// CheckCircleIcon. The SquaresPlusIcon brand mark has no place here.
import {Moon, CircleCheck} from 'lucide-react';

// Brand sign-in marks — bespoke inline glyphs, no icon-library equivalent.
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
    aria-hidden="true"
    {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={16}
    height={16}
    aria-hidden="true"
    {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// Cover art is inline Dracula SVG — moonlit rooftops in brand tokens, no
// external image. Fills the panel via slice, like the placeholder before it.
const coverArt: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};

const nightCoverArt = (
  <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={coverArt}
      role="img"
      aria-label="Harvest moon over the castle rooftops">
      <rect width="400" height="300" fill="var(--dracula-bg)" />
      <circle cx="68" cy="52" r="2" fill="var(--dracula-fg)" />
      <circle cx="140" cy="36" r="1.5" fill="var(--dracula-comment)" />
      <circle cx="330" cy="70" r="2" fill="var(--dracula-fg)" />
      <circle cx="292" cy="34" r="1.5" fill="var(--dracula-comment)" />
      <circle cx="360" cy="140" r="1.5" fill="var(--dracula-comment)" />
      <circle cx="200" cy="118" r="52" fill="var(--dracula-yellow)" />
      <circle cx="182" cy="104" r="44" fill="var(--dracula-bg)" />
      <g
        fill="var(--dracula-current-line)"
        stroke="var(--dracula-comment)"
        strokeWidth="3"
        strokeLinejoin="round">
        <rect x="20" y="220" width="110" height="80" />
        <path d="M20 220 L75 178 L130 220 Z" />
        <rect x="150" y="200" width="100" height="100" />
        <path d="M150 200 L200 162 L250 200 Z" />
        <rect x="270" y="228" width="110" height="72" />
        <path d="M270 228 L325 190 L380 228 Z" />
      </g>
      <g fill="var(--dracula-purple)">
        <rect x="58" y="244" width="14" height="18" />
        <rect x="188" y="224" width="14" height="18" />
        <rect x="312" y="250" width="14" height="18" />
      </g>
  </svg>
);

// Grid emits minmax(MIN, 1fr) where MIN is a hard floor, so MIN plus the
// grid inset and page padding must fit the narrowest phone or the column is
// clipped. 320 − 2×24 (page) − 2×16 (stacked inset) = 240.
const COLUMN_MIN_WIDTH = 240;
// repeat:'fit' (auto-fit) collapses the two columns to one — expanding to fill —
// below 2×MIN + 32(gap) = 512px. The container query reorders the image and
// tightens the inset at that same point, keyed to the card width (not the
// window) so it never desyncs.
// minHeight:100% fills the host so the centered card never leaves an unpainted
// band; padding keeps it off the surface edges.
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-6)',
};
const cardWrap: CSSProperties = {
  width: '100%',
  maxWidth: 1000,
  marginInline: 'auto',
};

// The container query lives in a plain <style> tag so it needs NO CSS compiler.
// - Pad the grid, not the Card: the form's Section escapes Card's
//   --container-padding-* vars, which would cancel the inset on the form side.
//   container-type makes the grid the query container for the stack point.
// - repeat:'fit' (auto-fit) collapses the two columns to one below 511px; the
//   query reorders the image (order:-1) and tightens the inset at that point,
//   keyed to the card width (not the window) so it never desyncs.
const LOGIN_SPLIT_CSS = `
.login-split-grid {
  container-type: inline-size;
  container-name: login-split;
  padding: var(--spacing-8);
}
.login-split-image {
  width: 100%;
  order: 0;
}
@container login-split (max-width: 511px) {
  .login-split-grid {
    padding: var(--spacing-4);
  }
  .login-split-image {
    order: -1;
  }
}
`;

export default function LoginSplit() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setLoginFailed(true);
      return;
    }
    setIsLoading(true);
    setLoginFailed(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <Center axis="both" style={pageStyle}>
      <style>{LOGIN_SPLIT_CSS}</style>
      <VStack gap={4} width="100%">
        <div style={cardWrap}>
          <Card padding={0} width="100%">
            <Grid
              columns={{minWidth: COLUMN_MIN_WIDTH, repeat: 'fit'}}
              gap={8}
              align="stretch"
              className="login-split-grid">
              {/* Form */}
              <Section variant="transparent" padding={0} height="100%">
                <VStack gap={4} height="100%">
                  <HStack gap={2} vAlign="center">
                    <Icon icon={Moon} color="accent" />
                    <Text type="body" weight="bold">
                      Castle Dracula
                    </Text>
                  </HStack>

                  <StackItem size="fill">
                    <Center axis="vertical" height="100%">
                      {isSuccess ? (
                        <EmptyState
                          title="You're in for the night"
                          description="Drifting to your crypt…"
                          icon={<Icon icon={CircleCheck} size="lg" />}
                        />
                      ) : (
                        <VStack gap={4} hAlign="stretch" width="100%">
                          <VStack gap={1}>
                            <Heading level={2}>
                              Welcome back to the night
                            </Heading>
                            <Text type="body" color="secondary">
                              Sign in to your crypt
                            </Text>
                          </VStack>

                          <VStack gap={2}>
                            <TextInput
                              label="Email"
                              isLabelHidden
                              type="email"
                              placeholder="you@castle.dracula"
                              value={email}
                              onChange={setEmail}
                              size="lg"
                            />
                            <VStack gap={1}>
                              <TextInput
                                label="Password"
                                isLabelHidden
                                placeholder="Whisper your password"
                                type="password"
                                value={password}
                                onChange={(v: string) => {
                                  setPassword(v);
                                  setLoginFailed(false);
                                }}
                                size="lg"
                                status={
                                  loginFailed
                                    ? {
                                        type: 'error',
                                        message:
                                          'Wrong incantation. Try again.',
                                      }
                                    : undefined
                                }
                              />
                              {loginFailed && (
                                <VStack hAlign="end">
                                  <Link
                                    href="#/templates/login-split"
                                    size="sm"
                                    color="secondary"
                                    type="supporting">
                                    Forgot your password?
                                  </Link>
                                </VStack>
                              )}
                            </VStack>
                          </VStack>

                          <Button
                            label="Enter the night"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            onClick={handleLogin}
                          />

                          <Divider label="Or continue with" />

                          <Grid columns={2} gap={3} justify="stretch">
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
                          </Grid>
                        </VStack>
                      )}
                    </Center>
                  </StackItem>

                  {!isSuccess && (
                    <Text type="supporting" color="secondary">
                      New to the castle?{' '}
                      <Link href="#/templates/login-split" type="supporting">
                        Sign up
                      </Link>
                    </Text>
                  )}
                </VStack>
              </Section>

              {/* Cover art — the transparent Card clips it to rounded
                  corners (overflow:clip + radius), so the art needs no radius. */}
              <div className="login-split-image">
                <Card
                  variant="transparent"
                  padding={0}
                  width="100%"
                  height="100%">
                  {nightCoverArt}
                </Card>
              </div>
            </Grid>
          </Card>
        </div>

        <VStack hAlign="center">
          <Text type="supporting" color="secondary">
            By clicking continue, you agree to our{' '}
            <Link href="#/templates/login-split" type="supporting">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#/templates/login-split" type="supporting">
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
