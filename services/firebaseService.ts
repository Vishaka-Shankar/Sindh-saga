import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
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

import { firebaseConfig, isFirebaseConfigured } from '../firebase/config';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

export function getFirestoreDb(): Firestore | null {
  if (!firestoreDb) {
    const app = getFirebaseApp();
    if (!app) return null;
    firestoreDb = getFirestore(app);
  }
  return firestoreDb;
}

export function getFirestoreCollection<T = Record<string, unknown>>(collectionName: string): CollectionReference<T> | null {
  const db = getFirestoreDb();
  if (!db) return null;
  return collection(db, collectionName) as CollectionReference<T>;
}

export function getFirestoreDocument<T = Record<string, unknown>>(collectionName: string, id: string): DocumentReference<T> | null {
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

  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...(snapshotDoc.data() as T) }));
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
