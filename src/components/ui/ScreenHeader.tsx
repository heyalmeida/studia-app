import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';

export interface ScreenHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function ScreenHeader({ title, action }: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']} className="w-full bg-background">
      <View className="flex-row items-center justify-between gap-two px-four pt-two pb-three">
        <Text className="flex-shrink text-title font-bold text-text" numberOfLines={1}>
          {title}
        </Text>
        {action ? <Button variant="ghost" label={action.label} onPress={action.onPress} /> : null}
      </View>
    </SafeAreaView>
  );
}
