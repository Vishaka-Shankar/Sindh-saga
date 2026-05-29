/**
 * AjrakTilePattern.tsx — Repeating SVG Ajrak diamond tile (no external assets).
 * Location: components/culture/svg/
 */

import Svg, { Path, Rect } from 'react-native-svg';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/context';
import { SagaColors } from '@/constants/colors';

type AjrakTilePatternProps = {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function AjrakTilePattern({
  width = '100%',
  height = '100%',
  opacity = 0.35,
  style,
}: AjrakTilePatternProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ opacity }, style]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice">
        <Rect width="80" height="80" fill={colors.deepIndigo} />
        <Path d="M40 0 L80 40 L40 80 L0 40 Z" fill={colors.brickRed} opacity={0.9} />
        <Path d="M40 8 L72 40 L40 72 L8 40 Z" fill={colors.white} opacity={0.15} />
        <Path d="M40 16 L64 40 L40 64 L16 40 Z" fill={colors.deepIndigo} />
        <Path d="M40 24 L56 40 L40 56 L24 40 Z" fill={colors.brickRed} opacity={0.7} />
        <Rect x="36" y="36" width="8" height="8" fill={colors.gold} opacity={0.5} transform="rotate(45 40 40)" />
      </Svg>
    </View>
  );
}
