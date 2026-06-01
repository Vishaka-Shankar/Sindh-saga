/**
 * tabConfig.ts
 * Bottom tab definitions for Expo Router (app/(tabs)/_layout.tsx).
 * Route file names must match the `name` field below.
 */

import type { ComponentProps } from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';

type IconName = ComponentProps<typeof IconSymbol>['name'];

export type TabDefinition = {
  name: 'index' | 'record' | 'story' | 'review' | 'profile';
  title: string;
  icon: IconName;
};

export const TAB_CONFIG: TabDefinition[] = [
  { name: 'index', title: 'Home', icon: 'house.fill' },
  { name: 'record', title: 'Record', icon: 'mic.fill' },
  { name: 'story', title: 'Stories', icon: 'book.fill' },
  { name: 'review', title: 'Review', icon: 'checkmark.shield.fill' },
  { name: 'profile', title: 'Profile', icon: 'person.fill' },
];
