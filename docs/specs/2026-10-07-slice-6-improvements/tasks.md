# Tarefas — Slice 6: melhorias (carga horária, ícones, pickers, gráficos)

- [x] Executar prompt P7 de docs/execution-prompts.md na íntegra (executado na `development`, commit `974ea90`)
- [x] Gates na época: tsc + lint + export web limpos (evidência no relatório do executor à época)
- [ ] Checklist de AC da ./spec.md verificado (manual: Expo Go — **parcial**; ver nota)
  - CA-6.1 carga horária 1–200 — código confere; falta aparelho
  - CA-6.2 ícone da matéria — **deviação**: ícone virou nome de ícone lucide (IconPicker), não emoji
  - CA-6.3/6.4 pickers de data — implementados (DateField/DatePicker); falta aparelho
  - CA-6.5 dashboard com cards + gráficos — **parcial**: rosca (ProgressRing) e barra ficaram; **linha semanal revertida** no refactor visual (CHANGELOG: 'O gráfico de linha semanal saiu (reversão de CA-6.5(c) do Slice 6)')
  - CA-6.6/6.7 migração + gates — confere (migrateSubjects)
- [x] Diff revisado pelo planejador (aceito com as 2 devições abaixo, ambas documentadas e posteriores ao próprio slice)
- [x] Regras 2/7: CHANGELOG já cobre slice 6 via entradas 'feat(improvements)' + refactor visual (e4bfca0)

## Deviações registradas (o plano evoluiu depois da spec)

1. **Contrato das libs:** a spec pedia `expo-datepicker`/`expo-charts`; **não existem como descrito**.
   Executado com `@react-native-community/datetimepicker` (confirmação em docs.expo.dev/latest) e
   `expo-charts ^1.0.2` + `react-native-svg` reais no package.json. A própria spec (linhas sobre libs)
   é histórica — não reeditar.
2. **Ícone ≠ emoji:** `Subject.icon` guarda **nome de ícone lucide** (ex: 'BookOpen'), exibido em
   `IconTile` com a cor da matéria. O ADR-0009 (identidade escura com destaque, 2026-10-08) substituiu
   o monocromático da spec, tornando a exceção-emoji sem objeto; o seletor virou IconPicker de ícones.
3. **Linha semanal removida** de propósito no refactor visual (painel com menos redundância).

**Pendência remanescente:** checklist manual no aparelho (CA-6.1/6.3/6.4) — consolidado no P10.
