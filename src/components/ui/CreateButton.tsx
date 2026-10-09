import Plus from 'lucide-react-native/icons/plus';
import { StyleSheet, Text } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { FIELD_HEIGHT, Palette, Radius, TOUCH_TARGET, Typography } from '@/constants/theme';

export type CreateButtonSize = 'header' | 'large';

export interface CreateButtonProps {
  label: string;
  onPress: () => void;
  /**
   * `header`: botão compacto que divide a linha com o título (altura ≈45, alvo ≥44).
   * `large`: versão do estado vazio, com `minHeight` de campo (52).
   */
  size?: CreateButtonSize;
  /** Ícone `Plus` 18 à esquerda do rótulo. Desligue em ações que não criam (ex.: "Tentar de novo"). */
  withIcon?: boolean;
}

/**
 * Botão de criação "+ Nova …" (ADR-0009): ícone `Plus` 18 + rótulo 16/600, superfície
 * elevada `#1C1C24` com hairline de 1px — discreto o bastante para repetir no header e
 * no estado vazio sem competir com a cor de destaque, que fica reservada a Salvar, botão de
 * criação da tab bar e tab ativa.
 *
 * O espaçamento vem de `StyleSheet` com valores numéricos explícitos (não de `className`):
 * assim ele é aplicado também no Expo Go, onde o NativeWind não roda.
 */
export function CreateButton({ label, onPress, size = 'large', withIcon = true }: CreateButtonProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={[styles.base, size === 'header' ? styles.header : styles.large]}
      // A linha ícone + rótulo vive no Pressable: é o alvo de toque que precisa do respiro.
      contentStyle={[centeredContent, styles.content, size === 'header' ? styles.header : styles.large]}>
      {withIcon ? <Plus size={18} color={Palette.text} strokeWidth={2.2} /> : null}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: 16,
    minHeight: TOUCH_TARGET,
  },
  large: {
    paddingHorizontal: 20,
    minHeight: FIELD_HEIGHT,
    borderRadius: Radius.button,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  label: {
    ...Typography.button,
    color: Palette.text,
  },
});