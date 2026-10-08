# ADR-0009 — Identidade visual escura com cor de destaque

| Campo | Valor |
|---|---|
| **Status** | Aceito (decisão do dono do projeto, 2026-10-08) |
| **Data** | 2026-10-08 |
| **Substitui** | [ADR-0006](ADR-0006-identidade-visual-monocromatica.md) — identidade monocromática (preto-e-branco) |
| **Detalhe dos tokens** | [docs/design/visual-identity.md](../design/visual-identity.md) |
| **Spec da mudança** | [docs/specs/2026-10-08-visual-refresh](../specs/2026-10-08-visual-refresh/spec.md) |

## Contexto

O app foi construído com a identidade monocromática do [ADR-0006](ADR-0006-identidade-visual-monocromatica.md):
fundo preto/branco, zero cor saturada, hierarquia só por tipografia/borda/espaço e **nenhum** botão
flutuante. Em 2026-10-08 o dono do projeto pediu um redesign com direção **Linear/Things**: fundo
escuro profundo, superfícies em tom, **uma** cor de destaque (índigo), cores semânticas restritas,
cor por matéria escolhida em seletor de 8 tons e botão flutuante de criação.

Isso contraria três decisões vigentes: o monocromático estrito (ADR-0006 §1–2), a proibição de FAB e de
cor por matéria (`visual-identity.md` §4 e ADR-0006 §3) e o modelo de dados sem campo de cor
(`domain-model.md`). O dono confirmou explicitamente a substituição e o acréscimo do campo `color`.

## Alternativas consideradas

| Opção | Prós | Contras | Decisão |
|---|---|---|---|
| **Manter monocromático estrito** | assinatura forte, zero mudança de dados | Não entrega cor de destaque, semânticas, cor por matéria nem FAB — 4 itens do pedido | Rejeitada pelo dono |
| **Acento só na ação principal** (sem cor por matéria) | menos mudança de contrato | Matérias continuam sem identidade visual rápida; o seletor de cor foi pedido explicitamente | Rejeitada pelo dono |
| **Manter tema claro/escuro automático com a nova paleta** | respeita o `automatic` já configurado | Exige duplicar e manter duas paletas; o pedido descreve **uma** paleta (fundo `#0B0B0F`) | Rejeitada — o app passa a ser escuro único |
| **Escuro único com acento + cor por matéria + FAB** | entrega o pedido inteiro; hierarquia por tom + uma cor de destaque; 8 tons dão reconhecimento rápido por matéria | Muda o modelo de dados (`Subject.color`) e supersede o ADR-0006 | **Escolhida** |

## Decisão

1. **Tema único escuro:** `userInterfaceStyle: "dark"` e sem bloco `prefers-color-scheme`. Os tokens
   vivem em `src/constants/theme.ts` (fonte única), espelhados em `src/styles/global.css` (CSS
   variables do NativeWind) e em `tailwind.config.js`.
2. **Uma cor de destaque** (`#6366F1`) restrita a: ação principal (Salvar, FAB, botão do estado
   vazio), item ativo da tab bar, foco de input, chip selecionado e barra/anel de progresso.
3. **Semânticas restritas:** sucesso `#34D399`, alerta `#FBBF24`, urgente `#F87171` — usadas em
   prazo (hoje/amanhã = alerta; vencido = urgente), erro de campo e exclusão. **Sempre** combinadas
   com texto em linguagem natural, nunca cor sozinha (RNF-04).
4. **Cor por matéria:** campo `Subject.color` (`string | null`) validado contra uma paleta de 8 tons
   (`SUBJECT_COLORS`). É o único valor de cor persistido; a UI nunca recebe hex livre.
5. **FAB** (56 px, cor de destaque) como ação de criação nas telas de lista, acima da tab bar
   flutuante; as listas reservam `LIST_BOTTOM_INSET` para o conteúdo não ficar sob ele.
6. **Sem sombras** (RNF-01 mantido): profundidade por tom de superfície + hairline de 1 px.
7. **Sem biblioteca nova:** `Animated` do React Native para feedback de toque e transição de filtro;
   `lucide-react-native` para ícones. Tudo roda no Expo Go.
8. **Engrenagem de configurações não existe:** o `ScreenHeader` ganhou a anatomia correta (título +
   ações em linha), mas nenhuma ação de configurações foi adicionada — não há tela de settings no
   escopo aprovado (Regra 9.4).

## Consequências

- **Positivas:** o visual pedido (Linear/Things) está implementado e documentado em tokens; menos
  três cards redundantes no painel; listas legíveis por período; leitura de prazo por cor **e** texto;
  contrato de cor validado no domínio e normalizado na leitura do storage.
- **Negativas:** `Subject` ganhou um campo (migração de leitura obrigatória para registros antigos —
  coberta por `migrateSubjects`); o app deixa de ter tema claro; o protótipo do roteiro (Etapa 1,
  item 5) deve ser desenhado no visual escuro com acento.
- **Vinculante:** nenhuma tela usa literal de cor fora dos três arquivos de token (Regra 4.10);
  estados continuam com rótulo textual; a cor por matéria só entra por `SUBJECT_COLORS`.

## Referências

Decisão do dono do projeto (2026-10-08); [ADR-0006](ADR-0006-identidade-visual-monocromatica.md)
(marcado como substituído); [ADR-0007](ADR-0007-estilo-nativewind.md) (NativeWind, mantido);
[RNF-01](../requirements/non-functional-requirements.md) e RNF-05 (contraste e safe areas);
[spec do refactor](../specs/2026-10-08-visual-refresh/spec.md).