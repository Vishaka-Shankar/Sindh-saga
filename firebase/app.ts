import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { firebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}
