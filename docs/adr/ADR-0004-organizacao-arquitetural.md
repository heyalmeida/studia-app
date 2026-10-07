# ADR-0004 — Organização arquitetural em camadas com interfaces de repositório

| Campo | Valor |
|---|---|
| **Status** | Aceito (escopo aprovado 2026-10-07) — **nomes de pastas parcialmente substituídos pelo [ADR-0008](ADR-0008-estrutura-roteiro.md)** (`data/`→`storage/`; telas em `screens/`; `styles/global.css`). O grafo de camadas e o DIP deste ADR permanecem válidos. |
| **Data** | 2026-10-07 |

## Contexto

O cliente propôs uma estrutura (`components/ screens/ services/ storage/ models/ repositories/ hooks/
utils/ styles/`) pedindo explicitamente para **analisar se cada camada é necessária** — evitando tanto
`App.tsx` monolítico quanto over-engineering. O roteamento file-based do Expo Router (ADR-0003) já ocupa
o espaço que "screens" ocuparia.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **Estrutura literal do enunciado** (9 pastas) | Cumpre o exemplo à letra | `screens/` duplica `app/` (rotas *são* telas); `services/` vazia sem API; `models/` de um arquivo vira diretório decorativo — arquitetura por cosmética | Rejeitada — o próprio enunciado pede avaliação, não cópia |
| **Estrutura mínima** (`app/` + `components/` + `utils/`) | Simples | Concentraria lógica de negócio nas telas e importaria AsyncStorage direto — o monolito que o roteiro condena | Rejeitada |
| **Camadas por responsabilidade real** (`app/`, `components/`, `hooks/`, `domain/`, `data/`, `constants/`, `utils/`) | Cada pasta tem job declarado; regras puras testáveis sem render; troca de storage barata (DIP) | Requer disciplina de dependência (setas apontam para dentro) — mitigada pela Regra 4 do `.clinerules` | **Escolhida** |

## Decisão

Adotar a estrutura e o grafo de dependência detalhados em
[architecture.md](../architecture/architecture.md):

- Rotas/telas **só** em `src/app/` (Expo Router); UI reutilizável em `src/components/`;
- `src/domain/` — entidades, validações, cálculo de progresso e **interfaces** `Repository<T>`
  (porto), sem React e sem storage;
- `src/data/` — wrapper AsyncStorage + repositórios concretos (adaptador), **implementando** as
  interfaces do domínio;
- `src/hooks/` — ponto único onde UI encontra dados (DIP na prática);
- Sem `services/` até existir API real; sem `screens/` como pasta separada do roteador.

SOLID aplicado de forma pragmática onde resolve problema mensurável (SRP para evitar o monolito; DIP para
isolar a escolha de storage do ADR-0002; LSP para viabilizar fakes de teste). Onde não há problema, não há
abstração.

## Consequências

- **Positivas:** atende RNF-02 e a exigência "organização em pastas" do roteiro com justificativa por
  camada (não por cópia); a separação por interfaces mantém a base de dados isolada e o domínio testável;
  `domain/` roda com Jest puro, sem render.
- **Negativas:** 6 pastas em `src/` ainda é mais que um projeto de curso costuma ter — a tabela
  "sugerido × aceito × motivo" em `architecture.md` existe justamente para responder a isso na
  apresentação; importações circulares entre `domain/` e `data/` são proibidas por regra, não por tooling.
- **Neutro:** nomes concretos de arquivos (rotas, hooks) serão definidos nas specs de feature, não aqui.

## Referências

Roteiro Etapa 1 item 10, Etapa 2 item 5, Etapa 3; [architecture.md](../architecture/architecture.md);
ADR-0002/0003/0005; cliente ("analise se cada camada realmente é necessária").
