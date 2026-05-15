/**
 * HeritageCard.tsx
 * Rich interactive section card for culture / heritage / poetry blocks.
 */

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type HeritageCardProps = {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accentColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function HeritageCard({
  title,
  description,
  icon,
  accentColor = SagaColors.crimson,
  onPress,
  style,
}: HeritageCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed, style]}
      accessibilityRole="button">
      <LinearGradient
        colors={[SagaColors.surface, SagaColors.creamDark]}
        style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
          <MaterialIcons name={icon} size={28} color={accentColor} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={SagaColors.textMuted} />
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Spacing.cardRadius,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.985 }],
  },
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
  textBlock: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
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
