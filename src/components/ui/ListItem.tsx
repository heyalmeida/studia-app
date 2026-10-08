import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { Touchable } from '@/components/ui/Touchable';

export interface ListItemProps {
  children: ReactNode;
  onPress?: () => void;
  /** Separador depois do item (padrão). */
  divider?: boolean;
}

/**
 * Linha de lista (ADR-0009): respiro vertical de 14 e separador hairline discreto.
 * Pressionável com o mesmo feedback do resto do app.
 */
export function ListItem({ children, onPress, divider = true }: ListItemProps) {
  const content = onPress ? (
    <Touchable
      accessibilityRole="button"
      onPress={onPress}
      pressedOpacity={0.7}
      style={{ paddingVertical: 14 }}>
      {children}
    </Touchable>
  ) : (
    <View style={{ paddingVertical: 14 }}>{children}</View>
  );

  return (
    <View>
      {content}
      {divider ? <Divider /> : null}
    </View>
  );
}