# ADR-0008 — Estrutura de pastas alinhada ao roteiro (screens/ + storage/ + styles/)

| Campo | Valor |
|---|---|
| **Status** | Aceito (decisão do dono do projeto, 2026-10-07) |
| **Data** | 2026-10-07 |
| **Substitui** | ADR-0004 **apenas no que toca a nomes de pastas** (`data/`→`storage/`; telas em `app/`→`screens/` + rotas finas; `styles/global.css`). O grafo de camadas e o DIP de ADR-0004 permanecem válidos. |

## Contexto

O roteiro (Etapa 2, item 5) define a estrutura esperada: `src/components/`, `src/screens/`,
`src/services/`, `src/storage/`, `src/styles/`. O ADR-0004 havia renomeado/absorvido duas dessas
pastas (`storage/`→`data/`; telas dentro de `app/`), argumentando idiomacia Expo Router. Na prática,
o dono apontou dois problemas reais: (1) `src/app/(tabs)/*.tsx` misturava rota e implementação —
"não fica claro quais são as telas"; (2) a avaliação do professor lê a estrutura do roteiro, e
divergência de nomes custa ponto sem ganho técnico.

## Decisão

1. **`src/screens/<Tela>Page/index.tsx`** — cada tela é uma **pasta** em PascalCase com sufixo
   `Page`, e a implementação fica no `index.tsx` dela (ex.: `src/screens/SubjectsPage/index.tsx`,
   `src/screens/ActivityFormPage/index.tsx`). Componente default nomeado igual à pasta
   (`export default function SubjectsPage()`). Uma pasta por tela deixa óbvio "quais são as telas"
   e dá um lugar natural para helpers exclusivos daquela tela.
2. **`src/components/<Tela>Page/<Componente>.tsx`** — componentes **específicos de uma tela** vivem
   na subpasta com o MESMO nome da tela (ex.: `src/components/SubjectsPage/SubjectCard.tsx`,
   `src/components/ActivitiesPage/ActivityRow.tsx`). **`src/components/ui/`** guarda só o kit
   genuinamente reutilizável (usado em ≥2 telas): Button, Input, Card, ListItem, EmptyState, Badge,
   Divider, ScreenHeader, ProgressBar, Monogram, ChoiceChip, ListSkeleton.
3. **`src/app/`** — só o Expo Router precisa: `_layout.tsx` (raiz e tabs) + **arquivos-finos de
   rota** (`export { default } from '@/screens/<Tela>Page'`, 1 linha). A rota é a URL; a tela é o código.
4. **`src/storage/`** — o que era `src/data/` (wrapper AsyncStorage, repositórios, notifier).
5. **`src/styles/global.css`** — tokens CSS do NativeWind (era `src/global.css`).
6. `services/` continua não criada (sem API — roteiro diz "pelo menos uma das opções: API **ou**
   armazenamento local"; a estrutura do roteiro é exemplo, não mandatória quanto a `services/`).
   Registrar na apresentação: `domain/` é a camada equivalente a "services" (regras de negócio).

### Regra anti-arquivo-solto (o que evita a repetição do problema)

- **Proibido** criar `src/screens/<tela>.tsx` solto — sempre `src/screens/<Tela>Page/index.tsx`.
- **Proibido** definir subcomponente de tela dentro do `index.tsx` da tela quando ele tem mais de
  ~15 linhas de JSX próprio (ex.: um Card/Row/Filter). Vai para
  `src/components/<Tela>Page/<Componente>.tsx`. O `index.tsx` da tela orquestra; não desenha peças.
- **Proibido** criar componente em `src/components/ui/` que só UMA tela usa — esse vai para
  `src/components/<Tela>Page/`. Promove-se a `ui/` apenas quando um segundo consumidor aparece.
- Componente novo: um arquivo por componente, PascalCase, `export function <Nome>`.

## Consequências

- **Positivas:** estrutura conversa com o roteiro item 5 (avaliação literal); tela e rota separadas
  — `src/app/(tabs)/index.tsx` de 1 linha vs. `src/screens/dashboard.tsx` de 191; navegação de
  arquivos no editor espelha o domínio.
- **Negativas:** um nível de indirection a mais (rota → re-export → tela); `screens/` fora da
  convenção "routes only in app/" do `AGENTS.md` — mitigado: as ROTAS continuam todas em `app/`;
  `screens/` contém componentes, não rotas.
- **Ações:** imports `@/data/*` → `@/storage/*` (feito); metro `input` → `./src/styles/global.css`
  (feito); prompts P4–P6 atualizados (feito); docs sincronizados (este commit).

## Referências

Roteiro Etapa 2 item 5; ADR-0004 (mantido para camadas/DIP); pedido do dono (2026-10-07).
