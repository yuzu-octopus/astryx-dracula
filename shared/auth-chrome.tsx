// Shared login chrome: page wash + 400px column + Moon brand row + the
// autocomplete widen-record TextInput needs (prop type omits input attrs).

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { inputAutoComplete } from "astryx-dracula/shared/auth-chrome-config";
import {
	AUTH_BRAND_NAME,
	AUTH_EMAIL_PLACEHOLDER,
	AUTH_FORGOT_PASSWORD,
	AUTH_HEADING,
	AUTH_PASSWORD_PLACEHOLDER,
	AUTH_PRIMARY_CTA,
	AUTH_SIGNUP_LINK,
	AUTH_SIGNUP_PROMPT,
	AUTH_SUBTITLE,
	AUTH_TERMS_PREFIX,
	AUTH_TERMS_PRIVACY,
	AUTH_TERMS_SERVICE,
} from "astryx-dracula/shared/auth-copy";
import { Moon } from "lucide-react";
import type { ReactNode } from "react";

export function LoginBrand() {
	return (
		<VStack gap={2} hAlign="center">
			<Icon icon={Moon} size="lg" color="secondary" />
			<Text type="body" weight="semibold" size="lg">
				{AUTH_BRAND_NAME}
			</Text>
		</VStack>
	);
}

// Shared password-login core: the centered header, credential fields, primary
// CTA, signup line and terms line every password page in the family carries.
// The three pages differed only in what sits between the CTA and the signup
// line (nothing, or the SSO divider + provider buttons) and in their outer
// shell — login-split's two-column grid and login-sso's step machine keep
// their own markup and take the pieces below instead of this whole card.
export function AuthCard({
	selfHash,
	signupLink = AUTH_SIGNUP_LINK,
	children,
}: {
	selfHash: string;
	signupLink?: string;
	children: ReactNode;
}) {
	return (
		<>
			<Card padding={4} width="100%">
				<VStack gap={4} hAlign="stretch">
					<VStack gap={1} hAlign="center">
						<Heading level={1} type="display-2" justify="center">
							{AUTH_HEADING}
						</Heading>
						<Text type="body" color="secondary">
							{AUTH_SUBTITLE}
						</Text>
					</VStack>
					{children}
					{/* Prose link: colour alone is not a cue inside a sentence
              (WCAG 1.4.1 / F73), so it asks for the underline the kit
              only gives on hover. */}
					<VStack hAlign="center">
						<Text type="supporting" color="secondary">
							{AUTH_SIGNUP_PROMPT}{" "}
							<Link href={selfHash} type="supporting" hasUnderline>
								{signupLink}
							</Link>
						</Text>
					</VStack>
				</VStack>
			</Card>
			<AuthTerms selfHash={selfHash} />
		</>
	);
}

// Email + password fields with the shared error/forgot-password rhythm, plus
// the primary CTA that always follows them. The field gap is 8px (gap={2}),
// not the outer 16px: without the group the two inputs sat twice as far
// apart as the fields below them.
export function AuthLoginFields({
	email,
	password,
	error,
	selfHash,
	isLoading,
	onEmailChange,
	onPasswordChange,
	onSubmit,
}: {
	email: string;
	password: string;
	error: string | null;
	selfHash: string;
	isLoading: boolean;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: () => void;
}) {
	return (
		<>
			<VStack gap={2}>
				<TextInput
					label="Email"
					isLabelHidden
					value={email}
					onChange={onEmailChange}
					placeholder={AUTH_EMAIL_PLACEHOLDER}
					type="email"
					{...inputAutoComplete("email")}
					size="lg"
					onEnter={onSubmit}
					status={error ? { type: "error", message: error } : undefined}
				/>
				<VStack gap={1}>
					<TextInput
						label="Password"
						isLabelHidden
						value={password}
						onChange={onPasswordChange}
						placeholder={AUTH_PASSWORD_PLACEHOLDER}
						type="password"
						{...inputAutoComplete("current-password")}
						size="lg"
						onEnter={onSubmit}
						status={error ? { type: "error", message: error } : undefined}
					/>
					{error && (
						<VStack hAlign="end">
							<Link href={selfHash} color="secondary" isStandalone>
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
				onClick={onSubmit}
			/>
		</>
	);
}

// The family terms line, rendered below the card in the page column.
export function AuthTerms({ selfHash }: { selfHash: string }) {
	return (
		<VStack hAlign="center" width="100%">
			<Text type="supporting" color="secondary" justify="center">
				{AUTH_TERMS_PREFIX}{" "}
				<Link href={selfHash} type="supporting" hasUnderline>
					{AUTH_TERMS_SERVICE}
				</Link>{" "}
				and{" "}
				<Link href={selfHash} type="supporting" hasUnderline>
					{AUTH_TERMS_PRIVACY}
				</Link>
				.
			</Text>
		</VStack>
	);
}
