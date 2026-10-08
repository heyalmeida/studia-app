# Spec da Feature — UI Kit e identidade visual escura com destaque

| Campo | Valor |
|---|---|
| **ID** | `ui-kit` |
| **Status** | Implementada (2026-10-08) |
| **RF/RNF atendidos** | RNF-01, RNF-02, RNF-03, RNF-05 (e a camada de apresentação de RF-01…RF-09) |
| **Depende de** | subjects, activities, assessments, dashboard |
| **ADRs pertinentes** | [ADR-0009](../../adr/ADR-0009-identidade-visual-escura-com-destaque.md) (substitui ADR-0006), [ADR-0010](../../adr/ADR-0010-estilo-stylesheet-expo-go.md) (substitui ADR-0007), [ADR-0008](../../adr/ADR-0008-estrutura-roteiro.md) |
| **Data** | 2026-10-08 |
| **Spec de execução** | [docs/specs/2026-10-08-visual-refresh](../../specs/2026-10-08-visual-refresh/spec.md), [docs/specs/2026-10-08-expo-go-layout](../../specs/2026-10-08-expo-go-layout/spec.md) |

## 1. Qual problema resolve

O app era legível, mas a camada visual não comunicava priorização: engrenagem sobrepondo o botão de
criação no header, três cards redundantes no painel, placeholder quase invisível, prazo comunicado só por
borda/formatação e nenhuma ação de criação visível nas listas. A feature entrega **uma identidade e um kit
únicos** — fundo escuro profundo, uma cor de destaque e cores semânticas com rótulo textual — aplicados
em todas as 7 telas, sem tocar na lógica de domínio nem nos repositórios.

## 2. Quem utiliza

Qualquer estudante em sessão curta no celular: abre o app para ver o que vence, marca uma atividade como
concluída e cadastra matéria/atividade/avaliação. O cadastro rápido é a ação mais repetida, por isso a
FAB e os atalhos de data.

## 3. Telas e rotas impactadas

| Tela (screens-and-navigation) | Rota Expo Router | Mudança |
|---|---|---|
| T1 Painel | `(tabs)/index.tsx` | 4 blocos novos (saudação+data, progresso, próximos prazos, próxima avaliação) |
| T2 Matérias | `(tabs)/subjects.tsx` | cards com ícone tingido + barra na cor da matéria; FAB |
| T3 Atividades | `(tabs)/activities.tsx` | controle segmentado, agrupamento por período, item novo |
| T4 Avaliações | `(tabs)/assessments.tsx` | cards com bloco de data; FAB |
| T5 Form. Matéria | `subject-form.tsx` | grade de ícones + seletor de cor; rodapé fixo |
| T6 Form. Atividade | `activity-form.tsx` | chips coloridos, tipo com ícone, campo de data com atalhos |
| T7 Form. Avaliação | `assessment-form.tsx` | mesmo padrão de T6, sem tipo/descrição |
| — | `(tabs)/_layout.tsx` | tab bar flutuante na identidade nova |

## 4. Comportamento esperado

O app abre no painel: greeting com a data, anel de progresso com "X de Y concluídas" e quantas vencem na
semana; abaixo, as 3 próximas atividades com chip de prazo e a próxima avaliação (se houver). Cada lista
tem um único header com o título e uma FAB para criar. Criar matéria: nome, professor, carga horária,
ícone em grade de 6 colunas e cor entre 8 bolinhas — o mesmo tom aparece no card e nas listas. Salvar é o
único botão com cor de destaque; excluir é texto vermelho com confirmação. Atividades abrem em um
segmented control e são agrupadas por período; o prazo é escolhido tocando o campo (calendário) ou por
atalho de 1 toque.

## 5. Regras de negócio

| # | Regra | Origem |
|---|---|---|
| RN-1 | `Subject.color` só aceita um dos 8 tons de `SUBJECT_COLORS`; qualquer outro valor é erro de campo | RF-01, ADR-0009 |
| RN-2 | Valor de cor fora da paleta lido do storage vira `null` (nunca hex arbitrário na UI) | RNF-04, RNF-06 |
| RN-3 | Cor não substitui texto: prazo sempre rotulado ("hoje", "em 12 dias", "atrasada 3 dias") | RNF-01, RNF-04 |
| RN-4 | Alvo de toque ≥ 44×44 e feedback de escala/opacidade em todo pressable | RNF-01 |
| RN-5 | Sem `shadow*`/`elevation`: profundidade por tom de superfície + hairline. **Exceção única:** o FAB usa `elevation: 6` preto, por ser sobreposto ao conteúdo | RNF-01, ADR-0010 §3 |
| RN-6 | Nenhum literal de cor fora de `constants/theme.ts`, `styles/global.css` e `tailwind.config.js` | ADR-0010 §2, Regra 4.10 |
| RN-7 | Nenhum componente escreve `className`: o estilo vem de `StyleSheet` com valores de `constants/theme.ts` | ADR-0010 §1 |

## 6. Estados

- **Vazio:** ícone lucide 40 px + título + uma frase de apoio + botão primário (listas e painel).
- **Carregando:** `ListSkeleton` com cards na mesma superfície da lista; FAB oculta.
- **Erro:** `EmptyState` com "Deu errado" + mensagem sem texto técnico + "Tentar de novo"; FAB oculta.
- **Sucesso:** retorno da tela anterior com os dados recompostos pelo notifier (ADR-0005).

## 7. Formulários e validações

| Campo | Obrigatório | Validação | Mensagem de erro |
|---|---|---|---|
| Matéria · nome | sim | ≥2 caracteres, único (case-insensitive) | "Informe o nome da matéria." |
| Matéria · professor(a) | não | ≤80 caracteres | — |
| Matéria · carga horária | não | 1–200 | "Informe uma carga horária entre 1 e 200 horas." |
| Matéria · cor | não | pertencente à paleta de 8 | "Escolha uma cor da paleta." |
| Atividade · título | sim | obrigatório, ≤120 | "Informe um título." |
| Atividade · matéria | sim | deve existir | "Selecione uma matéria." |
| Atividade · prazo | não | data real | "Data inválida. Use o formato DD/MM/AAAA." |
| Avaliação · título | sim | obrigatório | "Informe o título da avaliação." |
| Avaliação · data | sim | data real | "Informe a data. Use o formato DD/MM/AAAA." |

## 8. Impacto em dados

- Lidos: `subjects` (novo campo `color`), `activities`, `assessments`.
- Escritos: `subjects.color` (novo). As demais escritas não mudaram.
- Agregados derivados afetados: nenhum (progresso, ordenação e contagens intactos).
- Chaves de storage: `studia.subjects` (migração de leitura em `migrateSubjects`); as outras intactas.

## 9. Impacto na UI

- **UI kit (`src/components/ui/`):** `Touchable`, `ScreenHeader`, `Card`, `Chip`, `ChoiceChip`, `Input`,
  `PrimaryButton`, `TextButton`, `SegmentedControl` (+`FadeIn`), `EmptyState`, `FAB`, `IconTile`,
  `IconPicker`, `ColorPicker`, `DateField`, `DatePicker`, `DateBlock`, `DueChip`, `ProgressRing`,
  `ProgressBar`, `SubjectChip`, `FormField`, `FormFooter`, `ListItem`, `Divider`, `ListSkeleton`.
  Removidos (sem consumidor): `Button`, `Badge`, `DashCard`, `LineChart`, `Monogram`, `DonutChart`,
  `DateInput`, `SegmentedFilter`, `DueSoonCard`, `NextAssessmentRow`, `SubjectProgressRow`, `SectionLabel`.
- **Componentes por tela:** `DashboardPage/{Greeting,ProgressSummaryCard,UpcomingList,NextAssessmentCard}`,
  `SubjectsPage/SubjectCard`, `ActivitiesPage/{ActivityRow,ActivitySectionList,activity-groups}`,
  `AssessmentsPage/AssessmentCard`.
- **Hooks:** `use-dashboard` passou a expor `summary.upcoming` e `summary.dueThisWeek` (removeu
  `weeklyCompleted`, `dueSoon`, `pendingTotal` e `subjectProgress`, sem consumidor); `use-subjects`
  grava `color`.

## 10. Critérios de aceitação

| # | Critério | Verificação |
|---|---|---|
| AC-V.1 | Nenhum hex fora dos 3 arquivos de token | busca textual |
| AC-V.2 | As 7 telas usam o mesmo header, cards/listas, estado vazio e tokens | inspeção por tela |
| AC-V.3 | Header sem sobreposição; FAB acima da tab bar sem cobrir conteúdo | manual (Expo Go) |
| AC-V.4 | Feedback de toque e transição de filtro | manual |
| AC-V.5 | Tab bar: ativo em destaque com label, inativos em `#6B6B76` | manual |
| AC-V.6 | Campo ≥52, placeholder visível, foco em destaque | manual |
| AC-V.7 | Matéria salva com cor; registro antigo sem `color` abre sem erro | manual + roteiro de persistência |
| AC-V.8 | Atividades agrupadas Atrasadas → Hoje → Esta semana → Depois | manual |
| AC-V.9 | Picker abre ao tocar e atalhos funcionam | manual |
| AC-V.10 | `npx tsc --noEmit`, `npx expo lint` e export web limpos | automático (executado) |
| AC-V.11 | Nenhum `className` em `src/` — layout correto no Expo Go | automático (busca textual) + manual |

## 11. Casos de erro

| Caso | Comportamento |
|---|---|
| JSON de `subjects` com `color` inválido | normalizado para `null` na leitura; a matéria abre sem cor, sem crash |
| Matéria antiga sem `color`/`icon`/`hour` | migrada na leitura (`migrateSubjects`) |
| Excluir matéria com filhos | bloqueio existente, mensagem exibida no rodapé do formulário |
| Falha de leitura do storage | `EmptyState` "Deu errado" + "Tentar de novo" |

## 12. Fora de escopo desta spec

Tema claro (o app é escuro único), tela de configurações/engrenagem (não existe no escopo), animação de
gráfico no painel (gráfico de linha removido), cores por atividade, upload de imagem como ícone.

## 13. Registro de mudanças

| Data | Mudança | Justificativa |
|---|---|---|
| 2026-10-08 | Feature implementada: identidade escura com destaque, cor por matéria, FAB, kit de 26 componentes | Pedido do dono (2026-10-08); substitui o ADR-0006 pelo ADR-0009 |
| 2026-10-08 | Kit migrado de `className` para `StyleSheet`; ação "+ Nova …" (`CreateButton`), rodapé dos formulários com Salvar/Cancelar/Excluir, `ScreenHeader` com voltar e `createAction`, insets inferiores por tela | No Expo Go o `className` do NativeWind não é aplicado e todo o espaçamento colapsava; decisão registrada no ADR-0010, que substitui o ADR-0007 |