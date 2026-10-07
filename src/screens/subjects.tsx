import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Monogram } from '@/components/ui/Monogram';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { Subject } from '@/domain/models';
import { useSubjects } from '@/hooks/use-subjects';

const CREATE_HREF = '/subject-form';

function openCreate() {
  router.push(CREATE_HREF);
}

// Skeleton de carregamento: 3 cards vazios de altura fixa, sem spinner colorido.
function PlaceholderList() {
  return (
    <View className="flex-1 px-four pb-four">
      {[0, 1, 2].map((index) => (
        <Card key={index} style={{ height: 116, marginBottom: 16 }}>
          {null}
        </Card>
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
  return (
    <Card
      onPress={() => router.push(`${CREATE_HREF}?id=${encodeURIComponent(subject.id)}`)}
      style={{ marginBottom: 16, gap: 16 }}>
      <View className="flex-row items-center gap-three">
        <Monogram name={subject.name} size="md" />
        <View className="flex-1 gap-half">
          <Text className="flex-shrink text-body font-semibold text-text" numberOfLines={1} ellipsizeMode="tail">
            {subject.name}
          </Text>
          <Text className="text-meta text-text-tertiary" numberOfLines={1}>
            {subject.teacher ?? 'Sem professor'}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between gap-one">
        <Text className="text-meta text-text-secondary">{pending} pendente(s)</Text>
        <Text className="text-meta text-text-secondary">
          {scheduled} avaliação(ões) agendada(s)
        </Text>
      </View>

      <ProgressBar ratio={ratio} />
    </Card>
  );
}

export default function SubjectsScreen() {
  const { subjects, activitiesCount, assessmentsCount, progress, loading, error, refresh } =
    useSubjects();

  return (
    <View className="flex-1 bg-background">
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
