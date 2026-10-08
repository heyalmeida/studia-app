import { useState } from 'react';
import Calendar from 'lucide-react-native/icons/calendar';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/ui/ChoiceChip';
import { DatePicker } from '@/components/ui/DatePicker';
import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { FIELD_HEIGHT, Palette, Radius, Typography } from '@/constants/theme';
import { addDaysISO, formatDDMMYYYY, todayISO } from '@/domain/date';

export interface DateFieldProps {
  label: string;
  /** ISO 'YYYY-MM-DD' ou null. */
  value: string | null;
  onChange: (iso: string | null) => void;
  error?: string;
  warning?: string;
  disabled?: boolean;
  /** Esconde os atalhos (usado onde o atalho não faz sentido). */
  shortcuts?: boolean;
}

/**
 * Campo de data (ADR-0009): o campo **inteiro** é o alvo e abre o calendário ao toque; ao
 * lado, um botão de ícone 52×52 com `Calendar` 20 faz a mesma coisa de forma explícita.
 * Atalhos de 1 toque em pílula: Hoje, Amanhã e Próxima semana.
 *
 * Linha com `gap` 12, rótulo 12px com 8px até o campo e 20px até o próximo grupo.
 * Estilo em `StyleSheet` com números explícitos — no Expo Go o `className` não se aplica.
 */
export function DateField({
  label,
  value,
  onChange,
  error,
  warning,
  disabled = false,
  shortcuts = true,
}: DateFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const hasError = error !== undefined && error.length > 0;
  const hasWarning = !hasError && warning !== undefined && warning.length > 0;

  function openPicker() {
    setPickerOpen(true);
  }

  function borderColor(): string {
    if (hasError) return Palette.danger;
    if (pickerOpen) return Palette.accent;
    return Palette.border;
  }

  const shortcutValue = (days: number) => addDaysISO(undefined, days);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <Touchable
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value === null ? 'não definida' : formatDDMMYYYY(value)}`}
          disabled={disabled}
          onPress={openPicker}
          pressedOpacity={0.7}
          pressedScale={0.97}
          style={[
            styles.input,
            { borderColor: borderColor() },
            disabled ? styles.disabled : null,
          ]}
          // Alinha na vertical, mas mantém o texto encostado à esquerda como nos outros campos.
          contentStyle={styles.inputContent}>
          <Text
            style={[styles.value, value === null ? styles.valueEmpty : null]}
            numberOfLines={1}>
            {value === null ? 'Selecionar data' : formatDDMMYYYY(value)}
          </Text>
        </Touchable>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel={`Escolher ${label.toLowerCase()}`}
          disabled={disabled}
          onPress={openPicker}
          pressedOpacity={0.7}
          pressedScale={0.97}
          style={[styles.calendarButton, disabled ? styles.disabled : null]}
          contentStyle={centeredContent}>
          <Calendar size={20} color={Palette.textSecondary} strokeWidth={1.8} />
        </Touchable>
      </View>

      {shortcuts && !disabled ? (
        <View style={styles.shortcuts}>
          <ChoiceChip
            label="Hoje"
            selected={value === todayISO()}
            onPress={() => onChange(todayISO())}
          />
          <ChoiceChip
            label="Amanhã"
            selected={value === shortcutValue(1)}
            onPress={() => onChange(shortcutValue(1))}
          />
          <ChoiceChip
            label="Próxima semana"
            selected={value === shortcutValue(7)}
            onPress={() => onChange(shortcutValue(7))}
          />
        </View>
      ) : null}

      {hasError ? <Text style={[styles.message, { color: Palette.danger }]}>{error}</Text> : null}
      {hasWarning ? (
        <Text style={[styles.message, { color: Palette.warning }]}>{warning}</Text>
      ) : null}

      {pickerOpen && !disabled ? (
        <DatePicker
          value={value}
          onChange={(iso) => {
            onChange(iso);
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 20,
  },
  label: {
    ...Typography.legend,
    color: Palette.textTertiary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: FIELD_HEIGHT,
    borderRadius: Radius.field,
    backgroundColor: Palette.surface,
    borderWidth: 1,
  },
  value: {
    ...Typography.field,
    color: Palette.text,
  },
  inputContent: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  valueEmpty: {
    color: Palette.textTertiary,
  },
  calendarButton: {
    width: FIELD_HEIGHT,
    height: FIELD_HEIGHT,
    borderRadius: Radius.field,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  disabled: {
    opacity: 0.4,
  },
  shortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  message: {
    ...Typography.legend,
    marginTop: 6,
  },
});