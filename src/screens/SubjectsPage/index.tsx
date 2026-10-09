import { router } from 'expo-router';
import BookX from 'lucide-react-native/icons/book-x';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubjectCard } from '@/components/SubjectsPage/SubjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FAB } from '@/components/ui/FAB';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Palette, SCREEN_PADDING, Spacing, listBottomInset } from '@/constants/theme';
import { matchesSearch } from '@/domain/filtering';
import { useSubjects } from '@/hooks/use-subjects';

export default function SubjectsPage() {
  const insets = useSafeAreaInsets();
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();
  const [query, setQuery] = useState('');

  // Slice 7: a lista de matérias não tem filtro por matéria (ela É a lista de matérias) —
  // só a busca, por nome ou professor. A ordem que o hook entrega é preservada.
  const visible = useMemo(
    () => subjects.filter((subject) => matchesSearch(query, [subject.name, subject.teacher])),
    [subjects, query],
  );
  const searching = query.trim().length > 0;

  function openCreate() {
    router.push('/subject-form');
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Matérias" createAction={{ label: 'Nova matéria', onPress: openCreate }} />

      <View style={styles.search}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar matéria..."
        />
      </View>

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
          data={visible}
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
            searching === true ? (
              // Lista existia e a busca zerou o resultado (AC-7.5): a ação desfaz a busca,
              // não cria matéria — o que criar é o botão do header.
              <EmptyState
                icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
                title="Nenhum resultado"
                text="Nenhuma matéria combina com a busca."
                actionLabel="Limpar busca"
                actionWithIcon={false}
                onAction={() => setQuery('')}
              />
            ) : (
              <EmptyState
                icon={<BookX size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
                title="Nenhuma matéria ainda"
                text="Cadastre a primeira para organizar atividades e avaliações."
                actionLabel="Nova matéria"
                onAction={openCreate}
              />
            )
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
  search: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: Spacing.three,
  },
});