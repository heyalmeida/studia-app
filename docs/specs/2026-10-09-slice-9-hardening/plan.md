# Plano — Slice 9 (endurecimento / release candidate)

| Campo | Valor |
|---|---|
| **Spec** | ./spec.md |
| **Como executar** | prompt **P10** em [../../execution-prompts.md](../../execution-prompts.md) |
| **Risco (Regra 6)** | baixo — limpeza + verificação; nenhuma linha de produto muda |
| **Executor** | opencode (modelo pequeno), sessão própria |

## Decisões do planejador

1. **Remoção conservadora de deps**: só sai o que preenche os três critérios (sem import em `src/`,
   sem referência em `app.json`/plugins, não-peer obrigatório). `expo-doctor` é o árbitro.
   Candidatos mapeados pelo planejador (grep 2026-10-09): `expo-charts`, `expo-device`,
   `expo-glass-effect`, `expo-symbols` — o executor re-confirma antes de remover.
2. **Checklist físico é do dono**, não do executor: ele escreve o arquivo, o dono executa no
   Expo Go/Android e preenche. O executor não finge ter testado no aparelho.
3. **Cosmética permitida**: a varredura pode corrigir (final newline, import ordenado, texto PT
   remanescente) — mas qualquer correção que altere comportamento para e reporta.
4. Zero mudança de versão/tag — `1.0.0` fica; tag de release é decisão pós-checklist.
