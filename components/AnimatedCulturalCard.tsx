// components/AnimatedCulturalCard.tsx
// Rich animated card for a single Sindhi cultural item.
// Uses React Native Animated API only — no extra dependencies.
// Features: image carousel, shimmer loader, Ajrak border, press animation.

import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { CulturalItem } from '../data/culturalItems';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = Math.min(SCREEN_W - 32, 600); // cap for web

interface Props {
  item: CulturalItem;
  index: number;
  onPress?: (item: CulturalItem) => void;
}

// ── Ajrak geometric border ────────────────────────────────────────────────
function AjrakBorder({ color }: { color: string }) {
  const STRIPES = 24;
  return (
    <View style={borderStyles.row}>
      {Array.from({ length: STRIPES }).map((_, i) => (
        <View
          key={i}
          style={[
            borderStyles.cell,
            {
              backgroundColor:
                i % 3 === 0 ? color : i % 3 === 1 ? '#C0392B' : '#1B3F8B',
              opacity: i % 2 === 0 ? 1 : 0.5,
            },
          ]}
        />
      ))}
    </View>
  );
}
const borderStyles = StyleSheet.create({
  row: { flexDirection: 'row', height: 7 },
  cell: { flex: 1 },
});

// ── Diamond pattern overlay ───────────────────────────────────────────────
function DiamondOverlay({ color }: { color: string }) {
  return (
    <View style={diamondStyles.container} pointerEvents="none">
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <View
            key={`${row}-${col}`}
            style={[
              diamondStyles.diamond,
              {
                top: row * 30 - 10,
                left: col * 30 - 10,
                backgroundColor: color,
                opacity: (row + col) % 2 === 0 ? 0.08 : 0.04,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
        ))
      )}
    </View>
  );
}
const diamondStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  diamond: { position: 'absolute', width: 20, height: 20, borderRadius: 2 },
});

// ── Mini image carousel inside the card ───────────────────────────────────
function ImageCarousel({
  images,
  accentColor,
  itemName,
  onItemLoad,
}: {
  images: any[];
  accentColor: string;
  itemName: string;
  onItemLoad?: () => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const autoPlay = useRef<ReturnType<typeof setInterval> | null>(null);
  const [errored, setErrored] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (images.length <= 1) return;
    if (autoPlay.current !== null) {
      clearInterval(autoPlay.current);
    }
    autoPlay.current = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % images.length;
      flatRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    }, 4200);
    return () => {
      if (autoPlay.current !== null) {
        clearInterval(autoPlay.current);
        autoPlay.current = null;
      }
    };
  }, [images.length]);

  if (images.length === 0) return null;
  if (images.length === 1) return null; // Single image handled by parent

  return (
    <View style={carouselStyles.container}>
      <Animated.FlatList
        ref={flatRef as any}
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={({ nativeEvent }) => {
          currentIndex.current = Math.round(nativeEvent.contentOffset.x / CARD_W);
        }}
        renderItem={({ item: imageSource, index }) => {
          if (errored[index]) return null;
          const source = typeof imageSource === 'string'
            ? {
                uri: imageSource,
                headers: { 'User-Agent': 'SindhSagaApp/1.0 (https://sindhsaga.org; contact@sindhsaga.org)' },
              }
            : imageSource;
          return (
            <Image
              source={source}
              style={[carouselStyles.image, { width: CARD_W }]}
              resizeMode="cover"
              onLoad={() => onItemLoad?.()}
              onError={() => setErrored((e) => ({ ...e, [index]: true }))}
            />
          );
        }}
      />
      {/* Dot indicators */}
      <View style={carouselStyles.dots}>
        {images.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * CARD_W, i * CARD_W, (i + 1) * CARD_W],
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });
          const scale = scrollX.interpolate({
            inputRange: [(i - 1) * CARD_W, i * CARD_W, (i + 1) * CARD_W],
            outputRange: [0.8, 1.3, 0.8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[carouselStyles.dot, { backgroundColor: accentColor, opacity, transform: [{ scale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
}
const carouselStyles = StyleSheet.create({
  container: { position: 'relative' },
  image: { width: CARD_W, height: 230 },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});

// ── Main Card ─────────────────────────────────────────────────────────────
export default function AnimatedCulturalCard({ item, index, onPress }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Staggered entrance
  useEffect(() => {
    const delay = index * 130;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 55, friction: 9, delay, useNativeDriver: true }),
    ]).start();
  }, [index]);

  // Shimmer while loading
  useEffect(() => {
    if (imgLoaded) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 950, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0.3, duration: 950, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [imgLoaded]);

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, tension: 300, friction: 12 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 300, friction: 12 }).start();

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const fadeInImage = () => {
    Animated.timing(imageOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  // Resolve image source: use local bundled assets first, remote only when no local source exists.
  const primarySource = item.imageSource
    ? item.imageSource
    : item.imageUrl
      ? { uri: item.imageUrl, headers: { 'User-Agent': 'SindhSagaApp/1.0 (https://sindhsaga.org; contact@sindhsaga.org)' } }
      : null;

  const carouselImages = [
    ...(item.imageSource ? [item.imageSource] : item.imageUrl ? [{ uri: item.imageUrl, headers: { 'User-Agent': 'SindhSagaApp/1.0 (https://sindhsaga.org; contact@sindhsaga.org)' } }] : []),
    ...(item.galleryImages ?? []),
  ].filter(Boolean);
  const imageCount = carouselImages.length;
  const hasMultiple = imageCount > 1;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress?.(item)}
        style={styles.card}
      >
        {/* ── Image / Carousel ─────────────────────────────────────────── */}
        <View style={styles.imageWrapper}>
          {/* Shimmer placeholder */}
          {!imgLoaded && (
            <Animated.View
              style={[styles.shimmer, { backgroundColor: item.accentColor, opacity: shimmerAnim }]}
            >
              <DiamondOverlay color="#fff" />
              <Text style={styles.shimmerLetter}>{item.nameSindhi[0]}</Text>
              <Text style={styles.shimmerName}>{item.name}</Text>
            </Animated.View>
          )}

          {/* Primary image (always shown, carousel overlays if multiple) */}
          {!imgError && !hasMultiple && primarySource && (
            <Animated.Image
              source={primarySource}
              style={[styles.image, { opacity: imageOpacity }, !imgLoaded && styles.hidden]}
              resizeMode="cover"
              onLoad={() => {
                setImgLoaded(true);
                fadeInImage();
              }}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          )}

          {/* Multi-image carousel */}
          {hasMultiple && (
            <View style={[styles.image, !imgLoaded && styles.hidden]}>
              <ImageCarousel
                images={carouselImages}
                accentColor={item.accentColor}
                itemName={item.name}
                onItemLoad={() => setImgLoaded(true)}
              />
            </View>
          )}

          {/* Fallback placeholder if all images fail */}
          {imgError && (
            <View style={[styles.shimmer, { backgroundColor: item.accentColor }]}>
              <DiamondOverlay color="#fff" />
              <Text style={styles.shimmerLetter}>{item.nameSindhi[0]}</Text>
              <Text style={styles.shimmerName}>{item.name}</Text>
            </View>
          )}

          {/* Bottom gradient fade */}
          <View style={[styles.gradient, { backgroundColor: item.accentColor }]} pointerEvents="none" />

          {/* Sindhi name top-right */}
          <View style={styles.sindhiBadge}>
            <Text style={styles.sindhiText}>{item.nameSindhi}</Text>
          </View>

          {/* Category pill */}
          <View style={[styles.catBadge, { backgroundColor: item.accentColor }]}>
            <Text style={styles.catText}>{item.category.toUpperCase()}</Text>
          </View>

          {/* Multi-image indicator */}
          {hasMultiple && imgLoaded && (
            <View style={styles.multiIndicator}>
              <Text style={styles.multiIndicatorText}>1 / {imageCount}</Text>
            </View>
          )}
        </View>

        {/* ── Ajrak border strip ─────────────────────────────────────── */}
        <AjrakBorder color={item.accentColor} />

        {/* ── Card body ─────────────────────────────────────────────── */}
        <View style={styles.body}>
          <Text style={styles.name}>{item.name}</Text>

          <View style={styles.originRow}>
            <Text style={styles.pin}>📍</Text>
            <Text style={styles.origin}>{item.origin}</Text>
          </View>

          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={[styles.tag, { borderColor: item.accentColor }]}>
                <Text style={[styles.tagText, { color: item.accentColor }]}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Bottom decorative row */}
          <View style={[styles.bottomStripe, { borderTopColor: item.accentColor }]}>
            <Text style={[styles.bottomText, { color: item.accentColor }]}>
              سنڌ جي ثقافت
            </Text>
            <Text style={[styles.bottomText, { color: item.accentColor }]}>
              Sindhi Heritage
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  card: {
    borderRadius: 22,
    backgroundColor: '#FFFDF9',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.13, shadowRadius: 20 },
      android: { elevation: 10 },
      web: { boxShadow: '0 8px 32px rgba(0,0,0,0.13)' } as any,
    }),
  },

  imageWrapper: { height: 230, position: 'relative', overflow: 'hidden' },
  image: { width: '100%', height: 230 },
  hidden: { opacity: 0, position: 'absolute' },

  shimmer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  shimmerLetter: { fontSize: 64, color: 'rgba(255,255,255,0.25)', fontWeight: '900' },
  shimmerName: { fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  gradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, opacity: 0.55,
  },

  sindhiBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  sindhiText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  catBadge: {
    position: 'absolute', top: 12, left: 12,
    borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5,
  },
  catText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },

  multiIndicator: {
    position: 'absolute', bottom: 14, right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  multiIndicatorText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  body: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 16 },

  name: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.4, marginBottom: 5 },

  originRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
  pin: { fontSize: 12 },
  origin: { fontSize: 13, color: '#888', fontWeight: '500' },

  description: { fontSize: 14, color: '#555', lineHeight: 23, marginBottom: 13 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  tag: { borderWidth: 1.5, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '700' },

  bottomStripe: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, paddingTop: 10, opacity: 0.6,
  },
  bottomText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
});
