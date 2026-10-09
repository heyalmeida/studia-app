import { StyleSheet, Text, View } from 'react-native';

import { Touchable } from '@/components/ui/Touchable';
import { Palette, TOUCH_TARGET, Typography } from '@/constants/theme';

export interface SwitchFieldProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Medidas do switch desenhado à mão (ADR-0010): trilha 50×30, botão 26 travado no centro. */
const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 26;
const KNOB_PADDING = 2;
/** Deslocamento do botão entre desligado (2) e ligado (50 - 26 - 2 = 22). */
const KNOB_OFFSET_OFF = KNOB_PADDING;
const KNOB_OFFSET_ON = TRACK_WIDTH - KNOB_SIZE - KNOB_PADDING;

/**
 * Linha de formulário com switch (ADR-0009): rótulo + descrição à esquerda, switch à
 * direita, a linha inteira tocável. Desligado = trilha na cor de borda e botão em texto
 * terciário; ligado = trilha no destaque único do app e botão no contraste do destaque —
 * o estado "on" é o único lugar aqui em que o índigo aparece.
 *
 * Sem `Switch` nativo: o componente do RN não segue o tema escuro do Studia e não permite
 * tokens. Estilo em `StyleSheet` com números explícitos (ADR-0010) e alvo de toque de
 * 44px (TOUCH_TARGET) na linha toda.
 */
export function SwitchField({
  value,
  onChange,
  label,
  description,
  disabled = false,
}: SwitchFieldProps) {
  return (
    <Touchable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={[styles.row, disabled ? styles.disabled : null]}
      contentStyle={styles.rowContent}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
        {description !== undefined ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      <View
        style={[styles.track, value ? styles.trackOn : styles.trackOff]}
        // purely visual: o alvo e a semântica ficam no Pressable da linha
        pointerEvents="none">
        <View
          style={[
            styles.knob,
            value ? styles.knobOn : styles.knobOff,
            { transform: [{ translateX: value ? KNOB_OFFSET_ON : KNOB_OFFSET_OFF }] },
          ]}
        />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 12,
  },
  // Altura mínima = alvo de toque; o padding do Pressable é a área tocável real.
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: TOUCH_TARGET,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    flexShrink: 1,
    gap: 2,
  },
  label: {
    ...Typography.cardTitle,
    color: Palette.text,
  },
  description: {
    ...Typography.legend,
    fontWeight: '400',
    color: Palette.textTertiary,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  trackOff: {
    backgroundColor: Palette.border,
  },
  trackOn: {
    backgroundColor: Palette.accent,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
  },
  knobOff: {
    backgroundColor: Palette.textTertiary,
  },
  knobOn: {
    backgroundColor: Palette.onAccent,
  },
});
