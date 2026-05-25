import type { ReactNode } from 'react';

import { AuthProvider } from './AuthContext';
import { ScrollProvider } from './ScrollContext';
import { LoadingProvider } from './LoadingContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ScrollProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </ScrollProvider>
    </AuthProvider>
  );
}

