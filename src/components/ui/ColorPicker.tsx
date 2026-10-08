import Check from 'lucide-react-native/icons/check';
import { StyleSheet, Text, View } from 'react-native';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, SUBJECT_COLORS, TOUCH_TARGET, Typography } from '@/constants/theme';

export interface ColorPickerProps {
  /** Valor atual (hex da paleta) ou null. */
  value: string | null;
  onChange: (color: string | null) => void;
  label?: string;
  error?: string;
}

/**
 * Seletor de cor da matéria (ADR-0009): as 8 bolinhas da paleta, sem nome escrito embaixo
 * de cada uma — o nome aparece no rótulo acessível da bolinha. Alvo de 44 por bolinha.
 *
 * Estilo em `StyleSheet` com números explícitos — no Expo Go o `className` não se aplica.
 */
export function ColorPicker({ value, onChange, label = 'Cor', error }: ColorPickerProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.grid}>
        {SUBJECT_COLORS.map((tone) => {
          const selected = tone.value === value;
          return (
            <View key={tone.value} style={styles.cell}>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel={tone.name}
                accessibilityState={{ selected }}
                onPress={() => onChange(selected ? null : tone.value)}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={styles.swatch}
                contentStyle={centeredContent}>
                <View style={[styles.dot, { backgroundColor: tone.value }]}>
                  {selected ? <Check size={16} color={Palette.onAccent} strokeWidth={3} /> : null}
                </View>
              </Touchable>
            </View>
          );
        })}
      </View>

      {error !== undefined && error.length > 0 ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    ...Typography.legend,
    color: Palette.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  cell: {
    padding: 6,
  },
  swatch: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceRaised,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...Typography.legend,
    color: Palette.danger,
    marginTop: 6,
  },
});