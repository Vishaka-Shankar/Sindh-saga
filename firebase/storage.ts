import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { getFirebaseApp } from './app';

let storage: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!storage) storage = getStorage(firebaseApp);
  return storage;
}

/** Audio uploads: recordings/{userId}/{storyId}.m4a */
export function recordingStoragePath(userId: string, storyId: string): string {
  return `recordings/${userId}/${storyId}.m4a`;
}
