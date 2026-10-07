# Studia 📚

Aplicativo mobile de **organização de estudos**: matérias, atividades com prazo, avaliações e o progresso
de tudo — em um único lugar, **offline por padrão**.

Projeto Final da disciplina *Desenvolvimento de Sistemas para Dispositivos Móveis* (UEM/Cept) e projeto de
portfólio conduzido com **Spec-Driven Development**: a documentação em [`docs/`](./docs/README.md) é a
fonte de verdade; o código a implementa.

## O que o app faz (resumo)

- Cadastra e organiza **matérias**;
- Registra **atividades** por matéria, com prazo, conclusão e filtros;
- Acompanha **avaliações/provas** por data;
- Mostra no **painel inicial** o que vence primeiro, o que falta e o progresso geral.

Requisitos completos: [`docs/requirements/`](./docs/requirements/functional-requirements.md) ·
Telas e fluxo: [`docs/architecture/screens-and-navigation.md`](./docs/architecture/screens-and-navigation.md) ·
Modelo de dados: [`docs/architecture/domain-model.md`](./docs/architecture/domain-model.md).

## Stack

[Expo](https://expo.dev) SDK 57 · React Native 0.86 · TypeScript (strict) · Expo Router · AsyncStorage.
Decisões registradas em [`docs/adr/`](./docs/adr/README.md).

## Executando

```bash
npm install
npx expo start
```

Abra no dispositivo com o app **Expo Go** (QR do terminal) — no MVP, todas as dependências rodam no Expo Go
sem development build.

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

## Estrutura do repositório

```
docs/            # fonte de verdade: product brief, requisitos, specs, features, ADRs, arquitetura
src/
├── app/         # telas (Expo Router — file-based)
├── components/  # UI reutilizável
├── hooks/       # hooks de dados
├── domain/      # entidades, regras e validações puras
├── data/        # persistência (repositórios sobre AsyncStorage)
└── constants/   # tokens de tema
assets/          # imagens/ícones
```

Regras de desenvolvimento (humanos e IA): [`.clinerules`](./.clinerules) e [`AGENTS.md`](./AGENTS.md).

## Status

**Etapa 1 — Planejamento e documentação.** Nenhum código de produto implementado; specs de feature ainda
não escritas. Questões em aberto: [`docs/requirements/open-questions.md`](./docs/requirements/open-questions.md).

---

*Projeto em dupla — integrantes, turma e professor: [OQ-07](./docs/requirements/open-questions.md).*
