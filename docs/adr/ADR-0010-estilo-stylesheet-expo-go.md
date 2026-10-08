# ADR-0010 — Estilo: `StyleSheet` como sistema de escrita (Expo Go)

| Campo | Valor |
|---|---|
| **Status** | Aceito (decisão do dono do projeto, 2026-10-08) |
| **Data** | 2026-10-08 |
| **Substitui** | [ADR-0007](ADR-0007-estilo-nativewind.md) — NativeWind (Tailwind) como sistema de escrita de estilo |
| **Não altera** | [ADR-0009](ADR-0009-identidade-visual-escura-com-destaque.md) — identidade, tokens e a regra "sem sombras", exceto a exceção registrada em §3 |
| **Spec da mudança** | [docs/specs/2026-10-08-expo-go-layout](../specs/2026-10-08-expo-go-layout/spec.md) |

## Contexto

O [ADR-0007](ADR-0007-estilo-nativewind.md) escolheu NativeWind v4 como forma de escrever estilo, a
pedido explícito do dono ("use o tailwindcss para tudo de css na real"). A escolha se apoiou na
premissa de que o rodapé de estilo seria validado com `npx expo export --platform web` — que de fato
passa, porque no **web** o Tailwind funciona.

O problema apareceu no alvo real de uso: o **Expo Go**. O `react-native-css-interop`, motor do
NativeWind v4, é **módulo nativo** — ele não existe dentro do Expo Go. O resultado é silencioso e
enganoso: o app abre, sem erro no console e sem aviso, e **todo o espaçamento colapsa** (padding,
`gap`, `flex-row`, tipografia e cor vindas de `className`). Só numa *development build* o estilo
aparece. Como o [ADR-0009](ADR-0009-identidade-visual-escura-com-destaque.md) §7 exige que tudo rode
no Expo Go (o projeto é avaliado e apresentado nele), o NativeWind não pode ser o sistema de escrita
de estilo.

## Alternativas consideradas

| Opção | Prós | Cons | Decisão |
|---|---|---|---|
| **Manter NativeWind e exigir dev build** | preserva o ADR-0007 e o pedido original | o Expo Go deixa de funcionar; obriga toda apresentação a rodar build nativa | Rejeitada |
| **Dev build só para o avaliador** | app correto | entrega frágil, dependente de EAS/sem credenciais na apresentação; anula a praticidade do Expo Go | Rejeitada |
| **Manter NativeWind e aceitar o layout colapsado** | nada muda no código | o app está visualmente quebrado no único ambiente de execução suportado | Rejeitada |
| **`StyleSheet` como sistema de escrita; NativeWind sai do caminho crítico** | funciona no Expo Go, no dev build e na web; tokens continuam centralizados; sem dependência nativa | mais verboso; `className` deixa de ser verificável — o que também elimina o risco de typo silencioso | **Escolhida** |

## Decisão

1. **`StyleSheet.create` é o sistema de escrita de estilo** de `src/`. Nenhum componente renderiza
   `className`. A configuração do NativeWind (`babel.config.js`, `metro.config.js`,
   `tailwind.config.js`, `nativewind`) permanece no repositório **espelhando os tokens**, sem estar no
   caminho de execução; pode ser removida em entrega própria.
2. **`src/constants/theme.ts` continua sendo a fonte única** dos tokens (Regra 4.10). O
   `global.css` e o `tailwind.config.js` seguem espelhando os mesmos valores, para que a remoção
   futura do NativeWind seja só um `npm uninstall` + limpeza de config.
3. **Exceção única à regra "sem sombras"** (ADR-0009 §6): o **FAB** usa `elevation: 6` /
   `shadow*` preto. Ele é o único elemento sobreposto ao conteúdo que passa por baixo dele; sem
   elevação, o botão some visualmente na lista. Cards, linhas, rodapés e superfícies continuam **sem
   sombra** — profundidade por tom de superfície + hairline (RNF-01).
4. **Valores calculados em runtime** (tamanho do `IconTile`, `width` em `%` da `ProgressBar`,
   stroke do `ProgressRing`) são a exceção já prevista no ADR-0007 §4: vão em `style` arrayado.

## Consequências

- **Positivas:** o app renderiza corretamente no Expo Go, no dev build e na web, com o mesmo código;
  nenhuma dependência nativa nova; erro de estilo passa a ser erro do TypeScript, não glitch visual;
  a dependência `className` some do caminho crítico.
- **Negativas:** código mais verboso que `className`; `tailwind.config.js`/`global.css` passam a ser
  espelhos sem uso imediato, o que exige disciplina para não divergirem dos tokens.
- **Vinculante:** nenhum componente em `src/` escreve `className`; toda cor continua vindo de token;
  a sombra do FAB é a única exceção e está registrada aqui.

## Referências

[ADR-0007](ADR-0007-estilo-nativewind.md) (substituído); [ADR-0009](ADR-0009-identidade-visual-escura-com-destaque.md)
(§7 — Expo Go; §6 — sombras, com a exceção de §3 acima); RNF-01; Regra 4.10;
[spec da entrega](../specs/2026-10-08-expo-go-layout/spec.md);
documentação do NativeWind v4 sobre o requisito de dev build.