import { useCallback, useEffect, useMemo, useState } from 'react';

import { assessmentRepository } from '@/storage/assessment.repository';
import { subscribe } from '@/storage/notifier';
import { subjectRepository } from '@/storage/subject.repository';
import { parseDDMMYYYY } from '@/domain/date';
import { genId } from '@/domain/id';
import type { Assessment, Subject } from '@/domain/models';
import { sortAssessments } from '@/domain/sorting';
import {
  validateAssessment,
  type AssessmentFormInput,
  type FieldErrors,
} from '@/domain/validation';

const LOAD_ERROR = 'Falha ao carregar seus dados.';
const SAVE_ERROR = 'Não foi possível salvar a avaliação.';
const WARNING_KEY = 'dateWarning';

export interface UseAssessments {
  assessments: Assessment[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  create(input: AssessmentFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  update(id: string, input: AssessmentFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  toggleStatus(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  refresh(): void;
}

interface Snapshot {
  assessments: Assessment[];
  subjects: Subject[];
}

/**
 * Lê as 2 coleções. Não toca em setState — quem aplica é quem consome via `.then`,
 * o que mantém o corpo do `useEffect` livre de setState síncrono (lint set-state-in-effect).
 */
function readSnapshot(): Promise<Snapshot> {
  return Promise.all([assessmentRepository.getAll(), subjectRepository.getAll()]).then(
    ([assessments, subjects]) => ({ assessments, subjects }),
  );
}

/**
 * Valida no domínio e persiste (inserção ou edição). O aviso de data no passado NÃO bloqueia
 * (CA-08.2): só entradas com erro de verdade são recusadas.
 */
async function saveAssessment(
  input: AssessmentFormInput,
  id?: string,
): Promise<{ ok: boolean; errors: FieldErrors }> {
  // Fonte de verdade = repositório (o estado do hook pode ainda estar em `loading`).
  const [assessments, subjects] = await Promise.all([
    assessmentRepository.getAll(),
    subjectRepository.getAll(),
  ]);
  const original = id === undefined ? undefined : assessments.find((item) => item.id === id);

  const errors = validateAssessment(input, subjects.length > 0);
  const blocking = Object.keys(errors).filter((key) => key !== WARNING_KEY);
  if (blocking.length > 0) {
    return { ok: false, errors };
  }

  const rawDate = input.date.trim();

  try {
    await assessmentRepository.upsert({
      id: id ?? genId(),
      subjectId: input.subjectId.trim(),
      title: input.title.trim(),
      // validateAssessment já recusou data vazia/inválida acima, então o parse só volta null aqui.
      date: parseDDMMYYYY(rawDate)!,
      status: original?.status ?? 'agendada',
      createdAt: original?.createdAt ?? new Date().toISOString(),
    });
  } catch {
    return { ok: false, errors: { title: SAVE_ERROR } };
  }

  return { ok: true, errors };
}

/** Lista ordenada + CRUD de avaliações (RF-08), com data obrigatória e situação agendada/realizada. */
export function useAssessments(): UseAssessments {
  const [loadedAssessments, setLoadedAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicação do snapshot via callback encadeado (não chamada direta no effect).
  const applySnapshot = useCallback((snapshot: Snapshot) => {
    setLoadedAssessments(snapshot.assessments);
    setSubjects(snapshot.subjects);
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
      subscribe('assessments:changed', () => void load()),
      // o seletor de matéria e os monogramas da lista dependem das matérias
      subscribe('subjects:changed', () => void load()),
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

  const assessments = useMemo(() => sortAssessments(loadedAssessments), [loadedAssessments]);

  const create = useCallback((input: AssessmentFormInput) => saveAssessment(input), []);

  const update = useCallback(
    (id: string, input: AssessmentFormInput) => saveAssessment(input, id),
    [],
  );

  // Realizada ↔ agendada preserva os demais campos via spread (CA-08.4: histórico permanece visível).
  const toggleStatus = useCallback(async (id: string): Promise<void> => {
    const assessments = await assessmentRepository.getAll();
    const current = assessments.find((item) => item.id === id);
    if (!current) return;
    await assessmentRepository.upsert({
      ...current,
      status: current.status === 'agendada' ? 'realizada' : 'agendada',
    });
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await assessmentRepository.remove(id);
  }, []);

  return {
    assessments,
    subjects,
    loading,
    error,
    create,
    update,
    toggleStatus,
    remove,
    refresh,
  };
}