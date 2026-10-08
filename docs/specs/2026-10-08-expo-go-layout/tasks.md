# Tarefas — expo-go-layout

> Cada tarefa é pequena, verificável e rastreável a um AC. Marcar `- [x]` **somente após verificação**,
> com evidência anotada quando não trivial. Um commit (ou agrupamento coeso de commits) por tarefa quando
> fizer sentido (Regra 8).

- [x] T1 — tokens: `SAFE_GAP`, `TAB_BAR_HEIGHT`, `FORM_FOOTER_HEIGHT`, `Typography.field/button`,
  `Radius.button` e helpers `listBottomInset`/`contentBottomInset` (AC-4)
- [x] T2 — base do kit: `Touchable` (`contentStyle`, `centeredContent`, sem `contentClassName`) e `Card`
  (`style`/`contentStyle` em vez de `className`) (AC-1, AC-5)
- [x] T3 — kit de formulário e ação: `Input`, `FormField`, `DateField`, `DatePicker`, `PrimaryButton`,
  `TextButton`, `FormFooter`, `ScreenHeader`, `IconPicker`, `ColorPicker`, `EmptyState`, `Chip`,
  `ChoiceChip` + `CreateButton` novo (AC-2, AC-5)
- [x] T4 — kit de leitura: `FAB`, `Divider`, `IconTile`, `ListItem`, `ListSkeleton`, `DateBlock`,
  `ProgressBar`, `ProgressRing`, `SegmentedControl` (AC-2, AC-3)
- [x] T5 — componentes por tela: `SubjectCard`, `ActivityRow`, `ActivitySectionList`, `AssessmentCard`,
  `Greeting`, `ProgressSummaryCard`, `UpcomingList`, `NextAssessmentCard` (AC-1, AC-2)
- [x] T6 — telas e navegação: `ScreenHeader` com `onBack`/`createAction`, insets inferiores por tela,
  tab bar com altura determinística (AC-4)
- [x] T7 — verificação: busca de `className`, busca de hex fora dos tokens, `tsc` e `lint` (AC-1, AC-3,
  AC-7)
- [x] T8 — sync documental: ADR-0010, feature spec `ui-kit`, CHANGELOG (Regra 2)

## Evidências de verificação

| Tarefa | Comando / teste | Resultado |
|---|---|---|
| T1 | leitura de `src/constants/theme.ts` | tokens e helpers presentes |
| T2–T6 | `npx tsc --noEmit` | sem erros |
| T2–T6 | `npx expo lint` | sem erros |
| T7 | busca textual por `className` em `src/` | 0 ocorrências em JSX |
| T7 | busca textual por `#[0-9A-Fa-f]{6}` fora dos arquivos de token | nenhuma ocorrência em componente |
| T1–T6 | validação visual no Expo Go | **não executada** — depende de dispositivo/sessão com o usuário |
| T7 | fechar e reabrir o app | **não executada** — sem escrita de dados nesta entrega |

## Encerramento (Regra 10)

- [x] `npx tsc --noEmit` limpo
- [x] `npx expo lint` limpo
- [x] Docs sincronizadas (Regra 2): ADR-0010, `docs/features/ui-kit/spec.md`, CHANGELOG
- [x] CHANGELOG atualizado
- [x] Commits em `development` com escopo correto
- [ ] Validação visual no Expo Go pelo usuário (limitação reportada no handoff, não escondida)