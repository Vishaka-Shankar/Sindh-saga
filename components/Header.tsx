/**
 * Header.tsx
 * Screen header with optional dark variant for stack screens.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type HeaderProps = {
  title: string;
  subtitle?: string;
  dark?: boolean;
  compact?: boolean;
};

export function Header({ title, subtitle, dark, compact }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        dark && styles.wrapDark,
        { paddingTop: insets.top + (compact ? 4 : 10) },
      ]}>
      {dark ? <View style={styles.accentLine} /> : null}
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, dark && styles.subtitleDark]}>{subtitle}</Text>
      ) : null}
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
    backgroundColor: SagaColors.indigo,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: Spacing.lg,
  },
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: SagaColors.crimson,
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: SagaColors.text,
  },
  titleDark: {
    color: SagaColors.textOnDark,
  },
  subtitle: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginTop: 6,
  },
  subtitleDark: {
    color: SagaColors.textMutedOnDark,
  },
});
