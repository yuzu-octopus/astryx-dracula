// Shared login chrome: page wash + 400px column + Moon brand row + the
// autocomplete widen-record TextInput needs (prop type omits input attrs).
import type {CSSProperties} from 'react';
import {Moon} from 'lucide-react';
import {VStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {AUTH_BRAND_NAME} from 'astryx-dracula/shared/auth-copy';
import {
  authContentStyle,
  authPageStyle,
  inputAutoComplete,
} from 'astryx-dracula/shared/auth-chrome-config';


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
