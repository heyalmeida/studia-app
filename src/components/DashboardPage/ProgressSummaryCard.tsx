import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Palette, Spacing, Typography } from '@/constants/theme';

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
      <View style={styles.row}>
        <ProgressRing ratio={ratio} size={104} strokeWidth={9} />

        <View style={styles.details}>
          <View style={styles.headline}>
            <Text style={styles.headlineText}>
              {done} de {total} concluídas
            </Text>
            <Text style={styles.support}>
              {total === 0
                ? 'Nenhuma atividade cadastrada ainda.'
                : `${total - done} ${total - done === 1 ? 'pendente' : 'pendentes'} no total`}
            </Text>
          </View>

          <Text style={styles.legend}>
            {dueThisWeek === 0
              ? 'Nada vence nos próximos 7 dias'
              : `${dueThisWeek} ${dueThisWeek === 1 ? 'vence' : 'vencem'} nos próximos 7 dias`}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.five,
  },
  details: {
    flex: 1,
    gap: Spacing.three,
  },
  headline: {
    gap: Spacing.one,
  },
  headlineText: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  support: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  legend: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
});