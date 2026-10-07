# Spec da Feature — <Nome>

| Campo | Valor |
|---|---|
| **ID** | <feature-slug> |
| **Status** | Rascunho |
| **RF/RNF atendidos** | RF-…, RNF-… |
| **Depende de** | <features/telas/repositórios> |
| **ADRs pertinentes** | ADR-… |
| **Data** | YYYY-MM-DD |

> Template — copiar para `docs/features/<slug>/spec.md` e preencher. Não editar este arquivo.

## 1. Qual problema resolve

<1 parágrafo ligando a feature ao problema do produto (product brief §2).>

## 2. Quem utiliza

<papel/cenário de uso; quando a tela é aberta.>

## 3. Telas e rotas impactadas

| Tela (screens-and-navigation) | Rota Expo Router | Mudança |
|---|---|---|
| | | |

## 4. Comportamento esperado

<fluxo nominal passo a passo, do estado inicial ao resultado persistido.>

## 5. Regras de negócio

| # | Regra | Origem |
|---|---|---|
| RN-1 | | RF-… / OQ-… / ADR-… |

## 6. Estados

- **Vazio:** <o que mostrar>
- **Carregando:** <o que mostrar — local é rápido, mas o carregamento inicial existe>
- **Erro:** <storage ilegível/corrompido → mensagem + ação>
- **Sucesso:** <feedback após operação>

## 7. Formulários e validações

| Campo | Obrigatório | Validação | Mensagem de erro |
|---|---|---|---|

## 8. Impacto em dados

- Entidades/campos lidos: <…>
- Entidades/campos escritos: <…>
- Agregados derivados afetados: <…>
- Chave(s) de storage afetada(s): <…>

## 9. Impacto na UI

- Componentes reutilizáveis usados/novos (com responsabilidade declarada): <…>
- Hook(s) de dados: <…>

## 10. Critérios de aceitação

| # | Critério | Verificação |
|---|---|---|
| AC-1 | | manual / teste |

## 11. Casos de erro

| Caso | Comportamento |
|---|---|

## 12. Fora de escopo desta spec

<o que explicitamente NÃO será feito, e para qual feature/questão pertence.>

## 13. Registro de mudanças

| Data | Mudança | Justificativa |
|---|---|---|
