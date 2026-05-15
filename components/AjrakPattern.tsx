/**
 * AjrakPattern.tsx
 * Subtle geometric motif overlay inspired by traditional Ajrak block prints.
 * Used as a decorative background — low opacity so content stays readable.
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';

type AjrakPatternProps = {
  variant?: 'light' | 'warm';
  style?: StyleProp<ViewStyle>;
};

function Diamond({ size, color, style }: { size: number; color: string; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        },
        style,
      ]}
    />
  );
}

export function AjrakPattern({ variant = 'light', style }: AjrakPatternProps) {
  const tint = variant === 'warm' ? SagaColors.patternTintWarm : SagaColors.patternTint;
  const accent = variant === 'warm' ? SagaColors.crimson : SagaColors.indigo;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <View style={styles.row}>
        <Diamond size={14} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.15 }} />
        <Diamond size={14} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.12 }} />
        <Diamond size={14} color={tint} />
      </View>
      <View style={[styles.row, styles.rowOffset]}>
        <Diamond size={10} color={accent} style={{ opacity: 0.12 }} />
        <Diamond size={16} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.15 }} />
        <Diamond size={16} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.12 }} />
      </View>
      <View style={styles.row}>
        <Diamond size={14} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.15 }} />
        <Diamond size={14} color={tint} />
        <Diamond size={10} color={accent} style={{ opacity: 0.12 }} />
        <Diamond size={14} color={tint} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.9,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 28,
    marginVertical: 10,
  },
  rowOffset: {
    marginLeft: 20,
  },
});
