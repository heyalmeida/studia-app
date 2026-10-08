import type { Subject } from '@/domain/models';
import type { Repository } from '@/domain/repositories';
import { SUBJECT_COLOR_NAMES } from '@/constants/theme';
import { emit } from '@/storage/notifier';
import { STORAGE_KEYS, readCollection, writeCollection } from '@/storage/storage';

/**
 * Migração de dados dos Slices 0–6: registros antigos não têm hour/icon/color.
 * `color` fora da paleta é normalizada para `null` — o storage é dado não confiável
 * (RNF-04) e um hex arbitrário quebraria o contraste da UI.
 */
function migrateSubjects(items: Subject[]): Subject[] {
  // Registros antigos (Slices 0–6) podem não ter as chaves `hour`/`icon`/`color` no JSON.
  for (const item of items as Partial<Subject>[]) {
    if (item.hour === undefined) item.hour = null;
    if (item.icon === undefined || item.icon === '') item.icon = null;
    const color = item.color;
    item.color =
      color === undefined || color === null || color === '' || !SUBJECT_COLOR_NAMES.includes(color)
        ? null
        : color;
  }
  return items;
}

async function getAll(): Promise<Subject[]> {
  return migrateSubjects(await readCollection<Subject>(STORAGE_KEYS.subjects));
}

async function upsert(item: Subject): Promise<void> {
  const items = migrateSubjects(await readCollection<Subject>(STORAGE_KEYS.subjects));
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
  const items = migrateSubjects(await readCollection<Subject>(STORAGE_KEYS.subjects));
  await writeCollection(
    STORAGE_KEYS.subjects,
    items.filter((existing) => existing.id !== id),
  );
  emit('subjects:changed');
}

export const subjectRepository: Repository<Subject> = { getAll, upsert, remove };
