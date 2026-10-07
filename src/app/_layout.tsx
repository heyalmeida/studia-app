import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // RN 0.86 tipa useColorScheme() como 'light' | 'dark' | 'unspecified' (nulo não existe);
  // 'unspecified' cai no claro, igual ao resto do scaffold (useTheme / app-tabs).
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, background: Colors[scheme].background },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subject-form" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen
          name="activity-form"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="assessment-form"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
