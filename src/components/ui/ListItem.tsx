import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Divider } from '@/components/ui/Divider';

export interface ListItemProps {
  children: ReactNode;
  onPress?: () => void;
}

export function ListItem({ children, onPress }: ListItemProps) {
  const content = onPress ? (
    <Pressable onPress={onPress} className="py-three">
      {children}
    </Pressable>
  ) : (
    <View className="py-three">{children}</View>
  );

  return (
    <View>
      {content}
      <Divider />
    </View>
  );
}
