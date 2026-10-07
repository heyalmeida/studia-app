import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListItem } from '@/components/ui/ListItem';
import { Monogram } from '@/components/ui/Monogram';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { isPast, relativeLabelBR } from '@/domain/date';
import type { Activity, Subject } from '@/domain/models';
import { useActivities } from '@/hooks/use-activities';

type ActivityFilter = 'pendentes' | 'todas' | 'concluidas';

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'todas', label: 'Todas' },
  { key: 'concluidas', label: 'Concluídas' },
];

const EMPTY_STATE: Record<ActivityFilter, { title: string; text: string }> = {
  pendentes: { title: 'Nenhuma atividade pendente.', text: 'Você está em dia.' },
  concluidas: { title: 'Nenhuma atividade concluída ainda.', text: '' },
  todas: { title: 'Nenhuma atividade ainda. \nCrie a primeira.', text: '' },
};

function openCreate() {
  router.push('/activity-form');
}

// Skeleton de carregamento: 3 cards vazios de altura fixa, sem spinner colorido.
function PlaceholderList() {
  return (
    <View className="flex-1 px-four pb-four">
      {[0, 1, 2].map((index) => (
        <Card key={index} style={{ height: 96, marginBottom: 16 }}>
          {null}
        </Card>
      ))}
    </View>
  );
}

/** Subcomponente local: só esta tela usa o filtro, então não vira biblioteca. */
function SegmentedFilter({
  value,
  onChange,
}: {
  value: ActivityFilter;
  onChange: (next: ActivityFilter) => void;
}) {
  return (
    <View className="flex-row gap-two">
      {FILTERS.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={
              selected
                ? 'flex-1 items-center justify-center rounded-chip border-[1.5px] border-border-strong bg-background px-two py-two'
                : 'flex-1 items-center justify-center rounded-chip border border-transparent bg-surface px-two py-two'
            }>
            <Text className={selected ? 'text-meta text-text' : 'text-meta text-text-secondary'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface ActivityRowProps {
  activity: Activity;
  subject: Subject | undefined;
  onToggle: () => void;
  onOpen: () => void;
}

function ActivityRow({ activity, subject, onToggle, onOpen }: ActivityRowProps) {
  const done = activity.status === 'concluida';
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra a linha (RNF-04)

  return (
    <ListItem onPress={onOpen}>
      <View className="flex-row items-center gap-three">
        {/* Pressable aninhado: no RN o mais interno captura o toque, então marcar não abre o editor. */}
        <Pressable
          onPress={onToggle}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Reabrir atividade' : 'Concluir atividade'}
          className="py-half">
          <View
            className={
              done
                ? 'h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-inverse bg-inverse'
                : 'h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-border-strong'
            }>
            {done ? <View className="h-0.5 w-2.5 rounded-sm bg-on-inverse" /> : null}
          </View>
        </Pressable>

        <View className="flex-1 gap-one">
          <Text
            className={done ? 'text-body font-semibold text-text-tertiary' : 'text-body font-semibold text-text'}
            style={done ? { textDecorationLine: 'line-through' } : undefined}
            numberOfLines={1}>
            {activity.title}
          </Text>
          <View className="flex-row items-center gap-two">
            <Monogram name={subjectName} size="sm" />
            <Text className="flex-shrink text-meta text-text-secondary" numberOfLines={1}>
              {subjectName}
            </Text>
          </View>
        </View>

        {activity.dueDate !== null ? (
          <Badge
            label={relativeLabelBR(activity.dueDate)}
            tone={isPast(activity.dueDate) ? 'inverse' : 'outline'}
          />
        ) : null}
      </View>
    </ListItem>
  );
}

export default function ActivitiesScreen() {
  const { activities, subjects, loading, error, refresh, toggleStatus } = useActivities();
  const [filter, setFilter] = useState<ActivityFilter>('pendentes');

  // Filtro aplicado DEPOIS do sortActivities (o hook já entrega a lista ordenada).
  const visible = useMemo(() => {
    if (filter === 'todas') return activities;
    const wanted = filter === 'pendentes' ? 'pendente' : 'concluida';
    return activities.filter((activity) => activity.status === wanted);
  }, [activities, filter]);

  const subjectById = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const subject of subjects) map[subject.id] = subject;
    return map;
  }, [subjects]);

  const ready = !loading && error === null;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Atividades" action={{ label: '+ Nova atividade', onPress: openCreate }} />

      {loading ? <PlaceholderList /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {ready ? (
        <>
          <View className="px-four pb-three">
            <SegmentedFilter value={filter} onChange={setFilter} />
          </View>
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ActivityRow
                activity={item}
                subject={subjectById[item.subjectId]}
                onToggle={() => void toggleStatus(item.id)}
                onOpen={() => router.push(`/activity-form?id=${encodeURIComponent(item.id)}`)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
            ListEmptyComponent={
              <EmptyState title={EMPTY_STATE[filter].title} text={EMPTY_STATE[filter].text} />
            }
          />
        </>
      ) : null}
    </View>
  );
}
