import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

/** Separador hairline (ADR-0009): 1px na cor de borda, sem sombra. */
export function Divider() {
  // altura hairline exige StyleSheet (Tailwind não tem utilitário hairline cross-platform)
  return <View style={styles.hairline} />;
}

const styles = StyleSheet.create({
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});