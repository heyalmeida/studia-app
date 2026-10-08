# Tarefas — Slice 6: melhorias (carga horária, ícones, pickers, gráficos)

- [ ] Executar prompt P7 de docs/execution-prompts.md na íntegra (branch `improvements/slice-6` preferencial)
- [ ] Gates: `npx tsc --noEmit` + `npx expo lint` + `npx expo export --platform web` limpos (evidência no relatório do executor)
- [ ] Checklist de AC da ./spec.md verificado (manual: Expo Go)
  - CA-6.1 carga horária 1–200 aceita; fora do range rejeitada com erro de campo
  - CA-6.2 ícone/emoji da matéria aparece em SubjectsPage, forms e dashboard
  - CA-6.3/CA-6.4 pickers de data persistem e aparecem nas telas/painel
  - CA-6.5/CA-6.6 dashboard com cards + gráficos (rosca, barra, linha semanal)
  - CA-6.7 matérias antigas (Slices 0–5) migradas (hour/icon = null) sem erro
- [ ] Diff revisado pelo planejador antes de merge/release (atenção: quebra de contrato em Subject)
- [ ] Regras 2/7: atualizar docs/features/<feature>/ (criar quando implementada) + CHANGELOG + status da spec
