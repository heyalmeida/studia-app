import { router } from 'expo-router';
import CalendarX from 'lucide-react-native/icons/calendar-x';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { AssessmentCard } from '@/components/AssessmentsPage/AssessmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { LIST_BOTTOM_INSET, Palette } from '@/constants/theme';
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
      <ScreenHeader title="Avaliações" />

      {loading ? <ListSkeleton height={96} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<CalendarX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: LIST_BOTTOM_INSET,
            gap: 12,
            flexGrow: 1,
          }}
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

      {!loading && error === null ? (
        <FAB label="Nova avaliação" onPress={openCreate} />
      ) : null}
    </View>
  );
}