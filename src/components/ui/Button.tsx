import { Pressable, StyleSheet, Text } from 'react-native';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

const CONTAINER: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-inverse active:bg-surface-selected',
  secondary: 'bg-surface active:bg-surface-selected',
  ghost: 'bg-transparent active:bg-surface-selected',
};

const LABEL: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-on-inverse active:text-text',
  secondary: 'text-text',
  ghost: 'text-text-secondary',
};

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={[styles.base, disabled && styles.disabled]}
      className={CONTAINER[variant]}>
      <Text style={styles.label} className={LABEL[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}

// altura/radius/fonte fixos; cores e pressed via className (NativeWind)
const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
