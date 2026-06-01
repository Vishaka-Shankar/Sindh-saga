import { useCallback, useState } from 'react';

import type { ModerationStatus } from '@/services/moderationService';
import {
    generateNarrativeFromTranscript,
    markRecordingProcessing,
    NarrativeResult,
    NarrativeStatus,
    saveNarrativeToFirestore
} from '@/services/narrativeService';

export interface UseNarrativeReturn {
  status: NarrativeStatus;
  result: NarrativeResult | null;
  error: string | null;
  moderationStatus: ModerationStatus | null;
  moderationNotes: string[] | null;
  progressMessage: string | null;
  generate: (firestoreDocId: string, transcript: string) => Promise<void>;
  reset: () => void;
}

export function useNarrative(): UseNarrativeReturn {
  const [status, setStatus] = useState<NarrativeStatus>('idle');
  const [result, setResult] = useState<NarrativeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNotes, setModerationNotes] = useState<string[] | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const generate = useCallback(async (firestoreDocId: string, transcript: string) => {
    setError(null);
    setResult(null);
    setProgressMessage(null);

    // Progress callback to update status and message
    const onProgress: NarrativeProgressCallback = (newStatus, message) => {
      setStatus(newStatus);
      if (message) setProgressMessage(message);
    };

    try {
      setStatus('generating');
      await markRecordingProcessing(firestoreDocId);

      const narrative = await generateNarrativeFromTranscript(transcript, onProgress);
      setResult(narrative);

      setStatus('saving');
      const moderation = await saveNarrativeToFirestore(firestoreDocId, narrative, onProgress);
      setModerationStatus(moderation.status);
      setModerationNotes(moderation.notes);

      setStatus('done');
      setProgressMessage('Story generated successfully');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Narrative generation failed. Please try again.';
      setError(message);
      setStatus('error');
      setProgressMessage(null);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setModerationStatus(null);
    setModerationNotes(null);
    setProgressMessage(null);
  }, []);

  return { status, result, error, moderationStatus, moderationNotes, progressMessage, generate, reset };
}
