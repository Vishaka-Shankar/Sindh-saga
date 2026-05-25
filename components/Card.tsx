/**
 * Card.tsx — Simple card; use CulturalCard for rich interactive blocks.
 */

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';

type CardProps = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: boolean;
};

export function Card({ children, style, onPress, accent, ...rest }: CardProps) {
  const cardStyle = [styles.card, accent && styles.accent, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        {...rest}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SagaColors.surface,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: SagaColors.border,
    ...Shadows.card,
  },
  accent: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.brickRed,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
});
