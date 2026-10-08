import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Typography } from '@/constants/theme';

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
 * destaque; não selecionado = superfície elevada e texto secundário. É o único lugar do
 * app onde o índigo aparece em "modo desligado" — a ação/seleção do usuário.
 *
 * Forma de pílula (paddingVertical 8, paddingHorizontal 14, raio 999) usada também nos
 * atalhos de data. Estilo em `StyleSheet` com números explícitos — no Expo Go o `className`
 * não se aplica.
 */
export function ChoiceChip({ selected, onPress, dotColor, icon, label }: ChoiceChipProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={[styles.chip, selected ? styles.selected : styles.unselected]}
      contentStyle={[centeredContent, styles.content]}>
      {dotColor !== undefined ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      {/* A cor do ícone é responsabilidade de quem o monta (lucide recebe `color`). */}
      {icon !== undefined ? <View style={styles.icon}>{icon}</View> : null}
      <Text
        style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}
        numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexShrink: 0,
    borderRadius: 999,
  },
  // Padding no Pressable: o respiro também precisa ser área tocável.
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  selected: {
    backgroundColor: Palette.accentSoft,
  },
  unselected: {
    backgroundColor: Palette.surfaceRaised,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.bodyStrong,
  },
  labelSelected: {
    color: Palette.accent,
  },
  labelUnselected: {
    color: Palette.textSecondary,
  },
});