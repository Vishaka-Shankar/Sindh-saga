import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from './app';

let db: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

export const COLLECTIONS = {
  stories: 'stories',
} as const;
