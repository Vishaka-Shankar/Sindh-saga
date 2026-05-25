/**
 * useHoverable.ts
 * Enables hover-driven UI on web only; touch devices use press states.
 */

import { Platform, type PressableStateCallbackType } from 'react-native';

export type PressableStyleState = PressableStateCallbackType & {
  hovered?: boolean;
};

export function useHoverable(): { hoverEnabled: boolean } {
  return { hoverEnabled: Platform.OS === 'web' };
}

export function isPressableHovered(
  state: PressableStateCallbackType,
  hoverEnabled: boolean
): boolean {
  return hoverEnabled && Boolean((state as PressableStyleState).hovered);
}
