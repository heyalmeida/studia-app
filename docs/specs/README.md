# Fluxo SDD — docs/specs

O Desenvolvimento Dirigido por Spec é o processo de execução do Studia (Regra 3 do
[`.clinerules`](../../.clinerules)): **toda mudança de código nasce de uma pasta de spec datada aqui**.

## Estrutura

```
docs/specs/
├── README.md            ← este arquivo (o fluxo)
├── _templates/
│   ├── spec.md          ← o QUÊ (requisitos + critérios de aceitação)
│   ├── plan.md          ← o COMO (abordagem, arquivos, risco)
│   └── tasks.md         ← o FAZER (passos pequenos e verificáveis)
└── YYYY-MM-DD-<slug>/   ← uma pasta por mudança (ex.: 2026-10-15-subjects-crud)
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

## As duas camadas de spec (não confundir)

| | `docs/features/<slug>/spec.md` | `docs/specs/YYYY-MM-DD-<slug>/spec.md` |
|---|---|---|
| O que é | **Contrato permanente** da feature (o produto) | **Ordem de execução** de uma entrega (a mudança) |
| Vive enquanto | a feature existir | a mudança for implementada |
| Conteúdo | comportamento, regras, estados, CAs | mesmo domínio, recortado no lote a ser commitado + plan + tasks |

Uma feature grande pode ser executada em várias pastas `specs/` (uma por fatia commitável); a spec de
`features/` consolida o resultado.

## Ciclo (obrigatório, nesta ordem)

1. **SPEC** — copiar `_templates/spec.md` para `YYYY-MM-DD-<slug>/spec.md`; preencher o QUÊ com CAs
   rastreáveis a RF/RNF.
2. **PLAN** — `_templates/plan.md`: abordagem, arquivos tocados, camada de cada arquivo (ADR-0004),
   classificação de risco (Regra 6).
3. **TASKS** — `_templates/tasks.md`: tarefas pequenas, cada uma ligada a CA(s); nada de "implementar tudo".
4. **IMPLEMENT** — executar marcando `- [x]` somente após verificação.
5. **VERIFY** — todos os CAs verificados com evidência (comando + resultado, print do device).
6. **SYNC** — Regra 2: ADR novo se decisão; feature spec atualizada; CHANGELOG; `docs/features/README.md`.

**Sem spec aprovada → nenhum código.** Commits que mudam `src/` devem referenciar a pasta de spec no corpo
(Regra 8). Exceções triviais tipográficas: ver Regra 3.
