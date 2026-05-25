/**
 * DecorativeDivider.tsx — Section divider with Ajrak border + optional label.
 * Location: components/culture/
 */

import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { AjrakBorderStrip } from './svg/AjrakBorderStrip';
import { SagaColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type DecorativeDividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function DecorativeDivider({ label, style }: DecorativeDividerProps) {
  return (
    <View style={[styles.wrap, style]}>
      <AjrakBorderStrip height={10} />
      {label ? (
        <View style={styles.labelRow}>
          <View style={styles.dash} />
          <Text style={styles.label}>{label}</Text>
          <View style={styles.dash} />
        </View>
      ) : null}
      <AjrakBorderStrip height={10} style={styles.flip} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 20 },
  flip: { transform: [{ scaleY: -1 }] },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  dash: {
    flex: 1,
    height: 1,
    backgroundColor: SagaColors.border,
    maxWidth: 60,
  },
  label: {
    ...Typography.overline,
    color: SagaColors.deepIndigo,
    fontSize: 11,
  },
});
