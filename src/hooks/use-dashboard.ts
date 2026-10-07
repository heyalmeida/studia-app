import { useCallback, useEffect, useMemo, useState } from 'react';

import { activityRepository } from '@/storage/activity.repository';
import { assessmentRepository } from '@/storage/assessment.repository';
import { subscribe } from '@/storage/notifier';
import { subjectRepository } from '@/storage/subject.repository';
import { daysUntil, formatDDMMYYYY, parseDDMMYYYY } from '@/domain/date';
import type { Activity, Assessment, Subject } from '@/domain/models';
import { progressSummary, subjectProgress, type SubjectProgress } from '@/domain/progress';
import { sortActivities, sortAssessments } from '@/domain/sorting';

const LOAD_ERROR = 'Falha ao carregar seus dados.';

/** Janela de "pendências": vence hoje ou nos próximos 7 dias (inclui o que já venceu). */
const DUE_SOON_WINDOW_DAYS = 7;
/** Teto de itens exibidos em cada lista compacta do painel. */
const PREVIEW_LIMIT = 3;

export interface DashboardSummary {
  /** Total de atividades pendentes (independente do prazo). */
  pendingTotal: number;
  /** Pendentes com dueDate dentro da janela de 7 dias, ordenadas por sortActivities. */
  dueSoon: Activity[];
  /** Agendadas mais próximas, por data asc. */
  nextAssessments: Assessment[];
  /** Agregado geral de atividades (domain/progress.ts). */
  progress: { total: number; done: number; ratio: number };
}

export interface SubjectProgressEntry {
  subject: Subject;
  progress: SubjectProgress;
}

export interface UseDashboard {
  summary: DashboardSummary;
  /** Até 3 matérias com atividades, da maior para a menor razão de conclusão. */
  subjectProgress: SubjectProgressEntry[];
  /**
   * Matérias em ordem alfabética, para a tela resolver `subjectId` das linhas de atividade e
   * avaliação (monograma + nome). Não é derivação do painel: é a lista completa, o mesmo
   * critério de ordenação de `use-subjects`.
   */
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  refresh(): void;
}

interface Snapshot {
  subjects: Subject[];
  activities: Activity[];
  assessments: Assessment[];
}

/**
 * Lê as 3 coleções. Não toca em setState — quem aplica é quem consome via `.then`,
 * o que mantém o corpo do `useEffect` livre de setState síncrono (lint set-state-in-effect).
 */
function readSnapshot(): Promise<Snapshot> {
  return Promise.all([
    subjectRepository.getAll(),
    activityRepository.getAll(),
    assessmentRepository.getAll(),
  ]).then(([subjects, activities, assessments]) => ({ subjects, activities, assessments }));
}

/**
 * `dueDate` é data real, não string qualquer: o storage só garante que a coleção é um Array, e um
 * '2026-13-40' lido do JSON passaria. `daysUntil` devolveria 0 para isso, colocando a atividade na
 * janela de 7 dias sem motivo. O round-trip ISO -> DD/MM/AAAA -> ISO valida dia contra mês/ano
 * (o mesmo caminho de `parseDDMMYYYY`), sem duplicar regra de calendário aqui (RNF-04).
 */
function isRealDate(iso: string): boolean {
  return parseDDMMYYYY(formatDDMMYYYY(iso)) === iso;
}

/** Painel inicial (RF-09): só leitura das 3 coleções, agregações derivadas no domínio. */
export function useDashboard(): UseDashboard {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicação do snapshot via callback encadeado (não chamada direta no effect).
  const applySnapshot = useCallback((snapshot: Snapshot) => {
    setSubjects(snapshot.subjects);
    setActivities(snapshot.activities);
    setAssessments(snapshot.assessments);
    setError(null);
    setLoading(false);
  }, []);

  const load = useCallback(
    () =>
      readSnapshot()
        .then(applySnapshot)
        .catch(() => setError(LOAD_ERROR))
        .finally(() => setLoading(false)),
    [applySnapshot],
  );

  useEffect(() => {
    void load();
    // Qualquer escrita em qualquer coleção recompõe o painel (ADR-0005).
    const unsubscribe = [
      subscribe('subjects:changed', () => void load()),
      subscribe('activities:changed', () => void load()),
      subscribe('assessments:changed', () => void load()),
    ];
    return () => {
      for (const stop of unsubscribe) stop();
    };
  }, [load]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    void load();
  }, [load]);

  const sortedSubjects = useMemo(
    () =>
      [...subjects].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
      ),
    [subjects],
  );

  const summary = useMemo<DashboardSummary>(() => {
    const pending = activities.filter((activity) => activity.status === 'pendente');

    // sortActivities já põe pendentes com prazo antes; aqui só cortamos a janela de 7 dias.
    const dueSoon = sortActivities(pending)
      .filter(
        (activity) =>
          activity.dueDate !== null &&
          isRealDate(activity.dueDate) &&
          daysUntil(activity.dueDate) <= DUE_SOON_WINDOW_DAYS,
      )
      .slice(0, PREVIEW_LIMIT);

    const nextAssessments = sortAssessments(assessments)
      .filter((assessment) => assessment.status === 'agendada')
      .slice(0, PREVIEW_LIMIT);

    return {
      pendingTotal: pending.length,
      dueSoon,
      nextAssessments,
      progress: progressSummary(activities),
    };
  }, [activities, assessments]);

  // Nome local ≠ `subjectProgress` do domínio: mesmo nome aqui esconderia a função importada.
  const rankedSubjects = useMemo<SubjectProgressEntry[]>(() => {
    const entries: SubjectProgressEntry[] = [];
    for (const subject of subjects) {
      const progress = subjectProgress(subject.id, activities);
      // Matéria sem atividade não tem barra que signifique algo no painel.
      if (progress.total === 0) continue;
      entries.push({ subject, progress });
    }
    // Empate vai para o nome: a lista do painel precisa ser estável entre renders.
    return entries
      .sort((a, b) =>
        b.progress.ratio === a.progress.ratio
          ? a.subject.name.localeCompare(b.subject.name, 'pt-BR', { sensitivity: 'base' })
          : b.progress.ratio - a.progress.ratio,
      )
      .slice(0, PREVIEW_LIMIT);
  }, [subjects, activities]);

  return {
    summary,
    subjectProgress: rankedSubjects,
    subjects: sortedSubjects,
    loading,
    error,
    refresh,
  };
}