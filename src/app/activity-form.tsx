import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ActivityFormScreen() {
  const colors = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Nova atividade" />
      <View style={styles.body}>
        <View style={styles.actions}>
          <Button label="Voltar" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  actions: {
    alignItems: 'flex-start',
  },
});
