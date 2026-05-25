/**
 * HomeScreen.tsx — Cultural landing: hero, heritage sections, featured story, footer.
 */

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AjrakButton,
    CulturalCard,
    CulturalFooter,
    CulturalHero,
    HeritageRowCard,
    HeritageSection,
    PatternContainer
} from '@/components/culture';
import { CulturalGallery } from '@/components/culture/CulturalGallery';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useScroll } from '@/context';
import { MOCK_STORIES } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';

const HERITAGE_SECTIONS = [
  {
    title: 'Sindhi Culture Stories',
    description: 'Folktales, legends, and voices passed through generations along the Indus.',
    icon: 'auto-stories' as const,
    color: SagaColors.brickRed,
    route: ROUTES.stories,
    tint: 'brick' as const,
  },
  {
    title: 'Heritage & Traditions',
    description: 'Ajrak, crafts, festivals, and the living spirit of Sindhi identity.',
    icon: 'museum' as const,
    color: SagaColors.deepIndigo,
    route: ROUTES.record,
    tint: 'indigo' as const,
  },
  {
    title: 'Language & Poetry',
    description: 'Sindhi verse, oral poetry, and stories woven in our mother tongue.',
    icon: 'menu-book' as const,
    color: SagaColors.gold,
    route: ROUTES.storyDetail('2'),
    tint: 'gold' as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const featured = MOCK_STORIES[0];

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHero
          titleSindhi="سنڌي ورثو"
          title="Sindhu Ki Kahani"
          tagline="A premium cultural platform to record Sindhi stories and share child-friendly English tales."
          taglineSindhi="◆ سنڌ جي ڪهاڻيون · Sindhi Heritage ◆"
        />

      <View style={styles.actions}>
        <AjrakButton label="Record a story" fullWidth onPress={() => router.push(ROUTES.record)} />
        <AjrakButton
          label="Explore stories"
          variant="outline"
          fullWidth
          onPress={() => router.push(ROUTES.stories)}
          style={styles.actionGap}
        />
      </View>

      <CulturalGallery />

      <HeritageSection title="Discover heritage" subtitle="Tap a section to begin">
        {HERITAGE_SECTIONS.map((section) => (
          <HeritageRowCard
            key={section.title}
            title={section.title}
            description={section.description}
            icon={section.icon}
            accentColor={section.color}
            onPress={() => router.push(section.route)}
          />
        ))}
      </HeritageSection>

      <HeritageSection title="Sindhi Culture Stories" subtitle="Curated from mock collection">
        <View style={styles.cardGrid}>
          {HERITAGE_SECTIONS.map((section) => (
            <CulturalCard
              key={`card-${section.title}`}
              title={section.title}
              description={section.description}
              badge="Heritage"
              imageTint={section.tint}
              onPress={() => router.push(section.route)}
              style={styles.gridCard}
            />
          ))}
        </View>
      </HeritageSection>

      <HeritageSection title="Featured story" subtitle="From the Sindh Saga collection">
        <CulturalCard
          title={featured.title}
          description={featured.excerpt}
          badge="✦ Featured"
          imageTint="indigo"
          onPress={() => router.push(ROUTES.storyDetail(featured.id))}
        />
      </HeritageSection>

      <CulturalFooter />
    </ScrollView>
  </PatternContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
  },
  actions: {
    marginBottom: Spacing.xl,
  },
  actionGap: {
    marginTop: Spacing.md,
  },
  cardGrid: {
    gap: Spacing.md,
  },
  gridCard: {
    marginBottom: 0,
  },
});
