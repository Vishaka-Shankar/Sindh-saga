import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { CulturalCard, HeritageSection, SindhiBadge } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { MOCK_STORIES } from '@/data/mockStories';

type PreviewCard = {
  title: string;
  description: string;
  accent: 'indigo' | 'brick' | 'gold';
};

const MARKETPLACE_PREVIEW: PreviewCard[] = MOCK_STORIES.slice(0, 3).map((story, index) => ({
  title: story.title,
  description: story.excerpt,
  accent: index === 0 ? 'brick' : index === 1 ? 'indigo' : 'gold',
}));

export default function SafeMarketplaceSection() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(280, Math.max(240, Math.round(width * 0.66)));

  return (
    <HeritageSection
      title="Safe Marketplace Preview"
      subtitle="Child-friendly Sindhi stories and culture cards made for parents and learners"
      showDivider
    >
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.cardRow, { paddingHorizontal: 14 }]}
        >
          {MARKETPLACE_PREVIEW.map((item, index) => (
            <CulturalCard
              key={item.title}
              title={item.title}
              description={item.description}
              badge="Marketplace"
              imageTint={item.accent}
              style={[styles.card, index === 0 && styles.firstCard, { width: cardWidth }]}
            >
              <View style={styles.badgeRow}>
                <SindhiBadge label="Parent Approved" variant="gold" style={styles.badge} />
                <SindhiBadge label="Safe Content" variant="indigo" style={styles.badge} />
              </View>
            </CulturalCard>
          ))}
        </ScrollView>

        <Text style={styles.note}>
          A preview of safe, educational stories from SindhSaga. These cards are designed for a calm family-friendly marketplace style.
        </Text>
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  cardRow: {
    paddingVertical: Spacing.sm,
  },
  card: {
    marginRight: Spacing.md,
  },
  firstCard: {
    marginLeft: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  badge: {
    marginRight: Spacing.sm,
    marginTop: 4,
  },
  note: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    lineHeight: 20,
  },
});
