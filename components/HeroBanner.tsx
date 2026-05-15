/**
 * HeroBanner.tsx
 * Ajrak-gradient hero block for the home landing screen.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AjrakPattern } from './AjrakPattern';
import { Gradients, SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type HeroBannerProps = {
  title: string;
  titleSindhi?: string;
  tagline: string;
  taglineSindhi?: string;
};

export function HeroBanner({ title, titleSindhi, tagline, taglineSindhi }: HeroBannerProps) {
  return (
    <LinearGradient
      colors={[...Gradients.hero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <View style={styles.patternOverlay}>
        <AjrakPattern variant="warm" />
      </View>

      <View style={styles.borderTop} />
      <View style={styles.borderBottom} />

      <Text style={styles.overline}>SindhSaga · Cultural storytelling</Text>
      {titleSindhi ? <Text style={styles.titleSindhi}>{titleSindhi}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.tagline}>{tagline}</Text>
      {taglineSindhi ? <Text style={styles.taglineSindhi}>{taglineSindhi}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: Spacing.cardRadius,
    padding: Spacing.lg,
    overflow: 'hidden',
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: SagaColors.white,
    opacity: 0.25,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: SagaColors.black,
    opacity: 0.2,
  },
  overline: {
    ...Typography.overline,
    color: SagaColors.gold,
    marginBottom: Spacing.sm,
  },
  titleSindhi: {
    ...Typography.decorative,
    color: SagaColors.textMutedOnDark,
    marginBottom: 4,
    opacity: 0.95,
  },
  title: {
    ...Typography.hero,
    color: SagaColors.textOnDark,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.subtitle,
    color: SagaColors.textMutedOnDark,
    maxWidth: '95%',
  },
  taglineSindhi: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
