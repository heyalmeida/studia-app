# Plano — expo-go-layout

| Campo | Valor |
|---|---|
| **Spec** | ./spec.md |
| **Risco (Regra 6)** | **médio** — toca toda a camada de apresentação (7 telas + kit), mas não escreve dados nem altera domínio; falha = layout quebrado, nunca perda de informação |

## Abordagem técnica

Converter o resto da árvore de `className` para `StyleSheet.create` com **números explícitos**, mantendo
`src/constants/theme.ts` como fonte única dos tokens (Regra 4.10). Nenhuma regra de negócio muda: os
mesmos valores de espaçamento, tipografia e cor saem dos tokens, apenas expressos como objeto de estilo em
vez de classe utilitária.

Três pontos que exigiram decisão local (não architectural):

1. **`Card`** deixou de aceitar `className`/`contentClassName` e passa a aceitar `style` +
   `contentStyle` — o layout dos cards (gap, padding, flex) é responsabilidade do componente chamador.
2. **`Touchable`** perde `contentClassName` (resquício do NativeWind) e mantém `contentStyle`.
3. **Padding do rodapé fixo** (148 px, `FORM_FOOTER_HEIGHT`) e **insets de lista** (`listBottomInset` /
   `contentBottomInset`) viram helpers em `theme.ts`, usados pelas 7 telas.

O `elevation: 6` do FAB conflita com o ADR-0009 §6 ("sem sombras") e o uso de `StyleSheet` conflita com o
ADR-0007 (NativeWind) — ambos registrados como revisão no ADR-0010, que substitui o ADR-0007.

## Arquivos impactados

| Arquivo/pasta | Camada (ADR-0004) | Ação | Observação |
|---|---|---|---|
| `src/constants/theme.ts` | constants | editar | `SAFE_GAP`, `TAB_BAR_HEIGHT`, `FORM_FOOTER_HEIGHT`, `Typography.field/button`, `Radius.button`, helpers de inset |
| `src/components/ui/Card.tsx` | components | editar | `className` → `style`/`contentStyle` |
| `src/components/ui/Touchable.tsx` | components | editar | remove `contentClassName`; exporta `centeredContent` |
| `src/components/ui/CreateButton.tsx` | components | criar | ação "+ Nova …" do header e do estado vazio |
| `src/components/ui/{Chip,ChoiceChip,DateField,DatePicker,EmptyState,FAB,FormField,FormFooter,IconPicker,ColorPicker,Input,PrimaryButton,ScreenHeader,TextButton,Divider,IconTile,ListItem,ListSkeleton,ProgressBar,ProgressRing,DateBlock,SegmentedControl}.tsx` | components | editar | `className` → `StyleSheet` |
| `src/components/ActivitiesPage/{ActivityRow,ActivitySectionList}.tsx` | components | editar | idem |
| `src/components/AssessmentsPage/AssessmentCard.tsx` | components | editar | idem |
| `src/components/DashboardPage/{Greeting,ProgressSummaryCard,UpcomingList,NextAssessmentCard}.tsx` | components | editar | idem |
| `src/components/SubjectsPage/SubjectCard.tsx` | components | editar | idem |
| `src/screens/*/index.tsx` (7 telas) | screens | editar | padding inferior por inset; `ScreenHeader` com `createAction` |
| `src/app/(tabs)/_layout.tsx` | app | editar | tab bar com `StyleSheet` e altura determinística |
| `tailwind.config.js` | config | editar | espelha raio 14 e escala 16 px |

## Dependências novas

Nenhuma.

## Decisões tomadas nesta entrega

- **Revisão do ADR-0007** (ADR-0010): `StyleSheet` passa a ser o sistema de escrita de estilo; NativeWind
  permanece instalado e espelhando os tokens, removível depois. **Motivo:** módulo nativo ausente no
  Expo Go.
- **Exceção de sombra no FAB** (ADR-0010 §3): `elevation` 6 apenas no botão flutuante, que precisa se
  destacar do conteúdo que passa por baixo dele. Cards, linhas e superfícies seguem sem sombra
  (ADR-0009 §6 / RNF-01).

## Riscos conhecidos

| Risco | Mitigação |
|---|---|
| Regressão visual silenciosa (nada quebra, só muda o espaçamento) | tokens preservados; revisão por tela antes do commit |
| Confundir `style` (visual do alvo) com `contentStyle` (padding do Pressable) | docstring explícita no `Touchable` e no `Card` |
| Esquecer um `className` e a tela seguir colapsada | AC-1 verificado por busca textual antes do commit |
| `elevation` no Android com hairline de borda | documentado como exceção única no ADR-0010 |