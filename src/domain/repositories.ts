/**
 * Portos (interfaces) de persistência — puro domínio, sem React e sem storage (DIP, ADR-0004).
 * As implementações concretas vivem em `src/data/*.repository.ts`.
 */
export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  /** Insere ou substitui por `id`. */
  upsert(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}
