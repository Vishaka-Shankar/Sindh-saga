import { useCallback, useEffect, useRef, useState } from 'react';

import { getLocalImageSourceForItem } from '@/data/culturalItems';
import { fetchItems, type CulturalItem } from '@/services/api';

export const ITEM_CATEGORIES = ['All', 'Clothing', 'Crafts', 'Food', 'Music'] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export function useItems() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('All');
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadItems = useCallback(async (category: ItemCategory) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedCategory = category === 'All' ? undefined : category.toLowerCase();
      const response = await fetchItems(normalizedCategory);
      setItems(response.map((item) => ({
        ...item,
        imageSource: getLocalImageSourceForItem(item),
      })));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'We could not load the Sindh gallery.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryDebounceRef.current) {
      clearTimeout(categoryDebounceRef.current);
    }

    categoryDebounceRef.current = setTimeout(() => {
      void loadItems(activeCategory);
    }, 150);

    return () => {
      if (categoryDebounceRef.current) {
        clearTimeout(categoryDebounceRef.current);
      }
    };
  }, [activeCategory, loadItems]);

  const refresh = useCallback(() => {
    void loadItems(activeCategory);
  }, [activeCategory, loadItems]);

  return {
    items,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    categories: ITEM_CATEGORIES,
    refresh,
  };
}
