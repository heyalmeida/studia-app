import { StyleSheet, Text, TextInput, View } from 'react-native';

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
  const hasError = error !== undefined && error.length > 0;
  const hasWarning = !hasError && warning !== undefined && warning.length > 0;

  return (
    <View style={styles.container}>
      <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderClassName="text-text-tertiary"
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        className={
          hasError
            ? 'bg-surface rounded-field border-[1.5px] border-border-strong px-three py-two text-body text-text'
            : 'bg-surface rounded-field border border-border px-three py-two text-body text-text'
        }
        style={[styles.field, multiline && styles.multiline]}
      />
      {hasError ? <Text style={styles.message} className="text-text">{error}</Text> : null}
      {hasWarning ? (
        <Text style={styles.message} className="text-text-secondary">
          Aviso: {warning}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  field: {
    minHeight: 48,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  message: {
    fontSize: 13,
  },
});
