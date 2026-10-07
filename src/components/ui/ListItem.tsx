import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { Spacing } from '@/constants/theme';

export interface ListItemProps {
  children: ReactNode;
  onPress?: () => void;
}

export function ListItem({ children, onPress }: ListItemProps) {
  const content = onPress ? (
    <Pressable onPress={onPress} style={styles.row}>
      {children}
    </Pressable>
  ) : (
    <View style={styles.row}>{children}</View>
  );

  return (
    <View>
      {content}
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.three,
  },
});
