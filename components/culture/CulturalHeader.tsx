/**
 * CulturalHeader.tsx — Screen header with optional Ajrak band (navbar-style).
 * Location: components/culture/
 */

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AjrakBorderStrip } from './svg/AjrakBorderStrip';
import { RuliStrip } from './RuliStrip';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type CulturalHeaderProps = {
  title: string;
  subtitle?: string;
  variant?: 'light' | 'dark';
  showPattern?: boolean;
  compact?: boolean;
};

export function CulturalHeader({
  title,
  subtitle,
  variant = 'light',
  showPattern = true,
  compact,
}: CulturalHeaderProps) {
  const insets = useSafeAreaInsets();
  const isDark = variant === 'dark';

  return (
    <View
      style={[
        styles.wrap,
        isDark && styles.wrapDark,
        { paddingTop: insets.top + (compact ? 6 : 12) },
      ]}>
      {isDark && showPattern ? (
        <>
          <AjrakBorderStrip height={8} />
          <RuliStrip height={4} style={styles.ruli} />
        </>
      ) : null}
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>
      ) : null}
      {!isDark && showPattern ? <View style={styles.lightAccent} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    backgroundColor: 'transparent',
  },
  wrapDark: {
    backgroundColor: SagaColors.deepIndigo,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingBottom: Spacing.lg,
  },
  ruli: { marginBottom: Spacing.sm },
  title: {
    ...Typography.h1,
    color: SagaColors.text,
  },
  titleDark: {
    color: SagaColors.ivory,
  },
  subtitle: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginTop: 6,
  },
  subtitleDark: {
    color: SagaColors.textMutedOnDark,
  },
  lightAccent: {
    marginTop: Spacing.sm,
    height: 3,
    width: 48,
    backgroundColor: SagaColors.brickRed,
    borderRadius: 2,
  },
});
