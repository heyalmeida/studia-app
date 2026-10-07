# Glossário — Studia

| Termo (PT) | Termo (código EN) | Definição |
|---|---|---|
| Matéria | `Subject` | Disciplina cursada pelo estudante; agrega atividades e avaliações. |
| Atividade | `Activity` | Item de trabalho vinculado a uma matéria (tarefa, trabalho, leitura ou estudo), com prazo opcional e situação pendente/concluída. |
| Avaliação | `Assessment` | Evento avaliativo datado vinculado a uma matéria (prova, seminário, entrega), com situação agendada/realizada. |
| Prazo | `dueDate` | Data-limite de uma atividade; alimenta ordenação da lista e o painel. |
| Progresso | `progress` | Razão atividades concluídas ÷ total, por matéria ou geral. **Derivado** — nunca persistido. |
| Situação | `status` | Estado de ciclo de vida da entidade (Atividade: pendente/concluída; Avaliação: agendada/realizada). |
| Painel | `dashboard` | Tela inicial T1 com agregados da rotina. |
| UI Kit | — | Camada de componentes reutilizáveis (`src/components/ui/` + `domain/`). |
| Repositório (software) | `Repository<T>` | Interface de acesso a dados definida no domínio (porto); implementação em `src/data/` (adaptador). Não confundir com repositório Git. |
| SDD | — | Spec-Driven Development: sem spec aprovada, não há código. |
| ADR | — | Architecture Decision Record: decisão arquitetural registrada com alternativas e consequências. |
| RF / RNF | — | Requisito Funcional / Não Funcional (ver `docs/requirements/`). |
| OQ | — | Open Question — questão em aberto registrada em `docs/requirements/open-questions.md`. |
| MVP | — | Primeira versão entregável à disciplina; o que não é MVP está classificado no product brief §7. |
