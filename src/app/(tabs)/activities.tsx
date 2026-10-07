import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListItem } from '@/components/ui/ListItem';
import { Monogram } from '@/components/ui/Monogram';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { isPast, relativeLabelBR } from '@/domain/date';
import type { Activity, Subject } from '@/domain/models';
import { useActivities } from '@/hooks/use-activities';
import { useTheme } from '@/hooks/use-theme';

type ActivityFilter = 'pendentes' | 'todas' | 'concluidas';

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'todas', label: 'Todas' },
  { key: 'concluidas', label: 'Concluídas' },
];

const EMPTY_STATE: Record<ActivityFilter, { title: string; text: string }> = {
  pendentes: { title: 'Nenhuma atividade pendente.', text: 'Você está em dia.' },
  concluidas: { title: 'Nenhuma atividade concluída ainda.', text: '' },
  todas: { title: 'Nenhuma atividade ainda. Crie a primeira.', text: '' },
};

function openCreate() {
  router.push('/activity-form');
}

// Skeleton de carregamento: 3 cards vazios de altura fixa, sem spinner colorido.
function PlaceholderList() {
  return (
    <View style={styles.list}>
      {[0, 1, 2].map((index) => (
        <Card key={index} style={styles.placeholder}>{null}</Card>
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
  const colors = useTheme();

  return (
    <View style={styles.filterRow}>
      {FILTERS.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.filterChip,
              {
                backgroundColor: selected ? colors.background : colors.backgroundElement,
                borderColor: selected ? colors.borderStrong : 'transparent',
                borderWidth: selected ? 1.5 : 1,
              },
            ]}>
            <Text
              style={[
                styles.filterLabel,
                { color: selected ? colors.text : colors.textSecondary },
              ]}>
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
  const colors = useTheme();
  const done = activity.status === 'concluida';
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra a linha (RNF-04)

  return (
    <ListItem onPress={onOpen}>
      <View style={styles.row}>
        {/* Pressable aninhado: no RN o mais interno captura o toque, então marcar não abre o editor. */}
        <Pressable
          onPress={onToggle}
          hitSlop={Spacing.two}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Reabrir atividade' : 'Concluir atividade'}
          style={styles.checkboxHit}>
          <View
            style={[
              styles.checkbox,
              done
                ? { backgroundColor: colors.surfaceInverse, borderColor: colors.surfaceInverse }
                : { borderColor: colors.borderStrong },
            ]}>
            {done ? <View style={[styles.checkboxMark, { backgroundColor: colors.textOnInverse }]} /> : null}
          </View>
        </Pressable>

        <View style={styles.info}>
          <Text
            style={[styles.title, done ? styles.titleDone : null, { color: done ? colors.textTertiary : colors.text }]}
            numberOfLines={1}>
            {activity.title}
          </Text>
          <View style={styles.metaRow}>
            <Monogram name={subjectName} size="sm" />
            <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
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
  const colors = useTheme();
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Atividades" action={{ label: '+ Nova atividade', onPress: openCreate }} />

      {loading ? <PlaceholderList /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {ready ? (
        <>
          <View style={styles.filterBar}>
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
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <EmptyState title={EMPTY_STATE[filter].title} text={EMPTY_STATE[filter].text} />
            }
          />
        </>
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
  placeholder: {
    height: 96,
    marginBottom: Spacing.three,
  },
  filterBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filterChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.chip,
  },
  filterLabel: {
    ...Typography.meta,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkboxHit: {
    paddingVertical: Spacing.half,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMark: {
    width: 10,
    height: 2,
    borderRadius: 1,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    ...Typography.bodyStrong,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  meta: {
    ...Typography.meta,
    flexShrink: 1,
  },
});