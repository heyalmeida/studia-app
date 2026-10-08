import { Text } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';

export interface TextButtonProps {
  label: string;
  onPress: () => void;
  /** `danger` é o texto vermelho discreto da exclusão (ADR-0009). */
  tone?: 'neutral' | 'danger';
  disabled?: boolean;
}

/**
 * Ação secundária em texto (ADR-0009): **cancelar** e **excluir**. A exclusão é
 * vermelha e discreta — nunca um botão preenchido, para não competir com Salvar.
 */
export function TextButton({ label, onPress, tone = 'neutral', disabled = false }: TextButtonProps) {
  const color = tone === 'danger' ? 'text-danger' : 'text-text-secondary';

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      pressedOpacity={0.6}
      style={{ minHeight: 44 }}
      className="w-full items-center justify-center"
      contentClassName="w-full items-center justify-center px-4 py-2">
      <Text className={`text-body ${color} ${disabled ? 'opacity-40' : ''}`}>{label}</Text>
    </Touchable>
  );
}