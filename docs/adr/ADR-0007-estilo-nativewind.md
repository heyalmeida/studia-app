# ADR-0007 — Estilo: NativeWind (Tailwind CSS) como sistema de escrita

| Campo | Valor |
|---|---|
| **Status** | Aceito (decisão do dono do projeto, 2026-10-07) |
| **Data** | 2026-10-07 |
| **Não altera** | ADR-0006 (identidade monocromática) — NativeWind é o *como*, o ADR-0006 é o *quê* |

## Contexto

O dono pediu explicitamente: "use o tailwindcss para tudo de css na real". O projeto usava
`StyleSheet.create` + `useTheme()` (tokens TS em `constants/theme.ts`) — decisão original do ADR-0006
e do RNF-02. A barra de abas flutuante (estilo 3 de referência, com safe-area inferior) também pedia
markup de estilo mais expressivo.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **Manter StyleSheet** | Zero dependência; já implementado | Contraria o pedido explícito do cliente; verboso | Rejeitada |
| **NativeWind v4** (Tailwind real) | Pedido do cliente; classes utilitárias + design tokens via CSS vars; dark mode automático; padrão de mercado em portfólio RN | Pipeline babel/metro; dependência de build; curva para o executor mini (mitigada: prompts passam a conter exemplos de className) | **Escolhida** |
| **Tamagui** | Poderoso | Over-engineering para o escopo; sintaxe própria, não é "Tailwind" | Rejeitada |

## Decisão

1. **NativeWind v4 + tailwindcss v3** (versões resolvidas por `npx expo install`), com
   `babel.config.js` (`jsxImportSource: 'nativewind'`), `metro.config.js` (`withNativeWind`),
   `tailwind.config.js` (tokens do ADR-0006 como cores/radius/spacing/fonte customizadas) e
   `src/global.css` (CSS variables `--color-*` em `:root` + `@media (prefers-color-scheme: dark)`).
2. **A identidade visual do ADR-0006 permanece vinculante**: só tokens monocromáticos, sem cor
   saturada, sem sombra. A regra "proibido literal de cor fora do tema" vira "proibido literal de cor
   fora de `global.css`/`tailwind.config.js`" e "proibido `bg-[#...]`/`text-[#...]` arbitrários".
3. **`useTheme()`/`Colors` ficam deprecados para estilo** — permanecem apenas onde são estruturais
   (tema do react-navigation no `_layout` raiz; `Spacing` numérico para safe-area). Novos códigos
   usam `className`.
4. **Exceções técnicas documentadas** onde StyleSheet continua: `StyleSheet.hairlineWidth`
   (Divider), alturas dinâmicas calculadas (ProgressBar `width: %`, Monogram por `size`), e
   valores arbitrários que não merecem utilitário.

## Consequências

- **Positivas:** atende o pedido do cliente; estilo declarativo junto ao markup (menos fuso entre
  `styles.x` e uso); dark mode automático pelo CSS; portfólio demonstra ferramenta moderna;
  executor mini recebe classes prontas nos prompts (P4+ atualizados).
- **Negativas/risco:** pipeline de build extra (babel+metro) — mitigado: validado com
  `npx expo export --platform web` e `tsc` limpos; classes Tailwind não são verificáveis por tsc
  (typo em className passa silencioso) — mitigado pelo checklist de revisão visual no P6;
  `expo start` precisa de `--clear` após mudanças no tailwind.config.
- **Ação obrigatória:** ao rodar o app pela primeira vez após esta mudança, use `npx expo start --clear`.

## Referências

ADR-0006; RNF-01/02; `docs/design/visual-identity.md` (atualizada); README do pacote nativewind
instalado; pedido do dono (2026-10-07).
