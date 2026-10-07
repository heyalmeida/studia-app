# Prompts de Implementação — Studia (executor: modelo pequeno)

| Campo | Valor |
|---|---|
| **Uso** | Um prompt por vez, na ordem P0 → P6, em sessões separadas do agente executor |
| **Modelo-alvo** | mimo-2.6-flash / apodex-1.1-mini — prompts autocontidos de propósito: contrato exato, sem decisões para o executor |
| **Branch** | `development` |
| **Paralelo** | specs de execução: `docs/specs/2026-10-07-slice-*/spec.md` (o QUÊ); este arquivo é o COMO executável |

## Como usar

1. Cole o prompt inteiro na sessão do executor. Nada além é necessário — o prompt embute todos os
   contratos; o executor **não** precisa consultar a conversa de planejamento.
2. O executor deve rodar os gates ao final (`npx tsc --noEmit`, `npx expo lint`) e reportar a saída.
3. Entre prompts, o planejador (ZCode) revisa o diff do slice. Se algo divergir deste contrato, **este
   arquivo e a spec são corrigidos primeiro**, e o slice é re-executado — nunca o contrário.
4. **Mobbin:** o MCP `Mobbin` está configurado mas indisponível nas minhas sessões atuais. O design já
   está totalmente especificado (tokens em `docs/design/visual-identity.md` + embutidos no P1). Para usar
   o Mobbin ative-o na sessão (Configurações → MCP) e rode o **PR (opcional, eu executo)** — ele alimenta
   `docs/design/references.md` e refinamentos de layout, nunca de cor.

## Regras transversais (repetidas em cada prompt por segurança — o executor vê só o prompt)

- Stack: Expo SDK 57, Expo Router, TypeScript strict. **Proibido** adicionar dependências fora das listadas.
- Proibido criar telas/componentes/funcionalidades não listadas no prompt. Se sentir falta de algo,
  **parar e reportar**, não improvisar.
- UI: somente monocromático via tokens (`src/constants/theme.ts`). Zero `#hex` fora do tema, zero
  `shadow*`, zero cor saturada, zero emoji na UI, texto da UI em português-BR.
- Imports com alias `@/` (`@/* → ./src/*`).
- Rotas **só** em `src/app/`; componentes/hooks/domínio/dados fora dele.
- Ao final: commit com a mensagem indicada; `git add` só dos arquivos listados.

---

## P0 — Fundação: domínio + dados (sem UI)

```text
Você vai implementar o Slice 0 do Studia, um app de organização de estudos em Expo SDK 57 +
TypeScript (strict), no repositório atual (branch development). É o alicerce: apenas arquivos de
domínio puro e de dados — nenhuma UI, nenhuma rota, nenhum hook React.

LEIA ANTES DE CODAR (nesta ordem, são os contratos):
1. docs/architecture/domain-model.md — tipos e campos exatos das entidades.
2. docs/architecture/architecture.md — estrutura de camadas (domínio sem React/storage; data implementa interfaces).
3. docs/adr/ADR-0002-estrategia-de-persistencia.md e docs/adr/ADR-0004-organizacao-arquitetural.md.
4. Este prompt (os contratos abaixo são vinculares — copie as assinaturas literalmente).

INSTALE A DEPENDÊNCIA (use exatamente este comando):
npx expo install @react-native-async-storage/async-storage

CRIE OS SEGUINTES ARQUIVOS (nenhum outro arquivo deve ser criado ou editado):

--- 1. src/domain/models.ts ---
Copie exatamente esta forma (os campos batem com domain-model.md; NÃO existe campo `color` nem `grade`):

export type ActivityType = 'tarefa' | 'trabalho' | 'leitura' | 'estudo';
export type ActivityStatus = 'pendente' | 'concluida';
export type AssessmentStatus = 'agendada' | 'realizada';

export interface Subject {
  id: string;
  name: string;
  teacher: string | null;
  createdAt: string; // ISO 8601 completo
}

export interface Activity {
  id: string;
  subjectId: string;
  title: string;
  type: ActivityType;
  description: string | null;
  dueDate: string | null; // 'YYYY-MM-DD' (somente data)
  status: ActivityStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface Assessment {
  id: string;
  subjectId: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  status: AssessmentStatus;
  createdAt: string;
}

export const ACTIVITY_TYPES: ActivityType[] = ['tarefa', 'trabalho', 'leitura', 'estudo'];

--- 2. src/domain/id.ts ---
export function genId(): string;
// corpo: Date.now().toString(36) + Math.random().toString(36).slice(2, 10). Sem dependência nova.

--- 3. src/domain/date.ts ---
Funções puras de data local, sem timezone traps (tudo 'YYYY-MM-DD', comparado como datas locais):

export function parseDDMMYYYY(value: string): string | null;
// '07/10/2026' -> '2026-10-07'. Aceita 1/2 dígitos em dia/mês. Retorna null se dia/mês/ano
// inválidos (mês>12, dia>dias do mês, ano<4 dígitos). Valide o dia contra o mês/ano reais.

export function formatDDMMYYYY(iso: string): string; // '2026-10-07' -> '07/10/2026'

export function todayISO(): string; // 'YYYY-MM-DD' de hoje (local)

export function daysUntil(iso: string, today?: string): number;
// diferença em dias (positivo = futuro). Compare via Date local (new Date(y, m-1, d)).

export function relativeLabelBR(iso: string, today?: string): string;
// hoje -> 'hoje'; 1 -> 'amanhã'; 2..30 -> `em ${n} dias`;
// 31..364 -> 'em ' + (meses: 'em 1 mês'/'em 2 meses'...) aproximado; >364 -> 'em ' + formatDDMMYYYY(iso);
// -1 -> 'ontem'; <-1 -> `atrasada ${n} dias` (n = |diff|).

export function isPast(iso: string, today?: string): boolean;

--- 4. src/domain/monogram.ts ---
export function monogram(name: string): string;
// Divide o nome por espaços; descarta stopwords minúsculas:
// de, da, do, das, dos, e, à, a, o, as, os, em, para, com, na, no, ao, aos, um, uma, por, sobre
// Pega a primeira letra maiúscula das 2 primeiras palavras significativas (se 1 palavra, só a 1ª letra).
// Exemplos (use como testes de mesa): 'Cálculo I'->'CI'; 'Algoritmos e Estruturas'->'AE';
// 'Introdução à Banco de Dados'->'IB'; 'Física'->'F'; '' -> '' (nome vazio não deve quebrar).

--- 5. src/domain/progress.ts ---
export interface SubjectProgress { subjectId: string; total: number; done: number; ratio: number; }
export function subjectProgress(subjectId: string, activities: Activity[]): SubjectProgress;
export function progressSummary(activities: Activity[]): { total: number; done: number; ratio: number };
// ratio = total===0 ? 0 : done/total (0..1). NUNCA NaN.

--- 6. src/domain/validation.ts ---
Toda validação vive AQUI (a UI só exibe). Retorne objetos de erro por campo; vazio = válido.

export interface SubjectFormInput { name: string; teacher: string; }
export interface FieldErrors { [field: string]: string }
export interface ActivityFormInput { title: string; subjectId: string; dueDate: string; } // dueDate em DD/MM/AAAA, '' se ausente
export interface AssessmentFormInput { title: string; subjectId: string; date: string; }

export function validateSubject(input: SubjectFormInput, existingNames: string[]): FieldErrors;
// nome: trim; vazio -> {name: 'Informe o nome da matéria.'}; <2 chars -> {name: 'O nome precisa ter pelo menos 2 caracteres.'};
// duplicado vs existingNames (case-insensitive, trim) -> {name: 'Já existe uma matéria com esse nome.'}
// existingNames: quem chama passa os nomes SEM o da matéria em edição.

export function validateActivity(input: ActivityFormInput, hasSubjects: boolean): FieldErrors & { dueDateWarning?: string };
// title vazio -> {title: 'Informe um título.'}
// !hasSubjects -> {subjectId: 'Cadastre uma matéria antes de criar atividades.'}
// hasSubjects e subjectId vazio -> {subjectId: 'Selecione uma matéria.'}
// dueDate não-vazio e parseDDMMYYYY null -> {dueDate: 'Data inválida. Use o formato DD/MM/AAAA.'}
// dueDate válido e isPast -> SEM erro, mas dueDateWarning: 'Esta data está no passado.' (aviso não bloqueia)

export function validateAssessment(input: AssessmentFormInput, hasSubjects: boolean): FieldErrors & { dateWarning?: string };
// title vazio -> {title: 'Informe o título da avaliação.'}
// subjectId (mesmas regras acima)
// date: vazio -> {date: 'Informe a data. Use o formato DD/MM/AAAA.'}; inválida -> {date: 'Data inválida. Use o formato DD/MM/AAAA.'}
// válida e passada -> dateWarning: 'Esta data está no passado.'

--- 7. src/domain/sorting.ts ---
export function sortActivities(activities: Activity[]): Activity[];
// ordem: pendentes com dueDate (asc por data, empate por createdAt asc) -> pendentes sem dueDate
// (createdAt asc) -> concluídas (completedAt desc, empate createdAt desc). Não muta a lista de entrada.

export function sortAssessments(assessments: Assessment[]): Assessment[];
// agendadas primeiro (date asc), depois realizadas (date desc).

--- 8. src/domain/repositories.ts --- (PORTOS — interfaces puras, sem import de storage)
export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  upsert(item: T): Promise<void>; // insere ou substitui por id
  remove(id: string): Promise<void>;
}

--- 9. src/data/storage.ts --- (ADAPTADOR — único módulo que conhece AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';
export const STORAGE_KEYS = {
  subjects: 'studia.subjects',
  activities: 'studia.activities',
  assessments: 'studia.assessments',
} as const;
export async function readCollection<T>(key: string): Promise<T[]>;
// pega o valor; ausente/JSON inválido/parse != Array -> retorna [] (SEMPRE array; nunca lançar).
// Se JSON válido mas não-array, ignore e retorne [] (defesa na leitura, RNF-04).
export async function writeCollection<T>(key: string, items: T[]): Promise<void>;
// setItem JSON.stringify(items). Se lançar, propague (o repositório trata).

--- 10. src/data/notifier.ts ---
export type ChangeEvent = 'subjects:changed' | 'activities:changed' | 'assessments:changed';
export function subscribe(event: ChangeEvent, listener: () => void): () => void; // retorna unsubscribe
export function emit(event: ChangeEvent): void;
// Map<ChangeEvent, Set<listener>>. listener que lança: capture e ignore (não quebre os demais).

--- 11. src/data/subject.repository.ts / activity.repository.ts / assessment.repository.ts ---
Implementam Repository<Subject> / Repository<Activity> / Repository<Assessment> usando storage.ts +
notifier.ts. Cada método upsert/remove: lê a coleção, modifica, grava a lista inteira, emite o evento.
Exporte uma instância única: `export const subjectRepository: Repository<Subject> = ...` (idem
activityRepository, assessmentRepository).

NÃO CRIE: testes (sem Jest no scaffold), hooks, componentes, rotas, README.

VERIFICAÇÃO (rode e cole a saída no relatório final):
npx tsc --noEmit
npx expo lint

TESTE DE MESA (não crie nem instale nada — valide LENDO o código e registre cada resultado no
relatório final; é assim que se confere o domínio sem Jest no projeto):
- monogram('Introdução à Banco de Dados') deve retornar 'IB' (stopwords 'à','de','a' descartadas;
  pegam-se 'Introdução' e 'Banco')
- parseDDMMYYYY('31/02/2026') deve retornar null; parseDDMMYYYY('29/02/2027') deve retornar null
- validateSubject({name:'a',teacher:''},[]) deve conter a key 'name';
  validateSubject({name:'Matemática',teacher:''},['matemática']) deve conter a key 'name' (duplicado)
- progressSummary([]).ratio deve retornar 0 — nunca NaN

COMMIT (somente os arquivos criados + package.json/package-lock.json):
git add src/domain src/data package.json package-lock.json
git commit -m "feat(domain,data): fundação de domínio puro e repositórios AsyncStorage

Refs: docs/specs/2026-10-07-slice-0-foundation"

RELATÓRIO FINAL: lista de arquivos criados, saída dos gates, resultado dos testes de mesa, e QUALQUER
ponto onde você precisou divergir do prompt (divergência sem reporte = falha).
```

---

## P1 — Navegação definitiva + UI Kit monocromático

```text
Você vai implementar o Slice 1 do Studia (Expo SDK 57, Expo Router, TypeScript strict, branch
development): transformar o scaffold de demo no esqueleto de navegação e criar a biblioteca de
componentes monocromáticos. Nenhuma lógica de negócio ainda — os dados/rotas de produto mostram
placeholders.

LEIA ANTES DE CODAR:
1. docs/design/visual-identity.md — TODA a especificação visual (tokens, tipografia, estados sem cor).
2. docs/architecture/screens-and-navigation.md — mapa geral e "Notas de implementação" (rotas).
3. docs/adr/ADR-0003-estrategia-de-navegacao.md e docs/adr/ADR-0006-identidade-visual-monocromatica.md.
4. src/constants/theme.ts, src/components/app-tabs.tsx, src/app/_layout.tsx (estado atual do scaffold).

IMPORTANTE: a API de tabs usada é a que JÁ EXISTE no scaffold (NativeTabs de
'expo-router/unstable-native-tabs'). NÃO troque por outra e NÃO invente nova. O exemplo abaixo
espelha o app-tabs.tsx atual. Se algum prop não existir no expo-router instalado, ajuste para o que
existe no pacote local (consulte node_modules/expo-router/build/native-tabs/types.d.ts) e reporte a
diferença no relatório final — proibido instalar dependências novas.

PARTE A — TEMA: substitua o conteúdo de src/constants/theme.ts pelo bloco abaixo (mantém API
compatível com o que já existe — Colors, Fonts, Spacing, BottomTabInset, MaxContentWidth):

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

PARTE B — ROTAS (estrutura final; apague o que não serve):
- src/app/_layout.tsx: raiz vira Stack da tab group + modais. Código-alvo:

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => { SplashScreen.hideAsync(); }, []);
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: Colors[colorScheme ?? 'light'].background } };
  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subject-form" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="activity-form" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="assessment-form" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

- src/app/(tabs)/_layout.tsx: mova/adapte o app-tabs.tsx para 4 triggers SEM ícone (só Label):
  name="index" Label 'Painel'; name="subjects" 'Matérias'; name="activities" 'Atividades';
  name="assessments" 'Avaliações'. Mantenha as cores vindas de Colors[scheme] (background,
  indicatorColor backgroundSelected, label text/textSecondary) exatamente como o arquivo atual.
  Delete src/components/app-tabs.tsx e app-tabs.web.tsx (a versão .web.tsx: recrie em
  src/app/(tabs)/_layout.web.tsx se o build web quebrar sem ela — mas web NÃO é alvo; se der erro só
  no web, delete o .web e siga).
- src/app/(tabs)/index.tsx: placeholder 'Painel' — SafeAreaView + ScreenHeader(title='Painel') +
  EmptyState (ícone: nenhum; título 'Bem-vindo ao Studia'; texto 'Cadastre sua primeira matéria para
  começar.'; ação: botão 'Nova matéria' que navega para /subject-form).
- src/app/(tabs)/subjects.tsx, activities.tsx, assessments.tsx: placeholders com ScreenHeader do nome
  e um EmptyState simples (textos: 'Nenhuma matéria ainda.', 'Nenhuma atividade ainda.',
  'Nenhuma avaliação ainda.').
- src/app/subject-form.tsx, activity-form.tsx, assessment-form.tsx: 3 arquivos-placeholder que só
  renderizam ScreenHeader com título ('Nova matéria' / 'Nova atividade' / 'Nova avaliação') e um botão
  'Voltar' (router.back()). O conteúdo real vem nos slices seguintes.
- DELETE: src/app/index.tsx (velho, substituído), src/app/explore.tsx, src/components/animated-icon.tsx,
  animated-icon.web.tsx, animated-icon.module.css, hint-row.tsx, external-link.tsx, web-badge.tsx,
  ui/collapsible.tsx, themed-text.tsx, themed-view.tsx (nenhum pode sobreviver — o gate tsc garante
  que nada os importa). NÃO apague src/hooks/use-color-scheme*.ts (useTheme depende).

PARTE C — COMPONENTES (src/components/ui/*.tsx; props EXATAS abaixo; todos consomem useTheme()
de src/hooks/use-theme.ts e os tokens; StyleSheet.create por arquivo; sem shadow, sem cor fora
dos tokens):

Button.tsx:
  interface ButtonProps { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; }
  primary: fundo surfaceInverse, texto textOnInverse; secondary: fundo backgroundElement, texto text;
  ghost: transparente, texto textSecondary. padding vertical Spacing.three, radius Radius.button,
  fonte Typography.button. disabled: opacidade 0.4 + sem onPress. Pressed (via Pressable style fn):
  fundo backgroundSelected.

Input.tsx:
  interface InputProps { value: string; onChangeText: (t: string) => void; placeholder?: string;
    label: string; error?: string; warning?: string; multiline?: boolean; keyboardType?: 'default' | 'number-pad';
    maxLength?: number; autoCapitalize?: 'none' | 'sentences'; }
  Rótulo sempre visível acima (Typography.section uppercase, textSecondary). Campo: fundo
  backgroundElement, radius Radius.field, altura 48 (multiline: minHeight 96), borda 1px border;
  com error: borda 1.5px borderStrong + mensagem abaixo (Typography.meta, text); com warning: borda
  borderStrong pontilhada? NÃO — mantenha borda border + mensagem em textSecondary com prefixo 'Aviso: '.
  Placeholder textTertiary. A mensagem de erro é o ÚNICO indicador de erro (sem cor).

FormField.tsx — não crie; Input já inclui label+erro (evite abstração duplicada).

Card.tsx:
  interface CardProps { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; }
  fundo backgroundElement, radius Radius.card, padding Spacing.three, Pressable quando onPress.

ListItem.tsx:
  interface ListItemProps { children: React.ReactNode; onPress?: () => void; }
  linha com padding vertical Spacing.three, separador Divider embutido na base (hairline).

Divider.tsx: <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border }} />

EmptyState.tsx:
  interface EmptyStateProps { title: string; text: string; actionLabel?: string; onAction?: () => void; }
  bloco centralizado vertical, título bodyStrong, texto meta (textAlign center), botão secondary opcional.

Badge.tsx:
  interface BadgeProps { label: string; tone?: 'outline' | 'inverse'; }
  outline: borda 1px borderStrong, texto text, padding h Spacing.two v Spacing.one, radius Radius.chip,
  fonte Typography.section (não-uppercase, sem letterSpacing). inverse: fundo surfaceInverse, texto
  textOnInverse (usar p/ 'ATRASADA' e estados fortes). Sem cor.

ScreenHeader.tsx:
  interface ScreenHeaderProps { title: string; action?: { label: string; onPress: () => void }; }
  SafeAreaView top; título Typography.title; à direita um Button ghost (label=action.label).

ProgressBar.tsx:
  interface ProgressBarProps { ratio: number; width?: number; } // ratio 0..1; clamp interno
  trilho backgroundSelected radius 3 altura 6; preenchimento surfaceInverse (largura ratio*100%).

Monogram.tsx:
  interface MonogramProps { name: string; size?: 'sm' | 'md'; } // sm 32, md 40
  quadrado radius Radius.monogram, borda 1px borderStrong, centrado, texto Typography.bodyStrong
  (sm: Typography.meta) usando a função monogram() de src/domain/monogram.ts.

VERIFICAÇÃO OBRIGATÓRIA:
npx tsc --noEmit && npx expo lint — ambos sem erro. Rode npx expo start e confirme no Metro que o app
compila (se não tiver dispositivo, `npx expo start --no-dev --minify` falhar de bundle conta como erro;
relate). As 4 abas devem alternar entre os placeholders sem erro no console.

COMMIT:
git add src/app src/components src/constants/theme.ts
git commit -m "feat(navigation,uikit): rotas definitivas e componentes monocromáticos

Refs: docs/specs/2026-10-07-slice-1-navigation-uikit"

RELATÓRIO: arquivos criados/deleted, saída dos gates, divergências (especialmente se a API NativeTabs
for diferente da descrita — NÃO adapte silenciosamente).
```

---

## P2 — Matérias (T2 lista + T5 formulário com validação)

```text
Você vai implementar o Slice 2 do Studia (Expo SDK 57, Expo Router, TS strict, branch development):
o CRUD de MATÉRIAS completo e funcional — a lista (T2) e o formulário com validação (T5). Este é o
"formulário com validação" oficial do projeto.

LEIA ANTES DE CODAR:
1. docs/requirements/functional-requirements.md → RF-01, RF-02, RF-03 e todos os CAs citados abaixo.
2. docs/architecture/domain-model.md → Subject (sem campo color!).
3. src/domain/models.ts, src/domain/validation.ts, src/domain/monogram.ts, src/domain/progress.ts,
   src/data/subject.repository.ts, src/data/activity.repository.ts, src/data/assessment.repository.ts,
   src/data/notifier.ts (já existem — CONSUMA, não reimplemente).
4. src/components/ui/* (já existem — use: Card, ListItem, Monogram, ProgressBar, Badge, EmptyState,
   ScreenHeader, Input, Button, Divider). src/hooks/use-theme.ts.
5. docs/design/visual-identity.md — seção 2 (estados sem cor) e 4 (composição).

CONTRATO DO HOOK — crie src/hooks/use-subjects.ts (e apenas ele):

interface UseSubjects {
  subjects: Subject[];              // ordenados por localeCompare(name, pt-BR) case-insensitive
  activitiesCount: Record<string, { pending: number; done: number }>; // keyed by subjectId
  assessmentsCount: Record<string, number>; // agendadas por subjectId
  loading: boolean;
  error: string | null;             // 'Falha ao carregar seus dados.' quando repositório lançar
  create(input: SubjectFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  update(id: string, input: SubjectFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  remove(id: string): Promise<{ ok: boolean; reason?: string }>;
  refresh(): void;
}
- Carrega no mount Promise.all das 3 coleções (subjects, activities, assessments).
- Assina notifier: subjects/activities/assessments:changed → recarrega. unsubscribe no cleanup.
- create/update: valida com validateSubject (names dos outros, ignorando o próprio id em update);
  inválido -> retorna errors sem gravar. Válido -> monta Subject { id: id ?? genId(), name: trim,
  teacher: trim || null, createdAt: original ?? new Date().toISOString() } e subjectRepository.upsert.
- remove: se houver activity OU assessment com subjectId===id, retorna
  { ok: false, reason: `Esta matéria tem ${N} atividade(s) e ${M} avaliação(ões); exclua-os primeiro.` }
  (conte as reais: 'N atividade(s) e M avaliação(ões)' com os números). NÃO exclui.

T2 — substitua src/app/(tabs)/subjects.tsx:
- FlatList (não ScrollView) dos cards, padding lateral Spacing.four.
- Header: ScreenHeader title='Matérias' action={{ label: '+ Nova matéria', onPress: router.push('/subject-form') }}.
- Card do item: linha com Monogram size='md' name + coluna { nome (bodyStrong), professor(a) ou
  'Sem professor' (meta, textTertiary) }; linha de métricas: '{pending} pendente(s)' e
  '{agendadas} avaliação(ões) agendada(s)' (meta); ProgressBar com ratio = progress.subjects.
- Pressionar card -> router.push(`/subject-form?id=${item.id}`).
- loading=true: um PlaceholderList simples (3 Cards vazios com altura fixa — sem spinner colorido).
- error: EmptyState title='Deu errado' text={error} actionLabel='Tentar de novo' onAction=refresh.
- vazio: EmptyState title='Nenhuma matéria ainda' text='Cadastre a primeira matéria para organizar suas atividades e provas.' actionLabel='+ Nova matéria' onAction.

T5 — substitua src/app/subject-form.tsx:
- useLocalSearchParams<{ id?: string }>(). Com id: carrega a matéria (getAll + find), título 'Editar
  matéria', botão secundário 'Excluir' no rodapé; sem id: 'Nova matéria'.
- Estado local: { name, teacher } + errors + submitTried. Input acima: value/onChangeText limpa o erro
  do campo.
- Salvar (Button primary, full width): chama create/update do hook. !ok -> exibe errors. ok ->
  router.back(). Sem toast/alerta extra (a lista atualiza ao voltar — notifier já cuida).
- Excluir (edição, Button ghost): ao tocar, dispare `Alert.alert('Excluir matéria',
  'Tem certeza? Essa ação não pode ser desfeita.', [ {text:'Cancelar', style:'cancel'},
  {text:'Excluir', style:'destructive', onPress: async () => { const r = await remove(id);
  if (r.ok) router.back(); else setBlockMessage(r.reason ?? 'Não foi possível excluir.'); }}])`.
  `blockMessage`, quando definido, é renderizado sob o botão como texto `meta` (sem cor, sem Alert
  novo): é assim que o bloqueio CA-03.4 aparece. (Pergunta de confirmação via Alert é o padrão RN;
  'destructive' é o rótulo do sistema, não uma cor.)
- Cancelar (Button ghost): router.back() sem gravar.

REGRAS DE UI (vinculares): monocromático estrito via tokens; nada de cores fora do tema; mensagens em
PT-BR EXATAS as dos contratos de validation.ts; labels 'Nome' e 'Professor(a) (opcional)'; botão
principal 'Salvar'.

NÃO CRIE: rotas novas, repositórios novos, componentes fora de src/components/ui já existentes.

VERIFICAÇÃO:
npx tsc --noEmit && npx expo lint
Manual (relate cada um no relatório): cadastrar matéria com nome vazio -> erro 'Informe o nome da
matéria.'; nome 'a' -> erro de tamanho; duplicar nome -> erro; criar válida -> some no card; editar ->
persiste; excluir com filhos não é possível ainda (sem atividades) -> sem filhos -> Alert confirma ->
some; fechar o app no Expo Go e reabrir -> matérias intactas.

COMMIT:
git add src/hooks/use-subjects.ts "src/app/(tabs)/subjects.tsx" src/app/subject-form.tsx
git commit -m "feat(subjects): CRUD de matérias com validação e lista

Refs: docs/specs/2026-10-07-slice-2-subjects"
```

---

## P3 — Atividades (T3 lista com filtros + T6 formulário)

```text
Você vai implementar o Slice 3 do Studia (Expo SDK 57, Expo Router, TS strict, branch development):
CRUD de ATIVIDADES com prazo, filtros e conclusão.

LEIA ANTES DE CODAR:
1. docs/requirements/functional-requirements.md → RF-04, RF-05, RF-06, RF-07 + CAs.
2. docs/architecture/domain-model.md → Activity.
3. src/domain/{models,validation,date,sorting,progress,monogram,id}.ts, src/data/{activity,subject}.repository.ts, src/data/notifier.ts — CONSUMA, não reimplemente.
4. src/components/ui/* e src/hooks/use-theme.ts.
5. docs/specs/2026-10-07-slice-3-activities/spec.md — ACs.

CONTRATO — crie src/hooks/use-activities.ts:
interface UseActivities {
  activities: Activity[];  // sortActivities
  subjects: Subject[];     // para o seletor e monogramas
  loading: boolean; error: string | null;
  create(input: ActivityFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  update(id: string, input: ActivityFormInput): Promise<{ ok: boolean; errors: FieldErrors }>;
  toggleStatus(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  refresh(): void;
}
- create/update: validateActivity (dueDate 'DD/MM/AAAA' -> parseDDMMYYYY; warning não bloqueia).
  Válido: Activity { id: existing/gerado, subjectId, title: trim, type: 'tarefa' default — o form
  passa o type escolhido, description: trim||null, dueDate: parsed||null, status original ou
  'pendente', createdAt original ou agora, completedAt idem }. toggleStatus: pendente<->concluida,
  ao concluir completedAt=new Date().toISOString(); ao reabrir completedAt=null.
- Assina notifier (activities: e subjects:changed para o seletor).

T3 — substitua src/app/(tabs)/activities.tsx:
- Estado local de filtro: 'pendentes' | 'todas' | 'concluidas' (default pendentes).
- Controlador de filtro: subcomponente LOCAL definido no MESMO arquivo da tela (ex.: function
  SegmentedFilter). NÃO crie arquivo novo em src/components/ui/ (só 1 tela usa — não é biblioteca).
  Visual: linha de 3 botões; não selecionado: fundo backgroundElement, texto textSecondary;
  selecionado: borda 1.5px borderStrong, texto text; radius Radius.chip; fonte Typography.meta;
  padding h Spacing.two.
- FlatList de ListItems ordenados (filtro aplicado DEPOIS do sortActivities; concluídas aparecem só em
  'todas'/'concluidas').
- Linha do item: [checkbox circular 24px: pendente = círculo vazio com borda borderStrong; concluída =
  círculo preenchido surfaceInverse com traço claro no centro (View 10x2, backgroundColor textOnInverse);
  Pressable ANINHADO com onPress -> toggleStatus — no React Native o Pressable mais interno captura o
  toque, então tocar o checkbox NÃO abre o editor] | coluna:
  título (bodyStrong, line-through + textTertiary se concluída) + meta com Monogram sm + nome da matéria |
  direita: Badge do prazo — 'hoje'/'amanhã'/'em N dias' (relativeLabelBR) tone='outline';
  'atrasada N dias' tone='inverse'; sem dueDate: nada. A LINHA INTEIRA (menos o checkbox) tem
  onPress -> router.push(`/activity-form?id=${id}`).
- Header: ScreenHeader 'Atividades' action '+ Nova atividade' -> /activity-form.
- Vazios: pendentes 'Nenhuma atividade pendente.' / 'Você está em dia.'; concluídas 'Nenhuma atividade
  concluída ainda.'; todas 'Nenhuma atividade ainda. Crie a primeira.'
- error/Loading como no padrão da T2.

T6 — substitua src/app/activity-form.tsx:
- useLocalSearchParams<{ id?: string }>(); títulos 'Nova atividade' / 'Editar atividade'.
- Campos (ordem): Input 'Título' (obrigatório); seletor de matéria: se subjects.length===0, renderize
  um bloco EmptyState pequeno com botão 'Cadastrar matéria' -> router.push('/subject-form') e o
  restante do form FICA DESABILITADO (não salve sem matéria — CA-04.4); senão, linha horizontal
  scrollable de chips (View com borderStrong quando selecionado, backgroundElement caso contrário,
  texto body/meta — um chip por matéria: Monogram sm + nome). Tipo: 4 chips iguais (Tarefa, Trabalho,
  Leitura, Estudo — rótulos PT; valor EN no estado). Input 'Prazo (opcional)' number-pad maxLength 10
  (máscara: ao digitar, auto-inserir '/' a cada 2 dígitos; ex. '0710' -> '07/10'). multiline Input
  'Descrição (opcional)'.
- Salvar -> use-activities create/update -> ok: router.back(); senão errors nos campos (warnings em
  cinza sob o prazo).
- Edição: botão ghost 'Excluir' com o MESMO padrão de Alert + reason message da P2.
- Cancelar -> back.

VERIFICAÇÃO: gates + manual: criar atividade sem título -> erro; sem matéria -> bloqueado (com zero
matérias no storage o form mostra a ponte para T5); com matérias, chip seleciona; prazo '99/99/9999'
-> erro de formato; prazo no passado -> 'Aviso: esta data está no passado.' mas SALVA; concluir item na
lista -> risco + badge some + contagem da matéria (T2) atualiza sem sair da aba (notifier); fechar e
reabrir app -> situação intacta.

COMMIT:
git add src/hooks/use-activities.ts "src/app/(tabs)/activities.tsx" src/app/activity-form.tsx
git commit -m "feat(activities): lista com filtros, conclusão e formulário de atividades

Refs: docs/specs/2026-10-07-slice-3-activities"
```

---

## P4 — Avaliações (T4 lista + T7 formulário)

```text
Você vai implementar o Slice 4 do Studia (Expo SDK 57, Expo Router, TS strict, branch development):
CRUD de AVALIAÇÕES (provas/seminários) com data obrigatória.

LEIA: RF-08 + CAs (docs/requirements/functional-requirements.md); docs/architecture/domain-model.md
→ Assessment (SEM campo de nota); src/domain/{models,validation,date,sorting}.ts;
src/data/assessment.repository.ts; src/components/ui/*; specs/2026-10-07-slice-4.

CONTRATO — crie src/hooks/use-assessments.ts espelhando use-activities:
{ assessments (sortAssessments), subjects, loading, error, create, update, toggleStatus
(agendada<->realizada), remove, refresh } — validateAssessment; date parseADA/parseDDMMYYYY obrigatório.

T4 — substitua src/app/(tabs)/assessments.tsx:
- Lista de ListItems: título (line-through + textTertiary se realizada) + monograma&matéria na meta
  + à direita: Badge 'agendada' outline com relativeLabelBR da data; realizada: texto 'realizada'
  meta textTertiary sem badge forte. Pressionar item: router.push(`/assessment-form?id=`).
- Toggle de situação na própria linha (mesmo padrão do checkbox circular, rótulo 'Realizada').
- Header: ScreenHeader 'Avaliações' + '+ Nova avaliação'. Vazio: 'Nenhuma avaliação ainda.' +
  'Cadastre suas provas para acompanhar as datas.'.

T7 — substitua src/app/assessment-form.tsx:
- Como T6 (padrão idêntico de chips de matéria + ponte para T5 quando não há matérias) mas o campo
  Data é OBRIGATÓRIO ('Data' label, number-pad, máscara DD/MM/AAAA, maxLength 10) e NÃO há campo tipo
  nem descrição. Passado -> 'Aviso: esta data está no passado.' não-bloqueante.
- Salvar/Excluir/Cancelar = mesmo padrão P2/P3.

VERIFICAÇÃO: gates + manual: criar sem data -> 'Informe a data...'; com data válida -> aparece ordenada
(agendadas primeiro); toggle realizada -> esmaece e move p/ fim; fechar/reabrir -> intacta.

COMMIT:
git add src/hooks/use-assessments.ts "src/app/(tabs)/assessments.tsx" src/app/assessment-form.tsx
git commit -m "feat(assessments): lista e formulário de avaliações

Refs: docs/specs/2026-10-07-slice-4-assessments"
```

---

## P5 — Painel (T1 dashboard)

```text
Você vai implementar o Slice 5 do Studia (Expo SDK 57, Expo Router, TS strict, branch development):
o Painel inicial (substituir o placeholder de src/app/(tabs)/index.tsx). Só LEITURA das 3 coleções
via hooks existentes — nenhum mutation neste slice.

LEIA: RF-09 + CAs; docs/architecture/screens-and-navigation.md → T1; src/hooks/use-{subjects,
activities,assessments}.ts; src/domain/progress.ts; docs/design/visual-identity.md §2 (métricas
grandes por escala tipográfica, sem cor).

CONTRATO — crie src/hooks/use-dashboard.ts:
interface UseDashboard {
  summary: { pendingTotal: number; dueSoon: Activity[] /* pendentes com dueDate <= hoje+7, sortActivities */;
             nextAssessments: Assessment[] /* agendadas, próximas 3 */; progress: { total: number; done: number; ratio: number } };
  subjectProgress: { subject: Subject; progress: SubjectProgress }[]; // ordenado por ratio desc, top 3 com total>0
  loading: boolean; error: string | null; refresh(): void;
}
— usa os 3 repositórios + notifier (mesmo padrão dos hooks de coleção).

T1 — tela: ScrollView (poucos itens) com SafeAreaView, padding lateral Spacing.four:
1. 'Pendências' (seção: rótulo Typography.section uppercase + valor grande Typography.metric '{n}') +
   botão ghost 'Ver atividades' -> `router.push('/activities')` (em Expo Router, rotas dentro do grupo
   `(tabs)` têm URL sem o nome do grupo: `/activities`, `/subjects`, `/assessments`). Lista compacta:
   até 3 Card com {title, monograma+matéria, Badge relativeLabelBR do prazo}; vazio:
   'Nada vencendo nesta semana.'.
2. 'Próximas avaliações' seção + até 3 ListItems {titulo, matéria, data relativa}; botão ghost
   'Ver avaliações' -> `router.push('/assessments')`; vazio: 'Nenhuma avaliação agendada.'.
3. 'Progresso' seção: linha com 'Concluídas {done}/{total}' + ProgressBar full-width; depois top 3
   matérias: ListItem { Monogram sm, nome, ProgressBar width 120, '{done}/{total}' meta }; botão ghost
   'Ver matérias' -> `router.push('/subjects')`.
4. TODA a tela sem dados (3 coleções vazias): o EmptyState de boas-vindas do placeholder atual, com
   ação '+ Nova matéria' -> /subject-form. Os blocos não devem renderizar NaN/0 confuso — quando há
   dados, renderize os blocos; se total===0 a barra fica 0% (ok).
- error: EmptyState 'Deu errado' + Tentar de novo (padrão). loading: 3 Card placeholder estáticos.

NÃO adicione saudação com hora, gráficos, nem widgets.

VERIFICAÇÃO: gates + manual: com 1 matéria/2 atividades/1 avaliação cadastradas, números conferem;
concluir atividade na aba Atividades e VOLTAR ao painel -> atualizado; modo avião, app reaberto ->
carrega (local).

COMMIT:
git add src/hooks/use-dashboard.ts "src/app/(tabs)/index.tsx"
git commit -m "feat(dashboard): painel inicial com pendências, avaliações e progresso

Refs: docs/specs/2026-10-07-slice-5-dashboard"
```

---

## P6 — Integração final + polish (Etapa 6 do roteiro)

```text
Você vai fechar o Studia (Expo SDK 57, Expo Router, TS strict, branch development): limpeza final,
verificação do checklist da Etapa 6 do roteiro e README.

FAÇA, nesta ordem:
1. Grep de conformidade (corrija qualquer violação que encontrar):
   - grep por '#' fora de src/constants/theme.ts em src/ (nenhum hex; tolerar: nada)
   - grep por 'shadow' em src/ (zero)
   - grep por ': any' e '@ts-ignore' (zero)
   - imports de '@react-native-async-storage/async-storage' fora de src/data/storage.ts (zero)
   - textos de UI em PT (relaxe se algo em inglês sobrou: traduza)
2. Roteiro Etapa 6 checklist manual (registre cada item no relatório com OK/falha):
   app inicia no Expo Go sem erros; as 4 abas abrem; navegação abas->form->voltar ok; botões agem;
   formulários validam (testar os 3); listas apresentam dados; storage sobrevive a fechar/reabrir;
   interface legível (dark + light: forçar via config do sistema).
3. README.md (raiz): substitua a seção 'Status' por 'Implementado (MVP)'; garanta que os comandos de
   execução batem com package.json; nada mais.
4. CHANGELOG.md: em [Unreleased] > Added, liste os 6 slices com 1 linha cada; Added da Etapa 1 continua.
5. Gates finais: npx tsc --noEmit && npx expo lint. Corrija tudo que quebrar.

COMMIT (último):
git add CHANGELOG.md README.md
git commit -m "chore(release): finaliza MVP — integração, conformidade e docs"

RELATÓRIO FINAL: checklist Etapa 6 completo, saídas dos gates, lista de conformidade (grep) com
resultado, e divergências remanescentes (se houver, elas vão para docs/requirements/open-questions.md
como questões novas — NÃO conserte o que foge do escopo aprovado).
```

---

## PR — Pesquisa Mobbin (opcional; executo eu quando o MCP estiver ativo)

```text
(Prompt para o planejador/agente com acesso ao Mobbin MCP)
Use o servidor MCP 'Mobbin' para buscar referências do Studia. Termos: "minimalist to-do", "study
planner", "monochrome productivity", "black and white list app". Para cada app relevante, capture a
estrutura de: lista de tarefas (linha vs card), header de tela com ação, formulário modal (ordem de
campos, mensagens de erro) e estado vazio. PRODUTO: docs/design/references.md — tabela
[app | padrão observado | aplicação no Studia (manter/descartar)], SEM adotar cor ou ícone: a
identidade é a de docs/design/visual-identity.md (monocromática). Registre 4–8 referências no máximo.
Se o MCP não responder/autenticar, relate a falha — os prompts P1–P5 não dependem dele.
```
