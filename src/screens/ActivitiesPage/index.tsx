import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListX from 'lucide-react-native/icons/list-x';

import { ActivitySectionList } from '@/components/ActivitiesPage/ActivitySectionList';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { FadeIn, SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubjectFilterRow } from '@/components/ui/SubjectFilterRow';
import { Palette, SCREEN_PADDING, Spacing } from '@/constants/theme';
import { filterBySubject, matchesSearch } from '@/domain/filtering';
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
  todas: { title: 'Nenhuma atividade', text: 'Toque no botão + no centro da barra inferior.' },
};

export default function ActivitiesPage() {
  const insets = useSafeAreaInsets();
  const { activities, subjects, loading, error, refresh, toggleStatus } = useActivities();
  const [filter, setFilter] = useState<ActivityFilter>('pendentes');
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // Os três filtros são uma **interseção** (AC-7.2) e valem sobre a lista que o hook já
  // entregou ordenada (`sortActivities`): filtrar nunca reordena, então a ordem por prazo e
  // a posição relativa dos itens continuam válidas com filtro ativo.
  const visible = useMemo(() => {
    const byStatus =
      filter === 'todas'
        ? activities
        : activities.filter((activity) => activity.status === (filter === 'pendentes' ? 'pendente' : 'concluida'));
    const bySubject = filterBySubject(byStatus, subjectFilter);
    return bySubject.filter((activity) => matchesSearch(query, [activity.title]));
  }, [activities, filter, subjectFilter, query]);

  // Havia atividades mas os filtros zeraram o resultado (AC-7.5) — situação diferente da
  // lista realmente vazia, que é o estado inicial e mantém o CTA de criação.
  const filteredToNothing = activities.length > 0 && visible.length === 0;

  function clearFilters() {
    setQuery('');
    setSubjectFilter(null);
    setFilter('pendentes');
  }

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

      <View style={styles.search}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar atividade..."
        />
      </View>

      <SubjectFilterRow
        subjects={subjects}
        selected={subjectFilter}
        onChange={setSubjectFilter}
      />

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

      {loading ? <ListSkeleton height={72} count={4} /> : null}

      {ready ? (
        <>
          <View style={styles.filters}>
            <SegmentedControl value={filter} options={FILTERS} onChange={setFilter} />
          </View>

          {/* key nos três filtros: a lista re-monta e a opacidade anima a troca (sem atraso). */}
          <FadeIn key={`${filter}:${query}:${subjectFilter ?? ''}`}>
            <ActivitySectionList
              activities={visible}
              subjectById={subjectById}
              insetsBottom={insets.bottom}
              onToggle={(id) => void toggleStatus(id)}
              onOpen={(id) => router.push(`/activity-form?id=${encodeURIComponent(id)}`)}
              emptyTitle={filteredToNothing === true ? 'Nenhum resultado' : EMPTY_STATE[filter].title}
              emptyText={
                filteredToNothing === true
                  ? 'Nenhuma atividade combina com os filtros.'
                  : EMPTY_STATE[filter].text
              }
              // O vazio pós-filtro (AC-7.5) tem ação: limpar. O vazio real não cria CTA aqui —
              // o botão de criação mora no centro da tab bar (2026-10-09).
              emptyAction={
                filteredToNothing === true
                  ? { label: 'Limpar filtros', onPress: clearFilters }
                  : undefined
              }
            />
          </FadeIn>
        </>
      ) : null}
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
  search: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 4,
    paddingBottom: Spacing.three,
  },
});