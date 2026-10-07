import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const colors = useTheme();
  const [pressed, setPressed] = useState(false);

  const background =
    variant === 'primary'
      ? { backgroundColor: colors.surfaceInverse }
      : variant === 'secondary'
        ? { backgroundColor: colors.backgroundElement }
        : { backgroundColor: 'transparent' };

  // pressed muda o fundo para backgroundSelected; no primário o texto acompanha para não
  // perder contraste (textOnInverse sobre um fundo claro ficaria ilegível).
  const labelColor =
    variant === 'primary'
      ? pressed
        ? colors.text
        : colors.textOnInverse
      : variant === 'secondary'
        ? colors.text
        : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed: isPressed }) => [
        styles.base,
        background,
        isPressed && { backgroundColor: colors.backgroundSelected },
        disabled && styles.disabled,
      ]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.button,
  },
  label: {
    ...Typography.button,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
