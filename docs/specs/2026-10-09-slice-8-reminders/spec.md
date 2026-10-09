# Spec — Slice 8: Lembretes locais de prazo (notificações)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-09 |
| **Feature** | `reminders` |
| **RF/RNF** | RF-04, RF-08 (datas); RNF-03 (100% offline — notificação local não usa rede) |
| **ADRs** | 0002 (persistência — campos novos com migração de leitura), 0004, 0005, 0009/0010 (UI) |
| **Risco** | médio — API de notificações do SDK 57 muda rápido (docs-obrigatório) + migração de modelo + permissão do sistema |

## Objetivo

Não deixar o aluno perder prazo: opção **'Lembrar'** em atividades (com prazo) e avaliações, que
agenda uma **notificação local** para 1 dia antes, às 08:00. Local notifications funcionam no Expo Go
(verificado em docs.expo.dev/versions/latest/sdk/notifications.md: remote push foi removido do Expo Go
no SDK 53+, mas **notificações locais permanecem**).

## Contrato de dados

`Activity` e `Assessment` ganham (ambos opcionais na leitura, defaults obrigatórios):

```typescript
reminder: boolean;            // default false
notificationId: string | null; // id retornado por expo-notifications; null = nada agendado
```

**Migração de leitura** nos repositórios (padrão `migrateSubjects` já existente em
`src/storage/subject.repository.ts` — replicar): registros antigos viram
`{ reminder: false, notificationId: null }` na primeira leitura.

## Contrato do serviço

`src/services/reminders.ts` — **único** módulo que importa `expo-notifications`:

| Função | Contrato |
|---|---|
| `ensurePermission(): Promise<boolean>` | `getPermissionsAsync`; senão `requestPermissionsAsync` (iOS: alert+sound+badge; Android: canal 'studia-reminders' criado uma vez); retorna granted |
| `scheduleForDueDate(title: string, dueISO: string): Promise<string \| null>` | alvo = **08:00 do dia anterior** à data (`new Date(y, m-1, d-1, 8, 0, 0)` local); se alvo já passou → **null** (não agenda, limitação documentada); permissão negada → null; sucesso → id |
| `cancel(id: string \| null): Promise<void>` | null = no-op; `try/catch` engolido (remover notificação morta não pode quebrar exclusão) |
| Web | todas no-op via `Platform.OS === 'web'` (o gate de export não pode quebrar) |

Corpo da notificação: título `'Lembrete'`, corpo `` `Amanhã: ${title}` `` (PT-BR, sem emoji).

## Hooks (fluxo de sincronia)

`ActivityFormInput` / `AssessmentFormInput` ganham `reminder?: boolean` (validation não o valida).
No create/update: se `reminder` e data válida → `scheduleForDueDate` primeiro, guarda o id no entity
(`reminder: true` mesmo se null — switch marcado sem agenda é a limitação de prazo já passado); se
reminders desligado/sem data → `cancel` do id antigo e `notificationId: null`.
`remove` → cancela antes de excluir. `toggleStatus` para `concluida`/`realizada` → cancela, zera
`notificationId` e `reminder` (persiste via upsert).

## UI

- `src/components/ui/SwitchField.tsx` (≥2 telas → ui/): linha tocável, label + descrição, switch
  50×30 — trilha `textTertiary` off / `accent` on; `accessibilityRole='switch'` (TOUCH_TARGET no alvo).
- ActivityFormPage: switch **'Lembrar'** / 'Avisa um dia antes do prazo' sob o campo de prazo;
  **disabled quando o prazo está vazio**. AssessmentFormPage: mesmo sob Data (sempre habilitado).
- ADR-0009/0010: StyleSheet + tokens; accent só aqui como estado 'on' (ação não é botão).

## Critérios de aceitação

- **CA-8.1** Primeiro toggle 'Lembrar' on pede permissão do sistema; negada → salva sem agendar (switch fica on, `notificationId` null).
- **CA-8.2** Atividade com prazo amanhã + lembrar on → notificação 'Amanhã: <título>' às 08:00 do dia anterior (teste: adiantar relógio do aparelho).
- **CA-8.3** Desligar lembrar / excluir / concluir → notificação cancelada (não chega).
- **CA-8.4** Editar mantendo reminder on e mudar o prazo → cancela a antiga e agenda a nova (um id por entity).
- **CA-8.5** Migração: dados de Slices anteriores (sem os campos) carregam sem erro (`reminder:false`, `notificationId:null`).
- **CA-8.6** tsc + lint + export web limpos; app roda no Expo Go.

## Fora de escopo

Push remoto (exige dev build — removido do Expo Go), notificação no dia/hora customizável,
snoozing, badge count, som customizado, canal configurável pelo usuário.
