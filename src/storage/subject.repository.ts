import type { Subject } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

async function getAll(): Promise<Subject[]> {
  return readCollection<Subject>(STORAGE_KEYS.subjects);
}

async function upsert(item: Subject): Promise<void> {
  const items = await readCollection<Subject>(STORAGE_KEYS.subjects);
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  await writeCollection(STORAGE_KEYS.subjects, items);
  emit('subjects:changed');
}

async function remove(id: string): Promise<void> {
  const items = await readCollection<Subject>(STORAGE_KEYS.subjects);
  await writeCollection(
    STORAGE_KEYS.subjects,
    items.filter((existing) => existing.id !== id),
  );
  emit('subjects:changed');
}

export const subjectRepository: Repository<Subject> = { getAll, upsert, remove };
