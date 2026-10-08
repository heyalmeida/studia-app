# Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Fixed — Layout e espaçamento no Expo Go: `StyleSheet` no lugar de `className` (2026-10-08)

O `className` do NativeWind **não é aplicado no Expo Go** — o `react-native-css-interop` é módulo
nativo e exige dev build —, então todo o espaçamento das telas aparecia colapsado. A entrega converte a
camada de apresentação para `StyleSheet` com valores numéricos, mantendo a mesma identidade visual
(ADR-0009) e a mesma fonte de tokens. Decisão registrada no
[ADR-0010](docs/adr/ADR-0010-estilo-stylesheet-expo-go.md), que **substitui** o
[ADR-0007](docs/adr/ADR-0007-estilo-nativewind.md). Spec:
[2026-10-08-expo-go-layout](docs/specs/2026-10-08-expo-go-layout/spec.md).
**Nenhuma regra de domínio, persistência ou dado mudou** — nenhum arquivo em `src/domain`,
`src/storage` ou `src/hooks` foi tocado.

- **FAB** (`src/components/ui/FAB.tsx`): `position: absolute`, `right: 20` e
  `bottom = TAB_BAR_HEIGHT + insets.bottom + 16`. A tela do React Navigation é `absoluteFill` dentro
  do `Tabs`, então ela passa **por baixo** da barra flutuante e o botão ficava escondido atrás dela.
  Círculo 56/raio 28, `Plus` 24 branco e `elevation: 6` — **exceção única** à regra "sem sombras" do
  ADR-0009, registrada no ADR-0010 §3.
- **Listas** (`SubjectsPage`, `ActivitiesPage`, `AssessmentsPage`): `paddingBottom` de
  `listBottomInset(insets.bottom)` (tab bar + folga + FAB + folga), então a última linha não fica sob
  o botão. `DashboardPage` usa `contentBottomInset(insets.bottom)`, que não tem FAB.
- **Rodapé dos formulários** (`FormFooter`): `position: absolute` nas três bordas inferiores, com
  Salvar em largura total e **Cancelar** e **Excluir** lado a lado embaixo; as telas compensam com
  `insets.bottom + FORM_FOOTER_HEIGHT` no `paddingBottom` do `ScrollView`.
- **Botão "+ Nova …"** (`src/components/ui/CreateButton.tsx`, novo): `Plus` 18 + rótulo 16/600. No
  header, na mesma linha do título; no estado vazio, em versão grande.
- **`ScreenHeader`**: linha única, título 28 bold e prop `onBack` com botão 44/raio 22; `actions` saiu
  por não ter consumidor.
- **Data** (`DateField` + `DatePicker`): campo ao lado de um botão de calendário 52×52; o calendário
  virou **folha inferior** (raio 24 no topo, safe area inferior, ações Limpar/Hoje/Fechar).
- **Inputs** (`Input`, `FormField`, `IconPicker`, `ColorPicker`): 52px de altura, raio 12, texto 16,
  placeholder visível, foco na cor de destaque, descrição multilinha com 110px.
- **Tokens** (`src/constants/theme.ts`): `SAFE_GAP`, `TAB_BAR_HEIGHT`, `FORM_FOOTER_HEIGHT`, helpers
  `listBottomInset()`/`contentBottomInset()`, escala 16px (`Typography.field`/`button`), `Radius.button`
  14, `Typography.metric`/`day` e `Palette.shadow` (espelhados em `tailwind.config.js`).
- **Tab bar** (`src/app/(tabs)/_layout.tsx`): `StyleSheet` explícito para a altura bar casar com
  `TAB_BAR_HEIGHT`, de onde sai o `bottom` do FAB.
- **`Card` e `Touchable`**: `className`/`contentClassName` substituídos por `style`/`contentStyle`;
  `Touchable` passou a aplicar opacidade 0.7 + escala 0.97 em **todo** alvo tocável.
- Gates: `npx tsc --noEmit` e `npx expo lint` limpos. Validação visual no Expo Go **não executada**
  (depende de dispositivo).

### Changed — Identidade visual escura com destaque + UI kit unificado (2026-10-08)

Direção **Linear/Things**: fundo `#0B0B0F`, superfícies em tom, **uma** cor de destaque (índigo
`#6366F1`) e três semânticas (sucesso/alerta/urgente). Tema **único** (escuro) e sem sombra —
registrados em [ADR-0009](docs/adr/ADR-0009-identidade-visual-escura-com-destaque.md), que **substitui**
o [ADR-0006](docs/adr/ADR-0006-identidade-visual-monocromatica.md) (monocromático, "sem FAB"), por decisão
do dono. Spec: [2026-10-08-visual-refresh](docs/specs/2026-10-08-visual-refresh/spec.md).
> A camada de estilo foi depois portada para `StyleSheet` por causa do Expo Go — ver
> [ADR-0010](docs/adr/ADR-0010-estilo-stylesheet-expo-go.md) e a entrada "Layout e espaçamento no
> Expo Go" acima.

- **Tokens em arquivo único** (`src/constants/theme.ts` + `global.css` + `tailwind.config.js`):
  escala de espaçamento de 4, raio 16/12, tipografia 28/17/15/12 com no máximo 3 pesos, alvos de toque
  44×44. `Colors`/`useTheme` (light/dark) removidos; `userInterfaceStyle` passou a `dark`.
- **UI kit** (`src/components/ui/`): `Touchable` (feedback de escala 0.97 + opacidade), `ScreenHeader`
  (título + ações na mesma linha, sem sobreposição), `Card`, `Chip`, `ChoiceChip`, `Input` (altura 52,
  placeholder visível, foco no destaque), `PrimaryButton`, `TextButton`, `SegmentedControl` (+`FadeIn`),
  `EmptyState` (ícone 40 px), `FAB` (56 px), `IconTile`, `IconPicker` (grade 6×12 inline),
  `ColorPicker`, `DateField` (abre o calendário ao tocar + atalhos), `DateBlock`, `DueChip`,
  `ProgressRing`, `ProgressBar` (cor por matéria), `SubjectChip`, `FormField`, `FormFooter`.
  Removidos por ficarem sem consumidor: `Button`, `Badge`, `DashCard`, `LineChart`, `Monogram`,
  `DonutChart`, `DateInput`, `SegmentedFilter`, `DueSoonCard`, `NextAssessmentRow`, `SubjectProgressRow`,
  `SectionLabel`.
- **Painel:** os 3 cards redundantes viraram 4 blocos — saudação + data, anel de progresso com
  "X de Y concluídas" e "N vencem esta semana", lista "Próximos prazos" (3 próximas atividades com chip
  de prazo) e a próxima avaliação. O gráfico de linha semanal saiu (reversão de CA-6.5(c) do Slice 6).
- **Matérias:** cards com ícone em quadrado 44 tingido na cor da matéria, nome, professor,
  "N pendentes · N avaliações" e barra de progresso na cor; card inteiro pressable; FAB de criação.
- **Atividades:** filtro em controle segmentado único, agrupamento por período (Atrasadas → Hoje →
  Esta semana → Depois → Sem prazo), checkbox circular animado, título em até 2 linhas, matéria com a
  bolinha da cor e chip de prazo por urgência; transição suave ao trocar de filtro.
- **Avaliações:** cards com bloco de data (dia grande, mês pequeno), título, matéria e contagem
  regressiva; estado vazio com ícone de calendário.
- **Formulários:** rótulos 12 px com 8 px de distância e 20 entre grupos; rodapé fixo com Salvar na cor
  de destaque, Excluir em texto vermelho com confirmação e Cancelar secundário; matéria com seletor de
  8 cores e grade de ícones; chips de matéria coloridos e chips de tipo com ícone; data abre o picker ao
  tocar (o botão "escolher" e a digitação manual saíram); descrição com altura mínima 100.
- **Tab bar:** flutuante com `surface` + hairline, item ativo no destaque com label, inativos em
  `#6B6B76`.
- Gates: `npx tsc --noEmit`, `npx expo lint` e `npx expo export --platform web` limpos.

### Added — Cor por matéria (2026-10-08)

- **`Subject.color`** (`string | null`): tom da paleta de 8 (`SUBJECT_COLORS`) escolhido no formulário.
  Validado no domínio (`validateSubject`), persistido em `use-subjects` e normalizado na leitura
  (`migrateSubjects`): registro antigo sem `color` abre sem cor e valor fora da paleta vira `null`
  (RNF-04). Registro em [docs/features/ui-kit/spec.md](docs/features/ui-kit/spec.md).

### Added — MVP completo: os 6 slices (2026-10-07)

- Slice 0 — fundação: `src/domain/` (models, date, monogram, progress, validation, sorting) e
  `src/storage/` (AsyncStorage defensivo, notifier pub/sub, 3 repositórios). 100% local (ADR-0002).
- Slice 1 — navegação + UI Kit: 4 abas em `(tabs)`, 3 formulários modais, tokens monocromáticos
  light/dark (ADR-0006/0007) e kit `src/components/ui/` (12 componentes reutilizáveis).
- Slice 2 — matérias (RF-01/02/03): lista de cards com agregados e barra de progresso, formulário com
  validação de nome obrigatório/único e exclusão bloqueada com filhos.
- Slice 3 — atividades (RF-04/05/06/07): filtros pendentes/todas/concluídas, ordenação por prazo, conclusão
  com `completedAt`, prazo opcional com máscara DD/MM/AAAA e aviso não-bloqueante de data passada.
- Slice 4 — avaliações (RF-08): lista ordenada (agendadas por proximidade, realizadas por data desc),
  situação agendada↔realizada preservando histórico e **data obrigatória** (sem nota — OQ-04).
- Slice 5 — painel inicial (RF-09): pendências, próximas avaliações e progresso (geral + top 3 matérias),
  só leitura das 3 coleções, recomposto via notifier a cada escrita em qualquer aba.

Gates de todos os slices: `npx tsc --noEmit` e `npx expo lint` limpos.

### Changed — Estrutura por tela em pastas + componentes por tela (2026-10-07, ADR-0008 revisado)

- **`src/screens/<Tela>Page/index.tsx`**: cada tela agora é uma pasta (DashboardPage, SubjectsPage,
  ActivitiesPage, AssessmentsPage, SubjectFormPage, ActivityFormPage, AssessmentFormPage) — as telas
  ficam autoevidentes para leitura/apresentação; default export renomeado para `<Tela>Page`.
- **`src/components/<Tela>Page/`**: SubjectCard (SubjectsPage), ActivityRow + SegmentedFilter
  (ActivitiesPage) extraídos dos `index.tsx` das telas.
- **Kit `ui/` promovido**: `ChoiceChip` (chips de seleção, usado em 2+ formulários) e `ListSkeleton`
  (skeleton de loading, usado em 3 listas) saíram da duplicação por tela para `src/components/ui/`.
- **Domínio**: máscara de data `maskDDMMYYYY` movida para `src/domain/date.ts` (era função local
  duplicada na tela).
- **Anti-repetição**: convenção codificada em ADR-0008 (seção "Regra anti-arquivo-solto"),
  `.clinerules` Regra 4.2/4.2b, árvore de `architecture.md` e regras transversais dos prompts; P4/P5
  reescritos para a nova estrutura; P6 ganha checagem de conformidade estrutural.
- Gates: tsc, expo lint e `expo export --platform web` limpos.

### Changed — Estrutura de pastas alinhada ao roteiro (2026-10-07, ADR-0008)

- **`src/screens/`** criado: implementação das 7 telas (dashboard, subjects, activities, assessments,
  subject-form, activity-form, assessment-form). `src/app/` agora contém só layouts + rotas-finas
  (re-export de 1 linha) — fica explícito "quais são as telas" e a estrutura conversa com o roteiro
  (Etapa 2, item 5).
- **`src/data/` → `src/storage/`** (nome literal do roteiro); **`src/global.css` →
  `src/styles/global.css`**. Imports `@/data/*` atualizados; `metro.config.js` aponta para o novo CSS.
- ADR-0004 marcado como parcialmente substituído (nomes); grafo de camadas/DIP permanece.
- Sincronização: architecture.md (árvore + tabela roteiro↔decisão), screens-and-navigation, RNF-02,
  glossário, `.clinerules` Regra 4.2, README, prompts P4/P5/P6 (novos alvos `src/screens/*`).
- Gates: tsc, expo lint e `expo export --platform web` limpos após a reorganização.

### Changed — Estilo: NativeWind + barra de abas flutuante (2026-10-07)

- **ADR-0007:** estilo do app migra de `StyleSheet`/`useTheme()` para **NativeWind v4** (Tailwind
  CSS), por pedido do dono. Tokens do ADR-0006 agora vivem em `src/global.css` (CSS vars com dark
  automático) + `tailwind.config.js` (cores/radius/spacing/fontes). Pipeline: `babel.config.js`,
  `metro.config.js`, `nativewind-env.d.ts`; dependências `nativewind` + `tailwindcss` via
  `npx expo install`.
- Migração completa: 10 componentes `src/components/ui/` e as 7 telas/rotas passam a `className`;
  `StyleSheet` residual apenas para `hairlineWidth` e dimensões dinâmicas.
- **Barra de navegação redesenhada** (pedido do dono + referência visual estilo 3): `Tabs` com
  `tabBar` customizada flutuante — pill com superfície tonal + hairline, aba ativa com ícone
  preenchido + label, inativas outline; `paddingBottom` com safe-area inferior (resolve sobreposição
  com a barra de gestos do Android); conteúdo das telas nunca fica sob a barra.
- Gates: tsc, expo lint e `expo export --platform web` limpos. Docs sincronizados: ADR-0006 (regra
  de cor), visual-identity (fonte de tokens + checklist), architecture, `.clinerules` Regra 4.10,
  regras transversais dos prompts e checklist de conformidade do P6.
- **Ao rodar após esta mudança: `npx expo start --clear`.**

### Fixed — barra de abas invisível no dispositivo (2026-10-07)

- `(tabs)/_layout.tsx` trocado de `NativeTabs` (unstable — só renderiza fallback no navegador; no
  Expo Go a barra não aparecia) para `Tabs` estável do expo-router com ícones Ionicons
  outline/preenchido e cores por token (monocromático preservado). Dependência `@expo/vector-icons`
  instalada via `npx expo install` (já vinha com o Expo). ADR-0003 e screens-and-navigation.md
  atualizados com a revisão.

### Added — Implementação (slices executados)

- Slice 0 — fundação: `src/domain/` (models, id, date, monogram, progress, validation, sorting,
  repositórios-porto) e `src/data/` (storage AsyncStorage defensivo, notifier pub/sub, 3 repositórios).
  `npx expo install @react-native-async-storage/async-storage`. (commit `ad751e8`)
- Slice 1 — navegação + UI Kit: rotas definitivas (`(tabs)` com 4 abas text-only, Stack raiz com 3
  modais de formulário), tokens monocromáticos completos em `theme.ts` (Colors/Radius/Typography), 10
  componentes `src/components/ui/`, remoção dos artefatos de demo do scaffold. (commit `12b79d2`)
- Slice 2 — matérias: `hooks/use-subjects` (agregados + bloqueio cross-repositório na exclusão),
  T2 lista de cards (monograma, métricas, barra de progresso, estados vazio/carregando/erro) e
  T5 formulário com validação inline (RF-01/02/03) com edição via `?id=` e Alert de confirmação.
  (commit `3ec06d2`)
- Slice 3 — atividades: `hooks/use-activities` (ordenação via `sortActivities`, toggle de conclusão com
  `completedAt`), T3 lista com filtro pendentes/todas/concluídas (segmented local), checkbox circular
  aninhado, Badge de prazo (`relativeLabelBR`, atrasada=inverse); T6 formulário com chips de matéria/tipo,
  máscara DD/MM/AAAA, aviso de prazo passado não-bloqueante e ponte "cadastre matéria" sem matérias
  (RF-04/05/06/07). Revisão do planejador corrigiu lookup de matéria na linha (CA-05.3) e flex do chip
  no scroll horizontal. (commit `98a1ef8`)
- Revisão do planejador nos dois slices: tsc + expo lint limpos, zero hex fora do tema, zero shadow,
  contrato de modelos respeitado (sem `color`/`grade`).

### Added — Decisões de escopo/design + plano de execução (2026-10-07, 2ª rodada)

- Decisões do dono registradas: nome **Studia** definitivo; **MVP acadêmico autocontido** (sem fase
  pós-MVP, sem ambição de startup); identidade **monocromática preto-e-branco** (light/dark) com
  monograma por matéria em lugar de cor.
- ADR-0006 (identidade visual monocromática) + `docs/design/visual-identity.md` (tokens, tipografia,
  estados sem cor, composição, checklist de conformidade, termos de pesquisa Mobbin).
- OQ-02/03/04/05/09/10/11/12/13 resolvidas em `docs/requirements/open-questions.md` (restam OQ-06/07/08 —
  contexto acadêmico).
- ADRs 0002/0004/0005 movidos para Aceito; ADR-0005 refinado: pub/sub `data/notifier.ts` em vez de
  Context global.
- `docs/execution-prompts.md` — prompts autocontidos P0–P6 (+ PR opcional de pesquisa Mobbin) para o
  executor de modelo pequeno: contratos de API por arquivo, gates (`tsc`/`expo lint`) e commits por slice.
- Specs de execução `docs/specs/2026-10-07-slice-0..5/` (spec/plan/tasks por slice).
- Sincronização de docs: `domain-model.md` sem `color`/`grade`; RF-01/03/05/08 ajustados (bloqueio de
  exclusão com filhos, monograma, nota descartada); `product-brief.md` com escopo autocontido;
  `.clinerules` atualizado para as novas regras de escopo.

### Added — Etapa 1 (planejamento e documentação; 2026-10-07)

- Product Brief do Studia com problema, público, proposta de valor, escopo aprovado e fora de escopo
  definitivo (`docs/product-brief.md`).
- Requisitos funcionais RF-01…RF-09 e não funcionais RNF-01…RNF-06 (`docs/requirements/`).
- Questões em aberto OQ-02…OQ-13 (`docs/requirements/open-questions.md`).
- Modelo de domínio: 3 entidades, chaves, relacionamentos 1:N e diagrama (`docs/architecture/domain-model.md`).
- Especificação de 7 telas e fluxo de navegação (`docs/architecture/screens-and-navigation.md`).
- Arquitetura em camadas com mapeamento Expo Router e SOLID pragmático (`docs/architecture/architecture.md`).
- ADR-0001…ADR-0005: stack, persistência, navegação, organização e gerenciamento de estado (`docs/adr/`).
- Divisão em 5 features com template de spec (`docs/features/`).
- Fluxo SDD e templates spec/plan/tasks (`docs/specs/`).
- Glossário (`docs/glossary.md`); índice documental (`docs/README.md`).
- Regras de processo para IA adaptadas ao projeto (`.clinerules`); ponteiro de regras em `AGENTS.md`;
  README do repositório reescrito para o Studia.

### Changed

- `.clinerules` substituído: era o rulebook do projeto emile-cli; adaptado ao Studia com preservação do
  espírito (SDD, sync de docs, gates de qualidade) e correção do que não se aplicava (CLI→app mobile).

## 0.0.0 — esqueleto

- Scaffold Expo SDK 57 (create-expo-app) — commit inicial do repositório.
