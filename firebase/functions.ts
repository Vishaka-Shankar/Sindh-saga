import { getFunctions, type Functions } from 'firebase/functions';

import { getFirebaseApp } from './app';

let functions: Functions | null = null;

export function getFirebaseFunctions(): Functions | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!functions) functions = getFunctions(firebaseApp);
  return functions;
}

export const CLOUD_FUNCTIONS = {
  processStory: 'processStory',
} as const;
