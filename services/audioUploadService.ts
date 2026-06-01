/**
 * audioUploadService.ts
 *
 * Uploads recorded audio to Firebase Storage and saves metadata to Firestore.
 * Works on both web (webm) and mobile (m4a).
 *
 * Storage path: recordings/{userId}/{storyId}.webm  (web)
 *               recordings/{userId}/{storyId}.m4a   (mobile)
 */

import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';

import { getFirebaseAuth } from '@/firebase/auth';
import { getFirestoreDb } from '@/firebase/firestore';
import { getFirebaseStorage } from '@/firebase/storage';

export interface AudioUploadResult {
  audioUrl: string;
  storyId: string;
  userId: string;
  /** Firestore document ID — pass to saveTranscriptToFirestore() */
  firestoreDocId: string;
}

export async function uploadRecording(localUri: string): Promise<AudioUploadResult> {
  // ── 1. Auth check ──────────────────────────────────────────────
  const auth = getFirebaseAuth();
  const user = await new Promise<User | null>((resolve) => {
    if (!auth) { resolve(null); return; }
    const unsubscribe = auth.onAuthStateChanged((u) => {
      unsubscribe();
      resolve(u);
    });
  });
  if (!user) throw new Error('You must be signed in to save a recording.');

  const userId = user.uid;

  // ── 2. Get audio blob ──────────────────────────────────────────
  const isWeb = Platform.OS === 'web';
  const extension = isWeb ? 'webm' : 'm4a';
  const contentType = isWeb ? 'audio/webm' : 'audio/m4a';

  let blob: Blob;
  if (isWeb && localUri.startsWith('blob:')) {
    // Web: fetch the blob URL directly
    const response = await fetch(localUri);
    blob = await response.blob();
  } else {
    // Mobile: fetch the file URI
    const response = await fetch(localUri);
    if (!response.ok) throw new Error('Failed to read the recorded audio file.');
    blob = await response.blob();
  }

  // ── 3. Upload to Firebase Storage ─────────────────────────────
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not initialised.');

  const storyId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `recordings/${userId}/${storyId}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType });
  const audioUrl = await getDownloadURL(storageRef);

  // ── 4. Save metadata to Firestore ─────────────────────────────
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not initialised.');

  const docRef = await addDoc(collection(db, 'stories'), {
    userId,
    title: 'My Sindhi Story',
    audioUrl,
    storyId,
    storagePath,
    platform: isWeb ? 'web' : 'mobile',
    createdAt: serverTimestamp(),
    status: 'uploading',
    transcript: '',
    storyText: '',
    errorMessage: null,
    // Transcription fields
    transcriptLanguage: null,
    transcriptDurationSeconds: null,
    transcribedAt: null,
    // Moderation fields
    moderationStatus: 'pending_review',
    moderationNotes: null,
    piiEntities: null,
    unsafeCategories: null,
    moderationCheckedAt: null,
    // Narrative fields
    storyMoral: null,
    generatedAt: null,
    // Artwork fields
    artworkUrl: null,
    artworkPrompt: null,
    artworkGeneratedAt: null,
  });

  // Award points for story upload
  try {
    await addPoints(userId, POINT_VALUES.STORY_UPLOADED, 'Story recorded and uploaded');
  } catch (error) {
    console.error('Failed to award points for story upload:', error);
    // Don't fail the upload if points awarding fails
  }

  return { audioUrl, storyId, userId, firestoreDocId: docRef.id };
}
