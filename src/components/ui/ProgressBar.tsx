import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

export interface ProgressBarProps {
  ratio: number; // 0..1 — clamp aplicado aqui, nunca fora
  /** Cor do preenchimento; a matéria usa a própria cor (ADR-0009). */
  color?: string;
  width?: number;
}

/** Barra de progresso fina (4px): traço na cor informada, trilha na superfície elevada. */
export function ProgressBar({ ratio, color = Palette.accent, width }: ProgressBarProps) {
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;

  return (
    <View style={[styles.track, width !== undefined ? { width } : undefined]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: Palette.surfaceRaised,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});