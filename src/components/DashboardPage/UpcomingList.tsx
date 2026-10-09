import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DueChip } from '@/components/ui/DueChip';
import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { subjectTone, Palette, Spacing, TOUCH_TARGET, Typography } from '@/constants/theme';
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
    <Card bare contentStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.legend}>Próximos prazos</Text>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Ver todas as atividades"
          onPress={() => router.push('/activities')}
          pressedOpacity={0.6}
          contentStyle={[styles.linkTarget, centeredContent]}>
          <Text style={styles.link}>Ver todas</Text>
        </Touchable>
      </View>

      {activities.length === 0 ? (
        <Text style={styles.empty}>Nenhuma atividade pendente. Você está em dia.</Text>
      ) : (
        activities.map((activity, index) => {
          const subject = subjectById[activity.subjectId];
          const tone = subjectTone(subject?.color);
          // Fora do JSX de propósito: `tone.value` num style inline dispara o aviso do
          // plugin do Reanimated/worklets (que não distingue cor de shared value).
          const dotStyle = tone !== null ? { backgroundColor: tone.value } : null;

          return (
            <Touchable
              key={activity.id}
              accessibilityRole="button"
              accessibilityLabel={activity.title}
              onPress={() => router.push(`/activity-form?id=${encodeURIComponent(activity.id)}`)}
              pressedOpacity={0.7}
              style={index === activities.length - 1 ? undefined : styles.divider}
              contentStyle={styles.item}>
              {tone !== null ? (
                <View style={[styles.dot, dotStyle]} />
              ) : (
                // Espaçador: sem cor de matéria, a coluna do texto continua alinhada.
                <View style={styles.dotPlaceholder} />
              )}

              <View style={styles.identifiers}>
                <Text style={styles.title} numberOfLines={2}>
                  {activity.title}
                </Text>
                <Text style={styles.subject} numberOfLines={1}>
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

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  legend: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
  link: {
    ...Typography.legend,
    color: Palette.accent,
  },
  linkTarget: {
    minHeight: TOUCH_TARGET,
    paddingHorizontal: Spacing.one,
  },
  empty: {
    ...Typography.body,
    color: Palette.textSecondary,
    paddingVertical: Spacing.four,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotPlaceholder: {
    width: 8,
    height: 8,
  },
  identifiers: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    ...Typography.bodyStrong,
    color: Palette.text,
  },
  subject: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
});