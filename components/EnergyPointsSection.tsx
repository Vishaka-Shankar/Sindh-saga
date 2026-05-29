import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type RewardCardProps = {
  label: string;
  value: string;
  caption: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

function RewardCard({ label, value, caption, variant = 'secondary', style }: RewardCardProps) {
  const accentStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <View style={[styles.rewardCard, variant === 'primary' ? styles.primaryCard : styles.secondaryCard, style]}>
      <Text style={[styles.rewardLabel, accentStyle]}>{label}</Text>
      <Text style={[styles.rewardValue, accentStyle]}>{value}</Text>
      <Text style={[styles.rewardCaption, accentStyle]}>{caption}</Text>
    </View>
  );
}

export default function EnergyPointsSection() {
  return (
    <HeritageSection
      title="Energy Points"
      subtitle="Earn rewards for sharing stories and exploring Sindhi heritage"
      showDivider
      style={styles.section}
    >
      <View style={styles.cardRow}>
        <RewardCard
          label="You earned"
          value="50"
          caption="Energy Points"
          variant="primary"
          style={styles.cardSpacing}
        />
        <RewardCard
          label="Badge unlocked"
          value="Heritage Hero"
          caption="Keep collecting more badges"
          variant="secondary"
          style={styles.cardSpacing}
        />
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -Spacing.sm,
  },
  cardSpacing: {
    flexGrow: 1,
    flexBasis: '48%',
    minWidth: 160,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  rewardCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: SagaColors.border,
    backgroundColor: SagaColors.surface,
    padding: Spacing.lg,
    ...Shadows.card,
    minHeight: 150,
  },
  primaryCard: {
    backgroundColor: SagaColors.primary,
    borderColor: SagaColors.brickDark,
  },
  secondaryCard: {
    backgroundColor: SagaColors.ivoryWarm,
    borderColor: SagaColors.gold,
  },
  rewardLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  rewardValue: {
    ...Typography.h2,
    fontSize: 34,
    marginBottom: Spacing.sm,
    lineHeight: 44,
  },
  rewardCaption: {
    ...Typography.body,
    lineHeight: 24,
  },
  primaryText: {
    color: SagaColors.ivory,
  },
  secondaryText: {
    color: SagaColors.deepIndigo,
  },
});
