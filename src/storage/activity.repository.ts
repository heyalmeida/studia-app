import type { Activity } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

async function getAll(): Promise<Activity[]> {
  return readCollection<Activity>(STORAGE_KEYS.activities);
}

async function upsert(item: Activity): Promise<void> {
  const items = await readCollection<Activity>(STORAGE_KEYS.activities);
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
  const items = await readCollection<Activity>(STORAGE_KEYS.activities);
  await writeCollection(
    STORAGE_KEYS.activities,
    items.filter((existing) => existing.id !== id),
  );
  emit('activities:changed');
}

export const activityRepository: Repository<Activity> = { getAll, upsert, remove };
