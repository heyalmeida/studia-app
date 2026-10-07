import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, text, actionLabel, onAction }: EmptyStateProps) {
  const showAction = actionLabel !== undefined && onAction !== undefined;

  return (
    <View className="flex-1 items-center justify-center gap-three px-four">
      <Text className="text-center text-body font-semibold text-text">{title}</Text>
      {text.length > 0 ? (
        <Text className="text-center text-meta text-text-secondary">{text}</Text>
      ) : null}
      {showAction ? (
        <Button variant="secondary" label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
