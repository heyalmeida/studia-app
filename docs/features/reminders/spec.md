# Spec da Feature — Lembretes locais de prazo

| Campo | Valor |
|---|---|
| **ID** | `reminders` |
| **Status** | **Implementada** (2026-10-09) |
| **RF/RNF atendidos** | RF-04, RF-08 (datas como âncora de cobrança); RNF-03 (100% offline — notificação local não usa rede) |
| **Depende de** | `activities`, `assessments`, `ui-kit` (`SwitchField`), permissão do sistema |
| **ADRs pertinentes** | ADR-0002 (persistência, campos novos com migração de leitura), ADR-0004 (camadas/DIP), ADR-0009/0010 (identidade escura + `StyleSheet`) |
| **Data** | 2026-10-09 |
| **Spec de execução** | [../specs/2026-10-09-slice-8-reminders/spec.md](../specs/2026-10-09-slice-8-reminders/spec.md) |

## 1. Qual problema resolve

O problema central do Studia ([product-brief §2](../../product-brief.md)) é **perder o prazo por
esquecimento**, não por falta de registro. O aluno registra a atividade e a prova, mas o app é
silencioso: nada acontece entre "cadastrei" e "venceu". Esta feature fecha esse ciclo com uma
**notificação local** disparando 1 dia antes, às 08:00 — sem servidor, sem conta, sem rede
(RNF-03): a agenda do aparelho faz o trabalho.

## 2. Quem utiliza

O estudante que quer ser lembrado do que vence amanhã. O lembrete é **opt-in por registro**: cada
atividade com prazo e cada avaliação carrega seu próprio switch "Lembrar", então quem prefere
controle manual simplesmente não liga nada.

## 3. Telas e rotas impactadas

| Tela (screens-and-navigation) | Rota Expo Router | Mudança |
|---|---|---|
| T6 — Formulário de atividade | `/activity-form` | Switch "Lembrar" abaixo do campo Prazo; desabilitado sem prazo |
| T7 — Formulário de avaliação | `/assessment-form` | Switch "Lembrar" abaixo do campo Data; sempre habilitado |
| T3 — Lista de atividades | `/(tabs)/activities` | Indireta: concluir/excluir cancela o lembrete agendado |
| T4 — Lista de avaliações | `/(tabs)/assessments` | Indireta: marcar como realizada cancela o lembrete agendado |

## 4. Comportamento esperado

1. O aluno abre o formulário de atividade/avaliação e vê o switch **"Lembrar"** — desligado por
   padrão, com a descrição "Avisa um dia antes do prazo" (ou "da data", na avaliação).
2. Ele escolhe a data e liga o switch. No primeiro uso, o **sistema** pergunta a permissão de
   notificação; o canal Android `studia-reminders` ("Lembretes", importance alta) é criado antes do
   prompt porque, no Android 13+, o prompt não aparece sem canal.
3. Ao salvar, o app agenda uma notificação **local** para **08:00 do dia anterior** à data, no fuso
   do aparelho, com o título **"Lembrete"** e o corpo **`Amanhã: <título da atividade/avaliação>`**.
   O id devolvido pelo sistema é gravado no registro (`notificationId`) — **um id por entidade**.
4. Se o aluno concluir a atividade, marcar a avaliação como realizada ou excluir o registro, o
   agendamento é cancelado: a notificação não chega.
5. Se ele editar mantendo o lembrete ligado e mudar a data, o agendamento antigo é cancelado **antes**
   do novo — só a nova notificação dispara.
6. Se desligar o switch ou limpar a data, o agendamento é cancelado e `notificationId` vira `null`.
7. Se a permissão for negada, ou o prazo já passou (o instante de 08:00 do dia anterior já ficou para
   trás), **nada é agendado**: o registro é salvo assim mesmo, com o switch ligado e `notificationId`
   `null` — limitação conhecida da spec, não erro.

## 5. Regras de negócio

| # | Regra | Origem |
|---|---|---|
| RN-1 | O disparo é 1 dia antes da data, às **08:00 no fuso local** do aparelho | spec Slice 8 |
| RN-2 | Sem data não há lembrete: o switch da atividade fica desabilitado e, ao salvar, `reminder` é forçado a `false` | spec Slice 8 |
| RN-3 | Um registro tem **no máximo um** agendamento vivo; editar cancela o id antigo antes de agendar o novo | CA-8.4 |
| RN-4 | Concluir/realizar, excluir ou desligar o lembrete cancela o agendamento e zera `reminder`/`notificationId` (persistido) | CA-8.3 |
| RN-5 | Instante já passado → não agenda (`null`), **sem** bloquear o salvamento — coerente com o aviso não-bloqueante de data passada | CA-8.1, spec Slice 8 |
| RN-6 | Permissão negada ou erro do sistema → `null`, sem quebrar a tela | RNF-04 |
| RN-7 | **Web é no-op**: nenhuma função do serviço toca a API de notificações | Regra 4, gate de export |
| RN-8 | Cancelamento nunca lança: notificação morta não pode impedir excluir/concluir | RNF-04 |
| RN-9 | Somente **notificação local**; nenhum token, push remoto ou chamada de rede | RNF-03, product-brief §8 |

## 6. Estados

- **Desligado:** trilha na cor de borda, botão em texto terciário. É o estado inicial de todo
  registro novo.
- **Ligado:** trilha na cor de destaque, botão no contraste do destaque — o estado "on" é o único
  lugar do formulário em que o índigo aparece (ADR-0009).
- **Desabilitado:** opacidade 0.5 e toque inerte (atividade sem prazo, ou formulário sem matéria).
- **Erro:** não há estado de erro visível. Falha de agendamento é absorvida pelo serviço
  (`console.warn` + `null`); o registro é salvo normalmente. É uma escolha deliberada — um lembrete
  que falhou não pode impedir o aluno de cadastrar o trabalho.

## 7. Formulários e validações

| Campo | Obrigatório | Validação | Mensagem de erro |
|---|---|---|---|
| Lembrar (atividade) | Não | Booleano; **não validado** no domínio; desligado quando o prazo está vazio | — |
| Lembrar (avaliação) | Não | Booleano; **não validado** no domínio; sempre habilitado (a data é obrigatória) | — |

`ActivityFormInput`/`AssessmentFormInput` ganharam `reminder?: boolean` em `src/domain/validation.ts`
**sem** regra de validação: é estado de formulário, e a regra de negócio do agendamento mora no
serviço, não no domínio de formulário (Regra 4.4/4.5).

## 8. Impacto em dados

- **Campos lidos:** `Activity.reminder`, `Activity.notificationId`, `Assessment.reminder`,
  `Assessment.notificationId` (mais `dueDate`/`date` como âncora do instante).
- **Campos escritos:** os mesmos quatro, em create/update, em `toggleStatus` e (por indireção) na
  remoção.
- **Migração de leitura:** `migrateActivities`/`migrateAssessments` normalizam registros dos Slices
  0–7 para `{ reminder: false, notificationId: null }` — nunca lançam (RNF-04).
- **Agregados derivados afetados:** nenhum — progresso e painel não leem os campos novos.
- **Chaves de storage:** `studia:activities` e `studia:assessments` (via `STORAGE_KEYS`).

## 9. Impacto na UI

- **Componente novo reutilizável:** `src/components/ui/SwitchField.tsx` — linha de formulário com
  switch desenhado à mão (50×30, botão 26, offsets 2/22), `accessibilityRole="switch"`,
  `accessibilityState={{ checked }}`, alvo de toque `TOUCH_TARGET` e feedback do `Touchable` do app.
  Vive em `ui/` por ser usado em 2 telas. Não usa o `Switch` nativo porque ele não segue o tema
  escuro nem aceita tokens (ADR-0009/0010).
- **Hooks:** `use-activities` e `use-assessments` — nenhuma assinatura nova na API pública; os
  formulários passam `reminder` no input e o hook resolve o agendamento.
- **Serviço:** `src/services/reminders.ts` — **único** módulo que importa `expo-notifications`,
  por decisão de arquitetura (o SDK nativo fica isolado atrás de 3 funções).

## 10. Critérios de aceitação

| # | Critério | Verificação |
|---|---|---|
| CA-8.1 | Primeiro "Lembrar" ligado pede permissão; negada salva sem agendar (switch on, `notificationId` null) | Manual no Expo Go |
| CA-8.2 | Prazo amanhã + lembrete ligado → "Amanhã: <título>" às 08:00 do dia anterior | Manual (adiantar o relógio do aparelho) |
| CA-8.3 | Desligar / concluir / excluir → notificação cancelada | Manual |
| CA-8.4 | Editar com lembrete ligado e data nova → só a nova dispara | Manual |
| CA-8.5 | Dados dos Slices anteriores abrem e salvam sem erro | Manual + `tsc` (tipos com defaults migrationados) |
| CA-8.6 | `tsc`, `expo lint` e `expo export --platform web` limpos; app roda no Expo Go | **Automatizado** — ver relatório da execução |

## 11. Casos de erro

| Caso | Comportamento |
|---|---|
| Permissão de notificação negada | `scheduleForDueDate` devolve `null`; registro salvo com `reminder: true`, `notificationId: null` |
| Prazo hoje ou no passado | `null` — 08:00 do dia anterior já passou; registro salvo |
| Prazo/data ausente na atividade | `reminder` forçado a `false`, agendamento antigo cancelado |
| `dueISO` malformado | `parseISODateParts` devolve `null` → sem agendamento, sem exceção |
| Falha do sistema ao agendar | `try/catch` → `console.warn` + `null` |
| Falha ao cancelar (id morto) | `try/catch` vazio — concluir/excluir nunca falham por isso |
| Registro JSON antigo sem os campos | Migração de leitura completa com defaults; nunca lança |
| **Android + Expo Go** | Ver §12: o barrel do pacote lança no import; contornado com imports profundos |
| Web | Todas as funções do serviço retornam o valor neutro sem tocar a API |

## 12. Fora de escopo desta spec

- **Push remoto** (exige dev build desde o SDK 53) — fora de escopo por [product-brief §8](../../product-brief.md).
- Horário/antecedência configurável, snoozing, badge count, som ou canal configurável pelo usuário.
- Notificação que abre o app na tela do registro (deep link por notificação) — não implementado;
  o toque na notificação usa o comportamento padrão do sistema.
- Uma limitação **conhecida e aceita**: se o agendamento falhar depois de um salvamento bem-sucedido,
  pode sobrar uma notificação órfã (registrada no [plan da spec](../specs/2026-10-09-slice-8-reminders/plan.md),
  decisão 4). O caminho de recuperação é desligar/editar o lembrete ou excluir o registro, que
  cancelam pelo id persistido.

## 13. Registro de mudanças

| Data | Mudança | Justificativa |
|---|---|---|
| 2026-10-09 | Spec escrita e marcada **Implementada** | Fechamento do Slice 8 ([spec de execução](../specs/2026-10-09-slice-8-reminders/spec.md)) |
