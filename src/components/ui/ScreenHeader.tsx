import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TOUCH_TARGET } from '@/constants/theme';
import { Touchable } from '@/components/ui/Touchable';

export interface ScreenHeaderProps {
  title: string;
  /**
   * Ações à direita, em linha. Cada uma tem alvo ≥44 e ícone 20px **sem fundo
   * circular** — o círculo de fundo do header antigo era o que sobrepunha a criação.
   */
  actions?: { icon: ReactNode; label: string; onPress: () => void }[];
  /** Ação opcional à esquerda do título (voltar/fechar), mesma anatomia das ações. */
  leading?: { icon: ReactNode; label: string; onPress: () => void };
}

/**
 * Cabeçalho de tela (ADR-0009): título à direita do botão de voltar, ações à direita
 * na **mesma linha** e dentro da safe area. Padding lateral 20 igual ao do conteúdo,
 * então nada sobrepõe nada — a criação de item sai daqui e vai para o FAB.
 */
export function ScreenHeader({ title, actions, leading }: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']} className="w-full bg-background">
      <View className="min-h-[52px] flex-row items-center justify-between gap-3 px-5 pb-2 pt-1">
        {leading !== undefined ? (
          <IconButton icon={leading.icon} label={leading.label} onPress={leading.onPress} />
        ) : (
          <View className="shrink" />
        )}

        <Text className="flex-1 text-title font-bold text-text" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center gap-1">
          {(actions ?? []).map((action) => (
            <IconButton
              key={action.label}
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}

/** Botão de ícone 20px em alvo 44×44, sem círculo de fundo (só feedback de toque). */
function IconButton({ icon, label, onPress }: IconButtonProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      pressedScale={0.9}
      pressedOpacity={0.6}
      style={{ minWidth: TOUCH_TARGET, minHeight: TOUCH_TARGET }}
      className="items-center justify-center">
      <View className="h-6 w-6 items-center justify-center">{icon}</View>
    </Touchable>
  );
}