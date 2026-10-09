# Tarefas — Slice 8: lembretes locais

- [x] Executar prompt P9 de docs/execution-prompts.md na íntegra (deps: `npx expo install expo-notifications`)
- [x] Docs-obrigatório antes de codar (AGENTS.md): confirmar o formato de trigger de `scheduleNotificationAsync` no SDK 57 em docs.expo.dev (llms.txt → sdk/notifications)
- [x] Gates: `npx tsc --noEmit` + `npx expo lint` + `npx expo export --platform web` limpos (evidência no relatório)
- [ ] Checklist de AC da ./spec.md verificado (manual: Expo Go — **pendente, depende de aparelho físico**)
- [ ] Diff revisado pelo planejador antes do próximo slice
- [x] Regras 2/7: CHANGELOG + feature `docs/features/reminders/` + índice + domain-model/architecture/screens sincronizados

## Evidência da execução

- **Doc consultada:** <https://docs.expo.dev/versions/v57.0.0/sdk/notifications/> (via `llms.txt`,
  página Markdown da versão 57).
- **Trigger usado:** `{ type: SchedulableTriggerInputTypes.DATE, date: Date, channelId? }`
  (`DateTriggerInput`). `torchScheduled` **não existe** no SDK 57; `dateComponents` é do trigger
  `CALENDAR` (iOS, repetitivo) e `seconds` do `TIME_INTERVAL`.
- **Nomes confirmados na doc:** `getPermissionsAsync`, `requestPermissionsAsync`,
  `setNotificationChannelAsync`, `scheduleNotificationAsync`, `cancelScheduledNotificationAsync`,
  `setNotificationHandler`.
- **Divergência em relação ao prompt P9:** o barrel `expo-notifications` **lança no `import`** em
  Android + Expo Go (`TokenEmitter` → `warnOfExpoGoPushUsage()` no escopo do módulo). O serviço usa
  imports profundos dos módulos necessários para o lembrete local, que não puxam essa cadeia.
  Registrado no `src/services/reminders.ts` e no CHANGELOG.
- **Gates:** `npx tsc --noEmit` ✅ · `npx expo lint` ✅ · `npx expo export --platform web` ✅ (13 rotas
  estáticas). `grep "expo-notifications" src/` → apenas `src/services/reminders.ts`.
- **AC pendentes de aparelho físico:** CA-8.1 a CA-8.5 (permissão, disparo às 08:00 com o relógio
  adiantado, cancelamento em concluir/excluir, troca de data, migração de registros antigos).
  CA-8.6 parcial: os três comandos automatizados passaram; o "app roda no Expo Go" precisa do
  aparelho.
