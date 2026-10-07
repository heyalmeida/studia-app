# Spec — Slice 1: Navegação + UI Kit monocromático

| Campo | Valor |
|---|---|
| **Data** | 2026-10-07 |
| **Feature** | `ui-kit` |
| **RF/RNF** | RNF-01/02/05; base visual de todos os RF |
| **ADRs** | 0003, 0004, 0006 |
| **Risco** | médio (reestrutura as rotas do scaffold; `NativeTabs` é API unstable — exige docs v57) |

## Objetivo

Transformar o scaffold de demo no esqueleto do Studia: rotas definitivas (Stack raiz + grupo `(tabs)`
com 4 abas + 3 rotas de formulário), tokens completos de tema e os ≥10 componentes reutilizáveis
monocromáticos.

## Critérios de aceitação

- AC-1.1 App abre com 4 abas nomeadas em português (Painel, Matérias, Atividades, Avaliações); cada
  aba é um placeholder com `ScreenHeader` e texto — zero conteúdo de demo restante.
- AC-1.2 `explore.tsx`, animated-icon/hint-row/external-link/web-badge/collapsible removidos; splash
  virou `SplashScreen.hideAsync()` simples no layout raiz.
- AC-1.3 Componentes `ui/` (Button, Input, FormField, Card, ListItem, EmptyState, Badge, Divider,
  ScreenHeader, ProgressBar, Monogram) consomem APENAS tokens de `constants/theme.ts`; nenhum `#hex`
  fora do tema; nenhum `shadow*`; legíveis em escala de cinza.
- AC-1.4 Contraste texto/fundo nos dois temas; `Text` longo não vaza layout; safe areas respeitadas.
- AC-1.5 `npx tsc --noEmit` + `npx expo lint` limpos.

## Fora de escopo

Lógica de CRUD/telas reais (slices 2–5).
