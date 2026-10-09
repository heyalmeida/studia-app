# Checklist do aparelho — Studia (release candidate)

| Campo | Valor |
|---|---|
| **Data** | 2026-10-09 |
| **Spec** | [./spec.md](./spec.md) (Slice 9 — Endurecimento e release candidate) |
| **Onde** | Aparelho físico com **Expo Go** (SDK 57) |
| **Responsável** | dono do projeto |
| **Cobertura** | Etapa 6 do roteiro + Slices 6, 7 e 8 |

> Este checklist **não foi executado pelo agente**: exige aparelho físico. Os itens abaixo
> consolidados os pendentes de validação manual espalhados pelos `tasks.md` dos slices. Cada item
> cita o critério de aceitação (CA/AC) de origem para rastreabilidade.
>
> **Como usar:** abra o app no Expo Go, siga a linha e marque a coluna **Resultado** com
> `ok` / `falha` / `n/a`. Itens marcados aqui **não** devem ser repetidos em checklists futuros.

## Como preparar

1. Instale o Expo Go no aparelho (versão compatível com SDK 57).
2. No projeto, `npx expo start` e leia o QR code com o Expo Go (ou digite a URL no campo de link).
3. Antes de começar, **cadastre ao menos 2 matérias** (ex.: "Cálculo I" e "História") — os itens
   de filtro e lembrete dependem disso. Deixe uma delas **sem cor** e **sem ícone** para o item de
   registro legado.

## Bloco A — Etapa 6 do roteiro (abertura, navegação, formulários, persistência)

| # | Item | Instruções | Origem | Resultado |
|---|---|---|---|---|
| A1 | App abre sem erro | Abra o Studia. Nenhuma tela vermelha, nenhum erro no console/log do Expo Go. | Etapa 6 | ☐ |
| A2 | As 4 abas existem | Painel, Matérias, Atividades, Avaliações — todas acessíveis pela barra inferior. | Etapa 6 | ☐ |
| A3 | Aba → formulário → voltar | Em cada aba com lista, toque no botão de criação **ao lado do título**, preencha e salve; depois volte pelo botão voltar/cancelar. O app deve voltar para a aba, sem tela presa. | Etapa 6 | ☐ |
| A4 | Matéria: nome vazio | No formulário de matéria, salve sem digitar nome. Deve aparecer: **"Informe o nome da matéria."** | Etapa 6 / CA-01.1 | ☐ |
| A5 | Matéria: nome duplicado | Cadastre "Cálculo I", depois crie outra matéria também chamada "cálculo i" (minúsculas). Deve aparecer: **"Já existe uma matéria com esse nome."** | Etapa 6 / CA-01.1 | ☐ |
| A6 | Matéria: nome curto | Digite 1 letra (ex.: "A"). Deve aparecer: **"O nome precisa ter pelo menos 2 caracteres."** | Etapa 6 / CA-01.1 | ☐ |
| A7 | Atividade: título vazio | No formulário de atividade, salve sem título. Deve aparecer: **"Informe um título."** | Etapa 6 / CA-04.1 | ☐ |
| A8 | Avaliação: título vazio | No formulário de avaliação, salve sem título. Deve aparecer: **"Informe o título da avaliação."** | Etapa 6 / CA-08.1 | ☐ |
| A9 | Avaliação: data vazia | No formulário de avaliação, salve sem escolher data. Deve aparecer: **"Informe a data. Use o formato DD/MM/AAAA."** (a data da avaliação é obrigatória). | Etapa 6 / CA-08.2 | ☐ |
| A10 | Atividade: data inválida | Na atividade, preencha o prazo como "99/99/9999". Deve aparecer: **"Data inválida. Use o formato DD/MM/AAAA."** | Etapa 6 / CA-04.2 | ☐ |
| A11 | Atividade: data passada (aviso, não bloqueio) | Escolha uma data **ontem**. Deve aparecer o aviso "Esta data está no passado." e mesmo assim **salvar** (aviso não-bloqueante). | Etapa 6 / CA-04.3 | ☐ |
| A12 | Persistência sobrevive ao reinício | Feche **totalmente** o app (swipe para longe / encerrar processo) e reabra no Expo Go. Matérias, atividades e avaliações continuam lá, com os mesmos dados. | Etapa 6 / RNF-06 | ☐ |
| A13 | Legibilidade no escuro | Observe as telas: fundo escuro, textos com contraste suficiente, nenhum texto cortado em tela estreita (gire o aparelho se possível). | Etapa 6 / RNF-01 | ☐ |
| A14 | Exclusão de matéria com filhos | Tente excluir uma matéria que já tem atividade/avaliação. A exclusão deve ser **bloqueada** pedindo para excluir os filhos primeiro. | Etapa 6 / RF-03 | ☐ |

## Bloco B — Slice 6 (carga horária, ícone, calendário, painel)

| # | Item | Instruções | Origem | Resultado |
|---|---|---|---|---|
| B1 | Carga horária válida | Cadastre uma matéria com carga horária **60**. Deve salvar sem erro. | CA-6.1 | ☐ |
| B2 | Carga horária inválida (0) | Na mesma matéria, troque para **0**. Deve aparecer: **"Informe uma carga horária entre 1 e 200 horas."** | CA-6.1 | ☐ |
| B3 | Carga horária inválida (250) | Troque para **250**. Deve aparecer a mesma mensagem de erro acima. | CA-6.1 | ☐ |
| B4 | Ícone aparece no card | Escolha um ícone no grade e salve. O ícone escolhido deve aparecer no card da matéria na lista. | CA-6.3 | ☐ |
| B5 | Ícone aparece nos formulários | O ícone salvo deve aparecer também no seletor de matéria dentro do formulário de **atividade** e de **avaliação**. | CA-6.3 | ☐ |
| B6 | Calendário abre/fecha/seleciona — atividade | No formulário de atividade, toque no campo de prazo: o calendário abre. Selecione uma data: ele fecha e o campo mostra a data em DD/MM/AAAA. | CA-6.4 | ☐ |
| B7 | Calendário abre/fecha/seleciona — avaliação | Repita o mesmo passo no formulário de avaliação (campo Data). | CA-6.4 | ☐ |
| B8 | Painel com dados reais | Com várias atividades concluídas e pendentes e várias avaliações, abra o Painel: deve mostrar o **anel de progresso**, a contagem "X de Y concluídas", as **barras por matéria** na cor da matéria, a lista de próximos prazos e a próxima avaliação. | CA-6.4 | ☐ |

## Bloco C — Slice 7 (busca e filtro por matéria)

> Pré-requisito: as 2 matérias do "Como preparar" existem.

| # | Item | Instruções | Origem | Resultado |
|---|---|---|---|---|
| C1 | Busca sem acento | Em Atividades, digite **`calculo`** na busca. Deve encontrar a atividade cujo título contém "Cálculo". | AC-7.1 | ☐ |
| C2 | Busca por avaliação | Em Avaliações, digite `calculo` e confirme que a avaliação de Cálculo aparece. | AC-7.3 | ☐ |
| C3 | Busca por matéria (nome/professor) | Em Matérias, digite parte do **nome** ou do **professor**. Deve filtrar a lista de matérias. | AC-7.4 | ☐ |
| C4 | Limpar busca (botão X) | Com texto no campo, toque no **X** à direita. O campo deve esvaziar e a lista completa reaparecer. | AC-7.1 | ☐ |
| C5 | Chip de matéria filtra | Em Atividades, toque no chip de uma matéria (ex.: "História"). A lista deve reduzir só às atividades daquela matéria. O chip ativo fica com destaque. | AC-7.2 | ☐ |
| C6 | Filtro combinado | Com o chip "História" ativo, **e** digitando um termo da busca, **e** no status "Pendentes": a lista deve mostrar só o que satisfaz os três ao mesmo tempo. | AC-7.2 | ☐ |
| C7 | Chip "Todas" | Toque no chip "Todas": o filtro de matéria é removido e a lista volta ao todo. | AC-7.2 |
| C8 | Estado "Nenhum resultado" | Combine filtros até a lista ficar vazia. Deve aparecer "Nenhum resultado" com a ação **"Limpar filtros"** — que, ao ser tocada, restaura a lista completa (e volta o status para Pendentes). | AC-7.5 |
| C9 | Vazio real mantém CTA de criação | Em uma lista **sem nenhum registro** (apague tudo daquela aba ou use uma matéria nova), o estado vazio deve manter o botão de **criar** (não "Limpar filtros"). | AC-7.5 / AC-7.6 |
| C10 | Ordenação preservada | Com um filtro ativo (ex.: chip "Cálculo"), a ordem da lista deve ser a mesma de antes do filtro (pendentes por prazo ascendente primeiro). O filtro não embaralha. | AC-7.2 |

## Bloco D — Slice 8 (lembrete local de prazo)

> ⚠️ Requer permitir notificações. Para testar o disparo, **adiante o relógio do aparelho** para o
> dia anterior ao prazo às 07:55 e observe às 08:00. Desfaça o ajuste ao terminar.

| # | Item | Instruções | Origem | Resultado |
|---|---|---|---|---|
| D1 | Switch "Lembrar" ligado pede permissão | Em Atividades, crie uma atividade com prazo **amanhã** e ligue o switch "Lembrar" (o switch só habilita quando há prazo). Ao salvar, o sistema deve **pedir permissão de notificação** na primeira vez. | CA-8.1 | ☐ |
| D2 | Notificação chega às 08:00 | Com o relógio em 07:55 do dia anterior, aguarde. Deve aparecer uma notificação com título **"Lembrete"** e corpo **`Amanhã: <título da atividade>`**. | CA-8.2 | ☐ |
| D3 | Concluir cancela | Abra a mesma atividade e marque como **concluída**. A notificação **não deve chegar** na hora marcada. | CA-8.3 | ☐ |
| D4 | Excluir cancela | Exclua uma atividade que tinha lembrete ligado. A notificação **não deve chegar**. | CA-8.3 | ☐ |
| D5 | Trocar a data reagenda | Edite a atividade, mantenha "Lembrar" ligado e mude o prazo para outro dia. Na hora antiga **não** deve chegar nada; na nova, deve chegar **só uma** notificação. | CA-8.4 | ☐ |
| D6 | Lembrete em avaliação | Repita o fluxo na aba **Avaliações**: switch "Lembrar" sob o campo Data, sempre habilitado (a data é obrigatória). Notificação "Amanhã: <título>". | CA-8.2 | ☐ |
| D7 | Sem prazo = switch inativo | No formulário de **atividade**, sem preencher prazo, o switch "Lembrar" deve estar **desabilitado/esmaecido**. | CA-8.2 | ☐ |
| D8 | Dados antigos abrem sem erro | Abra uma atividade/avaliação criada **antes** do Slice 8 (sem os campos novos), edite e salve. Deve abrir e salvar **sem erro**. | CA-8.5 | ☐ |
| D9 | Sem internet (offline) | Com o aparelho em modo avião, o app deve funcionar por completo (criar, listar, filtrar). O lembrete é **local** e não depende de rede. | RNF-03 | ☐ |

## Bloco E — Encerramento

| # | Item | Instruções | Origem | Resultado |
|---|---|---|---|---|
| E1 | Sem crash no caminho completo | Percorra o app inteiro (Painel → Matérias → Atividades → Avaliações → 3 formulários → editar → excluir → filtrar) e confirme que **nada quebra** nem trava. | CA-9.5 | ☐ |
| E2 | Sem erros vermelhos no console | Ao final, confira o log do Metro/Expo Go: nenhum erro vermelho não tratado. | CA-9.1 | ☐ |

## Resumo

| Bloco | Itens | Origem |
|---|---|---|
| A — Etapa 6 | 14 | roteiro + CA-01.1, CA-04.1–04.3, CA-08.1–08.2, RNF-01, RNF-06 |
| B — Slice 6 | 8 | CA-6.1, CA-6.3, CA-6.4 |
| C — Slice 7 | 10 | AC-7.1–7.6 |
| D — Slice 8 | 9 | CA-8.1–8.5, RNF-03 |
| E — Encerramento | 2 | CA-9.1, CA-9.5 |
| **Total** | **43** | |