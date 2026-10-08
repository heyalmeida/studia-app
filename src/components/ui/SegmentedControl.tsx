import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Radius, Spacing, TOUCH_TARGET, Typography } from '@/constants/theme';

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
 *
 * Estilo em `StyleSheet` (ADR-0010): no Expo Go o `className` não é aplicado.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
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
            style={[styles.item, selected === true ? styles.itemSelected : null]}
            contentStyle={[styles.itemContent, centeredContent]}>
            <Text style={[styles.label, selected === true ? styles.labelSelected : null]}>
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

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: Spacing.one,
    borderRadius: Radius.card,
    backgroundColor: Palette.surfaceRaised,
    padding: Spacing.one,
  },
  item: {
    flex: 1,
    borderRadius: Radius.chip,
  },
  itemSelected: {
    backgroundColor: Palette.accentSoft,
  },
  // 38 = alvo alto o bastante para o polegar, baixo o bastante para não pesar a barra.
  itemContent: {
    minHeight: TOUCH_TARGET - 6,
  },
  label: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  labelSelected: {
    fontWeight: '600',
    color: Palette.accent,
  },
});