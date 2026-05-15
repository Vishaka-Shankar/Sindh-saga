import {
  onAuthStateChanged,
  signInAnonymously,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

import { getFirebaseAuth, isFirebaseConfigured } from '@/firebase';

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function ensureAnonymousUser(): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* values to your .env file.',
    );
  }

  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth failed to initialize.');

  if (auth.currentUser) return auth.currentUser;

  const { user } = await signInAnonymously(auth);
  return user;
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await firebaseSignOut(auth);
}
