import { normalizeForSearch } from '@/domain/text';

/**
 * Busca textual e filtro por matéria das listas (Slice 7). Funções **puras** sobre a lista
 * já ordenada que o hook entrega: filtrar aqui nunca reordena, então a ordenação por prazo
 * (e a posição relativa dos itens) fica intacta com filtro ativo (AC-7.2).
 */

/**
 * O registro casa com a busca? A busca é um **OR** entre os campos passados: basta um
 * deles conter o termo.
 *
 * - Query vazia ou só com espaços -> `true`: sem termo não há filtro (AC-7.1).
 * - Campos `null` são ignorados (ex.: atividade sem professor).
 * - A comparação ignora caixa e acentos nos **dois** lados, então 'calculo' acha
 *   'Cálculo'.
 */
export function matchesSearch(query: string, fields: (string | null)[]): boolean {
  const needle = normalizeForSearch(query.trim());
  if (needle.length === 0) return true;

  return fields.some((field) => field !== null && normalizeForSearch(field).includes(needle));
}

/**
 * Mantém só os itens da matéria escolhida. `subjectId` `null` = nenhuma matéria filtrada,
 * e nesse caso devolve a **mesma** lista (sem cópia e sem mutação) — as telas chamam isso
 * em todo render.
 */
export function filterBySubject<T extends { subjectId: string }>(
  items: T[],
  subjectId: string | null,
): T[] {
  if (subjectId === null) return items;
  return items.filter((item) => item.subjectId === subjectId);
}
