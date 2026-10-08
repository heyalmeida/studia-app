import { StyleSheet, Text } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { FIELD_HEIGHT, Palette, Radius, Typography } from '@/constants/theme';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Ação principal (ADR-0009): fundo na cor de destaque, rótulo branco 16/600, altura 52 e
 * raio 14. É o **único** botão com essa cor — exclusão e cancelar são secundários.
 *
 * Espaçamento em `StyleSheet` com números explícitos (não `className`), para valer também
 * no Expo Go.
 */
export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
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
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: FIELD_HEIGHT,
    paddingHorizontal: 20,
    borderRadius: Radius.button,
    backgroundColor: Palette.accent,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...Typography.button,
    color: Palette.onAccent,
  },
});