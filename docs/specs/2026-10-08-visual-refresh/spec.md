# Spec — Refactor visual: identidade escura com acento e UI kit unificado

| Campo | Valor |
|---|---|
| **Data** | 2026-10-08 |
| **Feature** | `ui-kit` (transversal) + refactor das 7 telas |
| **RF/RNF** | RF-01…RF-09 (apresentação), RNF-01, RNF-02, RNF-03, RNF-05 |
| **ADRs** | **Substitui ADR-0006** (monocromático) por ADR-0009; mantém 0004, 0007 |
| **Risco (Regra 6)** | **médio** — quebra de contrato (`Subject` ganha `color`), deleção de componentes em uso, mudança visual em 7 telas |

## Objetivo

Trocar a identidade monocromática por uma identidade **escura, minimalista e premium** (referências de
layout: Linear e Things), com **uma cor de destaque** (índigo) e **cores semânticas** restritas, e
recompor as 7 telas sobre um **UI kit único** (tokens + componentes reutilizáveis), sem alterar a lógica
de domínio, os repositórios ou a estrutura das coleções.

## Conflitos com documentação aprovada (resolvidos com o dono em 2026-10-08)

| Documento | Conflito | Decisão do dono | Registro |
|---|---|---|---|
| ADR-0006 (monocromático estrito; "sem FAB"; sem campo `color`) | cor de destaque, semânticas, FAB e cor por matéria | **Substituir** ADR-0006 por ADR-0009 | ADR-0009 + ADR-0006 marcado como substituído |
| `design/visual-identity.md` §3–4 (tokens P&B, sem FAB) | paleta escura, FAB, chips de prazo com cor | Reescrever o documento | `docs/design/visual-identity.md` |
| `domain-model.md` (`Subject` sem `color`) | seletor de cor por matéria | **Adicionar** `color: string \| null` (validade restrita à paleta de 8 tons) | `docs/architecture/domain-model.md` |
| `screens-and-navigation.md` T1/T2/T3/T5 (conteúdo das telas, "sem cor" nos estados) | nova composição do painel/cards/listas | Atualizar por tela | `docs/architecture/screens-and-navigation.md` |
| Slice 6 — CA-6.5(c) (gráfico de linha semanal no painel) e CA-6.3 (digitar a data) | painel novo não tem gráfico; campo de data abre o picker ao tocar | **Reverter** CA-6.5(c) e a digitação manual da data (mantidos: rosca, barra, picker que persiste) | `docs/specs/2026-10-07-slice-6-improvements/spec.md` (Histórico) |

> **Engrenagem de configurações:** o dono do projeto confirmou que **não há tela de configurações** no
> escopo; o `ScreenHeader` ganha a estrutura (título à esquerda + ações à direita, ícone 20px sem fundo
> circular) mas **nenhum botão de configurações é adicionado** (Regra 9.4 — nada de controle inerte).

## Tokens (fonte única: `src/constants/theme.ts` + `src/styles/global.css` + `tailwind.config.js`)

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0B0B0F` | fundo de tela |
| `surface` | `#15151B` | cards, linhas, tab bar |
| `surface-raised` | `#1C1C24` | superfície elevada (campo, chip selecionado, item ativo) |
| `border` | `#23232C` | hairline de card/separador |
| `text` | `#F5F5F7` | texto primário |
| `text-secondary` | `#A1A1AA` | apoio |
| `text-tertiary` | `#6B6B76` | legendas, placeholder, item inativo |
| `accent` | `#6366F1` | ação principal, item ativo da tab bar, progresso, foco de input |
| `success` / `warning` / `danger` | `#34D399` / `#FBBF24` / `#F87171` | semânticas (concluído, prazo próximo, atrasado/erro) |

- **Paleta de matéria (8 tons)** em `SUBJECT_COLORS`: índigo, violeta, rosa, laranja, âmbar, verde, ciano,
  coral — cada tom com `value` e `soft` (fundo tingido do `IconTile`).
- **Espaçamento** escala 4 (4/8/12/16/24/32); padding lateral de tela **20**; gap entre cards 12–16.
- **Raio:** card 16, campo/botão 12, chip 8.
- **Tipografia:** título de tela 28/700, título de card 17/600, corpo 15/400, legenda 12/600 com
  letterSpacing 0.4. Máximo de 3 pesos: 400, 600, 700.
- **Inputs:** altura mínima 52, placeholder `text-tertiary`, borda de foco `accent`.
- **Toque:** alvo mínimo 44×44; feedback `scale 0.97` + opacidade em todo pressable.
- Tema **único (escuro)**: `userInterfaceStyle: "dark"`, sem bloco `prefers-color-scheme` (o app deixa de
  ser claro/escuro automático — registrado no ADR-0009).

## Contratos de dados

### `src/domain/models.ts` — quebra de contrato

```ts
export interface Subject {
  // …campos atuais…
  color: string | null; // tom da paleta de 8 (SUBJECT_COLORS) ou null = sem cor escolhida
}
```

- `validation.validateSubject`: `color` fora da paleta → `errors.color = 'Escolha uma cor da paleta.'`.
- `storage/subject.repository.ts`: `migrateSubjects` preenche `color === undefined` com `null` (mesma técnica
  já usada para `hour`/`icon`) e normaliza valor fora da paleta para `null`.
- `hooks/use-subjects.ts`: `saveSubject` grava `color`.

### `src/hooks/use-dashboard.ts`

- `summary.upcoming: Activity[]` — até 3 atividades **pendentes** em `sortActivities` (prazo primeiro).
- `summary.dueThisWeek: number` — pendentes com prazo dentro da janela de 7 dias (sem o corte de 3 itens).
- Removidos por ficarem sem consumidor: `weeklyCompleted`, `summary.dueSoon`, `summary.pendingTotal` e
  `subjectProgress` (o gráfico de linha saiu do painel — reversão de CA-6.5(c)).

## UI kit (`src/components/ui/`)

| Componente | Papel |
|---|---|
| `Touchable` | primitivo de toque: `scale 0.97` + opacidade, alvo ≥44 |
| `ScreenHeader` | título à esquerda, ações à direita em linha (ícone 20px, sem fundo circular), voltar opcional |
| `Card` | `surface` + hairline + raio 16; opcionalmente pressable; variante `raised` |
| `Chip` | chip de exibição (prazo, tipo) com tom `neutral/accent/warning/danger/success` e `dotColor` |
| `ChoiceChip` | chip de **seleção** (matéria, tipo) com estado selecionado em destaque |
| `Input` | rótulo 12 acima (gap 8), campo 52+, foco em destaque, erro/aviso |
| `PrimaryButton` | ação principal em destaque, altura 52 |
| `TextButton` | ação secundária/destrutiva em texto (`danger` para excluir) |
| `SegmentedControl` (+ `FadeIn`) | filtro único (Pendentes/Todas/Concluídas) e transição de opacidade |
| `EmptyState` | ícone lucide 40 + título + apoio + botão primário, centralizado |
| `FAB` | botão flutuante circular 56 em destaque, acima da tab bar |
| `IconTile` | quadrado 44 com fundo tingido na cor da matéria + ícone 22 (ou monograma) |
| `IconPicker` | grade 6 colunas × 12 ícones de estudo (inline, sem modal) |
| `ColorPicker` | 8 bolinhas da paleta, alvo 44 |
| `DateField` | campo **pressable** que abre o `DatePicker` + atalhos Hoje/Amanhã/Próxima semana |
| `DatePicker` | calendário mensal em `Modal` nativo (mesma lógica, visual novo) |
| `DateBlock` | bloco de data 56 (dia grande, mês pequeno) do card de avaliação |
| `DueChip` | chip de prazo com urgência (urgente/alerta/neutro) |
| `ProgressRing` | anel de progresso em destaque (`lg` para o painel) |
| `ProgressBar` | barra fina, cor configurável (cor da matéria) |
| `SubjectChip` | chip de matéria com bolinha da cor |
| `FormField` / `FormFooter` | rótulo + conteúdo; rodapé fixo (Salvar/Excluir/Cancelar) |
| `ListItem` / `Divider` / `ListSkeleton` | lista com separador sutil, hairline, skeleton |

**Removidos (sem consumidor após o refactor):** `Button`, `Badge`, `DashCard`, `LineChart`, `Monogram`,
`DonutChart`, `DateInput`, `SegmentedFilter`, `DueSoonCard`, `NextAssessmentRow`, `SubjectProgressRow`,
`SectionLabel`, `use-theme`, `use-color-scheme`.

## Telas

- **T1 Painel:** (a) saudação curta + data; (b) card principal com anel de progresso à esquerda e, à
  direita, "X de Y concluídas" e "N vencem esta semana"; (c) lista "Próximos prazos" com as 3 próximas
  atividades (título, matéria, chip de prazo por urgência); (d) próxima avaliação, se existir. Sem dado:
  estado vazio com atalho para criar matéria. Sem texto repetido.
- **T2 Matérias:** card com `IconTile` 44 tingido, nome, professor, "N pendentes · N avaliações" e barra de
  progresso na cor da matéria; card inteiro pressable abrindo a edição; FAB de criação.
- **T3 Atividades:** `SegmentedControl` (Pendentes/Todas/Concluídas); agrupamento por período (Atrasadas,
  Hoje, Esta semana, Depois e Sem prazo quando houver item sem prazo); item com checkbox circular animado,
  título em até 2 linhas, matéria com bolinha da cor, chip de prazo à direita; padding vertical 14 +
  separador sutil; fade na troca de filtro.
- **T4 Avaliações:** card com bloco de data à esquerda, título, matéria e contagem regressiva; estado vazio
  com ícone de calendário; FAB.
- **T5/T6/T7 Formulários:** rótulos 12px com 8px de distância e 20 entre grupos; `Salvar` fixo no rodapé em
  destaque; `Excluir` como texto vermelho discreto com `Alert` de confirmação; `Cancelar` secundário.
  - T5: `Input`s + grade de 6 colunas de ícones + `ColorPicker`.
  - T6: matéria em `SubjectChip` coloridos horizontais; tipo em chips com ícone que quebram linha; prazo em
    `DateField` com atalhos; descrição com altura mínima 100.
  - T7: mesmo padrão de T6, sem tipo/descrição, com `DateField` e atalhos.

## Critérios de aceitação

**Verificação automática** (executada em 2026-10-08):

- [x] CA-V.1 Nenhum hex fora de `src/constants/theme.ts`, `src/styles/global.css` e
  `tailwind.config.js` (conferido por busca textual).
- [x] CA-V.12 `npx tsc --noEmit` (0 erros), `npx expo lint` (0 erros/0 warnings) e
  `npx expo export --platform web` (13 rotas estáticas renderizadas) limpos.

**Verificação manual** (Expo Go / Android — pendente, registrada em `tasks.md`):

- [ ] CA-V.2 Todas as 7 telas usam o mesmo `ScreenHeader`, `Card`/`ListItem`, `EmptyState` e tokens; nenhum
  JSX de card/linha dentro do `index.tsx` de uma tela.
- [ ] CA-V.3 Header sem sobreposição de ações; ação de criação via FAB nas 3 listas.
- [ ] CA-V.4 Estado vazio com ícone 40px, título, apoio e botão primário nas listas e no painel.
- [ ] CA-V.5 Feedback de toque em todo pressable (escala 0.97/opacidade) e transição de filtro.
- [ ] CA-V.6 Tab bar flutuante com `surface`, borda sutil, item ativo em destaque com label e inativos em
  `text-tertiary`.
- [ ] CA-V.7 Campo com altura ≥52, placeholder visível (`text-tertiary`) e foco em destaque.
- [ ] CA-V.8 Matéria salva com cor da paleta; matéria legada (sem `color`) abre sem erro e sem cor;
  `color` fora da paleta é rejeitado com mensagem de campo.
- [ ] CA-V.9 Painel: 4 blocos sem texto repetido; sem dados, estado vazio com atalho.
- [ ] CA-V.10 Atividades agrupadas por período na ordem Atrasadas, Hoje, Esta semana e Depois
  (→ Sem prazo quando houver item sem prazo: extensão documentada, preserva a ordem exigida).
- [ ] CA-V.11 Campos de data abrem o picker ao tocar e os atalhos Hoje/Amanhã/Próxima semana funcionam.

## Fora de escopo

- Tema claro (o app passa a ser **escuro único**); tela de configurações; sincronização em nuvem;
  notificações; grade de ícones com upload de imagem; cores por atividade.