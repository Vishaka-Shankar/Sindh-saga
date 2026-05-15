/**
 * RecordScreen.tsx
 * Microphone UI — start/stop/timer (simulated demo, unchanged logic).
 */

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { ROUTES } from '@/navigation/routes';

type RecordState = 'idle' | 'recording' | 'stopped';

export default function RecordScreen() {
  const router = useRouter();
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
    <ScreenBackground patternVariant="warm">
      <Header
        title="Record"
        subtitle="Capture a Sindhi story in your own voice"
        dark
        compact
      />
      <View style={styles.body}>
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
          {state === 'idle' && <Button label="Start recording" onPress={handleStart} />}
          {state === 'recording' && (
            <Button label="Stop recording" variant="secondary" onPress={handleStop} />
          )}
          {state === 'stopped' && (
            <>
              <Button label="View demo story" onPress={handleViewDemo} />
              <Button
                label="Record again"
                variant="outline"
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: Spacing.screenPadding },
  micCard: { alignItems: 'center', paddingVertical: Spacing.xl, marginBottom: Spacing.lg },
  micRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: SagaColors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: `${SagaColors.crimson}08`,
  },
  micRingActive: {
    borderColor: SagaColors.indigo,
    backgroundColor: `${SagaColors.indigo}12`,
  },
  micInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SagaColors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { fontSize: 44 },
  timer: {
    fontSize: 40,
    fontWeight: '800',
    color: SagaColors.indigo,
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
    backgroundColor: `${SagaColors.indigo}08`,
    borderColor: `${SagaColors.indigo}22`,
  },
  noteTitle: {
    ...Typography.overline,
    color: SagaColors.indigo,
    marginBottom: 6,
  },
  noteText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
});
