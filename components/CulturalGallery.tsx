// components/CulturalGallery.tsx
// Fixed: no hooks inside .map() — all animations moved to dedicated components.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AnimatedCulturalCard from './AnimatedCulturalCard';
import { Category, CulturalItem, FALLBACK_CULTURAL_ITEMS } from '../data/culturalItems';
import { fetchCulturalItems } from '../services/culturalItemsService';

const { width: SCREEN_W } = Dimensions.get('window');
const CATEGORIES: Category[] = ['All', 'Clothing', 'Crafts', 'Food', 'Music'];

const WM = (f: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}`;

const HERO_SLIDES = [
  { uri: WM('Ajrak Chadar.jpg'),                                label: 'اجرڪ — Ajrak',               sub: 'The sacred cloth of Sindh' },
  { uri: WM('Mohenjo-daro Stupa and Granary.jpeg'),             label: 'موهن جو دڙو — Mohenjo-daro',  sub: "World's oldest city, 2500 BCE" },
  { uri: WM('Folk Singing in Thar Sindh Pakistan.jpg'),         label: 'ٿر جي موسيقي — Thar Music',   sub: 'Desert songs of Sindh' },
  { uri: WM('Bijal playing Surando.jpg'),                       label: 'سرندو — Surando',              sub: 'Folk music heritage' },
  { uri: WM('A Sindhi kid with cultural dress at village.jpg'), label: 'سنڌي ورثو — Heritage',         sub: 'Passed through generations' },
  { uri: WM('Group of Sindhi girls in traditional clothes.jpg'),label: 'روايتي لباس — Dress',          sub: 'Traditional Sindhi clothing' },
  { uri: WM('Cultural Celebration in School.jpg'),              label: 'ثقافتي ڏينهن — Cultural Day',  sub: 'Sindhi Cultural Day' },
];

// ── Ajrak stripe divider ──────────────────────────────────────────────────
function AjrakDivider({ thick = false }: { thick?: boolean }) {
  const palette = ['#C0392B', '#1B3F8B', '#F5CBA7', '#C0392B', '#1B3F8B', '#F5CBA7'];
  return (
    <View>
      <View style={{ flexDirection: 'row', height: thick ? 8 : 5 }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: palette[i % palette.length], opacity: i % 2 === 0 ? 1 : 0.45 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', height: thick ? 4 : 3 }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: palette[(i + 3) % palette.length], opacity: i % 2 === 0 ? 0.4 : 0.15 }} />
        ))}
      </View>
    </View>
  );
}

// ── Geometric background ──────────────────────────────────────────────────
function GeometricBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <View
            key={`${row}-${col}`}
            style={{
              position: 'absolute',
              width: 55, height: 55, borderRadius: 5,
              top: row * 100, left: col * 70 - 20,
              backgroundColor: (row + col) % 2 === 0 ? '#C0392B' : '#1B3F8B',
              opacity: (row + col) % 3 === 0 ? 0.045 : 0.02,
              transform: [{ rotate: '45deg' }],
            }}
          />
        ))
      )}
    </View>
  );
}

// ── Single floating ornament — hooks at top level of its own component ────
function FloatingDot({ x, delay, size, color }: { x: number; delay: number; size: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: -10, duration: 1800, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0,   duration: 1800,         useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute', top: 8, left: x,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color, opacity: 0.55,
        transform: [{ translateY: anim }],
      }}
    />
  );
}

function FloatingOrnaments() {
  const ornaments = [
    { x: 18,  delay: 0,   size: 10, color: '#C0392B' },
    { x: 70,  delay: 600, size: 7,  color: '#1B3F8B' },
    { x: 140, delay: 300, size: 12, color: '#C0392B' },
    { x: 220, delay: 900, size: 8,  color: '#7D5A2F' },
    { x: 290, delay: 150, size: 10, color: '#1B3F8B' },
    { x: 350, delay: 750, size: 7,  color: '#C0392B' },
  ];
  return (
    <View style={{ height: 28, position: 'relative' }} pointerEvents="none">
      {ornaments.map((o, i) => (
        <FloatingDot key={i} {...o} />
      ))}
    </View>
  );
}

// ── Single loading bounce dot ─────────────────────────────────────────────
function BounceDot({ color, delay }: { color: string; delay: number }) {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -12, duration: 400, delay, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0,   duration: 400,         useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color, transform: [{ translateY: bounce }] }}
    />
  );
}

// ── Hero Carousel ─────────────────────────────────────────────────────────
function HeroCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % HERO_SLIDES.length;
      flatRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ height: 280, position: 'relative' }}>
      <Animated.FlatList
        ref={flatRef as any}
        data={HERO_SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W, height: 280, overflow: 'hidden' }}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,10,20,0.42)' }]} />
            <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                {item.sub}
              </Text>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{item.label}</Text>
            </View>
          </View>
        )}
      />
      {/* Dots */}
      <View style={{ position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 4 }}>
        {HERO_SLIDES.map((_, i) => {
          const width = scrollX.interpolate({
            inputRange: [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W],
            outputRange: [6, 22, 6], extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W],
            outputRange: [0.4, 1, 0.4], extrapolate: 'clamp',
          });
          return <Animated.View key={i} style={{ height: 6, borderRadius: 3, backgroundColor: '#fff', width, opacity }} />;
        })}
      </View>
    </View>
  );
}

// ── Animated Category Tab ─────────────────────────────────────────────────
function CategoryTab({ label, active, onPress }: { label: Category; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const bg    = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bg, { toValue: active ? 1 : 0, useNativeDriver: false, tension: 140, friction: 11 }).start();
    if (active) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.9, duration: 70, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [active]);

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={{
        paddingHorizontal: 19, paddingVertical: 9, borderRadius: 99, borderWidth: 1.5, marginRight: 8,
        backgroundColor: bg.interpolate({ inputRange: [0, 1], outputRange: ['#FFFDF9', '#C0392B'] }),
        borderColor:     bg.interpolate({ inputRange: [0, 1], outputRange: ['#D5C9C0', '#C0392B'] }),
        transform: [{ scale }],
      }}>
        <Animated.Text style={{
          fontSize: 13, fontWeight: '700',
          color: bg.interpolate({ inputRange: [0, 1], outputRange: ['#555', '#fff'] }),
        }}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Main Gallery ──────────────────────────────────────────────────────────
interface Props {
  category?: Category;
  searchQuery?: string;
  onRequestReload?: () => void;
}

export default function CulturalGallery({ category: categoryProp, searchQuery: searchProp = '', onRequestReload }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>(categoryProp ?? 'All');
  const [searchQuery, setSearchQuery]       = useState(searchProp);
  const [items, setItems]                   = useState<CulturalItem[]>([]);
  const [loading, setLoading]               = useState(true);
  const [fromCache, setFromCache]           = useState(false);
  const [galleryKey, setGalleryKey]         = useState(0);

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-24)).current;
  const searchFade  = useRef(new Animated.Value(0)).current;
  const searchSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 700,               useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 60, friction: 10,   useNativeDriver: true }),
      Animated.timing(searchFade,  { toValue: 1, duration: 800, delay: 250,   useNativeDriver: true }),
      Animated.spring(searchSlide, { toValue: 0, tension: 60, friction: 10, delay: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  const load = useCallback(async (cancelled: { value: boolean }) => {
    setLoading(true);
    try {
      const result = await fetchCulturalItems(activeCategory);
      if (!cancelled.value) { setItems(result.items); setFromCache(result.fromCache); }
    } catch {
      if (!cancelled.value) { setItems(FALLBACK_CULTURAL_ITEMS); setFromCache(true); }
    } finally {
      if (!cancelled.value) setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    const cancelled = { value: false };
    load(cancelled);
    return () => { cancelled.value = true; };
  }, [load, galleryKey]);

  const displayed = searchQuery.trim()
    ? items.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items;

  return (
    <View style={styles.root}>
      <GeometricBackground />
      <AjrakDivider thick />
      <FloatingOrnaments />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
        <View>
          <Text style={styles.titleArabic}>سنڌي ثقافت</Text>
          <Text style={styles.title}>Cultural items from Sindh</Text>
          <View style={styles.underline} />
        </View>
        <View style={{ flexDirection: 'column', gap: 5, paddingBottom: 4 }}>
          {['#C0392B', '#1B3F8B', '#7D5A2F'].map((c, i) => (
            <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
          ))}
        </View>
      </Animated.View>

      <HeroCarousel />
      <AjrakDivider />

      {/* Search */}
      <Animated.View style={[styles.searchRow, { opacity: searchFade, transform: [{ translateY: searchSlide }] }]}>
        <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ajrak, topi, surando, rilli…"
          placeholderTextColor="#BBB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </Animated.View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {CATEGORIES.map(cat => (
          <CategoryTab key={cat} label={cat} active={activeCategory === cat} onPress={() => setActiveCategory(cat)} />
        ))}
      </ScrollView>

      {/* Offline banner */}
      {fromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheText}>📡 Showing local data — connect for live Firebase content</Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centre}>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <BounceDot color="#C0392B" delay={0} />
            <BounceDot color="#1B3F8B" delay={150} />
            <BounceDot color="#7D5A2F" delay={300} />
          </View>
          <Text style={styles.loadingText}>Loading Sindhi culture…</Text>
        </View>
      ) : displayed.length === 0 ? (
        <View style={styles.centre}>
          <Text style={styles.emptyText}>
            {searchQuery ? `No results for "${searchQuery}"` : 'No items in this category'}
          </Text>
        </View>
      ) : (
        displayed.map((item, index) => (
          <AnimatedCulturalCard key={item.id} item={item} index={index} />
        ))
      )}

      {/* Reload */}
      <Pressable style={styles.reloadBtn} onPress={() => { setGalleryKey(k => k + 1); onRequestReload?.(); }}>
        <Text style={styles.reloadText}>↺  Reload gallery</Text>
      </Pressable>

      <FloatingOrnaments />
      <AjrakDivider thick />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#F5F0EB', overflow: 'hidden', paddingBottom: 24 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  titleArabic: { fontSize: 12, color: '#C0392B', fontWeight: '700', letterSpacing: 2, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  underline: { marginTop: 8, width: 50, height: 4, backgroundColor: '#C0392B', borderRadius: 2 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 10,
    backgroundColor: '#FFFDF9', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E2D5CC',
    paddingHorizontal: 14, paddingVertical: 2,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 10px rgba(0,0,0,0.07)' } as any,
    }),
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 12 },
  tabRow: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  cacheBanner: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FEF3C7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  cacheText: { fontSize: 12, color: '#92400E' },
  centre: { paddingVertical: 48, alignItems: 'center' },
  loadingText: { color: '#C0392B', fontSize: 14, fontWeight: '600' },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },
  reloadBtn: { alignSelf: 'center', marginTop: 6, marginBottom: 16, paddingHorizontal: 28, paddingVertical: 12, backgroundColor: '#C0392B', borderRadius: 99 },
  reloadText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
});
