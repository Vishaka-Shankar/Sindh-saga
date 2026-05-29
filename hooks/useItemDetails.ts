import { useCallback, useEffect, useState } from 'react';

import { getLocalImageSourceForItem } from '@/data/culturalItems';
import { fetchItemDetails, fetchItems, type CulturalItem } from '@/services/api';

export function useItemDetails(selectedItemId: string | null) {
  const [itemDetails, setItemDetails] = useState<CulturalItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItemDetails = useCallback(
    async (id: string | null) => {
      if (!id) {
        setItemDetails(null);
        setRelatedItems([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await fetchItemDetails(id);
        setItemDetails({
          ...details,
          imageSource: getLocalImageSourceForItem(details),
        });

        const categoryItems = await fetchItems(details.category.toLowerCase());
        setRelatedItems(categoryItems.filter((item) => item.id !== details.id).slice(0, 3));
      } catch (detailsError) {
        setError(detailsError instanceof Error ? detailsError.message : 'Unable to load item details.');
        setItemDetails(null);
        setRelatedItems([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadItemDetails(selectedItemId);
  }, [selectedItemId, loadItemDetails]);

  return {
    itemDetails,
    relatedItems,
    loading,
    error,
    refresh: useCallback(() => void loadItemDetails(selectedItemId), [selectedItemId, loadItemDetails]),
  };
}
