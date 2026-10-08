import { router } from 'expo-router';
import CalendarX from 'lucide-react-native/icons/calendar-x';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCard } from '@/components/AssessmentsPage/AssessmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Palette, SCREEN_PADDING, listBottomInset } from '@/constants/theme';
import type { Subject } from '@/domain/models';
import { useAssessments } from '@/hooks/use-assessments';

export default function AssessmentsPage() {
  const insets = useSafeAreaInsets();
  const { assessments, subjects, loading, error, refresh, toggleStatus } = useAssessments();

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
          data={assessments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssessmentCard
              assessment={item}
              subject={subjectById[item.subjectId]}
              onToggle={() => void toggleStatus(item.id)}
              onOpen={() => router.push(`/assessment-form?id=${encodeURIComponent(item.id)}`)}
            />
          )}
          // Reserva tab bar + FAB: a última avaliação nunca fica sob o botão flutuante.
          contentContainerStyle={[
            styles.list,
            { paddingBottom: listBottomInset(insets.bottom) },
          ]}
          ListEmptyComponent={
            <EmptyState
              icon={<CalendarX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
              title="Nenhuma avaliação"
              text="Cadastre provas e trabalhos para acompanhar as datas."
              actionLabel="Nova avaliação"
              onAction={openCreate}
            />
          }
        />
      ) : null}

      {!loading && error === null ? <FAB label="Nova avaliação" onPress={openCreate} /> : null}
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
});