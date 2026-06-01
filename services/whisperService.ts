/**
 * whisperService.ts
 *
 * Sends a Firebase audio URL to OpenAI Whisper for Sindhi transcription,
 * scrubs PII for COPPA 2025 compliance, then saves the resulting transcript
 * back to the Firestore recording document.
 *
 * COPPA 2025 Compliance: All transcripts are automatically scrubbed of PII
 * before storage. Original unscrubbed transcripts are never persisted.
 *
 * Modular — no UI imports, no side effects beyond Firestore writes.
 *
 * Env var required:
 *   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
 */

import { doc, updateDoc } from 'firebase/firestore';

import { getFirestoreDb } from '@/firebase/firestore';
import { saveTranscriptModeration, type ModerationStatus } from '@/services/moderationService';
import { hasPII, scrubPII } from '@/services/piiScrubService';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranscriptResult {
  transcript: string;
  language: string;
  durationSeconds: number | null;
  moderationStatus?: ModerationStatus;
  moderationNotes?: string[];
  piiEntities?: string[];
  unsafeCategories?: string[];
  piiDetected?: boolean; // COPPA 2025: Whether PII was detected before scrubbing
}

export type TranscriptStatus =
  | 'idle'
  | 'fetching_audio'
  | 'transcribing'
  | 'saving'
  | 'done'
  | 'error';

export type TranscriptProgressCallback = (status: TranscriptStatus, message?: string) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Core service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Downloads the audio from `audioUrl`, sends it to Whisper with Sindhi as the
 * hint language, and returns the transcript.
 *
 * @param audioUrl  Firebase Storage download URL
 * @param onProgress Optional callback for real-time status updates
 * @returns TranscriptResult
 * @throws  Error with a human-readable message on failure
 */
export async function transcribeAudio(
  audioUrl: string,
  onProgress?: TranscriptProgressCallback,
): Promise<TranscriptResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    const errorMessage = 'OpenAI API key is missing. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file to enable transcription.';
    onProgress?.('error', errorMessage);
    throw new Error(errorMessage);
  }

  onProgress?.('fetching_audio', 'Downloading audio from Firebase Storage...');

  // ── Step 1: Download audio from Firebase Storage ──────────────────────
  let audioBlob: Blob;
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio (HTTP ${response.status})`);
    }
    audioBlob = await response.blob();
  } catch (err) {
    onProgress?.('error', `Failed to download audio: ${err instanceof Error ? err.message : String(err)}`);
    throw new Error(
      `Could not download audio for transcription: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  onProgress?.('transcribing', 'Transcribing audio with Whisper AI...');

  // ── Step 2: Build FormData for Whisper API ────────────────────────────
  const formData = new FormData();
  // Whisper needs a filename with a supported extension
  formData.append('file', audioBlob, 'recording.m4a');
  formData.append('model', 'whisper-1');
  // 'sd' is the ISO 639-1 code for Sindhi — hints Whisper toward the right language
  formData.append('language', 'sd');
  formData.append('response_format', 'verbose_json');

  // ── Step 3: Call Whisper ───────────────────────────────────────────────
  let whisperResponse: Response;
  try {
    whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Do NOT set Content-Type — fetch sets it automatically with the boundary
      },
      body: formData,
    });
  } catch (err) {
    onProgress?.('error', `Network error: ${err instanceof Error ? err.message : String(err)}`);
    throw new Error(
      `Network error calling Whisper API: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!whisperResponse.ok) {
    let detail = '';
    try {
      const errBody = await whisperResponse.json();
      detail = errBody?.error?.message ?? '';
    } catch {
      // ignore parse error
    }
    const errorMessage = `Whisper API error (${whisperResponse.status}): ${detail || whisperResponse.statusText}`;
    onProgress?.('error', errorMessage);
    throw new Error(errorMessage);
  }

  const data = await whisperResponse.json();

  // ── COPPA 2025 Compliance: Scrub PII from transcript immediately ─────────
  const originalTranscript = data.text ?? '';
  const piiDetected = hasPII(originalTranscript);
  const scrubbedTranscript = scrubPII(originalTranscript);

  onProgress?.('done', 'Transcription complete');

  return {
    transcript: scrubbedTranscript, // Use scrubbed transcript everywhere
    language: data.language ?? 'sd',
    durationSeconds: data.duration ?? null,
    piiDetected, // Log whether PII was detected (original transcript never stored)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Firestore persistence
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Saves the transcript and moderation metadata back to Firestore.
 *
 * COPPA 2025 Compliance: Adds privacy processing metadata to document.
 *
 * @param firestoreDocId  The Firestore document ID under the 'stories' collection
 * @param result          The TranscriptResult returned by transcribeAudio()
 * @param onProgress      Optional callback for real-time status updates
 */
export async function saveTranscriptToFirestore(
  firestoreDocId: string,
  result: TranscriptResult,
  onProgress?: TranscriptProgressCallback,
) {
  onProgress?.('saving', 'Saving transcript to Firestore...');

  const moderationResult = await saveTranscriptModeration(
    firestoreDocId,
    result.transcript,
    result.language,
    result.durationSeconds,
  );

  // Add COPPA 2025 compliance metadata to document
  const db = getFirestoreDb();
  if (db) {
    try {
      await updateDoc(doc(db, 'stories', firestoreDocId), {
        privacyProcessed: true,
        privacyProcessedAt: new Date().toISOString(),
        piiDetected: result.piiDetected ?? false,
      });
    } catch (error) {
      console.error('Failed to add privacy metadata:', error);
      // Don't fail the save if privacy metadata update fails
    }
  }

  onProgress?.('done', 'Transcript saved successfully');
  return moderationResult;
}
