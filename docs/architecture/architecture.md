# Arquitetura — Studia

| Campo | Valor |
|---|---|
| **Status** | **Aprovado** (2026-10-07) — MVP acadêmico autocontido, sem fase pós-MVP; estrutura revisada pelo ADR-0008 |
| **Decisão-mãe** | [ADR-0004](../adr/ADR-0004-organizacao-arquitetural.md) (camadas/DIP) + [ADR-0008](../adr/ADR-0008-estrutura-roteiro.md) (nomes de pastas) |
| **Ponto de partida** | Scaffold Expo SDK 57 + Expo Router já instalado (`src/app/`, `src/components/`, `src/constants/theme.ts`) |

## Princípio norte

> O tamanho do app manda. Studia é um CRUD local com 3 entidades e 7 telas. A arquitetura existe para
> separar **UI**, **regra de negócio** e **persistência** — nem para virar `App.tsx` monolítico, nem para
> imitar um enterprise. Cada pasta abaixo precisa justificar-se; a estrutura respeita os nomes do
> roteiro (Etapa 2, item 5) sempre que não conflitar com a stack.

## Estrutura de camadas

```mermaid
flowchart TD
    UI["src/screens/ (telas) + src/components/ (UI)\nconhecem apenas hooks e modelos de apresentação"]
    ROUTES["src/app/ (rotas Expo Router — arquivos-finos)"]
    HOOKS["src/hooks/ (stado de apresentação, orquestração)"]
    DOMAIN["src/domain/ (entidades, validações, regras, interfaces de repositório)"]
    STORAGE["src/storage/ (storage JSON + repositórios concretos)"]
    SERVICES["src/services/ (isolamento de SDK nativo)"]

    ROUTES --> UI
    UI --> HOOKS
    HOOKS --> DOMAIN
    HOOKS -->|"lembrete de prazo"| SERVICES
    STORAGE -.->|"implementa as interfaces"| DOMAIN
    HOOKS -.->|"recebe repositório (DIP)"| DOMAIN
```

`src/services/` é a **única** exceção permitida a essa seta: hooks chamam o serviço, o serviço
fala com o SDK nativo e **nenhum** tipo de `expo-notifications` escapa para `domain/` ou para a UI
(Slice 8, [ADR-0004](../adr/ADR-0004-organizacao-arquitetural.md) aplicado ao caso "SDK nativo").
O domínio continua sem React, sem storage e sem SDK.

Regra de dependência: **setas apontam para dentro**. Telas/hooks nunca importam `src/storage/`;
`src/domain/` não importa React nem storage.

## Árvore de arquivos (implementada — ADR-0008)

```
src/
├── app/                      # ROTAS (Expo Router) — layouts + re-exports finos, zero lógica
│   ├── _layout.tsx           # providers globais (tema) + Stack de modais
│   ├── (tabs)/
│   │   ├── _layout.tsx       # bottom tabs (Painel, Matérias, Atividades, Avaliações)
│   │   ├── index.tsx         # → screens/DashboardPage (T1)
│   │   ├── subjects.tsx      # → screens/SubjectsPage (T2)
│   │   ├── activities.tsx    # → screens/ActivitiesPage (T3)
│   │   └── assessments.tsx   # → screens/AssessmentsPage (T4)
│   ├── subject-form.tsx      # → screens/SubjectFormPage (T5)
│   ├── activity-form.tsx     # → screens/ActivityFormPage (T6)
│   └── assessment-form.tsx   # → screens/AssessmentFormPage (T7)
├── screens/                  # UMA PASTA POR TELA — <Tela>Page/index.tsx (ADR-0008)
│   ├── DashboardPage/index.tsx
│   ├── SubjectsPage/index.tsx
│   ├── ActivitiesPage/index.tsx
│   ├── AssessmentsPage/index.tsx
│   ├── SubjectFormPage/index.tsx
│   ├── ActivityFormPage/index.tsx
│   └── AssessmentFormPage/index.tsx
├── components/               # componentes por tela (≥3 reutilizáveis exigidos pelo roteiro)
│   ├── ui/                   # kit usado em ≥2 telas: Button, Input, Card, ListItem, EmptyState,
│   │                         # Badge, Divider, ScreenHeader, ProgressBar, Monogram, ChoiceChip,
│   │                         # ListSkeleton
│   ├── SubjectsPage/         # SubjectCard
│   └── ActivitiesPage/       # ActivityRow, SegmentedFilter
├── hooks/                    # use-subjects, use-activities (+ use-dashboard no P5)
├── domain/                   # regras puras, sem React
│   ├── models.ts             # Subject, Activity, Assessment + tipos auxiliares
│   ├── validation.ts         # validadores de formulário (RF-01, RF-04, RF-08)
│   ├── progress.ts           # cálculo de progresso/agregados (RF-02/RF-09)
│   ├── date.ts / id.ts / monogram.ts / sorting.ts
│   └── repositories.ts       # INTERFACES Repository<Subject> etc. (portos)
├── storage/                  # persistência (adaptadores) — nome do roteiro
│   ├── storage.ts            # wrapper AsyncStorage: chaves, get/set JSON atômicos
│   ├── notifier.ts           # pub/sub mínimo "dados mudaram" (cross-screen refresh)
│   ├── subject.repository.ts # implementa Repository<Subject>
│   ├── activity.repository.ts
│   └── assessment.repository.ts
├── services/                 # isolamento de SDK nativo (Slice 8) — NÃO é camada de API
│   └── reminders.ts          # único import de expo-notifications: permissão, agenda, cancela
├── styles/global.css         # espelho dos tokens em CSS variables (ADR-0010) — nome do roteiro
└── constants/theme.ts        # fonte única dos tokens: cores, espaçamento, tipografia e medidas
```

### O que o roteiro/enunciado sugere vs. o que ficou — e por quê

| Camada sugerida | Decisão | Justificativa |
|---|---|---|
| `screens/` | **adotada (ADR-0008)** | Uma PASTA por tela (`<Tela>Page/index.tsx`), com `src/app/` guardando só rotas finas (re-export). Fica explícito quais são as telas e cada uma tem lugar para seus helpers. Satisfaz o roteiro e mantém o Expo Router feliz: a rota é a URL, a tela é o código. |
| `components/` | **subpastas por tela (ADR-0008)** | `components/ui/` = kit reutilizável (≥2 telas); `components/<Tela>Page/` = específico de uma tela. Sem subcomponente desenhado dentro do `index.tsx` da tela. |
| `storage/` | **adotada (ADR-0008)** | Nome literal do roteiro; abriga wrapper AsyncStorage + repositórios. (A renomeação anterior para `data/` foi revertida: custo zero, ganho de leitura na avaliação.) |
| `styles/` | **adotada (ADR-0008)** | `src/styles/global.css` permanece como espelho dos tokens em CSS variables (ADR-0010 §2), sem estar no caminho de execução. `constants/theme.ts` é a fonte única do estilo. |
| `repositories/` | **dividida: interface em `domain/`, implementação em `storage/`** | A interface é contrato de negócio (porto); a implementação é detalhe técnico (adaptador). DIP sem pasta extra decorativa. |
| `models/` | **fundida em `domain/models.ts`** | Um arquivo de tipos não precisa de diretório; modelos vivem junto das regras que os validam. |
| `services/` | **adotada em 2026-10-09 (Slice 8)** — hoje só `reminders.ts` | O app é 100% local ([ADR-0002](../adr/ADR-0002-estrategia-de-persistencia.md)) e não consome API externa: a pasta nasceu para **isolar um SDK nativo**, não para chamar backend. `expo-notifications` é importado exclusivamente em `src/services/reminders.ts`, atrás de três funções — a mesma disciplina de `storage.ts` com o AsyncStorage. Sem serviço, o SDK vazaria para hooks e telas. |
| `components/`, `hooks/`, `utils/` | mantidas | Responsabilidade real; `utils/` ainda não nasceu — funções entraram em `domain/` (date, id) onde são regras, não utilidades. |

## SOLID — pragmaticamente

Cada princípio abaixo tem problema real resolvido; nenhum é demonstração.

| Princípio | Onde se aplica | Problema que resolve |
|---|---|---|
| **SRP** | `domain/validation.ts` (só regras), `storage/storage.ts` (só persistência), um hook por agregado, um componente por responsabilidade | O "todo-poderoso `App.tsx`" que o roteiro cita como anti-padrão; mudança de validação não arrasta UI. |
| **OCP** | Componentes UI parametrizados por props (variantes de `Button`/`Badge`); repositórios por interface | Novas necessidades visuais/de dados estendem props/implementações em vez de remendar código de telas antigas. |
| **LSP** | Repositórios concretos (`subject.repository` etc.) são intercambiáveis entre si e com fakes de teste porque respeitam `Repository<T>` | Hooks funcionam contra fakes em teste/preview sem saber que é storage — condição para RNF-04 ser testável. |
| **ISP** | Interfaces enxutas: um `Repository<T>` com `getAll/upsert/remove` — sem método "de dashboard" dentro | Nada é forçado a implementar método que não usa (ex.: repositório não calcula progresso — isso é `domain/progress.ts`). |
| **DIP** | Hooks dependem da **interface** `Repository<T>` (em `domain/`); a implementação AsyncStorage mora em `storage/` e é plugada no ponto de composição | Telas/hooks nunca importam storage; regras de negócio testáveis com fakes de repositório (RNF-04 verificável). É o princípio que separa UI ↔ negócio ↔ persistência, exigência explícita do cliente. |

**Separação tripla exigida pelo cliente** (UI ↔ regras ↔ persistência) é exatamente o grafo de
dependências do diagrama acima: rota → tela → hook → domínio, e o domínio define o contrato que
`storage/` implementa.

## Decisões de mecanismo (onde moram)

- Stack/versionamento Expo → [ADR-0001](../adr/ADR-0001-stack-expo-react-native-typescript.md)
- AsyncStorage vs SQLite vs API → [ADR-0002](../adr/ADR-0002-estrategia-de-persistencia.md)
- Expo Router vs React Navigation vs Navigator → [ADR-0003](../adr/ADR-0003-estrategia-de-navegacao.md)
- Camadas + DIP → [ADR-0004](../adr/ADR-0004-organizacao-arquitetural.md)
- Estado global vs hooks de dados locais → [ADR-0005](../adr/ADR-0005-gerenciamento-de-estado.md)
- Identidade monocromática → [ADR-0006](../adr/ADR-0006-identidade-visual-monocromatica.md)
- NativeWind/Tailwind → [ADR-0007](../adr/ADR-0007-estilo-nativewind.md), substituído pelo
  [ADR-0010](../adr/ADR-0010-estilo-stylesheet-expo-go.md) (`StyleSheet`, por rodar no Expo Go)
- Nomes de pastas do roteiro → [ADR-0008](../adr/ADR-0008-estrutura-roteiro.md)
- Identidade visual escura com destaque → [ADR-0009](../adr/ADR-0009-identidade-visual-escura-com-destaque.md)
- Nomes de rotas concretas, estados de loading, detalhes de componentes → **spec de cada feature**
  (`docs/features/`), não aqui.
