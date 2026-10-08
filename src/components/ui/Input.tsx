import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FIELD_HEIGHT, Palette } from '@/constants/theme';

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
  /** Altura mínima quando `multiline` (descrição de atividade = 100). */
  minHeight?: number;
}

/**
 * Campo de formulário (ADR-0009): rótulo de 12px com 8px de distância, altura mínima 52,
 * raio 12 e **borda de foco na cor de destaque**. O placeholder usa `#6B6B76` — antes
 * praticamente invisível.
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
  const fieldClass = hasError
    ? 'border-danger'
    : focused
      ? 'border-accent'
      : 'border-border';

  return (
    <View style={styles.container}>
      <Text className="text-legend text-text-tertiary">{label}</Text>

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
        className={`bg-surface-raised rounded-field border px-4 text-body text-text ${fieldClass}`}
        style={[
          styles.field,
          multiline ? { minHeight: minHeight ?? 100, textAlignVertical: 'top' } : null,
        ]}
      />

      {hasError ? <Text className="text-legend text-danger">{error}</Text> : null}
      {hasWarning ? <Text className="text-legend text-warning">{warning}</Text> : null}
    </View>
  );
}

// altura mínima e radius/linha são fixos; cor de foco/erro via className (NativeWind)
const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  field: {
    minHeight: FIELD_HEIGHT,
    paddingVertical: 14,
  },
});