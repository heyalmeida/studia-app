# Spec de Entrega — expo-go-layout

| Campo | Valor |
|---|---|
| **Data** | 2026-10-08 |
| **Feature(s)** | [docs/features/ui-kit](../../features/ui-kit/spec.md) |
| **RF/RNF desta entrega** | RNF-01 (identidade visual consistente), RNF-05 (safe areas e ergonomia), camada de apresentação de RF-01…RF-09 |
| **ADRs consultados** | ADR-0007 (NativeWind), ADR-0008 (estrutura de roteiro), ADR-0009 (identidade escura) — **revisados** por [ADR-0010](../../adr/ADR-0010-estilo-stylesheet-expo-go.md) |
| **Questões resolvidas/pendentes** | nenhuma pendente; a questão "escrever estilo com NativeWind ou StyleSheet no Expo Go" vira ADR-0010 |

## Objetivo (uma frase)

Fazer o app renderizar com o layout correto quando executado no **Expo Go**, onde o `className` do
NativeWind não é aplicado, sem alterar nenhuma regra de domínio, persistência ou dado.

## Contexto técnico

O `react-native-css-interop` (motor do NativeWind v4) é **módulo nativo**: ele não existe dentro do
Expo Go, então `className` é ignorado silenciosamente e todo o espaçamento colapsa. Numa dev build o
problema desaparece, mas o projeto é avaliado/apresentado no Expo Go (ADR-0009 §7 — "tudo roda no
Expo Go"), o que torna o NativeWind inaplicável como sistema de escrita de estilo.

## Critérios de aceitação (esta entrega)

| # | Critério | Verificação |
|---|---|---|
| AC-1 | Nenhum componente em `src/` usa `className`/`contentClassName` — o app funciona idêntico no Expo Go | busca textual: 0 ocorrências fora de comentário |
| AC-2 | A identidade visual do ADR-0009 é preservada: mesmos tokens, mesma hierarquia, mesma cor de destaque | inspeção por tela + `constants/theme.ts` como fonte única |
| AC-3 | Nenhum literal de cor fora de `theme.ts`/`global.css`/`tailwind.config.js` (Regra 4.10) | busca textual de `#[0-9A-Fa-f]{6}` |
| AC-4 | Elementos fixos (FAB, rodapé de formulário, tab bar) não cobrem conteúdo nem ficam sob a barra de abas | `listBottomInset`/`contentBottomInset`/`FORM_FOOTER_HEIGHT` aplicados nas 7 telas |
| AC-5 | Alvo de toque ≥ 44 e feedback de escala/opacidade em todo pressable | inspeção dos componentes `ui/` |
| AC-6 | Regra de negócio, storage e hooks intocados — a entrega é exclusivamente de apresentação | `git diff --stat`: nenhum arquivo em `src/domain`, `src/storage`, `src/hooks` |
| AC-7 | `npx tsc --noEmit` e `npx expo lint` limpos | automático (executado) |

## Fora do escopo desta entrega

- Remover a configuração do NativeWind (`babel.config.js`, `metro.config.js`, `tailwind.config.js`,
  `nativewind`): mantido como Tokens espelhados e removível em entrega própria.
- Reavaliar a prohibition de sombra (ADR-0009 §6) — o `elevation` do FAB foi registrado como
  exceção documentada no ADR-0010, não como mudança do ADR-0009.
- Qualquer mudança de cor, espaçamento de design ou comportamento das telas.