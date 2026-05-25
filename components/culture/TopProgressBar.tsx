/**
 * TopProgressBar.tsx — Gold NProgress-style top loading progress bar.
 * Location: components/culture/
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { useLoading } from '@/context/LoadingContext';

export function TopProgressBar() {
  const { progress } = useLoading();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (progress > 0) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: progress,
          duration: progress === 1 ? 150 : 600,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        widthAnim.setValue(0);
      });
    }
  }, [progress]);

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.bar, { width: widthPercent }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3.5,
    zIndex: 99999,
    backgroundColor: 'transparent',
  },
  bar: {
    height: '100%',
    backgroundColor: SagaColors.gold,
    shadowColor: SagaColors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.65,
    shadowRadius: 3,
    elevation: 4,
  },
});
