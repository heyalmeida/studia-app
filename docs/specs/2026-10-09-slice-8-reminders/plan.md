# Plano — Slice 8 (lembretes locais)

| Campo | Valor |
|---|---|
| **Spec** | ./spec.md |
| **Como executar** | prompt **P9** em [../../execution-prompts.md](../../execution-prompts.md) |
| **Risco (Regra 6)** | médio — API de notificações do SDK 57 exige consulta de docs ANTES de codar; migração de modelo |
| **Executor** | opencode (mimo-2.6-flash / apodex-1.1-mini), sessão própria |

## Decisões do planejador (sem margem para o executor)

1. **Só notificação local** — push remoto foi removido do Expo Go (SDK 53+) e o projeto roda e é
   apresentado no Expo Go (ADR-0009 §7). Local: confirmado OK na doc oficial.
2. **Disparo fixo 1 dia antes, 08:00** — sem UI de customização (fora de escopo do roteiro).
3. **Serviço isolado**: `expo-notifications` é importado apenas em `src/services/reminders.ts`
   (mesma disciplina de `storage.ts` com AsyncStorage). Hooks chamam o serviço; telas nunca.
4. **Agendar antes do upsert** — o id vem do schedule e vai no entity gravado. Falha de save após
   schedule pode criar notificação órfã (aceito: raríssimo, `remove`/re-save cancelam pelo id
   persistido na próxima sincronia). Registrado como limitação.
5. **Prazo no passado / hoje-1 já passou** → `scheduleForDueDate` retorna null; o switch fica on,
   `notificationId` null (não bloqueia o save — coerente com `dueDateWarning` de P3).
6. **Web = no-op** por `Platform.OS`; gate de export obrigatório.
