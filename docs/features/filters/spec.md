# Spec da Feature — Busca e filtro por matéria nas listas

| Campo | Valor |
|---|---|
| **ID** | `filters` |
| **Status** | **Implementada** (2026-10-09) |
| **RF/RNF atendidos** | RF-04, RF-06, RF-08 (apresentação das listas); RNF-02 (escala — localizar itens com a coleção crescendo) |
| **Depende de** | `activities`, `assessments`, `subjects`, `ui-kit` (`SearchField`, `SubjectFilterRow`) |
| **ADRs pertinentes** | ADR-0004 (funções puras no domínio), ADR-0009/0010 (chips com accent; `StyleSheet`) |
| **Data** | 2026-10-09 |
| **Spec de execução** | [../specs/2026-10-09-slice-7-search-filters/spec.md](../specs/2026-10-09-slice-7-search-filters/spec.md) |

## 1. Qual problema resolve

Com a coleção crescendo (várias matérias, dezenas de atividades), as listas viram rolagem cega: o
aluno não encontra "o trabalho de Cálculo" sem descer tela. Esta feature dá aos três itens de
navegação mais densos (Atividades, Avaliações, Matérias) uma busca por texto e — nas duas listas de
itens com matéria — um filtro rápido por matéria, sem sair da tela.

## 2. Quem utiliza

O aluno que já cadastrou itens e precisa localizar um específico ou revisar só uma matéria antes de
uma prova. Filtros são efêmeros por desenho: estado local da tela, nada persistido, troca de aba
reseta.

## 3. Telas e rotas impactadas

| Tela | Rota | Mudança |
|---|---|---|
| T1 Painel | — | não impactada |
| T2 Matérias | `/(tabs)/subjects` | `SearchField` (nome/professor); vazio pós-busca 'Nenhum resultado' |
| T3 Atividades | `/(tabs)/activities` | `SearchField` (título) + `SubjectFilterRow` + `SegmentedControl` combinados por interseção |
| T4 Avaliações | `/(tabs)/assessments` | `SearchField` (título) + `SubjectFilterRow` |

## 4. Comportamento esperado

1. Em qualquer uma das três listas, um campo de busca fica sob o título. A busca é
   **case-insensitive e sem acentos** ('calculo' encontra 'Cálculo I'); o resultado reordena nada —
   filtra a lista que o hook já entregou ordenada.
2. Em Atividades e Avaliações, uma linha horizontal de chips permite filtrar por uma matéria; o chip
   'Todas' (estado inicial) desfaz. Em Atividades, busca + chip + segmented (status) combinam por
   **interseção**.
3. Quando a lista tem itens mas os filtros zeram o resultado, o vazio mostra **'Nenhum resultado'**
   com ação **'Limpar filtros'** (em Atividades reseta os três controles) — distinto do vazio real
   ('Nenhuma atividade'), que mantém o CTA de criação.
4. Rodar um filtro com lista vazia de matérias (chips só 'Todas') não quebra nada.

## 5. Contrato implementado

- `src/domain/text.ts` → `normalizeForSearch(value)` (lowercase + NFD + strip de diacríticos).
- `src/domain/filtering.ts` → `matchesSearch(query, fields)` (OR entre campos, query vazia = true) e
  `filterBySubject(items, subjectId | null)` (null devolve a mesma lista, sem mutação).
- `src/components/ui/SearchField.tsx` → campo com ícone `search`, altura 44, botão `x` de limpar.
- `src/components/ui/SubjectFilterRow.tsx` → chips horizontais ('Todas' + uma por matéria, nome puro;
  selecionado = accent/accentSoft/borda accent).
- Hooks/repositórios **não mudaram**: filtro é `useMemo` na tela, aplicado pós-ordenação.

## 6. Limitações conhecidas

- Busca só em título (atividades/avaliações) e nome/professor (matérias) — descrição não é indexada
  (fora de escopo da spec).
- Filtros não persistem entre sessões nem entre trocas de aba (deliberado).

## 7. Referências

Spec de execução: [../specs/2026-10-09-slice-7-search-filters/](../specs/2026-10-09-slice-7-search-filters/spec.md) ·
Commit: `23c8400 feat(filters)` · Domínio: `src/domain/filtering.ts`, `src/domain/text.ts`
