import { StyleSheet, Text, View } from 'react-native';

import { HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const MODERATION_POINTS = [
  {
    title: 'AI Moderation Guardrails',
    description:
      'Every story passes through our AI safety filters to ensure age-appropriate content, cultural respect, and family-friendly standards before publishing.',
  },
  {
    title: 'Parent Approval Workflow',
    description:
      'Parents can review and approve stories their children share. Stories are held for moderation and require consent before going live.',
  },
  {
    title: 'Content Safety Features',
    description:
      'Automated screening catches unsafe language, inappropriate references, and non-cultural content. Manual review by moderators adds an extra layer of care.',
  },
  {
    title: 'Privacy & Data Protection',
    description:
      'We encrypt all recordings and submissions. Personal data is never sold, shared for advertising, or used outside the app experience.',
  },
];

export default function ParentModerationSection() {
  return (
    <HeritageSection
      title="Parent Safety & Moderation"
      subtitle="How SindhSaga protects families while preserving heritage"
      showDivider
    >
      <View style={styles.grid}>
        {MODERATION_POINTS.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
          </View>
        ))}
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.md,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: SagaColors.borderAccent,
    backgroundColor: 'rgba(192, 57, 43, 0.05)',
    padding: Spacing.lg,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.xs,
  },
  cardText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    lineHeight: 24,
  },
});
