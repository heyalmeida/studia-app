import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';

export interface ProgressSummaryCardProps {
  ratio: number;
  done: number;
  total: number;
  /** Pendentes que vencem na janela de 7 dias. */
  dueThisWeek: number;
}

/**
 * Card principal do painel (ADR-0009): anel de progresso **à esquerda** e, à direita,
 * "X de Y concluídas" + quantas vencem esta semana. Um único número de destaque — o
 * resto é apoio, sem repetir o que os cards de baixo já mostram.
 */
export function ProgressSummaryCard({ ratio, done, total, dueThisWeek }: ProgressSummaryCardProps) {
  return (
    <Card>
      <View className="flex-row items-center gap-5">
        <ProgressRing ratio={ratio} size={104} strokeWidth={9} />

        <View className="flex-1 gap-3">
          <View style={{ gap: 2 }}>
            <Text className="text-cardTitle font-semibold text-text">
              {done} de {total} concluídas
            </Text>
            <Text className="text-body text-text-secondary">
              {total === 0
                ? 'Nenhuma atividade cadastrada ainda.'
                : `${total - done} ${total - done === 1 ? 'pendente' : 'pendentes'} no total`}
            </Text>
          </View>

          <Text className="text-legend text-text-tertiary">
            {dueThisWeek === 0
              ? 'Nada vence nos próximos 7 dias'
              : `${dueThisWeek} ${dueThisWeek === 1 ? 'vence' : 'vencem'} nos próximos 7 dias`}
          </Text>
        </View>
      </View>
    </Card>
  );
}