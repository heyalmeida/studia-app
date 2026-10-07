import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { ListItem } from '@/components/ui/ListItem';
import { relativeLabelBR } from '@/domain/date';
import type { Assessment, Subject } from '@/domain/models';

export interface NextAssessmentRowProps {
  assessment: Assessment;
  subject: Subject | undefined;
}

/** Linha compacta de avaliação agendada (bloco "Próximas avaliações" do painel). */
export function NextAssessmentRow({ assessment, subject }: NextAssessmentRowProps) {
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra o painel (RNF-04)

  return (
    <ListItem onPress={() => router.push(`/assessment-form?id=${encodeURIComponent(assessment.id)}`)}>
      <View className="flex-row items-center justify-between gap-three">
        <View className="flex-1 gap-half">
          <Text className="text-body font-semibold text-text" numberOfLines={1}>
            {assessment.title}
          </Text>
          <Text className="text-meta text-text-secondary" numberOfLines={1}>
            {subjectName}
          </Text>
        </View>
        <Text className="flex-shrink text-meta text-text-tertiary">
          {relativeLabelBR(assessment.date)}
        </Text>
      </View>
    </ListItem>
  );
}