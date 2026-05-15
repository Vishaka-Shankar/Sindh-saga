/**
 * StoryScreen.tsx
 * Mock story library with rich cultural card styling.
 */

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { MOCK_STORIES, type MockStory } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';

export default function StoryScreen() {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: MockStory; index: number }) => (
    <Card
      accent
      style={styles.card}
      onPress={() => router.push(ROUTES.storyDetail(item.id))}>
      <View style={styles.cardHeader}>
        <View style={[styles.indexBadge, { backgroundColor: index % 2 === 0 ? SagaColors.crimson : SagaColors.indigo }]}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Text style={styles.meta}>
          {item.recordedAt} · {item.duration}
        </Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.excerpt} numberOfLines={2}>
        {item.excerpt}
      </Text>
      <Text style={styles.readMore}>Read story →</Text>
    </Card>
  );

  return (
    <ScreenBackground>
      <Header title="Stories" subtitle="Sindhi folklore · AI-enhanced for children" dark compact />
      <FlatList
        data={MOCK_STORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listIntro}>
            {MOCK_STORIES.length} stories in your heritage collection
          </Text>
        }
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  listIntro: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  card: { marginBottom: Spacing.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: SagaColors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  meta: {
    ...Typography.caption,
    color: SagaColors.textMuted,
  },
  title: {
    ...Typography.h3,
    color: SagaColors.text,
    marginBottom: 6,
  },
  excerpt: {
    ...Typography.body,
    color: SagaColors.textMuted,
    fontSize: 14,
  },
  readMore: {
    ...Typography.caption,
    color: SagaColors.crimson,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
});
