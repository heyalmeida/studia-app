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
   * da zona tocável e o toque nas bordas de um card/chip "some". Passe aqui o mesmo
   * padding que estaria no `className`.
   */
  contentClassName?: string;
  /** Escala do pressionado. */
  pressedScale?: number;
  /** Opacidade do pressionado. */
  pressedOpacity?: number;
}

/**
 * Pressable do app (ADR-0009): todo alvo tocável tem feedback — encolhe para
 * `pressedScale` e ganha opacidade. `Animated` do RN (sem lib nova) mantém o
 * comportamento idêntico no Expo Go.
 */
export function Touchable({
  children,
  style,
  contentClassName,
  pressedScale = 0.97,
  pressedOpacity = 0.75,
  disabled,
  ...rest
}: TouchableProps) {
  // useState (lazy) e não useRef: o lint novo do React proibe ler ref durante o render.
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
        style={styles.fill}
        className={contentClassName}
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