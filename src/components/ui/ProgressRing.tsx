import { Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { Palette } from '@/constants/theme';

export interface ProgressRingProps {
  ratio: number; // 0..1 — clamp aplicado aqui, nunca fora
  size?: number;
  strokeWidth?: number;
  /** Cor do traço; o painel usa o destaque. */
  color?: string;
}

/**
 * Anel de progresso (ADR-0009): trilha na superfície elevada e traço na cor de destaque.
 * Substitui a rosca monocromática — o progresso é um dos poucos lugares com cor.
 */
export function ProgressRing({
  ratio,
  size = 96,
  strokeWidth = 8,
  color = Palette.accent,
}: ProgressRingProps) {
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamped * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <View className="absolute inset-0">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Palette.surfaceRaised}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
      <View className="absolute inset-0">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={[progress, Math.max(0, circumference - progress)]}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </View>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-metric font-bold text-text">{Math.round(clamped * 100)}%</Text>
      </View>
    </View>
  );
}