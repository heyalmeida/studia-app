import { Chip, type ChipTone } from '@/components/ui/Chip';
import { daysUntil, relativeLabelBR } from '@/domain/date';

export interface DueChipProps {
  /** ISO 'YYYY-MM-DD' do prazo/data. */
  date: string;
  /** Rótulo próprio quando a semântica muda (ex.: avaliação usa "em 5 dias"). */
  label?: string;
  /** Rótulo quando a data já passou ("3 dias atrasada"). */
  overdueLabel?: string;
}

/**
 * Chip de prazo (ADR-0009): cinza quando há folga, **alerta** para hoje/amanhã e
 * **urgente** quando venceu. O texto é sempre em linguagem natural, nunca cor sozinha —
 * quem não distingue a cor ainda lê o prazo (RNF-04/RNF-01).
 */
export function DueChip({ date, label, overdueLabel }: DueChipProps) {
  const days = daysUntil(date);
  const overdue = days < 0;

  const tone: ChipTone = overdue ? 'danger' : days <= 1 ? 'warning' : 'neutral';
  const text = overdue
    ? (overdueLabel ?? `atrasada ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`)
    : (label ?? relativeLabelBR(date));

  return <Chip label={text} tone={tone} />;
}