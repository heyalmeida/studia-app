import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DateBlock } from '@/components/ui/DateBlock';
import { DueChip } from '@/components/ui/DueChip';
import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Spacing, TOUCH_TARGET, Typography, subjectTone } from '@/constants/theme';
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
  // Fora do JSX de propósito: `tone.value` num style inline dispara o aviso do plugin do
  // Reanimated/worklets (que não distingue cor de shared value).
  const dotStyle = tone !== null ? { backgroundColor: tone.value } : null;

  return (
    <Card onPress={onOpen} contentStyle={styles.card}>
      <Touchable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? 'Reabrir avaliação' : 'Marcar avaliação como realizada'}
        onPress={onToggle}
        pressedScale={0.85}
        style={[styles.checkboxTarget, centeredContent]}
        contentStyle={centeredContent}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: done ? Palette.accent : Palette.border,
              backgroundColor: done ? Palette.accent : 'transparent',
            },
          ]}
        />
      </Touchable>

      <DateBlock date={assessment.date} muted={done} />

      <View style={styles.identifiers}>
        <Text
          style={done === true ? [styles.titleDone, styles.doneTitle] : styles.title}
          numberOfLines={2}>
          {assessment.title}
        </Text>
        <View style={styles.subjectRow}>
          {tone !== null ? (
            <View style={[styles.dot, dotStyle]} />
          ) : null}
          <Text style={styles.subject} numberOfLines={1}>
            {subjectName}
          </Text>
        </View>
      </View>

      {done ? (
        <Text style={styles.doneLabel}>realizada</Text>
      ) : (
        <DueChip date={assessment.date} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  checkboxTarget: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    marginLeft: -8,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
  },
  identifiers: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  titleDone: {
    ...Typography.body,
    color: Palette.textTertiary,
  },
  doneTitle: {
    textDecorationLine: 'line-through',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  subject: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
  doneLabel: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
});