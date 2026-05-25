/**
 * CulturalHero.tsx — Full-width hero with Ajrak SVG, overlay, logo, Ruli strip.
 * Location: components/culture/
 */

import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AjrakTilePattern } from './svg/AjrakTilePattern';
import { RuliStrip } from './RuliStrip';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type CulturalHeroProps = {
  logoText?: string;
  title: string;
  titleSindhi?: string;
  tagline: string;
  taglineSindhi?: string;
};

export function CulturalHero({
  logoText = 'Sindh Saga',
  title,
  titleSindhi,
  tagline,
  taglineSindhi,
}: CulturalHeroProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.patternBg}>
        <AjrakTilePattern width="100%" height="100%" opacity={0.5} />
      </View>
      <LinearGradient
        colors={['rgba(27,42,107,0.88)', 'rgba(27,42,107,0.65)', 'rgba(192,57,43,0.45)']}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <View style={styles.logoRing}>
          <Text style={styles.logo}>{logoText}</Text>
        </View>
        {titleSindhi ? <Text style={styles.sindhiDecor}>{titleSindhi}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        <RuliStrip height={5} style={styles.ruli} />
        <Text style={styles.tagline}>{tagline}</Text>
        {taglineSindhi ? <Text style={styles.taglineSindhi}>{taglineSindhi}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
    minHeight: 280,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: SagaColors.gold,
  },
  patternBg: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: Spacing.lg,
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRing: {
    borderWidth: 2,
    borderColor: SagaColors.gold,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  logo: {
    ...Typography.overline,
    color: SagaColors.gold,
    fontSize: 12,
    letterSpacing: 2,
  },
  sindhiDecor: {
    fontSize: 22,
    color: SagaColors.ivory,
    marginBottom: 6,
    opacity: 0.95,
  },
  title: {
    ...Typography.hero,
    color: SagaColors.ivory,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  ruli: {
    width: '80%',
    maxWidth: 280,
    marginBottom: Spacing.md,
  },
  tagline: {
    ...Typography.subtitle,
    color: SagaColors.textMutedOnDark,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
  },
  taglineSindhi: {
    fontSize: 14,
    color: 'rgba(250,243,224,0.65)',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
