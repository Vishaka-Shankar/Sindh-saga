/**
 * routes.ts
 * Typed route helpers for Expo Router (avoids stale generated path errors).
 */

import type { Href } from 'expo-router';

export const ROUTES = {
  home: '/' as Href,
  record: '/record' as Href,
  stories: '/story' as Href,
  profile: '/profile' as Href,
  about: '/about' as Href,
  contact: '/contact' as Href,
  submitStory: '/submit-story' as Href,
  storyDetail: (id: string) => `/story/${id}` as Href,
  culturalDetail: (id: string) => `/cultural/${id}` as Href,
} as const;

