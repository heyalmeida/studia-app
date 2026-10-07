import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Store externa imutável: o snapshot só muda na fronteira servidor -> cliente (hidratação).
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  // Mesmo comportamento do anterior (useState + useEffect => setHasHydrated(true)), sem
  // setState dentro de efeito — regra react-hooks/set-state-in-effect.
  const hasHydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
