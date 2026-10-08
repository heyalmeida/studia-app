import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Monogram } from '@/components/ui/Monogram';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { renderIcon } from '@/components/ui/IconPicker';
import type { Subject } from '@/domain/models';

export interface SubjectCardProps {
  subject: Subject;
  pending: number;
  scheduled: number;
  ratio: number;
}

/**
 * Card de matéria na lista (T2): monograma + nome + professor(a), métricas agregadas
 * e barra de progresso. Os agregados vêm da tela como props — um useSubjects() por card
 * reinscreveria o repositório várias vezes sem motivo.
 */
export function SubjectCard({ subject, pending, scheduled, ratio }: SubjectCardProps) {
  const hasIcon = subject.icon !== null && subject.icon !== '' && renderIcon(subject.icon) !== null;
  return (
    <Card
      onPress={() => router.push(`/subject-form?id=${encodeURIComponent(subject.id)}`)}
      style={{ marginBottom: 16, gap: 16 }}>
      <View className="flex-row items-center gap-three">
        {hasIcon ? (
          <View
            className="items-center justify-center rounded-monogram border border-border-strong p-half text-text"
            style={{ width: 40, height: 40 }}>
            {renderIcon(subject.icon, 20)}
          </View>
        ) : (
          <Monogram name={subject.name} size="md" />
        )}
        <View className="flex-1 gap-half">
          <Text className="flex-shrink text-body font-semibold text-text" numberOfLines={1} ellipsizeMode="tail">
            {subject.name}
          </Text>
          <Text className="text-meta text-text-tertiary" numberOfLines={1}>
            {subject.teacher ?? 'Sem professor'}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between gap-one">
        <Text className="text-meta text-text-secondary">{pending} pendente(s)</Text>
        <Text className="text-meta text-text-secondary">
          {scheduled} avaliação(ões) agendada(s)
        </Text>
      </View>

      <ProgressBar ratio={ratio} />
    </Card>
  );
}
