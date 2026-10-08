import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { DatePicker } from '@/components/ui/DatePicker';
import { formatDDMMYYYY, maskDDMMYYYY, parseDDMMYYYY } from '@/domain/date';

export interface DateInputProps {
  /** ISO 'YYYY-MM-DD' ou null. */
  date: string | null;
  onChange: (iso: string | null) => void;
  label: string;
  placeholder?: string;
  error?: string;
  warning?: string;
  disabled?: boolean;
}

/**
 * Campo de data em duas vias: digitação manual (máscara DD/MM/AAAA) e calendário
 * mensal próprio em Modal nativo. `date` é sempre ISO (ou null).
 */
export function DateInput({
  date,
  onChange,
  label,
  placeholder = 'DD/MM/AAAA',
  error,
  warning,
  disabled = false,
}: DateInputProps) {
  // `null` = campo ainda não editado; exibe o valor convertido da prop (chega async).
  const [draft, setDraft] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const text = draft ?? (date === null || date === '' ? '' : formatDDMMYYYY(date));
  const hasError = error !== undefined && error.length > 0;

  function editText(raw: string) {
    const masked = maskDDMMYYYY(raw);
    setDraft(masked);
    if (masked.trim().length === 0) {
      onChange(null);
      return;
    }
    const iso = parseDDMMYYYY(masked);
    if (iso !== null) onChange(iso);
  }

  return (
    <View style={{ gap: 4 }}>
      <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
        {label}
      </Text>
      <View className="flex-row items-center gap-two">
        <TextInput
          value={text}
          onChangeText={editText}
          placeholder={placeholder}
          placeholderClassName="text-text-tertiary"
          keyboardType="number-pad"
          maxLength={10}
          editable={!disabled}
          className={
            hasError
              ? 'flex-1 bg-surface rounded-field border-[1.5px] border-border-strong px-three py-two text-body text-text'
              : 'flex-1 bg-surface rounded-field border border-border px-three py-two text-body text-text'
          }
          style={{ minHeight: 48 }}
        />
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={() => setPickerOpen(true)}
          className="rounded-field border border-border bg-backgroundElement px-three py-two">
          <Text className="text-body text-text-secondary">escolher...</Text>
        </Pressable>
      </View>
      {hasError ? (
        <Text style={{ fontSize: 13 }} className="text-text">
          {error}
        </Text>
      ) : null}
      {!hasError && warning !== undefined && warning.length > 0 ? (
        <Text style={{ fontSize: 13 }} className="text-text-secondary">
          Aviso: {warning}
        </Text>
      ) : null}
      {pickerOpen && !disabled ? (
        <DatePicker
          value={date === null || date === '' ? null : date}
          onChange={(iso) => {
            setDraft(iso === null ? '' : formatDDMMYYYY(iso));
            onChange(iso);
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </View>
  );
}