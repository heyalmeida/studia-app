import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface ChipProps {
  label: string;
  tone?: ChipTone;
  /** Ícone opcional à esquerda do rótulo (herdado da cor do tom). */
  icon?: ReactNode;
  /** Bolinha de cor antes do rótulo — usado para a cor da matéria. */
  dotColor?: string;
}

/** Classes por tom: fundo `accent-soft`/superfície + cor do texto. */
const TONE: Record<ChipTone, { container: string; label: string; icon: string }> = {
  neutral: {
    container: 'bg-surface-raised',
    label: 'text-text-secondary',
    icon: 'text-text-secondary',
  },
  accent: {
    container: 'bg-accent-soft',
    label: 'text-accent',
    icon: 'text-accent',
  },
  success: {
    container: 'bg-surface-raised',
    label: 'text-success',
    icon: 'text-success',
  },
  warning: {
    container: 'bg-surface-raised',
    label: 'text-warning',
    icon: 'text-warning',
  },
  danger: {
    container: 'bg-surface-raised',
    label: 'text-danger',
    icon: 'text-danger',
  },
};

/**
 * Chip de exibição (ADR-0009): rótulo curto com hierarquia tipográfica, sem borda.
 * `neutral` é o padrão; as semânticas existem para prazo (alerta) e atraso (urgente).
 */
export function Chip({ label, tone = 'neutral', icon, dotColor }: ChipProps) {
  const toneStyle = TONE[tone];

  return (
    <View
      className={`flex-row items-center gap-1 self-start rounded-chip px-2 py-1 ${toneStyle.container}`}>
      {dotColor !== undefined ? (
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      {icon !== undefined ? <View className={toneStyle.icon}>{icon}</View> : null}
      <Text className={`text-legend ${toneStyle.label}`} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}