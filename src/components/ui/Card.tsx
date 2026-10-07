import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, style }: CardProps) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} className="rounded-card bg-surface p-three" style={style}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className="rounded-card bg-surface p-three" style={style}>
      {children}
    </View>
  );
}
