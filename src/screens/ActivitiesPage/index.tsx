import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { ActivityRow } from '@/components/ActivitiesPage/ActivityRow';
import { SegmentedFilter, type ActivityFilter } from '@/components/ActivitiesPage/SegmentedFilter';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { Subject } from '@/domain/models';
import { useActivities } from '@/hooks/use-activities';

const EMPTY_STATE: Record<ActivityFilter, { title: string; text: string }> = {
  pendentes: { title: 'Nenhuma atividade pendente.', text: 'Você está em dia.' },
  concluidas: { title: 'Nenhuma atividade concluída ainda.', text: '' },
  todas: { title: 'Nenhuma atividade ainda.', text: 'Crie a primeira.' },
};

export default function ActivitiesPage() {
  const { activities, subjects, loading, error, refresh, toggleStatus } = useActivities();
  const [filter, setFilter] = useState<ActivityFilter>('pendentes');

  // Filtro aplicado DEPOIS do sortActivities (o hook já entrega a lista ordenada).
  const visible = useMemo(() => {
    if (filter === 'todas') return activities;
    const wanted = filter === 'pendentes' ? 'pendente' : 'concluida';
    return activities.filter((activity) => activity.status === wanted);
  }, [activities, filter]);

  const subjectById = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const subject of subjects) map[subject.id] = subject;
    return map;
  }, [subjects]);

  const ready = !loading && error === null;

  function openCreate() {
    router.push('/activity-form');
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Atividades" action={{ label: '+ Nova atividade', onPress: openCreate }} />

      {loading ? <ListSkeleton height={96} /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {ready ? (
        <>
          <View className="px-four pb-three">
            <SegmentedFilter value={filter} onChange={setFilter} />
          </View>
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ActivityRow
                activity={item}
                subject={subjectById[item.subjectId]}
                onToggle={() => void toggleStatus(item.id)}
                onOpen={() => router.push(`/activity-form?id=${encodeURIComponent(item.id)}`)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
            ListEmptyComponent={
              <EmptyState title={EMPTY_STATE[filter].title} text={EMPTY_STATE[filter].text} />
            }
          />
        </>
      ) : null}
    </View>
  );
}
