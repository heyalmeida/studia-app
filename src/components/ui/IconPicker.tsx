import { Modal, Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import type { ReactNode } from 'react';
// Deep imports (icons/<nome>) evitam o barrel gigante do lucide-react-native,
// que derrubava o bundler do Metro com re-exports em cadeia.
import BookOpen from 'lucide-react-native/icons/book-open';
import Book from 'lucide-react-native/icons/book';
import GraduationCap from 'lucide-react-native/icons/graduation-cap';
import Calculator from 'lucide-react-native/icons/calculator';
import FlaskConical from 'lucide-react-native/icons/flask-conical';
import Microscope from 'lucide-react-native/icons/microscope';
import Zap from 'lucide-react-native/icons/zap';
import Palette from 'lucide-react-native/icons/palette';
import Music from 'lucide-react-native/icons/music';
import Languages from 'lucide-react-native/icons/languages';
import ChartColumn from 'lucide-react-native/icons/chart-column';
import Calendar from 'lucide-react-native/icons/calendar';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import PenLine from 'lucide-react-native/icons/pen-line';
import Plane from 'lucide-react-native/icons/plane';
import Globe from 'lucide-react-native/icons/globe';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

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
  { name: 'ChartColumn', Icon: ChartColumn },
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

/** Elemento pronto do ícone, com a cor de token resolvida (evita hex literal). */
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
}

/**
 * Preview monocromático (ADR-0006): quadrado com o ícone atual à esquerda e, à
 * direita, um botão que abre o dropdown (modal nativo) com a grade de 16 ícones.
 */
export function IconPicker({ selected, onChange }: IconPickerProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const hasSelection = selected !== undefined && selected !== '';

  return (
    <View className="gap-two">
      <Text className="text-section font-semibold uppercase tracking-section text-text-secondary">
        Ícone
      </Text>
      <View className="flex-row items-center gap-three">
        <View
          className="items-center justify-center rounded-monogram border border-border-strong bg-surface"
          style={{ width: 56, height: 56 }}>
          {hasSelection ? (
            renderIcon(selected, 28, theme.text)
          ) : (
            <Text className="text-meta text-text-tertiary">—</Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          className="flex-1 rounded-field border border-border bg-surface px-three py-two">
          <Text className="text-body text-text">
            {hasSelection ? selected : 'Escolher ícone...'}
          </Text>
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setOpen(false)}>
          <Pressable
            className="mx-four rounded-card border border-border bg-background p-three"
            onPress={() => undefined}>
            <Text className="pb-two text-section font-semibold uppercase tracking-section text-text-secondary">
              Escolha um ícone
            </Text>
            <View className="flex-row flex-wrap gap-two">
              {ICONS.map(({ name, Icon }) => {
                const isSelected = selected === name;
                return (
                  <Pressable
                    key={name}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={
                      isSelected
                        ? 'items-center justify-center rounded-chip border-[1.5px] border-border-strong bg-surface p-three'
                        : 'items-center justify-center rounded-chip border border-border bg-backgroundElement p-three'
                    }
                    style={{ width: '22%' }}>
                    <Icon size={20} color={theme.text} />
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onChange('');
                setOpen(false);
              }}
              className="mt-two items-center rounded-field border border-border px-three py-two">
              <Text className="text-body text-text-secondary">Remover ícone</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
