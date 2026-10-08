import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { subjectTone, Palette, Spacing, Typography } from '@/constants/theme';
import type { Subject } from '@/domain/models';

export interface SubjectCardProps {
  subject: Subject;
  pending: number;
  scheduled: number;
  ratio: number;
}

/**
 * Card de matéria na lista (T2, ADR-0009): ícone em quadrado 44 com fundo tingido na cor
 * da matéria, nome, professor, "N pendentes · N avaliações" e barra de progresso na mesma
 * cor. O card inteiro é o alvo — abre a edição.
 */
export function SubjectCard({ subject, pending, scheduled, ratio }: SubjectCardProps) {
  const tone = subjectTone(subject.color);
  const barColor = tone?.value ?? Palette.accent;

  return (
    <Card
      onPress={() => router.push(`/subject-form?id=${encodeURIComponent(subject.id)}`)}
      contentStyle={styles.content}>
      <View style={styles.header}>
        <IconTile subject={subject} size={44} />

        <View style={styles.identifiers}>
          <Text style={styles.name} numberOfLines={2}>
            {subject.name}
          </Text>
          <Text style={styles.teacher} numberOfLines={1}>
            {subject.teacher ?? 'Sem professor'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.counts}>
          {pending} {pending === 1 ? 'pendente' : 'pendentes'} · {scheduled}{' '}
          {scheduled === 1 ? 'avaliação' : 'avaliações'}
        </Text>
        <ProgressBar ratio={ratio} color={barColor} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  identifiers: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  teacher: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
  footer: {
    gap: Spacing.two,
  },
  counts: {
    ...Typography.legend,
    color: Palette.textSecondary,
  },
});