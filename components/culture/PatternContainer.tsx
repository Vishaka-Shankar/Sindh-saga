/**
 * PatternContainer.tsx — Screen wrapper with subtle Ajrak tile background.
 * Location: components/culture/
 */

import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/context';
import { AjrakTilePattern } from './svg/AjrakTilePattern';
import { SagaColors } from '@/constants/colors';

type PatternContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  patternOpacity?: number;
};

export function PatternContainer({
  children,
  style,
  patternOpacity = 0.12,
}: PatternContainerProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      <View style={styles.patternLayer} pointerEvents="none">
        <AjrakTilePattern opacity={patternOpacity} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SagaColors.background,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  content: {
    flex: 1,
  },
});
