import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ensureAnonymousUser, signOut as authSignOut, subscribeToAuth } from '@/services/authService';
import { isFirebaseConfigured } from '@/firebase';

type AuthContextValue = {
  userId: string | null;
  initializing: boolean;
  error: string | null;
  isConfigured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setInitializing(false);
      setError('Add Firebase keys to .env (see .env.example).');
      return;
    }

    const unsubscribe = subscribeToAuth(async (user) => {
      if (user) {
        setUserId(user.uid);
        setError(null);
        setInitializing(false);
        return;
      }

      try {
        const anonymousUser = await ensureAnonymousUser();
        setUserId(anonymousUser.uid);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in failed.');
        setUserId(null);
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    setInitializing(true);
    try {
      await authSignOut();
      const user = await ensureAnonymousUser();
      setUserId(user.uid);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-out failed.');
    } finally {
      setInitializing(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userId,
      initializing,
      error,
      isConfigured: isFirebaseConfigured,
      signOut,
    }),
    [userId, initializing, error, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
