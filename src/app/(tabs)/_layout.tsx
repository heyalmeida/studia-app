import { router, Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Plus from 'lucide-react-native/icons/plus';

import { centeredContent, Touchable } from '@/components/ui/Touchable';
import {
  FAB_SIZE,
  Palette,
  Radius,
  SCREEN_PADDING,
  Spacing,
  Typography,
} from '@/constants/theme';

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
 * Botão central de criação (pedido do dono, 2026-10-09 — substitui o FAB flutuante):
 * o destino depende da aba ativa. No Painel cria matéria, que é o ponto de entrada do app
 * (sem matéria não há atividade nem avaliação).
 */
const CREATE_BY_TAB = {
  index: { path: '/subject-form', label: 'Nova matéria' },
  subjects: { path: '/subject-form', label: 'Nova matéria' },
  activities: { path: '/activity-form', label: 'Nova atividade' },
  assessments: { path: '/assessment-form', label: 'Nova avaliação' },
} as const;

/**
 * Barra de abas flutuante (ADR-0009): fundo `surface`, hairline de 1px, item **ativo** na
 * cor de destaque (ícone + label) e inativos em `text-tertiary`.
 *
 * Anatomia (2026-10-09): `Painel | Matérias | [criar] | Atividades | Avaliações` — o botão de
 * criação (círculo de 56 no destaque, sombra mantida por ADR-0010 §3) mora no centro da barra,
 * não mais flutuando sobre a lista. A altura da barra é `4 (paddingTop) + 56 (botão central,
 * o mais alto) + 4 (paddingBottom) + 2 (borda) = 66` — mantenha `TAB_BAR_HEIGHT` em
 * `src/constants/theme.ts` em sincronia com os estilos abaixo.
 *
 * **Importante:** a tela do React Navigation é `absoluteFill` dentro do `Tabs`, então ela passa
 * **por baixo** desta barra. As listas reservam `contentBottomInset(insets.bottom)` — o
 * conteúdo nunca fica escondido.
 *
 * Estilo em `StyleSheet` com valores numéricos explícitos — no Expo Go o `className` do
 * NativeWind não se aplica.
 */
function FloatingTabBar({ state, navigation, descriptors }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name ?? 'index';
  const create =
    CREATE_BY_TAB[activeName as keyof typeof CREATE_BY_TAB] ?? CREATE_BY_TAB.index;

  function renderTab(route: TabRoute) {
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
        pressedOpacity={0.7}
        pressedScale={0.94}
        style={styles.item}
        contentStyle={[centeredContent, styles.itemContent]}>
        <Ionicons
          name={focused ? icons.active : icons.inactive}
          size={20}
          color={focused ? Palette.accent : Palette.textTertiary}
        />
        <Text
          style={[styles.label, { color: focused ? Palette.accent : Palette.textTertiary }]}
          numberOfLines={1}>
          {title}
        </Text>
      </Touchable>
    );
  }

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
      <View style={styles.bar}>
        {state.routes.slice(0, 2).map(renderTab)}

        <View style={styles.createSlot}>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel={create.label}
            onPress={() => router.push(create.path)}
            pressedOpacity={0.7}
            pressedScale={0.94}
            style={styles.createButton}
            contentStyle={centeredContent}>
            <Plus size={24} color={Palette.onAccent} strokeWidth={2.5} />
          </Touchable>
        </View>

        {state.routes.slice(2).map(renderTab)}
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

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingTop: Spacing.two,
    paddingHorizontal: SCREEN_PADDING,
    backgroundColor: Palette.background,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  item: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radius.chip,
  },
  itemContent: {
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  label: {
    ...Typography.legend,
  },
  createSlot: {
    width: FAB_SIZE + Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Palette.accent,
    // elevation 6 no Android; os demais campos cobrem iOS/web. Exceção única à regra
    // "sem sombras" — o botão de criação (ADR-0010 §3, agora central na barra).
    elevation: 6,
    shadowColor: Palette.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});
