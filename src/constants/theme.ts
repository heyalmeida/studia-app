/**
 * Fonte única dos tokens visuais do Studia (ADR-0009).
 *
 * Identidade escura, minimalista e premium (referências de layout: Linear e Things):
 * fundo quase preto, superfícies em tom e **uma** cor de destaque (índigo), usada só em
 * ação principal, item ativo da tab bar, progresso e foco de input. Estados usam apenas as
 * três cores semânticas (sucesso/alerta/urgente).
 *
 * Os mesmos valores estão em `src/styles/global.css` (CSS variables para o NativeWind) e
 * em `tailwind.config.js`. Valor que precisa ser calculado em runtime (cor da matéria) só
 * pode vir daqui — nunca um hex literal na árvore de componentes (Regra 4.10).
 */

/** Paleta base da interface. */
export const Palette = {
  /** Fundo de tela. */
  background: '#0B0B0F',
  /** Superfície de card, linha e barra de abas. */
  surface: '#15151B',
  /** Superfície elevada: campo de texto, chip selecionado, item ativo. */
  surfaceRaised: '#1C1C24',
  /** Hairline de card e separador. */
  border: '#23232C',
  /** Texto primário. */
  text: '#F5F5F7',
  /** Texto de apoio. */
  textSecondary: '#A1A1AA',
  /** Legendas, placeholder e item inativo da tab bar. */
  textTertiary: '#6B6B76',
  /** Cor de destaque única. */
  accent: '#6366F1',
  /** Realce do destaque (fundo translúcido de seleção/anel). */
  accentSoft: 'rgba(99, 102, 241, 0.16)',
  /** Texto/ícone sobre a cor de destaque. */
  onAccent: '#FFFFFF',
  /** Semântica: sucesso. */
  success: '#34D399',
  /** Semântica: alerta (prazo próximo). */
  warning: '#FBBF24',
  /** Semântica: urgente (atrasado, erro, exclusão). */
  danger: '#F87171',
} as const;

/** Um tom da paleta de matérias: `value` é o traço/ícone, `soft` o fundo tingido. */
export interface SubjectTone {
  name: string;
  value: string;
  soft: string;
}

/** Paleta de 8 tons — a única fonte válida para `Subject.color`. */
export const SUBJECT_COLORS: readonly SubjectTone[] = [
  { name: 'Índigo', value: '#6366F1', soft: 'rgba(99, 102, 241, 0.18)' },
  { name: 'Violeta', value: '#8B5CF6', soft: 'rgba(139, 92, 246, 0.18)' },
  { name: 'Rosa', value: '#EC4899', soft: 'rgba(236, 72, 153, 0.18)' },
  { name: 'Laranja', value: '#F97316', soft: 'rgba(249, 115, 22, 0.18)' },
  { name: 'Âmbar', value: '#EAB308', soft: 'rgba(234, 179, 8, 0.18)' },
  { name: 'Verde', value: '#22C55E', soft: 'rgba(34, 197, 94, 0.18)' },
  { name: 'Ciano', value: '#06B6D4', soft: 'rgba(6, 182, 212, 0.18)' },
  { name: 'Coral', value: '#F43F5E', soft: 'rgba(244, 63, 94, 0.18)' },
] as const;

/** Nomes válidos de tom — usado na validação de domínio (`validateSubject`). */
export const SUBJECT_COLOR_NAMES: readonly string[] = SUBJECT_COLORS.map((tone) => tone.value);

/**
 * Resolve o tom de uma matéria. `null`/vazio/valor desconhecido (JSON do storage não é
 * confiável — RNF-04) devolve `null`: a UI cai no neutro, nunca em um hex arbitrário.
 */
export function subjectTone(color: string | null | undefined): SubjectTone | null {
  if (!color) return null;
  return SUBJECT_COLORS.find((tone) => tone.value === color) ?? null;
}

/** Ritmo: escala de 4 (4, 8, 12, 16, 24, 32). */
export const Spacing = { one: 4, two: 8, three: 12, four: 16, five: 24, six: 32 } as const;

/** Raio: card 16, campo/botão 12, chip 8. */
export const Radius = { chip: 8, field: 12, button: 12, card: 16 } as const;

/**
 * Escala tipográfica — no máximo 3 pesos (400, 600, 700).
 * `legend` é a micro-legenda de 12px com tracking leve (rótulos, metas).
 */
export const Typography = {
  title: { fontSize: 28, fontWeight: '700' },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  legend: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4 },
} as const;

/** Padding lateral de tela. */
export const SCREEN_PADDING = 20;
/** Alvo de toque mínimo (iOS HIG / Material). */
export const TOUCH_TARGET = 44;
/** Altura mínima de campo de formulário. */
export const FIELD_HEIGHT = 52;
/** Diâmetro do botão flutuante. */
export const FAB_SIZE = 56;
/**
 * Respiro do fim do conteúdo: garante que a tab bar flutuante e o FAB não cubram a última
 * linha de uma lista.
 */
export const LIST_BOTTOM_INSET = 96;