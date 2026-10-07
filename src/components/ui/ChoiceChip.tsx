import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface ChoiceChipProps {
  selected: boolean;
  onPress: () => void;
  /** true = chip cresce para preencher a linha (usar só em linhas fixas, nunca em ScrollView horizontal). */
  grow?: boolean;
  children: ReactNode;
}

/**
 * Chip de seleção monocromático (ADR-0006): selecionado = borda forte + fundo da tela;
 * não selecionado = superfície tonal sem borda. Usado nos formulários (matéria, tipo).
 */
export function ChoiceChip({ selected, onPress, grow = false, children }: ChoiceChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={
        selected
          ? 'rounded-chip border-[1.5px] border-border-strong bg-background px-two py-two'
          : 'rounded-chip border border-transparent bg-surface px-two py-two'
      }
      style={grow ? { flex: 1 } : styles.shrink}>
      <View className="flex-row items-center justify-center gap-two">{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shrink: {
    flexShrink: 0,
  },
});
