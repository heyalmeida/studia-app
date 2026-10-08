import Plus from 'lucide-react-native/icons/plus';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { FAB_SIZE, Palette, SAFE_GAP, TAB_BAR_HEIGHT } from '@/constants/theme';

export interface FABProps {
  label: string;
  onPress: () => void;
}

/**
 * Botão flutuante de criação (ADR-0009): círculo de 56 na cor de destaque, ícone `Plus`
 * 24 branco centralizado.
 *
 * **Posição:** `position: absolute` dentro da tela das abas. Como a tela do React
 * Navigation é `absoluteFill` dentro do `Tabs`, ela **passa por baixo** da barra flutuante —
 * por isso o `bottom` soma a altura da barra (`TAB_BAR_HEIGHT`) mais a safe area inferior
 * (`insets.bottom`, a barra de gestos do Android) mais `SAFE_GAP`. As listas reservam
 * `listBottomInset(insets.bottom)`, então a última linha nunca fica sob o botão.
 *
 * Sombra/elevation 6: separa o botão flutuante do conteúdo que passa por baixo dele —
 * exceção única à regra "sem sombras" (ADR-0010 §3).
 */
export function FAB({ label, onPress }: FABProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrapper, { bottom: TAB_BAR_HEIGHT + insets.bottom + SAFE_GAP }]}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        pressedOpacity={0.7}
        pressedScale={0.97}
        style={styles.fab}
        contentStyle={centeredContent}>
        <Plus size={24} color={Palette.onAccent} strokeWidth={2.5} />
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 20,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Palette.accent,
    // elevation 6 no Android; os demais campos cobrem iOS/web.
    elevation: 6,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});