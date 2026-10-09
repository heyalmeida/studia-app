import { router } from 'expo-router';
import CalendarX from 'lucide-react-native/icons/calendar-x';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCard } from '@/components/AssessmentsPage/AssessmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { SubjectFilterRow } from '@/components/ui/SubjectFilterRow';
import { Palette, SCREEN_PADDING, Spacing, contentBottomInset } from '@/constants/theme';
import { filterBySubject, matchesSearch } from '@/domain/filtering';
import type { Subject } from '@/domain/models';
import { useAssessments } from '@/hooks/use-assessments';

export default function AssessmentsPage() {
  const insets = useSafeAreaInsets();
  const { assessments, subjects, loading, error, refresh, toggleStatus } = useAssessments();
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // Slice 7: busca e filtro por matéria valem sobre a lista que o hook já entregou ordenada
  // (agendadas por proximidade, realizadas por data desc) — filtrar não reordena.
  const visible = useMemo(
    () =>
      filterBySubject(assessments, subjectFilter).filter((assessment) =>
        matchesSearch(query, [assessment.title]),
      ),
    [assessments, subjectFilter, query],
  );

  // Havia avaliações mas os filtros zeraram o resultado (AC-7.5) — situação diferente da
  // lista realmente vazia, que é o estado inicial e mantém o CTA de criação.
  const filteredToNothing = assessments.length > 0 && visible.length === 0;

  function clearFilters() {
    setQuery('');
    setSubjectFilter(null);
  }

  // A lista JÁ vem ordenada pelo hook (agendadas por proximidade, realizadas por data desc).
  const subjectById = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const subject of subjects) map[subject.id] = subject;
    return map;
  }, [subjects]);

  function openCreate() {
    router.push('/assessment-form');
  }

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Avaliações"
        createAction={{ label: 'Nova avaliação', onPress: openCreate }}
      />

      <View style={styles.search}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar avaliação..."
        />
      </View>

      <SubjectFilterRow
        subjects={subjects}
        selected={subjectFilter}
        onChange={setSubjectFilter}
      />

      {loading ? <ListSkeleton height={96} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<CalendarX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          actionWithIcon={false}
          onAction={refresh}
        />
      ) : null}

      {!loading && error === null ? (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssessmentCard
              assessment={item}
              subject={subjectById[item.subjectId]}
              onToggle={() => void toggleStatus(item.id)}
              onOpen={() => router.push(`/assessment-form?id=${encodeURIComponent(item.id)}`)}
            />
          )}
          // Reserva a tab bar (com o botão central de criação): a última avaliação nunca fica
          // sob a barra flutuante.
          contentContainerStyle={[
            styles.list,
            { paddingBottom: contentBottomInset(insets.bottom) },
          ]}
          ListEmptyComponent={
            filteredToNothing === true ? (
              // Lista existia e os filtros zeraram o resultado (AC-7.5): a ação desfaz os
              // filtros, não cria avaliação — o que cria é o botão do header.
              <EmptyState
                icon={<CalendarX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
                title="Nenhum resultado"
                text="Nenhuma avaliação combina com os filtros."
                actionLabel="Limpar filtros"
                actionWithIcon={false}
                onAction={clearFilters}
              />
            ) : (
              <EmptyState
                icon={<CalendarX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
                title="Nenhuma avaliação"
                text="Cadastre provas e trabalhos para acompanhar as datas."
              />
            )
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  list: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 4,
    gap: 12,
    flexGrow: 1,
  },
  search: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 4,
    paddingBottom: Spacing.three,
  },
});