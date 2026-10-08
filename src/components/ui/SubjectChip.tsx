import { subjectTone } from '@/constants/theme';
import type { Subject } from '@/domain/models';

import { ChoiceChip } from '@/components/ui/ChoiceChip';

export interface SubjectChipProps {
  subject: Subject;
  selected: boolean;
  onPress: () => void;
  /** Rótulo próprio (o painel usa "Cálculo I · 3"). */
  label?: string;
}

/**
 * Chip de matéria (ADR-0009): nome com a **bolinha da cor da matéria** à esquerda — é o
 * que amarra card, lista de atividades, avaliação e formulário ao mesmo código de cor.
 * Matéria sem cor (registro legado) fica sem bolinha, sem inventar um tom.
 */
export function SubjectChip({ subject, selected, onPress, label }: SubjectChipProps) {
  const tone = subjectTone(subject.color);

  return (
    <ChoiceChip
      selected={selected}
      onPress={onPress}
      dotColor={tone?.value}
      label={label ?? subject.name}
    />
  );
}