import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import DatePicker from 'expo-datepicker';

import { formatDDMMYYYY, maskDDMMYYYY, parseDDMMYYYY, todayISO } from '@/domain/date';

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

/** '2026-10-07' | '2026/10/7' -> '07/10/2026' (formato do expo-datepicker) ou null. */
function pickerValueToDDMMYYYY(value: string): string | null {
  const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

/**
 * Campo de data em duas vias: digitação manual (máscara DD/MM/AAAA) e picker nativo
 * (expo-datepicker — modais de mês/dia/ano). `date` é sempre ISO (ou null).
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
          onPress={() => setPickerOpen((open) => !open)}
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
      {/* O DatePicker do expo-datepicker usa FlatList (as opções de mês/dia/ano);
          precisa ficar fora do ScrollView do formulário — daí o Modal nativo. */}
      <Modal
        visible={pickerOpen && !disabled}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setPickerOpen(false)}>
          <Pressable
            className="mx-four rounded-card border border-border bg-background p-three"
            onPress={() => undefined}>
            <DatePicker
              date={date === null || date === '' ? todayISO() : date}
              onChange={(value) => {
                const ddmmyyyy = pickerValueToDDMMYYYY(value);
                const iso = ddmmyyyy === null ? null : parseDDMMYYYY(ddmmyyyy);
                setDraft(ddmmyyyy);
                onChange(iso);
              }}
              borderColor="var(--color-border)"
              backgroundColor="var(--color-surface)"
              modalBackgroundColor="var(--color-background)"
              selectedColor="var(--color-inverse)"
              selectedTextColor="var(--color-on-inverse)"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setPickerOpen(false)}
              className="mt-two items-center rounded-field border border-border px-three py-two">
              <Text className="text-body text-text-secondary">Fechar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
