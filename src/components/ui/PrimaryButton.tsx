import { Text } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { FIELD_HEIGHT } from '@/constants/theme';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Ação principal (ADR-0009): fundo na cor de destaque, rótulo branco 15/600, altura 52 e
 * raio 12. É o **único** botão com essa cor — exclusão e cancelar são texto.
 */
export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      pressedOpacity={0.85}
      className={
        disabled
          ? 'w-full items-center justify-center rounded-button bg-accent opacity-40'
          : 'w-full items-center justify-center rounded-button bg-accent'
      }
      contentClassName="w-full items-center justify-center px-4 py-2"
      style={{ minHeight: FIELD_HEIGHT }}>
      <Text className="text-bodyStrong font-semibold text-on-accent">{label}</Text>
    </Touchable>
  );
}