import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#60646C',
    textTertiary: '#8A8F98',
    background: '#FFFFFF',
    backgroundElement: '#F4F4F6',
    backgroundSelected: '#E7E7EB',
    border: '#E0E0E5',
    borderStrong: '#000000',
    surfaceInverse: '#000000',
    textOnInverse: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B4BA',
    textTertiary: '#7D828B',
    background: '#000000',
    backgroundElement: '#1C1D21',
    backgroundSelected: '#2A2C31',
    border: '#2A2A2E',
    borderStrong: '#FFFFFF',
    surfaceInverse: '#FFFFFF',
    textOnInverse: '#000000',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)' },
});
export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const Radius = { chip: 6, field: 10, button: 12, card: 14, monogram: 10 } as const;
export const Typography = {
  title: { fontSize: 28, fontWeight: '700' },
  section: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2 }, // usar com textTransform uppercase
  body: { fontSize: 16, fontWeight: '400' },
  bodyStrong: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 13, fontWeight: '400' },
  button: { fontSize: 16, fontWeight: '600' },
  metric: { fontSize: 34, fontWeight: '700' },
  metricLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2 },
} as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
