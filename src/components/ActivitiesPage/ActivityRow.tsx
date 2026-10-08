import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';

import { DueChip } from '@/components/ui/DueChip';
import { ListItem } from '@/components/ui/ListItem';
import { Touchable } from '@/components/ui/Touchable';
import { Palette, subjectTone } from '@/constants/theme';
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
      <View className="flex-row items-center gap-3">
        <Touchable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? 'Reabrir atividade' : 'Concluir atividade'}
          onPress={onToggle}
          pressedScale={0.85}
          style={{ width: 44, height: 44 }}
          className="-ml-2 items-center justify-center">
          <View
            className="h-6 w-6 items-center justify-center rounded-full border"
            style={{
              borderColor: done ? Palette.accent : Palette.border,
              backgroundColor: done ? Palette.accent : 'transparent',
            }}>
            <Animated.View style={{ opacity: fill }}>
              <Check size={16} color={Palette.onAccent} strokeWidth={3} />
            </Animated.View>
          </View>
        </Touchable>

        <View className="flex-1 gap-1">
          <Text
            className={done ? 'text-body text-text-tertiary' : 'text-bodyStrong font-semibold text-text'}
            style={done ? { textDecorationLine: 'line-through' } : undefined}
            numberOfLines={2}>
            {activity.title}
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

        {activity.dueDate !== null ? <DueChip date={activity.dueDate} /> : null}
      </View>
    </ListItem>
  );
}