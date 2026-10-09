# Features — Studia

Divisão do produto em features. Cada feature terá **uma especificação própria** (`spec.md`), escrita a
partir do [`_template-spec.md`](_template-spec.md) **antes** de qualquer implementação (Regra 3 do
[`.clinerules`](../../.clinerules)).

## Catálogo proposto

| Feature | Escopo | RF atendidos | Depende de | Spec de execução | Status |
|---|---|---|---|---|---|
| `ui-kit/` | Componentes reutilizáveis (≥3 exigidos pelo roteiro), tokens de tema, estados vazios/erro | base de RNF-01, RNF-02, RNF-05 | — | [slice 1](../specs/2026-10-07-slice-1-navigation-uikit/spec.md) · [visual refresh](../specs/2026-10-08-visual-refresh/spec.md) | **Implementada** — [spec/ui-kit/spec.md](ui-kit/spec.md) |
| `subjects/` | CRUD de matérias + validação do formulário (o "formulário com validação" da Etapa 4) | RF-01, RF-02, RF-03 | ui-kit | [slice 2](../specs/2026-10-07-slice-2-subjects/spec.md) | Proposta — spec não escrita |
| `activities/` | CRUD de atividades, filtros por situação, ordenação por prazo, conclusão | RF-04, RF-05, RF-06, RF-07 | subjects, ui-kit | [slice 3](../specs/2026-10-07-slice-3-activities/spec.md) | Proposta — spec não escrita |
| `assessments/` | Cadastro/listagem de avaliações, situação agendada/realizada | RF-08 | subjects, ui-kit | [slice 4](../specs/2026-10-07-slice-4-assessments/spec.md) | Proposta — spec não escrita |
| `dashboard/` | Painel inicial com agregados e progresso | RF-09 | subjects, activities, assessments, ui-kit | [slice 5](../specs/2026-10-07-slice-5-dashboard/spec.md) | Proposta — spec não escrita |
| `reminders/` | Lembrete **local** de prazo (1 dia antes, 08:00) em atividades e avaliações | RF-04, RF-08 (datas), RNF-03 (offline) | activities, assessments, ui-kit | [slice 8](../specs/2026-10-09-slice-8-reminders/spec.md) | **Implementada** — [spec/reminders/spec.md](reminders/spec.md) |
| `filters/` | Busca textual (sem acento) e filtro por matéria nas três listas | RF-04/06/08 (apresentação), RNF-02 (escala) | subjects, activities, assessments, ui-kit | [slice 7](../specs/2026-10-09-slice-7-search-filters/spec.md) | **Implementada** — [spec/filters/spec.md](filters/spec.md) |

> Expansões pós-MVP pedidas pelo dono (2026-10-07/08) que **não** viraram feature nova: carga horária +
> ícone por matéria ([slice 6](../specs/2026-10-07-slice-6-improvements/spec.md)) e dashboard em
> cards/gráficos pertencem a `subjects`/`dashboard` (specs de execução próprias; a camada de feature
> permanente dessas duas ainda não foi escrita).

> **A camada `features/<slug>/spec.md` (contrato permanente) será escrita quando a feature for
> implementada** — hoje ela só existe em forma de spec de execução fatiada (slice 0–5) e dos prompts de
> implementação ([../execution-prompts.md](../execution-prompts.md)). Use o
> [`_template-spec.md`](_template-spec.md) como base da spec de feature ao fechar cada slice (Regra 7).

## Por que esta divisão

- **Uma feature por entidade agregada** (subjects/activities/assessments) segue o domínio de 3 entidades e
  mantém specs pequenas e verificáveis.
- **`ui-kit` separada** porque o roteiro exige componentes reutilizáveis usados em múltiplas telas — ela
  é pré-requisito transversal, não parte de uma tela específica.
- **`dashboard` separada** porque é a única feature que compõe leitura das três coleções — seu risco está
  em agregação/atualização, mérito de spec própria.
- Nenhuma feature adicional foi criada por cosmética: login, calendário e notas estão classificadas em
  [product-brief.md](../product-brief.md) §7 como pós-MVP/descartadas.
- **`reminders` não é notificação genérica**: é o lembrete **local** de prazo (RF-04/RF-08), dentro do
  escopo aprovado. O que está fora de escopo é o **push remoto** e a notificação personalizável — ver
  [product-brief.md](../product-brief.md) §8.

## Ciclo de vida de uma spec

```mermaid
flowchart LR
    A["Rascunho da spec"] --> B["Aprovação<br/>(usuário/dupla)"]
    B --> C["plan + tasks<br/>(docs/specs/)"]
    C --> D["Implementação<br/>(src/)"]
    D --> E["Verificação dos CAs"]
    E --> F["spec marcada Implementada<br/>+ registro final"]
    E -->|"CA não atingido"| C
```

**Estados da spec:** `Proposta` → `Aprovada` → `Implementando` → `Implementada` → (ou `Superada`).
Mudança de escopo durante implementação: atualizar a spec primeiro, com justificativa (Regra 3).
