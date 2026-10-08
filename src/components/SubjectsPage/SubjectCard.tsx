import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { subjectTone, Palette } from '@/constants/theme';
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
      className="gap-4">
      <View className="flex-row items-center gap-3">
        <IconTile subject={subject} size={44} />

        <View className="flex-1 gap-1">
          <Text className="text-cardTitle font-semibold text-text" numberOfLines={2}>
            {subject.name}
          </Text>
          <Text className="text-legend text-text-tertiary" numberOfLines={1}>
            {subject.teacher ?? 'Sem professor'}
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text className="text-legend text-text-secondary">
          {pending} {pending === 1 ? 'pendente' : 'pendentes'} · {scheduled}{' '}
          {scheduled === 1 ? 'avaliação' : 'avaliações'}
        </Text>
        <ProgressBar ratio={ratio} color={barColor} />
      </View>
    </Card>
  );
}