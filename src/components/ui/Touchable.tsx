import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface TouchableProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  /** Visual do alvo (fundo, borda, raio, tamanho fixo). */
  style?: StyleProp<ViewStyle>;
  /**
   * Padding **do Pressable**, não do Animated.View. Sem isso a área de respiro fica fora
   * da zona tocável e o toque nas bordas de um card/chip "some".
   */
  contentStyle?: StyleProp<ViewStyle>;
  /** Escala do pressionado. */
  pressedScale?: number;
  /** Opacidade do pressionado. */
  pressedOpacity?: number;
}

/**
 * Pressable do app (ADR-0009): todo alvo tocável tem feedback — encolhe para
 * `pressedScale` e ganha opacidade. `Animated` do RN (sem lib nova) mantém o
 * comportamento idêntico no Expo Go.
 *
 * Regra de feedback (correção de layout 2026-10-08): opacidade 0.7 ou escala 0.97 em
 * **todo** alvo tocável.
 */
export function Touchable({
  children,
  style,
  contentStyle,
  pressedScale = 0.97,
  pressedOpacity = 0.7,
  disabled,
  ...rest
}: TouchableProps) {
  // useState (lazy) e não useRef: o lint novo do React proíbe ler ref durante o render.
  const [scale] = useState(() => new Animated.Value(1));
  const [opacity] = useState(() => new Animated.Value(1));

  function animate(toScale: number, toOpacity: number) {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }),
      Animated.timing(opacity, {
        toValue: toOpacity,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
      <Pressable
        {...rest}
        disabled={disabled}
        // `fill`: quando o alvo tem altura definida (FAB, checkbox, item da tab bar), o
        // Pressable ocupa o retângulo inteiro em vez de só o conteúdo.
        style={[styles.fill, contentStyle]}
        onPressIn={() => animate(pressedScale, pressedOpacity)}
        onPressOut={() => animate(1, 1)}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
  },
});

/**
 * Centraliza o conteúdo **dentro** do `Pressable` (não do Animated.View). Use como
 * `contentStyle` em todo alvo de altura fixa: sem isso o `flexGrow: 1` do Pressable
 * empurra o conteúdo para o topo/alto da caixa.
 */
export const centeredContent: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};