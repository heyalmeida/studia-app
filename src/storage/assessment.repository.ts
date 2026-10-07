import type { Assessment } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

async function getAll(): Promise<Assessment[]> {
  return readCollection<Assessment>(STORAGE_KEYS.assessments);
}

async function upsert(item: Assessment): Promise<void> {
  const items = await readCollection<Assessment>(STORAGE_KEYS.assessments);
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
  const items = await readCollection<Assessment>(STORAGE_KEYS.assessments);
  await writeCollection(
    STORAGE_KEYS.assessments,
    items.filter((existing) => existing.id !== id),
  );
  emit('assessments:changed');
}

export const assessmentRepository: Repository<Assessment> = { getAll, upsert, remove };
