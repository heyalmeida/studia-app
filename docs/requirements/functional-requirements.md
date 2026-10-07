# Requisitos Funcionais — Studia

| Campo | Valor |
|---|---|
| **Status** | **Aprovado como base (2026-10-07)** — ajustes caso a caso durante a escrita das specs |
| **Origem** | Roteiro Projeto Final, item 3 ("no mínimo 6 requisitos funcionais") e conceito do produto |
| **Consumido por** | [Product Brief](../product-brief.md), [especificações por feature](../features/), specs de implementação |

**Regra de ouro:** todo RF abaixo resolve uma parte do problema do Studia (organizar a rotina acadêmica em
um lugar). Nenhum requisito foi criado apenas para atingir o mínimo de 6 — a disciplina dos exemplos do
roteiro (CRUD de "tarefa") foi expandida naturalmente para as 3 entidades do domínio.

Cada requisito tem: **identificador, título, descrição, justificativa e critérios de aceitação (CA)**.

---

## RF-01 — Cadastrar matéria

**Descrição.** O sistema deve permitir cadastrar uma matéria informando **nome** e **professor(a)**
(opcional). A matéria é identificada visualmente por um **monograma** derivado do nome (decisão de design
[ADR-0006](../adr/ADR-0006-identidade-visual-monocromatica.md)) — não existe campo de cor.

**Justificativa.** Matéria é a entidade central do domínio: sem ela, atividades e avaliações não têm a quem
pertencer, e a promessa "um único lugar por matéria" não existe.

**Critérios de aceitação.**

- CA-01.1 O formulário exige nome preenchido; vazio → mensagem "Informe o nome da matéria." e cadastro
  bloqueado (RNF-04).
- CA-01.2 Nome com menos de 2 caracteres → mensagem de erro específica.
- CA-01.3 Nome já existente (comparação sem diferenciar maiúsculas/minúsculas e espaços) → mensagem de erro,
  cadastro bloqueado ([OQ-12](open-questions.md)).
- CA-01.4 Após cadastro válido: feedback visual ao usuário (RNF-04) e a matéria aparece na lista (RF-02).
- CA-01.5 A matéria persiste após fechar e reabrir o aplicativo (RNF-06).

## RF-02 — Listar e visualizar as matérias

**Descrição.** O sistema deve listar as matérias cadastradas em cards ordenados por nome, exibindo, por
matéria: quantidade de atividades pendentes, quantidade de avaliações agendadas e progresso (atividades
concluídas ÷ total).

**Justificativa.** É a "lista de dados" exigida pelo roteiro e a visão solicitada no problema: "o que falta
por matéria?". O progresso deriva das atividades concluídas — não exige notas (ver [OQ-04](open-questions.md)).

**Critérios de aceitação.**

- CA-02.1 Lista exibe todas as matérias persistidas, ordenadas alfabeticamente.
- CA-02.2 Sem matérias cadastradas → estado vazio com texto orientando o cadastro (RNF-04), e não uma tela
  em branco.
- CA-02.3 Cada card mostra os agregados do RF-06/RF-08 corretamente após alterações neles.
- CA-02.4 Toque em um card abre a edição (RF-03).

## RF-03 — Editar e excluir matéria

**Descrição.** O sistema deve permitir editar os dados de uma matéria existente e excluí-la, com confirmação
explícita antes da exclusão.

**Justificativa.** Cadastro sem correção gera dados obsoletos; sem exclusão, a lista envelhece com matérias
de semestres passados — e o app deixa de refletir a rotina real.

**Critérios de aceitação.**

- CA-03.1 O formulário de edição abre com os valores atuais preenchidos e aplica as validações do RF-01
  (exceto a colisão com si mesma).
- CA-03.2 Alteração válida → feedback + lista atualizada + persistência (RNF-06).
- CA-03.3 Exclusão → diálogo de confirmação obrigatório (RNF-04).
- CA-03.4 Matéria com atividades ou avaliações vinculadas → exclusão **bloqueada** com mensagem explicativa
  (OQ-03 resolvida: sem cascata — "Esta matéria tem N atividades e M avaliações; exclua-os primeiro.").

## RF-04 — Cadastrar atividade vinculada a uma matéria

**Descrição.** O sistema deve permitir cadastrar uma atividade (tipo: tarefa, trabalho, leitura ou estudo)
informando título, matéria (obrigatória), prazo (opcional) e descrição (opcional), criando-a em situação
pendente.

**Justificativa.** A tarefa com prazo é o objeto que materializa o problema central ("prazos perdidos").
O vínculo obrigatório com matéria é o que permite a visão por matéria e o progresso.

**Critérios de aceitação.**

- CA-04.1 Título vazio → mensagem de erro; cadastro bloqueado.
- CA-04.2 Matéria não selecionada → mensagem de erro; cadastro bloqueado.
- CA-04.3 Preenchimento do prazo exige data válida (formato `DD/MM/AAAA`); data no passado deve gerar
  **aviso** sem bloquear (cadastro de atividade atrasada é legítimo).
- CA-04.4 Com zero matérias cadastradas, o formulário orienta o usuário a cadastrar uma matéria antes
  (ponte de navegação), em vez de permitir salvar sem vínculo.
- CA-04.5 Atividade criada aparece na lista (RF-05) e no painel (RF-09), em situação pendente, e persiste
  (RNF-06).

## RF-05 — Listar e filtrar atividades

**Descrição.** O sistema deve listar as atividades ordenadas por prazo (mais próximos primeiro, sem prazo ao
final), com filtro por situação: todas, pendentes, concluídas.

**Justificativa.** A pergunta "o que vence primeiro?" só é respondível com ordenação por prazo. O filtro
pendente/concluída separa o trabalho restante do histórico.

**Critérios de aceitação.**

- CA-05.1 Ordenação correta com prazo; atividades sem prazo agrupadas ao final.
- CA-05.2 Filtro alterna entre todas/pendentes/concluídas e reflete imediatamente na lista.
- CA-05.3 Cada item exibe: título, matéria (monograma + nome), prazo (com destaque tipográfico/badge para
  atrasadas e para as que vencem em até 2 dias) e situação.
- CA-05.4 Lista vazia no filtro atual → estado vazio específico (ex.: "Nenhuma atividade pendente 🎉").

## RF-06 — Alterar a situação de uma atividade (concluir / reabrir)

**Descrição.** O sistema deve permitir marcar uma atividade como concluída e reabri-la, diretamente da lista
ou do detalhe, atualizando o progresso da matéria (RF-02) e o resumo do painel (RF-09).

**Justificativa.** É a função de "marcação de conclusão" do exemplo do roteiro (RF06) e o motor do
progresso acadêmico do MVP — sem estado, nada é "organizado".

**Critérios de aceitação.**

- CA-06.1 Alternar situação persiste imediatamente (RNF-06) e atualiza contadores do card da matéria (RF-02)
  e do painel (RF-09).
- CA-06.2 A ação funciona em ambos os sentidos (concluir e reabrir).
- CA-06.3 Feedback visual da mudança na própria lista (sem recarregar a tela).

## RF-07 — Editar e excluir atividade

**Descrição.** O sistema deve permitir corrigir os dados de uma atividade (mesmas validações do RF-04) e
excluí-la, com confirmação.

**Justificativa.** Prazos mudam, títulos são digitados errados, atividades canceladas acontecem — registro
imutável degradaria a confiança nos dados.

**Critérios de aceitação.**

- CA-07.1 Edição abre preenchida; validações e feedback idênticos a RF-04.
- CA-07.2 Exclusão exige confirmação (RNF-04) e remove a atividade de listas, painel e agregados de
  progresso.

## RF-08 — Cadastrar e gerenciar avaliações

**Descrição.** O sistema deve permitir cadastrar uma avaliação (prova, seminário, entrega avaliativa) com
título, matéria (obrigatória) e data (obrigatória), consultá-las em lista ordenada pela data (agendadas
primeiro) e alternar sua situação entre agendada e realizada. Edição e exclusão seguem as regras de
confirmação do RF-03/RF-07.

**Justificativa.** Avaliações têm consequência real diferente de tarefas (uma prova vale nota); precisam de
atenção própria. O roteiro cita "avaliações/provas" no conceito inicial, e "provas futuras" é uma das três
perguntas que o produto promete responder.

**Critérios de aceitação.**

- CA-08.1 Título, matéria e data são obrigatórios; ausente/inválido → mensagem específica e bloqueio.
- CA-08.2 Data no passado → aviso, sem bloquear (permite registrar prova já realizada).
- CA-08.3 Lista ordena por proximidade da data; agendadas antes de realizadas.
- CA-08.4 Avaliação realizada permanece visível (histórico) e conta no resumo do painel.
- CA-08.5 Persistência e atualização dos agregados do card da matéria (RF-02).
- CA-08.6 Registrar **nota** da avaliação realizada: **descartado** (OQ-04 resolvida: sem notas; progresso =
  atividades concluídas).

## RF-09 — Painel inicial de visão da rotina

**Descrição.** A primeira tela do aplicativo deve apresentar um resumo da rotina acadêmica: total de
atividades pendentes, atividades que vencem hoje/nos próximos dias, próximas avaliações e progresso geral
(soma de atividades concluídas ÷ total).

**Justificativa.** É a entrega direta da proposta de valor ("abrir e ver o que vence primeiro") e a tela
que dá motivo para o usuário voltar ao app diariamente, não só para cadastrar.

**Critérios de aceitação.**

- CA-09.1 Todos os números derivados corretamente das entidades persistidas (atualizados após RF-04…RF-08).
- CA-09.2 Com dados zerados: exibe estado inicial convidando ao primeiro cadastro, sem números quebrados.
- CA-09.3 Cada bloco do painel navega para a tela relacionada (lista de atividades, avaliações, matérias).
- CA-09.4 O painel carrega a partir do armazenamento local sem internet (RNF-06).

---

## Matriz de rastreabilidade

| RF | Entidades afetadas (modelo de domínio) | Telas | Features | Requisitos acadêmicos cobertos |
|---|---|---|---|---|
| RF-01 | Matéria | T5 | subjects | formulário + validação |
| RF-02 | Matéria (+ agregados de Atividade/Avaliação) | T2, T1 | subjects | lista de dados |
| RF-03 | Matéria | T5 | subjects | CRUD |
| RF-04 | Atividade | T6 | activities | formulário + validação |
| RF-05 | Atividade | T3 | activities | lista de dados |
| RF-06 | Atividade | T3 | activities | CRUD / marcação |
| RF-07 | Atividade | T6 | activities | CRUD |
| RF-08 | Avaliação | T4, T7 | assessments | formulário + lista |
| RF-09 | todas (leitura) | T1 | dashboard | visão da rotina |

*(T1…T7 definidos em [screens-and-navigation.md](../architecture/screens-and-navigation.md).)*
