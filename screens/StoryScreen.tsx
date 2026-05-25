/**
 * StoryScreen.tsx — Story library with cultural cards.
 */

import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CulturalCard,
  CulturalHeader,
  PatternContainer,
  SindhiBadge,
} from '@/components/culture';
import { Spacing } from '@/constants/spacing';
import { useScroll } from '@/context';
import { MOCK_STORIES, type MockStory } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';

export default function StoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();

  const renderItem = ({ item, index }: { item: MockStory; index: number }) => (
    <CulturalCard
      title={item.title}
      description={item.excerpt}
      badge={`Story ${index + 1}`}
      imageTint={index % 2 === 0 ? 'indigo' : 'brick'}
      onPress={() => router.push(ROUTES.storyDetail(item.id))}
      style={styles.card}
    />
  );

  return (
    <PatternContainer>
      <FlatList
        data={MOCK_STORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        ListHeaderComponent={
          <>
            <CulturalHeader
              title="Stories"
              subtitle="Sindhi folklore · AI-enhanced for children"
              variant="dark"
              compact
            />
            <SindhiBadge
              label={`${MOCK_STORIES.length} tales in your collection`}
              variant="cream"
              style={styles.badge}
            />
          </>
        }
      />
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  badge: {
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  card: { marginBottom: Spacing.md },
});
