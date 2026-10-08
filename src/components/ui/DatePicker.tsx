import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { Touchable } from '@/components/ui/Touchable';
import { Palette } from '@/constants/theme';
import { todayISO } from '@/domain/date';

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
 * Calendário mensal em `Modal` nativo (ADR-0009): cabeçalho mês/ano com navegação, grade
 * 6×7 e rodapé com as ações. O dia selecionado usa a cor de destaque; hoje fica marcado
 * com anel. Sem biblioteca de picker nova — roda igual no Expo Go.
 */
export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
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
      <Pressable className="flex-1 items-center justify-center bg-black/60" onPress={onClose}>
        <Pressable className="w-full px-5" onPress={() => undefined}>
          <View className="gap-4 rounded-card border border-border bg-surface p-4">
            <View className="flex-row items-center justify-between">
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Mês anterior"
                onPress={() => shiftMonth(-1)}
                style={{ width: 44, height: 44 }}
                className="items-center justify-center rounded-field active:bg-surface-raised">
                <ChevronLeft size={20} color={Palette.textSecondary} />
              </Touchable>
              <Text className="text-cardTitle font-semibold text-text">
                {MONTHS[month]} {year}
              </Text>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
                onPress={() => shiftMonth(1)}
                style={{ width: 44, height: 44 }}
                className="items-center justify-center rounded-field active:bg-surface-raised">
                <ChevronRight size={20} color={Palette.textSecondary} />
              </Touchable>
            </View>

            <View className="flex-row">
              {WEEKDAYS.map((label, index) => (
                <Text
                  key={index}
                  className="flex-1 text-center text-legend text-text-tertiary">
                  {label}
                </Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {cells.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={{ width: `${100 / 7}%`, height: 44 }} />;
                }
                const iso = toISO(new Date(year, month, day));
                const isSelected = value === iso;
                const isToday = today === iso;
                return (
                  <View key={index} style={{ width: `${100 / 7}%`, height: 44, padding: 2 }}>
                    <Touchable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => pick(day)}
                      pressedScale={0.9}
                      className={
                        isSelected
                          ? 'h-full w-full items-center justify-center rounded-chip bg-accent'
                          : 'h-full w-full items-center justify-center rounded-chip'
                      }
                      style={isToday && !isSelected ? { borderWidth: 1, borderColor: Palette.border } : undefined}>
                      <Text
                        className={
                          isSelected ? 'text-body text-on-accent' : 'text-body text-text'
                        }>
                        {day}
                      </Text>
                    </Touchable>
                  </View>
                );
              })}
            </View>

            <View className="flex-row gap-2">
              <Touchable
                accessibilityRole="button"
                onPress={() => {
                  onChange(null);
                  onClose();
                }}
                style={{ minHeight: 44 }}
                className="flex-1 items-center justify-center rounded-field bg-surface-raised">
                <Text className="text-body text-text-secondary">Limpar</Text>
              </Touchable>
              <Touchable
                accessibilityRole="button"
                onPress={() => {
                  onChange(today);
                  onClose();
                }}
                style={{ minHeight: 44 }}
                className="flex-1 items-center justify-center rounded-field bg-surface-raised">
                <Text className="text-body text-text-secondary">Hoje</Text>
              </Touchable>
              <Touchable
                accessibilityRole="button"
                onPress={onClose}
                style={{ minHeight: 44 }}
                className="flex-1 items-center justify-center rounded-field bg-accent">
                <Text className="text-body text-on-accent">Fechar</Text>
              </Touchable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}