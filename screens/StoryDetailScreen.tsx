/**
 * StoryDetailScreen.tsx
 * Full story view — Sindhi transcript + English child-friendly tale.
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { getMockStoryById } from '@/data/mockStories';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const story = getMockStoryById(id ?? '');

  if (!story) {
    return (
      <ScreenBackground>
        <Header title="Story not found" dark compact />
        <View style={styles.center}>
          <Button label="Back to stories" onPress={() => router.back()} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <Header title={story.title} subtitle={`${story.recordedAt} · ${story.duration}`} dark compact />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.block}>
          <Text style={styles.label}>Original transcript</Text>
          <Text style={styles.labelSindhi}>سنڌي ٽرانسڪرپٽ</Text>
          <Text style={styles.body}>{story.transcript}</Text>
        </Card>

        <Card style={[styles.block, styles.englishCard]}>
          <Text style={styles.label}>Child-friendly story</Text>
          <Text style={styles.labelSub}>English · GPT-enhanced (demo)</Text>
          <Text style={styles.body}>{story.storyText}</Text>
        </Card>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ SindhSaga · Heritage preserved</Text>
        </View>

        <Button label="Back" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  block: { marginBottom: Spacing.md },
  englishCard: {
    borderLeftColor: SagaColors.indigo,
    borderLeftWidth: 4,
  },
  label: {
    ...Typography.overline,
    color: SagaColors.crimson,
    marginBottom: 4,
  },
  labelSindhi: {
    fontSize: 14,
    color: SagaColors.indigo,
    marginBottom: Spacing.md,
    opacity: 0.85,
  },
  labelSub: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginBottom: Spacing.md,
  },
  body: {
    ...Typography.body,
    color: SagaColors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: SagaColors.creamDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  badgeText: {
    ...Typography.caption,
    color: SagaColors.indigo,
    fontWeight: '600',
  },
  center: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding },
});
