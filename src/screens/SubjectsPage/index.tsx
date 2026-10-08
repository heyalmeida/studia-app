import { router } from 'expo-router';
import BookX from 'lucide-react-native/icons/book-x';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubjectCard } from '@/components/SubjectsPage/SubjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Palette, SCREEN_PADDING, listBottomInset } from '@/constants/theme';
import { useSubjects } from '@/hooks/use-subjects';

export default function SubjectsPage() {
  const insets = useSafeAreaInsets();
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();

  function openCreate() {
    router.push('/subject-form');
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Matérias" createAction={{ label: 'Nova matéria', onPress: openCreate }} />

      {loading ? <ListSkeleton height={124} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          actionWithIcon={false}
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
          // Reserva tab bar + FAB: a última matéria nunca fica sob o botão flutuante.
          contentContainerStyle={[
            styles.list,
            { paddingBottom: listBottomInset(insets.bottom) },
          ]}
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

      {!loading && error === null ? <FAB label="Nova matéria" onPress={openCreate} /> : null}
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