import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  subjects: 'studia.subjects',
  activities: 'studia.activities',
  assessments: 'studia.assessments',
} as const;

/**
 * Lê uma coleção com defesa total (RNF-04): chave ausente, JSON inválido ou valor que não é
 * Array -> []. Nunca lança — dado corrompido degrada para vazio, não crasha a tela.
 */
export async function readCollection<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return []; // shape inesperado: ignora (defesa na leitura)
    return parsed as T[];
  } catch {
    return [];
  }
}

/**
 * Grava a lista inteira sob a chave (JSON por coleção, ADR-0002).
 * Erro de gravação é propagado — quem chama (repositório) trata.
 */
export async function writeCollection<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}
