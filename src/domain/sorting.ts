import type { Activity, Assessment } from '@/domain/models';

function compareAsc(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function compareDesc(a: string, b: string): number {
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

/**
 * Ordena atividades: pendentes com prazo (data asc, empate createdAt asc) -> pendentes sem prazo
 * (createdAt asc) -> concluídas (completedAt desc, empate createdAt desc).
 * Devolve nova lista — nunca muta a entrada.
 */
export function sortActivities(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    const aPending = a.status === 'pendente';
    const bPending = b.status === 'pendente';
    if (aPending !== bPending) return aPending ? -1 : 1;

    if (aPending) {
      if (a.dueDate !== null && b.dueDate !== null) return compareAsc(a.dueDate, b.dueDate);
      if (a.dueDate !== null) return -1; // com prazo antes de sem prazo
      if (b.dueDate !== null) return 1;
      return compareAsc(a.createdAt, b.createdAt);
    }

    const aCompleted = a.completedAt ?? '';
    const bCompleted = b.completedAt ?? '';
    if (aCompleted !== bCompleted) return compareDesc(aCompleted, bCompleted);
    return compareDesc(a.createdAt, b.createdAt);
  });
}

/** Avaliações: agendadas primeiro (date asc), depois realizadas (date desc). Não muta a entrada. */
export function sortAssessments(assessments: Assessment[]): Assessment[] {
  return [...assessments].sort((a, b) => {
    const aScheduled = a.status === 'agendada';
    const bScheduled = b.status === 'agendada';
    if (aScheduled !== bScheduled) return aScheduled ? -1 : 1;
    return aScheduled ? compareAsc(a.date, b.date) : compareDesc(a.date, b.date);
  });
}
