/**
 * shadows.ts — Elevation styles for cards and buttons.
 */

import { Platform, type ViewStyle } from 'react-native';

export const Shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  cardHover: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#9B1B30',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1E3A5F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
};
