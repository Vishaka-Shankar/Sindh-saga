/**
 * ParentDashboardScreen.tsx — Parent Approval Dashboard for reviewing pending stories
 *
 * This screen allows parents to review stories that are pending approval.
 * Parents can approve or reject stories created by their children.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CulturalHeader, PatternContainer } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/context';
import { approveStory, rejectStory, subscribeToPendingReviewStories } from '@/services/storyService';
import type { Story } from '@/types';

export default function ParentDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPendingStories([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToPendingReviewStories(
      userId,
      (stories) => {
        setPendingStories(stories);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching pending stories:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const handleApprove = async (storyId: string) => {
    try {
      await approveStory(storyId);
    } catch (error) {
      console.error('Error approving story:', error);
    }
  };

  const handleReject = async (storyId: string) => {
    try {
      await rejectStory(storyId);
    } catch (error) {
      console.error('Error rejecting story:', error);
    }
  };

  const renderStoryCard = ({ item: story }: { item: Story }) => {
    const excerpt = story.storyText ? story.storyText.slice(0, 150) + '...' : 'No story text available';

    return (
      <View style={styles.storyCard}>
        {story.artworkUrl && (
          <Image source={{ uri: story.artworkUrl }} style={styles.artworkImage} resizeMode="cover" />
        )}
        <View style={styles.storyContent}>
          <Text style={styles.storyTitle}>{story.title}</Text>
          <Text style={styles.storyExcerpt}>{excerpt}</Text>
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(story.id)}
            >
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Approve</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(story.id)}
            >
              <MaterialIcons name="close" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="check-circle-outline" size={64} color={SagaColors.textMuted} />
      <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
      <Text style={styles.emptyStateText}>No stories are pending review.</Text>
    </View>
  );

  return (
    <PatternContainer patternOpacity={0.05}>
      <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
        <CulturalHeader
          title="Parent Review"
          subtitle="Approve or reject stories for your children"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading pending stories...</Text>
          </View>
        ) : pendingStories.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={pendingStories}
            renderItem={renderStoryCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  storyCard: {
    backgroundColor: SagaColors.ivory,
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  artworkImage: {
    width: '100%',
    height: 200,
  },
  storyContent: {
    padding: Spacing.md,
  },
  storyTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
  storyExcerpt: {
    ...Typography.body,
    color: SagaColors.text,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  approveButton: {
    backgroundColor: SagaColors.ruliGreen,
  },
  rejectButton: {
    backgroundColor: SagaColors.error,
  },
  actionButtonText: {
    ...Typography.subtitle,
    color: '#FFFFFF',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
});
