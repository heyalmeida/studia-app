export type ChangeEvent = 'subjects:changed' | 'activities:changed' | 'assessments:changed';

type Listener = () => void;

const listeners = new Map<ChangeEvent, Set<Listener>>();

/** Assina um evento; retorna a função de unsubscribe. */
export function subscribe(event: ChangeEvent, listener: Listener): () => void {
  let set = listeners.get(event);
  if (!set) {
    set = new Set<Listener>();
    listeners.set(event, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
  };
}

/** Notifica os assinantes do evento. Listener que lança é capturado e ignorado (não quebra os demais). */
export function emit(event: ChangeEvent): void {
  const set = listeners.get(event);
  if (!set) return;
  for (const listener of [...set]) {
    try {
      listener();
    } catch {
      // ignora: um listener com erro não pode derrubar os outros nem a escrita que o disparou
    }
  }
}
