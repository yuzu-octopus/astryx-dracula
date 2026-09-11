// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4] > (Ctr.horizontal > C[p=0] > G[c={min:240} g=8 a=stretch] > (S[p=0] > V[g=4] > (H[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (V[g=4] > (V[g=1] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + (V[g=2] > TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?")) + B.primary"Enter the night" + D"Or continue with" + (G[c={min:200} g=3] > B.secondary"Login with Apple" + B.secondary"Login with Google")) + Tx"New to the castle?"[t=supporting]) + (C[p=0] > AR)) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import {useState, useTransition, type CSSProperties} from 'react';
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
import {SceneCastle} from 'astryx-dracula/shared/scene-castle';
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

// Cover art lives in shared/scene-castle (`rooftops` variant:
// crescent-overlay moon over a rooftop skyline). The transparent Card clips
// it to rounded corners (overflow:clip + radius), so the art needs no radius.
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
// WCAG 1.3.5 wants autocomplete on identity fields. TextInput forwards unknown
// props to the <input>, but its prop type omits input-only attributes, so the
// attribute is spread in through a widened record.
const inputAutoComplete = (value: string) =>
  ({autoComplete: value}) as Record<string, string>;

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
  const [isLoading, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setLoginFailed(true);
      return;
    }
    setLoginFailed(false);
    startTransition(async () => {
      await demoLogin();
      setIsSuccess(true);
    });
  };

  return (
    <Center axis="both" style={pageStyle}>
      <style>{LOGIN_SPLIT_CSS}</style>
      <VStack gap={4} width="100%">
        <Center axis="horizontal" style={cardWrap}>
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
                    <Icon icon={Moon} color="accent" size="lg" />
                    <Text type="body" weight="semibold">
                      {AUTH_BRAND_NAME}
                    </Text>
                  </HStack>

                  <StackItem size="fill">
                    <Center axis="vertical" height="100%">
                      {isSuccess ? (
                        <EmptyState
                          title="You're in for the night"
                          description="Drifting to your crypt…"
                          icon={
                            <Icon
                              icon={CircleCheck}
                              size="lg"
                              color="secondary"
                            />
                          }
                        />
                      ) : (
                        <VStack gap={4} hAlign="stretch" width="100%">
                          <VStack gap={1}>
                            <Heading level={1}>
                              {AUTH_HEADING}
                            </Heading>
                            <Text type="body" color="secondary">
                              {AUTH_SUBTITLE}
                            </Text>
                          </VStack>

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
                                        message:
                                          AUTH_ERROR_MESSAGE,
                                      }
                                    : undefined
                                }
                              />
                              {loginFailed && (
                                <VStack hAlign="end">
                                  <Link href="#/templates/login-split">
                                    {AUTH_FORGOT_PASSWORD}
                                  </Link>
                                </VStack>
                              )}
                            </VStack>
                          </VStack>

                          <Button
                            label={AUTH_PRIMARY_CTA}
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            onClick={handleLogin}
                          />

                          <Divider label={AUTH_SSO_DIVIDER} />

                          {/* minWidth (not a fixed 2-up) so the pair stacks inside
                              the narrow single-column container instead of
                              giving each button ~114px for an icon + label. */}
                          <Grid
                            columns={{minWidth: 200, repeat: 'fit'}}
                            gap={3}
                            justify="stretch">
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
                      {AUTH_SIGNUP_PROMPT}{' '}
                      <Link href="#/templates/login-split" type="supporting">
                        {AUTH_SIGNUP_LINK}
                      </Link>
                    </Text>
                  )}
                </VStack>
              </Section>

              {/* Cover art — the transparent Card clips it to rounded
                  corners (overflow:clip + radius), so the art needs no radius. */}
              <Card
                variant="transparent"
                padding={0}
                width="100%"
                height="100%"
                className="login-split-image">
                <SceneCastle variant="rooftops" />
              </Card>
            </Grid>
          </Card>
        </Center>

        <VStack hAlign="center">
          <Text type="supporting" color="secondary">
            {AUTH_TERMS_PREFIX}{' '}
            <Link href="#/templates/login-split" type="supporting">
              {AUTH_TERMS_SERVICE}
            </Link>{' '}
            and{' '}
            <Link href="#/templates/login-split" type="supporting">
              {AUTH_TERMS_PRIVACY}
            </Link>
            .
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
