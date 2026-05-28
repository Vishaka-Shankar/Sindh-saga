import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import {
    AjrakButton,
    CulturalHeader,
    DecorativeDivider,
    PatternContainer,
    SindhiBadge,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { CulturalItem } from '@/data/culturalItems';
import { fetchCulturalItemById } from '@/services/culturalItemsService';

export default function CulturalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const [item, setItem] = useState<CulturalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setErrorMessage(null);

      if (!id) {
        setErrorMessage('Invalid item identifier.');
        setLoading(false);
        return;
      }

      const result = await fetchCulturalItemById(id);
      setItem(result.item);
      setErrorMessage(result.error ?? null);
      setLoading(false);
    };

    void loadItem();
  }, [id]);

  if (loading) {
    return (
      <PatternContainer>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          <CulturalHeader title="Loading item…" variant="dark" compact />
          <View style={styles.centre}>
            <Text style={styles.loadingText}>Loading cultural item…</Text>
          </View>
        </ScrollView>
      </PatternContainer>
    );
  }

  if (!item) {
    return (
      <PatternContainer>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          <CulturalHeader title="Item not found" variant="dark" compact />
          <Card style={styles.block}>
            <Text style={styles.body}>
              We could not locate that cultural item. Please return to the gallery and try again.
            </Text>
          </Card>
          <AjrakButton label="Back to gallery" fullWidth onPress={() => router.back()} />
        </ScrollView>
      </PatternContainer>
    );
  }

  const primarySource = item.imageSource ?? { uri: item.imageUrl };

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title={item.name}
          subtitle={`${item.category} · ${item.origin}`}
          variant="dark"
          compact
        />

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.heroBlock}>
          <Image source={primarySource} style={styles.heroImage} resizeMode="cover" />
          {item.galleryImages?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryRow}
            >
              {item.galleryImages.map((source, index) => (
                <Image
                  key={`${item.id}-gallery-${index}`}
                  source={source}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : null}
        </View>

        <DecorativeDivider label="About this item" />

        <Card style={styles.block}>
          <SindhiBadge label={item.nameSindhi} variant="indigo" />
          <Text style={styles.sectionTitle}>Origins & heritage</Text>
          <Text style={styles.body}>{item.description}</Text>

          <Text style={styles.sectionTitle}>Where it belongs</Text>
          <Text style={styles.body}>{item.origin}</Text>

          <Text style={styles.sectionTitle}>Cultural significance</Text>
          <Text style={styles.body}>
            This Sindhi treasure carries the spirit of Sindh across generations. It is part of everyday life, ritual dress,
            festival celebration, and the shared stories of communities from the Indus plains to desert settlements.
          </Text>

          <View style={styles.tagRow}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </Card>

        <AjrakButton label="Back to gallery" fullWidth onPress={() => router.back()} />
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  heroBlock: {
    marginHorizontal: 16,
    marginBottom: Spacing.lg,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  galleryRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  galleryImage: {
    width: 128,
    height: 88,
    borderRadius: 18,
    marginRight: 12,
  },
  block: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    marginTop: Spacing.md,
    marginBottom: 8,
  },
  loadingText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    fontSize: 16,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFF4F4',
    borderWidth: 1,
    borderColor: '#F5C2C7',
  },
  errorText: {
    ...Typography.body,
    color: '#9B1C1C',
    lineHeight: 22,
  },
  body: {
    ...Typography.body,
    color: SagaColors.text,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
  },
  centre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  tag: {
    borderWidth: 1,
    borderColor: SagaColors.border,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: SagaColors.surface,
  },
  tagText: {
    ...Typography.caption,
    color: SagaColors.textMuted,
  },
});
