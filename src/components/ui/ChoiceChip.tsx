import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';

export interface ChoiceChipProps {
  selected: boolean;
  onPress: () => void;
  /** Cor da bolinha antes do rótulo (matéria). */
  dotColor?: string;
  /** Ícone antes do rótulo (tipo de atividade). */
  icon?: ReactNode;
  label: string;
}

/**
 * Chip de **seleção** (ADR-0009): selecionado = fundo em destaque e rótulo na cor de
 * destaque; não selecionado = superfície elevada e texto secundário. É o único lugar
 * do app onde o índigo aparece em "modo desligado" — a ação/seleção do usuário.
 */
export function ChoiceChip({ selected, onPress, dotColor, icon, label }: ChoiceChipProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      pressedOpacity={0.8}
      style={{ flexShrink: 0 }}
      className={
        selected
          ? 'min-h-[44px] items-center justify-center rounded-chip bg-accent-soft'
          : 'min-h-[44px] items-center justify-center rounded-chip bg-surface-raised'
      }
      contentClassName="w-full px-3 py-2">
      <View className="flex-row items-center justify-center gap-1.5">
        {dotColor !== undefined ? (
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
        ) : null}
        {icon !== undefined ? (
          <View className={selected ? 'text-accent' : 'text-text-tertiary'}>{icon}</View>
        ) : null}
        <Text
          className={`text-body ${selected ? 'font-semibold text-accent' : 'text-text-secondary'}`}
          numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Touchable>
  );
}