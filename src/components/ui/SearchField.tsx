import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
// Deep imports (icons/<nome>) evitam o barrel gigante do lucide-react-native,
// que derrubava o bundler do Metro com re-exports em cadeia.
import Search from 'lucide-react-native/icons/search';
import X from 'lucide-react-native/icons/x';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, Radius, Spacing, TOUCH_TARGET, Typography } from '@/constants/theme';

export interface SearchFieldProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}

/** Altura da linha: 44px, um pouco abaixo de FIELD_HEIGHT (52) — é um controle de lista, não de formulário. */
const FIELD_HEIGHT_SEARCH = 44;

/**
 * Campo de busca das listas (Slice 7). Ao contrário do `Input` de formulário, **não tem
 * rótulo**: ele fica colado abaixo do cabeçalho e o placeholder já diz o que é. Ícone de lupa
 * à esquerda, `X` à direita só quando há texto.
 *
 * A borda ganha a cor de destaque no foco, como nos outros campos. Estilo em `StyleSheet`
 * com tokens — no Expo Go o `className` não se aplica (ADR-0010).
 */
export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused === true ? styles.containerFocused : null]}>
      <Search size={18} color={Palette.textTertiary} strokeWidth={1.8} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        // A busca é por substring: o teclado não deve "corrigir" o termo digitado.
        style={styles.input}
      />

      {value.length > 0 ? (
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          onPress={() => onChangeText('')}
          pressedOpacity={0.7}
          pressedScale={0.97}
          style={styles.clear}
          contentStyle={centeredContent}>
          <X size={16} color={Palette.textTertiary} strokeWidth={2} />
        </Touchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: FIELD_HEIGHT_SEARCH,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.field,
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  containerFocused: {
    borderColor: Palette.accent,
  },
  input: {
    flex: 1,
    fontSize: Typography.field.fontSize,
    fontWeight: Typography.field.fontWeight,
    lineHeight: Typography.field.lineHeight,
    color: Palette.text,
  },
  // O alvo de toque é maior que o ícone: 44px, como o resto do app.
  clear: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    marginRight: -Spacing.three,
  },
});
