import { Image } from 'expo-image';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { AjrakPattern } from '@/components/AjrakPattern';
import { CulturalCard } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { CulturalItem } from '@/services/api';

type ItemDetailModalProps = {
  visible: boolean;
  itemId: string | null;
  itemDetails: CulturalItem | null;
  relatedItems: CulturalItem[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSelectItem: (id: string) => void;
  onRefresh: () => void;
};

export function ItemDetailModal({
  visible,
  itemId,
  itemDetails,
  relatedItems,
  loading,
  error,
  onClose,
  onSelectItem,
  onRefresh,
}: ItemDetailModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.modalContainer}>
        <View style={styles.headerPattern} pointerEvents="none">
          <AjrakPattern variant="warm" />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.detailsCard}>
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={SagaColors.brickRed} />
                <Text style={styles.loadingLabel}>Loading Sindhi heritage...</Text>
              </View>
            ) : error ? (
              <View style={styles.emptyStateWrap}>
                <Text style={styles.errorTitle}>ڪجهه غلط ٿي ويو</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={onRefresh}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            ) : itemDetails ? (
              <>
                <Image
                  source={{
                    uri: itemDetails.imageUrl,
                    headers: { 'User-Agent': 'SindhSagaApp/1.0 (https://sindhsaga.org; contact@sindhsaga.org)' }
                  }}
                  style={styles.featureImage}
                  contentFit="cover"
                />
                <Text style={styles.title}>{itemDetails.name}</Text>
                <Text style={styles.sindhiTitle}>سنڌي نالو: {itemDetails.name}</Text>
                <Text style={styles.badge}>{itemDetails.category}</Text>
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.body}>{itemDetails.description}</Text>
                <Text style={styles.sectionLabel}>Historical origin</Text>
                <Text style={styles.body}>{itemDetails.origin}</Text>

                <View style={styles.relatedSection}>
                  <Text style={styles.sectionTitle}>Related Sindhi Items</Text>
                  {relatedItems.length === 0 ? (
                    <Text style={styles.body}>No related items are available right now.</Text>
                  ) : (
                    relatedItems.map((item) => (
                      <Pressable key={item.id} onPress={() => onSelectItem(item.id)} style={styles.relatedCardWrap}>
                        <CulturalCard
                          title={item.name}
                          description={item.description}
                          badge={item.category}
                          imageTint={item.category === 'Food' ? 'gold' : item.category === 'Clothing' ? 'brick' : 'indigo'}
                          style={styles.relatedCard}
                        />
                      </Pressable>
                    ))
                  )}
                </View>
              </>
            ) : (
              <View style={styles.emptyStateWrap}>
                <Text style={styles.emptyStateTitle}>Select a gallery item to view details.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.35)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.md,
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    height: 80,
    zIndex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  detailsCard: {
    borderRadius: Spacing.cardRadius,
    backgroundColor: SagaColors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SagaColors.border,
    minHeight: 320,
    paddingBottom: Spacing.md,
  },
  loadingWrap: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  loadingLabel: {
    marginTop: Spacing.sm,
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  featureImage: {
    width: '100%',
    height: 220,
    backgroundColor: SagaColors.ivoryWarm,
  },
  title: {
    ...Typography.h2,
    color: SagaColors.deepIndigo,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  sindhiTitle: {
    ...Typography.subtitle,
    color: SagaColors.textMuted,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  badge: {
    ...Typography.caption,
    color: SagaColors.ivory,
    backgroundColor: SagaColors.brickRed,
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Spacing.buttonRadius,
  },
  sectionLabel: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  body: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
    lineHeight: 24,
  },
  relatedSection: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
  relatedCardWrap: {
    marginBottom: Spacing.md,
  },
  relatedCard: {
    marginBottom: 0,
  },
  emptyStateWrap: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    textAlign: 'center',
  },
  errorTitle: {
    ...Typography.h2,
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: SagaColors.brickRed,
    borderRadius: Spacing.buttonRadius,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  retryText: {
    ...Typography.body,
    color: SagaColors.ivory,
    fontWeight: '700',
  },
});
