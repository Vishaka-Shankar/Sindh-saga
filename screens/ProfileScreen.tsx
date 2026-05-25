/**
 * ProfileScreen.tsx — Profile with heritage stats.
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  CulturalHeader,
  DecorativeDivider,
  PatternContainer,
  RuliStrip,
  SindhiBadge,
} from '@/components/culture';
import { Card } from '@/components/Card';
import { Gradients, SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { MOCK_USER } from '@/data/mockStories';

export default function ProfileScreen() {
  return (
    <PatternContainer>
      <CulturalHeader title="Profile" subtitle="Your Sindh Saga journey" variant="dark" compact />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[...Gradients.hero]} style={styles.profileBanner}>
          <RuliStrip height={4} style={styles.ruliTop} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{MOCK_USER.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.email}>{MOCK_USER.email}</Text>
          <Text style={styles.decorative}>◆ وڌيڪ ڪهاڻيون رڪارڊ ڪريو ◆</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <Card style={styles.stat}>
            <Text style={styles.statValue}>{MOCK_USER.storiesRecorded}</Text>
            <Text style={styles.statLabel}>Stories recorded</Text>
          </Card>
          <Card style={[styles.stat, styles.statSpacer]}>
            <Text style={[styles.statValue, styles.statValueAlt]}>{MOCK_USER.heritagePoints}</Text>
            <Text style={styles.statLabel}>Heritage points</Text>
          </Card>
        </View>

        <DecorativeDivider label="About" />

        <Card accent>
          <SindhiBadge label="Demo build" variant="gold" style={styles.aboutBadge} />
          <Text style={styles.aboutTitle}>About Sindh Saga</Text>
          <Text style={styles.aboutBody}>
            A React Native Expo app celebrating Sindhi heritage through voice storytelling. This
            version showcases the cultural UI system; Firebase, Whisper, and GPT follow next.
          </Text>
        </Card>
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  profileBanner: {
    borderRadius: Spacing.cardRadius,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: SagaColors.gold,
  },
  ruliTop: { width: '100%', marginBottom: Spacing.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: SagaColors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: SagaColors.gold,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: SagaColors.brickRed,
  },
  name: {
    ...Typography.h2,
    color: SagaColors.ivory,
  },
  email: {
    ...Typography.caption,
    color: SagaColors.textMutedOnDark,
    marginTop: 4,
  },
  decorative: {
    fontSize: 13,
    color: 'rgba(250, 243, 224, 0.65)',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  statsRow: { flexDirection: 'row', marginBottom: Spacing.md },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.lg },
  statSpacer: { marginLeft: Spacing.md },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: SagaColors.brickRed,
  },
  statValueAlt: { color: SagaColors.deepIndigo },
  statLabel: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  aboutBadge: { marginBottom: Spacing.sm },
  aboutTitle: {
    ...Typography.h3,
    color: SagaColors.text,
    marginBottom: Spacing.sm,
  },
  aboutBody: {
    ...Typography.body,
    color: SagaColors.textMuted,
  },
});
