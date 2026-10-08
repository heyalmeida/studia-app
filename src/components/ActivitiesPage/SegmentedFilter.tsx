import { Pressable, Text, View } from 'react-native';

export type ActivityFilter = 'pendentes' | 'todas' | 'concluidas';

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'todas', label: 'Todas' },
  { key: 'concluidas', label: 'Concluídas' },
];

export interface SegmentedFilterProps {
  value: ActivityFilter;
  onChange: (next: ActivityFilter) => void;
}

/** Filtro de situação da lista de atividades (T3). Específico desta tela. */
export function SegmentedFilter({ value, onChange }: SegmentedFilterProps) {
  return (
    <View className="flex-row gap-two">
      {FILTERS.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={
              selected
                ? 'flex-1 items-center justify-center rounded-chip border-[1.5px] border-white/40 bg-background px-two py-two'
                : 'flex-1 items-center justify-center rounded-chip border border-transparent bg-surface px-two py-two'
            }>
            <Text className={selected ? 'text-meta text-text' : 'text-meta text-text-secondary'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
