import { StyleSheet, Text, View } from 'react-native';

import { monogram } from '@/domain/monogram';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface MonogramProps {
  name: string;
  size?: 'sm' | 'md';
}

export function Monogram({ name, size = 'md' }: MonogramProps) {
  const colors = useTheme();
  const dimension = size === 'sm' ? 32 : 40;

  return (
    <View
      style={[
        styles.box,
        { width: dimension, height: dimension, borderColor: colors.borderStrong },
      ]}>
      <Text
        style={[
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: colors.text },
          styles.text,
        ]}>
        {monogram(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: Radius.monogram,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.half,
  },
  text: {
    textAlign: 'center',
  },
  textMd: {
    ...Typography.bodyStrong,
  },
  textSm: {
    ...Typography.meta,
  },
});
