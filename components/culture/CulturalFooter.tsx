/**
 * CulturalFooter.tsx — Premium indigo footer with links and Ajrak strip.
 * Location: components/culture/
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AjrakBorderStrip } from './svg/AjrakBorderStrip';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { ROUTES } from '@/navigation/routes';
import { isPressableHovered, useHoverable } from '@/hooks/useHoverable';

const QUICK_LINKS = [
  { label: 'Home', route: ROUTES.home },
  { label: 'Record', route: ROUTES.record },
  { label: 'Stories', route: ROUTES.stories },
  { label: 'Profile', route: ROUTES.profile },
];

const CATEGORIES = [
  'Sindhi Folklore',
  'Heritage & Crafts',
  'Language & Poetry',
  'Children’s Tales',
];

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { hoverEnabled } = useHoverable();
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.link,
        isPressableHovered(state, hoverEnabled) && styles.linkHover,
      ]}>
      <Text style={styles.linkText}>{label}</Text>
    </Pressable>
  );
}

export function CulturalFooter() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <Text style={styles.brand}>Sindh Saga</Text>
      <View style={styles.goldLine} />
      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Explore</Text>
          {QUICK_LINKS.map((link) => (
            <FooterLink
              key={link.label}
              label={link.label}
              onPress={() => router.push(link.route)}
            />
          ))}
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Cultural categories</Text>
          {CATEGORIES.map((cat) => (
            <Text key={cat} style={styles.catItem}>
              ◆ {cat}
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.copy}>
        Preserving Sindhi heritage through voice & storytelling · University demo
      </Text>
      <AjrakBorderStrip height={14} style={styles.bottomStrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    ...Typography.h2,
    fontSize: 22,
    color: SagaColors.ivory,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  goldLine: {
    height: 2,
    backgroundColor: SagaColors.gold,
    width: 60,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.xxl,
    backgroundColor: SagaColors.deepIndigo,
    marginHorizontal: -Spacing.screenPadding,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  col: {
    flex: 1,
    minWidth: 140,
  },
  colTitle: {
    ...Typography.overline,
    color: SagaColors.gold,
    marginBottom: Spacing.sm,
  },
  link: {
    paddingVertical: 6,
  },
  linkHover: {
    opacity: 0.85,
    transform: [{ translateX: 4 }],
  },
  linkText: {
    ...Typography.body,
    color: SagaColors.ivory,
    fontSize: 15,
  },
  catItem: {
    ...Typography.caption,
    color: SagaColors.textMutedOnDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  copy: {
    ...Typography.caption,
    color: SagaColors.textMutedOnDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  bottomStrip: {
    marginHorizontal: -Spacing.screenPadding,
    width: '120%',
    alignSelf: 'center',
  },
});
