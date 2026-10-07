# ADR-0001 — Stack: Expo SDK 57 + React Native + TypeScript

| Campo | Valor |
|---|---|
| **Status** | Aceito |
| **Data** | 2026-10-07 |
| **Contexto** | Restrição externa (disciplina) + estado atual do repositório |

## Contexto

A disciplina define o projeto-base React Native + Expo + TypeScript e o roteiro exige compatibilidade com
essa stack. O repositório já contém o scaffold Expo SDK 57 (`expo ~57.0.27`, `react-native 0.86.3`,
TypeScript `strict`, Expo Router, `react-native-screens`/`gesture-handler`), instalado com npm.

## Alternativas consideradas

- **RN CLI puro (sem Expo)** — rejeitada: violaria a exigência da disciplina e descartaria OTA/EAS/managed
  workflow.
- **Expo com JavaScript** — rejeitada: TypeScript é requisito do projeto-base e é o que sustenta RNF-03.
- **Outro SDK Expo (p.ex. 52)** — rejeitada: sem motivo para regressão; as regras do projeto mandam seguir a
  versão instalada e checar docs versionadas.

## Decisão

Manter **Expo SDK 57 + React Native + TypeScript** como stack fixa do Studia, com as versões presentes em
`package.json` como referência. Toda API Expo/RN é conferida na documentação versionada
(`docs.expo.dev/versions/v57.0.0/`) antes do uso — a stack é aceita, a *memória* sobre a stack não.

## Consequências

- Positivas: compatibilidade total com o requisito acadêmico; `strict` TS; caminho livre para EAS/OTA;
  typed routes habilitado.
- Negativas/risco: APIs do SDK 57 mudam rápido — exige a disciplina de verificação de docs a cada uso
  (`AGENTS.md`); Expo Go limita módulos nativos (relevante para ADR-002).

## Referências

`package.json`, `app.json`, `tsconfig.json` do repositório; `AGENTS.md` ("Expo changed"); roteiro item
"Tecnologias".
