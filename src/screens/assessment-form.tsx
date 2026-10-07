import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function AssessmentFormScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Nova avaliação" />
      <View className="items-start px-four pt-three">
        <Button label="Voltar" variant="secondary" onPress={() => router.back()} />
      </View>
    </View>
  );
}
