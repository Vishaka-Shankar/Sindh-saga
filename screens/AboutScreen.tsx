import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import {
  AjrakButton,
  CulturalHeader,
  DecorativeDivider,
  PatternContainer,
  RuliStrip,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { ROUTES } from '@/navigation/routes';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48, paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title="About Us"
          subtitle="Preserving the folklore and voice of the Indus"
          variant="dark"
          compact
        />

        <DecorativeDivider label="Sindhu Saga" />

        {/* Section 1: The Mission */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeader}>Preserving Oral History</Text>
          <RuliStrip height={3} style={styles.ruli} />
          <Text style={styles.bodyText}>
            Sindh Saga is a premium cultural platform created to bridge generations.
            By recording folk tales, anecdotes, and histories in the beautiful Sindhi
            mother tongue, we ensure that the oral traditions of the Indus valley
            are never lost.
          </Text>
        </Card>

        {/* Section 2: Heritage & History */}
        <Card style={[styles.card, styles.indigoBorder]}>
          <Text style={[styles.sectionHeader, { color: SagaColors.deepIndigo }]}>
            The Indus Legacy
          </Text>
          <RuliStrip height={3} style={styles.ruli} />
          <Text style={styles.bodyText}>
            Dating back over 5,000 years to Mohenjo-daro, the Indus River basin
            has been a cradle of profound art, literature, Sufi music, and wisdom.
            From the mystical verses of Shah Abdul Latif Bhittai to modern day legends,
            Sindh Saga honors these stories.
          </Text>
        </Card>

        {/* Section 3: Technology Meets Craft */}
        <Card style={[styles.card, styles.goldBorder]}>
          <Text style={[styles.sectionHeader, { color: SagaColors.gold }]}>
            AI-Enhanced Preservation
          </Text>
          <RuliStrip height={3} style={styles.ruli} />
          <Text style={styles.bodyText}>
            We combine traditional recording techniques with modern technology.
            Our upcoming features will use advanced speech-to-text models to capture
            raw Sindhi voice recordings, and translate them into high-fidelity,
            child-friendly English storybooks, ensuring that youth worldwide stay
            connected to their roots.
          </Text>
        </Card>

        <View style={styles.actionContainer}>
          <AjrakButton
            label="Explore Our Stories"
            fullWidth
            onPress={() => router.push(ROUTES.stories)}
          />
          <AjrakButton
            label="Go Back Home"
            variant="outline"
            fullWidth
            style={styles.gap}
            onPress={() => router.push(ROUTES.home)}
          />
        </View>
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
  },
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  indigoBorder: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.deepIndigo,
  },
  goldBorder: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.gold,
  },
  sectionHeader: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  ruli: {
    width: 60,
    marginBottom: Spacing.md,
  },
  bodyText: {
    ...Typography.body,
    fontSize: 14.5,
    lineHeight: 24,
    color: SagaColors.charcoal,
  },
  actionContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  gap: {
    marginTop: Spacing.sm,
  },
});
