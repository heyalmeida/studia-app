import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Monogram } from '@/components/ui/Monogram';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacing, Typography } from '@/constants/theme';
import type { Subject } from '@/domain/models';
import { useSubjects } from '@/hooks/use-subjects';
import { useTheme } from '@/hooks/use-theme';

const CREATE_HREF = '/subject-form';

function openCreate() {
  router.push(CREATE_HREF);
}

// Skeleton de carregamento: 3 cards vazios de altura fixa, sem spinner colorido (seção 2 da
// identidade visual — estados sem cor).
function PlaceholderList() {
  return (
    <View style={styles.list}>
      {[0, 1, 2].map((index) => (
        <Card key={index} style={styles.placeholder}>{null}</Card>
      ))}
    </View>
  );
}

interface SubjectCardProps {
  subject: Subject;
  pending: number;
  scheduled: number;
  ratio: number;
}

// Os agregados vêm da tela: um useSubjects() por card abriria/reinscreveria o repositório
// várias vezes sem motivo.
function SubjectCard({ subject, pending, scheduled, ratio }: SubjectCardProps) {
  const colors = useTheme();

  return (
    <Card
      onPress={() => router.push(`${CREATE_HREF}?id=${encodeURIComponent(subject.id)}`)}
      style={styles.card}>
      <View style={styles.row}>
        <Monogram name={subject.name} size="md" />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
            {subject.name}
          </Text>
          <Text style={[styles.meta, { color: colors.textTertiary }]} numberOfLines={1}>
            {subject.teacher ?? 'Sem professor'}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{pending} pendente(s)</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {scheduled} avaliação(ões) agendada(s)
        </Text>
      </View>

      <ProgressBar ratio={ratio} />
    </Card>
  );
}

export default function SubjectsScreen() {
  const colors = useTheme();
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Matérias" action={{ label: '+ Nova matéria', onPress: openCreate }} />

      {loading ? <PlaceholderList /> : null}

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
          contentContainerStyle={styles.list}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    flexGrow: 1,
  },
  card: {
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  name: {
    ...Typography.bodyStrong,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  meta: {
    ...Typography.meta,
  },
  placeholder: {
    height: 116,
    marginBottom: Spacing.three,
  },
});
