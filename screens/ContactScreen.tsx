import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import {
  AjrakButton,
  CulturalHeader,
  CulturalInput,
  DecorativeDivider,
  PatternContainer,
  RuliStrip,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { useLoading } from '@/context/LoadingContext';
import { ROUTES } from '@/navigation/routes';

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { simulateAPILoad } = useLoading();
  const { setScrollY } = useScroll();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
      alert('Please fill out all fields.');
      return;
    }

    // Trigger glowing progress loader
    simulateAPILoad(1200);

    setTimeout(() => {
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48, paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title="Contact Us"
          subtitle="We would love to hear your feedback or oral folklore suggestions"
          variant="dark"
          compact
        />
        <DecorativeDivider label="Heritage Circle" />

        {isSubmitted ? (
          <Card style={styles.successCard}>
            <View style={styles.successBadge}>
              <Text style={styles.successEmoji}>🌸</Text>
            </View>
            <Text style={styles.successTitle}>Meharbani! (Thank you)</Text>
            <RuliStrip height={3} style={styles.ruliSuccess} />
            <Text style={styles.successBody}>
              Your message has been received by our preservation circle.
              We will get back to you shortly as we record the voice of Sindh.
            </Text>
            <AjrakButton label="Send another message" variant="outline" onPress={handleReset} />
          </Card>
        ) : (
          <Card style={styles.formCard}>
            <Text style={styles.formIntro}>
              Reach out to share stories, submit corrections, or report feedback.
            </Text>

            <CulturalInput
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <CulturalInput
              label="Email Address"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <CulturalInput
              label="Message / Story Details"
              placeholder="Write your message here..."
              multiline
              numberOfLines={5}
              value={message}
              onChangeText={setMessage}
              style={styles.messageInput}
            />

            <View style={styles.btnWrapper}>
              <AjrakButton label="Send Message" fullWidth onPress={handleSubmit} />
              <AjrakButton
                label="Back to Home"
                variant="outline"
                fullWidth
                style={styles.gap}
                onPress={() => router.push(ROUTES.home)}
              />
            </View>
          </Card>
        )}
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
  },
  formCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  formIntro: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginBottom: Spacing.md,
    fontSize: 14,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  btnWrapper: {
    marginTop: Spacing.md,
  },
  gap: {
    marginTop: Spacing.sm,
  },
  successCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: `${SagaColors.ruliGreen}08`,
    borderColor: `${SagaColors.ruliGreen}22`,
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SagaColors.ivoryWarm,
    borderWidth: 2,
    borderColor: SagaColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successEmoji: {
    fontSize: 32,
  },
  successTitle: {
    ...Typography.overline,
    color: SagaColors.ruliGreen,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  ruliSuccess: {
    width: 80,
    marginBottom: Spacing.md,
  },
  successBody: {
    ...Typography.body,
    textAlign: 'center',
    color: SagaColors.charcoal,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
});
