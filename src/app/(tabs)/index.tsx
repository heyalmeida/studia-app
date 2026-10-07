import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTheme } from '@/hooks/use-theme';

export default function PainelScreen() {
  const colors = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Painel" />
      <EmptyState
        title="Bem-vindo ao Studia"
        text="Cadastre sua primeira matéria para começar."
        actionLabel="Nova matéria"
        onAction={() => router.push('/subject-form')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
