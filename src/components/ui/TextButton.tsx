import { StyleSheet, Text } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { FIELD_HEIGHT, Palette, Radius, Typography } from '@/constants/theme';

export interface TextButtonProps {
  label: string;
  onPress: () => void;
  /** `danger` é o texto vermelho discreto da exclusão (ADR-0009). */
  tone?: 'neutral' | 'danger';
  disabled?: boolean;
}

/**
 * Ação secundária (ADR-0009): **cancelar** e **excluir**. Superfície elevada + hairline,
 * sem cor de destaque; a exclusão usa **apenas** o texto vermelho — nunca um botão
 * preenchido, para não competir com Salvar (ADR-0009 §2).
 *
 * Espaçamento em `StyleSheet` com números explícitos (não `className`), para valer também
 * no Expo Go.
 */
export function TextButton({ label, onPress, tone = 'neutral', disabled = false }: TextButtonProps) {
  const color = tone === 'danger' ? Palette.danger : Palette.textSecondary;

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={[styles.button, disabled ? styles.disabled : null]}
      contentStyle={centeredContent}>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: FIELD_HEIGHT,
    paddingHorizontal: 20,
    borderRadius: Radius.button,
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...Typography.button,
  },
});