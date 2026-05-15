/**
 * app/(tabs)/_layout.tsx
 * Bottom tab bar with Ajrak-inspired crimson / indigo accents.
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SagaColors } from '@/constants/colors';
import { TAB_CONFIG } from '@/navigation/tabConfig';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: SagaColors.crimson,
        tabBarInactiveTintColor: SagaColors.textMuted,
        tabBarStyle: {
          backgroundColor: SagaColors.surface,
          borderTopColor: SagaColors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={focused ? 26 : 24} name={tab.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
