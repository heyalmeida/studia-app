import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DateBlock } from '@/components/ui/DateBlock';
import { DueChip } from '@/components/ui/DueChip';
import { Touchable } from '@/components/ui/Touchable';
import { Palette, subjectTone } from '@/constants/theme';
import type { Assessment, Subject } from '@/domain/models';

export interface AssessmentCardProps {
  assessment: Assessment;
  subject: Subject | undefined;
  onToggle: () => void;
  onOpen: () => void;
}

/**
 * Card de avaliação (T4, ADR-0009): bloco de data à esquerda (dia grande, mês pequeno),
 * título, matéria com a bolinha da cor e a contagem regressiva. Realizadas ficam
 * esmaecidas e tracejadas — histórico, sem sumir da lista.
 *
 * O botão de situação é um Pressable aninhado: marcar não abre o editor.
 */
export function AssessmentCard({ assessment, subject, onToggle, onOpen }: AssessmentCardProps) {
  const done = assessment.status === 'realizada';
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra o card (RNF-04)
  const tone = subjectTone(subject?.color);

  return (
    <Card onPress={onOpen} className="flex-row items-center gap-4">
      <Touchable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? 'Reabrir avaliação' : 'Marcar avaliação como realizada'}
        onPress={onToggle}
        pressedScale={0.85}
        style={{ width: 44, height: 44 }}
        className="-ml-2 items-center justify-center">
        <View
          className="h-6 w-6 items-center justify-center rounded-full border"
          style={{
            borderColor: done ? Palette.accent : Palette.border,
            backgroundColor: done ? Palette.accent : 'transparent',
          }}
        />
      </Touchable>

      <DateBlock date={assessment.date} muted={done} />

      <View className="flex-1 gap-1">
        <Text
          className={done ? 'text-body text-text-tertiary' : 'text-cardTitle font-semibold text-text'}
          style={done ? { textDecorationLine: 'line-through' } : undefined}
          numberOfLines={2}>
          {assessment.title}
        </Text>
        <View className="flex-row items-center gap-2">
          {tone !== null ? (
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.value }} />
          ) : null}
          <Text className="text-legend text-text-tertiary" numberOfLines={1}>
            {subjectName}
          </Text>
        </View>
      </View>

      {done ? (
        <Text className="text-legend text-text-tertiary">realizada</Text>
      ) : (
        <DueChip date={assessment.date} />
      )}
    </Card>
  );
}