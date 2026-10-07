import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

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
  activities: { active: 'checkbox', inactive: 'checkbox-outline' },
  assessments: { active: 'calendar', inactive: 'calendar-outline' },
};

/**
 * Barra flutuante (referência: estilo 3 — ativa = ícone preenchido + label; inativas = outline).
 * O container externo em fluxo normal garante que o conteúdo das telas nunca fica sob a barra,
 * e o paddingBottom usa a safe-area inferior — resolve a sobreposição com a barra de gestos
 * do Android. Monocromático: pills com superfície tonal + hairline (ADR-0006).
 */
function FloatingTabBar({ state, navigation, descriptors }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background px-four"
      style={{ paddingTop: Spacing.two, paddingBottom: Math.max(insets.bottom, Spacing.two) }}>
      <View className="flex-row items-stretch justify-around rounded-card border border-border bg-surface px-two py-two">
        {state.routes.map((route) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;
          const focused = state.routes[state.index]?.key === route.key;
          const title = descriptors[route.key]?.options.title ?? '';

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={title}
              onPress={() => navigation.navigate(route.name)}
              className="flex-1 items-center justify-center py-one active:bg-surface-selected rounded-chip">
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={22}
                className={focused ? 'text-text' : 'text-text-tertiary'}
              />
              {focused ? (
                <Text className="mt-half text-[11px] font-semibold text-text" numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
            </Pressable>
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
