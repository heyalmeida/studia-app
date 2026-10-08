import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Typography } from '@/constants/theme';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface ChipProps {
  label: string;
  tone?: ChipTone;
  /** Ícone opcional à esquerda do rótulo (herdado da cor do tom). */
  icon?: ReactNode;
  /** Bolinha de cor antes do rótulo — usado para a cor da matéria. */
  dotColor?: string;
}

/** Cada tom resolve para um par de cores — nada de classe utilitária. */
interface ToneStyle {
  container: { backgroundColor: string };
  label: { color: string };
}

/** Cor de fundo e de texto por tom: fundo neutro + cor da semântica. */
const TONE: Record<ChipTone, ToneStyle> = {
  neutral: {
    container: { backgroundColor: Palette.surfaceRaised },
    label: { color: Palette.textSecondary },
  },
  accent: {
    container: { backgroundColor: Palette.accentSoft },
    label: { color: Palette.accent },
  },
  success: {
    container: { backgroundColor: Palette.surfaceRaised },
    label: { color: Palette.success },
  },
  warning: {
    container: { backgroundColor: Palette.surfaceRaised },
    label: { color: Palette.warning },
  },
  danger: {
    container: { backgroundColor: Palette.surfaceRaised },
    label: { color: Palette.danger },
  },
};

/**
 * Chip de exibição (ADR-0009): rótulo curto com hierarquia tipográfica, sem borda.
 * `neutral` é o padrão; as semânticas existem para prazo (alerta) e atraso (urgente).
 *
 * Estilo em `StyleSheet` com números explícitos — no Expo Go o `className` não se aplica.
 */
export function Chip({ label, tone = 'neutral', icon, dotColor }: ChipProps) {
  const toneStyle = TONE[tone];

  return (
    <View style={[styles.chip, toneStyle.container]}>
      {dotColor !== undefined ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      {icon !== undefined ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, toneStyle.label]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.chip,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  icon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.legend,
  },
});