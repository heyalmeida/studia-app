import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface FormFieldProps {
  label: string;
  /** Mensagem de erro do domínio (mesma voz da validação). */
  error?: string;
  /** Conteúdo: input, chips, grade de ícones… */
  children: ReactNode;
}

/**
 * Grupo de formulário (ADR-0009): rótulo de 12px com 8px até o campo. O espaçamento de
 * 20 entre grupos é do container do formulário, então todos os formulários respiram igual.
 */
export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text className="text-legend text-text-tertiary">{label}</Text>
      {children}
      {error !== undefined && error.length > 0 ? (
        <Text className="text-legend text-danger">{error}</Text>
      ) : null}
    </View>
  );
}