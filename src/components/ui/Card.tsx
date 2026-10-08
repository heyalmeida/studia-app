import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';

export interface CardProps {
  children: ReactNode;
  /** Torna o card inteiro um alvo de toque (lista de matérias, de avaliações). */
  onPress?: () => void;
  /** `raised` = superfície elevada (formulário, item destacado). */
  variant?: 'default' | 'raised';
  /** Sem padding interno — para listas que já controlam o respiro. */
  bare?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * Card da identidade (ADR-0009): superfície `#15151B`, hairline de 1px e raio 16.
 * Sem sombra — profundidade é por tom de superfície (RNF-01).
 */
export function Card({
  children,
  onPress,
  variant = 'default',
  bare = false,
  style,
  className,
}: CardProps) {
  const container = variant === 'raised' ? 'bg-surface-raised' : 'bg-surface';
  const base = `rounded-card border border-border ${container} ${bare ? '' : 'p-4'}`;

  if (onPress !== undefined) {
    return (
      <Touchable
        accessibilityRole="button"
        onPress={onPress}
        style={style}
        className={`${base} ${className ?? ''}`}>
        {children}
      </Touchable>
    );
  }

  return <View className={`${base} ${className ?? ''}`}>{children}</View>;
}