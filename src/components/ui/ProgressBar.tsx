import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface ProgressBarProps {
  ratio: number; // 0..1 — clamp aplicado aqui, nunca fora
  width?: number;
}

export function ProgressBar({ ratio, width }: ProgressBarProps) {
  const colors = useTheme();
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: colors.backgroundSelected },
        width !== undefined ? { width } : null,
      ]}>
      <View
        style={[
          styles.fill,
          { backgroundColor: colors.surfaceInverse, width: `${clamped * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
