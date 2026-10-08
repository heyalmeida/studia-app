import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { ActivitySectionList } from '@/components/ActivitiesPage/ActivitySectionList';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FadeIn, SegmentedControl } from '@/components/ui/SegmentedControl';
import { Palette } from '@/constants/theme';
import type { Subject } from '@/domain/models';
import { useActivities } from '@/hooks/use-activities';
import ListX from 'lucide-react-native/icons/list-x';

type ActivityFilter = 'pendentes' | 'todas' | 'concluidas';

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'todas', label: 'Todas' },
  { key: 'concluidas', label: 'Concluídas' },
];

const EMPTY_STATE: Record<ActivityFilter, { title: string; text: string }> = {
  pendentes: { title: 'Nada pendente', text: 'Você está em dia.' },
  concluidas: { title: 'Nada concluído ainda', text: 'Marque uma atividade para vê-la aqui.' },
  todas: { title: 'Nenhuma atividade', text: 'Crie a primeira pelo botão flutuante.' },
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
      <ScreenHeader title="Atividades" />

      {loading ? <ListSkeleton height={72} count={4} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<ListX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          onAction={refresh}
        />
      ) : null}

      {ready ? (
        <>
          <View className="px-5 pb-1 pt-2">
            <SegmentedControl value={filter} options={FILTERS} onChange={setFilter} />
          </View>

          {/* key no filtro: a lista re-monta e a opacidade anima a troca (sem atraso). */}
          <FadeIn key={filter}>
            <ActivitySectionList
              activities={visible}
              subjectById={subjectById}
              onToggle={(id) => void toggleStatus(id)}
              onOpen={(id) => router.push(`/activity-form?id=${encodeURIComponent(id)}`)}
              emptyTitle={EMPTY_STATE[filter].title}
              emptyText={EMPTY_STATE[filter].text}
            />
          </FadeIn>
        </>
      ) : null}

      {ready ? (
        <FAB label="Nova atividade" onPress={openCreate} />
      ) : null}
    </View>
  );
}