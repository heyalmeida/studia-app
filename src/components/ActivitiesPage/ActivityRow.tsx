import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';

import { DueChip } from '@/components/ui/DueChip';
import { ListItem } from '@/components/ui/ListItem';
import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Spacing, TOUCH_TARGET, Typography, subjectTone } from '@/constants/theme';
import type { Activity, Subject } from '@/domain/models';

export interface ActivityRowProps {
  activity: Activity;
  subject: Subject | undefined;
  onToggle: () => void;
  onOpen: () => void;
}

/**
 * Item da lista de atividades (T3, ADR-0009): checkbox circular **animado**, título em
 * até 2 linhas (sem cortar com reticências), matéria com a bolinha da cor e chip de prazo
 * à direita. Padding vertical 14 e separador sutil vêm do `ListItem`.
 *
 * Pressable aninhado: no RN o mais interno captura o toque, então concluir NÃO abre o editor.
 */
export function ActivityRow({ activity, subject, onToggle, onOpen }: ActivityRowProps) {
  const done = activity.status === 'concluida';
  const subjectName = subject?.name ?? 'Sem matéria'; // FK órfã não quebra a linha (RNF-04)
  const tone = subjectTone(subject?.color);
  // Estilo da bolinha montado fora do JSX: dentro de `style={{...}}` o plugin do
  // Reanimated/worklets avisa sobre qualquer `.value` (aqui é a cor do tom, não um shared value).
  const dotStyle = tone !== null ? { backgroundColor: tone.value } : null;

  // Animação do checkbox: preenche na conclusão, esvazia ao reabrir.
  const [fill] = useState(() => new Animated.Value(done ? 1 : 0));
  useEffect(() => {
    Animated.timing(fill, {
      toValue: done ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [done, fill]);

  return (
    <ListItem onPress={onOpen}>
      <View style={styles.row}>
        <Touchable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Reabrir atividade' : 'Concluir atividade'}
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
            ]}>
            <Animated.View style={{ opacity: fill }}>
              <Check size={16} color={Palette.onAccent} strokeWidth={3} />
            </Animated.View>
          </View>
        </Touchable>

        <View style={styles.identifiers}>
          <Text
            style={done === true ? [styles.titleDone, styles.doneTitle] : styles.title}
            numberOfLines={2}>
            {activity.title}
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

        {activity.dueDate !== null ? <DueChip date={activity.dueDate} /> : null}
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  // Alvo de toque do checkbox: 44 com o conteúdo deslocado 8px à esquerda, para o
  // círculo ficar alinhado com o título em vez de colado na borda do item.
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
    ...Typography.bodyStrong,
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
});