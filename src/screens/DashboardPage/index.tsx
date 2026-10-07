import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { DueSoonCard } from '@/components/DashboardPage/DueSoonCard';
import { NextAssessmentRow } from '@/components/DashboardPage/NextAssessmentRow';
import { SectionLabel } from '@/components/DashboardPage/SectionLabel';
import { SubjectProgressRow } from '@/components/DashboardPage/SubjectProgressRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { Subject } from '@/domain/models';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { summary, subjectProgress, subjects, loading, error, refresh } = useDashboard();

  // Lookup de matéria para as linhas de atividade/avaliação (nunca usar o id do item).
  const subjectById = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const subject of subjects) map[subject.id] = subject;
    return map;
  }, [subjects]);

  // CA-09.2: com as 3 coleções vazias o painel é um convite ao primeiro cadastro, não zeros.
  // `progress.total` cobre a coleção inteira de atividades; `nextAssessments` cobre avaliações
  // agendadas (vazia = nenhuma avaliação agendada; realizadas sozinhas não têm o que mostrar aqui).
  const isEmpty =
    subjects.length === 0 &&
    summary.progress.total === 0 &&
    summary.nextAssessments.length === 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Painel" />

      {loading ? <ListSkeleton height={96} /> : null}

      {!loading && error !== null ? (
        <EmptyState title="Deu errado" text={error} actionLabel="Tentar de novo" onAction={refresh} />
      ) : null}

      {!loading && error === null && isEmpty ? (
        <EmptyState
          title="Bem-vindo ao Studia"
          text="Cadastre sua primeira matéria para começar."
          actionLabel="+ Nova matéria"
          onAction={() => router.push('/subject-form')}
        />
      ) : null}

      {!loading && error === null && !isEmpty ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 32 }}>
          {/* Pendências: total + o que vence nesta semana. */}
          <View className="gap-three">
            <SectionLabel
              title="Pendências"
              actionLabel="Ver atividades"
              onAction={() => router.push('/activities')}
            />
            <View className="gap-half">
              <Text className="text-metric font-bold text-text">{summary.pendingTotal}</Text>
            </View>
            {summary.dueSoon.length === 0 ? (
              <Text className="text-body text-text-secondary">Nada vencendo nesta semana.</Text>
            ) : (
              summary.dueSoon.map((activity) => (
                <DueSoonCard
                  key={activity.id}
                  activity={activity}
                  subject={subjectById[activity.subjectId]}
                />
              ))
            )}
          </View>

          {/* Próximas avaliações. */}
          <View className="gap-three">
            <SectionLabel
              title="Próximas avaliações"
              actionLabel="Ver avaliações"
              onAction={() => router.push('/assessments')}
            />
            {summary.nextAssessments.length === 0 ? (
              <Text className="text-body text-text-secondary">Nenhuma avaliação agendada.</Text>
            ) : (
              summary.nextAssessments.map((assessment) => (
                <NextAssessmentRow
                  key={assessment.id}
                  assessment={assessment}
                  subject={subjectById[assessment.subjectId]}
                />
              ))
            )}
          </View>

          {/* Progresso: agregado geral + top 3 matérias. */}
          <View className="gap-three">
            <SectionLabel
              title="Progresso"
              actionLabel="Ver matérias"
              onAction={() => router.push('/subjects')}
            />
            <View className="gap-two">
              <Text className="text-body text-text-secondary">
                Concluídas {summary.progress.done}/{summary.progress.total}
              </Text>
              <ProgressBar ratio={summary.progress.ratio} />
            </View>
            {subjectProgress.length === 0 ? (
              <Text className="text-body text-text-secondary">
                Nenhuma atividade cadastrada ainda.
              </Text>
            ) : (
              subjectProgress.map((entry) => (
                <SubjectProgressRow
                  key={entry.subject.id}
                  subject={entry.subject}
                  progress={entry.progress}
                />
              ))
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}