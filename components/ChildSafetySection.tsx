import { StyleSheet, Text, View } from 'react-native';

import { HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const SAFETY_POINTS = [
  {
    title: 'Parent consent notice',
    description:
      'Parents or guardians should review and approve story sharing for children under 13. We keep sign-up and submissions transparent and easy to understand.',
  },
  {
    title: 'Child-safe platform',
    description:
      'Sindh Saga is designed to remain family-friendly, with stories and content curated for young audiences in a safe, respectful space.',
  },
  {
    title: 'Privacy policy summary',
    description:
      'We only collect what is needed for the app experience. Personal data is never shared for advertising, and children’s information is protected.',
  },
];

export default function ChildSafetySection() {
  return (
    <HeritageSection
      title="Child Safety & Privacy"
      subtitle="A simple notice for parents and guardians"
      showDivider
    >
      <View style={styles.grid}>
        {SAFETY_POINTS.map((item) => (
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
    borderColor: SagaColors.border,
    backgroundColor: SagaColors.ivoryWarm,
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
