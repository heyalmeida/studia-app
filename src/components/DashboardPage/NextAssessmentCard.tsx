import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DateBlock } from '@/components/ui/DateBlock';
import { DueChip } from '@/components/ui/DueChip';
import { Palette, Spacing, Typography, subjectTone } from '@/constants/theme';
import type { Assessment, Subject } from '@/domain/models';

export interface NextAssessmentCardProps {
  assessment: Assessment;
  subject: Subject | undefined;
}

/**
 * Próxima avaliação do painel (ADR-0009): bloco de data à esquerda, título e matéria.
 * Só aparece se existir avaliação agendada — sem bloco, sem texto de espera.
 */
export function NextAssessmentCard({ assessment, subject }: NextAssessmentCardProps) {
  const tone = subjectTone(subject?.color);
  // Fora do JSX de propósito: `tone.value` num style inline dispara o aviso do plugin do
  // Reanimated/worklets (que não distingue cor de shared value).
  const dotStyle = tone !== null ? { backgroundColor: tone.value } : null;

  return (
    <Card
      onPress={() => router.push(`/assessment-form?id=${encodeURIComponent(assessment.id)}`)}
      contentStyle={styles.card}>
      <DateBlock date={assessment.date} />

      <View style={styles.details}>
        <Text style={styles.legend}>Próxima avaliação</Text>
        <Text style={styles.title} numberOfLines={2}>
          {assessment.title}
        </Text>
        <View style={styles.subjectRow}>
          {tone !== null ? (
            <View style={[styles.dot, dotStyle]} />
          ) : null}
          <Text style={styles.subject} numberOfLines={1}>
            {subject?.name ?? 'Sem matéria'}
          </Text>
        </View>
      </View>

      <DueChip date={assessment.date} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  details: {
    flex: 1,
    gap: Spacing.two,
  },
  legend: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
  title: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  subject: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
});