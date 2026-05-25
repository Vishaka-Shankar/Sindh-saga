/**
 * AjrakButton.tsx — Primary / secondary / outline / ghost buttons.
 * Location: components/culture/
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { isPressableHovered, useHoverable } from '@/hooks/useHoverable';

export type AjrakButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type AjrakButtonProps = PressableProps & {
  label: string;
  variant?: AjrakButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AjrakButton({
  label,
  variant = 'primary',
  loading = false,
  fullWidth,
  disabled,
  style,
  ...rest
}: AjrakButtonProps) {
  const { hoverEnabled } = useHoverable();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => {
        const { pressed } = state;
        const hovered = isPressableHovered(state, hoverEnabled);
        const active = pressed || hovered;
        return [
          styles.base,
          fullWidth && styles.fullWidth,
          styles[variant],
          variant !== 'outline' && variant !== 'ghost' && Shadows.soft,
          active && !isDisabled && styles.active,
          hovered && !pressed && !isDisabled && styles.hover,
          isDisabled && styles.disabled,
          style,
        ];
      }}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? SagaColors.brickRed : SagaColors.ivory} />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: Spacing.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fullWidth: { width: '100%' },
  primary: { backgroundColor: SagaColors.brickRed, borderColor: SagaColors.brickDark },
  secondary: { backgroundColor: SagaColors.deepIndigo, borderColor: SagaColors.indigoDark },
  outline: {
    backgroundColor: SagaColors.surface,
    borderColor: SagaColors.brickRed,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  active: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  hover: {
    transform: [{ translateY: -2 }],
    borderColor: SagaColors.gold,
  },
  disabled: { opacity: 0.45 },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.4 },
  label_primary: { color: SagaColors.ivory },
  label_secondary: { color: SagaColors.ivory },
  label_outline: { color: SagaColors.brickRed },
  label_ghost: { color: SagaColors.deepIndigo },
});
