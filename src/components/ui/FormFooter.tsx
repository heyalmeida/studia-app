import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';
import { Palette, SAFE_GAP, SCREEN_PADDING, Typography } from '@/constants/theme';

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
 * Rodapé fixo do formulário (ADR-0009): **Salvar** na cor de destaque e, embaixo, uma linha
 * com **Cancelar** e **Excluir** lado a lado (exclusão = texto vermelho, confirmação num
 * `Alert` da tela).
 *
 * `position: absolute` nas bordas inferior/laterais, então continua alcançável com o
 * teclado aberto. O `paddingBottom` é `insets.bottom + 16`: no Android nenhum botão fica
 * colado na barra de gestos. O `ScrollView` do formulário compensa a altura com
 * `FORM_FOOTER_HEIGHT` no `paddingBottom` do conteúdo.
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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingBottom: insets.bottom + SAFE_GAP },
      ]}>
      {children}

      <PrimaryButton label={saveLabel} onPress={onSave} disabled={saveDisabled} />

      <View style={styles.row}>
        <TextButton label="Cancelar" onPress={onCancel} />
        {onDelete !== undefined ? <TextButton label="Excluir" tone="danger" onPress={onDelete} /> : null}
      </View>

      {message !== undefined && message !== null ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.background,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  message: {
    ...Typography.legend,
    color: Palette.danger,
    textAlign: 'center',
    marginTop: 12,
  },
});