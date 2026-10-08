import type { Activity } from '@/domain/models';
import { daysUntil } from '@/domain/date';

/** Janela de "esta semana": vence em até 7 dias (mesma janela do painel). */
const WEEK_DAYS = 7;

export type ActivityBucket = 'atrasadas' | 'hoje' | 'semana' | 'depois' | 'sem-prazo';

export interface ActivityGroup {
  bucket: ActivityBucket;
  title: string;
  data: Activity[];
}

/** Ordem fixa dos grupos — é a leitura que o usuário espera, sempre a mesma. */
const BUCKET_ORDER: { bucket: ActivityBucket; title: string }[] = [
  { bucket: 'atrasadas', title: 'Atrasadas' },
  { bucket: 'hoje', title: 'Hoje' },
  { bucket: 'semana', title: 'Esta semana' },
  { bucket: 'depois', title: 'Depois' },
  { bucket: 'sem-prazo', title: 'Sem prazo' },
];

/**
 * Classifica uma atividade pelo prazo (ADR-0009). `dueDate` inválido ou ausente cai em
 * `sem-prazo`: é o bucket honesto, em vez de inventar uma data.
 */
export function bucketOf(activity: Activity): ActivityBucket {
  if (activity.dueDate === null) return 'sem-prazo';
  const days = daysUntil(activity.dueDate);
  if (days < 0) return 'atrasadas';
  if (days === 0) return 'hoje';
  if (days <= WEEK_DAYS) return 'semana';
  return 'depois';
}

/**
 * Agrupa as atividades por período, na ordem Atrasadas → Hoje → Esta semana → Depois
 * (→ Sem prazo, quando houver). Cada bucket só aparece se tiver itens; a ordem dentro do
 * grupo é a do hook (sortActivities), então a lista não muda de ordem ao filtrar.
 */
export function groupByPeriod(activities: Activity[]): ActivityGroup[] {
  const buckets = new Map<ActivityBucket, Activity[]>();
  for (const activity of activities) {
    const bucket = bucketOf(activity);
    const list = buckets.get(bucket);
    if (list === undefined) buckets.set(bucket, [activity]);
    else list.push(activity);
  }

  return BUCKET_ORDER.filter(({ bucket }) => (buckets.get(bucket)?.length ?? 0) > 0).map(
    ({ bucket, title }) => ({ bucket, title, data: buckets.get(bucket) ?? [] }),
  );
}