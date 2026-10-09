# Spec — Slice 7: Busca e filtro por matéria nas listas

| Campo | Valor |
|---|---|
| **Data** | 2026-10-09 |
| **Feature** | `filters` |
| **RF/RNF** | RF-04, RF-06, RF-08 (apresentação das listas); RNF-04 (defesa na leitura — nada novo) |
| **ADRs** | 0004 (camadas), 0008 (estrutura), 0009 (identidade escura com destaque), 0010 (StyleSheet) |
| **Risco** | baixo — funções puras + estado local de tela; zero dependência nova |

## Objetivo

Com a coleção crescendo, localizar itens rapidamente: busca textual e filtro por matéria nas três
listas (Atividades, Avaliações, Matérias), sem sair da tela e sem tocar nas ordenações existentes.

## Critérios de aceitação

- **AC-7.1** Busca por título/nome é case-insensitive e **sem acentos** ('calculo' acha 'Cálculo');
  termoinválido nenhum (vazio = sem filtro). Implementada como função pura em `src/domain/filtering.ts`
  (normalize em `src/domain/text.ts`).
- **AC-7.2** Atividades: `SearchField` + `SubjectFilterRow` (chips 'Todas' + uma por matéria) +
  o `SegmentedControl` de status **combinam** (interseção); filtro aplicado DEPOIS do `sortActivities`
  (ordem preservada, item filtrado não muda de posição relativa).
- **AC-7.3** Avaliações: `SearchField` + `SubjectFilterRow` (sem segmented — a lista já vem com
  agendadas/realizadas ordenadas).
- **AC-7.4** Matérias: `SearchField` apenas (a lista É de matérias).
- **AC-7.5** Estado 'Nenhum resultado' (lista existia, filtro zerou): EmptyState com título
  'Nenhum resultado' + ação 'Limpar filtros' que reseta busca/filtro/segmented. Distinguir do vazio
  real ('Nenhuma atividade' etc.) que mantém o CTA de criação.
- **AC-7.6** O FAB e os vazios originais continuam funcionando; nada nos hooks/repositórios muda.
- **AC-7.7** tsc + lint + `npx expo export --platform web` limpos; app roda no Expo Go (Regra
  ADR-0009 §7 / ADR-0010).

## Contrato de UI

- Estilo: `StyleSheet.create` + tokens de `src/constants/theme.ts` (`Palette`, `Spacing`, `Radius`,
  `Typography`, `FIELD_HEIGHT`, `TOUCH_TARGET`, `SCREEN_PADDING`). **Zero `className`** (ADR-0010).
- Componentes novos em `src/components/ui/` (≥2 telas): `SearchField.tsx`, `SubjectFilterRow.tsx`.
- Ícones: `lucide-react-native` (import nomeado por arquivo — `icons/search`, `icons/x`).
- Cor de destaque do chip selecionado segue o padrão existente de `Chip`/`SubjectChip`
  (accent/accentSoft) — ADR-0009 §2.
- Textos PT-BR: placeholders 'Buscar atividade...', 'Buscar avaliação...', 'Buscar matéria...'.

## Fora de escopo

Busca em descrição, filtro por período/tipo, ordenação customizada, persistência dos filtros,
qualquer dependência nova.
