import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette, Typography } from '@/constants/theme';

export interface FormFieldProps {
  label: string;
  /** Mensagem de erro do domínio (mesma voz da validação). */
  error?: string;
  /** Conteúdo: input, chips, grade de ícones… */
  children: ReactNode;
}

/**
 * Grupo de formulário (ADR-0009): rótulo de 12px com 8px até o campo e 20px entre grupos.
 * O respiro entre grupos é do próprio grupo (`marginBottom`), não do container do
 * formulário — assim qualquer ordem de campos respira igual.
 */
export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error !== undefined && error.length > 0 ? (
        <Text style={[styles.error, { color: Palette.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 20,
  },
  label: {
    ...Typography.legend,
    color: Palette.textTertiary,
    marginBottom: 8,
  },
  error: {
    ...Typography.legend,
    marginTop: 6,
  },
});