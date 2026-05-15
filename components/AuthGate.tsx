import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { useAuth } from '@/context';
import { Colors } from '@/constants/theme';

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const { initializing, error, isConfigured } = useAuth();

  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.message}>Starting SindhSaga…</Text>
      </View>
    );
  }

  if (!isConfigured || error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Firebase setup needed</Text>
        <Text style={styles.message}>
          {error ??
            'Copy .env.example to .env and add your Firebase project keys, then restart Expo.'}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E293B',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#64748B',
    marginTop: 12,
    lineHeight: 22,
  },
});
