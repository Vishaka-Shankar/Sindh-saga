import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MobileDrawer, Navbar, TopProgressBar } from '@/components/culture';
import { AppProviders, useTheme } from '@/context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark, colors } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const segments = useSegments();

  // Hide navbar on login and create-account screens
  const currentScreen = segments[0];
  const isAuthScreen = currentScreen === 'login' || currentScreen === 'create-account';

  const CurrentLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  const CurrentDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationThemeProvider value={isDark ? CurrentDarkTheme : CurrentLightTheme}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {!isAuthScreen && <TopProgressBar />}
        {!isAuthScreen && <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />}
        {!isAuthScreen && (
          <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        )}

        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="create-account" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="story/[id]" options={{ headerShown: false, title: 'Story' }} />
            <Stack.Screen name="cultural/[id]" options={{ headerShown: false, title: 'Cultural detail' }} />
            <Stack.Screen name="about" options={{ headerShown: false, title: 'About' }} />
            <Stack.Screen name="contact" options={{ headerShown: false, title: 'Contact' }} />
          </Stack>
        </View>

        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootLayoutContent />
      </AppProviders>
    </SafeAreaProvider>
  );
}
