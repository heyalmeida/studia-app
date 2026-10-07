# ADR-0005 — Gerenciamento de estado: hooks de dados + contexto mínimo

| Campo | Valor |
|---|---|
| **Status** | Aceito (2026-10-07) — com refinamento: notificação por pub/sub mínimo (`data/notifier.ts`) em vez de Context |
| **Data** | 2026-10-07 |

## Contexto

O estado do Studia é: coleções persistidas no storage (matérias, atividades, avaliações), estado efêmero de
formulário (campos + erros) e estado de tela (filtro atual, carregando). O app é 100% local
([ADR-0002](ADR-0002-estrategia-de-persistencia.md)) e tem ~3 telas de consumo por coleção. A pergunta é se
vale um gerenciador de estado global (Zustand/Redux/Context) ou não.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **Redux Toolkit** | Padrão de mercado, devtools | Boilerplate e curva injustificados para 3 coleções locais; violaria "arquitetura proporcional ao tamanho" (brief do cliente) | Descartada |
| **React Context global único** | Nativo, sem dependência | Um contexto global de tudo re-renderiza consumidores em cadeia e vira dumping-ground; sem persistência — ainda precisaria dos repositórios | Descartada |
| **Zustand** | Leve, ergonomicamente bom | Nova dependência; sem servidor remoto, a "store" duplicaria a verdade que já está no storage — dois lugares para o mesmo dado | **Descartada** — não há fase pós-MVP |
| **React Query** | Cache/estado de servidor é o caso de uso | Não há servidor — 100% local por decisão final (OQ-13 descartada) | **Descartada** |
| **Hooks de dados + storage como fonte de verdade** | Estado persistido vive **apenas** no storage; hooks (`useSubjects`, `useActivities`, `useAssessments`) carregam na montagem, expõem `{items, loading, error, actions}` e atualizam após escrita; um leve `DataContext` propaga mudanças entre telas após mutações | Recarrega ao entrar na tela (irrelevante no volume local); exige o padrão "mutate → notify" documentado | **Escolhida** |

## Decisão

**Nenhuma biblioteca de estado global no MVP.** Modelo:

1. **Fonte de verdade** = AsyncStorage via repositórios ([ADR-0002](ADR-0002-estrategia-de-persistencia.md),
   [ADR-0004](ADR-0004-organizacao-arquitetural.md));
2. **Uma família de hooks por coleção** (`useSubjects` etc.) em `src/hooks/` — consomem a interface
   `Repository<T>` (DIP), nunca o storage diretamente;
3. **Notificação entre telas por pub/sub mínimo**: `src/data/notifier.ts` emite `subjects:changed`,
   `activities:changed`, `assessments:changed` após escrita bem-sucedida; hooks assinam via
   `useSyncExternalStore` (React 19, disponível no RN). **Nenhum Context global** — o pub/sub é um módulo
   de dados, não uma camada de árvore React, e assim o Painel se mantém atualizado após mutações vindas
   de outras abas sem re-render em cadeia. (Refinamento de 2026-10-07 sobre a "Contexto mínimo" original:
   mesma intenção, mecanismo mais simples.)
4. **Estado de formulário é local** (useState/useReducer dentro do próprio form) — nunca global;
5. **Estado de tela** (filtro, scroll) é local à tela.

Se uma regra emergir "isto precisa de store global" (sinal: um contexto crescendo além do papel de
notificação), ela **não** é implementada — vira nova questão em aberto e provavelmente um ADR-0006.

## Consequências

- **Positivas:** zero dependência nova; RNF-02/RNF-03 preservados (menos mecanismo, mais clareza); o
  padrão "hook por coleção" reaproveita 3× e é didático na apresentação; troca de storage não toca UI.
- **Negativas:** propagação entre telas depende do mecanismo de notificação do DataContext — precisa ser
  especificado e testado na feature `dashboard` (CA de "concluir atividade no Painel atualiza a lista de
  Atividades"); hooks recarregam na entrada da tela (custo desprezível local).
- **Reversibilidade:** alta — adicionar Zustand depois é adicionar uma camada, não substituir o storage.

## Referências

ADR-0002/0004; [open-questions.md](../requirements/open-questions.md) (OQ-13); briefing do cliente
("estratégia de gerenciamento de estado — não crie abstrações prematuras").
