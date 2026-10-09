# Questões em Aberto — Studia

| Campo | Valor |
|---|---|
| **Status** | Ativo (maioria resolvida em 2026-10-07) |
| **Finalidade** | Registrar decisões ainda não tomadas em vez de inventar respostas (Regra 9 do [`.clinerules`](../../.clinerules)) |

Cada questão tem: **identificador, pergunta, impacto e resolução**. Questões resolvidas permanecem aqui como
registro (nunca são apagadas).

## Decisão-mãe de escopo (2026-10-07)

> **O Studia é um MVP acadêmico autocontido.** Não existe fase pós-MVP, não existe ambição de produto ou
> startup. Toda ideia "pós-MVP" das propostas originais foi reclassificada como **fora do escopo
> (definitivamente)**. O que ainda existir depois do checklist da Etapa 6 do roteiro é a definição de
> "pronto".

## Decisão-mãe de design (2026-10-07)

> **Design minimalista monocromático, preto-e-branco e vice-versa** (claro/escuro automático — o scaffold
> já traz `userInterfaceStyle: automatic` e `theme.ts` preto/branco). Identificação de matéria **sem cor**:
> **monograma** (até 2 iniciais do nome, derivado, nunca armazenado). Hierarquia visual apenas por peso
> tipográfico, preenchimento, borda e espaço — **nunca por cor**. Sem shadows: profundidade por hairlines e
> superfícies tonais.

---

## Resolvidas

### OQ-02 — Escopo MVP e divisão de features

**Pergunta.** Os 9 RF, os 6 RNF, as 5 features e o escopo MVP propostos estão aprovados?

**Resolução (2026-10-07).** **Sim, aprovados como base** — com o corte explícito de fase pós-MVP.
Ajustes pontuais podem ser pedidos durante a escrita de cada slice; a base é esta.

### OQ-03 — Exclusão de matéria com registros vinculados

**Pergunta.** O que acontece ao excluir uma matéria que possui atividades ou avaliações?

**Resolução (2026-10-07).** **Opção A — bloquear** a exclusão com mensagem explicativa ("Esta matéria tem
3 atividades e 1 avaliação; exclua-os primeiro"). Sem cascata, sem órfãos. RF-03/CA-03.4 consolidado.

### OQ-04 — Notas e progresso acadêmico

**Pergunta.** O usuário deve registrar a nota obtida em uma avaliação? O que "progresso acadêmico" mede?

**Resolução (2026-10-07).** **Sem notas.** Progresso = atividades concluídas ÷ total (por matéria e geral).
A decisão de escopo (item acima) elimina as variantes B e C. Entidade `Assessment` não ganha campo `grade`.

### OQ-05 — Formato de persistência local

**Pergunta.** AsyncStorage (chave-JSON por coleção) ou SQLite (`expo-sqlite`)?

**Resolução (2026-10-07).** **AsyncStorage** — confirmado com a aprovação do escopo local autocontido.
SQLite é incompatível com Expo Go (exigiria development build na demonstração em sala) e o volume de dados
não justifica o custo. Registro em [ADR-0002](../adr/ADR-0002-estrategia-de-persistencia.md), agora Aceito.

### OQ-09 — Identidade visual

**Pergunta.** Paleta de cores, tipografia e a paleta de identificação de matéria.

**Resolução (2026-10-07).** **Monocromático estrito**, light/dark automático, tokens a partir do
`src/constants/theme.ts` do scaffold (estendido com borda, espaçamento, raio e escala tipográfica).
Identificação de matéria = **monograma**. Sem seletor de cor no formulário de matéria.

### OQ-10 — Nome do produto: Studia ou Studora?

**Resolução (2026-10-07).** **Studia.** `app.json` (name/slug/scheme) e capa do documento usam Studia.

### OQ-11 — Idioma da interface

**Resolução (2026-10-07).** **Português** (público e curso brasileiros). Mensagens de validação e textos de
estado definidos nas specs de execução.

### OQ-12 — Unicidade do nome de matéria

**Resolução (2026-10-07).** **Proibido duplicar** nome (comparação case-insensitive e com trim de espaços);
erro no formulário: "Já existe uma matéria com esse nome." No cadastro de **edição**, a comparação ignora a
própria matéria.

### OQ-13 — API externa no pós-MVP

**Resolução (2026-10-07).** **Descartada** pela decisão-mãe de escopo: não haverá back-end nem fase
pós-MVP. O app é 100% local — isso é característica, não limitação.

---

## Em aberto (não bloqueiam a implementação; bloqueiam a entrega formal)

### OQ-06 — Plataforma e dispositivo de verificação

**Pergunta.** Onde o app será verificado? Android físico? Emulador? Só Expo Go na demonstração?

**Impacto.** RNF-05 (verificação real) e o checklist da Etapa 6.

**Estado.** Em aberto — a implementação roda em Expo Go (Android prioritário); confirme como fará a
verificação final.

### OQ-07 — Dados da capa do documento de entrega

**Pergunta.** Instituição/disciplina/turma exatos, nomes da dupla, professor e data de entrega.

**Impacto.** Item 1 da Etapa 1 do roteiro (capa) e envio por e-mail.

**Estado.** **Resolvida (2026-10-09)** — integrantes: Pedro Miguel e Anna Cecilia; turma: 1; professor(a):
Isa Alexandre; data: 09/10/2026; repositório: `github.com/heyalmeida/studia-app`. Aplicados na capa de
`docs/entrega/Studia_Documentacao.pdf`.

### OQ-08 — Ferramenta e local do protótipo das telas

**Pergunta.** Figma / Canva / PowerPoint? Capturas das ≥5 telas serão versionadas em `docs/prototype/`?

**Impacto.** Item 5 da Etapa 1 exige protótipo de ao menos 5 telas no documento.

**Recomendação (sugestão).** Figma + capturas em `docs/prototype/`.

**Estado.** **Resolvida (2026-10-09)** — as 7 telas foram capturadas do app real no Expo Go (Android) e
versionadas em `docs/prototype/` (`t1-painel.jpeg` … `t7-form-avaliacao.jpeg`), embutidas no item 8 de
`docs/entrega/Studia_Documentacao.pdf`. Como o app excede o mínimo de telas, as capturas do produto
final substituem o protótipo pré-código.
