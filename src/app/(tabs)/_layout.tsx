import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Abas com ícone + label (referência: barra inferior minimalista — outline inativa,
 * preenchida ativa). NativeTabs (unstable) não renderiza barra no Expo Go — por isso o
 * Tabs estável do expo-router (react-navigation embutido), que funciona em Expo Go e web.
 * Monocromático: cores vêm dos tokens (ADR-0006); header nativo desligado (cada tela usa
 * ScreenHeader próprio).
 */
export default function TabsLayout() {
  const colors = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { ...Typography.meta },
        tabBarItemStyle: { paddingTop: Spacing.one },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Painel',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Matérias',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Atividades',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'checkbox' : 'checkbox-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="assessments"
        options={{
          title: 'Avaliações',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
