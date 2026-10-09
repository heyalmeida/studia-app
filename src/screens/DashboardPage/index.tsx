import Inbox from "lucide-react-native/icons/inbox";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Greeting } from "@/components/DashboardPage/Greeting";
import { NextAssessmentCard } from "@/components/DashboardPage/NextAssessmentCard";
import { ProgressSummaryCard } from "@/components/DashboardPage/ProgressSummaryCard";
import { UpcomingList } from "@/components/DashboardPage/UpcomingList";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Palette, SCREEN_PADDING, contentBottomInset } from "@/constants/theme";
import type { Subject } from "@/domain/models";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const insets = useSafeAreaInsets();
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
    <View style={styles.root}>
      <ScreenHeader title="Painel" />

      {loading ? <ListSkeleton height={120} /> : null}

      {!loading && error !== null ? (
        <EmptyState
          icon={
            <Inbox size={40} color={Palette.textTertiary} strokeWidth={1.5} />
          }
          title="Deu errado"
          text={error}
          actionLabel="Tentar de novo"
          actionWithIcon={false}
          onAction={refresh}
        />
      ) : null}

      {!loading && error === null && isEmpty ? (
        <EmptyState
          icon={
            <Inbox size={40} color={Palette.textTertiary} strokeWidth={1.5} />
          }
          title="Comece pela matéria"
          text="Cadastre uma matéria para registrar atividades e avaliações."
        />
      ) : null}

      {!loading && error === null && !isEmpty ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            // O painel não cria item: basta não ficar atrás da tab bar flutuante.
            { paddingBottom: contentBottomInset(insets.bottom) },
          ]}
        >
          <Greeting />

          <ProgressSummaryCard
            ratio={summary.progress.ratio}
            done={summary.progress.done}
            total={summary.progress.total}
            dueThisWeek={summary.dueThisWeek}
          />

          <UpcomingList
            activities={summary.upcoming}
            subjectById={subjectById}
          />

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
    gap: 12,
  },
});
