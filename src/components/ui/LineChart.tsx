import { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { Line, Polyline, Svg } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

/**
 * Linha semanal monocromática com react-native-svg. Moins de 3 pontos = 'Dados
 * insuficientes para o gráfico.' (sem eixo desenhado).
 */
export function LineChart({ data, height = 120 }: LineChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  function onLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  if (data.length < 3) {
    return <Text className="text-meta text-text-secondary">Dados insuficientes para o gráfico.</Text>;
  }

  const paddingLeft = 24;
  const paddingBottom = 24;
  const paddingTop = 8;
  const chartWidth = Math.max(0, width - paddingLeft - 8);
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = Math.max(1, ...data.map((point) => point.value));
  const points = data.map((point, index) => {
    const x = paddingLeft + (chartWidth * index) / (data.length - 1);
    const y = paddingTop + chartHeight * (1 - point.value / maxValue);
    return { x, y, point };
  });
  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View onLayout={onLayout} style={{ height, width: '100%' }}>
      {width > 0 ? (
        <>
          <View className="absolute inset-0">
            <Svg width={width} height={height}>
              {/* eixo Y */}
              <Line
                x1={paddingLeft}
                y1={paddingTop}
                x2={paddingLeft}
                y2={paddingTop + chartHeight}
                stroke={theme.text}
                strokeWidth={1}
              />
              {/* eixo X */}
              <Line
                x1={paddingLeft}
                y1={paddingTop + chartHeight}
                x2={paddingLeft + chartWidth}
                y2={paddingTop + chartHeight}
                stroke={theme.text}
                strokeWidth={1}
              />
              <Polyline points={polyPoints} fill="none" stroke={theme.text} strokeWidth={2} />
            </Svg>
          </View>
          <View className="absolute inset-0">
            {points.map((p, index) => (
              <View
                key={index}
                className="absolute rounded-full bg-inverse"
                style={{ left: p.x - 3, top: p.y - 3, width: 6, height: 6 }}
              />
            ))}
          </View>
          <View
            className="absolute"
            style={{ left: 0, top: paddingTop + chartHeight - 6, width: paddingLeft, alignItems: 'center' }}>
            <Text className="text-meta text-text-tertiary">0</Text>
          </View>
          <View className="absolute" style={{ left: 0, top: paddingTop - 8, width: paddingLeft, alignItems: 'center' }}>
            <Text className="text-meta text-text-tertiary">{maxValue}</Text>
          </View>
          {points.map((p, index) => (
            <Text
              key={index}
              className="absolute text-meta text-text-tertiary"
              style={{
                left: p.x - 16,
                top: paddingTop + chartHeight + 8,
                width: 32,
                textAlign: 'center',
                transform: [{ rotate: '-30deg' }],
              }}>
              {p.point.label}
            </Text>
          ))}
        </>
      ) : null}
    </View>
  );
}
