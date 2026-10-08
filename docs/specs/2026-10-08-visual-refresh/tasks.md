# Tarefas — Refactor visual (identidade escura + UI kit)

- [x] Spec + plan aprovados (conflitos com ADR-0006 e modelo de dados decididos com o dono em 2026-10-08)
- [x] 1. Tokens: `src/constants/theme.ts`, `src/styles/global.css`, `tailwind.config.js`, `app.json`
      (`userInterfaceStyle: dark`, splash com a cor de fundo)
- [x] 2. Domínio/persistência: `Subject.color` em `models.ts`, validação em `validation.ts`, migração em
      `subject.repository.ts`, persistência em `use-subjects.ts`
- [x] 3. `use-dashboard.ts`: `summary.upcoming` (3 pendentes) e `summary.dueThisWeek`; remoção do que ficou
      sem consumidor (`weeklyCompleted`, `dueSoon`, `pendingTotal`, `subjectProgress`)
- [x] 4. UI kit — base: `Touchable`, `ScreenHeader`, `Card`, `Chip`, `ChoiceChip`, `Input`, `PrimaryButton`,
      `TextButton`, `SegmentedControl` (+`FadeIn`), `EmptyState`, `FAB`
- [x] 5. UI kit — domínio visual: `IconTile`, `IconPicker` (grade 6×12), `ColorPicker`, `DateField`,
      `DatePicker`, `DateBlock`, `DueChip`, `ProgressRing`, `ProgressBar`, `SubjectChip`, `FormField`,
      `FormFooter`, `ListItem`, `ListSkeleton`
- [x] 6. Remover componentes sem consumidor: `Button`, `Badge`, `DashCard`, `LineChart`, `Monogram`,
      `DonutChart`, `DateInput`, `DueSoonCard`, `NextAssessmentRow`, `SubjectProgressRow`, `SectionLabel`,
      `SegmentedFilter`; remover `use-theme`/`use-color-scheme`
- [x] 7. T1 Painel: `Greeting`, `ProgressSummaryCard`, `UpcomingList`, `NextAssessmentCard` + tela
- [x] 8. T2 Matérias: `SubjectCard` (IconTile, pendentes · avaliações, barra na cor) + tela com FAB
- [x] 9. T3 Atividades: `activity-groups` + `ActivitySectionList` (cabeçalhos de período), `ActivityRow`
      (checkbox animado, 2 linhas, bolinha da matéria, chip de prazo) + tela com `SegmentedControl` e fade
- [x] 10. T4 Avaliações: `AssessmentCard` (bloco de data) + tela com FAB e estado vazio de calendário
- [x] 11. T5/T6/T7 Formulários: `FormField`/`FormFooter`, grade de ícones + `ColorPicker` (matéria),
      `SubjectChip` coloridos, chips de tipo com ícone, `DateField` com atalhos, descrição 100
- [x] 12. Tab bar flutuante: `surface`, hairline, ativo em acento com label, inativos em `text-tertiary`
- [x] 13. Gates automáticos: `npx tsc --noEmit` (0 erros), `npx expo lint` (0 erros, 0 warnings),
      `npx expo export --platform web` (13 rotas estáticas renderizadas sem erro)
- [x] 14. Regras 2/7/9: ADR-0009 + ADR-0006 substituído, `visual-identity.md`, `domain-model.md`,
      `screens-and-navigation.md`, RNF-01/05, `features/ui-kit/spec.md` + índice, CHANGELOG e o histórico
      da spec do Slice 6

## Checklist de AC (manual — Expo Go / Android, **pendente**)

Não executado nesta sessão: exige abrir o app em um dispositivo/emulador com o Expo Go. Cada item abaixo
precisa de conferência visual.

- [ ] CA-V.1 nenhum hex fora dos 3 arquivos de token
- [ ] CA-V.2 consistência visual entre as 7 telas (tokens + kit)
- [ ] CA-V.3 header sem sobreposição; FAB nas 3 listas acima da tab bar, sem cobrir conteúdo
- [ ] CA-V.4 estados vazios com ícone 40 + título + apoio + botão primário
- [ ] CA-V.5 feedback de toque e transição de filtro
- [ ] CA-V.6 tab bar: ativo em acento com label, inativos em `#6B6B76`
- [ ] CA-V.7 campo 52+, placeholder visível, foco em `#6366F1`
- [ ] CA-V.8 matéria salva com cor; matéria legada sem `color` abre sem erro; cor inválida rejeitada
- [ ] CA-V.9 painel com 4 blocos, sem texto repetido, e estado vazio com atalho
- [ ] CA-V.10 agrupamento Atrasadas → Hoje → Esta semana → Depois
- [ ] CA-V.11 picker abre ao tocar; atalhos Hoje/Amanhã/Próxima semana funcionam
- [ ] Ciclo de persistência: cadastrar matéria com cor → fechar → reabrir → cor e dados intactos
- [ ] Teclado aberto nos 3 formulários: rodapé fixo e último campo continuam alcançáveis