import Plus from 'lucide-react-native/icons/plus';
import { View } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { FAB_SIZE, Palette } from '@/constants/theme';

export interface FABProps {
  label: string;
  onPress: () => void;
}

/**
 * Botão flutuante de criação (ADR-0009): círculo de 56 na cor de destaque, ancorado no
 * canto inferior da tela — ou seja, **acima** da tab bar, que vive fora do container da
 * tela. As listas dão `paddingBottom: LIST_BOTTOM_INSET`, então a última linha nunca fica
 * sob o botão. Sem sombra (RNF-01): a separação vem da borda e do tamanho.
 */
export function FAB({ label, onPress }: FABProps) {
  return (
    <View className="absolute bottom-3 right-5">
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        pressedScale={0.92}
        pressedOpacity={0.85}
        style={{ width: FAB_SIZE, height: FAB_SIZE }}
        className="items-center justify-center rounded-full border border-border bg-accent">
        <Plus size={26} color={Palette.onAccent} strokeWidth={2.5} />
      </Touchable>
    </View>
  );
}