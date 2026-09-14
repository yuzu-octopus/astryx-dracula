// Shared login chrome: page wash + 400px column + Moon brand row + the
// autocomplete widen-record TextInput needs (prop type omits input attrs).
import type {CSSProperties} from 'react';
import {Moon} from 'lucide-react';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {AUTH_BRAND_NAME} from 'astryx-dracula/shared/auth-copy';

// Standalone auth pages paint their own body background (no host shell).
export const authPageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-6)',
};
// Cap the column at 400px but let it shrink to fit narrow screens.
export const authContentStyle: CSSProperties = {width: '100%', maxWidth: 400};
// WCAG 1.3.5 autocomplete: TextInput forwards unknown props to <input> but its
// prop type omits input-only attributes, so spread through a widened record.
export const inputAutoComplete = (value: string) =>
  ({autoComplete: value}) as Record<string, string>;

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
