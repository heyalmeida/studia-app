import { ScrollView, StyleSheet, Text } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { Palette, Radius, SCREEN_PADDING, Spacing, Typography } from '@/constants/theme';
import type { Subject } from '@/domain/models';

export interface SubjectFilterRowProps {
  subjects: Subject[];
  /** `null` = nenhuma matéria filtrada (chip "Todas" ativo). */
  selected: string | null;
  onChange: (id: string | null) => void;
}

/**
 * Filtro por matéria das listas (Slice 7): rolagem horizontal com o chip **"Todas"** fixo no
 * início e um chip por matéria, com o **nome puro** — aqui não interessa a cor nem o ícone
 * (a lista embaixo já mostra a cor), e o filtro é sobre a lista de matérias do usuário, que
 * pode ser longa.
 *
 * Selecionado = fundo no destaque suave + rótulo e borda no destaque (ADR-0009 §2). Estilo em
 * `StyleSheet` com tokens — no Expo Go o `className` não se aplica (ADR-0010).
 */
export function SubjectFilterRow({ subjects, selected, onChange }: SubjectFilterRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}>
      <FilterChip
        label="Todas"
        selected={selected === null}
        onPress={() => onChange(null)}
      />

      {subjects.map((subject) => (
        <FilterChip
          key={subject.id}
          label={subject.name}
          selected={selected === subject.id}
          onPress={() => onChange(subject.id)}
        />
      ))}
    </ScrollView>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={[styles.chip, selected === true ? styles.chipSelected : styles.chipUnselected]}
      contentStyle={styles.chipContent}>
      <Text
        style={[styles.label, selected === true ? styles.labelSelected : styles.labelUnselected]}
        numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: Spacing.two,
  },
  chip: {
    borderRadius: Radius.chip,
  },
  // Padding no Pressable: o respiro também é área tocável.
  chipContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  chipSelected: {
    backgroundColor: Palette.accentSoft,
    borderWidth: 1,
    borderColor: Palette.accent,
  },
  chipUnselected: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  label: {
    ...Typography.body,
  },
  labelSelected: {
    fontWeight: '600',
    color: Palette.accent,
  },
  labelUnselected: {
    color: Palette.textSecondary,
  },
});
