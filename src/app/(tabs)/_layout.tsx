import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Touchable } from '@/components/ui/Touchable';
import { Palette, Spacing } from '@/constants/theme';

// Ionicons não é componente-core do RN: registra className -> style (color do glifo).
cssInterop(Ionicons, { className: 'style' });

interface TabRoute {
  key: string;
  name: string;
}

interface TabBarProps {
  state: { routes: TabRoute[]; index: number };
  navigation: { navigate: (name: string) => void };
  descriptors: Record<string, { options: { title?: string } }>;
}

type IoniconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  subjects: { active: 'book', inactive: 'book-outline' },
  activities: { active: 'checkmark-circle', inactive: 'checkmark-circle-outline' },
  assessments: { active: 'calendar', inactive: 'calendar-outline' },
};

/**
 * Barra de abas flutuante (ADR-0009): fundo `surface`, hairline de 1px, item **ativo** na
 * cor de destaque (ícone + label) e inativos em `text-tertiary`. O container externo fica
 * em fluxo normal, então o conteúdo das telas nunca passa por baixo da barra; o
 * paddingBottom usa a safe-area inferior (barra de gestos do Android).
 */
function FloatingTabBar({ state, navigation, descriptors }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background px-5"
      style={{ paddingTop: Spacing.two, paddingBottom: Math.max(insets.bottom, Spacing.two) }}>
      <View className="flex-row items-stretch justify-around rounded-card border border-border bg-surface px-1 py-1">
        {state.routes.map((route) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;
          const focused = state.routes[state.index]?.key === route.key;
          const title = descriptors[route.key]?.options.title ?? '';

          return (
            <Touchable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={title}
              onPress={() => navigation.navigate(route.name)}
              pressedScale={0.94}
              pressedOpacity={0.7}
              style={{ flex: 1 }}
              className="min-h-[48px] items-center justify-center gap-1 rounded-chip px-1 py-1">
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={20}
                className={focused ? 'text-accent' : 'text-text-tertiary'}
              />
              <Text
                className="text-legend"
                style={{ color: focused ? Palette.accent : Palette.textTertiary }}
                numberOfLines={1}>
                {title}
              </Text>
            </Touchable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Painel' }} />
      <Tabs.Screen name="subjects" options={{ title: 'Matérias' }} />
      <Tabs.Screen name="activities" options={{ title: 'Atividades' }} />
      <Tabs.Screen name="assessments" options={{ title: 'Avaliações' }} />
    </Tabs>
  );
}