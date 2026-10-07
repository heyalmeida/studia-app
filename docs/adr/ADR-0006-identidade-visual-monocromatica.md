# ADR-0006 — Identidade visual monocromática (preto-e-branco)

| Campo | Valor |
|---|---|
| **Status** | Aceito (decisão do dono do projeto, 2026-10-07) |
| **Data** | 2026-10-07 |
| **Detalhe dos tokens** | [docs/design/visual-identity.md](../design/visual-identity.md) |

## Contexto

O scaffold Expo SDK 57 já vem com `src/constants/theme.ts` em preto-e-branco (#000/#fff + neutros) e
`userInterfaceStyle: automatic`. O dono do projeto definiu: **design minimalista, monocromático,
preto-e-branco e vice-versa (light/dark automático)**. A proposta original de "cor de identificação por
matéria" (paleta sorteada) foi reavaliada à luz dessa diretriz.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **Cor por matéria** (paleta fixa sorteada) | Reconhecimento visual rápido; comum em planners (Mobbin: Notion, Things) | Quebra o monocromático estrito; adiciona campo + seletor ao formulário e estado ao domínio | Rejeitada pelo pedido explícito |
| **Monocromático com 1 cor de acento** | Cumpre "preto e branco" com escape para estados (erro/prazo) | Acento em estado viola a direção pedida; estados ainda precisam ser legíveis em P&B puro | Rejeitada |
| **Monocromático estrito + monograma** | Fiel à decisão do cliente; hierarquia 100% por tipografia/peso/borda/espaço; tema automático trivial (o `theme.ts` do scaffold já é assim); domínio mais simples (sem campo `color`) | Matérias distinguíveis por texto/monograma, não por cor — risco de reconhecimento mitigado pelo monograma grande nos cards | **Escolhida** |

## Decisão

1. **Paleta estrita:** apenas pretos, brancos e cinzas funcionais (ver tokens em
   `visual-identity.md`). Nenhuma cor saturada em qualquer tela, ícone ou gráfico.
2. **Estados não-cromáticos:** atrasada/próxima/erro/realizada comunicados por **peso tipográfico, borda,
   preenchimento invertido e rótulo textual** — nunca por cor.
3. **Identificação de matéria = monograma** (até 2 caracteres derivados do nome, **nunca armazenado** —
   campo `color` removido do modelo de dados).
4. **Light/dark automático** pelo `userInterfaceStyle: automatic` + `useColorScheme()` do scaffold.
5. **Profundidade sem sombras:** hairlines (`borderWidth: StyleSheet.hairlineWidth`) e superfícies tonais.
6. Inspiracão de **layout** (não de cor): Mobbin — ver seção "Referências de pesquisa" de
   [`visual-identity.md`](../design/visual-identity.md).

## Consequências

- **Positivas:** elimina o campo `color` do domínio e o seletor do formulário (menos estado, menos
  validação); acessibilidade de contraste alta por construção; o tema automático já existe no scaffold —
  zero trabalho extra; forte assinatura visual minimalista (diferencial de portfólio); RNF-01/RNF-05
  atendidos com menos superfície.
- **Negativas:** distinção entre matérias depende de texto (mitigada pelo monograma); protótipos do roteiro
  (Etapa 1, item 5) devem ser desenhados em P&B para não prometer algo que o app não fará.
- **Vinculante:** toda spec de UI deve consumir os tokens de `src/constants/theme.ts`; proibido literal de
  cor fora do tema (Regra 4 do `.clinerules`).

## Referências

Decisão do cliente (2026-10-07); [OQ-09](../requirements/open-questions.md) resolvida;
[domain-model.md](../architecture/domain-model.md); [visual-identity.md](../design/visual-identity.md).
