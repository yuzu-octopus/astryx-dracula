// Auth page chrome, split from the component that renders it, for the same
// reason as shared/scene-hues.ts: a .tsx exporting non-components breaks React
// Fast Refresh. Five templates import these, so they are genuinely shared --
// they were only ever co-located by accident of history.
import type {CSSProperties} from 'react';

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
