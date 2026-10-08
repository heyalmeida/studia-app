import { StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Typography } from '@/constants/theme';

const MONTHS_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export interface DateBlockProps {
  /** ISO 'YYYY-MM-DD'. */
  date: string;
  /** Data já passada/realizada esmaece o bloco (histórico). */
  muted?: boolean;
}

/**
 * Bloco de data (ADR-0009): dia grande, mês pequeno, quadrado de 56. Usado na avaliação
 * (card de avaliação e do painel) — é o mesmo bloco nas duas telas.
 */
export function DateBlock({ date, muted = false }: DateBlockProps) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const day = match !== null ? match[3] : '--';
  const month = match !== null ? MONTHS_SHORT[Number(match[2]) - 1] ?? '' : '';

  return (
    <View style={styles.block}>
      <Text style={[styles.day, { color: muted ? Palette.textTertiary : Palette.text }]}>
        {day}
      </Text>
      <Text style={styles.month}>{month}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.card,
    backgroundColor: Palette.surfaceRaised,
  },
  day: {
    ...Typography.day,
  },
  month: {
    ...Typography.legend,
    textTransform: 'uppercase',
    color: Palette.textTertiary,
  },
});