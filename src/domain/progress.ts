import type { Activity } from '@/domain/models';

export interface SubjectProgress {
  subjectId: string;
  total: number;
  done: number;
  ratio: number;
}

function ratioOf(total: number, done: number): number {
  return total === 0 ? 0 : done / total;
}

/** Progresso de uma matéria (RF-02). Derivado, nunca persistido (domain-model.md). */
export function subjectProgress(subjectId: string, activities: Activity[]): SubjectProgress {
  const related = activities.filter((activity) => activity.subjectId === subjectId);
  const total = related.length;
  const done = related.filter((activity) => activity.status === 'concluida').length;
  return { subjectId, total, done, ratio: ratioOf(total, done) };
}

/** Agregado geral (RF-09). ratio sempre em 0..1; total 0 -> 0 (nunca NaN). */
export function progressSummary(activities: Activity[]): { total: number; done: number; ratio: number } {
  const total = activities.length;
  const done = activities.filter((activity) => activity.status === 'concluida').length;
  return { total, done, ratio: ratioOf(total, done) };
}
