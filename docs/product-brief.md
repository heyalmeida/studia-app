# Product Brief — Studia

| Campo | Valor |
|---|---|
| **Status** | **Aprovado** (2026-10-07) |
| **Data** | 2026-10-07 |
| **Referências** | Roteiro Projeto Final (Etapa 1, itens 1–3); [requisitos funcionais](requirements/functional-requirements.md); [requisitos não funcionais](requirements/non-functional-requirements.md); [decisões de escopo/design](requirements/open-questions.md) |

> Todo item deste documento está marcado como **requisito** (origem: roteiro), **decisão** (registrada em
> ADR), **hipótese** (a confirmar) ou **sugestão** (sem força de obrigação), conforme a taxonomia da
> Regra 0 do [`.clinerules`](../.clinerules).

---

## 1. Produto

**Studia** *(decisão — nome aprovado em 2026-10-07; `app.json` name/slug/scheme usam Studia)*.

*(Requisito de stack — não negociável:)* aplicativo mobile construído com **React Native + Expo +
TypeScript**, compatível com a stack do projeto-base da disciplina.

## 2. Problema

Estudantes gerenciam a rotina acadêmica de forma fragmentada: prazos anotados em caderno, provas esquecidas
até a véspera, materiais espalhados entre apps que não se conversam. O resultado é perda de prazos,
estudo reativo (estudar "quando dá") e nenhuma visão objetiva do que ainda falta fazer por matéria.

*(Hipótese — plausível e comum, mas não validada com usuários reais; suficiente para um projeto
disciplinar.)*

## 3. Público-alvo

Estudantes de cursos técnicos e de graduação que cursam várias matérias simultâneas e precisam organizar
tarefas, trabalhos e provas em um único lugar. Cenário típico: uso no celular, em curtas sessões de
consulta/registro ao longo do dia, sem exigência de internet. *(Requisito do roteiro, item 2: "quem
utilizará o aplicativo".)*

## 4. Proposta de valor

**Um único lugar onde o estudante registra o que tem por fazer (por matéria), enxerga o que vence primeiro e
acompanha o quanto já concluiu.** O Studia não tenta ser agenda completa nem plataforma de aprendizagem —
tenta responder, em segundos, três perguntas: *o que vence primeiro? o que falta por matéria? como andam
minhas provas?*

## 5. Objetivo principal

*(Requisito do roteiro, item 2.)* O usuário deve conseguir, no aplicativo:

1. cadastrar e manter matérias;
2. registrar atividades (tarefas/trabalhos/leituras) vinculadas a uma matéria, com prazo;
3. marcar atividades como concluídas, vendo o progresso por matéria;
4. registrar avaliações (provas) com data, vinculadas a uma matéria;
5. abrir o aplicativo e ver, na tela inicial, um resumo da rotina: pendências, prazos próximos e provas
   futuras.

## 6. Natureza do projeto *(decisão — 2026-10-07)*

**MVP acadêmico autocontido.** O projeto nasce, vive e morre na entrega da disciplina: não há fase
pós-MVP, roadmap de produto, contas, sincronização, monetização ou "pensar como startup". A única
pergunta de escopo para qualquer ideia nova é: *"isso ajuda a cumprir o roteiro e a apresentar o app?"*.
Se não, é fora do escopo definitivamente.

## 7. Escopo aprovado

Contemplado — mapeado aos 9 RF e aos 6 RNF:

- CRUD de **matérias** (validação de formulário; exclusão bloqueada quando há registros vinculados);
- CRUD de **atividades** com prazo, situação (pendente/concluída) e filtro/listagem;
- Cadastro e listagem de **avaliações** (agendada/realizada) — sem notas;
- **Painel inicial** com resumo de pendências, prazos próximos, próximas avaliações e progresso;
- **Persistência local** AsyncStorage ([ADR-0002](adr/ADR-0002-estrategia-de-persistencia.md));
- Navegação por abas + rotas de formulário (Expo Router — [ADR-0003](adr/ADR-0003-estrategia-de-navegacao.md));
- **Identidade monocromática** preto-e-branco, light/dark automático, matéria identificada por monograma
  ([ADR-0006](adr/ADR-0006-identidade-visual-monocromatica.md));
- UI em **português** (OQ-11).

## 8. Fora de escopo — definitivamente

Reclassificada em 2026-10-07: não existe coluna "pós-MVP".

| Ideia | Situação | Motivo |
|---|---|---|
| Notas/médias em avaliações | **Descartada** | OQ-04 resolvida: progresso = atividades concluídas |
| Tema escuro | **No escopo de graça** | Monocromático automático já é a decisão de design ([ADR-0006](adr/ADR-0006-identidade-visual-monocromatica.md)) |
| Calendário/mês de prazos | **Descartada** | Lista ordenada por prazo atende o objetivo |
| Notificações de prazo | **Descartada** | `expo-notifications` exige development build; risco na demonstração |
| Login / múltiplos usuários / nuvem | **Descartada** | App 100% local por decisão ([ADR-0002](adr/ADR-0002-estrategia-de-persistencia.md)) |
| Backup/exportação de dados | **Descartada** | Sem requisito |
| API externa / back-end | **Descartada** | OQ-13 resolvida; armazenamento local é característica do produto |
| Hábitos / sessões de estudo cronometradas | **Descartada** | Fora do problema central |
| SQLite / migração de storage | **Descartada** | Volume não justifica; incompatível com Expo Go |

## 9. Contexto de entrega

*(Requisito do roteiro.)* Projeto **em dupla**; entrega = documento único da Etapa 1 (PDF, e-mail) +
código versionado no GitHub com acesso ao professor. Nomes da dupla, turma, data de entrega e visibilidade
do repositório: [OQ-07](requirements/open-questions.md).
