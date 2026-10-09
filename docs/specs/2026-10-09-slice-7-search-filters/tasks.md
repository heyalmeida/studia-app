# Tarefas — Slice 7: busca e filtro por matéria

- [x] Executar prompt P8 de docs/execution-prompts.md na íntegra
- [x] Gates: `npx tsc --noEmit` + `npx expo lint` + `npx expo export --platform web` limpos (evidência no relatório do executor)
- [ ] Checklist de AC da ./spec.md verificado (manual: Expo Go — **pendente**, itens abaixo)
  - AC-7.1 busca 'calculo' acha 'Cálculo' — conferido por teste de mesa (executor) + revisão do planejador; falta aparelho
  - AC-7.2/7.3/7.4 busca + chips por tela, ordenação preservada — revisão do código confirma useMemo pós-sort
  - AC-7.5 'Nenhum resultado' + 'Limpar filtros' ≠ vazio real — código confere; falta aparelho
- [x] Diff revisado pelo planejador antes do próximo slice (commit `23c8400`, 7 arquivos, +432/−33)
- [x] Regras 2/7: docs/features/filters/spec.md criado + CHANGELOG + status da spec

## Evidência da execução e revisão

- **Arquivos:** `src/domain/{text,filtering}.ts`, `src/components/ui/{SearchField,SubjectFilterRow}.tsx`,
  3 telas (`Subjects/Activities/AssessmentsPage/index.tsx`).
- **Testes de mesa do executor:** `normalizeForSearch('Cálculo I')==='calculo i'` ✓;
  `matchesSearch('', ['x'])===true` ✓; `matchesSearch('calcul', ['Cálculo','prof'])===true` ✓.
- **Revisão do planejador (2026-10-09):** interseção aplicado depois de `sortActivities` (sem
  reordenação); `filteredToNothing = activities.length > 0 && visible.length === 0` distingue vazio
  pós-filtro do vazio real; 'Limpar filtros' reseta os três controles em Atividades; `FadeIn` com key
  composta; gates tsc/lint/export web revodados pelo planejador — todos limpos; zero `className`, zero
  hex fora dos tokens nos arquivos novos (só menções em comentários).
- **Divergência aceita (copy):** `EMPTY_STATE.todas.text` mudou de '…pelo botão flutuante.' para
  '…pelo botão ao lado do título.' — o FAB e o createAction do header coexistem (ADR-0009 §5 mantém
  o FAB como ação principal; o texto ficou menos exato). Não bloqueia; registrar se houver
  reescrita de copy no polish final.
- **Melhoria não pedida (aceita):** SearchField/SubjectFilterRow renderizam durante `loading` também
  (antes só a lista) — consistência visual, sem efeito colateral.
- **Pendente:** checklist manual no Expo Go (AC-7.1/7.2/7.5 no aparelho).
