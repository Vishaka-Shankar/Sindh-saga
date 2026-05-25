/**
 * HeritageSection.tsx — Section block with title, divider, and children.
 * Location: components/culture/
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { DecorativeDivider } from './DecorativeDivider';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type HeritageSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function HeritageSection({
  title,
  subtitle,
  children,
  showDivider = false,
  style,
}: HeritageSectionProps) {
  return (
    <View style={[styles.section, style]}>
      {showDivider ? <DecorativeDivider /> : null}
      <View style={styles.header}>
        <View style={styles.bar} />
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bar: {
    width: 4,
    height: 36,
    backgroundColor: SagaColors.brickRed,
    borderRadius: 2,
    marginRight: Spacing.md,
    marginTop: 4,
  },
  titles: { flex: 1 },
  title: {
    ...Typography.h2,
    fontSize: 20,
    color: SagaColors.deepIndigo,
  },
  subtitle: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: 4,
  },
});
