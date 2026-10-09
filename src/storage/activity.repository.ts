import type { Activity } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

/**
 * Migração de dados dos Slices 0–7: registros antigos não têm reminder/notificationId.
 * Nunca lança — o JSON do storage é dado não confiável (RNF-04) e a leitura tem que
 * degradar para defaults, não quebrar a tela.
 */
function migrateActivities(items: Activity[]): Activity[] {
  for (const item of items as Partial<Activity>[]) {
    if (item.reminder === undefined) item.reminder = false;
    if (item.notificationId === undefined) item.notificationId = null;
  }
  return items;
}

async function getAll(): Promise<Activity[]> {
  return migrateActivities(await readCollection<Activity>(STORAGE_KEYS.activities));
}

async function upsert(item: Activity): Promise<void> {
  const items = migrateActivities(await readCollection<Activity>(STORAGE_KEYS.activities));
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  await writeCollection(STORAGE_KEYS.activities, items);
  emit('activities:changed');
}

async function remove(id: string): Promise<void> {
  const items = migrateActivities(await readCollection<Activity>(STORAGE_KEYS.activities));
  await writeCollection(
    STORAGE_KEYS.activities,
    items.filter((existing) => existing.id !== id),
  );
  emit('activities:changed');
}

export const activityRepository: Repository<Activity> = { getAll, upsert, remove };
