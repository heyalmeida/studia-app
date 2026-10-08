import { useCallback, useEffect, useMemo, useState } from 'react';

import { activityRepository } from '@/storage/activity.repository';
import { assessmentRepository } from '@/storage/assessment.repository';
import { subscribe } from '@/storage/notifier';
import { subjectRepository } from '@/storage/subject.repository';
import { genId } from '@/domain/id';
import type { Activity, Assessment, Subject } from '@/domain/models';
import { subjectProgress } from '@/domain/progress';
import { validateSubject, type FieldErrors, type SubjectFormInput } from '@/domain/validation';

const LOAD_ERROR = 'Falha ao carregar seus dados.';
const SAVE_ERROR = 'Não foi possível salvar a matéria.';
const DELETE_ERROR = 'Não foi possível excluir.';

export interface UseSubjects {
  subjects: Subject[];
  activitiesCount: Record<string, { pending: number; done: number }>;
  assessmentsCount: Record<string, number>;
  /** Razão 0..1 de atividades concluídas por matéria (domain/progress.ts). */
  progress: Record<string, number>;
  loading: boolean;
  error: string | null;
  create(input: SubjectFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  update(id: string, input: SubjectFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  remove(id: string): Promise<{ ok: boolean; reason?: string }>;
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
 * Valida no domínio e persiste (inserção ou edição). Com `id`, mantém o `createdAt`
 * original e ignora o próprio nome na checagem de duplicidade (CA-03.1).
 */
async function saveSubject(
  input: SubjectFormInput,
  id?: string,
): Promise<{ ok: boolean; errors: FieldErrors }> {
  // Fonte de verdade = repositório (o estado do hook pode ainda estar em `loading`).
  const existing = await subjectRepository.getAll();
  const original = id === undefined ? undefined : existing.find((subject) => subject.id === id);
  const otherNames = existing.filter((subject) => subject.id !== id).map((subject) => subject.name);

  const errors = validateSubject(input, otherNames);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  try {
    await subjectRepository.upsert({
      id: id ?? genId(),
      name: input.name.trim(),
      teacher: input.teacher.trim() || null,
      hour: input.hour ?? null,
      icon: input.icon === undefined || input.icon === '' ? null : input.icon,
      createdAt: original?.createdAt ?? new Date().toISOString(),
    });
  } catch {
    return { ok: false, errors: { name: SAVE_ERROR } };
  }

  return { ok: true, errors: {} };
}

/** Estado e ações do CRUD de matérias (RF-01/02/03), com agregados por matéria. */
export function useSubjects(): UseSubjects {
  const [loadedSubjects, setLoadedSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicação do snapshot via callback encadeado (não chamada direta no effect).
  const applySnapshot = useCallback((snapshot: Snapshot) => {
    setLoadedSubjects(snapshot.subjects);
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

  const subjects = useMemo(
    () =>
      [...loadedSubjects].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
      ),
    [loadedSubjects],
  );

  const activitiesCount = useMemo(() => {
    const counts: Record<string, { pending: number; done: number }> = {};
    for (const subject of loadedSubjects) {
      counts[subject.id] = { pending: 0, done: 0 };
    }
    for (const activity of activities) {
      const entry = counts[activity.subjectId];
      if (!entry) continue; // FK órfã: agregados ignoram em vez de quebrar (RNF-04)
      if (activity.status === 'concluida') {
        entry.done += 1;
      } else {
        entry.pending += 1;
      }
    }
    return counts;
  }, [loadedSubjects, activities]);

  const assessmentsCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const subject of loadedSubjects) {
      counts[subject.id] = 0;
    }
    for (const assessment of assessments) {
      if (assessment.status !== 'agendada') continue;
      if (counts[assessment.subjectId] === undefined) continue; // FK órfã
      counts[assessment.subjectId] += 1;
    }
    return counts;
  }, [loadedSubjects, assessments]);

  const progress = useMemo(() => {
    const ratios: Record<string, number> = {};
    for (const subject of loadedSubjects) {
      ratios[subject.id] = subjectProgress(subject.id, activities).ratio;
    }
    return ratios;
  }, [loadedSubjects, activities]);

  const create = useCallback((input: SubjectFormInput) => saveSubject(input), []);

  const update = useCallback((id: string, input: SubjectFormInput) => saveSubject(input, id), []);

  const remove = useCallback(async (id: string): Promise<{ ok: boolean; reason?: string }> => {
    try {
      const [allActivities, allAssessments] = await Promise.all([
        activityRepository.getAll(),
        assessmentRepository.getAll(),
      ]);
      const activityTotal = allActivities.filter((activity) => activity.subjectId === id).length;
      const assessmentTotal = allAssessments.filter((assessment) => assessment.subjectId === id)
        .length;

      if (activityTotal > 0 || assessmentTotal > 0) {
        return {
          ok: false,
          reason: `Esta matéria tem ${activityTotal} atividade(s) e ${assessmentTotal} avaliação(ões); exclua-os primeiro.`,
        };
      }

      await subjectRepository.remove(id);
      return { ok: true };
    } catch {
      return { ok: false, reason: DELETE_ERROR };
    }
  }, []);

  return {
    subjects,
    activitiesCount,
    assessmentsCount,
    progress,
    loading,
    error,
    create,
    update,
    remove,
    refresh,
  };
}
