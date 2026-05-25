/**
 * HeritageRowCard.tsx — Horizontal heritage row (icon + text), hover on web.
 * Location: components/culture/
 */

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { isPressableHovered, useHoverable } from '@/hooks/useHoverable';

type HeritageRowCardProps = {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accentColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function HeritageRowCard({
  title,
  description,
  icon,
  accentColor = SagaColors.brickRed,
  onPress,
  style,
}: HeritageRowCardProps) {
  const { hoverEnabled } = useHoverable();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={(state) => [
        styles.wrap,
        isPressableHovered(state, hoverEnabled) && styles.hover,
        state.pressed && styles.pressed,
        style,
      ]}>
      <LinearGradient colors={[SagaColors.surface, SagaColors.ivoryWarm]} style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}20` }]}>
          <MaterialIcons name={icon} size={28} color={accentColor} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={SagaColors.deepIndigo} />
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Spacing.cardRadius,
    ...Shadows.card,
    marginBottom: Spacing.md,
  },
  hover: {
    ...Shadows.cardHover,
    transform: [{ translateY: -3 }],
    borderWidth: 2,
    borderColor: SagaColors.brickRed,
    borderRadius: Spacing.cardRadius,
  },
  pressed: { opacity: 0.94 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.cardRadius,
    borderWidth: 1,
    borderColor: SagaColors.border,
    overflow: 'hidden',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textBlock: { flex: 1, paddingRight: Spacing.sm },
  title: {
    ...Typography.h3,
    color: SagaColors.text,
    marginBottom: 4,
  },
  description: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    lineHeight: 18,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
