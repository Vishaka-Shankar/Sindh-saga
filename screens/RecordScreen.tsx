import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import {
  AjrakButton,
  CulturalHeader,
  DecorativeDivider,
  PatternContainer,
} from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { ROUTES } from '@/navigation/routes';

type RecordState = 'idle' | 'recording' | 'stopped';

export default function RecordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const [state, setState] = useState<RecordState>('idle');
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'recording') {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => {
    setSeconds(0);
    setState('recording');
  };
  const handleStop = () => setState('stopped');
  const handleReset = () => {
    setSeconds(0);
    setState('idle');
  };
  const handleViewDemo = () => router.push(ROUTES.storyDetail('1'));

  return (
    <PatternContainer patternOpacity={0.1}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title="Record"
          subtitle="Capture a Sindhi story in your own voice"
          variant="dark"
          compact
        />
        <View style={styles.body}>
          <DecorativeDivider label="Voice of Sindh" />
          <Card style={styles.micCard}>
            <View style={[styles.micRing, state === 'recording' && styles.micRingActive]}>
              <View style={styles.micInner}>
                <Text style={styles.micIcon}>🎙️</Text>
              </View>
            </View>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <Text style={styles.status}>
              {state === 'idle' && 'Ready when you are — tap Start'}
              {state === 'recording' && 'Recording your story…'}
              {state === 'stopped' && 'Saved locally (demo mode)'}
            </Text>
          </Card>

          <View style={styles.controls}>
            {state === 'idle' && <AjrakButton label="Start recording" fullWidth onPress={handleStart} />}
            {state === 'recording' && (
              <AjrakButton label="Stop recording" variant="secondary" fullWidth onPress={handleStop} />
            )}
            {state === 'stopped' && (
              <>
                <AjrakButton label="View demo story" fullWidth onPress={handleViewDemo} />
                <AjrakButton
                  label="Record again"
                  variant="outline"
                  fullWidth
                  onPress={handleReset}
                  style={styles.gap}
                />
              </>
            )}
          </View>

          <Card style={styles.note}>
            <Text style={styles.noteTitle}>Coming next</Text>
            <Text style={styles.noteText}>
              Whisper transcription and GPT story generation will connect here in the next phase.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  body: { flex: 1 },
  micCard: { alignItems: 'center', paddingVertical: Spacing.xl, marginBottom: Spacing.lg },
  micRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: SagaColors.brickRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: `${SagaColors.brickRed}10`,
  },
  micRingActive: {
    borderColor: SagaColors.deepIndigo,
    backgroundColor: `${SagaColors.deepIndigo}14`,
  },
  micInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SagaColors.ivoryWarm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: SagaColors.gold,
  },
  micIcon: { fontSize: 44 },
  timer: {
    fontSize: 40,
    fontWeight: '800',
    color: SagaColors.deepIndigo,
    fontVariant: ['tabular-nums'],
  },
  status: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  controls: { marginBottom: Spacing.lg },
  gap: { marginTop: Spacing.md },
  note: {
    backgroundColor: `${SagaColors.deepIndigo}08`,
    borderColor: `${SagaColors.deepIndigo}22`,
  },
  noteTitle: {
    ...Typography.overline,
    color: SagaColors.deepIndigo,
    marginBottom: 6,
  },
  noteText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
});
