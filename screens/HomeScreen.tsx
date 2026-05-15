/**
 * HomeScreen.tsx
 * Cultural landing page — hero banner, heritage sections, featured story.
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeroBanner } from '@/components/HeroBanner';
import { HeritageCard } from '@/components/HeritageCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SectionTitle } from '@/components/SectionTitle';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { MOCK_STORIES } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';

const HERITAGE_SECTIONS = [
  {
    title: 'Sindhi Culture Stories',
    description: 'Folktales, legends, and voices passed through generations along the Indus.',
    icon: 'auto-stories' as const,
    color: SagaColors.crimson,
    route: ROUTES.stories,
  },
  {
    title: 'Heritage & Traditions',
    description: 'Ajrak, crafts, festivals, and the living spirit of Sindhi identity.',
    icon: 'museum' as const,
    color: SagaColors.indigo,
    route: ROUTES.record,
  },
  {
    title: 'Language & Poetry',
    description: 'Sindhi verse, oral poetry, and stories woven in our mother tongue.',
    icon: 'menu-book' as const,
    color: SagaColors.crimsonDark,
    route: ROUTES.storyDetail('2'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const featured = MOCK_STORIES[0];

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>SindhSaga</Text>

        <HeroBanner
          titleSindhi="سنڌي ورثو"
          title="Sindhu Ki Kahani"
          tagline="A modern platform to record Sindhi stories and share them as child-friendly English tales."
          taglineSindhi="◆ سنڌ جي ڪهاڻيون ◆"
        />

        <View style={styles.actions}>
          <Button label="Record a story" onPress={() => router.push(ROUTES.record)} />
          <Button
            label="Explore stories"
            variant="outline"
            onPress={() => router.push(ROUTES.stories)}
            style={styles.actionGap}
          />
        </View>

        <SectionTitle
          title="Discover heritage"
          subtitle="Tap a section to begin your journey"
        />

        {HERITAGE_SECTIONS.map((section) => (
          <HeritageCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            accentColor={section.color}
            onPress={() => router.push(section.route)}
            style={styles.heritageCard}
          />
        ))}

        <SectionTitle title="Featured story" subtitle="From the SindhSaga collection" />

        <Card accent onPress={() => router.push(ROUTES.storyDetail(featured.id))}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>✦ Featured</Text>
          </View>
          <Text style={styles.storyTitle}>{featured.title}</Text>
          <Text style={styles.storyExcerpt}>{featured.excerpt}</Text>
          <Text style={styles.storyMeta}>
            {featured.recordedAt} · {featured.duration}
          </Text>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Preserving Sindhi heritage through storytelling · Demo build
          </Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  brand: {
    ...Typography.overline,
    color: SagaColors.crimson,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  actions: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionGap: {
    marginTop: Spacing.md,
  },
  heritageCard: {
    marginBottom: Spacing.md,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${SagaColors.indigo}14`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  featuredBadgeText: {
    ...Typography.overline,
    fontSize: 10,
    color: SagaColors.indigo,
  },
  storyTitle: {
    ...Typography.h3,
    color: SagaColors.text,
    marginBottom: 6,
  },
  storyExcerpt: {
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  storyMeta: {
    ...Typography.caption,
    color: SagaColors.crimson,
    marginTop: Spacing.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: SagaColors.border,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
});
