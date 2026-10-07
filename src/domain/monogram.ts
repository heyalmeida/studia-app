const STOPWORDS = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'e',
  'à',
  'a',
  'o',
  'as',
  'os',
  'em',
  'para',
  'com',
  'na',
  'no',
  'ao',
  'aos',
  'um',
  'uma',
  'por',
  'sobre',
]);

/** Monograma da matéria: 1–2 iniciais das palavras significativas (ADR-0006). Nome vazio -> ''. */
export function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter((word) => word.length > 0);
  const significant = words.filter((word) => !STOPWORDS.has(word.toLowerCase()));
  let result = '';
  for (let i = 0; i < Math.min(2, significant.length); i += 1) {
    result += significant[i].charAt(0).toUpperCase();
  }
  return result;
}
