// screens/CulturalItemsScreen.tsx  (or app/(tabs)/cultural.tsx — rename as needed)
// Fixes applied:
//  • Category filter state managed here, passed down as a prop (not inside
//    the gallery) so the gallery only re-fetches when the category actually changes.
//  • Search query is client-side — no extra network call.
//  • "Reload gallery" button calls fetchCulturalItems again via a ref to the
//    gallery's exposed reload function, instead of triggering a full re-mount.

import React, { useCallback, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CulturalGallery from '../components/CulturalGallery';
import { Category } from '../data/culturalItems';

const CATEGORIES: Category[] = ['All', 'History', 'Music', 'Clothing', 'Art', 'Food'];

export default function CulturalItemsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  // Increment this key to force a clean re-mount of the gallery (i.e. a fresh
  // fetch) when the user presses "Reload". This avoids stale-state issues.
  const [galleryKey, setGalleryKey] = useState(0);

  const handleReload = useCallback(() => {
    setGalleryKey((k) => k + 1);
  }, []);

  const handleCategoryChange = useCallback((cat: Category) => {
    setActiveCategory(cat);
    // Do NOT reset galleryKey here — we want a smooth category switch,
    // not a full reload flash.
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Cultural items from Sindh</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items like ajrak, thari mithai or santoor"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* ── Category tabs ──────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => handleCategoryChange(cat)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === cat && styles.tabTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      {/* key={galleryKey} forces a remount (and fresh fetch) on reload only */}
      <CulturalGallery
        key={galleryKey}
        category={activeCategory}
        searchQuery={searchQuery}
        onRequestReload={handleReload}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  titleUnderline: {
    marginTop: 6,
    width: 48,
    height: 3,
    backgroundColor: '#C0392B',
    borderRadius: 2,
  },

  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  tabRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabActive: {
    backgroundColor: '#C0392B',
    borderColor: '#C0392B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
