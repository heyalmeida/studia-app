import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Radius, SCREEN_PADDING, TOUCH_TARGET, Typography } from '@/constants/theme';
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
 * Calendário mensal em `Modal` nativo (ADR-0009), apresentado como folha inferior: fundo
 * `#15151B`, raio 24 só no topo, padding 20 e `paddingBottom = insets.bottom + 20` — no
 * Android as ações ficam acima da barra de gestos.
 *
 * Barra de ações com `gap` 12: **Fechar** no destaque, **Hoje** secundário e **Limpar** em
 * texto vermelho discreto. O dia selecionado usa a cor de destaque; hoje fica marcado com
 * anel. Sem biblioteca de picker nova — roda igual no Expo Go.
 */
export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const insets = useSafeAreaInsets();
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
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Impede que o toque dentro da folha feche o calendário. */}
        <Pressable style={styles.sheetWrapper} onPress={() => undefined}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.header}>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Mês anterior"
                onPress={() => shiftMonth(-1)}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={styles.navButton}
                contentStyle={centeredContent}>
                <ChevronLeft size={20} color={Palette.textSecondary} />
              </Touchable>
              <Text style={styles.monthLabel}>
                {MONTHS[month]} {year}
              </Text>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
                onPress={() => shiftMonth(1)}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={styles.navButton}
                contentStyle={centeredContent}>
                <ChevronRight size={20} color={Palette.textSecondary} />
              </Touchable>
            </View>

            <View style={styles.weekRow}>
              {WEEKDAYS.map((label, index) => (
                <Text key={index} style={styles.weekDay}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={styles.cellEmpty} />;
                }
                const iso = toISO(new Date(year, month, day));
                const isSelected = value === iso;
                const isToday = today === iso;
                return (
                  <View key={index} style={styles.cell}>
                    <Touchable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => pick(day)}
                      pressedOpacity={0.7}
                      pressedScale={0.97}
                      style={[
                        styles.day,
                        isSelected ? styles.daySelected : null,
                        isToday && !isSelected ? styles.dayToday : null,
                      ]}
                      contentStyle={centeredContent}>
                      <Text style={[styles.dayLabel, isSelected ? styles.dayLabelSelected : null]}>
                        {day}
                      </Text>
                    </Touchable>
                  </View>
                );
              })}
            </View>

            <View style={styles.actions}>
              <Touchable
                accessibilityRole="button"
                onPress={() => {
                  onChange(null);
                  onClose();
                }}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={styles.actionClear}
                contentStyle={centeredContent}>
                <Text style={styles.actionClearLabel}>Limpar</Text>
              </Touchable>

              <Touchable
                accessibilityRole="button"
                onPress={() => {
                  onChange(today);
                  onClose();
                }}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={[styles.action, styles.actionSecondary]}
                contentStyle={centeredContent}>
                <Text style={styles.actionSecondaryLabel}>Hoje</Text>
              </Touchable>

              <Touchable
                accessibilityRole="button"
                onPress={onClose}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={[styles.action, styles.actionPrimary]}
                contentStyle={centeredContent}>
                <Text style={styles.actionPrimaryLabel}>Fechar</Text>
              </Touchable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Palette.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: Radius.field,
  },
  monthLabel: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  weekDay: {
    flex: 1,
    ...Typography.legend,
    color: Palette.textTertiary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  cell: {
    width: `${100 / 7}%`,
    height: 44,
    padding: 2,
  },
  cellEmpty: {
    width: `${100 / 7}%`,
    height: 44,
  },
  day: {
    flex: 1,
    borderRadius: Radius.chip,
  },
  daySelected: {
    backgroundColor: Palette.accent,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: Palette.border,
  },
  dayLabel: {
    ...Typography.body,
    color: Palette.text,
  },
  dayLabelSelected: {
    color: Palette.onAccent,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  action: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: Radius.field,
  },
  actionPrimary: {
    backgroundColor: Palette.accent,
  },
  actionPrimaryLabel: {
    ...Typography.body,
    color: Palette.onAccent,
  },
  actionSecondary: {
    backgroundColor: Palette.surfaceRaised,
  },
  actionSecondaryLabel: {
    ...Typography.body,
    color: Palette.textSecondary,
  },
  actionClear: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: Radius.field,
  },
  actionClearLabel: {
    ...Typography.body,
    color: Palette.danger,
  },
});