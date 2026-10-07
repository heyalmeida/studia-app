# Spec — Slice 2: Matérias (subjects)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `subjects` |
| **RF/RNF** | RF-01, RF-02, RF-03; RNF-04/06 |
| **ADRs** | 0004, 0005, 0006 |
| **Risco** | médio (primeiro CRUD completo; valida os contratos do Slice 0 na prática) |

## Objetivo

Entregar o CRUD de matérias: lista com monograma/agregados/progresso e formulário funcional com
validação — este é o formulário com validação exigido pela Etapa 4 do roteiro.

## Critérios de aceitação

- AC-2.1 `use-subjects.ts` expõe `{ subjects, loading, error, create, update, remove }`; reage a
  `activities:changed`/`assessments:changed` para recalcular agregados.
- AC-2.2 T2 lista cards ordenados por nome (case-insensitive), com monograma, professor(a), N
  pendências, N avaliações agendadas e barra de progresso; estado vazio com CTA.
- AC-2.3 T5 cria/edita via `?id=`; validações exatas do RF-01/CA-01.x (mensagens definidas no domínio);
  sucesso → feedback + volta à lista.
- AC-2.4 `remove` bloqueia matéria com filhos (contagem cross-repositório) com mensagem exata do
  CA-03.4; sem filhos → `Alert` de confirmação antes de excluir.
- AC-2.5 Persistência: cadastrar matéria, fechar o app (Expo Go), reabrir → presente.
- AC-2.6 tsc + lint limpos.

## Fora de escopo

Atividades/avaliações reais (slices 3–4); progresso continua 0/0 até lá (não quebrar a renderização).
