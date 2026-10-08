import { Modal, Pressable, Text, View } from 'react-native';
import { useState } from 'react';

import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { todayISO } from '@/domain/date';
import { useTheme } from '@/hooks/use-theme';

/** Meses em PT-BR (o picker é nosso — nada de inglês). */
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** Cabeçalhos de dia da semana, começando no domingo (convenção BR). */
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toLocalDate(iso: string | null): Date | null {
  if (iso === null || iso.trim().length === 0) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export interface DatePickerProps {
  /** ISO 'YYYY-MM-DD' selecionada, ou null. */
  value: string | null;
  onChange: (iso: string | null) => void;
  onClose: () => void;
}

/**
 * Calendário mensal próprio (PT-BR) em Modal nativo: cabeçalho mês/ano com navegação,
 * grade 6×7 e rodapé com as ações. Monocromático (ADR-0006) e com os tokens do app,
 * ao contrário de wrappers de picker de terceiros.
 */
export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const theme = useTheme();
  const selected = toLocalDate(value);
  const [visible, setVisible] = useState<Date>(
    () => selected ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const year = visible.getFullYear();
  const month = visible.getMonth();
  const today = todayISO();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function shiftMonth(delta: number) {
    setVisible((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function pick(day: number) {
    onChange(toISO(new Date(year, month, day)));
    onClose();
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={onClose}>
        <Pressable className="w-full px-four" onPress={() => undefined}>
          <View className="gap-three rounded-card border border-border bg-background p-three">
            <View className="flex-row items-center justify-between">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mês anterior"
                onPress={() => shiftMonth(-1)}
                className="rounded-chip border border-border p-two">
                <ChevronLeft size={18} color={theme.text} />
              </Pressable>
              <Text className="text-body font-semibold text-text">
                {MONTHS[month]} {year}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
                onPress={() => shiftMonth(1)}
                className="rounded-chip border border-border p-two">
                <ChevronRight size={18} color={theme.text} />
              </Pressable>
            </View>

            <View className="flex-row">
              {WEEKDAYS.map((label, index) => (
                <Text
                  key={index}
                  className="flex-1 text-center text-section font-semibold uppercase tracking-section text-text-tertiary">
                  {label}
                </Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {cells.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={{ width: `${100 / 7}%`, height: 40 }} />;
                }
                const iso = toISO(new Date(year, month, day));
                const isSelected = value === iso;
                const isToday = today === iso;
                return (
                  <View key={index} style={{ width: `${100 / 7}%`, height: 40, padding: 2 }}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => pick(day)}
                      className={
                        isSelected
                          ? 'h-full w-full items-center justify-center rounded-chip bg-inverse'
                          : 'h-full w-full items-center justify-center rounded-chip'
                      }
                      style={isToday && !isSelected ? { borderWidth: 1, borderColor: theme.borderStrong } : undefined}>
                      <Text
                        className={
                          isSelected ? 'text-body text-on-inverse' : 'text-body text-text'
                        }>
                        {day}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View className="flex-row justify-between gap-two">
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onChange(null);
                  onClose();
                }}
                className="rounded-field border border-border px-three py-two">
                <Text className="text-body text-text-secondary">Limpar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onChange(today);
                  onClose();
                }}
                className="rounded-field border border-border px-three py-two">
                <Text className="text-body text-text-secondary">Hoje</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                className="rounded-field bg-inverse px-three py-two">
                <Text className="text-body text-on-inverse">Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}