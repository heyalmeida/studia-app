import '../styles/global.css';

import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Palette } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

// Tema único escuro (ADR-0009): `userInterfaceStyle: "dark"` no app.json + tokens de
// `Palette`. O DarkTheme do React Navigation só é usado como base estrutural; as cores
// que o app pinça (background/card/text/border/primary) vêm da identidade do Studia.
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.background,
    card: Palette.surface,
    text: Palette.text,
    border: Palette.border,
    primary: Palette.accent,
    notification: Palette.accent,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.background } }}>
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