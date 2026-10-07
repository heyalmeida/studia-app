import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface BadgeProps {
  label: string;
  tone?: 'outline' | 'inverse';
}

export function Badge({ label, tone = 'outline' }: BadgeProps) {
  const colors = useTheme();
  const inverse = tone === 'inverse';

  return (
    <View
      style={[
        styles.badge,
        inverse
          ? { backgroundColor: colors.surfaceInverse }
          : { backgroundColor: 'transparent', borderColor: colors.borderStrong, borderWidth: 1 },
      ]}>
      <Text
        style={[styles.label, { color: inverse ? colors.textOnInverse : colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.chip,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  label: {
    ...Typography.section,
    letterSpacing: 0, // seção sem letterSpacing e sem uppercase (rótulo já vem pronto)
  },
});
