# Spec — Slice 3: Atividades (activities)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `activities` |
| **RF/RNF** | RF-04, RF-05, RF-06, RF-07; RNF-04/06 |
| **ADRs** | 0004, 0005, 0006 |
| **Risco** | médio (datas + filtros + agregados) |

## Objetivo

CRUD de atividades com prazo, filtros e conclusão — a "lista de dados" principal do produto.

## Critérios de aceitação

- AC-3.1 `use-activities.ts`: lista ordenada por `sortActivities` (pendentes por prazo ascendente, sem
  prazo por último, concluídas após); filtro todas/pendentes/concluídas local à tela.
- AC-3.2 T3: item com título (riscado se concluída), monograma+matéria, badge de prazo com
  `relativeLabelBR` (inversão p/ atrasada, outline p/ ≤2 dias), checkbox circular que conclui/reabre
  persistindo na hora (CA-06.1: card da matéria atualiza via notifier).
- AC-3.3 T6 formulário: título obrigatório; matéria obrigatória via chips horizontais (se zero matérias,
  CTA "Cadastrar matéria" → T5, CA-04.4); tipo em segmentado; prazo opcional com máscara DD/MM/AAAA
  (inválido → erro; passado → aviso não-bloqueante); descrição opcional.
- AC-3.4 Edição abre preenchida (CA-07.1); excluir (botão na edição) com confirmação e remoção dos
  agregados (CA-07.2).
- AC-3.5 Estados vazios específicos por filtro (CA-05.4).
- AC-3.6 tsc + lint limpos.

## Fora de escopo

Painel (slice 5); navegação por notificações.
