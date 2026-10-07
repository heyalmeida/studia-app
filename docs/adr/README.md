# ADRs — Architecture Decision Records

| ADR | Título | Status | Data |
|---|---|---|---|
| [ADR-0001](ADR-0001-stack-expo-react-native-typescript.md) | Stack: Expo SDK 57 + React Native + TypeScript | Aceito | 2026-10-07 |
| [ADR-0002](ADR-0002-estrategia-de-persistencia.md) | Estratégia de persistência: AsyncStorage local | Aceito | 2026-10-07 |
| [ADR-0003](ADR-0003-estrategia-de-navegacao.md) | Estratégia de navegação: Expo Router (abas + pilha) | Aceito | 2026-10-07 |
| [ADR-0004](ADR-0004-organizacao-arquitetural.md) | Organização arquitetural em camadas com interfaces de repositório | Aceito | 2026-10-07 |
| [ADR-0005](ADR-0005-gerenciamento-de-estado.md) | Gerenciamento de estado: hooks de dados + pub/sub | Aceito | 2026-10-07 |
| [ADR-0006](ADR-0006-identidade-visual-monocromatica.md) | Identidade visual monocromática (preto-e-branco) | Aceito | 2026-10-07 |
| [ADR-0007](ADR-0007-estilo-nativewind.md) | Estilo: NativeWind (Tailwind CSS) como sistema de escrita | Aceito | 2026-10-07 |
| [ADR-0008](ADR-0008-estrutura-roteiro.md) | Estrutura de pastas alinhada ao roteiro (screens/ + storage/ + styles/) | Aceito | 2026-10-07 |

**Critério de existência:** um ADR só é escrito quando há (a) decisão relevante, (b) alternativa real
rejeitada com motivo, (c) consequência duradoura. Ideias que não passaram nesse teste foram deliberadamente
**não** registradas como ADR (ver [product brief §8](../product-brief.md) — escopo autocontido, sem fase
pós-MVP).

## Formato

Cada ADR segue: Status · Contexto · Alternativas consideradas · Decisão · Consequências · Referências.
Numeração sequencial, sem reaproveitar números. Substituição exige novo ADR declarando
`Substitui ADR-xxxx`, e o antigo passa a `Status: Superado`.
