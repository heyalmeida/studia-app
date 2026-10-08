# Plano — Slice 6: Melhorias (expansão)

| Campo | Valor |
|---|---|
| **Spec** | `./spec.md` |
| **Como executar** | prompt **P7** em `docs/execution-prompts.md` |
| **Risco (Regra 6)** | médio — quebra de contrato (`Subject` ganha `hour`/`icon`), novas dependências (pickers, gráfico) |

## Decisões já tomadas pelo planejador (sem margem para o executor)

1. **Ícone de matéria = emoji**, não upload de imagem e não set de ícones do Expo — mais prático para o aluno e sem lib extra. Exceção deliberada ao monocromático (ADR-0006), registrada na spec.
2. **Date picker** = `expo-datepicker` (core Expo, web + mobile). Não usar `react-native-datetimepicker` (quebra web).
3. **Gráficos** = `expo-charts` para os charts (web + mobile, recomendado pelo Expo). Rosca de progresso e linha semanal com `expo-charts` sempre que possível; fallback SVG puro se `expo-charts` não suportar a grade necessária.
4. **Migração de dados**: registro de Subject sem `hour`/`icon` recebe `{ hour: null, icon: null }` na primeira leitura (defesa no repositório de matérias).
5. **Lista de matérias nos formulários**: apenas o **nome** (sem Monogram e sem resumo) — conforme pedido, para simplificar a seleção.

## Branch / gates

- Branch: `development` (slice de melhoria; se houver divergência, sugerir nova branch `improvements`).
- Gates: `npx tsc --noEmit`, `npx expo lint`, `npx expo export --platform web` (os pickers e gráficos precisam passar no web).
