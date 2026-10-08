import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { ListItem } from '@/components/ui/ListItem';
import { Monogram } from '@/components/ui/Monogram';
import { relativeLabelBR } from '@/domain/date';
import type { Assessment, Subject } from '@/domain/models';

export interface AssessmentRowProps {
  assessment: Assessment;
  subject: Subject | undefined;
  onToggle: () => void;
  onOpen: () => void;
}

/**
 * Linha da lista de avaliações (T4): checkbox de situação + título/matéria + data relativa.
 * Pressable aninhado: no RN o mais interno captura o toque, então marcar NÃO abre o editor.
 */
export function AssessmentRow({ assessment, subject, onToggle, onOpen }: AssessmentRowProps) {
  const done = assessment.status === 'realizada';
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra a linha (RNF-04)

  return (
    <ListItem onPress={onOpen}>
      <View className="flex-row items-center gap-three">
        <Pressable
          onPress={onToggle}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Reabrir avaliação' : 'Marcar avaliação como realizada'}
          className="py-half">
          <View
            className={
              done
                ? 'h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-inverse bg-inverse'
                : 'h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-border-strong'
            }>
            {done ? <View className="h-0.5 w-2.5 rounded-sm bg-on-inverse" /> : null}
          </View>
        </Pressable>

        <View className="flex-1 gap-one">
          <Text
            className={done ? 'text-body font-semibold text-text-tertiary' : 'text-body font-semibold text-text'}
            style={done ? { textDecorationLine: 'line-through' } : undefined}
            numberOfLines={1}>
            {assessment.title}
          </Text>
          <View className="flex-row items-center gap-two">
            <Text className="flex-shrink text-meta text-text-secondary" numberOfLines={1}>
              {subjectName}
            </Text>
          </View>
        </View>

        {done ? (
          <Text className="text-meta text-text-tertiary">realizada</Text>
        ) : (
          <Badge label={relativeLabelBR(assessment.date)} tone="outline" />
        )}
      </View>
    </ListItem>
  );
}