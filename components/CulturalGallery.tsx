// components/CulturalGallery.tsx
// Key fixes vs the broken version:
//  1. useCallback wraps the fetch so the function reference is stable.
//  2. useEffect dependency array only contains [category] — not the function
//     itself — preventing infinite re-render loops.
//  3. A proper AbortController / cancelled flag stops stale state updates
//     when the component unmounts mid-fetch.
//  4. Image load errors fall back to a colourful placeholder rather than
//     showing a broken icon.
//  5. "from cache" banner tells the user they're seeing offline data.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CulturalItem, Category } from '../data/culturalItems';
import { fetchCulturalItems } from '../services/culturalItemsService';

// ─── Placeholder colours per category ──────────────────────────────────────
const CATEGORY_COLOURS: Record<string, string> = {
  Crafts: '#C0392B',
  Clothing: '#8E44AD',
  Food: '#D35400',
  Music: '#1A5276',
  All: '#2C3E50',
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface Props {
  category: Category;
  searchQuery?: string;
  /** Called when the user presses "Reload gallery" — parent increments the key */
  onRequestReload?: () => void;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function GalleryCard({ item }: { item: CulturalItem }) {
  const [imgError, setImgError] = useState(false);
  const colour = CATEGORY_COLOURS[item.category] ?? CATEGORY_COLOURS.All;

  return (
    <View style={styles.card}>
      {imgError || !item.imageUrl ? (
        <View style={[styles.placeholder, { backgroundColor: colour }]}>
          <Text style={styles.placeholderText}>{item.name[0]}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          onError={() => setImgError(true)}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardBody}>
        <View style={[styles.categoryBadge, { backgroundColor: colour }]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardOrigin}>📍 {item.origin}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CulturalGallery({
  category,
  searchQuery = '',
  onRequestReload,
}: Props) {
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  // ── Stable fetch function (doesn't change on every render) ────────────────
  // NOTE: Do NOT put `load` in the useEffect dependency array — it is
  // recreated here only when `category` changes (via useCallback).
  const load = useCallback(async (cancelled: { value: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchCulturalItems(category);
      if (!cancelled.value) {
        setItems(result.items);
        setFromCache(result.fromCache);
      }
    } catch (err) {
      if (!cancelled.value) {
        setError('Could not load items. Showing local data.');
        // Service already handles fallback, but set error message so user knows
      }
    } finally {
      if (!cancelled.value) setLoading(false);
    }
  }, [category]); // ← ONLY re-create when category changes

  // ── Effect: run load once per category change ─────────────────────────────
  useEffect(() => {
    const cancelled = { value: false };
    load(cancelled);

    // Cleanup: mark as cancelled so stale async state updates are ignored
    return () => {
      cancelled.value = true;
    };
  }, [load]); // `load` only changes when `category` changes — no infinite loop

  // ── Filter by search query (client-side, instant) ─────────────────────────
  const displayed =
    searchQuery.trim().length === 0
      ? items
      : items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color="#C0392B" />
        <Text style={styles.loadingText}>Loading cultural items…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Offline / cache banner */}
      {fromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheBannerText}>
            📡 Showing offline data — connect to the internet for live content
          </Text>
        </View>
      )}

      {/* Soft error (still showing data) */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ {error}</Text>
          {onRequestReload && (
            <TouchableOpacity
              style={styles.reloadBtn}
              onPress={onRequestReload}
              activeOpacity={0.75}
            >
              <Text style={styles.reloadBtnText}>Reload gallery</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {displayed.length === 0 ? (
        <View style={styles.centred}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'No items in this category yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GalleryCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          // Performance tweaks
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  centred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },

  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },

  emptyText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  cacheBanner: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cacheBannerText: {
    fontSize: 12,
    color: '#854D0E',
    textAlign: 'center',
  },

  errorBanner: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#991B1B',
    textAlign: 'center',
  },

  reloadBtn: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#C0392B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reloadBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  list: {
    padding: 16,
    gap: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },

  cardImage: {
    width: '100%',
    height: 200,
  },

  placeholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '700',
    opacity: 0.8,
  },

  cardBody: {
    padding: 16,
    gap: 6,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    marginBottom: 2,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  cardOrigin: {
    fontSize: 13,
    color: '#666',
  },

  cardDesc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginTop: 2,
  },
});
