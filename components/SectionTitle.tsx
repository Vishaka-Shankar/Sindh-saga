/**
 * SectionTitle.tsx
 * Section heading with optional decorative Ajrak dash.
 */

import { StyleSheet, Text, View } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.dash} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dash: {
    width: 4,
    height: 22,
    backgroundColor: SagaColors.crimson,
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    ...Typography.h2,
    color: SagaColors.text,
    fontSize: 20,
  },
  subtitle: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: 4,
    marginLeft: 14,
  },
});
