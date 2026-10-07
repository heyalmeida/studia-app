import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { AssessmentRow } from '@/components/AssessmentsPage/AssessmentRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { Subject } from '@/domain/models';
import { useAssessments } from '@/hooks/use-assessments';

export default function AssessmentsPage() {
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
    <View className="flex-1 bg-background">
      <ScreenHeader title="Avaliações" action={{ label: '+ Nova avaliação', onPress: openCreate }} />

      {loading ? <ListSkeleton height={96} /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {!loading && error === null ? (
        <FlatList
          data={assessments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssessmentRow
              assessment={item}
              subject={subjectById[item.subjectId]}
              onToggle={() => void toggleStatus(item.id)}
              onOpen={() => router.push(`/assessment-form?id=${encodeURIComponent(item.id)}`)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma avaliação ainda"
              text="Cadastre suas provas para acompanhar as datas."
              actionLabel="+ Nova avaliação"
              onAction={openCreate}
            />
          }
        />
      ) : null}
    </View>
  );
}