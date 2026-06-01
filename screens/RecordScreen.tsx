/**
 * RecordScreen.tsx
 *
 * Voice recording screen for SindhSaga.
 * Flow:
 *   1. Record audio  →  expo-av
 *   2. Upload        →  Firebase Storage + Firestore
 *   3. Transcribe    →  OpenAI Whisper (Sindhi)
 *   4. Display       →  transcript card in-screen
 *
 * Only this screen changed — no other UI components were modified.
 */

import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
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

import { useArtwork } from '@/hooks/useArtwork';
import { useNarrative } from '@/hooks/useNarrative';
import { useTranscription } from '@/hooks/useTranscription';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { AudioUploadResult, uploadRecording } from '@/services/audioUploadService';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function transcriptionStatusLabel(status: string): string {
  switch (status) {
    case 'fetching_audio': return 'Downloading audio…';
    case 'transcribing':   return 'Transcribing with Whisper AI…';
    case 'saving':         return 'Saving transcript…';
    default:               return 'Processing…';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function RecordScreen() {
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();

  // ── Recording hook ──────────────────────────────────────────────────────
  const {
    recordingState,
    durationMs,
    isPlaying,
    audioUri,
    errorMessage,
    startRecording,
    stopRecording,
    playback,
    stopPlayback,
    reset: resetRecorder,
  } = useVoiceRecorder();

  // ── Transcription hook ──────────────────────────────────────────────────
  const {
    status: transcriptStatus,
    transcript,
    error: transcriptError,
    detectedLanguage,
    moderationStatus,
    moderationNotes,
    progressMessage: transcriptProgress,
    transcribe,
    reset: resetTranscription,
  } = useTranscription();

  const {
    status: narrativeStatus,
    result: narrativeResult,
    moderationStatus: narrativeModerationStatus,
    moderationNotes: narrativeModerationNotes,
    error: narrativeError,
    progressMessage: narrativeProgress,
    generate: generateNarrative,
    reset: resetNarrative,
  } = useNarrative();

  const {
    status: artworkStatus,
    artworkUrl,
    artworkPrompt,
    error: artworkError,
    progressMessage: artworkProgress,
    generate: generateArtwork,
    reset: resetArtwork,
  } = useArtwork();

  // ── Local state ─────────────────────────────────────────────────────────
  const [uploadError, setUploadError]         = useState<string | null>(null);
  const [isUploading, setIsUploading]         = useState(false);
  const [uploadResult, setUploadResult]       = useState<AudioUploadResult | null>(null);

  // ── Full reset ──────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    resetRecorder();
    resetTranscription();
    resetNarrative();
    resetArtwork();
    setUploadError(null);
    setIsUploading(false);
    setUploadResult(null);
  }, [resetRecorder, resetTranscription, resetNarrative, resetArtwork]);

  // ── Upload → then auto-transcribe ───────────────────────────────────────
  const handleSaveAndTranscribe = useCallback(async () => {
    if (!audioUri) return;
    setUploadError(null);
    resetNarrative();
    setIsUploading(true);

    try {
      if (isPlaying) await stopPlayback();

      // 1. Upload audio to Firebase
      const result = await uploadRecording(audioUri);
      setUploadResult(result);
      setIsUploading(false);

      // 2. Immediately kick off Whisper transcription
      const transcriptResult = await transcribe(result.audioUrl, result.firestoreDocId);
      if (transcriptResult?.transcript && transcriptResult.moderationStatus !== 'flagged') {
        await generateNarrative(result.firestoreDocId, transcriptResult.transcript);
      }
    } catch (err: unknown) {
      setIsUploading(false);
      const message =
        err instanceof Error
          ? err.message
          : 'Upload failed. Please check your connection.';
      setUploadError(message);
    }
  }, [audioUri, isPlaying, stopPlayback, transcribe, generateNarrative, resetNarrative]);

  const handleGenerateArtwork = useCallback(async () => {
    if (!uploadResult || !narrativeResult) return;
    setUploadError(null);
    await generateArtwork(
      uploadResult.firestoreDocId,
      uploadResult.storyId,
      narrativeResult.title,
      narrativeResult.storyText,
    );
  }, [uploadResult, narrativeResult, generateArtwork]);

  // ── Retry transcription only (if upload succeeded but transcription failed)
  const handleRetryTranscription = useCallback(async () => {
    if (!uploadResult) return;
    resetTranscription();
    await transcribe(uploadResult.audioUrl, uploadResult.firestoreDocId);
  }, [uploadResult, transcribe, resetTranscription]);

  // ── Derived UI flags ────────────────────────────────────────────────────
  const isTranscribing = ['fetching_audio', 'transcribing', 'saving'].includes(transcriptStatus);
  const isGenerating = ['generating', 'saving'].includes(narrativeStatus);
  const isArtworkGenerating = artworkStatus === 'generating';
  const showTranscriptCard = transcriptStatus === 'done' && transcript;
  const showTranscriptSafety = transcriptStatus === 'done' && moderationStatus;
  const showNarrativeCard = narrativeStatus === 'done' && narrativeResult;
  const showArtworkCard = artworkStatus === 'done' && artworkUrl;
  const showNarrativeStatus = narrativeStatus === 'done' && narrativeModerationStatus;
  const showTranscriptError = transcriptStatus === 'error' && transcriptError;
  const showNarrativeError = narrativeStatus === 'error' && narrativeError;
  const showArtworkError = artworkStatus === 'error' && artworkError;

  // ── Mic ring style ──────────────────────────────────────────────────────
  const micRingStyle = [
    styles.micRing,
    recordingState === 'recording' && styles.micRingActive,
    recordingState === 'stopped'   && styles.micRingStopped,
  ];

  const statusText = (): string => {
    switch (recordingState) {
      case 'idle':      return 'تیار — کہانی شروع کریں\nReady — tap Start to begin';
      case 'recording': return '🔴 Recording your Sindhi story…';
      case 'stopped':   return '✅ Recording saved — listen or upload';
      case 'error':     return errorMessage ?? 'Something went wrong.';
      default:          return '';
    }
  };

  const micEmoji = (): string => {
    if (recordingState === 'recording') return '⏺️';
    if (recordingState === 'stopped')   return '✅';
    return '🎙️';
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PatternContainer patternOpacity={0.1}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
      >
        <CulturalHeader
          title="Record"
          subtitle="Capture a Sindhi story in your own voice"
          variant="dark"
          compact
        />

        <View style={styles.body}>
          <DecorativeDivider label="Voice of Sindh" />

          {/* ── Mic card ───────────────────────────────────────────── */}
          <Card style={styles.micCard}>
            <View style={micRingStyle}>
              <View style={styles.micInner}>
                <Text style={styles.micIcon}>{micEmoji()}</Text>
              </View>
            </View>

            <Text style={styles.timer}>{formatMs(durationMs)}</Text>
            <Text style={styles.status}>{statusText()}</Text>

            {/* Recording error */}
            {(errorMessage || uploadError) && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️ {errorMessage ?? uploadError}</Text>
              </View>
            )}
          </Card>

          {/* ── Controls ───────────────────────────────────────────── */}
          <View style={styles.controls}>
            {recordingState === 'idle' && (
              <AjrakButton
                label="🎙️  Start Recording"
                fullWidth
                onPress={startRecording}
              />
            )}

            {recordingState === 'recording' && (
              <AjrakButton
                label="⏹  Stop Recording"
                variant="secondary"
                fullWidth
                onPress={stopRecording}
              />
            )}

            {recordingState === 'stopped' && !isUploading && !isTranscribing && transcriptStatus !== 'done' && (
              <>
                {/* Playback */}
                <AjrakButton
                  label={isPlaying ? '⏸  Stop Playback' : '▶️  Play Recording'}
                  variant="outline"
                  fullWidth
                  onPress={isPlaying ? stopPlayback : playback}
                />

                {/* Save + Transcribe */}
                <AjrakButton
                  label="✨  Save & Transcribe"
                  fullWidth
                  onPress={handleSaveAndTranscribe}
                  style={styles.gap}
                />

                {/* Record again */}
                <AjrakButton
                  label="🔄  Record Again"
                  variant="outline"
                  fullWidth
                  onPress={handleReset}
                  style={styles.gap}
                />
              </>
            )}

            {recordingState === 'error' && (
              <AjrakButton
                label="Try Again"
                variant="secondary"
                fullWidth
                onPress={handleReset}
              />
            )}
          </View>

          {/* ── Upload loading ─────────────────────────────────────── */}
          {isUploading && (
            <Card style={styles.loadingCard}>
              <ActivityIndicator size="large" color={SagaColors.brickRed} />
              <Text style={styles.loadingText}>Uploading your story…</Text>
            </Card>
          )}

          {/* ── Transcription loading ──────────────────────────────── */}
          {isTranscribing && (
            <Card style={styles.loadingCard}>
              <ActivityIndicator size="large" color={SagaColors.deepIndigo} />
              <Text style={styles.loadingText}>
                {transcriptProgress || transcriptionStatusLabel(transcriptStatus)}
              </Text>
              <Text style={styles.loadingSubtext}>
                Whisper AI is reading your Sindhi recording
              </Text>
            </Card>
          )}

          {/* ── Transcript card ────────────────────────────────────── */}
          {showTranscriptCard && (
            <Card style={styles.transcriptCard}>
              <View style={styles.transcriptHeader}>
                <Text style={styles.transcriptTitle}>📝 Transcript</Text>
                {detectedLanguage && (
                  <View style={styles.langBadge}>
                    <Text style={styles.langBadgeText}>
                      {detectedLanguage.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.transcriptDivider} />

              <Text style={styles.transcriptText}>{transcript}</Text>

              <View style={styles.transcriptActions}>
                <AjrakButton
                  label="🔄  Record Another"
                  variant="outline"
                  fullWidth
                  onPress={handleReset}
                />
              </View>
            </Card>
          )}

          {/* ── Safety review card ─────────────────────────────────── */}
          {showTranscriptSafety && (
            <Card style={styles.safetyCard}>
              <Text style={styles.safetyTitle}>🛡️ Safety review</Text>
              <Text style={styles.safetyText}>
                {moderationStatus === 'safe'
                  ? 'This transcript passed the safety check.'
                  : moderationStatus === 'pending_review'
                  ? 'Personal data was found and redacted. The story may still be reviewed for child safety.'
                  : 'The transcript has been flagged and requires review. The story will not continue automatically.'}
              </Text>
              {moderationNotes?.length ? (
                <Text style={styles.safetyNote}>{moderationNotes.join(' ')}</Text>
              ) : null}
            </Card>
          )}

          {/* ── Transcription error ────────────────────────────────── */}
          {showTranscriptError && (
            <Card style={styles.errorCard}>
              <Text style={styles.errorCardTitle}>⚠️ Transcription Failed</Text>
              <Text style={styles.errorCardText}>{transcriptError}</Text>
              <AjrakButton
                label="Retry Transcription"
                variant="secondary"
                fullWidth
                onPress={handleRetryTranscription}
                style={styles.gap}
              />
              <AjrakButton
                label="Start Over"
                variant="outline"
                fullWidth
                onPress={handleReset}
                style={styles.gap}
              />
            </Card>
          )}

          {/* ── Narrative generation loading ─────────────────────────── */}
          {isGenerating && (
            <Card style={styles.loadingCard}>
              <ActivityIndicator size="large" color={SagaColors.brickRed} />
              <Text style={styles.loadingText}>
                {narrativeProgress || 'Polishing your story with GPT-4o…'}
              </Text>
              <Text style={styles.loadingSubtext}>
                The narrative agent is creating a polished title, story, and moral.
              </Text>
            </Card>
          )}

          {/* ── Narrative result card ───────────────────────────────── */}
          {showNarrativeCard && (
            <Card style={styles.storyCard}>
              <Text style={styles.storyTitle}>{narrativeResult.title}</Text>
              <Text style={styles.storyLabel}>Child-friendly story</Text>
              <Text style={styles.storyText}>{narrativeResult.storyText}</Text>
              {narrativeResult.moral ? (
                <View style={styles.moralSection}>
                  <Text style={styles.moralLabel}>Moral</Text>
                  <Text style={styles.moralText}>{narrativeResult.moral}</Text>
                </View>
              ) : null}

              {showArtworkCard ? (
                <View style={styles.artworkPreview}>
                  <Text style={styles.artworkLabel}>Illustrated artwork</Text>
                  <Image source={{ uri: artworkUrl }} style={styles.artworkImage} resizeMode="cover" />
                  {artworkPrompt ? <Text style={styles.artworkPrompt}>{artworkPrompt}</Text> : null}
                </View>
              ) : (
                <AjrakButton
                  label={isArtworkGenerating ? (artworkProgress || 'Generating Artwork…') : '🎨 Create Story Artwork'}
                  fullWidth
                  disabled={isArtworkGenerating}
                  onPress={handleGenerateArtwork}
                  style={styles.gap}
                />
              )}

              {showArtworkError && (
                <Text style={styles.errorText}>⚠️ {artworkError}</Text>
              )}
            </Card>
          )}

          {showNarrativeStatus && (
            <Card style={styles.safetyCard}>
              <Text style={styles.safetyTitle}>🛡️ Story safety</Text>
              <Text style={styles.safetyText}>
                {narrativeModerationStatus === 'safe'
                  ? 'The AI story passed the moderator check.'
                  : narrativeModerationStatus === 'pending_review'
                  ? 'The story contains redacted content and will be reviewed by a moderator.'
                  : 'The story has been flagged and requires review before it can be shared.'}
              </Text>
              {narrativeModerationNotes?.length ? (
                <Text style={styles.safetyNote}>{narrativeModerationNotes.join(' ')}</Text>
              ) : null}
            </Card>
          )}

          {showNarrativeError && (
            <Card style={styles.errorCard}>
              <Text style={styles.errorCardTitle}>⚠️ Story polish failed</Text>
              <Text style={styles.errorCardText}>{narrativeError}</Text>
              <AjrakButton
                label="Retry Story Generation"
                variant="secondary"
                fullWidth
                onPress={async () => {
                  if (!uploadResult || !transcript) return;
                  resetNarrative();
                  await generateNarrative(uploadResult.firestoreDocId, transcript);
                }}
                style={styles.gap}
              />
            </Card>
          )}

          {/* ── Info card (hidden once transcription starts) ───────── */}
          {transcriptStatus === 'idle' && !isUploading && (
            <Card style={styles.note}>
              <Text style={styles.noteTitle}>How it works</Text>
              <Text style={styles.noteText}>
                Record in Sindhi → tap{' '}
                <Text style={styles.noteHighlight}>Save & Transcribe</Text> →
                Whisper AI converts your voice to text → saved to your story archive.
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </PatternContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  body: { flex: 1 },

  // Mic card
  micCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
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
  micRingStopped: {
    borderColor: SagaColors.ruliGreen,
    backgroundColor: `${SagaColors.ruliGreen}12`,
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
    lineHeight: 20,
  },

  // Controls
  controls: { marginBottom: Spacing.lg, gap: Spacing.sm },
  gap: { marginTop: Spacing.md },

  // Error banner (inside mic card)
  errorBanner: {
    marginTop: Spacing.md,
    backgroundColor: `${SagaColors.brickRed}14`,
    borderRadius: Spacing.cardRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: `${SagaColors.brickRed}44`,
  },
  errorText: {
    ...Typography.caption,
    color: SagaColors.brickRed,
    textAlign: 'center',
  },

  // Loading card
  loadingCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: `${SagaColors.deepIndigo}06`,
    borderColor: `${SagaColors.deepIndigo}20`,
  },
  loadingText: {
    ...Typography.subtitle,
    color: SagaColors.deepIndigo,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  // Transcript card
  transcriptCard: {
    marginBottom: Spacing.lg,
    backgroundColor: `${SagaColors.ruliGreen}06`,
    borderColor: `${SagaColors.ruliGreen}30`,
    paddingVertical: Spacing.lg,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  transcriptTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
  },
  langBadge: {
    backgroundColor: SagaColors.gold,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  langBadgeText: {
    ...Typography.overline,
    color: SagaColors.white,
    fontSize: 10,
  },
  transcriptDivider: {
    height: 1,
    backgroundColor: `${SagaColors.ruliGreen}30`,
    marginBottom: Spacing.md,
  },
  transcriptText: {
    ...Typography.body,
    color: SagaColors.text,
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: Spacing.lg,
  },
  transcriptActions: {
    marginTop: Spacing.sm,
  },

  storyCard: {
    marginBottom: Spacing.lg,
    backgroundColor: `${SagaColors.gold}08`,
    borderColor: `${SagaColors.gold}30`,
    paddingVertical: Spacing.lg,
  },
  storyTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.xs,
  },
  storyLabel: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
  },
  storyText: {
    ...Typography.body,
    color: SagaColors.text,
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  safetyCard: {
    marginBottom: Spacing.lg,
    backgroundColor: `${SagaColors.deepIndigo}06`,
    borderColor: `${SagaColors.deepIndigo}20`,
    paddingVertical: Spacing.lg,
  },
  safetyTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  safetyText: {
    ...Typography.body,
    color: SagaColors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  safetyNote: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
  moralSection: {
    borderTopWidth: 1,
    borderTopColor: `${SagaColors.gold}20`,
    paddingTop: Spacing.sm,
  },
  moralLabel: {
    ...Typography.overline,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.xs,
  },
  moralText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    lineHeight: 24,
  },

  artworkPreview: {
    marginTop: Spacing.lg,
  },
  artworkLabel: {
    ...Typography.overline,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
  artworkImage: {
    width: '100%',
    height: 220,
    borderRadius: Spacing.cardRadius,
    marginTop: Spacing.sm,
    backgroundColor: SagaColors.border,
  },
  artworkPrompt: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },

  // Error card (transcription)
  errorCard: {
    marginBottom: Spacing.lg,
    backgroundColor: `${SagaColors.brickRed}06`,
    borderColor: `${SagaColors.brickRed}30`,
    paddingVertical: Spacing.lg,
  },
  errorCardTitle: {
    ...Typography.h3,
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorCardText: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  // Info note
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
  noteHighlight: {
    color: SagaColors.brickRed,
    fontWeight: '600',
  },
});
