/**
 * Firebase web config — use EXPO_PUBLIC_* env vars (see .env.example).
 * Install: npx expo install firebase
 */
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

/**
 * Validates Firebase configuration and returns detailed error messages
 */
export function validateFirebaseConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!firebaseConfig.apiKey) errors.push('EXPO_PUBLIC_FIREBASE_API_KEY is missing');
  if (!firebaseConfig.authDomain) errors.push('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN is missing');
  if (!firebaseConfig.projectId) errors.push('EXPO_PUBLIC_FIREBASE_PROJECT_ID is missing');
  if (!firebaseConfig.storageBucket) errors.push('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET is missing');
  if (!firebaseConfig.messagingSenderId) errors.push('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is missing');
  if (!firebaseConfig.appId) errors.push('EXPO_PUBLIC_FIREBASE_APP_ID is missing');

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Lazy initialization flag to prevent multiple Firebase app instances
let firebaseAppInitialized = false;
export function setFirebaseAppInitialized(value: boolean) {
  firebaseAppInitialized = value;
}
export function getFirebaseAppInitialized() {
  return firebaseAppInitialized;
}
