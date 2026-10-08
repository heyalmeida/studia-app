import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { ActivityRow } from '@/components/ActivitiesPage/ActivityRow';
import { groupByPeriod } from '@/components/ActivitiesPage/activity-groups';
import { EmptyState } from '@/components/ui/EmptyState';
import ListChecks from 'lucide-react-native/icons/list-checks';
import { LIST_BOTTOM_INSET, Palette } from '@/constants/theme';
import type { Activity, Subject } from '@/domain/models';

export interface ActivitySectionListProps {
  activities: Activity[];
  subjectById: Record<string, Subject>;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  emptyTitle: string;
  emptyText: string;
  /** Ação do estado vazio. Só a lista realmente vazia tem o que criar. */
  emptyAction?: { label: string; onPress: () => void };
}

/**
 * Lista de atividades agrupada por período (T3, ADR-0009). É uma `FlatList` com linhas
 * achatadas (cabeçalho de grupo ou atividade) em vez de `SectionList`: um único scroll,
 * sem a animação de "colapsar" que atrapalha a leitura de uma lista curta.
 */
export function ActivitySectionList({
  activities,
  subjectById,
  onToggle,
  onOpen,
  emptyTitle,
  emptyText,
  emptyAction,
}: ActivitySectionListProps) {
  const groups = useMemo(() => groupByPeriod(activities), [activities]);

  type Row =
    | { kind: 'header'; key: string; title: string }
    | { kind: 'item'; key: string; activity: Activity };

  const rows = useMemo<Row[]>(() => {
    const flattened: Row[] = [];
    for (const group of groups) {
      flattened.push({ kind: 'header', key: `h-${group.bucket}`, title: group.title });
      for (const activity of group.data) {
        flattened.push({ kind: 'item', key: activity.id, activity });
      }
    }
    return flattened;
  }, [groups]);

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.key}
      renderItem={({ item }) =>
        item.kind === 'header' ? (
          <View className="flex-row items-center gap-3 pb-1 pt-5">
            <Text className="text-legend uppercase text-text-tertiary">{item.title}</Text>
            <View className="h-px flex-1 bg-border" />
          </View>
        ) : (
          <ActivityRow
            activity={item.activity}
            subject={subjectById[item.activity.subjectId]}
            onToggle={() => onToggle(item.activity.id)}
            onOpen={() => onOpen(item.activity.id)}
          />
        )
      }
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: LIST_BOTTOM_INSET,
        flexGrow: 1,
      }}
      ListEmptyComponent={
        <EmptyState
          icon={<ListChecks size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title={emptyTitle}
          text={emptyText}
          actionLabel={emptyAction?.label}
          onAction={emptyAction?.onPress}
        />
      }
    />
  );
}