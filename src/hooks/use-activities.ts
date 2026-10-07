import { useCallback, useEffect, useMemo, useState } from 'react';

import { activityRepository } from '@/data/activity.repository';
import { subscribe } from '@/data/notifier';
import { subjectRepository } from '@/data/subject.repository';
import { parseDDMMYYYY } from '@/domain/date';
import { genId } from '@/domain/id';
import type { Activity, ActivityType, Subject } from '@/domain/models';
import { sortActivities } from '@/domain/sorting';
import { validateActivity, type ActivityFormInput, type FieldErrors } from '@/domain/validation';

const LOAD_ERROR = 'Falha ao carregar seus dados.';
const SAVE_ERROR = 'Não foi possível salvar a atividade.';
const WARNING_KEY = 'dueDateWarning';

/**
 * `ActivityFormInput` do domínio cobre só o que é validado (título, matéria, prazo).
 * A entidade Activity também carrega tipo e descrição (domain-model), então o formulário
 * envia os dois campos a mais e o hook normaliza para o modelo.
 */
export interface ActivityInput extends ActivityFormInput {
  type?: ActivityType;
  description?: string;
}

export interface UseActivities {
  activities: Activity[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  create(input: ActivityInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  update(id: string, input: ActivityInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  toggleStatus(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  refresh(): void;
}

interface Snapshot {
  activities: Activity[];
  subjects: Subject[];
}

/**
 * Lê as 2 coleções. Não toca em setState — quem aplica é quem consome via `.then`,
 * o que mantém o corpo do `useEffect` livre de setState síncrono (lint set-state-in-effect).
 */
function readSnapshot(): Promise<Snapshot> {
  return Promise.all([activityRepository.getAll(), subjectRepository.getAll()]).then(
    ([activities, subjects]) => ({ activities, subjects }),
  );
}

/**
 * Valida no domínio e persiste (inserção ou edição). O aviso de data no passado NÃO bloqueia
 * (CA-04.3): só entradas com erro de verdade são recusadas.
 */
async function saveActivity(
  input: ActivityInput,
  id?: string,
): Promise<{ ok: boolean; errors: FieldErrors }> {
  // Fonte de verdade = repositório (o estado do hook pode ainda estar em `loading`).
  const [activities, subjects] = await Promise.all([
    activityRepository.getAll(),
    subjectRepository.getAll(),
  ]);
  const original = id === undefined ? undefined : activities.find((item) => item.id === id);

  const errors = validateActivity(input, subjects.length > 0);
  const blocking = Object.keys(errors).filter((key) => key !== WARNING_KEY);
  if (blocking.length > 0) {
    return { ok: false, errors };
  }

  const rawDueDate = input.dueDate.trim();

  try {
    await activityRepository.upsert({
      id: id ?? genId(),
      subjectId: input.subjectId.trim(),
      title: input.title.trim(),
      type: input.type ?? 'tarefa',
      description: (input.description ?? '').trim() || null,
      // validateActivity já recusou formato inválido acima, então o parse só volta null aqui.
      dueDate: rawDueDate.length > 0 ? parseDDMMYYYY(rawDueDate) : null,
      status: original?.status ?? 'pendente',
      createdAt: original?.createdAt ?? new Date().toISOString(),
      completedAt: original?.completedAt ?? null,
    });
  } catch {
    return { ok: false, errors: { title: SAVE_ERROR } };
  }

  return { ok: true, errors };
}

/** Lista ordenada + CRUD + conclusão de atividades (RF-04/05/06/07). */
export function useActivities(): UseActivities {
  const [loadedActivities, setLoadedActivities] = useState<Activity[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplicação do snapshot via callback encadeado (não chamada direta no effect).
  const applySnapshot = useCallback((snapshot: Snapshot) => {
    setLoadedActivities(snapshot.activities);
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
      subscribe('activities:changed', () => void load()),
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

  const activities = useMemo(() => sortActivities(loadedActivities), [loadedActivities]);

  const create = useCallback((input: ActivityInput) => saveActivity(input), []);

  const update = useCallback(
    (id: string, input: ActivityInput) => saveActivity(input, id),
    [],
  );

  // Concluir/reabrir persiste na hora e o notifier atualiza painel e agregados (CA-06.1).
  const toggleStatus = useCallback(async (id: string): Promise<void> => {
    const activities = await activityRepository.getAll();
    const current = activities.find((item) => item.id === id);
    if (!current) return;
    const nextStatus = current.status === 'pendente' ? 'concluida' : 'pendente';
    await activityRepository.upsert({
      ...current,
      status: nextStatus,
      completedAt: nextStatus === 'concluida' ? new Date().toISOString() : null,
    });
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await activityRepository.remove(id);
  }, []);

  return {
    activities,
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