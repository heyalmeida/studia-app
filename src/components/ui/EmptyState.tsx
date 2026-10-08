import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';

export interface EmptyStateProps {
  /** Ícone lucide de 40px — dá presença ao estado vazio sem ilustração colorida. */
  icon: ReactNode;
  title: string;
  /** Uma frase de apoio (não duas). */
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Estado vazio (ADR-0009): ícone 40px, título, uma frase de apoio e botão primário,
 * centralizados. Sem número mágico e sem texto repetido.
 */
export function EmptyState({ icon, title, text, actionLabel, onAction }: EmptyStateProps) {
  const showAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View className="flex-1 items-center justify-center gap-4 px-6 py-10">
      <View className="text-text-tertiary">{icon}</View>

      <View className="items-center gap-2">
        <Text className="text-center text-cardTitle font-semibold text-text">{title}</Text>
        <Text className="text-center text-body text-text-secondary">{text}</Text>
      </View>

      {showAction ? (
        <View className="mt-2 w-full max-w-[280px]">
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}