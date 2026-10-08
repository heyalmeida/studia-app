# Plan — Refactor visual (identidade escura + UI kit)

| Campo | Valor |
|---|---|
| **Spec** | [`spec.md`](spec.md) |
| **Data** | 2026-10-08 |
| **Risco (Regra 6)** | médio — `Subject` ganha `color` (persistido), deleção de componentes em uso, mudança visual em 7 telas |

## Abordagem

1. **Tokens primeiro.** `src/constants/theme.ts` vira a fonte única (paleta escura, semânticas, paleta de 8
   tons de matéria com `soft`, `Spacing`, `Radius`, `Typography`). `src/styles/global.css` publica as
   CSS variables (sem bloco `dark`, tema único) e `tailwind.config.js` as expõe ao NativeWind. Paleta de
   matéria fica **no tema** porque o valor é escolhido em runtime — passa por `style`, nunca por
   `className` arbitrário (Regra 4.10: literal de cor só no tema).
2. **Primitivo de toque primeiro.** `Touchable` (Animated, scale 0.97 + opacidade) entra antes dos demais
   componentes; todo pressable do app passa a usá-lo — é o que garante o feedback consistente.
3. **UI kit.** Cada componente do kit é reescrito sobre os tokens e reaproveitado pelas telas; os
   componentes que deixam de ter consumidor são apagados (Regra 4 — nada de componente morto).
4. **Uma tela por vez**, sempre na ordem dado → lista → formulário, com `tsc`/`lint` no fim de cada bloco.
5. **Documentação no mesmo ato** (Regra 2): ADR-0009, `visual-identity.md`, `domain-model.md`,
   `screens-and-navigation.md`, RNF-01/05, `features/README.md`, CHANGELOG.

## Arquivos impactados

**Tokens/config:** `src/constants/theme.ts`, `src/styles/global.css`, `tailwind.config.js`, `app.json`.

**Domínio/persistência:** `src/domain/models.ts`, `src/domain/validation.ts`,
`src/storage/subject.repository.ts`, `src/hooks/use-subjects.ts`, `src/hooks/use-dashboard.ts`.

**UI kit (`src/components/ui/`):** novos `Touchable`, `Chip`, `PrimaryButton`, `TextButton`,
`SegmentedControl`, `FAB`, `IconTile`, `ColorPicker`, `DateField`, `DueChip`, `ProgressRing`, `FormField`,
`FormFooter`; reescritos `ScreenHeader`, `Card`, `Input`, `ChoiceChip`, `EmptyState`, `IconPicker`,
`DatePicker`, `ProgressBar`, `ListItem`, `ListSkeleton`, `SubjectChip`; removidos `Button`, `Badge`,
`DashCard`, `LineChart`, `Monogram`, `DonutChart`, `DateInput`.

**Componentes por tela:** `DashboardPage/` (novos `Greeting`, `ProgressSummaryCard`, `UpcomingList`,
`NextAssessmentCard`; removidos `DueSoonCard`, `NextAssessmentRow`, `SubjectProgressRow`, `SectionLabel`),
`SubjectsPage/SubjectCard`, `ActivitiesPage/` (novo `PeriodSection`; `SegmentedFilter` removido em favor do
`SegmentedControl` do kit), `AssessmentsPage/` (novo `AssessmentCard`).

**Telas:** `src/screens/{DashboardPage,SubjectsPage,ActivitiesPage,AssessmentsPage,SubjectFormPage,ActivityFormPage,AssessmentFormPage}/index.tsx`,
`src/app/(tabs)/_layout.tsx`.

**Docs:** ADR-0009 (novo), ADR-0006 (marcado substituído), `docs/design/visual-identity.md`,
`docs/architecture/domain-model.md`, `docs/architecture/screens-and-navigation.md`,
`docs/requirements/non-functional-requirements.md`, `docs/features/README.md`, `CHANGELOG.md`,
`docs/specs/2026-10-07-slice-6-improvements/spec.md` (histórico de reversão).

## Riscos e tratamento

| Risco | Tratamento |
|---|---|
| `Subject.color` quebra registros legados | `migrateSubjects` preenche `undefined` com `null` na leitura (mesma técnica de `hour`/`icon`); `color` inválido cai em `null` na UI, nunca quebra a tela (RNF-04) |
| `color` fora da paleta vindo do storage (JSON não confiável) | `resolveSubjectColor()` no tema devolve o tom ou o fallback; a tela nunca usa hex cru |
| Regressão de contraste | texto primário `#F5F5F7` sobre `#0B0B0F` (~18:1); secundário `#A1A1AA` (~8:1); placeholder/terciário `#6B6B76` (~4.6:1) — registrado em `visual-identity.md` |
| Reanimated/LayoutAnimation indisponível | transições só com `Animated` do RN (sem lib nova, funciona no Expo Go) |
| Sombra na FAB | RNF-01 proíbe `shadow*`; a FAB usa `surface-raised` + hairline de 1px, sem `elevation` nem `shadow*` — limitação registrada |

## Verificação

- Gates: `npx tsc --noEmit` e `npx expo lint` (limpos, sem warning novo) ao fim de cada bloco e no fim.
- Manual (Expo Go, Android): roteiro em `tasks.md` §Checklist de AC.
- Nenhuma dependência nova (nada de `npx expo install` nesta spec).