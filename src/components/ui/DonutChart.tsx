import { Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

export interface DonutChartProps {
  ratio: number;
  size?: 'sm' | 'md';
}

/**
 * Rosca de conclusão monocromática (ADR-0006): traço `text-text` (= inverso do fundo)
 * sobre trilha `text-surface-selected`. stroke="currentColor" herda o `color` do View
 * (NativeWind aplica a variável CSS do token).
 */
export function DonutChart({ ratio, size = 'md' }: DonutChartProps) {
  const dimension = size === 'sm' ? 64 : 96;
  const strokeWidth = 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  const progress = clamped * circumference;

  return (
    <View style={{ width: dimension, height: dimension }}>
      <View className="absolute inset-0 text-surface-selected">
        <Svg width={dimension} height={dimension}>
          <Circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
      <View className="absolute inset-0 text-text">
        <Svg width={dimension} height={dimension}>
          <Circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
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
