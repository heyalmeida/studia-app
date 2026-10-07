# Tarefas — <slug>

> Cada tarefa é pequena, verificável e rastreável a um AC. Marcar `- [x]` **somente após verificação**,
> com evidência anotada quando não trivial. Um commit (ou agrupamento coeso de commits) por tarefa quando
> fizer sentido (Regra 8).

- [ ] T1 — <domínio: tipos/entidades> (AC-…)
- [ ] T2 — <data: repositório/storage> (AC-…)
- [ ] T3 — <hooks de dados> (AC-…)
- [ ] T4 — <componentes> (AC-…)
- [ ] T5 — <telas/rotas> (AC-…)
- [ ] T6 — <validação + mensagens de erro> (AC-…)
- [ ] T7 — <verificação de persistência: fechar/reabrir app> (AC-…)

## Evidências de verificação

| Tarefa | Comando / teste | Resultado |
|---|---|---|

## Encerramento (Regra 10)

- [ ] `npx tsc --noEmit` limpo
- [ ] `npx expo lint` limpo
- [ ] Docs sincronizadas (Regra 2)
- [ ] CHANGELOG atualizado
- [ ] Commits em `development` com escopo correto
