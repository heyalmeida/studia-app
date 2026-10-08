import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { Palette, Radius, Spacing } from '@/constants/theme';

export interface CardProps {
  children: ReactNode;
  /** Torna o card inteiro um alvo de toque (lista de matérias, de avaliações). */
  onPress?: () => void;
  /** Sem padding interno — para listas que já controlam o respiro. */
  bare?: boolean;
  /** Estilo do alvo (vindo do chamador: `gap`, `flexDirection`, …). */
  style?: StyleProp<ViewStyle>;
  /** Padding **dentro** do alvo de toque. */
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Card da identidade (ADR-0009): superfície `#15151B`, hairline de 1px e raio 16.
 * Sem sombra — profundidade é por tom de superfície (RNF-01).
 *
 * Estilo em `StyleSheet`: no Expo Go o `className` do NativeWind não é aplicado, então o
 * espaçamento e a tipografia vêm daqui (ADR-0010). Layout interno é do chamador, via
 * `style`/`contentStyle`.
 */
export function Card({ children, onPress, bare = false, style, contentStyle }: CardProps) {
  // O padding vai no Pressable (via Touchable), não no Animated.View: assim o respiro
  // também responde ao toque e o card inteiro é um alvo de verdade.
  const padding = bare ? undefined : styles.padded;

  if (onPress !== undefined) {
    return (
      <Touchable
        accessibilityRole="button"
        onPress={onPress}
        pressedOpacity={0.8}
        pressedScale={0.99}
        style={[styles.card, style]}
        contentStyle={padding === undefined ? contentStyle : [padding, contentStyle]}>
        {children}
      </Touchable>
    );
  }

  return (
    <View style={[styles.card, style, padding, contentStyle]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  padded: {
    padding: Spacing.four,
  },
});