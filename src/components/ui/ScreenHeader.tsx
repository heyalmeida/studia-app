import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreateButton } from '@/components/ui/CreateButton';
import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette, SCREEN_PADDING, TOUCH_TARGET, Typography } from '@/constants/theme';

export interface ScreenHeaderProps {
  title: string;
  /** Ação de voltar/fechar: desenha o botão circular com `ChevronLeft` à esquerda do título. */
  onBack?: () => void;
  /** Rótulo acessível do botão de voltar (padrão: "Voltar"). */
  backLabel?: string;
  /**
   * Botão de criação na linha do título (telas de lista). Fica a 12px de distância de
   * qualquer outra ação, alinhado ao centro vertical do título.
   */
  createAction?: { label: string; onPress: () => void };
}

/**
 * Cabeçalho de tela (ADR-0009): **uma linha só** — voltar (quando existe), título e ação de
 * criação. Padding lateral 20 igual ao do conteúdo e `minHeight` 56, então nada sobrepõe
 * nada.
 *
 * Espaçamento em `StyleSheet` com valores numéricos explícitos (não `className`), para
 * valer também no Expo Go; a safe area do topo vem de `useSafeAreaInsets`.
 */
export function ScreenHeader({ title, onBack, backLabel = 'Voltar', createAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {onBack !== undefined ? <BackButton label={backLabel} onPress={onBack} /> : null}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {createAction !== undefined ? (
          <View style={styles.action}>
            <CreateButton label={createAction.label} onPress={createAction.onPress} size="header" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

/** Botão de voltar 44×44, raio 22, superfície elevada e `ChevronLeft` 24 centralizado. */
function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      pressedOpacity={0.7}
      pressedScale={0.97}
      style={styles.back}
      contentStyle={centeredContent}>
      <ChevronLeft size={24} color={Palette.text} strokeWidth={2} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: Palette.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 12,
  },
  back: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    marginRight: 12,
    backgroundColor: Palette.surfaceRaised,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    ...Typography.title,
    color: Palette.text,
  },
  action: {
    flexShrink: 0,
    marginLeft: 12,
  },
});