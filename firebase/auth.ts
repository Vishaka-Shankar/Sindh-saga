import { getAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './app';

let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}
