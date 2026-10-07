# Spec — Slice 0: Fundação (domínio + dados)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature(s)** | transversal (subjects, activities, assessments, dashboard) |
| **RF/RNF** | base de RF-01…RF-09; RNF-02/03/06 |
| **ADRs** | 0002, 0004, 0005, 0006 |
| **Risco** | médio (persistência + contratos usados por todos os slices) |

## Objetivo

Estabelecer as camadas puras (domínio) e de dados (storage/repos/notifier) do Studia, com os contratos
exactos que os próximos slices consomem. Nenhuma UI neste slice.

## Critérios de aceitação

- AC-0.1 `Subject`/`Activity`/`Assessment` tipados exatamente como `domain-model.md` (sem `color`, sem `grade`).
- AC-0.2 `validation.ts`, `monogram.ts`, `progress.ts`, `utils/date.ts`, `utils/id.ts` implementados com
  as assinaturas do prompt; mensagens de erro exatamente as dos RFs (CA citados).
- AC-0.3 `data/storage.ts`: `readCollection` defensivo (JSON inválido/não-array → `[]`),
  `writeCollection` grava lista inteira por chave (`studia.subjects|activities|assessments`).
- AC-0.4 `data/notifier.ts`: emit/subscribe de `'subjects:changed' | 'activities:changed' | 'assessments:changed'`.
- AC-0.5 `domain/repositories.ts` com `Repository<T>`; três implementações em `src/data/*.repository.ts`.
- AC-0.6 Dependência única nova: `@react-native-async-storage/async-storage` via `npx expo install`.
- AC-0.7 `npx tsc --noEmit` e `npx expo lint` limpos.

## Fora de escopo

Hooks, componentes, telas, testes automatizados (sem Jest no scaffold — ver RNF-03 nota).
