/**
 * MobileDrawer.tsx — Premium sliding navigation drawer for mobile viewports.
 * Location: components/culture/
 */

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SagaColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useLoading } from '@/context/LoadingContext';
import { ROUTES } from '@/navigation/routes';
import { RuliStrip } from './RuliStrip';
import { AjrakMotif } from './svg/AjrakMotif';

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78 > 300 ? 300 : SCREEN_WIDTH * 0.78;

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const { simulateAPILoad } = useLoading();
  const translateX = useSharedValue(SCREEN_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(SCREEN_WIDTH - DRAWER_WIDTH, {
        damping: 20,
        stiffness: 100,
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen, translateX, backdropOpacity]);

  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      // Workaround for pointerEvents on animated view
      display: backdropOpacity.value > 0 ? 'flex' : 'none',
    };
  });

  const handleNavigate = (route: any) => {
    onClose();
    simulateAPILoad(500);
    router.push(route);
  };

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer Container */}
      <Animated.View style={[styles.drawer, animatedDrawerStyle, { width: DRAWER_WIDTH }]}>
        {/* Header */}
        <View style={styles.header}>
          <AjrakMotif size={32} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Sindh Saba</Text>
            <Text style={styles.subtitle}>سنڌ جي ڪهاڻيون</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <RuliStrip height={4} />

        {/* Navigation links list */}
        <View style={styles.body}>
          {[
            { label: 'Home', route: ROUTES.home },
            { label: 'Explore', route: ROUTES.stories },
            { label: 'About', route: ROUTES.about },
            { label: 'Contact', route: ROUTES.contact },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
              onPress={() => handleNavigate(item.route)}
            >
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Text style={styles.linkArrow}>→</Text>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>◆ Sindh Saga Heritage ◆</Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 31, 82, 0.45)',
    zIndex: 99990,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: SagaColors.deepIndigo,
    zIndex: 99995,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 16,
    paddingTop: 54,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    ...Typography.overline,
    color: SagaColors.gold,
    fontSize: 16,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    color: SagaColors.textMutedOnDark,
    marginTop: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: SagaColors.ivory,
    fontSize: 14,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.1)',
  },
  linkPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: SagaColors.gold,
  },
  linkLabel: {
    color: SagaColors.ivory,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkArrow: {
    color: SagaColors.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: SagaColors.textMutedOnDark,
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
