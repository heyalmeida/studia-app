import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CreateButton } from '@/components/ui/CreateButton';
import { Palette, Typography } from '@/constants/theme';

export interface EmptyStateProps {
  /** Ícone lucide de 40px — dá presença ao estado vazio sem ilustração colorida. */
  icon: ReactNode;
  title: string;
  /** Uma frase de apoio (não duas). */
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Desligue quando a ação não cria (ex.: "Tentar de novo"). */
  actionWithIcon?: boolean;
}

/**
 * Estado vazio (ADR-0009): ícone 40px, título, uma frase de apoio e a ação, centralizados.
 * Sem número mágico e sem texto repetido.
 *
 * A ação usa `CreateButton` na versão grande (`minHeight` 52, margem superior 20).
 * Espaçamento em `StyleSheet` com números explícitos — no Expo Go o `className` não se aplica.
 */
export function EmptyState({
  icon,
  title,
  text,
  actionLabel,
  onAction,
  actionWithIcon = true,
}: EmptyStateProps) {
  const showAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View style={styles.root}>
      <View style={styles.icon}>{icon}</View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>

      {showAction ? (
        <View style={styles.action}>
          <CreateButton
            label={actionLabel}
            onPress={onAction}
            size="large"
            withIcon={actionWithIcon}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  title: {
    ...Typography.cardTitle,
    color: Palette.text,
    textAlign: 'center',
  },
  text: {
    ...Typography.body,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'center',
    maxWidth: 300,
    marginTop: 20,
  },
});