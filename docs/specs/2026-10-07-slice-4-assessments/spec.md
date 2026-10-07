# Spec — Slice 4: Avaliações (assessments)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `assessments` |
| **RF/RNF** | RF-08; RNF-04/06 |
| **ADRs** | 0004, 0005, 0006 |
| **Risco** | baixo-médio (espelha subjects/activities; sem nota — OQ-04 definitiva) |

## Objetivo

Cadastro/listagem de avaliações com data obrigatória e situação agendada/realizada.

## Critérios de aceitação

- AC-4.1 `use-assessments.ts` com CRUD; ordenação `agendada` antes de `realizada`, por `date`.
- AC-4.2 T4 lista: título, monograma+matéria, data relativa; realizada = `textTertiary` + linha
  tracejada; toggle agendada↔realizada persistindo (CA-08.4 histórico visível).
- AC-4.3 T7 formulário: título, matéria (chips) e data **obrigatórios**; data passada → aviso
  não-bloqueante; excluir com confirmação.
- AC-4.4 Agregado "N avaliações agendadas" no card da matéria atualiza ao criar/excluir.
- AC-4.5 Persistência ciclo fechar/reabrir; tsc + lint limpos.

## Fora de escopo

Nota/média (descartada), painel (slice 5).
