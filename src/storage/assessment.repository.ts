import type { Assessment } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

/**
 * Migração de dados dos Slices 0–7: registros antigos não têm reminder/notificationId.
 * Nunca lança — o JSON do storage é dado não confiável (RNF-04) e a leitura tem que
 * degradar para defaults, não quebrar a tela.
 */
function migrateAssessments(items: Assessment[]): Assessment[] {
  for (const item of items as Partial<Assessment>[]) {
    if (item.reminder === undefined) item.reminder = false;
    if (item.notificationId === undefined) item.notificationId = null;
  }
  return items;
}

async function getAll(): Promise<Assessment[]> {
  return migrateAssessments(await readCollection<Assessment>(STORAGE_KEYS.assessments));
}

async function upsert(item: Assessment): Promise<void> {
  const items = migrateAssessments(await readCollection<Assessment>(STORAGE_KEYS.assessments));
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  await writeCollection(STORAGE_KEYS.assessments, items);
  emit('assessments:changed');
}

async function remove(id: string): Promise<void> {
  const items = migrateAssessments(await readCollection<Assessment>(STORAGE_KEYS.assessments));
  await writeCollection(
    STORAGE_KEYS.assessments,
    items.filter((existing) => existing.id !== id),
  );
  emit('assessments:changed');
}

export const assessmentRepository: Repository<Assessment> = { getAll, upsert, remove };
