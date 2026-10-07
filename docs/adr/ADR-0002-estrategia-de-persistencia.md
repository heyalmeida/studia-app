# ADR-0002 — Estratégia de persistência: AsyncStorage local

| Campo | Valor |
|---|---|
| **Status** | Aceito (escopo aprovado 2026-10-07; OQ-05 resolvida) |
| **Data** | 2026-10-07 |

## Contexto

O roteiro (item 9) permite **API ou armazenamento local**. O Studia é um app de uso pessoal, 100% offline,
com ~dezenas de registros por usuário e 3 entidades com uma única FK cada. Não há servidor, contas nem
sincronização no escopo.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **API REST própria** | Demonstra "consumo de API" | Exige back-end, hosting, rede; foge do problema do produto (organizar rotina sem internet) | **Descartada** |
| **API pública de terceiros** | Cumpre requisito formalmente com pouco código | O app teria que ser *sobre* os dados da API; dados de estudo são do usuário, não consultáveis | **Descartada** |
| **SQLite (`expo-sqlite`)** | Consultas reais, FK com enforcement, escala bem | **Exige development build** — não roda no Expo Go (regra do projeto: Expo Go só inclui módulos bundlados); risco operacional na demonstração em sala | **Descartada em definitivo** — o projeto não tem fase pós-MVP |
| **AsyncStorage** (`@react-native-async-storage/async-storage`) | Bundlado no Expo Go (confirmado no índice de docs do Expo); zero risco de ambiente; CRUD por chave-JSON é trivial no volume do app; é literalmente a "Opção 2" do roteiro | Sem consultas estruturais, sem FK — integridade fica na camada de domínio ([domain-model.md](../architecture/domain-model.md) §integridade) | **Escolhida** |

## Decisão

Persistência do MVP = **AsyncStorage**, uma chave por coleção (`studia.subjects`, `studia.activities`,
`studia.assessments`), valor = JSON da lista, escrita atômica por coleção, sem paginação (volumes pequenos).

Acesso **somente** via repositórios concretos em `src/data/` que implementam interfaces `Repository<T>` do
domínio ([ADR-0004](ADR-0004-organizacao-arquitetural.md)) — nenhuma tela conhece AsyncStorage.

## Consequências

- **Positivas:** funciona no Expo Go sem development build (demonstração em sala simples); atende
  diretamente a Opção 2 do roteiro e RNF-06; o volume do app (dezenas de registros) torna JSON por chave
  a solução mais simples que resolve.
- **Negativas/risco:** integridade referencial não é garantida pelo storage → validação no domínio +
  defesa na leitura (órfãos ignorados); escrita "lista inteira por chave" é suficiente até centenas de
  itens, não milhares — limite aceitável e declarado. A separação por interfaces
  ([ADR-0004](ADR-0004-organizacao-arquitetural.md)) permanece como boa prática estrutural, **não** como
  porta para SQLite — não existe fase pós-MVP.
- **Dependência de ambiente:** a adição da dependência é trivial (`npx expo install
  @react-native-async-storage/async-storage`) **e é implementação** — não acontece nesta etapa.

## Referências

Roteiro item 9 (Opção 2); [domain-model.md](../architecture/domain-model.md);
[screens-and-navigation.md](../architecture/screens-and-navigation.md) §dados por tela; RNF-06.
