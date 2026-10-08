import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import { Palette as Tokens, Radius, TOUCH_TARGET, Typography } from '@/constants/theme';

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
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.grid}>
        {ICONS.map(({ name, Icon }) => {
          const isSelected = selected === name;
          return (
            <View key={name} style={styles.cell}>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel={name}
                accessibilityState={{ selected: isSelected }}
                onPress={() => onChange(name)}
                pressedOpacity={0.7}
                pressedScale={0.97}
                style={[styles.tile, isSelected ? styles.tileSelected : styles.tileUnselected]}
                contentStyle={[centeredContent, styles.tileContent]}>
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
        <View style={styles.cell}>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Sem ícone"
            accessibilityState={{ selected: !hasSelection }}
            onPress={() => onChange('')}
            pressedOpacity={0.7}
            pressedScale={0.97}
            style={[styles.tile, hasSelection ? styles.tileUnselected : styles.tileSelected]}
            contentStyle={[centeredContent, styles.tileContent]}>
            <Text style={[styles.noneLabel, hasSelection ? styles.labelDim : styles.labelOn]}>—</Text>
          </Touchable>
        </View>
      </View>
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
    color: Tokens.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  cell: {
    width: '16.666%',
    padding: 3,
  },
  tile: {
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
    borderRadius: Radius.field,
  },
  tileContent: {
    paddingVertical: 8,
  },
  tileSelected: {
    backgroundColor: Tokens.accentSoft,
  },
  tileUnselected: {
    backgroundColor: Tokens.surfaceRaised,
  },
  noneLabel: {
    ...Typography.legend,
  },
  labelOn: {
    color: Tokens.accent,
  },
  labelDim: {
    color: Tokens.textTertiary,
  },
});