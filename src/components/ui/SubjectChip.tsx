import { Pressable, Text } from 'react-native';

import type { Subject } from '@/domain/models';

export interface SubjectChipProps {
  subject: Subject;
  selected: boolean;
  onPress: () => void;
}

/** Chip horizontal de seleção de matéria — apenas o nome (sem monograma/resumo). */
export function SubjectChip({ subject, selected, onPress }: SubjectChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={
        selected
          ? 'rounded-chip border border-border bg-surface px-two py-two'
          : 'rounded-chip border border-border-strong bg-backgroundElement px-two py-two'
      }>
      <Text
        className={selected ? 'text-body text-text' : 'text-body text-text-secondary'}
        numberOfLines={1}>
        {subject.name}
      </Text>
    </Pressable>
  );
}
