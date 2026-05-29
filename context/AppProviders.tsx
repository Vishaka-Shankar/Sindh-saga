import type { ReactNode } from 'react';

import { AuthProvider } from './AuthContext';
import { ScrollProvider } from './ScrollContext';
import { LoadingProvider } from './LoadingContext';
import { ThemeProvider } from './ThemeContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ScrollProvider>
        <LoadingProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LoadingProvider>
      </ScrollProvider>
    </AuthProvider>
  );
}

