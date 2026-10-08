import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';

export interface TouchableProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Escala do pressionado. `1` desliga a animação (ex.: item de lista sem recuo). */
  pressedScale?: number;
  /** Opacidade do pressionado. */
  pressedOpacity?: number;
}

/**
 * Pressable do app (ADR-0009): todo alvo tocável tem feedback — encolhe para
 * `pressedScale` e ganha opacidade. Usar `Animated` do RN (sem lib nova) mantém o
 * comportamento idêntico no Expo Go.
 */
export function Touchable({
  children,
  style,
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
        onPressIn={() => animate(pressedScale, pressedOpacity)}
        onPressOut={() => animate(1, 1)}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

/** Reexportado para quem precisar do tipo do elemento estilizado pelo `Touchable`. */
export type TouchableView = View;