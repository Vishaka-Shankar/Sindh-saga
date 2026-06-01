import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    type DocumentData,
    type Unsubscribe,
} from 'firebase/firestore';

import { COLLECTIONS, getFirestoreDb } from '@/firebase';
import type { CreateStoryInput, Story, StoryStatus } from '@/types';

function mapStoryDoc(id: string, data: DocumentData): Story {
  return {
    id,
    userId: data.userId ?? '',
    title: data.title ?? 'Untitled Story',
    audioUrl: data.audioUrl ?? '',
    transcript: data.transcript ?? '',
    storyText: data.storyText ?? '',
    artworkUrl: data.artworkUrl ?? undefined,
    status: (data.status as StoryStatus) ?? 'uploading',
    errorMessage: data.errorMessage,
    createdAt: data.createdAt,
  };
}

export async function createStory(input: CreateStoryInput): Promise<string> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not available.');

  const ref = await addDoc(collection(db, COLLECTIONS.stories), {
    userId: input.userId,
    title: input.title ?? 'My Sindhi Story',
    audioUrl: '',
    transcript: '',
    storyText: '',
    status: 'uploading',
    errorMessage: null,
    createdAt: serverTimestamp(),
    // Additional fields for the unified model
    storyId: null,
    storagePath: null,
    platform: null,
    transcriptLanguage: null,
    transcriptDurationSeconds: null,
    transcribedAt: null,
    moderationStatus: 'pending_review',
    moderationNotes: null,
    piiEntities: null,
    unsafeCategories: null,
    moderationCheckedAt: null,
    storyMoral: null,
    generatedAt: null,
    artworkUrl: null,
    artworkPrompt: null,
    artworkGeneratedAt: null,
  });

  return ref.id;
}

export async function updateStory(
  storyId: string,
  data: Partial<
    Pick<Story, 'title' | 'audioUrl' | 'transcript' | 'storyText' | 'status' | 'errorMessage'>
  >,
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not available.');

  await updateDoc(doc(db, COLLECTIONS.stories, storyId), data);
}

export async function getStory(storyId: string): Promise<Story | null> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not available.');

  const snap = await getDoc(doc(db, COLLECTIONS.stories, storyId));
  if (!snap.exists()) return null;
  return mapStoryDoc(snap.id, snap.data());
}

export function subscribeToStory(
  storyId: string,
  onChange: (story: Story | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const db = getFirestoreDb();
  if (!db) {
    onChange(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, COLLECTIONS.stories, storyId),
    (snap) => {
      onChange(snap.exists() ? mapStoryDoc(snap.id, snap.data()) : null);
    },
    (err) => onError?.(err),
  );
}

export function subscribeToUserStories(
  userId: string,
  onChange: (stories: Story[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const db = getFirestoreDb();
  if (!db) {
    onChange([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.stories),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => mapStoryDoc(d.id, d.data())));
    },
    (err) => onError?.(err),
  );
}
