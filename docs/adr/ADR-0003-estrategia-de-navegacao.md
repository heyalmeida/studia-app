# ADR-0003 — Estratégia de navegação: Expo Router (abas + pilha)

| Campo | Valor |
|---|---|
| **Status** | Aceito |
| **Data** | 2026-10-07 |

## Contexto

O roteiro exige ≥5 telas navegáveis e um fluxo documentado (item 4), com navegação "utilizando a solução
trabalhada em aula". O scaffold instalado do projeto **já usa Expo Router**: `main` = `expo-router/entry`,
plugin no `app.json`, `src/app/_layout.tsx` com `AppTabs`, typedRoutes habilitado.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **`@react-navigation/native-stack`** | Padrão histórico do RN | Duas fontes de verdade de rota (arquivos + config); contradiz o scaffold e o `AGENTS.md` ("Use Expo Router for all navigation") | Rejeitada |
| **Navigator customizado (estado + switch)** | Controle total | Reinventar navegação sem ganho; não atende bem deep link/back; viola RNF-02 | Rejeitada |
| **Expo Router** | File-based = telas são o próprio mapa do fluxo; abas já prontas; typedRoutes dá segurança de rota em tempo de compilação; exigência explícita do `AGENTS.md` | Acopla estrutura de pastas ao roteador (mitigado pela regra "rotas só em `src/app/`") | **Escolhida** |

## Decisão

Navegação = **Expo Router**, com o layout real do produto:

- **4 abas** com ícone + label: `Tabs` (layout estável do expo-router, react-navigation embutido)
  em `src/app/(tabs)/_layout.tsx`; ícones `@expo/vector-icons` (Ionicons outline/preenchido,
  monocromáticos via tokens);
- **3 rotas de pilha** sobre as abas: formulários de Matéria, Atividade e Avaliação como modais
  (`presentation: 'modal'`), com `?id=` para edição.

> **Revisão de 2026-10-07:** a decisão original especificava reaproveitar `NativeTabs`
> (`expo-router/unstable-native-tabs`) do scaffold. Na prática, **NativeTabs não renderiza a barra
> no Expo Go** (a API exige módulos nativos de development build; no navegador aparece via fallback
> JS, o que mascarou o problema). A troca para o `Tabs` estável mantém a decisão-mãe (Expo Router,
> file-based, abas + pilha) e corrige o mecanismo. Registro em `docs/execution-prompts.md` (P1) e
> no CHANGELOG.

## Consequências

- **Positivas:** fluxo de navegação legível na árvore de arquivos; typed routes; zero config adicional
  (o scaffold já está); deep links grátis se um dia forem necessários.
- **Negativas:** a distinção rota-de-tela × componente fica obrigatória (Regra 4: `src/app/` só tem
  telas); a equipe precisa aceitar a convenção de grupos `(tabs)`/`(forms)` em vez de um menu de rotas
  central.
- **Risco de aula:** se a disciplina ensinar React Navigation como "a solução de aula", o professor precisa
  aceitar Expo Router (que no RN moderno *usa* React Navigation por baixo) — registrar na entrega.

## Referências

`AGENTS.md` §Navigation & Routing; `package.json`/`app.json`/`_layout.tsx` do scaffold; roteiro Etapa 1
item 4 e Etapa 3.
