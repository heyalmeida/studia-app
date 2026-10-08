# Spec — Slice 6: Melhorias — carga horária, ícones, pickers de data e dashboard com gráficos

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `improvements` (expansão pós-MVP) |
| **RF/RNF** | RF-01 (matéria), RF-04 (atividade), RF-08 (avaliação), RF-09 (dashboard) |
| **ADRs** | 0004 (camadas), 0006 (monocromático — exceção para emoji/ícone), 0007 (NativeWind) |
| **Risco** | médio — mudança de modelo de dados + novas dependências (pickers, gráficos) |

## Objetivo

Ampliar o Studia com 4 melhorias de usabilidade demandadas pelo roteiro:

1. **Matérias** — campo opcional `Carga Horária` (horas/semana) + ícone visual (emoji).
2. **Atividades** — seletor de data nativo no prazo; lista de matérias simplificada (nome só, sem monograma/resumo).
3. **Avaliações** — seletor de data nativo no campo de data.
4. **Painel** — resumos por cards e gráficos (barra de progresso, rosca de conclusão, linha semanal de atividades concluídas), substituindo as listas compactas.

## Contratos de dados

### src/domain/models.ts — alteração de contrato (BREAKING em relação aos Slices 0–5)

```typescript
export interface Subject {
  id: string;
  name: string;
  teacher: string | null;
  hour: number | null;   // horas por semana (ex: 60). null = não informado
  icon: string | null;   // emoji (ex: '📚', '💻', '⚡') ou ''
  createdAt: string;     // ISO 8601 completo
}
```

Registros existentes importados do storage (sem `hour`/`icon`) devem ser migrados para `{ hour: null, icon: null }` na primeira leitura (ver `subject.repository.ts`).

**Restrições:**
- `hour`: mínimo 1, máximo 200, inteiro ou com uma casa decimal. Mensagem de erro: 'Informe uma carga horária entre 1 e 200 horas.'
- `icon`: apenas caracteres de emoji (validação regex simples `\p{Emoji_Presentation}|\p{Extended_Pictographic}` — caso o runtime não aceite `u` flag, aceitar `[^\\x00-\\x7F]`); máximo 3 caracteres; `''` tratado como nulo.

### Hooks — atualizações

- **use-subjects.ts** — props/retorno mantidos; `upsert` insere `hour`/`icon` (defaults: `null`).
- **use-activities.ts / use-assessments.ts** — sem mudança de contrato de retorno; os `input` já possuem as datas.
- **use-dashboard.ts** — manter a assinatura atual; os gráficos são presentation layer.

### Novo arquivo

- **src/components/ui/IconPicker.tsx** — grid 4 colunas × 4 linhas com 16 emojis predefinidos (`📚 📖 💻 🧮 🧪 🔬 ⚡ 🎨 🎵 🗣️ 📊 📅 🏋️ 📝 ✈️ 🌍`), selecionável; `selected` (emoji ou `''`) + `onChange(icon)`; visual monocromático (botão com `border border-border` e `bg-backgroundElement` quando deselecionado, `border border-border-strong` quando selecionado).
- **src/components/ui/DateInput.tsx** — wrapper do picker nativo (expo-datepicker para web; `@react-native-community/datetimepicker` ou `expo-datepicker` nativo para mobile). Props: `date: string | null` (ISO), `onChange: (iso: string | null) => void`, `label`, `placeholder: 'DD/MM/AAAA'`, `error?: string`, `disabled?: boolean`. Internamente converte: picker mostra `DD/MM/AAAA`, ao confirmar converte para ISO (`yyyy-MM-dd`) via `parseDDMMYYYY`/`formatDDMMYYYY`. Mantém o input de texto visível (editável manualmente) como fallback.
- **src/components/ui/DashCard.tsx** — card de dashboard: `title`, `value` (número/percentual em `text-metric`), `subtitle`, `children` (gráfico). Borda `border-border`, padding `Spacing.three`, `bg-surface`.
- **src/components/ui/DonutChart.tsx** — rosca de progresso (props: `ratio: number`, `size?: 'sm' | 'md'`). Desenho com `react-native-svg` (Path circular com `strokeDasharray`). Monocromático: traço `bg-inverse`/`text-on-inverse`.
- **src/components/ui/LineChart.tsx** — linha semanal de atividades concluídas (últimos 7 dias). Eixo simples traçado com `polyline`/`path` SVG. Se < 3 dias de dados, mostrar `0` sem gráfico.

> **Nota sobre monocromático (ADR-0006):** o emoji do ícone de matéria é uma exceção deliberada ao monocromatismo (ícone ilustrativo, não indicador de estado). O resto da interface continua 100% monocromático.

## Critérios de aceitação

- **CA-6.1** Matéria com carga horária 1–200 salva; valores fora do range rejeitados com erro de campo.
- **CA-6.2** Ícone de matéria visível ao lado do nome (SubjectsPage, ActivityFormPage matéria, AssessmentFormPage matéria, Dashboard cards).
- **CA-6.3** Atividades: prazo selecionado via date picker (e digitado manualmente) persiste e aparece como badge no filtro pendentes.
- **CA-6.4** Avaliações: data selecionada via date picker persiste e aparece no painel como relativa.
- **CA-6.5** Dashboard: (a) card "Concluídas" com barra de progresso full-width; (b) card de progresso geral com donut; (c) gráfico de linha "Tarefas concluídas (7 dias)"; (d) cards de próximas tarefas/avaliações (máx. 3 cada) em vez de listas.
- **CA-6.6** Dados migrados: matérias criadas nos Slices 0–5 aparecem sem erro (hour/icon = null).
- **CA-6.7** tsc + lint limpos + export web sem erro (expo-datepicker e expo-charts suportam web).

## Fora de escopo

- Sincronização em nuvem, notificações push, calendário do dispositivo.
- Edição de ícone via upload de imagem.
