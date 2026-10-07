import { View } from 'react-native';

export interface ProgressBarProps {
  ratio: number; // 0..1 — clamp aplicado aqui, nunca fora
  width?: number;
}

export function ProgressBar({ ratio, width }: ProgressBarProps) {
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;

  return (
    <View
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-selected"
      style={width !== undefined ? { width } : undefined}>
      <View
        className="h-full bg-inverse"
        style={{ width: `${clamped * 100}%` }}
      />
    </View>
  );
}
