import { Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export interface DonutChartProps {
  ratio: number;
  size?: 'sm' | 'md';
}

/**
 * Rosca de conclusão monocromática (ADR-0006): traço no tom de `text`
 * (= inverso do fundo) sobre trilha `backgroundSelected`.
 */
export function DonutChart({ ratio, size = 'md' }: DonutChartProps) {
  const theme = useTheme();
  const dimension = size === 'sm' ? 64 : 96;
  const strokeWidth = 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  const progress = clamped * circumference;

  return (
    <View style={{ width: dimension, height: dimension }}>
      <View className="absolute inset-0">
        <Svg width={dimension} height={dimension}>
          <Circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={theme.backgroundSelected}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
      <View className="absolute inset-0">
        <Svg width={dimension} height={dimension}>
          <Circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={theme.text}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={[progress, Math.max(0, circumference - progress)]}
            strokeLinecap="round"
            transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
          />
        </Svg>
      </View>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-meta font-bold text-text">{Math.round(clamped * 100)}%</Text>
      </View>
    </View>
  );
}
