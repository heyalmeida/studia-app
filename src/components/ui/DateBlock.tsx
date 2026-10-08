import { Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

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
    <View
      className="items-center justify-center rounded-card bg-surface-raised"
      style={{ width: 56, height: 56 }}>
      <Text
        className="text-day font-bold"
        style={{ color: muted ? Palette.textTertiary : Palette.text }}>
        {day}
      </Text>
      <Text className="text-legend uppercase text-text-tertiary">{month}</Text>
    </View>
  );
}