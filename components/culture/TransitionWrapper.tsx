/**
 * TransitionWrapper.tsx — High-fidelity fade-and-slide route transitions.
 * Location: components/culture/
 */

import React from 'react';
import Animated, { Easing, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type TransitionWrapperProps = {
  children: React.ReactNode;
};

export function TransitionWrapper({ children }: TransitionWrapperProps) {
  return (
    <Animated.View
      entering={FadeInRight.duration(300).easing(Easing.inOut(Easing.ease))}
      exiting={FadeOutLeft.duration(300).easing(Easing.inOut(Easing.ease))}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}
