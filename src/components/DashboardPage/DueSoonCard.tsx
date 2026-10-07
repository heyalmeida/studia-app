import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Monogram } from '@/components/ui/Monogram';
import { isPast, relativeLabelBR } from '@/domain/date';
import type { Activity, Subject } from '@/domain/models';

export interface DueSoonCardProps {
  activity: Activity;
  subject: Subject | undefined;
}

/** Card compacto de atividade vencendo na semana (bloco "Pendências" do painel). */
export function DueSoonCard({ activity, subject }: DueSoonCardProps) {
  // Atividade sem prazo não chega aqui (o filtro do hook exige dueDate), mas a guarda evita
  // `relativeLabelBR(undefined)` crashing o painel se o contrato mudar.
  const dueDate = activity.dueDate;
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra o painel (RNF-04)

  return (
    <Card
      onPress={() => router.push(`/activity-form?id=${encodeURIComponent(activity.id)}`)}
      style={{ marginBottom: 8 }}>
      <View className="flex-row items-center gap-three">
        <View className="flex-1 gap-one">
          <Text className="text-body font-semibold text-text" numberOfLines={1}>
            {activity.title}
          </Text>
          <View className="flex-row items-center gap-two">
            <Monogram name={subjectName} size="sm" />
            <Text className="flex-shrink text-meta text-text-secondary" numberOfLines={1}>
              {subjectName}
            </Text>
          </View>
        </View>
        {dueDate !== null ? (
          <Badge
            label={relativeLabelBR(dueDate)}
            tone={isPast(dueDate) ? 'inverse' : 'outline'}
          />
        ) : null}
      </View>
    </Card>
  );
}