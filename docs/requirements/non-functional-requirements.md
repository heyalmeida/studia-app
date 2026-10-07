# Requisitos Não Funcionais — Studia

| Campo | Valor |
|---|---|
| **Status** | **Aprovado como base (2026-10-07)** — RNF-05/06 complementados por ADR-0006 (monocromático) |
| **Origem** | Roteiro Projeto Final, item 3 ("no mínimo 4 requisitos não funcionais") + práticas de portfólio |

Cada RNF abaixo tem **identificador, descrição, justificativa e forma de verificação**. Nenhum RNF técnico
foi adicionado sem ligação com um aspecto real do projeto (usabilidade, organização, manutenção, desempenho,
compatibilidade, erros, legibilidade, persistência — os aspectos sugeridos no enunciado).

---

## RNF-01 — Usabilidade e interface organizada

**Descrição.** A interface deve ser organizada e fácil de utilizar: no máximo 2 toques entre abrir o app e
executar uma ação comum (consultar prazos, concluir tarefa), alvos de toque com pelo menos ~44pt, navegação
entre as telas principais sempre acessível (abas), e padrão visual consistente (espaçamentos, alinhamentos,
cores e tipografia) entre todas as telas. Textos legíveis com contraste adequado.

**Justificativa.** Requisito explícito do roteiro (RNF01/RNF02 dos exemplos: "interface organizada e fácil",
"textos legíveis") e do Etapa 3 ("manter padrão visual entre as telas"). Além disso, o público usa o app em
sessões curtas no celular — fricção mata o hábito de registrar.

**Verificação.** Inspeção de UI por tela contra um checklist de padrões (definido na spec do UI Kit);
percurso "abrir app → ver o que vence hoje" em ≤2 toques.

## RNF-02 — Organização do código em camadas

**Descrição.** O código deve estar organizado em pastas por responsabilidade (`app/` rotas, `screens/`,
`components/`, `domain/`, `storage/`, `styles/`, `hooks/`, `constants/` — detalhe em
[architecture.md](../architecture/architecture.md)), sem concentrar lógica em `App.tsx`/`_layout.tsx`, com
separação clara entre UI, regras de negócio e persistência. O projeto deve conter ao menos 3 componentes
reutilizáveis usados em mais de uma tela.

**Justificativa.** Requisito explícito do roteiro (RNF03 dos exemplos; Etapa 2 item 5 "evitar concentrar
todo o código em um único arquivo"; Etapa 3 "≥3 componentes reutilizáveis usados em mais de uma parte").
É também o que torna o repositório legível como portfólio.

**Verificação.** Revisão da árvore `src/` contra o mapeamento do ADR-0004; busca por importação direta de
storage em telas (deve ser zero — telas consomem hooks/repositórios).

## RNF-03 — Manutenibilidade e segurança de tipos

**Descrição.** TypeScript em modo `strict` (já habilitado no `tsconfig.json`), sem `any` gratuito (cada
`any`/supressão precisa de motivo), ESLint do Expo sem erros no estado final, nomes de arquivos e
identificadores consistentes com as convenções ([.clinerules Regra 4](../../.clinerules)), e commits
pequenos semanticamente claros demonstrando o desenvolvimento por etapas.

**Justificativa.** Aspectos "manutenção" e "legibilidade" pedidos pelo enunciado; o roteiro exige que os
commits "demonstrem o desenvolvimento do projeto ao longo das etapas". `strict` é custo zero — já vem no
scaffold.

**Verificação.** `npx tsc --noEmit` e `npx expo lint` limpos; busca por `: any` e `@ts-ignore` com justificativa;
histórico `git log development`.

## RNF-04 — Tratamento de erros e feedback ao usuário

**Descrição.** O aplicativo deve apresentar mensagens claras quando ocorrer erro: validação de formulário
(mensagem específica por campo), falha de escrita/leitura do armazenamento (mensagem sem texto técnico),
tentativa de exclusão (confirmação obrigatória) e operações bem-sucedidas (feedback positivo). O app não
pode quebrar (tela branca/exception não tratada) diante de dado ausente, corrompido ou entrada inválida.

**Justificativa.** Requisito explícito do roteiro (RNF04 dos exemplos: "apresentar mensagens quando ocorrer
algum erro"; Etapa 4: "exibir mensagens claras quando houver informações inválidas" e "impedir o cadastro").

**Verificação.** Roteiro de testes manuais por tela cobrindo: campo vazio, formato inválido, lista vazia,
exclusão cancelada, armazenamento corrompido (injeção manual de JSON inválido na primeira chave).

## RNF-05 — Compatibilidade mobile (Android prioritário)

**Descrição.** O app deve funcionar corretamente em dispositivos móveis: orientação portrait, respeito a
safe areas (notch/status bar), layout fluido entre resoluções comuns (sem cortes nem overflow), uso de
`StyleSheet`/Flexbox, e comportamento correto em tema claro. Android é plataforma de verificação obrigatória;
iOS é validação de paridade quando houver meio de testar ([OQ-06](open-questions.md)).

**Justificativa.** Requisito explícito do roteiro (RNF05 dos exemplos; Etapa 3 "organizar layout com
StyleSheet e Flexbox"). O projeto-base da disciplina é um app mobile; web não é alvo de aceite.

**Verificação.** Execução em dispositivo físico ou emulador Android (e sim/real iOS se disponível) no
checklist da Etapa 6 do roteiro; teste de `Text` longo e teclado aberto em cada formulário.

## RNF-06 — Persistência confiável e funcionamento offline

**Descrição.** Todo dado do usuário (matérias, atividades, avaliações) deve sobreviver a fechamento e
reabertura do aplicativo, sem perda na gravação de uma operação válida. O aplicativo deve funcionar
integralmente sem conexão de rede — API externa é decisão adiada e fora do MVP.

**Justificativa.** Aspectos "persistência de dados" e "compatibilidade" do enunciado; requisito acadêmico
explícito (Etapa 5: "salvar, recuperar quando o aplicativo for aberto novamente"; checklist Etapa 6: "os
dados continuam disponíveis quando necessário"). Estudante usa o app no ônibus, sem rede.

**Verificação.** Ciclo "cadastrar → fechar app → reabrir → dados íntegros" por entidade; gravação atômica
por coleção (uma escrita por chave); teste em modo avião.
