import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';

export interface SegmentedOption<T extends string> {
  key: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (next: T) => void;
}

/**
 * Filtro em controle segmentado único (ADR-0009) — substitui os 3 botões soltos. O
 * item ativo fica na cor de destaque; a troca anima a opacidade do conteúdo da lista
 * (a transição de filtro mora aqui, não em cada tela).
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row gap-1 rounded-card bg-surface-raised p-1">
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Touchable
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.key)}
            pressedOpacity={0.8}
            pressedScale={0.98}
            style={{ flex: 1 }}
            className={
              selected
                ? 'min-h-[38px] items-center justify-center rounded-chip bg-accent-soft'
                : 'min-h-[38px] items-center justify-center rounded-chip'
            }
            contentClassName="w-full items-center justify-center">
            <Text
              className={
                selected
                  ? 'text-body font-semibold text-accent'
                  : 'text-body text-text-secondary'
              }>
              {option.label}
            </Text>
          </Touchable>
        );
      })}
    </View>
  );
}

/**
 * Fade curto para o conteúdo que muda de filtro (ou de lista). 140ms de opacidade:
 * perceptível, sem atrasar a interação. `key` muda quando o filtro muda.
 */
export function FadeIn({
  children,
  duration = 140,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [children, duration, opacity]);

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}