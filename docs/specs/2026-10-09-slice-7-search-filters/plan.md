# Plano — Slice 7 (busca e filtro por matéria)

| Campo | Valor |
|---|---|
| **Spec** | ./spec.md |
| **Como executar** | prompt **P8** em [../../execution-prompts.md](../../execution-prompts.md) |
| **Risco (Regra 6)** | baixo — estado local + funções puras |
| **Executor** | opencode (mimo-2.6-flash / apodex-1.1-mini), sessão própria |

## Decisões do planejador (sem margem para o executor)

1. **Filtrar na tela, não no hook**: os hooks já assinam o notifier e entregam a lista ordenada;
   o filtro é `useMemo` pós-ordenação (mesmo critério do filtro de status atual em
   `src/screens/ActivitiesPage/index.tsx`). Contrato dos hooks não muda.
2. **Busca sem acento** = `normalize('NFD')` + strip `[\u0300-\u036f]` + lowercase, em
   `src/domain/text.ts` (função pura testável de mesa).
3. `SubjectFilterRow` usa chips de texto puro (nome da matéria); **sem** IconTile — o row de filtro é
   denso, ícone polui. 'Todas' = chip fixo na primeira posição (`selected === null`).
4. `FadeIn` da tela de atividades recebe key composta (`status:busca:matéria`) para animar a troca de
   QUALQUER filtro, não só o segmented.
5. Vazio pós-filtro ≠ vazio real: o 'Nenhum resultado' só aparece quando a lista original é não-vazia.
