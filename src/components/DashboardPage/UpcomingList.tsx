import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DueChip } from '@/components/ui/DueChip';
import { Touchable } from '@/components/ui/Touchable';
import { subjectTone, Palette } from '@/constants/theme';
import type { Activity, Subject } from '@/domain/models';

export interface UpcomingListProps {
  activities: Activity[];
  subjectById: Record<string, Subject>;
}

/**
 * "Próximos prazos" do painel (ADR-0009): as 3 próximas atividades pendentes na ordem da
 * lista principal — título, matéria com a bolinha da cor e chip de prazo por urgência.
 * Toca no item para editar; o "ver todas" leva à lista completa.
 */
export function UpcomingList({ activities, subjectById }: UpcomingListProps) {
  return (
    <Card bare className="px-4 py-2">
      <View className="flex-row items-center justify-between pb-1 pt-3">
        <Text className="text-legend text-text-tertiary">Próximos prazos</Text>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Ver todas as atividades"
          onPress={() => router.push('/activities')}
          pressedOpacity={0.6}
          style={{ minHeight: 44 }}
          className="justify-center px-1">
          <Text className="text-legend text-accent">Ver todas</Text>
        </Touchable>
      </View>

      {activities.length === 0 ? (
        <Text className="py-4 text-body text-text-secondary">
          Nenhuma atividade pendente. Você está em dia.
        </Text>
      ) : (
        activities.map((activity, index) => {
          const subject = subjectById[activity.subjectId];
          const tone = subjectTone(subject?.color);

          return (
            <Touchable
              key={activity.id}
              accessibilityRole="button"
              accessibilityLabel={activity.title}
              onPress={() => router.push(`/activity-form?id=${encodeURIComponent(activity.id)}`)}
              pressedOpacity={0.7}
              style={index === activities.length - 1 ? undefined : styles.divider}
              className="flex-row items-center gap-3 py-3">
              {tone !== null ? (
                <View
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: tone.value }}
                />
              ) : (
                <View className="h-2 w-2 shrink-0" />
              )}

              <View className="flex-1 gap-1">
                <Text className="text-bodyStrong font-semibold text-text" numberOfLines={2}>
                  {activity.title}
                </Text>
                <Text className="text-legend text-text-tertiary" numberOfLines={1}>
                  {subject?.name ?? 'Sem matéria'}
                </Text>
              </View>

              {activity.dueDate !== null ? <DueChip date={activity.dueDate} /> : null}
            </Touchable>
          );
        })
      )}
    </Card>
  );
}

const styles = {
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
} as const;