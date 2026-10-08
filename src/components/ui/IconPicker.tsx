import { Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import {
  BarChart3,
  Book,
  BookOpen,
  Calculator,
  Calendar,
  Dumbbell,
  FlaskConical,
  Globe,
  GraduationCap,
  Languages,
  Microscope,
  Music,
  Palette,
  PenLine,
  Plane,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** 16 ícones de estudo; a chave (nome) é o que vai para `Subject.icon`. */
const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Book', Icon: Book },
  { name: 'GraduationCap', Icon: GraduationCap },
  { name: 'Calculator', Icon: Calculator },
  { name: 'FlaskConical', Icon: FlaskConical },
  { name: 'Microscope', Icon: Microscope },
  { name: 'Zap', Icon: Zap },
  { name: 'Palette', Icon: Palette },
  { name: 'Music', Icon: Music },
  { name: 'Languages', Icon: Languages },
  { name: 'BarChart3', Icon: BarChart3 },
  { name: 'Calendar', Icon: Calendar },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'PenLine', Icon: PenLine },
  { name: 'Plane', Icon: Plane },
  { name: 'Globe', Icon: Globe },
];

/** Resolve um nome de ícone (salvo na matéria) para o componente lucide. */
export function iconByName(name: string | null | undefined): LucideIcon | null {
  if (!name) return null;
  return ICONS.find((entry) => entry.name === name)?.Icon ?? null;
}

/** Elemento pronto do ícone (evita criar variável de componente durante o render). */
export function renderIcon(name: string | null | undefined, size = 20): ReactNode {
  const entry = ICONS.find((candidate) => candidate.name === name);
  if (entry === undefined) return null;
  return <entry.Icon size={size} />;
}

export interface IconPickerProps {
  selected?: string;
  onChange: (icon: string) => void;
}

/**
 * Grid 4×4 monocromático de ícones (ADR-0006). ''/null = nenhum selecionado;
 * tocar no já selecionado limpa a seleção.
 */
export function IconPicker({ selected, onChange }: IconPickerProps) {
  return (
    <View className="gap-two">
      <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
        Ícone
      </Text>
      <View className="flex-row flex-wrap gap-two">
        {ICONS.map(({ name, Icon }) => {
          const isSelected = selected === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(isSelected ? '' : name)}
              className={
                isSelected
                  ? 'items-center justify-center rounded-chip border-[1.5px] border-border-strong bg-surface p-three'
                  : 'items-center justify-center rounded-chip border border-border bg-backgroundElement p-three'
              }
              style={{ width: '22%' }}>
              <View className="text-text">
                <Icon size={20} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
