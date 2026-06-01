/**
 * StoryScreen.tsx — Story library with cultural cards and AI Storyteller.
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AjrakButton,
    CulturalCard,
    CulturalHeader,
    PatternContainer,
    SindhiBadge,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth, useScroll, useTheme } from '@/context';
import { type AIStory } from '@/data/aiStories';
import { MOCK_STORIES, type MockStory } from '@/data/mockStories';
import { ROUTES } from '@/navigation/routes';
import { subscribeToUserStories } from '@/services/storyService';
import type { Story } from '@/types';

// Premium AI Story card component with animation
function AIStoryCard({ story, index }: { story: AIStory; index: number }) {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [fade, index]);

  return (
    <Animated.View
      style={[
        styles.aiCardWrapper,
        {
          opacity: fade,
          transform: [
            {
              translateY: fade.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => router.push(ROUTES.storyDetail(story.id))}
        style={({ pressed }) => [
          styles.aiCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.aiCardPress,
        ]}
      >
        <Image source={story.imageSource} style={styles.aiImage} resizeMode="cover" />
        <View style={styles.aiTextArea}>
          <SindhiBadge label="AI Storyteller" variant="indigo" style={styles.aiBadge} />
          <Text style={[styles.aiTitle, { color: colors.deepIndigo }]}>{story.title}</Text>
          <Text style={[styles.aiDescription, { color: colors.textMuted }]} numberOfLines={3}>
            {story.description}
          </Text>
          <View pointerEvents="none">
            <AjrakButton
              label="Play / Read"
              variant="outline"
              fullWidth
              style={styles.aiButton}
            />
          </View>
        </View>
        <View style={[styles.ajrakEdge, { backgroundColor: colors.brickRed }]} />
      </Pressable>
    </Animated.View>
  );
}

export default function StoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const [activeTab, setActiveTab] = useState<'archive' | 'my-stories'>('archive');
  const { colors } = useTheme();
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  // Get userId safely - handle case where auth is not available
  let userId: string | null = null;
  try {
    const auth = useAuth();
    userId = auth.userId;
  } catch (error) {
    // Auth context not available, userId remains null
    console.log('Auth context not available:', error);
  }

  // Subscribe to user's stories from Firestore
  useEffect(() => {
    if (!userId) {
      setLoadingStories(false);
      setUserStories([]);
      return;
    }

    const unsubscribe = subscribeToUserStories(
      userId,
      (stories: Story[]) => {
        setUserStories(stories);
        setLoadingStories(false);
      },
      (error: Error) => {
        console.error('Error fetching stories:', error);
        setLoadingStories(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const renderArchiveItem = ({ item, index }: { item: MockStory; index: number }) => (
    <CulturalCard
      title={item.title}
      description={item.excerpt}
      badge={`Story ${index + 1}`}
      imageTint={index % 2 === 0 ? 'indigo' : 'brick'}
      onPress={() => router.push(ROUTES.storyDetail(item.id))}
      style={styles.card}
    />
  );

  const renderUserStoryItem = ({ item, index }: { item: any; index: number }) => (
    <CulturalCard
      title={item.title}
      description={item.storyText || 'No story text yet'}
      badge={item.status === 'done' ? 'Ready' : 'Processing'}
      imageTint={index % 2 === 0 ? 'indigo' : 'brick'}
      onPress={() => router.push(ROUTES.storyDetail(item.id))}
      style={styles.card}
    />
  );

  const renderAIItem = ({ item, index }: { item: AIStory; index: number }) => (
    <AIStoryCard story={item} index={index} />
  );

  return (
    <PatternContainer>
      {activeTab === 'archive' ? (
        <FlatList
          data={MOCK_STORIES}
          keyExtractor={(item) => item.id}
          renderItem={renderArchiveItem}
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

              {/* Custom Premium Segmented Control */}
              <View style={[styles.tabContainer, { backgroundColor: colors.ivoryWarm, borderColor: colors.border }]}>
                <Pressable
                  onPress={() => setActiveTab('archive')}
                  style={[
                    styles.tabButton,
                    activeTab === 'archive' && [styles.tabButtonActive, { backgroundColor: colors.deepIndigo, shadowColor: colors.deepIndigo }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: colors.textMuted },
                      activeTab === 'archive' && [styles.tabTextActive, { color: colors.white }],
                    ]}
                  >
                    Folk Archive
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('my-stories')}
                  style={[
                    styles.tabButton,
                    activeTab === 'my-stories' && [styles.tabButtonActive, { backgroundColor: colors.deepIndigo, shadowColor: colors.deepIndigo }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: colors.textMuted },
                      activeTab === 'my-stories' && [styles.tabTextActive, { color: colors.white }],
                    ]}
                  >
                    My Stories
                  </Text>
                </Pressable>
              </View>

              <SindhiBadge
                label={`${MOCK_STORIES.length} tales in archive`}
                variant="cream"
                style={styles.badge}
              />
            </>
          }
        />
      ) : (
        <FlatList
          data={userStories}
          keyExtractor={(item) => item.id}
          renderItem={renderUserStoryItem}
          ListEmptyComponent={
            !loadingStories ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No stories yet. Record your first story!</Text>
              </View>
            ) : undefined
          }
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

              {/* Custom Premium Segmented Control */}
              <View style={[styles.tabContainer, { backgroundColor: colors.ivoryWarm, borderColor: colors.border }]}>
                <Pressable
                  onPress={() => setActiveTab('archive')}
                  style={[
                    styles.tabButton,
                    activeTab === 'archive' && [styles.tabButtonActive, { backgroundColor: colors.deepIndigo, shadowColor: colors.deepIndigo }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: colors.textMuted },
                      activeTab === 'archive' && [styles.tabTextActive, { color: colors.white }],
                    ]}
                  >
                    Folk Archive
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('my-stories')}
                  style={[
                    styles.tabButton,
                    activeTab === 'my-stories' && [styles.tabButtonActive, { backgroundColor: colors.deepIndigo, shadowColor: colors.deepIndigo }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: colors.textMuted },
                      activeTab === 'my-stories' && [styles.tabTextActive, { color: colors.white }],
                    ]}
                  >
                    My Stories
                  </Text>
                </Pressable>
              </View>

              <SindhiBadge
                label={loadingStories ? 'Loading your stories…' : `${userStories.length} stories created`}
                variant="cream"
                style={styles.badge}
              />
            </>
          }
        />
      )}
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
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  card: { marginBottom: Spacing.md },
  
  // Custom Tab Selector styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: SagaColors.ivoryWarm,
    borderRadius: Spacing.buttonRadius,
    padding: 4,
    borderWidth: 1,
    borderColor: SagaColors.border,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Spacing.buttonRadius - 2,
  },
  tabButtonActive: {
    backgroundColor: SagaColors.deepIndigo,
    shadowColor: SagaColors.deepIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...Typography.overline,
    color: SagaColors.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: SagaColors.white,
    fontWeight: '700',
  },

  // AI Card styles
  aiCardWrapper: {
    marginBottom: Spacing.md,
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
  },
  aiCard: {
    backgroundColor: SagaColors.surface,
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SagaColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  aiCardPress: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  aiImage: {
    width: '100%',
    height: 150,
  },
  aiTextArea: {
    padding: Spacing.md,
  },
  aiBadge: {
    marginBottom: Spacing.xs,
    alignSelf: 'flex-start',
  },
  aiTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: 6,
  },
  aiDescription: {
    ...Typography.body,
    fontSize: 14,
    color: SagaColors.textMuted,
    lineHeight: 21,
    marginBottom: Spacing.sm,
  },
  aiButton: {
    marginTop: Spacing.xs,
  },
  ajrakEdge: {
    height: 4,
    backgroundColor: SagaColors.brickRed,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
});

