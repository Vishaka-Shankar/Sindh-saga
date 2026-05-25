/**
 * RuliStrip.tsx — Colorful Ruli patchwork strip (truck-art inspired).
 * Location: components/culture/
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';

const RULI_COLORS = [
  SagaColors.brickRed,
  SagaColors.gold,
  SagaColors.ruliGreen,
  SagaColors.ruliOrange,
  SagaColors.ruliMagenta,
  SagaColors.ruliCyan,
  SagaColors.deepIndigo,
];

type RuliStripProps = {
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function RuliStrip({ height = 6, style }: RuliStripProps) {
  return (
    <View style={[styles.row, { height }, style]}>
      {RULI_COLORS.map((color) => (
        <View key={color} style={[styles.segment, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 2,
  },
  segment: {
    flex: 1,
  },
});
