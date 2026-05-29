import { StyleSheet, Text, View } from 'react-native';

import { HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const STEPS = [
  { title: 'Story Collection', subtitle: 'Gather tales from Sindhi villages and family memories.' },
  { title: 'AI Enhancement', subtitle: 'Refine narrative flow and voice for a polished story.' },
  { title: 'Animation', subtitle: 'Bring characters and culture to life with motion.' },
  { title: 'Marketplace', subtitle: 'Share stories in a trusted digital storefront.' },
  { title: 'Rewards', subtitle: 'Earn points and recognition for every contribution.' },
];

export default function WorkflowTimelineSection() {
  return (
    <HeritageSection
      title="Story Workflow"
      subtitle="A modern path from story idea to rewards"
      showDivider
    >
      <View style={styles.timeline}>
        {STEPS.map((step, index) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={[styles.stepMarker, index === STEPS.length - 1 && styles.stepMarkerLast]}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: Spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderRadius: 24,
    backgroundColor: SagaColors.surface,
    borderWidth: 1,
    borderColor: SagaColors.border,
    ...Shadows.card,
    minHeight: 98,
  },
  stepMarker: {
    width: 46,
    height: 46,
    borderRadius: 46,
    backgroundColor: SagaColors.brickRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 4,
  },
  stepMarkerLast: {
    backgroundColor: SagaColors.gold,
  },
  stepNumber: {
    ...Typography.caption,
    color: SagaColors.ivory,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.h3,
    fontSize: 17,
    color: SagaColors.deepIndigo,
    marginBottom: 8,
  },
  stepSubtitle: {
    ...Typography.body,
    color: SagaColors.textMuted,
    lineHeight: 24,
  },
});
