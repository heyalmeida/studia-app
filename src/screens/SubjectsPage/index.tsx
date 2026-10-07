import { router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { SubjectCard } from '@/components/SubjectsPage/SubjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useSubjects } from '@/hooks/use-subjects';

export default function SubjectsPage() {
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();

  function openCreate() {
    router.push('/subject-form');
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Matérias" action={{ label: '+ Nova matéria', onPress: openCreate }} />

      {loading ? <ListSkeleton height={116} /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {!loading && error === null ? (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard
              subject={item}
              pending={activitiesCount[item.id]?.pending ?? 0}
              scheduled={assessmentsCount[item.id] ?? 0}
              ratio={progress[item.id] ?? 0}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma matéria ainda"
              text="Cadastre a primeira matéria para organizar suas atividades e provas."
              actionLabel="+ Nova matéria"
              onAction={openCreate}
            />
          }
        />
      ) : null}
    </View>
  );
}
