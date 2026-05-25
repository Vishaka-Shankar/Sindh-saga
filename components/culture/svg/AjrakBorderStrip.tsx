/**
 * AjrakBorderStrip.tsx — Horizontal decorative Ajrak geometric border.
 * Location: components/culture/svg/
 */

import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { SagaColors } from '@/constants/colors';

type AjrakBorderStripProps = {
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function AjrakBorderStrip({ height = 12, style }: AjrakBorderStripProps) {
  return (
    <View style={[{ height, width: '100%' }, style]} pointerEvents="none">
      <Svg width="100%" height={height} viewBox="0 0 400 12" preserveAspectRatio="none">
        <Rect width="400" height="12" fill={SagaColors.deepIndigo} />
        <Path
          d="M0 6 L20 0 L40 6 L60 0 L80 6 L100 0 L120 6 L140 0 L160 6 L180 0 L200 6 L220 0 L240 6 L260 0 L280 6 L300 0 L320 6 L340 0 L360 6 L380 0 L400 6"
          fill="none"
          stroke={SagaColors.gold}
          strokeWidth={1}
        />
        {[50, 150, 250, 350].map((x) => (
          <Circle key={x} cx={x} cy={6} r={2} fill={SagaColors.brickRed} />
        ))}
      </Svg>
    </View>
  );
}
