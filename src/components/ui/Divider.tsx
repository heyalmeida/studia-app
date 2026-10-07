import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function Divider() {
  const colors = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
