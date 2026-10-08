import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DateBlock } from '@/components/ui/DateBlock';
import { DueChip } from '@/components/ui/DueChip';
import { subjectTone } from '@/constants/theme';
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

  return (
    <Card
      onPress={() => router.push(`/assessment-form?id=${encodeURIComponent(assessment.id)}`)}
      className="flex-row items-center gap-4">
      <DateBlock date={assessment.date} />

      <View className="flex-1 gap-2">
        <Text className="text-legend text-text-tertiary">Próxima avaliação</Text>
        <Text className="text-cardTitle font-semibold text-text" numberOfLines={2}>
          {assessment.title}
        </Text>
        <View className="flex-row items-center gap-2">
          {tone !== null ? (
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.value }} />
          ) : null}
          <Text className="text-legend text-text-tertiary" numberOfLines={1}>
            {subject?.name ?? 'Sem matéria'}
          </Text>
        </View>
      </View>

      <DueChip date={assessment.date} />
    </Card>
  );
}