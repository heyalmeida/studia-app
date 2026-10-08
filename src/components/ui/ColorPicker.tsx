import Check from 'lucide-react-native/icons/check';
import { Text, View } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { Palette, SUBJECT_COLORS } from '@/constants/theme';

export interface ColorPickerProps {
  /** Valor atual (hex da paleta) ou null. */
  value: string | null;
  onChange: (color: string | null) => void;
  label?: string;
  error?: string;
}

/**
 * Seletor de cor da matéria (ADR-0009): as 8 bolinhas da paleta, sem nome escrito embaixo
 * de cada uma — o nome aparece no conteúdoAccessible da bolinha. Alvo de 44 por bolinha.
 */
export function ColorPicker({ value, onChange, label = 'Cor', error }: ColorPickerProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text className="text-legend text-text-tertiary">{label}</Text>

      <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
        {SUBJECT_COLORS.map((tone) => {
          const selected = tone.value === value;
          return (
            <View key={tone.value} style={{ padding: 6 }}>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel={tone.name}
                accessibilityState={{ selected }}
                onPress={() => onChange(selected ? null : tone.value)}
                pressedScale={0.88}
                style={{ width: 44, height: 44 }}
                className="items-center justify-center rounded-full border border-border bg-surface-raised">
                <View
                  className="h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: tone.value }}>
                  {selected ? <Check size={16} color={Palette.onAccent} strokeWidth={3} /> : null}
                </View>
              </Touchable>
            </View>
          );
        })}
      </View>

      {error !== undefined && error.length > 0 ? (
        <Text className="text-legend text-danger">{error}</Text>
      ) : null}
    </View>
  );
}