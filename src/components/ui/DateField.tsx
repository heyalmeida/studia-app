import { useState } from 'react';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import { Text, View } from 'react-native';

import { ChoiceChip } from '@/components/ui/ChoiceChip';
import { DatePicker } from '@/components/ui/DatePicker';
import { Touchable } from '@/components/ui/Touchable';
import { Palette } from '@/constants/theme';
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
 * Campo de data (ADR-0009): o campo **inteiro** é o alvo e abre o calendário ao toque —
 * o botão "escolher..." separado saiu. Atalhos de 1 toque: Hoje, Amanhã e Próxima semana.
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

  const field = hasError
    ? 'border-danger'
    : pickerOpen
      ? 'border-accent'
      : 'border-border';

  const shortcutValue = (days: number) => addDaysISO(undefined, days);

  return (
    <View style={{ gap: 8 }}>
      <Text className="text-legend text-text-tertiary">{label}</Text>

      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value === null ? 'não definida' : formatDDMMYYYY(value)}`}
        disabled={disabled}
        onPress={() => setPickerOpen(true)}
        pressedOpacity={0.85}
        style={{ minHeight: 52 }}
        className={`flex-row items-center gap-3 rounded-field border bg-surface-raised px-4 ${
          disabled ? 'opacity-40' : ''
        } ${field}`}>
        <CalendarDays
          size={20}
          color={hasError ? Palette.danger : Palette.textSecondary}
          strokeWidth={1.8}
        />
        <Text
          className={`text-body ${value === null ? 'text-text-tertiary' : 'text-text'}`}
          numberOfLines={1}>
          {value === null ? 'Selecionar data' : formatDDMMYYYY(value)}
        </Text>
      </Touchable>

      {shortcuts ? (
        <View className="flex-row gap-2">
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

      {hasError ? <Text className="text-legend text-danger">{error}</Text> : null}
      {hasWarning ? <Text className="text-legend text-warning">{warning}</Text> : null}

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