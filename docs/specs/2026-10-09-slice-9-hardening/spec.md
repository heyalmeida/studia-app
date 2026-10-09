# Spec — Slice 9: Endurecimento e release candidate

| Campo | Valor |
|---|---|
| **Data** | 2026-10-09 |
| **Feature** | `release` (transversal — não cria funcionalidade) |
| **RF/RNF** | RNF-01 (identidade), RNF-03 (offline), RNF-04 (defesa), RNF-05 (alvos/safe area); prepara a Etapa 6 do roteiro |
| **ADRs** | 0008 (estrutura), 0009 (identidade/Expo Go), 0010 (StyleSheet) |
| **Risco** | baixo — verificação estática + limpeza de dependências; zero feature nova |

## Objetivo

Fechar o app para entrega acadêmica: as três extensões (slices 6/7/8) entraram rápido e acumulam
pendências — dependências órfãs no `package.json`, conformidade estática nunca re-verificada em
conjunto, e checklist manual de aparelho espalhado em três `tasks.md`. Este slice converte o estado
atual em **release candidate** verificável.

## Trabalho

1. **Limpeza de dependências órfãs** — candidatos (verificados por grep em `src/`, `app.json` e
   configs: `expo-charts`, `expo-device`, `expo-glass-effect`, `expo-symbols`). Remover só o que
   `expo-doctor`/`npm ls` confirmar não ser peer de outra lib. Depois: gates.
2. **Varredura de conformidade** (padrão P6, atualizada para ADR-0009/0010): zero `className` em
   `src/`; hex fora de `theme.ts`+espelhos; sombra só no FAB; `AsyncStorage` só em `storage.ts`;
   `expo-notifications` só em `services/reminders.ts`; zero `: any`/`@ts-ignore`; `function.*Screen`
   zero em `src/screens`; rotas-finas de 1 linha; textos PT-BR.
3. **Checklist unificado de aparelho** — consolidar em `docs/specs/2026-10-09-slice-9-hardening/checklist-aparelho.md`
   todos os itens manuais pendentes (CA-6.1/6.3/6.4, AC-7.1/7.2/7.5, CA-8.1–8.5, Etapa 6 do roteiro),
   em PT-BR, com coluna de resultado — o dono executa no Expo Go e marca.
4. **Sync de docs** — README raiz: seção 'O que o app faz' com filtros/lembretes/gráficos;
   CHANGELOG: entrada `### Fixed/Removed — limpeza` quando removidas libs.

## Critérios de aceitação

- **CA-9.1** `npx expo-doctor` sem erro; nenhuma dependência em `package.json` sem import em `src/`
  (exceto peers de expo/expo-router confirmados por doctor).
- **CA-9.2** Varredura de conformidade limpa (relatório item a item).
- **CA-9.3** Gates: `tsc --noEmit`, `expo lint`, `expo export --platform web` limpos.
- **CA-9.4** `checklist-aparelho.md` cobre os 3 slices + Etapa 6; sem duplicar itens já marcados.
- **CA-9.5** Nenhum comportamento de produto muda — diff é só `package.json`/`package-lock.json`,
  configs, docs e correções cosméticas apontadas pela varredura.

## Fora de escopo

Feature nova, redesign, migração de dados, tag/versão (decisão do dono após o checklist).
