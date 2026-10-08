import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
// Deep imports (icons/<nome>) evitam o barrel gigante do lucide-react-native,
// que derrubava o bundler do Metro com re-exports em cadeia.
import BookOpen from 'lucide-react-native/icons/book-open';
import GraduationCap from 'lucide-react-native/icons/graduation-cap';
import Calculator from 'lucide-react-native/icons/calculator';
import FlaskConical from 'lucide-react-native/icons/flask-conical';
import Microscope from 'lucide-react-native/icons/microscope';
import Zap from 'lucide-react-native/icons/zap';
import PaletteIcon from 'lucide-react-native/icons/palette';
import Music from 'lucide-react-native/icons/music';
import Languages from 'lucide-react-native/icons/languages';
import ChartColumn from 'lucide-react-native/icons/chart-column';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import PenLine from 'lucide-react-native/icons/pen-line';
import type { LucideIcon } from 'lucide-react-native';

import { Touchable } from '@/components/ui/Touchable';
import { Palette as Tokens } from '@/constants/theme';

/** 12 ícones de estudo; a chave (nome) é o que vai para `Subject.icon`. */
const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'GraduationCap', Icon: GraduationCap },
  { name: 'Calculator', Icon: Calculator },
  { name: 'FlaskConical', Icon: FlaskConical },
  { name: 'Microscope', Icon: Microscope },
  { name: 'Zap', Icon: Zap },
  { name: 'Palette', Icon: PaletteIcon },
  { name: 'Music', Icon: Music },
  { name: 'Languages', Icon: Languages },
  { name: 'ChartColumn', Icon: ChartColumn },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'PenLine', Icon: PenLine },
];

/** Resolve um nome de ícone (salvo na matéria) para o componente lucide. */
export function iconByName(name: string | null | undefined): LucideIcon | null {
  if (!name) return null;
  return ICONS.find((entry) => entry.name === name)?.Icon ?? null;
}

/** Elemento pronto do ícone, com a cor já resolvida pelo chamador (evita hex literal). */
export function renderIcon(
  name: string | null | undefined,
  size = 20,
  color?: string,
): ReactNode {
  const entry = ICONS.find((candidate) => candidate.name === name);
  if (entry === undefined) return null;
  return <entry.Icon size={size} color={color} />;
}

export interface IconPickerProps {
  selected?: string;
  onChange: (icon: string) => void;
  label?: string;
}

/**
 * Grade de ícones de matéria (ADR-0009): 6 colunas × 12 ícones, **inline** no formulário
 * (o campo de texto que mostrava "Globe" foi removido). Selecionado = fundo em destaque
 * e ícone na cor de destaque.
 */
export function IconPicker({ selected, onChange, label = 'Ícone' }: IconPickerProps) {
  const hasSelection = selected !== undefined && selected !== '';

  return (
    <View style={{ gap: 8 }}>
      <Text className="text-legend text-text-tertiary">{label}</Text>

      <View className="flex-row flex-wrap" style={{ marginHorizontal: -3 }}>
        {ICONS.map(({ name, Icon }) => {
          const isSelected = selected === name;
          return (
            <View key={name} style={{ width: '16.666%', padding: 3 }}>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel={name}
                accessibilityState={{ selected: isSelected }}
                onPress={() => onChange(name)}
                pressedScale={0.9}
                style={{ minWidth: 44, minHeight: 44 }}
                className={
                  isSelected
                    ? 'items-center justify-center rounded-field bg-accent-soft'
                    : 'items-center justify-center rounded-field bg-surface-raised'
                }
                contentClassName="w-full items-center justify-center py-2">
                <Icon
                  size={22}
                  color={isSelected ? Tokens.accent : Tokens.textSecondary}
                  strokeWidth={1.8}
                />
              </Touchable>
            </View>
          );
        })}

        {/* "Nenhum" ocupa a 13ª célula da grade, no mesmo passo das outras. */}
        <View style={{ width: '16.666%', padding: 3 }}>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Sem ícone"
            accessibilityState={{ selected: !hasSelection }}
            onPress={() => onChange('')}
            pressedScale={0.9}
            style={{ minWidth: 44, minHeight: 44 }}
            className={
              !hasSelection
                ? 'items-center justify-center rounded-field bg-accent-soft'
                : 'items-center justify-center rounded-field bg-surface-raised'
            }
            contentClassName="w-full items-center justify-center py-2">
            <Text
              className={
                !hasSelection ? 'text-legend text-accent' : 'text-legend text-text-tertiary'
              }>
              —
            </Text>
          </Touchable>
        </View>
      </View>
    </View>
  );
}