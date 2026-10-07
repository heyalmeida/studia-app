# Plano — Slice 1 (navigation-uikit)

| Campo | Valor |
|---|---|
| **Spec** | ./spec.md |
| **Como executar** | prompt **P1** em [../../execution-prompts.md](../../execution-prompts.md) — o prompt embute contratos de arquivos, assinaturas e commit |
| **Risco (Regra 6)** | médio — ver spec |
| **Executor** | modelo pequeno (mimo-2.6-flash / apodex-1.1-mini), sessão própria |

Decisões locais já tomadas pelo planejador (sem margem para o executor): persistência AsyncStorage +
chave-JSON por coleção (ADR-0002), camadas domain/data (ADR-0004), pub/sub notifier (ADR-0005),
monocromático sem cor nem sombra (ADR-0006), NativeTabs do scaffold com 4 abas texto-only (ADR-0003).
