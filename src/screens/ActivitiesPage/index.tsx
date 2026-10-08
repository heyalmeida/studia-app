import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListX from 'lucide-react-native/icons/list-x';

import { ActivitySectionList } from '@/components/ActivitiesPage/ActivitySectionList';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FadeIn, SegmentedControl } from '@/components/ui/SegmentedControl';
import { Palette, SCREEN_PADDING } from '@/constants/theme';
import type { Subject } from '@/domain/models';
import { useActivities } from '@/hooks/use-activities';

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
  const insets = useSafeAreaInsets();
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
    <View style={styles.root}>
      <ScreenHeader
        title="Atividades"
        createAction={{ label: 'Nova atividade', onPress: openCreate }}
      />

      {loading ? <ListSkeleton height={72} count={4} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<ListX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          actionWithIcon={false}
          onAction={refresh}
        />
      ) : null}

      {ready ? (
        <>
          <View style={styles.filters}>
            <SegmentedControl value={filter} options={FILTERS} onChange={setFilter} />
          </View>

          {/* key no filtro: a lista re-monta e a opacidade anima a troca (sem atraso). */}
          <FadeIn key={filter}>
            <ActivitySectionList
              activities={visible}
              subjectById={subjectById}
              insetsBottom={insets.bottom}
              onToggle={(id) => void toggleStatus(id)}
              onOpen={(id) => router.push(`/activity-form?id=${encodeURIComponent(id)}`)}
              emptyTitle={EMPTY_STATE[filter].title}
              emptyText={EMPTY_STATE[filter].text}
              emptyAction={
                // Só o filtro "todas" vazio significa "nada cadastrado": aí há o que criar.
                filter === 'todas' ? { label: 'Nova atividade', onPress: openCreate } : undefined
              }
            />
          </FadeIn>
        </>
      ) : null}

      {ready ? <FAB label="Nova atividade" onPress={openCreate} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  filters: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
    paddingBottom: 4,
  },
});