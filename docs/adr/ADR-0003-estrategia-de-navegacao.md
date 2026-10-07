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

- **4 abas** (bottom tabs, já existentes no scaffold): Painel, Matérias, Atividades, Avaliações;
- **3 rotas de pilha/modal** sobre as abas: formulários de Matéria, Atividade e Avaliação, criadas em
  um grupo `(forms)` ou como rotas push (definir na spec de `ui-kit`).

O fluxo de tela do roteiro (item 4) é implementado em
[screens-and-navigation.md](../architecture/screens-and-navigation.md); rotas concretas listadas ali em
"Notas de implementação".

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
