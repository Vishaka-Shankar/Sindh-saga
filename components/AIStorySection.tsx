import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AjrakButton, HeritageSection } from '@/components/culture';
import { useTheme } from '@/context';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { AI_STORIES, type AIStory } from '@/data/aiStories';
import { ROUTES } from '@/navigation/routes';

function StoryCard({ story, index }: { story: AIStory; index: number }) {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 340,
      delay: index * 90,
      useNativeDriver: true,
    }).start();
  }, [fade, index]);

  return (
    <Animated.View
      style={[styles.cardWrapper, { opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}
    >
      <Pressable 
        onPress={() => router.push(ROUTES.storyDetail(story.id))} 
        style={({ pressed }) => [
          styles.card, 
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.cardPress
        ]}
      >
        <Image source={story.imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.textArea}>
          <Text style={[styles.badge, { color: colors.brickRed }]}>AI Story</Text>
          <Text style={[styles.title, { color: colors.deepIndigo }]}>{story.title}</Text>
          <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={3}>{story.description}</Text>
          <View pointerEvents="none">
            <AjrakButton
              label="Play / Read"
              variant="outline"
              fullWidth
              style={styles.button}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function AIStorySection() {
  return (
    <HeritageSection
      title="AI Storytelling"
      subtitle="Listen or read Sindhi folk tales with a gentle storytelling experience"
    >
      <View style={styles.grid}>
        {AI_STORIES.map((story, index) => (
          <StoryCard key={story.id} story={story} index={index} />
        ))}
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
  },
  cardWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: SagaColors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SagaColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  cardPress: {
    opacity: 0.95,
    transform: [{ scale: 0.995 }],
  },
  image: {
    width: '100%',
    height: 160,
  },
  textArea: {
    padding: Spacing.md,
    backgroundColor: SagaColors.surface,
  },
  badge: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: SagaColors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  button: {
    marginTop: Spacing.xs,
  },
});
