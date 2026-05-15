/**
 * ScreenBackground.tsx
 * Cream canvas with optional subtle Ajrak pattern for cultural consistency.
 */

import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AjrakPattern } from './AjrakPattern';
import { SagaColors } from '@/constants/colors';

type ScreenBackgroundProps = {
  children: ReactNode;
  pattern?: boolean;
  patternVariant?: 'light' | 'warm';
  style?: StyleProp<ViewStyle>;
};

export function ScreenBackground({
  children,
  pattern = true,
  patternVariant = 'light',
  style,
}: ScreenBackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      {pattern ? (
        <View style={styles.patternWrap}>
          <AjrakPattern variant={patternVariant} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SagaColors.background,
  },
  patternWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.35,
  },
});
