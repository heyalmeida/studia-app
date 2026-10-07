import { StyleSheet, Text, View } from 'react-native';

export interface BadgeProps {
  label: string;
  tone?: 'outline' | 'inverse';
}

export function Badge({ label, tone = 'outline' }: BadgeProps) {
  const inverse = tone === 'inverse';

  return (
    <View
      className={
        inverse
          ? 'self-start rounded-chip bg-inverse px-two py-one'
          : 'self-start rounded-chip border border-border-strong px-two py-one'
      }>
      <Text
        style={styles.label}
        className={inverse ? 'text-section text-on-inverse' : 'text-section text-text'}>
        {label}
      </Text>
    </View>
  );
}

// letterSpacing 0: a classe text-section traz 1.2px; o rótulo do badge já vem pronto (sem uppercase)
const styles = StyleSheet.create({
  label: {
    letterSpacing: 0,
  },
});
