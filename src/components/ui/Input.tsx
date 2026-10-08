import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FIELD_HEIGHT, Palette, Radius, Typography } from '@/constants/theme';

export interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  warning?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences';
  /** Altura mínima quando `multiline` (descrição = 110). */
  minHeight?: number;
}

/**
 * Campo de formulário (ADR-0009): rótulo 12px com 8px de distância, altura mínima 52,
 * raio 12, texto 16 e **borda de foco na cor de destaque**. O placeholder usa `#6B6B76`.
 *
 * Todo o estilo é `StyleSheet` com valores numéricos explícitos (não `className`): sem o
 * NativeWind o campo perderia altura, raio, fundo e borda no Expo Go.
 */
export function Input({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  warning,
  multiline = false,
  keyboardType,
  maxLength,
  autoCapitalize,
  minHeight,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = error !== undefined && error.length > 0;
  const hasWarning = !hasError && warning !== undefined && warning.length > 0;

  // Erro manda; foco muda a borda para o destaque; sem erro nem foco, hairline.
  function borderColor(): string {
    if (hasError) return Palette.danger;
    if (focused) return Palette.accent;
    return Palette.border;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textTertiary}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.field,
          { borderColor: borderColor() },
          multiline
            ? { minHeight: minHeight ?? 110, textAlignVertical: 'top', paddingTop: 14 }
            : null,
        ]}
      />

      {hasError ? <Text style={[styles.message, { color: Palette.danger }]}>{error}</Text> : null}
      {hasWarning ? (
        <Text style={[styles.message, { color: Palette.warning }]}>{warning}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    ...Typography.legend,
    color: Palette.textTertiary,
    marginBottom: 8,
  },
  field: {
    minHeight: FIELD_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Radius.field,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    color: Palette.text,
    fontSize: Typography.field.fontSize,
    fontWeight: Typography.field.fontWeight,
    lineHeight: Typography.field.lineHeight,
  },
  message: {
    ...Typography.legend,
    marginTop: 6,
  },
});