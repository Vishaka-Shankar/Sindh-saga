import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    type CollectionReference,
    type DocumentReference,
    type Firestore,
    type QueryConstraint,
} from 'firebase/firestore';

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
  culturalItems: 'culturalItems',
} as const;

// Helper functions for Firestore operations
export function getFirestoreCollection<T = Record<string, unknown>>(
  collectionName: string
): CollectionReference<T> | null {
  const db = getFirestoreDb();
  if (!db) return null;
  return collection(db, collectionName) as CollectionReference<T>;
}

export function getFirestoreDocument<T = Record<string, unknown>>(
  collectionName: string,
  id: string
): DocumentReference<T> | null {
  const db = getFirestoreDb();
  if (!db) return null;
  return doc(db, collectionName, id) as DocumentReference<T>;
}

export async function fetchCollectionDocuments<T = Record<string, unknown>>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<Array<T & { id: string }>> {
  const collectionRef = getFirestoreCollection<T>(collectionName);
  if (!collectionRef) return [];

  const queryRef = constraints.length ? query(collectionRef, ...constraints) : query(collectionRef);
  const snapshot = await getDocs(queryRef);

  return snapshot.docs.map((snapshotDoc) => ({
    id: snapshotDoc.id,
    ...(snapshotDoc.data() as T),
  }));
}

export async function fetchDocumentById<T = Record<string, unknown>>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const documentRef = getFirestoreDocument<T>(collectionName, id);
  if (!documentRef) return null;

  const snapshot = await getDoc(documentRef);
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...(snapshot.data() as T) };
}
