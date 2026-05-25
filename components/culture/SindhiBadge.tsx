/**
 * SindhiBadge.tsx — Small cultural label chip (featured, heritage, etc.).
 * Location: components/culture/
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type BadgeVariant = 'indigo' | 'brick' | 'gold' | 'cream';

type SindhiBadgeProps = {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

const VARIANT_BG: Record<BadgeVariant, string> = {
  indigo: `${SagaColors.deepIndigo}18`,
  brick: `${SagaColors.brickRed}18`,
  gold: `${SagaColors.gold}28`,
  cream: SagaColors.ivoryDark,
};

const VARIANT_TEXT: Record<BadgeVariant, string> = {
  indigo: SagaColors.deepIndigo,
  brick: SagaColors.brickRed,
  gold: SagaColors.brickDark,
  cream: SagaColors.textMuted,
};

export function SindhiBadge({ label, variant = 'indigo', style }: SindhiBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: VARIANT_BG[variant] }, style]}>
      <Text style={[styles.text, { color: VARIANT_TEXT[variant] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  text: {
    ...Typography.overline,
    fontSize: 10,
  },
});
