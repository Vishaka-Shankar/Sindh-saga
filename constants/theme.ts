/**
 * theme.ts — Central design tokens for Sindh Saga UI.
 */

import { SagaColors } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';

/** Expo template navigation / themed components */
export const Colors = {
  light: {
    text: SagaColors.text,
    background: SagaColors.background,
    tint: SagaColors.primary,
    icon: SagaColors.textMuted,
    tabIconDefault: SagaColors.textMuted,
    tabIconSelected: SagaColors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

export const Theme = {
  colors: SagaColors,
  spacing: Spacing,
  typography: Typography,
  radius: {
    sm: 8,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  border: {
    width: 1,
    widthAccent: 2,
    widthAjrak: 3,
  },
} as const;
