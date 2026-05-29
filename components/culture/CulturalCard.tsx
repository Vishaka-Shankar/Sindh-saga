/**
 * CulturalCard.tsx — Interactive heritage card with hover lift, zoom, overlay.
 * Location: components/culture/
 */

import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/context';
import { SindhiBadge } from './SindhiBadge';
import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { isPressableHovered, useHoverable } from '@/hooks/useHoverable';

type CulturalCardProps = {
  title: string;
  description?: string;
  badge?: string;
  imageTint?: 'indigo' | 'brick' | 'gold';
  showLearnMore?: boolean;
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const TINT_GRADIENT: Record<string, [string, string]> = {
  indigo: [SagaColors.deepIndigo, SagaColors.indigoLight],
  brick: [SagaColors.brickRed, SagaColors.brickLight],
  gold: [SagaColors.gold, SagaColors.goldLight],
};

function CardInner({
  title,
  description,
  badge,
  imageTint,
  showLearnMore,
  children,
  hovered,
}: {
  title: string;
  description?: string;
  badge?: string;
  imageTint: 'indigo' | 'brick' | 'gold';
  showLearnMore: boolean;
  children?: ReactNode;
  hovered: boolean;
}) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.imageWrap}>
        <LinearGradient
          colors={TINT_GRADIENT[imageTint]}
          style={[styles.imagePlaceholder, hovered && styles.imageZoom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {showLearnMore && hovered ? (
          <View style={styles.learnMoreWrap}>
            <Text style={styles.learnMore}>Learn More →</Text>
          </View>
        ) : null}
        {hovered ? <View style={styles.creamOverlay} pointerEvents="none" /> : null}
      </View>
      <View style={styles.body}>
        {badge ? <SindhiBadge label={badge} variant="gold" style={styles.badge} /> : null}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={3}>
            {description}
          </Text>
        ) : null}
        {children}
      </View>
      <View style={[styles.ajrakEdge, { backgroundColor: colors.deepIndigo }]} />
    </>
  );
}

export function CulturalCard({
  title,
  description,
  badge,
  imageTint = 'indigo',
  showLearnMore = true,
  children,
  onPress,
  style,
}: CulturalCardProps) {
  const { hoverEnabled } = useHoverable();
  const { colors } = useTheme();

  if (!onPress) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
        <CardInner
          title={title}
          description={description}
          badge={badge}
          imageTint={imageTint}
          showLearnMore={showLearnMore}
          hovered={false}>
          {children}
        </CardInner>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={(state) => {
        const { pressed } = state;
        const isHovered = isPressableHovered(state, hoverEnabled);
        const active = pressed || isHovered;
        return [
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          active && !pressed && isHovered && [styles.cardHover, { borderColor: colors.brickRed }],
          pressed && styles.cardActive,
          style,
        ];
      }}>
      {(state) => (
        <CardInner
          title={title}
          description={description}
          badge={badge}
          imageTint={imageTint}
          showLearnMore={showLearnMore}
          hovered={isPressableHovered(state, hoverEnabled) && !state.pressed}>
          {children}
        </CardInner>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SagaColors.surface,
    borderRadius: Spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SagaColors.border,
    ...Shadows.card,
  },
  cardHover: {
    ...Shadows.cardHover,
    transform: [{ translateY: -6 }],
    borderColor: SagaColors.brickRed,
    borderWidth: 2,
  },
  cardActive: {
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    height: 120,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
  },
  imageZoom: {
    transform: [{ scale: 1.06 }],
  },
  creamOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 243, 224, 0.25)',
  },
  learnMoreWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SagaColors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  body: {
    padding: Spacing.md,
  },
  badge: { marginBottom: Spacing.sm },
  title: {
    ...Typography.h3,
    color: SagaColors.text,
    marginBottom: 6,
  },
  description: {
    ...Typography.body,
    fontSize: 14,
    color: SagaColors.textMuted,
    lineHeight: 21,
  },
  learnMore: {
    color: SagaColors.ivory,
    fontWeight: '700',
    fontSize: 15,
  },
  ajrakEdge: {
    height: 3,
    backgroundColor: SagaColors.deepIndigo,
  },
});
