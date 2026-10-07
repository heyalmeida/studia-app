import { StyleSheet, View } from 'react-native';

export function Divider() {
  // altura hairline exige StyleSheet (Tailwind não tem utilitário hairline cross-platform)
  return <View className="bg-border" style={styles.hairline} />;
}

const styles = StyleSheet.create({
  hairline: {
    height: StyleSheet.hairlineWidth,
  },
});
