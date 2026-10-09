# Tarefas — Slice 9: endurecimento e release candidate

- [x] Executar prompt P10 de docs/execution-prompts.md na íntegra (commits `cd261ae` + `d7cfb96`)
- [x] Gates: `npx tsc --noEmit` + `npx expo lint` + `npx expo export --platform web` + `npx expo-doctor` limpos — **revodados pelo planejador** (tsc 0, lint 0, export ok, doctor 21/21)
- [x] Varredura de conformidade reportada item a item (CA-9.2) — refeita pelo planejador: `className` zero; hex fora dos espelhos só em 4 **comentários** de JSDoc (CreateButton/Card/Input/DatePicker descrevendo o valor do token em prosa — aceito, não são literais renderizados); `shadow/elevation` só em FAB.tsx + `Palette.shadow` (token) + espelho CSS; AsyncStorage só em `storage.ts`; `expo-notifications` só em `services/reminders.ts`; `: any`/`@ts-ignore` zero; `function.*Screen` zero; rotas-finas = 1 linha em todos os 7 arquivos
- [x] `checklist-aparelho.md` criado e completo (CA-9.4 — 43 itens, blocos A–E, rastreável por CA; planejador corrigiu 3 linhas sem célula de resultado: C6, D8, D9)
- [ ] **Dono**: executar checklist no Expo Go (slices 6/7/8 + Etapa 6) e preencher resultados
- [x] Diff revisado pelo planejador (`cd261ae`: package.json/lock −4 libs + CHANGELOG/README; `d7cfb96`: checklist; nenhum arquivo de produto além da limpeza de deps)
- [ ] Decidir tag `v1.0.0` (ou similar) após checklist OK

## Evidência da execução

- **Deps removidas:** `expo-charts`, `expo-device`, `expo-glass-effect`, `expo-symbols` (4 órfãs
  confirmadas por grep; `glass-effect`/`symbols` permanecem transitivas do `expo-router` — fora do
  `package.json` do projeto apenas). Doctor 21/21 antes e depois.
- **Docs sync:** README 'O que o app faz' +2 bullets (busca/filtro; lembrete local); CHANGELOG
  entrada `### Removed` documentando cada lib com o motivo.
- **Ressalva estética (aceita, não bloqueia):** 4 comentários JSDoc citam o valor hex do token em
  prosa (ex.: "superfície `#15151B`"). Se a paleta mudar, esses comentários desatualizam — limpar
  em oportunidade futura, não em slice próprio.
