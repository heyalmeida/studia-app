import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';

export interface FormFooterProps {
  saveLabel?: string;
  onSave: () => void;
  saveDisabled?: boolean;
  /** Exclusão existe só na edição; some da criação. */
  onDelete?: () => void;
  onCancel: () => void;
  /** Mensagem de bloqueio (ex.: matéria com filhos). */
  message?: string | null;
  /** Conteúdo extra antes das ações (atalhos, avisos). */
  children?: ReactNode;
}

/**
 * Rodapé fixo do formulário (ADR-0009): **Salvar** na cor de destaque, **Excluir** como
 * texto vermelho discreto (a confirmação é um `Alert` na tela) e **Cancelar** secundário.
 * Fica fora do `ScrollView`, então continua alcançável com o teclado aberto.
 */
export function FormFooter({
  saveLabel = 'Salvar',
  onSave,
  saveDisabled = false,
  onDelete,
  onCancel,
  message,
  children,
}: FormFooterProps) {
  return (
    <View className="border-t border-border bg-background px-5 pt-3">
      {children}

      <View className="pb-1">
        <PrimaryButton label={saveLabel} onPress={onSave} disabled={saveDisabled} />
      </View>

      {onDelete !== undefined ? (
        <View className="pb-1">
          <TextButton label="Excluir" tone="danger" onPress={onDelete} />
        </View>
      ) : null}

      <View className="pb-1">
        <TextButton label="Cancelar" onPress={onCancel} />
      </View>

      {message !== undefined && message !== null ? (
        <Text className="pb-2 text-center text-legend text-danger">{message}</Text>
      ) : (
        <View style={{ height: 8 }} />
      )}
    </View>
  );
}