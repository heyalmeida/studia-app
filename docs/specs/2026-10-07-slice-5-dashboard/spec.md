# Spec — Slice 5: Painel (dashboard)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `dashboard` |
| **RF/RNF** | RF-09; RNF-06 |
| **ADRs** | 0004, 0005, 0006 |
| **Risco** | baixo-médio (agregações multi-entidade + atualização cross-screen) |

## Objetivo

Painel inicial que responde "o que vence primeiro / o que falta / o que vem por aí" — proposta de valor.

## Critérios de aceitação

- AC-5.1 T1 com três blocos: pendências (total + próximas ≤7 dias com badge de prazo), próximas
  avaliações, progresso (geral `progressSummary` + top 3 matérias com barra).
- AC-5.2 Números recompostos a partir dos três hooks (hooks já assinam notifier ⇒ painel atualiza ao
  concluir atividade em outra aba — AC do ADR-0005).
- AC-5.3 Zero dados: estado inicial "Comece cadastrando sua primeira matéria" + CTA → T5; sem divisão
  por zero ou "NaN".
- AC-5.4 Cada bloco navega (Pendências→Atividades, Avaliações→T4, Progresso→Matérias).
- AC-5.5 100% offline; tsc + lint limpos.

## Fora de escopo

Gráficos, calendário, widget, notificação.
