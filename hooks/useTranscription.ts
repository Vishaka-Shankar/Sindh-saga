/**
 * useTranscription.ts
 *
 * Manages the full transcription lifecycle:
 *   1. Call Whisper with the Firebase audio URL
 *   2. Save the result to Firestore
 *   3. Expose loading / error / transcript state to the UI
 *
 * Usage:
 *   const { transcribe, status, transcript, error, reset } = useTranscription();
 *   await transcribe(audioUrl, firestoreDocId);
 */

import type { ModerationStatus } from '@/services/moderationService';
import {
    saveTranscriptToFirestore,
    transcribeAudio,
    TranscriptResult,
    TranscriptStatus
} from '@/services/whisperService';
import { useCallback, useState } from 'react';

export interface UseTranscriptionReturn {
  /** Current pipeline status */
  status: TranscriptStatus;
  /** The Sindhi transcript text, available when status === 'done' */
  transcript: string | null;
  /** Human-readable error message, set when status === 'error' */
  error: string | null;
  /** Detected language code returned by Whisper */
  detectedLanguage: string | null;
  /** Moderation outcome for the transcript */
  moderationStatus: ModerationStatus | null;
  moderationNotes: string[] | null;
  /** Progress message for current step */
  progressMessage: string | null;
  /**
   * Start transcription.
   * @param audioUrl       Firebase Storage download URL
   * @param firestoreDocId Firestore document ID to update with the result
   */
  transcribe: (audioUrl: string, firestoreDocId: string) => Promise<TranscriptResult | undefined>;
  /** Reset all state back to 'idle' */
  reset: () => void;
}

export function useTranscription(): UseTranscriptionReturn {
  const [status, setStatus] = useState<TranscriptStatus>('idle');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNotes, setModerationNotes] = useState<string[] | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const transcribe = useCallback(
    async (audioUrl: string, firestoreDocId: string) => {
      setError(null);
      setTranscript(null);
      setDetectedLanguage(null);
      setProgressMessage(null);

      // Progress callback to update status and message
      const onProgress: TranscriptProgressCallback = (newStatus, message) => {
        setStatus(newStatus);
        if (message) setProgressMessage(message);
      };

      try {
        // ── Phase 1: fetch audio ──────────────────────────────────────
        setStatus('fetching_audio');

        // ── Phase 2: call Whisper ─────────────────────────────────────
        setStatus('transcribing');
        const result: TranscriptResult = await transcribeAudio(audioUrl, onProgress);

        setTranscript(result.transcript);
        setDetectedLanguage(result.language);

        // ── Phase 3: persist to Firestore and record moderation metadata ──
        setStatus('saving');
        const moderation = await saveTranscriptToFirestore(firestoreDocId, result, onProgress);

        setModerationStatus(moderation.status);
        setModerationNotes(moderation.notes);
        setTranscript(moderation.scrubbedText);

        setStatus('done');
        setProgressMessage('Transcription complete');
        return {
          ...result,
          transcript: moderation.scrubbedText,
          moderationStatus: moderation.status,
        };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Transcription failed. Please try again.';
        setError(message);
        setStatus('error');
        setProgressMessage(null);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTranscript(null);
    setError(null);
    setDetectedLanguage(null);
    setModerationStatus(null);
    setModerationNotes(null);
    setProgressMessage(null);
  }, []);

  return { status, transcript, error, detectedLanguage, moderationStatus, moderationNotes, progressMessage, transcribe, reset };
}
