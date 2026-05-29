import { SagaColors } from '@/constants/colors';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof SagaColors;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const lightColors = {
  ...SagaColors,
  background: '#FAF3E0',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5A5348',
  border: '#DDD3BC',
  ivoryWarm: '#F5ECD6',
  overlay: 'rgba(27, 42, 107, 0.72)',
  patternTint: 'rgba(27, 42, 107, 0.08)',
  patternTintWarm: 'rgba(192, 57, 43, 0.06)',
};

export const darkColors = {
  ...SagaColors,
  // Premium dark mode indigo theme
  background: '#0B0E1F',
  surface: '#14172E',
  text: '#F5F3EF',
  textMuted: '#A6A29A',
  border: '#2E3354',
  ivoryWarm: '#1E2242',
  overlay: 'rgba(11, 14, 31, 0.85)',
  patternTint: 'rgba(232, 184, 74, 0.06)', // warm gold mirror pattern tint in dark mode
  patternTintWarm: 'rgba(192, 57, 43, 0.04)',
  
  // Brightened primary and brand colors slightly for contrast in dark mode
  deepIndigo: '#2A3D8F',
  brickRed: '#D44635',
  gold: '#E8B84A',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for environments where the ThemeProvider
    // isn't mounted (prevents uncaught errors during rendering).
    // Log a warning to aid debugging in development.
    // eslint-disable-next-line no-console
    console.warn('useTheme called without a ThemeProvider — using fallback theme');
    return {
      isDark: false,
      toggleTheme: () => {},
      colors: lightColors as typeof SagaColors,
    } as ThemeContextType;
  }

  return context;
}
