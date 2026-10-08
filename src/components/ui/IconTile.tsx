import { StyleSheet, Text, View } from 'react-native';

import { renderIcon } from '@/components/ui/IconPicker';
import { subjectTone, Palette, Radius } from '@/constants/theme';
import { monogram } from '@/domain/monogram';
import type { Subject } from '@/domain/models';

export interface IconTileProps {
  subject: Subject;
  /** Lado do quadrado (44 no card de matéria, 40 em listas compactas). */
  size?: number;
}

/**
 * Quadrado de ícone da matéria (ADR-0009): 44×44, raio 12, fundo tingido na cor da
 * matéria e ícone 22 na mesma cor. Sem cor escolhida → superfície elevada + monograma
 * (a derivação do monograma continua válida; ver `domain/monogram.ts`).
 *
 * Estilo em `StyleSheet` (ADR-0010): o lado é calculado em runtime, então é a exceção
 * já prevista no ADR-0007 para valor dinâmico.
 */
export function IconTile({ subject, size = 44 }: IconTileProps) {
  const tone = subjectTone(subject.color);
  const background = tone?.soft ?? Palette.surfaceRaised;
  const foreground = tone?.value ?? Palette.textSecondary;
  const icon = renderIcon(subject.icon, Math.round(size * 0.5), foreground);

  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: Radius.field, backgroundColor: background },
      ]}>
      {icon ?? (
        <Text
          style={[
            styles.monogram,
            { fontSize: Math.round(size * 0.36), color: foreground },
          ]}>
          {monogram(subject.name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    fontWeight: '600',
  },
});