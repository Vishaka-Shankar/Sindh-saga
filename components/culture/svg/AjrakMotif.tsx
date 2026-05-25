/**
 * AjrakMotif.tsx — Premium traditional Sindhi block-print star motif SVG.
 * Location: components/culture/svg/
 */

import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';

type AjrakMotifProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function AjrakMotif({ size = 28, style }: AjrakMotifProps) {
  return (
    <View style={[{ width: size, height: size }, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 32 32">
        {/* Outer diamond frame */}
        <Path
          d="M16 1 L31 16 L16 31 L1 16 Z"
          fill="none"
          stroke={SagaColors.gold}
          strokeWidth={1.5}
        />
        {/* Inner background fill */}
        <Path d="M16 4 L28 16 L16 28 L4 16 Z" fill={SagaColors.brickRed} />

        {/* Outer 8-pointed star (gold) */}
        <Polygon
          points="16,6 19,13 26,16 19,19 16,26 13,19 6,16 13,13"
          fill={SagaColors.gold}
        />

        {/* Inner 8-pointed star overlay (Indigo) */}
        <Polygon
          points="16,9 18,14 23,16 18,18 16,23 14,18 9,16 14,14"
          fill={SagaColors.deepIndigo}
        />

        {/* Ivory center element */}
        <Circle cx="16" cy="16" r="3.5" fill={SagaColors.ivory} />
        {/* Crimson core center */}
        <Circle cx="16" cy="16" r="1.5" fill={SagaColors.brickRed} />

        {/* Outer corner dots representing block dye marks */}
        <Circle cx="16" cy="3" r="1" fill={SagaColors.gold} />
        <Circle cx="16" cy="29" r="1" fill={SagaColors.gold} />
        <Circle cx="3" cy="16" r="1" fill={SagaColors.gold} />
        <Circle cx="29" cy="16" r="1" fill={SagaColors.gold} />
      </Svg>
    </View>
  );
}
