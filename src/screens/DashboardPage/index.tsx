import { router } from 'expo-router';
import Inbox from 'lucide-react-native/icons/inbox';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { Greeting } from '@/components/DashboardPage/Greeting';
import { NextAssessmentCard } from '@/components/DashboardPage/NextAssessmentCard';
import { ProgressSummaryCard } from '@/components/DashboardPage/ProgressSummaryCard';
import { UpcomingList } from '@/components/DashboardPage/UpcomingList';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { LIST_BOTTOM_INSET, Palette } from '@/constants/theme';
import type { Subject } from '@/domain/models';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { summary, subjects, loading, error, refresh } = useDashboard();

  // CA-09.2: com as 3 coleções vazias o painel é um convite ao primeiro cadastro, não zeros.
  const isEmpty =
    subjects.length === 0 &&
    summary.progress.total === 0 &&
    summary.nextAssessments.length === 0;

  const subjectById = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const subject of subjects) map[subject.id] = subject;
    return map;
  }, [subjects]);

  const nextAssessment = summary.nextAssessments[0];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Painel" />

      {loading ? <ListSkeleton height={120} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={<Inbox size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          onAction={refresh}
        />
      ) : null}

      {!loading && error === null && isEmpty ? (
        <EmptyState
          icon={<Inbox size={40} color={Palette.textTertiary} strokeWidth={1.5} />}
          title="Comece pela matéria"
          text="Cadastre uma matéria para registrar atividades e avaliações."
          actionLabel="Nova matéria"
          onAction={() => router.push('/subject-form')}
        />
      ) : null}

      {!loading && error === null && !isEmpty ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: LIST_BOTTOM_INSET,
            gap: 12,
          }}>
          <Greeting />

          <ProgressSummaryCard
            ratio={summary.progress.ratio}
            done={summary.progress.done}
            total={summary.progress.total}
            dueThisWeek={summary.dueThisWeek}
          />

          <UpcomingList activities={summary.upcoming} subjectById={subjectById} />

          {nextAssessment !== undefined ? (
            <NextAssessmentCard
              assessment={nextAssessment}
              subject={subjectById[nextAssessment.subjectId]}
            />
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
}