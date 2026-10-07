import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';

export interface SectionLabelProps {
  title: string;
  /** Botão ghost à direita do rótulo (navegação do bloco, AC-5.4). */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Cabeçalho de bloco do painel: rótulo de seção em caixa alta + ação à direita.
 * Compartilhado pelos 3 blocos, então fica aqui e não no `index.tsx` da tela.
 */
export function SectionLabel({ title, actionLabel, onAction }: SectionLabelProps) {
  return (
    <View className="flex-row items-center justify-between gap-two">
      <Text className="flex-shrink text-section font-semibold uppercase tracking-section text-text-secondary">
        {title}
      </Text>
      {actionLabel !== undefined && onAction !== undefined ? (
        <Button variant="ghost" label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}