import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import {
  AjrakButton,
  CulturalHeader,
  DecorativeDivider,
  PatternContainer,
  SindhiBadge,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { getMockStoryById } from '@/data/mockStories';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const story = getMockStoryById(id ?? '');

  if (!story) {
    return (
      <PatternContainer>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          <CulturalHeader title="Story not found" variant="dark" compact />
          <View style={styles.center}>
            <AjrakButton label="Back to stories" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </PatternContainer>
    );
  }

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title={story.title}
          subtitle={`${story.recordedAt} · ${story.duration}`}
          variant="dark"
          compact
        />
        <DecorativeDivider label="Story" />

        <Card style={styles.block}>
          <SindhiBadge label="سنڌي ٽرانسڪرپٽ" variant="indigo" />
          <Text style={styles.label}>Original transcript</Text>
          <Text style={styles.body}>{story.transcript}</Text>
        </Card>

        <Card style={[styles.block, styles.englishCard]}>
          <SindhiBadge label="English tale" variant="gold" />
          <Text style={styles.label}>Child-friendly story</Text>
          <Text style={styles.body}>{story.storyText}</Text>
        </Card>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ Sindh Saga · Heritage preserved</Text>
        </View>

        <AjrakButton label="Back" variant="outline" fullWidth onPress={() => router.back()} />
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  block: { marginBottom: Spacing.md },
  englishCard: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.deepIndigo,
  },
  label: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 26,
    color: SagaColors.text,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: SagaColors.ivoryWarm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  badgeText: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    fontWeight: '600',
  },
  center: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding },
});
