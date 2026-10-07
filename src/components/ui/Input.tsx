import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  label: string;
  error?: string;
  warning?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences';
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  warning,
  multiline = false,
  keyboardType,
  maxLength,
  autoCapitalize,
}: InputProps) {
  const colors = useTheme();
  const hasError = error !== undefined && error.length > 0;
  const hasWarning = !hasError && warning !== undefined && warning.length > 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={[
          styles.field,
          { backgroundColor: colors.backgroundElement, color: colors.text },
          multiline && styles.multiline,
          {
            borderColor: hasError ? colors.borderStrong : colors.border,
            borderWidth: hasError ? 1.5 : 1,
          },
        ]}
      />
      {hasError ? (
        <Text style={[styles.message, { color: colors.text }]}>{error}</Text>
      ) : null}
      {hasWarning ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>Aviso: {warning}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    ...Typography.section,
    textTransform: 'uppercase',
  },
  field: {
    ...Typography.body,
    borderRadius: Radius.field,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 48,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  message: {
    ...Typography.meta,
  },
});
