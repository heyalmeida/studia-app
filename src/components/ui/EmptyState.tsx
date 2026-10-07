import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface EmptyStateProps {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, text, actionLabel, onAction }: EmptyStateProps) {
  const colors = useTheme();
  const showAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {text.length > 0 ? (
        <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
      ) : null}
      {showAction ? (
        <Button variant="secondary" label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  title: {
    ...Typography.bodyStrong,
    textAlign: 'center',
  },
  text: {
    ...Typography.meta,
    textAlign: 'center',
  },
});
