import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    type ListRenderItemInfo,
} from 'react-native';

import { CulturalCard, CulturalHeader, CulturalInput, HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useItemDetails } from '@/hooks/useItemDetails';
import { useItems } from '@/hooks/useItems';
import { useSearch } from '@/hooks/useSearch';
import { ItemDetailModal } from '@/modals/ItemDetailModal';

const CATEGORY_BADGE: Record<string, 'indigo' | 'brick' | 'gold'> = {
  Clothing: 'brick',
  Crafts: 'indigo',
  Food: 'gold',
  Music: 'indigo',
  All: 'indigo',
};

export function CulturalGallery() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { items, loading, error, activeCategory, setActiveCategory, categories, refresh } = useItems();
  const { query, setQuery, suggestions, loading: searchLoading, noResults, showDropdown, onFocus, onBlur, clearSearch } = useSearch();
  const { itemDetails, relatedItems, loading: detailLoading, error: detailError, refresh: refreshDetail } = useItemDetails(selectedItemId);

  const handleSelectSuggestion = useCallback(
    (itemId: string) => {
      setSelectedItemId(itemId);
      clearSearch();
    },
    [clearSearch]
  );

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
  }, []);

  const renderGalleryItem = useCallback(
    ({ item }: ListRenderItemInfo<typeof items[number]>) => (
      <CulturalCard
        title={item.name}
        description={item.description}
        badge={item.category}
        imageTint={CATEGORY_BADGE[item.category] ?? 'indigo'}
        onPress={() => handleSelectItem(item.id)}
        style={styles.gridCard}
      />
    ),
    [handleSelectItem]
  );

  const displayItems = useMemo(() => items, [items]);

  return (
    <HeritageSection title="Sindhi Cultural Gallery" subtitle="Browse living heritage with search and category filters">
      <CulturalHeader title="Explore Items" subtitle="Cultural items from Sindh" variant="light" compact />

      <View style={styles.searchRow}>
        <CulturalInput
          placeholder="Search items like ajrak, thari mithai or santoor"
          value={query}
          onChangeText={setQuery}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styles.searchInput}
        />
        {showDropdown ? (
          <View style={styles.dropdown}>
            {searchLoading ? (
              <View style={styles.dropdownLoading}>
                <ActivityIndicator color={SagaColors.brickRed} />
                <Text style={styles.dropdownText}>Searching Sindh treasures…</Text>
              </View>
            ) : noResults ? (
              <Text style={styles.emptyStateText}>No Sindhi items found</Text>
            ) : (
              suggestions.map((suggestion) => (
                <Pressable
                  key={suggestion.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(suggestion.id)}
                >
                  <Image source={suggestion.imageUrl} style={styles.suggestionThumb} contentFit="cover" />
                  <View style={styles.suggestionTextWrap}>
                    <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
                    <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </View>

      <View style={styles.filterBar}>
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <Pressable
              key={category}
              style={[styles.filterPill, active && styles.activeFilterPill]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.filterText, active && styles.activeFilterText]}>{category}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingGrid}>
          {[1, 2, 3, 4].map((index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonLineLong} />
            </View>
          ))}
        </View>
      ) : error ? (
        <View style={styles.emptyStateWrap}>
          <Text style={styles.errorTitle}>ڇا خبر نه، ڪجه غلط ٿي ويو</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Reload gallery</Text>
          </Pressable>
        </View>
      ) : displayItems.length === 0 ? (
        <View style={styles.emptyStateWrap}>
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateText}>Try another category or search term to discover Sindhi heritage.</Text>
        </View>
      ) : (
        <FlatList
          data={displayItems}
          keyExtractor={(item) => item.id}
          renderItem={renderGalleryItem}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
        />
      )}

      <ItemDetailModal
        visible={Boolean(selectedItemId)}
        itemId={selectedItemId}
        itemDetails={itemDetails}
        relatedItems={relatedItems}
        loading={detailLoading}
        error={detailError}
        onClose={() => setSelectedItemId(null)}
        onSelectItem={handleSelectItem}
        onRefresh={refreshDetail}
      />
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    marginBottom: Spacing.md,
  },
  searchInput: {
    zIndex: 2,
  },
  dropdown: {
    marginTop: Spacing.sm,
    backgroundColor: SagaColors.surface,
    borderRadius: Spacing.buttonRadius,
    borderWidth: 1,
    borderColor: SagaColors.border,
    overflow: 'hidden',
    ...{
      shadowColor: SagaColors.black,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    },
  },
  dropdownLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  dropdownText: {
    marginLeft: Spacing.sm,
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SagaColors.border,
  },
  suggestionThumb: {
    width: 50,
    height: 50,
    borderRadius: Spacing.cardRadius,
    backgroundColor: SagaColors.ivoryWarm,
  },
  suggestionTextWrap: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  suggestionTitle: {
    ...Typography.h3,
    color: SagaColors.text,
  },
  suggestionCategory: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginTop: 4,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Spacing.buttonRadius,
    backgroundColor: SagaColors.surface,
    borderWidth: 1,
    borderColor: SagaColors.border,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  activeFilterPill: {
    backgroundColor: SagaColors.brickRed,
    borderColor: SagaColors.brickRed,
  },
  filterText: {
    ...Typography.caption,
    color: SagaColors.textMuted,
  },
  activeFilterText: {
    color: SagaColors.ivory,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '48%',
    backgroundColor: SagaColors.surface,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  skeletonImage: {
    height: 100,
    borderRadius: Spacing.cardRadius,
    backgroundColor: SagaColors.ivoryWarm,
    marginBottom: Spacing.sm,
  },
  skeletonLineShort: {
    height: 14,
    width: '60%',
    borderRadius: 8,
    backgroundColor: SagaColors.ivoryWarm,
    marginBottom: Spacing.sm,
  },
  skeletonLineLong: {
    height: 14,
    width: '100%',
    borderRadius: 8,
    backgroundColor: SagaColors.ivoryWarm,
  },
  emptyStateWrap: {
    padding: Spacing.lg,
    borderRadius: Spacing.cardRadius,
    backgroundColor: SagaColors.surface,
    borderWidth: 1,
    borderColor: SagaColors.border,
    marginBottom: Spacing.lg,
  },
  errorTitle: {
    ...Typography.h2,
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.buttonRadius,
    backgroundColor: SagaColors.brickRed,
    alignSelf: 'flex-start',
  },
  retryText: {
    ...Typography.body,
    color: SagaColors.ivory,
    fontWeight: '700',
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  grid: {
    paddingBottom: Spacing.lg,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  gridCard: {
    width: '48%',
    marginBottom: 0,
  },
});
