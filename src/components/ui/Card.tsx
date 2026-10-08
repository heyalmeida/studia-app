import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';

export interface CardProps {
  children: ReactNode;
  /** Torna o card inteiro um alvo de toque (lista de matérias, de avaliações). */
  onPress?: () => void;
  /** Sem padding interno — para listas que já controlam o respiro. */
  bare?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * Card da identidade (ADR-0009): superfície `#15151B`, hairline de 1px e raio 16.
 * Sem sombra — profundidade é por tom de superfície (RNF-01).
 */
export function Card({ children, onPress, bare = false, style, className }: CardProps) {
  // O padding vai no Pressable (via Touchable), não no Animated.View: assim o respiro
  // também responde ao toque e o card inteiro é um alvo de verdade.
  const padding = bare ? '' : 'p-4';
  const base = `rounded-card border border-border bg-surface ${className ?? ''}`;

  if (onPress !== undefined) {
    return (
      <Touchable
        accessibilityRole="button"
        onPress={onPress}
        pressedOpacity={0.8}
        pressedScale={0.99}
        style={style}
        className={base}
        contentClassName={padding}>
        {children}
      </Touchable>
    );
  }

  return <View className={`${base} ${padding}`}>{children}</View>;
}