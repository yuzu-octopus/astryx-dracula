// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   Ctr > V[g=4] > (Ctr.horizontal > C[p=0] > G[c={min:240} g=8 a=stretch] > (S[p=0] > V[g=4] > (H[g=2 a=center] > Ic + Tx"Castle Dracula"[t=body]) + (V[g=4] > (V[g=1] > Hd"Welcome back to the night"[level=1] + Tx"Sign in to your crypt"[t=body]) + (V[g=2] > TI"Email"[t=email] + (V[g=1] > TI"Password"[t=password] + Lk"Forgot password?")) + B.primary"Enter the night" + D"Or continue with" + (G[c={min:200} g=3] > B.secondary"Login with Apple" + B.secondary"Login with Google")) + (V[a=center] > Tx"New to the castle?"[t=supporting] + Lk"Sign up")) + (C[p=0] > AR)) + (V[a=center] > Tx"By clicking continue, you agree to our Terms of service and Privacy policy"[t=supporting])

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Center } from "@astryxdesign/core/Center";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { authPageStyle, inputAutoComplete } from "astryx-dracula/shared/auth-chrome-config";
import {
	AUTH_BRAND_NAME,
	AUTH_EMAIL_PLACEHOLDER,
	AUTH_ERROR_MESSAGE,
	AUTH_FORGOT_PASSWORD,
	AUTH_HEADING,
	AUTH_PASSWORD_PLACEHOLDER,
	AUTH_PRIMARY_CTA,
	AUTH_SIGNUP_LINK,
	AUTH_SIGNUP_PROMPT,
	AUTH_SSO_DIVIDER,
	AUTH_SUBTITLE,
	AUTH_TERMS_PREFIX,
	AUTH_TERMS_PRIVACY,
	AUTH_TERMS_SERVICE,
} from "astryx-dracula/shared/auth-copy";
import { demoLogin } from "astryx-dracula/shared/login-demo";
import { SceneCastle } from "astryx-dracula/shared/scene-castle";
import { AppleIcon, GoogleIcon } from "astryx-dracula/shared/sso-icons";
// ============= ICONS (verified lucide-react exports) =============
// Moon is the castle brand mark (see login, login-card).
import { Moon } from "lucide-react";
import { useState, useTransition } from "react";

// Cover art lives in shared/scene-castle (`rooftops` variant:
// crescent-overlay moon over a rooftop skyline). The transparent Card clips
// it to rounded corners (overflow:clip + radius), so the art needs no radius.
const cardWrap = {
	width: "100%",
	maxWidth: 1000,
	marginInline: "auto",
} as const;

// The container query lives in a plain <style> tag so it needs NO CSS compiler.
// - Pad the grid, not the Card: the form's Section escapes Card's
//   --container-padding-* vars, which would cancel the inset on the form side.
//   container-type makes the grid the query container for the stack point.
// - repeat:'fit' (auto-fit) collapses the two columns to one below 511px; the
//   query reorders the image (order:-1) and tightens the inset at that point,
//   keyed to the card width (not the window) so it never desyncs.
// Grid emits minmax(240, 1fr) where 240 is a hard floor, so MIN plus the grid
// inset and page padding must fit the narrowest phone: 320 − 2×24 (page) −
// 2×16 (stacked inset) = 240.
const LOGIN_SPLIT_CSS = `
.login-split-grid {
  container-type: inline-size;
  container-name: login-split;
  padding: var(--spacing-4);
}
.login-split-image {
  width: 100%;
  order: 0;
}
@container login-split (max-width: 511px) {
  .login-split-grid {
    padding: var(--spacing-3);
  }
  .login-split-image {
    order: -1;
  }
}
`;

export default function LoginSplit() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
		});
	};

	return (
		<Center axis="both" style={authPageStyle}>
			<style>{LOGIN_SPLIT_CSS}</style>
			<VStack gap={4} width="100%">
				<Center axis="horizontal" style={cardWrap}>
					<Card padding={0} width="100%">
						<Grid
							columns={{ minWidth: 240, repeat: "fit" }}
							gap={8}
							align="stretch"
							className="login-split-grid"
						>
							{/* Form */}
							<Section variant="transparent" padding={0} height="100%">
								<VStack gap={4} height="100%">
									<HStack gap={2} vAlign="center">
										<Icon icon={Moon} color="secondary" size="lg" />
										<Text type="body" weight="semibold">
											{AUTH_BRAND_NAME}
										</Text>
									</HStack>

									<StackItem size="fill">
										<Center axis="vertical" height="100%">
											<VStack gap={4} hAlign="stretch" width="100%">
												<VStack gap={1}>
													<Heading level={1} type="display-2">
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
														{...inputAutoComplete("email")}
														placeholder={AUTH_EMAIL_PLACEHOLDER}
														value={email}
														onChange={(v: string) => {
															setEmail(v);
															setError(null);
														}}
														size="lg"
														onEnter={handleLogin}
														status={error ? { type: "error", message: error } : undefined}
													/>
													<VStack gap={1}>
														<TextInput
															label="Password"
															isLabelHidden
															placeholder={AUTH_PASSWORD_PLACEHOLDER}
															type="password"
															{...inputAutoComplete("current-password")}
															value={password}
															onChange={(v: string) => {
																setPassword(v);
																setError(null);
															}}
															size="lg"
															onEnter={handleLogin}
															status={error ? { type: "error", message: error } : undefined}
														/>
														{error && (
															<VStack hAlign="end">
																<Link href="#/templates/login-split" isStandalone>
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
												<Grid columns={{ minWidth: 200, repeat: "fit" }} gap={3} justify="stretch">
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
										</Center>
									</StackItem>

									{/* Prose link: colour alone is not a cue inside a sentence
                      (WCAG 1.4.1 / F73), so it asks for the underline the kit
                      only gives on hover. The VStack centres the line, as the
                      other three login templates do — it was sitting flush
                      left under a left-aligned form. */}
									<VStack hAlign="center">
										<Text type="supporting" color="secondary">
											{AUTH_SIGNUP_PROMPT}{" "}
											<Link href="#/templates/login-split" type="supporting" hasUnderline>
												{AUTH_SIGNUP_LINK}
											</Link>
										</Text>
									</VStack>
								</VStack>
							</Section>

							{/* Cover art — the transparent Card clips it to rounded
                  corners (overflow:clip + radius), so the art needs no radius. */}
							<Card
								variant="transparent"
								padding={0}
								width="100%"
								height="100%"
								className="login-split-image"
							>
								<SceneCastle variant="rooftops" />
							</Card>
						</Grid>
					</Card>
				</Center>

				<VStack hAlign="center" width="100%">
					<Text type="supporting" color="secondary" justify="center">
						{AUTH_TERMS_PREFIX}{" "}
						<Link href="#/templates/login-split" type="supporting" hasUnderline>
							{AUTH_TERMS_SERVICE}
						</Link>{" "}
						and{" "}
						<Link href="#/templates/login-split" type="supporting" hasUnderline>
							{AUTH_TERMS_PRIVACY}
						</Link>
						.
					</Text>
				</VStack>
			</VStack>
		</Center>
	);
}
