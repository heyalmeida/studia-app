/**
 * Normalização de texto para busca (Slice 7).
 *
 * Regra: minúsculas + remoção de acentos, para que 'calculo' encontre 'Cálculo'. A
 * comparação é feita nos dois lados — o que o usuário digita e o que está gravado —, então
 * basta uma função pura e determinística.
 *
 * Por que NFD e não NFKD/NFKC: NFD decompõe o caractere em base + diacrítico
 * ('á' -> 'a' + U+0301) e a faixa [\u0300-\u036f] cobre os diacríticos combinantes
 * Unicode. É a forma canônica, então não mexe em letras como 'ß' ou 'æ'.
 */

/** Diacríticos combinantes: a parte invisível que fica depois da decomposição NFD. */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

/**
 * Prepara um texto para comparação por busca: minúsculas e sem acentos.
 * 'Cálculo I' -> 'calculo i'. Aceita string vazia; nunca lança.
 */
export function normalizeForSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(COMBINING_MARKS, '');
}
