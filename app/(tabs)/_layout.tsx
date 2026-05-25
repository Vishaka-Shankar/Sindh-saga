/**
 * app/(tabs)/_layout.tsx — Bottom tab bar (navbar) with Sindh Saga theme.
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SagaColors } from '@/constants/colors';
import { TAB_CONFIG } from '@/navigation/tabConfig';

export default function TabLayout() {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: SagaColors.brickRed,
        tabBarInactiveTintColor: SagaColors.textMuted,
        tabBarStyle: [styles.tabBar, isDesktop && { display: 'none' }],
        tabBarLabelStyle: styles.tabLabel,
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: SagaColors.ivory,
    borderTopWidth: 0,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 88 : 64,
    ...Platform.select({
      ios: {
        shadowColor: SagaColors.deepIndigo,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
      default: {},
    }),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
});
