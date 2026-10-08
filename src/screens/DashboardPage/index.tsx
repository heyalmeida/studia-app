import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashCard } from '@/components/ui/DashCard';
import { DonutChart } from '@/components/ui/DonutChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { LineChart } from '@/components/ui/LineChart';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { summary, subjects, loading, error, refresh, weeklyCompleted } = useDashboard();

  // CA-09.2: com as 3 coleções vazias o painel é um convite ao primeiro cadastro, não zeros.
  const isEmpty =
    subjects.length === 0 &&
    summary.progress.total === 0 &&
    summary.nextAssessments.length === 0;

  const weeklyTotal = weeklyCompleted.reduce((sum, day) => sum + day.value, 0);

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
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
          {/* (a) Progresso geral: rosca + barra full-width. */}
          <DashCard
            title="Progresso geral"
            value={`Concluídas ${summary.progress.done}/${summary.progress.total}`}>
            <View className="flex-row items-center gap-four">
              <DonutChart ratio={summary.progress.ratio} size="md" />
              <View className="flex-1 gap-two">
                <Text className="text-meta text-text-secondary">
                  {summary.progress.total - summary.progress.done} pendente(s) de {summary.progress.total}
                </Text>
                <ProgressBar ratio={summary.progress.ratio} />
              </View>
            </View>
          </DashCard>

          {/* (b) Linha semanal de atividades concluídas (7 dias). */}
          <DashCard title="Tarefas concluídas (7 dias)" value={weeklyTotal}>
            {weeklyTotal === 0 ? (
              <Text className="text-meta text-text-secondary">
                Sem atividades concluídas nesta semana.
              </Text>
            ) : (
              <LineChart data={weeklyCompleted} height={120} />
            )}
          </DashCard>

          {/* (c) Pendências: valor grande + atalho (sem lista longa). */}
          <DashCard
            title="Pendências"
            value={summary.pendingTotal}
            subtitle="atividade(s) sem prazo ou vencendo">
            <View className="gap-two">
              <Badge label={summary.dueSoon.length > 0 ? 'Atenção: há prazos próximos' : 'Sem prazos urgentes'} />
              <Button label="Ver todas" variant="secondary" onPress={() => router.push('/activities')} />
            </View>
          </DashCard>

          {/* (d) Próximas avaliações: valor + atalho (sem lista longa). */}
          <DashCard
            title="Próximas avaliações"
            value={summary.nextAssessments.length}
            subtitle="avaliação(ões) agendada(s)">
            <Button
              label="Ver avaliações"
              variant="secondary"
              onPress={() => router.push('/assessments')}
            />
          </DashCard>
        </ScrollView>
      ) : null}
    </View>
  );
}
