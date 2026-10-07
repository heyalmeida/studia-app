# Changelog

Todas as mudanças notáveis neste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

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
