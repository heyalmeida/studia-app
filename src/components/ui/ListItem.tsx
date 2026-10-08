import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

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
 * Pressionável com o mesmo feedback do resto do app — o respiro fica dentro da zona
 * tocável, então não existe faixa morta na borda da linha.
 */
export function ListItem({ children, onPress, divider = true }: ListItemProps) {
  const content = onPress !== undefined ? (
    <Touchable
      accessibilityRole="button"
      onPress={onPress}
      pressedOpacity={0.7}
      pressedScale={0.99}
      contentStyle={styles.padded}>
      {children}
    </Touchable>
  ) : (
    <View style={styles.padded}>{children}</View>
  );

  return (
    <View>
      {content}
      {divider ? <Divider /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingVertical: 14,
  },
});