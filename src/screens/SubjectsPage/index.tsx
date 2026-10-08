import { router } from 'expo-router';
import BookX from 'lucide-react-native/icons/book-x';
import { FlatList, View } from 'react-native';

import { SubjectCard } from '@/components/SubjectsPage/SubjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { LIST_BOTTOM_INSET, Palette } from '@/constants/theme';
import { useSubjects } from '@/hooks/use-subjects';

export default function SubjectsPage() {
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();

  function openCreate() {
    router.push('/subject-form');
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Matérias" />

      {loading ? <ListSkeleton height={124} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          onAction={refresh}
        />
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: LIST_BOTTOM_INSET,
            gap: 12,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <EmptyState
              icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
              title="Nenhuma matéria ainda"
              text="Cadastre a primeira para organizar atividades e avaliações."
              actionLabel="Nova matéria"
              onAction={openCreate}
            />
          }
        />
      ) : null}

      {!loading && error === null ? (
        <FAB label="Nova matéria" onPress={openCreate} />
      ) : null}
    </View>
  );
}