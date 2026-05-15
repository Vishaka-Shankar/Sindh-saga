/**
 * ProfileScreen.tsx
 * Demo profile with heritage stats and project info.
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ScreenBackground } from '@/components/ScreenBackground';
import { Gradients, SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { MOCK_USER } from '@/data/mockStories';

export default function ProfileScreen() {
  return (
    <ScreenBackground>
      <Header title="Profile" subtitle="Your SindhSaga journey" dark compact />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[...Gradients.heroSoft]} style={styles.profileBanner}>
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

        <Card accent>
          <Text style={styles.aboutTitle}>About SindhSaga</Text>
          <Text style={styles.aboutBody}>
            A React Native Expo app celebrating Sindhi heritage through voice storytelling. This
            demo showcases UI and navigation; Firebase, Whisper, and GPT integration follow in the
            next development phase.
          </Text>
        </Card>
      </ScrollView>
    </ScreenBackground>
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
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: SagaColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: SagaColors.gold,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: SagaColors.crimson,
  },
  name: {
    ...Typography.h2,
    color: SagaColors.textOnDark,
  },
  email: {
    ...Typography.caption,
    color: SagaColors.textMutedOnDark,
    marginTop: 4,
  },
  decorative: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  statsRow: { flexDirection: 'row', marginBottom: Spacing.md },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.lg },
  statSpacer: { marginLeft: Spacing.md },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: SagaColors.crimson,
  },
  statValueAlt: {
    color: SagaColors.indigo,
  },
  statLabel: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
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
